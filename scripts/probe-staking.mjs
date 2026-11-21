// Temporary: tries free sources for native staking rates and prints what each one answers. Run by .github/workflows/probe-staking.yml.
const cut = (s, n = 700) => (s.length > n ? s.slice(0, n) + " …" : s);
async function hit(label, url, opts = {}) {
  try {
    const r = await fetch(url, { ...opts, headers: { accept: "application/json", "content-type": "application/json", ...(opts.headers || {}) }, signal: AbortSignal.timeout(30000) });
    const t = await r.text();
    console.log("\n### " + label + " | HTTP " + r.status + " | " + url + "\n" + cut(t.replace(/\s+/g, " ")));
    try { return JSON.parse(t); } catch { return null; }
  } catch (e) { console.log("\n### " + label + " | FAILED " + e.message + " | " + url); return null; }
}
const rpc = (url, method, params = []) => hit("RPC " + method, url, { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });

// Cosmos chains: cosmos.directory computes the APR
for (const c of ["cosmoshub", "celestia", "osmosis", "injective"]) {
  const j = await hit("cosmos " + c, "https://chains.cosmos.directory/" + c);
  if (j && j.chain && j.chain.params) console.log("PARAMS " + c + ": " + JSON.stringify(j.chain.params));
}
// Cardano: Koios
await hit("koios tip", "https://api.koios.rest/api/v1/tip");
await hit("koios epoch_info", "https://api.koios.rest/api/v1/epoch_info?limit=3&offset=2");
// Solana: inflation, supply, staked
const sol = "https://api.mainnet-beta.solana.com";
await rpc(sol, "getInflationRate");
await rpc(sol, "getSupply", [{ excludeNonCirculatingAccountsList: true }]);
const va = await (async () => { try { const r = await fetch(sol, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getVoteAccounts" }), signal: AbortSignal.timeout(60000) }); return r.json(); } catch (e) { console.log("vote accounts failed " + e.message); return null; } })();
if (va && va.result) console.log("SOLANA staked (lamports): " + va.result.current.reduce((s, v) => s + v.activatedStake, 0) + " validators " + va.result.current.length);
// Polkadot
await hit("subscan dot", "https://polkadot.api.subscan.io/api/scan/metadata", { method: "POST", body: "{}" });
await hit("polkadot staking stats (polkassembly)", "https://api.polkassembly.io/api/v1/staking");
// Avalanche: Glacier (Ava Labs Data API)
await hit("glacier network", "https://glacier-api.avax.network/v1/networks/mainnet");
await hit("avax p-chain getCurrentSupply", "https://api.avax.network/ext/bc/P", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "platform.getCurrentSupply", params: {} }) });
await hit("avax p-chain getTotalStake", "https://api.avax.network/ext/bc/P", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "platform.getTotalStake", params: { subnetID: "11111111111111111111111111111111LpoYY" } }) });
// Polygon
await hit("polygon staking summary", "https://staking-api.polygon.technology/api/v2/validators/summary");
await hit("polygon staking rewards", "https://staking-api.polygon.technology/api/v2/rewards/summary");
await hit("polygon staking apr", "https://staking-api.polygon.technology/api/v2/apr");
// BNB Chain
await hit("bnb staking validators", "https://api.bnbchain.org/bnb-staking/v1/validator/all?offset=0&limit=3");
await hit("bnb staking apr", "https://api.bnbchain.org/bnb-staking/v1/validator/apr");
// Hyperliquid
const hl = await hit("hyperliquid validatorSummaries", "https://api.hyperliquid.xyz/info", { method: "POST", body: JSON.stringify({ type: "validatorSummaries" }) });
if (Array.isArray(hl)) console.log("HL first validator keys: " + JSON.stringify(Object.keys(hl[0] || {})) + " stats: " + JSON.stringify((hl[0] || {}).stats));
