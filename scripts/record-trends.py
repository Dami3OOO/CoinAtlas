"""Records weekly Google Trends history for the terms in scripts/trends-terms.json into data/trends/trends.json.

Run by .github/workflows/record-trends.yml. Google has no official interface for Trends and slows down repeated
requests, so each run only fetches a few terms (the ones never fetched, then the oldest), pauses between requests,
and stops quietly when Google refuses. What is already stored is never lost.

Weekly values only come in windows of under five years, so each term is fetched in overlapping windows since
November 2017 and joined at the overlaps. The joined series is scaled so that its highest week is 100.
"""
import json, os, random, sys, time
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "trends" / "trends.json"
TERMS = json.loads((ROOT / "scripts" / "trends-terms.json").read_text())
PER_RUN = int(os.environ.get("TRENDS_PER_RUN", "12"))
START = date(2017, 11, 5)


def windows(today):
    """Overlapping windows of about 4.5 years, 26 weeks of overlap."""
    out, a = [], START
    while True:
        b = min(a + timedelta(weeks=234), today)
        out.append((a, b))
        if b >= today:
            return out
        a = b - timedelta(weeks=26)


def join(parts):
    """parts: list of {week: value}. Later windows are scaled to match the earlier one over the shared weeks."""
    series = dict(parts[0])
    for nxt in parts[1:]:
        shared = [w for w in nxt if w in series]
        a = sum(series[w] for w in shared)
        b = sum(nxt[w] for w in shared)
        k = a / b if a > 0 and b > 0 else 1.0
        for w, v in nxt.items():
            if w not in series:
                series[w] = v * k
    top = max(series.values()) if series else 0
    return {w: round(v / top * 100, 1) if top else 0 for w, v in series.items()}


def fetch(py, term, today):
    parts = []
    for a, b in windows(today):
        py.build_payload([term], timeframe=f"{a.isoformat()} {b.isoformat()}")
        df = py.interest_over_time()
        if df is None or df.empty:
            raise RuntimeError("empty answer")
        parts.append({ix.date().isoformat(): float(v) for ix, v in df[term].items()})
        time.sleep(random.uniform(6, 11) if not os.environ.get("TRENDS_NO_WAIT") else 0)
    return join(parts)


def main():
    data = json.loads(OUT.read_text()) if OUT.exists() else {"terms": {}}
    data.setdefault("terms", {})
    want = [(t, g) for g in ("raw", "bull", "bear") for t in TERMS.get(g, [])]
    for t in list(data["terms"]):  # a term removed from the list is dropped from the file
        if t not in dict(want):
            del data["terms"][t]
    order = sorted(want, key=lambda x: data["terms"].get(x[0], {}).get("fetched", ""))[:PER_RUN]
    today, done = date.today(), 0
    try:
        from pytrends.request import TrendReq
        py = TrendReq(hl="en-US", tz=0, timeout=(10, 30))
        for term, group in order:
            try:
                series = fetch(py, term, today)
            except Exception as e:  # most often HTTP 429: Google wants a break
                print(f"stopped at '{term}': {e}")
                break
            weeks = sorted(series)
            first, vals, d = date.fromisoformat(weeks[0]), [], date.fromisoformat(weeks[0])
            while d <= date.fromisoformat(weeks[-1]):  # one value per week from the first week on; a missing week repeats the one before
                vals.append(series.get(d.isoformat(), vals[-1] if vals else 0))
                d += timedelta(weeks=1)
            data["terms"][term] = {"group": group, "fetched": today.isoformat(), "from": first.isoformat(), "v": vals}
            done += 1
            print(f"fetched '{term}': {len(vals)} weeks")
    except Exception as e:
        print("Google Trends could not be reached:", e)
    for t, g in want:  # keep the group of stored terms in step with the list
        if t in data["terms"]:
            data["terms"][t]["group"] = g
    if done:
        data["updated"] = today.isoformat()
    data["source"] = "Google Trends, weekly search interest worldwide, each term scaled to its own highest week = 100"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":")) + "\n")
    print(f"{done} of {len(order)} terms fetched this run, {len(data['terms'])} of {len(want)} stored in total")


if __name__ == "__main__":
    main()
