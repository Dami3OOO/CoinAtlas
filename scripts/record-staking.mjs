// "Where can I stake?": the best staking options for a coin, but only from a hand-picked list of trusted providers
// (years on the market, audited, never lost user funds). DefiLlama Yields gives the real rates; only the base rate
// is used (no bonus tokens). Native staking without a public rate is listed with its link and no number.
// Writes data/staking.json, and adds the night's rates to data/staking-history.json. Runs after the snapshot in .github/workflows/record-snapshot.yml; a failure never stops the snapshot
// and keeps the last file. Without network (or with STAKING_OFFLINE=1) it writes the list without rates.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = process.env.SNAPSHOT_DIR || join(ROOT, "data");

/* kind: Liquid Staking (you get a token back, can be swapped any time: Unlocked), Native Staking (with the chain's own wallet,
   mostly a waiting time to get out: Locked), Lending (stablecoins on Aave: interest paid by borrowers, can be withdrawn: Unlocked).
   pools: how the option is found in DefiLlama Yields (project names, pool symbol, chain). Without pools: no public rate. */
export const PROVIDERS = {
  ETH: [
    { name: "Lido", kind: "Liquid Staking", url: "https://stake.lido.fi", locked: false, pools: { project: ["lido"], symbol: "STETH", chain: "Ethereum" } },
    { name: "Rocket Pool", kind: "Liquid Staking", url: "https://stake.rocketpool.net", locked: false, pools: { project: ["rocket-pool"], symbol: "RETH", chain: "Ethereum" } },
    { name: "Coinbase (cbETH)", kind: "Liquid Staking", url: "https://www.coinbase.com/cbeth", locked: false, pools: { project: ["coinbase-wrapped-staked-eth"], symbol: "CBETH", chain: "Ethereum" } },
    { name: "Ethereum Staking Launchpad", kind: "Native Staking", url: "https://launchpad.ethereum.org", locked: true, note: "32 ETH per validator" }
  ],
  SOL: [
    { name: "Jito", kind: "Liquid Staking", url: "https://www.jito.network/staking/", locked: false, pools: { project: ["jito-liquid-staking", "jito"], symbol: "JITOSOL", chain: "Solana" } },
    { name: "Marinade", kind: "Liquid Staking", url: "https://marinade.finance", locked: false, pools: { project: ["marinade-liquid-staking", "marinade-finance", "marinade"], symbol: "MSOL", chain: "Solana" } },
    { name: "Solana (native)", kind: "Native Staking", url: "https://solana.com/staking", locked: true }
  ],
  AVAX: [
    { name: "Benqi (sAVAX)", kind: "Liquid Staking", url: "https://benqi.fi", locked: false, pools: { project: ["benqi-staked-avax", "benqi-liquid-staking"], symbol: "SAVAX", chain: "Avalanche" } },
    { name: "Core Wallet", kind: "Native Staking", url: "https://core.app/stake/", locked: true }
  ],
  ADA: [{ name: "Lace Wallet", kind: "Native Staking", url: "https://www.lace.io", locked: false }],
  DOT: [{ name: "Polkadot Staking Dashboard", kind: "Native Staking", url: "https://staking.polkadot.cloud", locked: true }],
  ATOM: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/cosmos-hub", locked: true }],
  TIA: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/celestia", locked: true }],
  OSMO: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/osmosis", locked: true }],
  INJ: [{ name: "Injective Hub", kind: "Native Staking", url: "https://hub.injective.network/stake", locked: true }],
  POL: [{ name: "Polygon Staking", kind: "Native Staking", url: "https://staking.polygon.technology", locked: true }],
  BNB: [{ name: "BNB Chain Staking", kind: "Native Staking", url: "https://www.bnbchain.org/en/bnb-staking", locked: true }],
  HYPE: [{ name: "Hyperliquid", kind: "Native Staking", url: "https://app.hyperliquid.xyz/staking", locked: true }],
  USDC: [{ name: "Aave", kind: "Lending", url: "https://app.aave.com", locked: false, pools: { project: ["aave-v3"], symbol: "USDC", chain: "Ethereum" } }],
  USDT: [{ name: "Aave", kind: "Lending", url: "https://app.aave.com", locked: false, pools: { project: ["aave-v3"], symbol: "USDT", chain: "Ethereum" } }],
  DAI: [{ name: "Aave", kind: "Lending", url: "https://app.aave.com", locked: false, pools: { project: ["aave-v3"], symbol: "DAI", chain: "Ethereum" } }]
};
const MAX_APY = 30; /* a base rate above this is not real staking: left out */

/* pools: DefiLlama's list. Each option gets the base rate of its biggest matching pool; the 3 best per coin are kept (options without a rate last) */
/* native staking: the network's rate from free official sources (tested: probe of 21.11.2026). Before the validator's commission.
   Each returns the APR in %, or null. Avalanche, Polkadot, Polygon and Osmosis have no reliable free source: they keep "Rate on site" */
const NATIVE_NOTE = "network average, before validator fee";
async function jget(url, body) {
  const r = await fetch(url, { method: body ? "POST" : "GET", headers: { accept: "application/json", "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error("HTTP " + r.status + " from " + new URL(url).hostname);
  return r.json();
}
const cosmos = chain => async () => { const p = (await jget("https://chains.cosmos.directory/" + chain)).chain.params; const v = +p.estimated_apr; return v > 0 ? v * 100 : null; };
export const NATIVE_RATES = {
  ATOM: { "Keplr": cosmos("cosmoshub") },
  TIA: { "Keplr": cosmos("celestia") },
  INJ: { "Injective Hub": cosmos("injective") },
  SOL: { "Solana (native)": async () => { /* yearly validator inflation times all SOL, shared by the staked SOL */
    const rpc = m => jget("https://api.mainnet-beta.solana.com", { jsonrpc: "2.0", id: 1, method: m });
    const inf = (await rpc("getInflationRate")).result.validator, sup = (await rpc("getSupply")).result.value.total, va = (await rpc("getVoteAccounts")).result;
    const staked = va.current.concat(va.delinquent).reduce((s, v) => s + v.activatedStake, 0);
    return staked > 0 ? inf * sup / staked * 100 : null;
  } },
  ADA: { "Lace Wallet": async () => { /* rewards of a finished epoch shared by the active stake, 73 epochs a year */
    const tip = (await jget("https://api.koios.rest/api/v1/tip"))[0].epoch_no, e = (await jget("https://api.koios.rest/api/v1/epoch_info?_epoch_no=" + (tip - 3)))[0];
    return e && +e.total_rewards > 0 && +e.active_stake > 0 ? +e.total_rewards / +e.active_stake * (365 / 5) * 100 : null;
  } },
  BNB: { "BNB Chain Staking": async () => { /* the validators' APY, weighted by their stake */
    const v = (await jget("https://api.bnbchain.org/bnb-staking/v1/validator/all?offset=0&limit=100")).data.validators.filter(x => x.status === "ACTIVE" && x.apy > 0);
    const w = v.reduce((s, x) => s + +x.totalStaked, 0); return w > 0 ? v.reduce((s, x) => s + x.apy * +x.totalStaked, 0) / w * 100 : null;
  } },
  HYPE: { "Hyperliquid": async () => { /* the validators' predicted APR of the week, weighted by their stake */
    const v = (await jget("https://api.hyperliquid.xyz/info", { type: "validatorSummaries" })).filter(x => x.isActive && !x.isJailed);
    let w = 0, s = 0; v.forEach(x => { const wk = (x.stats || []).find(t => t[0] === "week"), a = wk && +wk[1].predictedApr; if (a > 0) { w += +x.stake; s += a * +x.stake; } });
    return w > 0 ? s / w * 100 : null;
  } }
};
export async function nativeRates() { /* { SYM: { provider: rate } }; each source on its own, a failing one is just left out */
  const out = {};
  for (const sym of Object.keys(NATIVE_RATES)) for (const name of Object.keys(NATIVE_RATES[sym])) {
    try { const v = await NATIVE_RATES[sym][name](); if (v > 0.1 && v < MAX_APY) (out[sym] = out[sym] || {})[name] = +v.toFixed(2); else console.log("Native rate " + sym + " out of range: " + v); }
    catch (e) { console.log("Native rate " + sym + " not read: " + e.message); }
  }
  return out;
}

export function build(pools, native = {}) {
  const assets = {};
  for (const sym of Object.keys(PROVIDERS)) {
    const list = PROVIDERS[sym].map(p => {
      let apy = null, tvl = null;
      if (p.pools && pools) {
        const m = pools.filter(x => p.pools.project.indexOf(x.project) > -1 && String(x.symbol).toUpperCase() === p.pools.symbol && x.chain === p.pools.chain && x.apyBase > 0 && x.apyBase < MAX_APY)
          .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))[0];
        if (m) { apy = +m.apyBase.toFixed(2); tvl = Math.round(m.tvlUsd || 0); }
      }
      let note = p.note;
      if (!p.pools && native[sym] && native[sym][p.name] > 0) { apy = native[sym][p.name]; note = (note ? note + " · " : "") + NATIVE_NOTE; }
      return { name: p.name, kind: p.kind, url: p.url, locked: p.locked, apy, tvl, note: note || undefined };
    }).filter(x => x.apy !== null || !PROVIDERS[sym].find(p => p.name === x.name).pools) /* a pool that was not found is left out, not shown without a rate */
      .sort((a, b) => (b.apy ?? -1) - (a.apy ?? -1)).slice(0, 3);
    if (!list.length) continue;
    const best = list.reduce((m, x) => (x.apy !== null && (m === null || x.apy > m) ? x.apy : m), null);
    assets[sym] = { label: list.every(x => x.kind === "Lending") ? "Lending" : "Staking", best, list };
  }
  return assets;
}

/* every night's rates are kept: data/staking-history.json, one line per day: { "YYYY-MM-DD": { "ETH": { "Lido": 2.9, ... }, ... } }.
   Only options with a real rate; a day that is recorded again is replaced */
export function historyDay(assets) {
  const d = {};
  for (const sym of Object.keys(assets)) for (const x of assets[sym].list) if (x.apy !== null) (d[sym] = d[sym] || {})[x.name] = x.apy;
  return d;
}
function writeHistory(day, assets) {
  const file = join(DATA, "staking-history.json"); let all = {};
  if (existsSync(file)) { try { all = JSON.parse(readFileSync(file, "utf8")); } catch { all = {}; } }
  const d = historyDay(assets); if (!Object.keys(d).length) return;
  all[day] = d;
  writeFileSync(file, "{\n" + Object.keys(all).sort().map(k => JSON.stringify(k) + ": " + JSON.stringify(all[k])).join(",\n") + "\n}\n");
}

async function main() {
  let pools = null;
  if (process.env.STAKING_OFFLINE !== "1") {
    const r = await fetch("https://yields.llama.fi/pools", { headers: { accept: "application/json" }, signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error("HTTP " + r.status + " from DefiLlama");
    pools = (await r.json()).data;
    if (!Array.isArray(pools) || pools.length < 1000) throw new Error("DefiLlama answered without pools");
  }
  const native = process.env.STAKING_OFFLINE === "1" ? {} : await nativeRates();
  const assets = build(pools, native), file = join(DATA, "staking.json");
  let day = new Date().toISOString().slice(0, 10); try { day = (await import("./snapshot-time.mjs")).snapshotDay(); } catch { /* today */ }
  const missing = [];
  for (const s of Object.keys(PROVIDERS)) for (const p of PROVIDERS[s]) if (p.pools && !(assets[s] && assets[s].list.find(x => x.name === p.name))) missing.push(s + " " + p.name);
  writeFileSync(file, JSON.stringify({ updated: day, source: pools ? "DefiLlama Yields (base rate only)" : "list only, no rates", missing }, null, 1).slice(0, -2) + ',\n "assets": {\n' +
    Object.keys(assets).map(k => "  " + JSON.stringify(k) + ": " + JSON.stringify(assets[k])).join(",\n") + "\n }\n}\n");
  if (pools) writeHistory(day, assets);
  console.log("Staking for " + Object.keys(assets).length + " coins" + (missing.length ? "; no rate found for: " + missing.join(", ") : ""));
}

if (import.meta.url === "file://" + process.argv[1]) main().catch(e => { console.log("Staking not recorded:", e.message); process.exit(1); });
