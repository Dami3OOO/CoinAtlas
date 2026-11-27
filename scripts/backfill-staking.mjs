// Fills data/staking-history.json backwards with DefiLlama's daily history of every pool CoinAtlas uses (Liquid Staking, Lending).
// Native staking rates come from the networks' own sources, which only tell today's rate: those days stay empty.
// Recorded days are never replaced. Start day: first argument (default 2026-11-12, when CoinAtlas began recording).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PROVIDERS } from "./record-staking.mjs";
const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data"), START = process.argv[2] || "2026-11-12", MAX_APY = 30; /* the same limit as record-staking */
const get = async url => { const r = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(60000) }); if (!r.ok) throw new Error("HTTP " + r.status + " for " + url); return r.json(); };
const pools = (await get("https://yields.llama.fi/pools")).data, file = join(DATA, "staking-history.json");
const hist = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {}, today = new Date().toISOString().slice(0, 10);
let added = 0;
for (const sym of Object.keys(PROVIDERS)) for (const p of PROVIDERS[sym]) {
  if (!p.pools) continue;
  const m = pools.filter(x => p.pools.project.indexOf(x.project) > -1 && String(x.symbol).toUpperCase() === p.pools.symbol && x.chain === p.pools.chain && x.apyBase > 0 && x.apyBase < MAX_APY).sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))[0];
  if (!m) { console.log("no pool: " + sym + " " + p.name); continue; }
  let rows; try { rows = (await get("https://yields.llama.fi/chart/" + m.pool)).data || []; } catch (e) { console.log(sym + " " + p.name + ": " + e.message); continue; }
  for (const r of rows) {
    const d = String(r.timestamp).slice(0, 10), v = +r.apyBase;
    if (d < START || d >= today || !(v > 0 && v < MAX_APY)) continue;
    const day = hist[d] = hist[d] || {}; if (day[sym] && day[sym][p.name] != null) continue; /* a recorded rate stays */
    (day[sym] = day[sym] || {})[p.name] = +v.toFixed(2); added++;
  }
  await new Promise(r => setTimeout(r, 400)); /* gently */
}
writeFileSync(file, "{\n" + Object.keys(hist).sort().map(k => JSON.stringify(k) + ": " + JSON.stringify(hist[k])).join(",\n") + "\n}\n");
console.log("Staking history: " + added + " rates added from " + START + ", " + Object.keys(hist).length + " days in total");
