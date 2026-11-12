// Daily snapshot of the CoinAtlas top 200. Run by .github/workflows/record-snapshot.yml.
//
// Writes three things under data/:
//   snapshots/YYYY-MM-DD.json  the full list of that day: symbol, name, price, market cap
//   dominance.json             one line per day: [BTC %, ETH %, total market cap, coins, source]
//   new.json                   coins that entered the top 200 less than 14 snapshots ago
//
// The list comes from the page itself: index.html is opened in a headless browser and its own
// top 200 is read out, so the snapshot always matches what the site shows. If the page cannot
// build a list, CoinGecko's or CoinPaprika's top 200 is stored instead and marked as such.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = process.env.SNAPSHOT_DIR || join(ROOT, "data");
const DAY = process.env.SNAPSHOT_DATE || new Date().toISOString().slice(0, 10);
const NEW_WINDOW = 14;

export async function pageList(prepare) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    if (prepare) await prepare(page);
    await page.goto(pathToFileURL(join(ROOT, "index.html")).href);
    const h = await page.waitForFunction(() => (window.coinAtlasList && window.coinAtlasList.coins.length >= 150 ? window.coinAtlasList : null), null, { timeout: 120000 });
    const list = await h.jsonValue();
    return { source: "CoinAtlas · " + list.label, coins: list.coins };
  } finally { await browser.close(); }
}

async function getJson(url) {
  const r = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error("HTTP " + r.status + " from " + new URL(url).hostname);
  return r.json();
}
async function apiList() {
  const sources = [
    ["CoinGecko top 200", async () => (await getJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1")).map(c => [String(c.symbol).toUpperCase(), c.name, c.current_price, c.market_cap])],
    ["CoinPaprika top 200", async () => (await getJson("https://api.coinpaprika.com/v1/tickers")).map(c => [String(c.symbol).toUpperCase(), c.name, c.quotes?.USD?.price, c.quotes?.USD?.market_cap])]
  ];
  let last;
  for (const [source, get] of sources) for (let attempt = 0; attempt < 3; attempt++) {
    try { return { source, coins: await get() }; }
    catch (e) { last = e; console.log(source, "attempt", attempt + 1, "failed:", e.message); await new Promise(r => setTimeout(r, 15000 * (attempt + 1))); }
  }
  throw last;
}

export function build(found) {
  const coins = found.coins.map(c => [String(c[0]).toUpperCase(), String(c[1]), +c[2] || 0, +c[3] || 0]).sort((a, b) => b[3] - a[3]).slice(0, 200);
  const total = coins.reduce((s, c) => s + c[3], 0), cap = s => (coins.find(c => c[0] === s) || [])[3] || 0;
  if (coins.length < 150 || !(cap("BTC") > 0) || !(cap("ETH") > 0)) throw new Error("incomplete list: " + coins.length + " coins");
  return { date: DAY, taken: new Date().toISOString(), source: found.source, total: Math.round(total), btc: +(cap("BTC") / total * 100).toFixed(3), eth: +(cap("ETH") / total * 100).toFixed(3), coins };
}

export function write(snap) {
  const dir = join(DATA, "snapshots"); mkdirSync(dir, { recursive: true });
  const { coins, ...head } = snap;
  writeFileSync(join(dir, snap.date + ".json"), JSON.stringify(head).slice(0, -1) + ',"coins":[\n' + coins.map(c => JSON.stringify(c)).join(",\n") + "\n]}\n");

  const domFile = join(DATA, "dominance.json"), dom = existsSync(domFile) ? JSON.parse(readFileSync(domFile, "utf8") || "{}") : {};
  dom[snap.date] = [snap.btc, snap.eth, snap.total, coins.length, snap.source];
  writeFileSync(domFile, "{\n" + Object.keys(dom).sort().map(k => JSON.stringify(k) + ": " + JSON.stringify(dom[k])).join(",\n") + "\n}\n");

  // new in the top 200: how many snapshots in a row, counted back from today, a coin has been on the list
  const days = readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().slice(-NEW_WINDOW).reverse();
  const sets = days.map(f => new Set(JSON.parse(readFileSync(join(dir, f), "utf8")).coins.map(c => c[0])));
  const ready = sets.length >= NEW_WINDOW, fresh = {};
  if (ready) for (const sym of sets[0]) { let n = 0; while (n < sets.length && sets[n].has(sym)) n++; if (n < NEW_WINDOW) fresh[sym] = n; }
  writeFileSync(join(DATA, "new.json"), JSON.stringify({ updated: snap.date, snapshots: readdirSync(dir).length, window: NEW_WINDOW, ready, coins: fresh }, null, 1) + "\n");
  return { days: Object.keys(dom).length, fresh };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let found;
  try { found = await pageList(); }
  catch (e) { console.log("CoinAtlas list not available (" + e.message.split("\n")[0] + "), using a public top 200 instead"); found = await apiList(); }
  const snap = build(found), out = write(snap);
  console.log(snap.date, "·", snap.source, "·", snap.coins.length, "coins · BTC", snap.btc + "% · ETH", snap.eth + "% ·", out.days, "days recorded · new:", Object.keys(out.fresh).join(" ") || "none");
}
