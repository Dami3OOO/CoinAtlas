"""Finds out what people were looking up right before Bitcoin's big moves, without choosing any term in advance.

Events (from data/history/btc-eth.json):
  - every day Bitcoin closed 10% or more up or down (days less than 8 days apart count as one event, dated by the first)
  - the high and the low of every year
  - dates added by hand in EXTRA below
For each event the 7 days before it and the day itself are examined in two sources:
  - Wikipedia: the 1000 most viewed articles of each day. An article counts as "risen" when its best day in that
    window had at least 3 times the views of its normal day in the four weeks before.
  - Google Trends: the "rising" searches around the word bitcoin and in the Finance category for that window.
    Google has no official interface and may refuse; events it refused are tried again on the next run.
The result is written to data/trends/discovery.json. Nothing is judged bullish or bearish here.
"""
import json, os, random, statistics, sys, time, urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "trends" / "discovery.json"
EXTRA = [("2024-11-06", "asked: the week Bitcoin searches exploded before the run to 100,000"), ("2026-01-20", "asked: days before the fall from 89,000 to 62,000")]
SKIP = ("Main_Page", "Special:", "Wikipedia:", "Portal:", "File:", "Help:", "Category:", "Talk:", "User:", "Template:", "-", "Cookie_", "wiki.phtml")
GOOGLE_PER_RUN = int(os.environ.get("DISCOVER_GOOGLE_PER_RUN", "10"))
UA = {"User-Agent": "CoinAtlasTrends/1.0 (scheduled GitHub job; reads public pageview statistics)"}


def events():
    days = json.loads((ROOT / "data" / "history" / "btc-eth.json").read_text())["days"]
    out, last = [], None
    for i in range(1, len(days)):
        ch = days[i][1] / days[i - 1][1] - 1
        if abs(ch) < 0.10:
            continue
        d = date.fromisoformat(days[i][0])
        if last and (d - last).days < 8:
            last = d
            continue
        out.append({"date": days[i][0], "kind": "up10" if ch > 0 else "down10", "note": f"Bitcoin {ch * 100:+.1f}% that day"})
        last = d
    by = {}
    for d, b, _ in days:
        o = by.setdefault(d[:4], {"hi": (d, b), "lo": (d, b), "n": 0})
        o["n"] += 1
        if b > o["hi"][1]: o["hi"] = (d, b)
        if b < o["lo"][1]: o["lo"] = (d, b)
    for y, o in by.items():
        if o["n"] < 120:
            continue
        out.append({"date": o["hi"][0], "kind": "high", "note": f"Bitcoin's high of {y}"})
        out.append({"date": o["lo"][0], "kind": "low", "note": f"Bitcoin's low of {y}"})
    for d, note in EXTRA:
        out.append({"date": d, "kind": "asked", "note": note})
    seen, uniq = set(), []
    for e in sorted(out, key=lambda x: x["date"]):
        if (e["date"], e["kind"]) not in seen:
            seen.add((e["date"], e["kind"])); uniq.append(e)
    return uniq


_cache = {}
def wiki_day(d):
    """{article: views} for the 1000 most viewed English Wikipedia articles of one day, or None."""
    if d in _cache:
        return _cache[d]
    url = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/{d.year}/{d.month:02d}/{d.day:02d}"
    res = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                arts = json.loads(r.read())["items"][0]["articles"]
            res = {a["article"]: a["views"] for a in arts if not a["article"].startswith(SKIP)}
            break
        except Exception as e:
            if "404" in str(e):
                break
            time.sleep(2 * (attempt + 1))
    _cache[d] = res
    time.sleep(0.05)
    return res


def wiki_risers(day):
    d0 = date.fromisoformat(day)
    window = [x for x in (wiki_day(d0 - timedelta(days=k)) for k in range(0, 8)) if x]
    base = [x for x in (wiki_day(d0 - timedelta(days=k)) for k in range(9, 37, 3)) if x]
    if len(window) < 4 or len(base) < 5:
        return None
    floor = statistics.median(min(b.values()) for b in base)  # roughly what it takes to be in the top 1000 at all
    best = {}
    for k, w in enumerate(window):
        for art, v in w.items():
            if v > best.get(art, (0, 0))[0]:
                best[art] = (v, k)
    out = []
    for art, (v, k) in best.items():
        seen = [b[art] for b in base if art in b]
        normal = statistics.median(seen) if len(seen) >= len(base) / 2 else floor
        if v >= 3 * normal and v >= 15000:
            out.append([art.replace("_", " "), round(v / normal, 1), v, k])
    out.sort(key=lambda x: -x[1])
    return out[:40]


def google_rising(py, day):
    d0 = date.fromisoformat(day)
    tf = f"{(d0 - timedelta(days=7)).isoformat()} {d0.isoformat()}"
    res = {}
    for label, kw, cat in (("bitcoin", "bitcoin", 0), ("finance", "", 7)):
        py.build_payload([kw], cat=cat, timeframe=tf)
        rq = py.related_queries().get(kw, {}) or {}
        rising = rq.get("rising")
        res[label] = [] if rising is None else [[str(r["query"]), int(r["value"])] for _, r in rising.head(25).iterrows()]
        time.sleep(random.uniform(7, 12) if not os.environ.get("TRENDS_NO_WAIT") else 0)
    return res


def main():
    old = json.loads(OUT.read_text()) if OUT.exists() else {"events": []}
    prev = {(e["date"], e["kind"]): e for e in old.get("events", [])}
    evs = events()
    for e in evs:
        p = prev.get((e["date"], e["kind"]), {})
        e["wiki"] = p.get("wiki")
        e["google"] = p.get("google")
        if e["wiki"] is None and date.fromisoformat(e["date"]) >= date(2015, 8, 15):
            e["wiki"] = wiki_risers(e["date"])
    wiki_ok = sum(1 for e in evs if e["wiki"])
    done = 0
    todo = [e for e in evs if e["google"] is None][:GOOGLE_PER_RUN]
    if todo:
        try:
            from pytrends.request import TrendReq
            py = TrendReq(hl="en-US", tz=0, timeout=(10, 30))
            for e in todo:
                try:
                    e["google"] = google_rising(py, e["date"]); done += 1
                except Exception as ex:
                    print(f"Google refused at {e['date']}: {ex}")
                    break
        except Exception as ex:
            print("Google Trends could not be reached:", ex)
    # what came up again and again: articles that rose before several events of the same kind
    rec = {}
    for kind in ("up10", "down10", "high", "low"):
        cnt = {}
        for e in evs:
            if e["kind"] == kind and e["wiki"]:
                for a in e["wiki"]:
                    cnt[a[0]] = cnt.get(a[0], 0) + 1
        rec[kind] = sorted([[a, c] for a, c in cnt.items() if c >= 2], key=lambda x: -x[1])[:60]
    data = {"updated": date.today().isoformat(), "sources": "Wikipedia pageviews (official), Google Trends rising searches (unofficial)", "events": evs, "recurring": rec}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":"), ensure_ascii=False) + "\n")
    g_ok = sum(1 for e in evs if e["google"] is not None)
    print(f"{len(evs)} events · Wikipedia found for {wiki_ok} · Google found for {g_ok} ({done} this run, {len(evs) - g_ok} still open)")


if __name__ == "__main__":
    main()
