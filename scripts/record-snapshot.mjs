// Daily snapshot of the CoinAtlas top 200. Run by .github/workflows/record-snapshot.yml.
//
// Writes under data/:
//   snapshots/YYYY-MM-DD.json  the full list of that day: symbol, name, price, market cap
//   dominance.json             one line per day: [BTC %, ETH %, total market cap, coins, source]
//   new.json                   coins that entered the top 200 less than 14 snapshots ago
//   history/btc-eth.json       every daily close of BTC and ETH since 2017 (Binance)
//   history/fear-greed.json    every daily Fear & Greed value since 2018 (alternative.me)
// The two history files are the page's backup for when those sources are unreachable. Days already
// stored are never dropped: each run only adds to them or corrects them.
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

const dayOf = t => new Date(t).toISOString().slice(0, 10);
async function klines(pair, get) {
  const out = {};
  for (let start = 0; ;) {
    const rows = await get("https://data-api.binance.vision/api/v3/klines?symbol=" + pair + "&interval=1d&startTime=" + start + "&limit=1000");
    rows.forEach(r => { out[dayOf(r[0])] = +r[4]; });
    if (rows.length < 1000) return out;
    start = rows[rows.length - 1][0] + 1;
  }
}
function merge(name, source, fresh) { /* fresh: { "YYYY-MM-DD": row values } */
  const dir = join(DATA, "history"), file = join(dir, name); mkdirSync(dir, { recursive: true });
  const all = {};
  if (existsSync(file)) JSON.parse(readFileSync(file, "utf8")).days.forEach(d => { all[d[0]] = d.slice(1); });
  Object.keys(fresh).forEach(k => { all[k] = fresh[k]; });
  const keys = Object.keys(all).sort();
  writeFileSync(file, JSON.stringify({ updated: DAY, source }).slice(0, -1) + ',"days":[\n' + keys.map(k => JSON.stringify([k].concat(all[k]))).join(",\n") + "\n]}\n");
  return keys.length;
}
export async function recordHistory(get = getJson) { /* each source on its own: one failing must not block the other, and neither blocks the snapshot */
  const out = {};
  try {
    const [b, e] = [await klines("BTCUSDT", get), await klines("ETHUSDT", get)], rows = {};
    Object.keys(b).forEach(k => { if (b[k] > 0 && e[k] > 0) rows[k] = [b[k], e[k]]; });
    if (Object.keys(rows).length < 30) throw new Error("too few days");
    out.ratio = merge("btc-eth.json", "Binance daily closes, BTCUSDT and ETHUSDT", rows);
  } catch (e) { console.log("BTC|ETH history not updated:", e.message); }
  try {
    const j = await get("https://api.alternative.me/fng/?limit=0"), rows = {};
    j.data.forEach(d => { const v = parseInt(d.value, 10); if (v >= 0) rows[dayOf(d.timestamp * 1000)] = [v]; });
    if (Object.keys(rows).length < 30) throw new Error("too few days");
    out.fg = merge("fear-greed.json", "alternative.me Fear & Greed Index", rows);
    out.fgToday = rows[DAY] ? rows[DAY][0] : null;
  } catch (e) { console.log("Fear & Greed history not updated:", e.message); }
  return out;
}

export function build(found) {
  const coins = found.coins.map(c => [String(c[0]).toUpperCase(), String(c[1]), +c[2] || 0, +c[3] || 0]).sort((a, b) => b[3] - a[3]).slice(0, 200);
  const total = coins.reduce((s, c) => s + c[3], 0), cap = s => (coins.find(c => c[0] === s) || [])[3] || 0;
  if (coins.length < 150 || !(cap("BTC") > 0) || !(cap("ETH") > 0)) throw new Error("incomplete list: " + coins.length + " coins");
  return { date: DAY, taken: new Date().toISOString(), source: found.source, total: Math.round(total), btc: +(cap("BTC") / total * 100).toFixed(3), eth: +(cap("ETH") / total * 100).toFixed(3), ratio: +(coins.find(c => c[0] === "BTC")[2] / coins.find(c => c[0] === "ETH")[2]).toFixed(4), coins };
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
  const hist = await recordHistory(), snap = build(found);
  if (hist.fgToday != null) snap.fg = hist.fgToday;
  const out = write(snap);
  console.log("history: BTC|ETH", hist.ratio || "unchanged", "days · Fear & Greed", hist.fg || "unchanged", "days");
  console.log(snap.date, "·", snap.source, "·", snap.coins.length, "coins · BTC", snap.btc + "% · ETH", snap.eth + "% ·", out.days, "days recorded · new:", Object.keys(out.fresh).join(" ") || "none");
}
