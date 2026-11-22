// Temporary: checks candidate staking pages (status, final address, title, whether the page talks about staking). Run by .github/workflows/probe-staking.yml.
const C = {
  ADA: ["https://cardano.org/stake-pool-delegation/", "https://www.lace.io/faq", "https://www.lace.io/blog/how-to-stake-ada-with-lace"],
  TRX: ["https://tronscan.org/#/wallet/resources", "https://support.tronlink.org/hc/en-us/sections/staking", "https://www.tronlink.org/staking", "https://developers.tron.network/docs/staking-on-tron-network"],
  APT: ["https://petra.app/docs/staking", "https://petra.app/learn/staking", "https://aptosnetwork.com/currents/staking", "https://aptos.dev/network/blockchain/staking"],
  EGLD: ["https://xportal.com/staking", "https://multiversx.com/staking", "https://docs.multiversx.com/validators/delegation-manager"],
  HBAR: ["https://hedera.com/staking", "https://www.hashpack.app/staking", "https://docs.hedera.com/hedera/core-concepts/staking"],
  GRAM: ["https://ton.org/stake", "https://ton.org/en/stake", "https://tonkeeper.com/staking", "https://tonkeeper.helpscoutdocs.com/article/108-staking"],
  SUI: ["https://slush.app/guides/stake-and-swap-sui"],
  TAO: ["https://docs.learnbittensor.org/staking-and-delegation/delegation", "https://docs.bittensor.com/staking-and-delegation/delegation", "https://bittensor.com/staking"],
  ICP: ["https://nns.ic0.app", "https://internetcomputer.org/docs/building-apps/governing-apps/nns/using-the-nns-dapp/nns-dapp-staking-a-neuron", "https://internetcomputer.org/staking"],
  STX: ["https://www.stacks.co/learn/stacking", "https://leather.io/guides/stacking", "https://leather.io/learn/stacking", "https://docs.stacks.co/concepts/block-production/stacking"],
  DASH: ["https://www.dash.org/masternodes/", "https://docs.dash.org/en/stable/docs/user/masternodes/understanding.html"],
  FLR: ["https://portal.flare.network", "https://flare.network/staking", "https://dev.flare.network/network/guides/flare-for-everyone"],
  XDC: ["https://xdc.org/staking", "https://xinfin.org/staking", "https://master.xinfin.network", "https://docs.xdc.network/xdcchain/learn/staking"],
  GNO: ["https://docs.gnosischain.com/node/manual/validator/deposit", "https://deposit.gnosischain.com", "https://www.gnosis.io/staking"],
  SEI: ["https://app.sei.io/stake", "https://docs.sei.io/learn/general-staking", "https://www.sei.io/staking"],
  XTZ: ["https://tezos.com/learn/staking", "https://tezos.com/staking", "https://tezos.com/learn/store-and-use/staking"],
  DCR: ["https://docs.decred.org/proof-of-stake/overview/", "https://decred.org/staking"],
  KAIA: ["https://portal.kaia.io/staking", "https://portal.kaia.io", "https://docs.kaia.io/learn/staking"],
  RUNE: ["https://docs.thorchain.org/thorchain-finance/runepool", "https://thorchain.org/runepool", "https://docs.thorchain.org/how-it-works/incentive-pendulum"],
  CFX: ["https://confluxhub.io/governance/pos", "https://doc.confluxnetwork.org/docs/general/conflux-basics/consensus-mechanisms/proof-of-stake/pos-overview", "https://confluxhub.io/pos"],
  MON: ["https://docs.monad.xyz/developer-essentials/staking", "https://www.monad.xyz/staking", "https://docs.monad.xyz/monad-arch/staking"],
  IOTA: ["https://docs.iota.org/users/iota-wallet/how-to/stake", "https://docs.iota.org/about-iota/tokenomics/staking-unstaking", "https://www.iota.org/products/staking"],
  THETA: ["https://wallet.thetatoken.org/stakes", "https://docs.thetatoken.org/docs/guardian-node-overview", "https://www.thetatoken.org/staking"],
  A: ["https://www.vaulta.com/staking", "https://www.vaulta.com/resources/staking", "https://docs.vaulta.com/docs/latest/guides/staking"],
  S: ["https://my.soniclabs.com/stake", "https://docs.soniclabs.com/sonic/staking", "https://www.soniclabs.com/staking"],
  CHZ: ["https://www.chiliz.com/staking", "https://docs.chiliz.com/learn/staking", "https://www.chiliz.com/en/staking"],
  QTUM: ["https://qtum.org/staking", "https://docs.qtum.site/en/Qtum-Staking-Guide.html", "https://qtum.org/learn/staking"],
  ZANO: ["https://docs.zano.org/docs/use/staking/staking", "https://zano.org/staking", "https://docs.zano.org/docs/use/staking"],
  BDX: ["https://www.beldex.io/masternodes", "https://beldex.io/staking", "https://docs.beldex.io/masternodes"],
  XEC: ["https://e.cash/staking", "https://e.cash/staking-rewards", "https://avalanche.cash"],
  DOT: ["https://staking.polkadot.cloud", "https://wiki.polkadot.network/learn/learn-staking/"],
  OSMO: ["https://wallet.keplr.app/chains/osmosis"],
  ETH: ["https://launchpad.ethereum.org"], SOL: ["https://solana.com/staking"], AVAX: ["https://core.app/stake/"]
};
for (const sym of Object.keys(C)) for (const u of C[sym]) {
  try {
    const r = await fetch(u, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (link check)", accept: "text/html" }, signal: AbortSignal.timeout(25000) });
    const t = await r.text(), title = ((t.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "").replace(/\s+/g, " ").trim().slice(0, 90);
    const stake = (t.match(/stak/gi) || []).length, nf = /404|not found|page doesn.t exist|page not found/i.test(title);
    console.log("LINK " + sym + " | " + r.status + (nf ? " NOTFOUND" : "") + " | stak:" + stake + " | " + u + (r.url !== u ? " -> " + r.url : "") + " | " + title);
  } catch (e) { console.log("LINK " + sym + " | FAIL " + e.message + " | " + u); }
}
