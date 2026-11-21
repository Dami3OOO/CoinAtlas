// "Where can I stake?": the best staking options for a coin, but only from a hand-picked list of trusted providers
// (years on the market, audited, never lost user funds). DefiLlama Yields gives the real rates; only the base rate
// is used (no bonus tokens). Native staking without a public rate is listed with its link and no number.
// Writes data/staking.json. Runs after the snapshot in .github/workflows/record-snapshot.yml; a failure never stops the snapshot
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
export function build(pools) {
  const assets = {};
  for (const sym of Object.keys(PROVIDERS)) {
    const list = PROVIDERS[sym].map(p => {
      let apy = null, tvl = null;
      if (p.pools && pools) {
        const m = pools.filter(x => p.pools.project.indexOf(x.project) > -1 && String(x.symbol).toUpperCase() === p.pools.symbol && x.chain === p.pools.chain && x.apyBase > 0 && x.apyBase < MAX_APY)
          .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))[0];
        if (m) { apy = +m.apyBase.toFixed(2); tvl = Math.round(m.tvlUsd || 0); }
      }
      return { name: p.name, kind: p.kind, url: p.url, locked: p.locked, apy, tvl, note: p.note || undefined };
    }).filter(x => x.apy !== null || !PROVIDERS[sym].find(p => p.name === x.name).pools) /* a pool that was not found is left out, not shown without a rate */
      .sort((a, b) => (b.apy ?? -1) - (a.apy ?? -1)).slice(0, 3);
    if (!list.length) continue;
    const best = list.reduce((m, x) => (x.apy !== null && (m === null || x.apy > m) ? x.apy : m), null);
    assets[sym] = { label: list.every(x => x.kind === "Lending") ? "Lending" : "Staking", best, list };
  }
  return assets;
}

async function main() {
  let pools = null;
  if (process.env.STAKING_OFFLINE !== "1") {
    const r = await fetch("https://yields.llama.fi/pools", { headers: { accept: "application/json" }, signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error("HTTP " + r.status + " from DefiLlama");
    pools = (await r.json()).data;
    if (!Array.isArray(pools) || pools.length < 1000) throw new Error("DefiLlama answered without pools");
  }
  const assets = build(pools), file = join(DATA, "staking.json");
  let day = new Date().toISOString().slice(0, 10); try { day = (await import("./snapshot-time.mjs")).snapshotDay(); } catch { /* today */ }
  const missing = [];
  for (const s of Object.keys(PROVIDERS)) for (const p of PROVIDERS[s]) if (p.pools && !(assets[s] && assets[s].list.find(x => x.name === p.name))) missing.push(s + " " + p.name);
  writeFileSync(file, JSON.stringify({ updated: day, source: pools ? "DefiLlama Yields (base rate only)" : "list only, no rates", missing }, null, 1).slice(0, -2) + ',\n "assets": {\n' +
    Object.keys(assets).map(k => "  " + JSON.stringify(k) + ": " + JSON.stringify(assets[k])).join(",\n") + "\n }\n}\n");
  console.log("Staking for " + Object.keys(assets).length + " coins" + (missing.length ? "; no rate found for: " + missing.join(", ") : ""));
}

if (import.meta.url === "file://" + process.argv[1]) main().catch(e => { console.log("Staking not recorded:", e.message); process.exit(1); });
