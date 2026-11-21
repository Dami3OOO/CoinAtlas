// Asset tags for the coins of the latest snapshot (the top 300), from CoinGecko's categories, into data/tags.json.
// The site's own hand-made lists stay first: a fetched tag is only used for a coin that has no hand-made tag yet,
// so a coin that climbs from place 205 to 195 shows up with a tag right away.
// One request per CoinGecko category (about 20), so it also works without a key. With a free demo key (secret COINGECKO_KEY) it is faster.
// Runs after the snapshot in .github/workflows/record-snapshot.yml; a failure here never stops the snapshot.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = process.env.SNAPSHOT_DIR || join(ROOT, "data");
const KEY = process.env.COINGECKO_KEY || "", BASE = "https://api.coingecko.com/api/v3/", WAIT = KEY ? 2200 : 13000;

/* CoinGecko category -> CoinAtlas tag */
export const MAP = [
  ["meme-token", "meme"], ["privacy-coins", "privacy"], ["real-world-assets-rwa", "rwa"], ["exchange-based-tokens", "exchange"],
  ["gambling", "gambling"], ["entertainment", "entertainment"], ["fan-token", "entertainment"], ["gaming", "gaming"],
  ["artificial-intelligence", "ai"], ["decentralized-finance-defi", "defi"], ["decentralized-exchange", "defi"], ["liquid-staking-tokens", "defi"],
  ["infrastructure", "infra"], ["depin", "infra"], ["oracle", "infra"], ["storage", "infra"], ["payment-solutions", "payment"],
  ["layer-2", "layer2"], ["layer-1", "layer1"], ["stablecoins", "stable"]
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function cg(path) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(BASE + path, { headers: KEY ? { "x-cg-demo-api-key": KEY, accept: "application/json" } : { accept: "application/json" }, signal: AbortSignal.timeout(30000) }).catch(e => ({ ok: false, status: e.message }));
    if (r.ok) return r.json();
    if (r.status === 429 || r.status >= 500 || typeof r.status === "string") { await sleep(30000 * (i + 1)); continue; }
    throw new Error("HTTP " + r.status + " for " + path);
  }
  throw new Error("CoinGecko did not answer for " + path);
}

function latestCoins() {
  const dir = join(DATA, "snapshots"), f = readdirSync(dir).filter(x => /^\d{4}-\d{2}-\d{2}\.json$/.test(x)).sort().pop();
  const s = JSON.parse(readFileSync(join(dir, f), "utf8"));
  return { date: s.date || f.slice(0, 10), coins: s.coins.map(c => ({ sym: String(c[0]).toUpperCase(), name: String(c[1] || "").trim().toLowerCase(), price: +c[2] })) };
}

/* list: [{sym, name}] from the snapshot; got: { tag: [CoinGecko coins] }. A coin matches by name, or by symbol when it is a big coin (the same symbol is used by many small ones) */
export function build(list, got) {
  const tags = {};
  for (const [, tag] of MAP) for (const g of got[tag] || []) {
    const sym = String(g.symbol).toUpperCase(), nm = String(g.name || "").trim().toLowerCase();
    const c = list.find(x => x.sym === sym && (x.name === nm || (g.market_cap_rank && g.market_cap_rank <= 400)));
    if (!c) continue;
    if (tag === "stable" && !(c.price > 0.85 && c.price < 1.35)) continue; /* only coins pegged near a dollar, euro or franc */
    const t = tags[c.sym] || (tags[c.sym] = []); if (t.indexOf(tag) < 0) t.push(tag);
  }
  return tags;
}

async function main() {
  const { date, coins } = latestCoins(), got = {}, failed = [];
  for (const [cat, tag] of MAP) {
    try { (got[tag] = got[tag] || []).push(...await cg("coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&category=" + cat)); }
    catch (e) { failed.push(cat); console.log("Category " + cat + " skipped:", e.message); }
    await sleep(WAIT);
  }
  if (failed.length === MAP.length) throw new Error("no category could be read");
  const tags = build(coins, got), file = join(DATA, "tags.json");
  const keys = Object.keys(tags).sort();
  writeFileSync(file, JSON.stringify({ updated: date, source: "CoinGecko categories", coins: coins.length, failed }).slice(0, -1) + ',"tags":{\n' + keys.map(k => JSON.stringify(k) + ":" + JSON.stringify(tags[k])).join(",\n") + "\n}}\n");
  console.log("Tags for " + keys.length + " of " + coins.length + " coins" + (failed.length ? ", categories skipped: " + failed.join(", ") : ""));
}

if (import.meta.url === "file://" + process.argv[1]) main().catch(e => { console.log("Tags not recorded:", e.message); process.exit(1); });
