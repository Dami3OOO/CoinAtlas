// The "Today" chart of every coin of the snapshot (the Top 200) for the New York day that just ended, in 15-minute steps,
// into data/intraday/YYYY-MM-DD.json. Time Travel shows these as the day's chart. Binance first, Bitget if Binance has no pair.
// Runs after the snapshot in .github/workflows/record-snapshot.yml; a failure never stops the snapshot.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { snapshotDay } from "./snapshot-time.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = process.env.SNAPSHOT_DIR || join(ROOT, "data");
const STEP = 15 * 60000, N = 96, TOP = 200;

export function nyMidnight(day) { /* the UTC moment New York's day begins (EST or EDT) */
  const [y, m, d] = day.split("-").map(Number);
  for (const h of [5, 4]) { const t = Date.UTC(y, m - 1, d, h); const hh = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hourCycle: "h23" }).format(new Date(t)); if (+hh === 0) return t; }
  return Date.UTC(y, m - 1, d, 5);
}
const sig = v => +(+v).toPrecision(6);
async function getJson(url) { const r = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(15000) }); if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }
async function binance(sym, start) {
  const k = await getJson("https://data-api.binance.vision/api/v3/klines?symbol=" + sym + "USDT&interval=15m&startTime=" + start + "&endTime=" + (start + N * STEP - 1) + "&limit=" + N);
  return Array.isArray(k) && k.length > 40 ? k.map(x => [+x[0], sig(x[4])]) : null;
}
async function bitget(sym, start) {
  const j = await getJson("https://api.bitget.com/api/v2/spot/market/candles?symbol=" + sym + "USDT&granularity=15min&startTime=" + start + "&endTime=" + (start + N * STEP) + "&limit=100");
  const k = j && j.data; return Array.isArray(k) && k.length > 40 ? k.map(x => [+x[0], sig(x[4])]).sort((a, b) => a[0] - b[0]) : null;
}
export function toSteps(rows, start) { /* closes on the fixed 15-minute grid; a missing step keeps the close before it */
  const out = []; let i = 0, last = null;
  for (let s = 0; s < N; s++) { const t = start + s * STEP; while (i < rows.length && rows[i][0] <= t) last = rows[i++][1]; out.push(last); }
  const f = out.find(v => v != null); return out.map(v => (v == null ? f : v));
}

async function main() {
  const day = process.env.INTRADAY_DAY || snapshotDay(), file = join(DATA, "snapshots", day + ".json");
  if (!existsSync(file)) throw new Error("no snapshot for " + day);
  const snap = JSON.parse(readFileSync(file, "utf8")), start = nyMidnight(day), coins = {}, src = {};
  for (const c of snap.coins.slice(0, TOP)) {
    const S = String(c[0]).toUpperCase(); if (!/^[A-Z0-9]{1,15}$/.test(S)) continue;
    let rows = null, from = "";
    try { rows = await binance(S, start); from = "binance"; } catch { rows = null; }
    if (!rows) { try { rows = await bitget(S, start); from = "bitget"; } catch { rows = null; } }
    if (rows) { coins[S] = toSteps(rows, start); src[from] = (src[from] || 0) + 1; }
    await new Promise(r => setTimeout(r, 120));
  }
  const dir = join(DATA, "intraday"); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, day + ".json"), JSON.stringify({ date: day, start, step: STEP, sources: src }).slice(0, -1) + ',"coins":{\n' + Object.keys(coins).map(k => JSON.stringify(k) + ":" + JSON.stringify(coins[k])).join(",\n") + "\n}}\n");
  console.log("Intraday charts for " + Object.keys(coins).length + " of " + Math.min(TOP, snap.coins.length) + " coins (" + JSON.stringify(src) + ")");
}
if (import.meta.url === "file://" + process.argv[1]) main().catch(e => { console.log("Intraday not recorded:", e.message); process.exit(1); });
