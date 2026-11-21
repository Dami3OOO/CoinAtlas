// Fills TOTAL200, BTC.D, ETH.D and USDT.D (data/dominance.json) for the year before CoinAtlas started recording on 12 Nov 2026.
// CoinGecko gives the daily market cap of every coin for the last 365 days for free; each day that passes, the oldest day drops out
// of that window, which is why this is done once, now. Days that CoinAtlas recorded itself are never touched.
//   - which coins: today's CoinGecko top 500, minus wrapped, staked and bridged copies (like the site's list)
//   - each day: the 200 largest of them by that day's market cap, added up
// Coins that were in the top 200 back then but are below 500 today are missing, so old totals can be a little low; the source of
// those days says so. Runs on demand: .github/workflows/backfill-total200.yml. With a free CoinGecko demo key (secret COINGECKO_KEY)
// it is faster; without one it waits between requests to stay inside the public limit.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = process.env.SNAPSHOT_DIR || join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const KEY = process.env.COINGECKO_KEY || "", BASE = "https://api.coingecko.com/api/v3/", WAIT = KEY ? 2200 : 13000;
const DERIV = /\b(wrapped|staked|restaked|bridged|tokenized|liquid staking|binance-peg|bridged)\b/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function cg(path, tries = 5) {
  for (let i = 0; ; i++) {
    const r = await fetch(BASE + path, { headers: KEY ? { "x-cg-demo-api-key": KEY, accept: "application/json" } : { accept: "application/json" }, signal: AbortSignal.timeout(30000) }).catch(e => ({ ok: false, status: e.message }));
    if (r.ok) return r.json();
    if (i >= tries) throw new Error("CoinGecko " + r.status + " for " + path);
    await sleep(r.status === 429 ? 65000 : 15000); /* too many requests: wait a minute */
  }
}
export function totals(series, firstOwn) { /* series: { id: { sym, caps: { day: cap } } } -> { day: [btc %, eth %, total, coins, source, usdt %] } before firstOwn */
  const days = {}, out = {};
  Object.values(series).forEach(s => Object.keys(s.caps).forEach(d => { if (d < firstOwn) (days[d] = days[d] || []).push([s.sym, s.caps[d]]); }));
  Object.keys(days).sort().forEach(d => {
    const top = days[d].filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 200); if (top.length < 150) return;
    const tot = top.reduce((a, x) => a + x[1], 0), cap = s => (top.find(x => x[0] === s) || [0, 0])[1];
    if (!cap("BTC") || !cap("ETH")) return;
    out[d] = [+(cap("BTC") / tot * 100).toFixed(3), +(cap("ETH") / tot * 100).toFixed(3), Math.round(tot), top.length, "CoinGecko backfill (today's top 500)", +(cap("USDT") / tot * 100).toFixed(3)];
  });
  return out;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const domFile = join(DATA, "dominance.json"), dom = existsSync(domFile) ? JSON.parse(readFileSync(domFile, "utf8")) : {};
  const firstOwn = Object.keys(dom).filter(k => !/backfill/.test(dom[k][4])).sort()[0] || new Date().toISOString().slice(0, 10);
  const list = (await cg("coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1")).concat(await cg("coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2"));
  const seenSym = {}, coins = list.filter(c => { const s = String(c.symbol).toUpperCase(); if (DERIV.test(c.name) || seenSym[s]) return false; seenSym[s] = 1; return true; });
  console.log("coins:", coins.length, "· recording before", firstOwn, "· one request every", WAIT / 1000, "s");
  const series = {};
  for (const [i, c] of coins.entries()) {
    try {
      const j = await cg("coins/" + c.id + "/market_chart?vs_currency=usd&days=365&interval=daily"), caps = {};
      (j.market_caps || []).forEach(([t, v]) => { if (v > 0) caps[new Date(t).toISOString().slice(0, 10)] = v; });
      series[c.id] = { sym: String(c.symbol).toUpperCase(), caps };
    } catch (e) { console.log("skipped", c.id, e.message); }
    if (i % 25 === 0) console.log(i + 1, "/", coins.length);
    await sleep(WAIT);
  }
  const add = totals(series, firstOwn); let n = 0;
  Object.keys(add).forEach(d => { if (!dom[d] || /backfill/.test(dom[d][4])) { dom[d] = add[d]; n++; } }); /* own recordings are never replaced */
  writeFileSync(domFile, "{\n" + Object.keys(dom).sort().map(k => JSON.stringify(k) + ": " + JSON.stringify(dom[k])).join(",\n") + "\n}\n");
  console.log("filled", n, "days before", firstOwn);
}
