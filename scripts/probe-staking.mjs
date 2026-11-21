// Temporary: tries free sources for more native staking rates and prints what each one answers. Run by .github/workflows/probe-staking.yml.
const cut = (s, n = 900) => (s.length > n ? s.slice(0, n) + " …" : s);
async function hit(label, url, body) {
  try {
    const r = await fetch(url, { method: body ? "POST" : "GET", headers: { accept: "application/json", "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(45000) });
    const t = await r.text();
    console.log("\n### " + label + " | HTTP " + r.status + " | " + url + "\n" + cut(t.replace(/\s+/g, " ")));
    try { return JSON.parse(t); } catch { return null; }
  } catch (e) { console.log("\n### " + label + " | FAILED " + e.message + " | " + url); return null; }
}
const rpc = (label, url, method, params = []) => hit(label, url, { jsonrpc: "2.0", id: 1, method, params });

// Cosmos chains
for (const c of ["kava", "sei", "akash", "dydx", "osmosis", "kujira", "secretnetwork"]) {
  const j = await hit("cosmos " + c, "https://chains.cosmos.directory/" + c);
  if (j && j.chain && j.chain.params) console.log("APR " + c + ": estimated " + j.chain.params.estimated_apr + " calculated " + j.chain.params.calculated_apr);
}
// SUI
const apy = await rpc("sui apys", "https://fullnode.mainnet.sui.io", "suix_getValidatorsApy");
const sys = await rpc("sui system", "https://fullnode.mainnet.sui.io", "suix_getLatestSuiSystemState");
if (apy && apy.result && sys && sys.result) {
  const st = {}; sys.result.activeValidators.forEach(v => { st[v.suiAddress] = +v.stakingPoolSuiBalance; });
  let w = 0, s = 0; apy.result.apys.forEach(a => { const k = st[a.address] || 0; w += k; s += a.apy * k; });
  console.log("SUI weighted APY: " + (s / w * 100));
}
// APT
const sc = await hit("aptos staking config", "https://api.mainnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::staking_config::StakingConfig");
const br = await hit("aptos block resource", "https://api.mainnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::block::BlockResource");
if (sc && br) { const r = +sc.data.rewards_rate / +sc.data.rewards_rate_denominator, ep = 365 * 24 * 3600e6 / +br.data.epoch_interval; console.log("APT APR: " + r * ep * 100); }
await hit("aptos staking rewards config", "https://api.mainnet.aptoslabs.com/v1/accounts/0x1/resource/0x1::staking_config::StakingRewardsConfig");
// NEAR
const nv = await rpc("near validators", "https://rpc.mainnet.near.org", "validators", [null]);
const nb = await hit("near block", "https://rpc.mainnet.near.org", { jsonrpc: "2.0", id: 1, method: "block", params: { finality: "final" } });
const ng = await hit("near protocol config", "https://rpc.mainnet.near.org", { jsonrpc: "2.0", id: 1, method: "EXPERIMENTAL_protocol_config", params: { finality: "final" } });
if (nv && nv.result && nb && nb.result) { const staked = nv.result.current_validators.reduce((s, v) => s + Number(v.stake), 0), sup = Number(nb.result.header.total_supply); console.log("NEAR staked/supply: " + staked / sup + " max_inflation " + JSON.stringify(ng && ng.result && ng.result.max_inflation_rate) + " protocol_reward " + JSON.stringify(ng && ng.result && ng.result.protocol_reward_rate)); }
// TRX
await hit("tronscan pagewitness", "https://apilist.tronscanapi.com/api/pagewitness?witnesstype=0");
await hit("tronscan vote witness", "https://apilist.tronscanapi.com/api/vote/witness");
// TON
await hit("tonapi staking pools", "https://tonapi.io/v2/staking/pools");
// XTZ
await hit("tzkt statistics", "https://api.tzkt.io/v1/statistics/current");
await hit("tzkt protocol", "https://api.tzkt.io/v1/protocols/current");
// EGLD
await hit("multiversx economics", "https://api.multiversx.com/economics");
// HBAR
await hit("hedera nodes", "https://mainnet-public.mirrornode.hedera.com/api/v1/network/nodes?limit=3");
// DOT / KSM via public sidecar
await hit("polkadot sidecar staking progress", "https://polkadot-public-sidecar.parity-chains.parity.io/pallets/staking/progress");
await hit("polkadot sidecar inflation", "https://polkadot-public-sidecar.parity-chains.parity.io/pallets/staking/storage/ErasValidatorReward");
