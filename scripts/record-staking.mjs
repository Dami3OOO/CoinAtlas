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
  ADA: [{ name: "Cardano Stake Pool Delegation", kind: "Native Staking", url: "https://cardano.org/stake-pool-delegation/", locked: false }],
  DOT: [{ name: "Polkadot Staking Dashboard", kind: "Native Staking", url: "https://staking.polkadot.cloud", locked: true },
    { name: "Bifrost (vDOT)", kind: "Liquid Staking", url: "https://app.bifrost.io/vstaking/vDOT", locked: false, pools: { project: ["bifrost-liquid-staking"], symbol: "VDOT", chain: "Polkadot" } }],
  ATOM: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/cosmos-hub", locked: true }],
  TIA: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/celestia", locked: true }],
  OSMO: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/osmosis", locked: true }],
  INJ: [{ name: "Injective Hub", kind: "Native Staking", url: "https://hub.injective.network/stake", locked: true }],
  POL: [{ name: "Polygon Staking", kind: "Native Staking", url: "https://staking.polygon.technology", locked: true }],
  BNB: [{ name: "BNB Chain Staking", kind: "Native Staking", url: "https://www.bnbchain.org/en/bnb-staking", locked: true }],
  HYPE: [{ name: "Hyperliquid", kind: "Native Staking", url: "https://app.hyperliquid.xyz/staking", locked: true }],
  TRX: [{ name: "TRON Stake 2.0", kind: "Native Staking", url: "https://developers.tron.network/docs/staking-on-tron-network", locked: true }],
  APT: [{ name: "Aptos Staking", kind: "Native Staking", url: "https://aptos.dev/network/blockchain/staking", locked: true }],
  NEAR: [{ name: "MyNearWallet", kind: "Native Staking", url: "https://app.mynearwallet.com/staking", locked: true }],
  EGLD: [{ name: "MultiversX Staking", kind: "Native Staking", url: "https://multiversx.com/staking", locked: true }],
  AKT: [{ name: "Keplr", kind: "Native Staking", url: "https://wallet.keplr.app/chains/akash", locked: true }],
  HBAR: [{ name: "Hedera Staking", kind: "Native Staking", url: "https://docs.hedera.com/learn/core-concepts/staking", locked: false }],
  /* native staking with a link only (no free source for the rate yet): "Rate on site" */
  GRAM: [{ name: "Tonstakers", kind: "Liquid Staking", url: "https://faq.tonstakers.com/article/103-how-to-stake-tonstakers", locked: false }],
  SUI: [{ name: "Slush Wallet", kind: "Native Staking", url: "https://slush.app/guides/stake-and-swap-sui", locked: true }],
  TAO: [{ name: "Bittensor Docs", kind: "Native Staking", url: "https://www.bittensor.com/docs", locked: false }],
  ICP: [{ name: "NNS (Network Nervous System)", kind: "Native Staking", url: "https://nns.ic0.app", locked: true }],
  STX: [{ name: "Leather Wallet", kind: "Native Staking", url: "https://app.leather.io/posts/stacking", locked: true, note: "Stacking, paid in BTC" },
    { name: "StackingDAO (stSTX)", kind: "Liquid Staking", url: "https://www.stackingdao.com", locked: false, pools: { project: ["stackingdao"], symbol: "STSTX", chain: "Stacks" } }],
  DASH: [{ name: "Dash Masternodes", kind: "Native Staking", url: "https://www.dash.org/masternodes/", locked: false, note: "1,000 DASH per masternode" }],
  FLR: [{ name: "Flare Portal", kind: "Native Staking", url: "https://portal.flare.network", locked: false },
    { name: "Sceptre (sFLR)", kind: "Liquid Staking", url: "https://www.sceptre.fi", locked: false, pools: { project: ["sceptre-liquid"], symbol: "SFLR", chain: "Flare" } }],
  XDC: [{ name: "XDC Masternodes", kind: "Native Staking", url: "https://master.xinfin.network", locked: true }],
  GNO: [{ name: "Gnosis Validator Deposit", kind: "Native Staking", url: "https://docs.gnosischain.com/node/manual/validator/deposit", locked: true, note: "1 GNO per validator" }],
  SEI: [{ name: "Sei Staking Guide", kind: "Native Staking", url: "https://docs.sei.io/learn/general-staking", locked: true }],
  XTZ: [{ name: "stake.tezos.com", kind: "Native Staking", url: "https://stake.tezos.com", locked: true }],
  DCR: [{ name: "Decred Proof of Stake", kind: "Native Staking", url: "https://docs.decred.org/proof-of-stake/overview/", locked: true, note: "ticket staking" }],
  KAIA: [{ name: "Kaia Portal", kind: "Native Staking", url: "https://portal.kaia.io", locked: true }],
  RUNE: [{ name: "THORChain RUNEPool", kind: "Native Staking", url: "https://docs.thorchain.org/thorchain-finance/runepool", locked: true }],
  CFX: [{ name: "ConfluxHub", kind: "Native Staking", url: "https://confluxhub.io/governance/pos", locked: true }],
  MON: [{ name: "Monad Staking", kind: "Native Staking", url: "https://docs.monad.xyz/reference/staking/overview", locked: true }],
  IOTA: [{ name: "IOTA Wallet Staking Guide", kind: "Native Staking", url: "https://docs.iota.org/users/iota-wallet/how-to/stake", locked: true }],
  THETA: [{ name: "Theta Guardian Nodes", kind: "Native Staking", url: "https://docs.thetatoken.org/docs/guardian-node-overview", locked: true }],
  A: [{ name: "Vaulta Staking Guide", kind: "Native Staking", url: "https://vaulta.gitbook.io/vaulta-guides/vaulta-token/staking", locked: true }],
  S: [{ name: "Sonic", kind: "Native Staking", url: "https://my.soniclabs.com/stake", locked: true }],
  CHZ: [{ name: "Chiliz Staking", kind: "Native Staking", url: "https://www.chiliz.com/glossary-term/staking/", locked: true }],
  QTUM: [{ name: "Qtum Staking", kind: "Native Staking", url: "https://qtum.org/use-qtum/stake-qtum", locked: false }],
  ZANO: [{ name: "Zano", kind: "Native Staking", url: "https://zano.org", locked: false }],
  BDX: [{ name: "Beldex", kind: "Native Staking", url: "https://www.beldex.io", locked: true }],
  VET: [{ name: "VeChain StarGate", kind: "Native Staking", url: "https://stargate.vechain.org", locked: true }],
  XEC: [{ name: "eCash Staking", kind: "Native Staking", url: "https://e.cash/staking", locked: true }],
  USDC: [{ name: "Aave", kind: "Lending", url: "https://app.aave.com", locked: false, pools: { project: ["aave-v3"], symbol: "USDC", chain: "Ethereum" } }],
  USDT: [{ name: "Aave", kind: "Lending", url: "https://app.aave.com", locked: false, pools: { project: ["aave-v3"], symbol: "USDT", chain: "Ethereum" } }],
  DAI: [{ name: "Aave", kind: "Lending", url: "https://app.aave.com", locked: false, pools: { project: ["aave-v3"], symbol: "DAI", chain: "Ethereum" } }]
};
const MAX_APY = 30; /* a base rate above this is not real staking: left out */

/* pools: DefiLlama's list. Each option gets the base rate of its biggest matching pool; the 3 best per coin are kept (options without a rate last) */
/* native staking: the network's rate from free official sources (tested: probe of 21.11.2026). Before the validator's commission.
   Each returns the APR in %, or null. Probe of 27.11.2026: Sei and Osmosis via cosmos.directory, TON (Gram) via tonapi.io; Polkadot (Subscan needs a key), Polygon, Sui (JSON-RPC switched off,
   GraphQL without APY), Tezos and the smaller chains still have no free source: they keep "Rate on site", where a liquid option on DefiLlama may add a rate */
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
  ADA: { "Cardano Stake Pool Delegation": async () => { /* rewards of a finished epoch shared by the active stake, 73 epochs a year */
    const tip = (await jget("https://api.koios.rest/api/v1/tip"))[0].epoch_no, e = (await jget("https://api.koios.rest/api/v1/epoch_info?_epoch_no=" + (tip - 3)))[0];
    return e && +e.total_rewards > 0 && +e.active_stake > 0 ? +e.total_rewards / +e.active_stake * (365 / 5) * 100 : null;
  } },
  BNB: { "BNB Chain Staking": async () => { /* the validators' APY, weighted by their stake */
    const v = (await jget("https://api.bnbchain.org/bnb-staking/v1/validator/all?offset=0&limit=100")).data.validators.filter(x => x.status === "ACTIVE" && x.apy > 0);
    const w = v.reduce((s, x) => s + +x.totalStaked, 0); return w > 0 ? v.reduce((s, x) => s + x.apy * +x.totalStaked, 0) / w * 100 : null;
  } },
  AKT: { "Keplr": cosmos("akash") },
  SEI: { "Sei Staking Guide": cosmos("sei") },
  OSMO: { "Keplr": cosmos("osmosis") },
  GRAM: { "Tonstakers": async () => { /* tonapi.io lists TON's staking pools with their APY; Tonstakers is the liquid one */
    const p = ((await jget("https://tonapi.io/v2/staking/pools")).pools || []).filter(x => /tonstakers/i.test(x.name) && x.apy > 0).sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))[0];
    return p ? +p.apy : null;
  } },
  APT: { "Aptos Staking": async () => { /* the reward rate per epoch, times the epochs in a year */
    const c = (await jget("https://api.mainnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::staking_config::StakingConfig")).data, b = (await jget("https://api.mainnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::block::BlockResource")).data;
    return +c.rewards_rate / +c.rewards_rate_denominator * (365 * 24 * 3600e6 / +b.epoch_interval) * 100;
  } },
  NEAR: { "MyNearWallet": async () => { /* the yearly inflation (minus the protocol's part), shared by the staked NEAR */
    const call = (method, params) => jget("https://rpc.mainnet.near.org", { jsonrpc: "2.0", id: 1, method, params });
    const cfg = (await call("EXPERIMENTAL_protocol_config", { finality: "final" })).result, v = (await call("validators", [null])).result, blk = (await call("block", { finality: "final" })).result;
    const inf = cfg.max_inflation_rate[0] / cfg.max_inflation_rate[1] * (1 - cfg.protocol_reward_rate[0] / cfg.protocol_reward_rate[1]);
    const staked = v.current_validators.reduce((s, x) => s + Number(x.stake), 0), sup = Number(blk.header.total_supply);
    return staked > 0 ? inf * sup / staked * 100 : null;
  } },
  TRX: { "TRON Stake 2.0": async () => { /* the voters' yearly rate of each Super Representative, weighted by its votes */
    const d = (await jget("https://apilist.tronscanapi.com/api/vote/witness")).data || [];
    let w = 0, s = 0; d.forEach(x => { const r = +x.annualizedRate, v = +x.realTimeVotes; if (r > 0 && v > 0) { w += v; s += r * v; } });
    return w > 0 ? s / w : null;
  } },
  EGLD: { "MultiversX Staking": async () => { const e = await jget("https://api.multiversx.com/economics"); return +e.apr > 0 ? +e.apr * 100 : null; } },
  HBAR: { "Hedera Staking": async () => { /* each node's reward rate (tinybars per HBAR per day), weighted by the rewarded stake */
    let url = "https://mainnet-public.mirrornode.hedera.com/api/v1/network/nodes?limit=25", w = 0, s = 0, n = 0;
    while (url && n++ < 6) { const j = await jget(url); (j.nodes || []).forEach(x => { const r = +x.reward_rate_start, k = +x.stake_rewarded; if (r > 0 && k > 0) { w += k; s += r * k; } }); url = j.links && j.links.next ? "https://mainnet-public.mirrornode.hedera.com" + j.links.next : null; }
    return w > 0 ? s / w * 365 / 1e8 * 100 : null;
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
      if (!p.pools && native[sym] && native[sym][p.name] > 0) { apy = native[sym][p.name]; if (p.kind === "Native Staking") note = (note ? note + " · " : "") + NATIVE_NOTE; }
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
