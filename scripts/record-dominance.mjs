// Records today's BTC and ETH share of the top-200 market cap into data/dominance.json.
// Run by .github/workflows/record-dominance.yml. One entry per UTC day: "YYYY-MM-DD": [btc %, eth %, total market cap in USD].
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../data/dominance.json", import.meta.url);
const GECKO = process.env.DOM_GECKO_URL || "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1";
const PAPRIKA = process.env.DOM_PAPRIKA_URL || "https://api.coinpaprika.com/v1/tickers";

async function getJson(url) {
  const r = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error("HTTP " + r.status + " from " + new URL(url).hostname);
  return r.json();
}
const fromGecko = async () => (await getJson(GECKO)).map(c => ({ sym: String(c.symbol).toUpperCase(), cap: +c.market_cap || 0 }));
const fromPaprika = async () => (await getJson(PAPRIKA)).map(c => ({ sym: String(c.symbol).toUpperCase(), cap: +(c.quotes?.USD?.market_cap) || 0 }));

function shares(list) {
  const top = list.filter(c => c.cap > 0).sort((a, b) => b.cap - a.cap).slice(0, 200);
  const total = top.reduce((s, c) => s + c.cap, 0), cap = s => (top.find(c => c.sym === s) || {}).cap || 0;
  const btc = cap("BTC"), eth = cap("ETH");
  if (top.length < 150 || !(btc > 0) || !(eth > 0)) throw new Error("incomplete list: " + top.length + " coins");
  return [+(btc / total * 100).toFixed(3), +(eth / total * 100).toFixed(3), Math.round(total)];
}

async function snapshot() {
  let last;
  for (const [name, src] of [["CoinGecko", fromGecko], ["CoinPaprika", fromPaprika]]) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try { const s = shares(await src()); console.log("source:", name); return s; }
      catch (e) { last = e; console.log(name, "attempt", attempt + 1, "failed:", e.message); await new Promise(r => setTimeout(r, 15000 * (attempt + 1) * (process.env.DOM_FAST ? 0 : 1))); }
    }
  }
  throw last;
}

const day = new Date().toISOString().slice(0, 10);
const data = JSON.parse(readFileSync(FILE, "utf8") || "{}");
data[day] = await snapshot();
const keys = Object.keys(data).sort();
writeFileSync(FILE, "{\n" + keys.map(k => JSON.stringify(k) + ": " + JSON.stringify(data[k])).join(",\n") + "\n}\n");
console.log(day, data[day], "·", keys.length, "days recorded");
