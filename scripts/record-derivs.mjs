// Records the derivatives market of BTC and ETH once a day into data/derivatives.json: open interest, funding rate and, where an
// exchange publishes it, the long/short ratio of its accounts. Nothing on the site uses it yet; it is recorded because most exchanges
// only give the last 30 days of this history for free, so a year of it can only exist if it is written down every day.
// Every exchange is asked on its own: one that does not answer (some refuse servers in the US, where GitHub runs) never blocks the others.
//   { "YYYY-MM-DD": { "okx": { "BTC": { "oi": coins, "oiUsd": dollars, "funding": rate per period, "ls": long/short ratio }, "ETH": {...} }, ... } }
// Run: node scripts/record-derivs.mjs (the day is the same New York day as the snapshot)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { snapshotDay } from "./snapshot-time.mjs";

const FILE = join(process.env.SNAPSHOT_DIR || join(dirname(fileURLToPath(import.meta.url)), "..", "data"), "derivatives.json");
const num = v => (v === null || v === undefined || v === "" || !isFinite(+v)) ? null : +v;
async function getJson(url, opt = {}) {
  const r = await fetch(url, { ...opt, headers: { accept: "application/json", "content-type": "application/json", ...(opt.headers || {}) }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}
const clean = o => { Object.keys(o).forEach(k => { if (o[k] === null) delete o[k]; }); return o; };

export const SOURCES = {
  async binance(get) {
    const one = async (c) => {
      const s = c + "USDT", oi = await get("https://fapi.binance.com/fapi/v1/openInterest?symbol=" + s), pi = await get("https://fapi.binance.com/fapi/v1/premiumIndex?symbol=" + s);
      const ls = await get("https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=" + s + "&period=1d&limit=1").catch(() => null);
      const px = num(pi.markPrice), o = num(oi.openInterest);
      return clean({ oi: o, oiUsd: o != null && px ? Math.round(o * px) : null, funding: num(pi.lastFundingRate), ls: ls && ls[0] ? num(ls[0].longShortRatio) : null });
    };
    return { BTC: await one("BTC"), ETH: await one("ETH") };
  },
  async bybit(get) {
    const one = async (c) => {
      const t = (await get("https://api.bybit.com/v5/market/tickers?category=linear&symbol=" + c + "USDT")).result.list[0];
      const r = await get("https://api.bybit.com/v5/market/account-ratio?category=linear&symbol=" + c + "USDT&period=1d&limit=1").catch(() => null), x = r && r.result && r.result.list && r.result.list[0];
      return clean({ oi: num(t.openInterest), oiUsd: num(t.openInterestValue) != null ? Math.round(+t.openInterestValue) : null, funding: num(t.fundingRate), ls: x && +x.sellRatio > 0 ? +(x.buyRatio / x.sellRatio).toFixed(4) : null });
    };
    return { BTC: await one("BTC"), ETH: await one("ETH") };
  },
  async okx(get) {
    const one = async (c) => {
      const id = c + "-USDT-SWAP", oi = (await get("https://www.okx.com/api/v5/public/open-interest?instId=" + id)).data[0], f = (await get("https://www.okx.com/api/v5/public/funding-rate?instId=" + id)).data[0];
      const ls = await get("https://www.okx.com/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=" + c + "&period=1D").catch(() => null);
      return clean({ oi: num(oi.oiCcy), oiUsd: num(oi.oiUsd) != null ? Math.round(+oi.oiUsd) : null, funding: num(f.fundingRate), ls: ls && ls.data && ls.data[0] ? num(ls.data[0][1]) : null });
    };
    return { BTC: await one("BTC"), ETH: await one("ETH") };
  },
  async bitget(get) {
    const one = async (c) => {
      const s = c + "USDT", q = "&productType=USDT-FUTURES", oi = (await get("https://api.bitget.com/api/v2/mix/market/open-interest?symbol=" + s + q)).data, f = (await get("https://api.bitget.com/api/v2/mix/market/current-fund-rate?symbol=" + s + q)).data;
      const t = (await get("https://api.bitget.com/api/v2/mix/market/ticker?symbol=" + s + q).catch(() => ({ data: [] }))).data[0] || {};
      const o = num(oi && oi.openInterestList && oi.openInterestList[0] && oi.openInterestList[0].size), px = num(t.markPrice || t.lastPr);
      return clean({ oi: o, oiUsd: o != null && px ? Math.round(o * px) : null, funding: num(f && f[0] && f[0].fundingRate) });
    };
    return { BTC: await one("BTC"), ETH: await one("ETH") };
  },
  async hyperliquid(get) {
    const r = await get("https://api.hyperliquid.xyz/info", { method: "POST", body: JSON.stringify({ type: "metaAndAssetCtxs" }) }), out = {};
    r[0].universe.forEach((u, i) => { if (u.name !== "BTC" && u.name !== "ETH") return; const x = r[1][i], o = num(x.openInterest), px = num(x.markPx); out[u.name] = clean({ oi: o, oiUsd: o != null && px ? Math.round(o * px) : null, funding: num(x.funding) }); });
    if (!out.BTC || !out.ETH) throw new Error("BTC or ETH missing");
    return out;
  },
  async deribit(get) {
    const one = async (c) => { const x = (await get("https://www.deribit.com/api/v2/public/get_book_summary_by_instrument?instrument_name=" + c + "-PERPETUAL")).result[0]; return clean({ oiUsd: num(x.open_interest) != null ? Math.round(x.open_interest) : null, funding: num(x.funding_8h) }); };
    return { BTC: await one("BTC"), ETH: await one("ETH") };
  }
};
/* Binance keeps 30 days of daily open interest and long/short ratio: days not recorded yet are filled from it (marked "hist") */
async function binanceHistory(get) {
  const out = {};
  for (const c of ["BTC", "ETH"]) {
    const s = c + "USDT", oi = await get("https://fapi.binance.com/futures/data/openInterestHist?symbol=" + s + "&period=1d&limit=30"), ls = await get("https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=" + s + "&period=1d&limit=30").catch(() => []);
    const lsd = {}; ls.forEach(x => { lsd[new Date(+x.timestamp).toISOString().slice(0, 10)] = num(x.longShortRatio); });
    oi.forEach(x => { const d = new Date(+x.timestamp).toISOString().slice(0, 10); ((out[d] = out[d] || {})[c] = clean({ oi: num(x.sumOpenInterest), oiUsd: num(x.sumOpenInterestValue) != null ? Math.round(+x.sumOpenInterestValue) : null, ls: lsd[d] ?? null, hist: true })); });
  }
  return out;
}
export async function record(day, get = getJson, file = FILE) {
  const all = existsSync(file) ? JSON.parse(readFileSync(file, "utf8") || "{}") : {}, today = {}, failed = [];
  for (const [name, fn] of Object.entries(SOURCES)) { try { today[name] = await fn(get); } catch (e) { failed.push(name + " (" + e.message + ")"); } }
  if (Object.keys(today).length) all[day] = today;
  try { const h = await binanceHistory(get); Object.keys(h).forEach(d => { if (d >= day) return; all[d] = all[d] || {}; if (!all[d].binance) all[d].binance = h[d]; }); } catch { /* not reachable from here */ }
  writeFileSync(file, "{\n" + Object.keys(all).sort().map(k => JSON.stringify(k) + ": " + JSON.stringify(all[k])).join(",\n") + "\n}\n");
  return { ok: Object.keys(today), failed };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = await record(snapshotDay());
  console.log("derivatives:", r.ok.join(", ") || "none", "· not reachable:", r.failed.join(", ") || "none");
}
