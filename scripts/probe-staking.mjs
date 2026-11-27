// One-off probe (deleted again after use): which free sources give a staking rate for the assets that show "Rate on site".
const SYMS = ["DOT", "OSMO", "POL", "MATIC", "GRAM", "TON", "SUI", "TAO", "ICP", "STX", "DASH", "FLR", "XDC", "GNO", "SEI", "XTZ", "DCR", "KAIA", "RUNE", "CFX", "MON", "IOTA", "THETA", "EOS", "A", "S", "CHZ", "QTUM", "ZANO", "BDX", "VET", "XEC"];
const t = async (name, url, body) => { try { const r = await fetch(url, { method: body ? "POST" : "GET", headers: { accept: "application/json", "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) }); const x = await r.text(); console.log("### " + name + " [" + r.status + "] " + x.slice(0, 700).replace(/\s+/g, " ")); } catch (e) { console.log("### " + name + " ERR " + e.message); } };
const pools = (await (await fetch("https://yields.llama.fi/pools")).json()).data;
for (const s of SYMS) {
  const re = new RegExp("(^|[^A-Z])" + s + "$|^(ST|S|V|HA|TS|WS|X|K|AP|SH|G|R)" + s + "$");
  const m = pools.filter(p => re.test(String(p.symbol).toUpperCase()) && p.apyBase > 0 && p.apyBase < 30 && p.tvlUsd > 2e6).sort((a, b) => b.tvlUsd - a.tvlUsd).slice(0, 6);
  console.log("=== " + s + ": " + (m.map(p => p.project + " | " + p.symbol + " | " + p.chain + " | base " + p.apyBase.toFixed(2) + " | tvl " + Math.round(p.tvlUsd / 1e6) + "M | " + p.exposure).join("  ||  ") || "none"));
}
await t("cosmos osmosis", "https://chains.cosmos.directory/osmosis");
await t("cosmos sei", "https://chains.cosmos.directory/sei");
await t("sui graphql", "https://graphql.mainnet.sui.io/graphql", { query: "{ epoch { epochId validatorSet { activeValidators(first: 5) { nodes { name apy } } } } }" });
await t("sui rpc", "https://fullnode.mainnet.sui.io", { jsonrpc: "2.0", id: 1, method: "suix_getValidatorsApy", params: [] });
await t("tonapi pools", "https://tonapi.io/v2/staking/pools");
await t("polygon staking", "https://staking-api.polygon.technology/api/v2/validators/summary");
await t("icp governance", "https://ic-api.internetcomputer.org/api/v3/governance-metrics");
await t("tzkt statistics", "https://api.tzkt.io/v1/statistics/current");
await t("tzkt protocol", "https://api.tzkt.io/v1/protocols/current");
await t("thorchain runepool", "https://thornode.ninerealms.com/thorchain/runepool");
await t("midgard runepool", "https://midgard.ninerealms.com/v2/history/runepool?interval=day&count=2");
await t("subscan dot", "https://polkadot.api.subscan.io/api/scan/staking/era_stat", { address: "", row: 1, page: 0 });
await t("stacks pox", "https://api.hiro.so/v2/pox");
await t("kaia", "https://api-cypress.klaytnscope.com/v2/staking/info");
await t("vechain", "https://vechainstats.com/api/v1/stargate");
await t("taostats", "https://api.taostats.io/api/stats/latest/v1");
