// Tests for the CoinAtlas Formula Reading. Run: node tests/reading-test.js   (needs Playwright with Chromium)
// The page is opened with the history stored in data/history as its price and Fear & Greed source, so the result does not depend on the network.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const H = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/history/btc-eth.json'), 'utf8')).days, FG = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/history/fear-greed.json'), 'utf8')).days;
const rows = sym => H.map(x => { const t = Date.parse(x[0] + 'T00:00:00Z'), p = String(sym === 'BTCUSDT' ? x[1] : x[2]); return [t, p, p, p, p, '1', t + 864e5 - 1, '1', 1, '1', '1', '0']; });
const TODAY = H[H.length - 1][0];
// real days, replayed through the page with only the data of that day: [date, situation type, call]
const REAL = [['2025-04-21', 'now', 'now'], ['2026-06-06', 'strong', 'good'], ['2026-06-09', 'strong', 'good'], ['2024-08-07', 'strong', 'good'], ['2021-12-08', 'strong', 'good'], ['2025-08-12', 'back', 'back'], [TODAY, null, null], ['2025-07-19', 'contradicted', 'none'], ['2022-11-19', 'balanced', 'none']];
// invented situations, to cover every combination of strength, Fair Value Lines, sentiment and record
const rec = (profit, n, groups = 6) => ({ n, groups, profit }), base = { side: 'BTC', other: 'ETH', dir: 1, score: 4, marks: 0, year: 'Mild', all: 'Strong', seasonAgainst: false, domAgainst: false, fg: '', cause: '', times: 0 };
const SYN = [
  ['S1 both lines Extreme, record 97%', { ...base, type: 'now', score: 8, year: 'Extreme', all: 'Extreme', cause: 'fell', times: 3, rec: rec(97, 100) }, 'now'],
  ['S2 score 7, lines Strong and Extreme, Extreme Fear', { ...base, type: 'now', score: 7, year: 'Strong', all: 'Extreme', fg: 'Extreme Fear', rec: rec(90, 100) }, 'now'],
  ['S3 now, too few earlier days', { ...base, type: 'now', score: 8, year: 'Extreme', all: 'Extreme', rec: rec(10, 12, 1) }, 'now'],
  ['S4 strong, both lines agree, 74%', { ...base, type: 'strong', rec: rec(74, 100) }, 'good'],
  ['S5 strong, only one line, Extreme Greed, both rose', { ...base, type: 'strong', score: 3, year: 'Neutral', all: 'Strong', fg: 'Extreme Greed', cause: 'rose', rec: rec(82, 100) }, 'good'],
  ['S6 strong ETH, both lines Strong, 50%', { ...base, side: 'ETH', other: 'BTC', dir: -1, score: -5, type: 'strong', year: 'Strong', all: 'Strong', rec: rec(50, 100) }, 'unclear'],
  ['S7 strong, Dominance against, 30%', { ...base, type: 'strong', score: 3, marks: 1, domAgainst: true, rec: rec(30, 100) }, 'unclear'],
  ['S8 strong, too few earlier days', { ...base, type: 'strong', rec: rec(8, 10, 1) }, 'few'],
  ['S9 strong, lines contradict, 70%', { ...base, type: 'strong', score: 3, marks: 1, year: 'against', all: 'Extreme', rec: rec(70, 100) }, 'good'],
  ['S10 mild, only one line', { ...base, type: 'mild', score: 2, year: 'Neutral', all: 'Mild' }, 'none'],
  ['S11 mild ETH, both lines Mild, Season against, Extreme Fear', { ...base, side: 'ETH', other: 'BTC', dir: -1, score: -1, type: 'mild', year: 'Mild', all: 'Mild', marks: 1, seasonAgainst: true, fg: 'Extreme Fear' }, 'none'],
  ['S12 swap back on the ETH side', { ...base, side: 'ETH', other: 'BTC', dir: -1, score: -2, type: 'back', year: 'Mild', all: 'Neutral' }, 'back'],
  ['S13 balanced', { ...base, side: '', dir: 0, score: 0, type: 'balanced', year: 'Neutral', all: 'Neutral' }, 'none'],
  ['S14 contradicted: lines against each other and Season against', { ...base, type: 'contradicted', score: 1, marks: 2, year: 'against', all: 'Strong', seasonAgainst: true }, 'none']
];
const sentences = t => t.split(/(?<=[.!?])\s+/).filter(Boolean);
// the skeleton of a Reading: numbers, sides, level words and grade words replaced, so two Readings can be compared by structure
const skeleton = t => t.replace(/\d+(\.\d+)?/g, '#').replace(/\b(BTC|ETH)\b/g, 'COIN').replace(/Extreme (Fear|Greed)/g, 'SENT').replace(/\b(Mild|Strong|Extreme|Extremely|mildly|clearly)\b/g, 'LEVEL')
  .replace(/almost every day like this one|the large majority of days like this one|most days like this one|about half of the days like this one|fewer than half of the days like this one/g, 'GRADE');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('  FAIL', m); } };
function check(name, text, o) {
  const st = sentences(text);
  ok(st.length <= 4, name + ': more than 4 sentences (' + st.length + ')'); ok(text.length <= 560, name + ': too long (' + text.length + ')');
  ok(!/unusual/i.test(text), name + ': contains "unusual"'); ok(!/\d+ of \d+/.test(text), name + ': contains a count'); ok(!/% of days|stretches|\d%/i.test(text), name + ': contains statistics');
  ok(!/\bgap\b/i.test(text), name + ': says "gap"'); ok(!/ended ahead/i.test(text), name + ': says "ended ahead"'); ok(!/still growing|still widening/i.test(text), name + ': claims the Overvaluation is still growing');
  ok(!/could|might|maybe|perhaps|theoretically/i.test(text), name + ': hedges'); ok(!/swap(ping)? back|If you swapped/i.test(text), name + ': talks about swapping back');
  if (o.lean) ok(/Fair Value Line/.test(text), name + ': does not name the Fair Value Lines');
  if (o.sentiment === false) ok(!/Extreme (Fear|Greed)/.test(text), name + ': mentions Fear & Greed without a clear Overvaluation');
  if (o.sentiment === true) ok(/not a state that lasts/.test(text), name + ': extreme sentiment at a clear Overvaluation is not used as confirmation');
}
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('coinatlas-gate', '4rqx8ltv3i'); } catch (e) {} });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(/^https?:\/\//, route => {
    const u = new URL(route.request().url());
    if (u.hostname === 'data-api.binance.vision' && u.pathname.endsWith('/klines') && u.searchParams.get('interval') === '1d' && u.searchParams.get('startTime') !== null) { const s = +u.searchParams.get('startTime'); return route.fulfill({ json: rows(u.searchParams.get('symbol')).filter(x => x[0] >= s).slice(0, 1000) }); }
    if (u.hostname === 'api.alternative.me') return route.fulfill({ json: { data: FG.slice().reverse().map(x => ({ value: String(x[1]), value_classification: 'x', timestamp: String(Date.parse(x[0] + 'T00:00:00Z') / 1000) })) } });
    return route.abort();
  });
  await p.goto('file://' + path.join(ROOT, 'index.html')); await p.waitForTimeout(2500);
  await p.click('#ratio-btn'); await p.waitForSelector('#rt-reading .rt-vd', { timeout: 30000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => document.getElementById('dev-toggle').click());
  const read = () => p.evaluate(() => ({ text: document.querySelector('#rt-reading .rt-vd').textContent, fg: document.getElementById('rt-fm-fg').textContent, expl: Array.from(document.querySelectorAll('#rt-reading .rt-rd-q')).map(x => x.textContent), body: document.querySelector('#rt-reading .rt-why').textContent, score: document.querySelector('#rt-formula .rt-fm-sum b').textContent }));
  const skel = {}, out = [];
  console.log('REAL DAYS (replayed with only the data of each day)');
  for (const [d, type, call] of REAL) {
    await p.evaluate(v => { const e = document.getElementById('rt-asof'); e.value = v; e.dispatchEvent(new Event('change')); }, d); await p.waitForTimeout(350);
    const x = await read(), fgv = FG.find(q => q[0] === d), ext = !!fgv && (fgv[1] <= 24 || fgv[1] >= 76), clear = call === 'now' || call === 'good', lean = x.score !== '+0';
    check(d, x.text, { lean: lean && type !== 'contradicted', sentiment: ext && clear ? true : !clear ? false : undefined });
    ok(x.expl.length >= 4, d + ': Explanation has fewer than 4 questions'); ok(x.expl.every(q => /\?$/.test(q)), d + ': an Explanation heading is not a question');
    if (call === 'now') ok(/^Holding (BTC|ETH) is a really good idea right now, and/.test(x.text), d + ': expected "a really good idea"');
    if (call === 'good') ok(/^Holding (BTC|ETH) is a good idea right now, and/.test(x.text), d + ': expected "a good idea"');
    if (call === 'back') ok(/^Holding BTC is a good idea right now, and/.test(x.text), d + ': expected "holding BTC"');
    if (call === 'now' || call === 'good' || call === 'back') ok(/if you are looking to buy or swap, (BTC|ETH) is the recommendation/.test(x.text), d + ': no buy recommendation');
    if (type === 'contradicted') ok(sentences(x.text).length >= 2, d + ': a contradiction must name where it comes from');
    if (type === 'balanced') ok(/^Now is a good time to hold on to your BTC and ETH\./.test(x.text), d + ': expected "hold on"');
    if (type === 'contradicted') ok(/^No clear recommendation today/.test(x.text), d + ': expected "no clear recommendation"');
    if (d === TODAY && /^[+−][12]$/.test(x.score)) ok(/^Now is a good time to hold on to your BTC and ETH\./.test(x.text), d + ': a Mild lean must read "hold on"');
    out.push([d, x.score, x.text]); console.log('  ' + d + ' [' + x.score + (fgv ? ', F&G ' + fgv[1] : '') + ']  ' + x.text);
  }
  console.log('\nINVENTED SITUATIONS');
  for (const [name, sit, call] of SYN) {
    const c = await p.evaluate(s => window.coinAtlasDev.compose(s), sit), text = c.text.join(' '), clear = c.call === 'now' || c.call === 'good';
    check(name, text, { lean: !!sit.dir && sit.type !== 'contradicted', sentiment: sit.fg && clear ? true : sit.fg ? false : undefined }); ok(c.call === call, name + ': call is "' + c.call + '", expected "' + call + '"');
    (skel[sit.type] = skel[sit.type] || new Set()).add(skeleton(text)); console.log('  ' + name + '  →  ' + text);
  }
  // the record wording follows the real share of days, and a better record reads stronger
  const g = async (a) => (await p.evaluate(s => window.coinAtlasDev.compose(s).text.join(' '), { ...base, type: 'strong', rec: rec(a, 100) }));
  ok(/almost every day/.test(await g(97)), '97% must read "almost every day"'); ok(/large majority/.test(await g(85)), '85% must read "the large majority"'); ok(/most days/.test(await g(70)), '70% must read "most days"');
  ok(/about half/.test(await g(50)) && /No clear recommendation/.test(await g(50)), '50% must read "about half" and make no recommendation'); ok(/fewer than half/.test(await g(20)), '20% must read "fewer than half"');
  // different situation types never share a sentence skeleton
  const types = Object.keys(skel); for (let i = 0; i < types.length; i++) for (let j = i + 1; j < types.length; j++) for (const s of skel[types[i]]) ok(!skel[types[j]].has(s), 'types "' + types[i] + '" and "' + types[j] + '" share a skeleton');
  ok(errs.length === 0, 'page errors: ' + errs.join(' | '));
  console.log('\n' + (fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED') + ' · ' + REAL.length + ' real days, ' + SYN.length + ' invented situations, ' + types.length + ' situation types');
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out));
  await b.close(); process.exit(fails ? 1 : 0);
})();
