// Tests for the CoinAtlas Formula Reading. Run: node tests/reading-test.js   (needs Playwright with Chromium)
// The page is opened with the history stored in data/history as its price and Fear & Greed source, so the result does not depend on the network.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const H = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/history/btc-eth.json'), 'utf8')).days, FG = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/history/fear-greed.json'), 'utf8')).days;
const rows = sym => H.map(x => { const t = Date.parse(x[0] + 'T00:00:00Z'), p = String(sym === 'BTCUSDT' ? x[1] : x[2]); return [t, p, p, p, p, '1', t + 864e5 - 1, '1', 1, '1', '1', '0']; });
const TODAY = H[H.length - 1][0];
// real days, replayed through the page with only the data of that day
const REAL = [['2026-06-09', 'widening', 'notyet'], ['2026-06-17', 'stalled', 'good'], [TODAY, null, null], ['2025-04-21', 'widening', 'notyet'], ['2025-04-29', 'stalled', 'good'], ['2021-12-08', 'widening', 'notyet'], ['2021-12-16', 'stalled', 'good'], ['2018-12-14', 'stalled', 'few'], ['2025-07-19', 'contradicted', 'none'], ['2025-07-21', null, null], ['2022-11-19', 'balanced', 'none']];
// invented situations, to cover every combination of strength, sentiment and record
const hist = (ahead, n) => ({ n, ahead }), base = { side: 'BTC', other: 'ETH', marks: 0, fg: '', closedSide: '' };
const SYN = [
  ['S1 strong stalled, every case', { ...base, type: 'stalled', level: 'strong', hist: hist(13, 13), first: hist(9, 13) }, 'good'],
  ['S2 strong stalled, Extreme Fear, 11 of 13', { ...base, type: 'stalled', level: 'strong', fg: 'Extreme Fear', hist: hist(11, 13), first: hist(9, 13) }, 'good'],
  ['S3 strong stalled, 6 of 13', { ...base, type: 'stalled', level: 'strong', hist: hist(6, 13), first: hist(6, 13) }, 'unclear'],
  ['S4 extreme stalled, Extreme Greed, 2 of 13', { ...base, type: 'stalled', level: 'extreme', fg: 'Extreme Greed', hist: hist(2, 13), first: hist(2, 13) }, 'unclear'],
  ['S5 strong stalled, tiny sample', { ...base, type: 'stalled', level: 'strong', hist: hist(2, 2), first: hist(1, 2) }, 'few'],
  ['S6 ETH strong widening, Extreme Greed', { ...base, side: 'ETH', other: 'BTC', type: 'widening', level: 'strong', fg: 'Extreme Greed', hist: hist(9, 13), first: hist(6, 13) }, 'notyet'],
  ['S7 max widening, record no better when waiting', { ...base, type: 'widening', level: 'max', hist: hist(6, 13), first: hist(8, 13) }, 'notyet'],
  ['S8 mild, neutral sentiment', { ...base, type: 'small', level: 'mild' }, 'none'],
  ['S9 mild ETH, Extreme Fear, one mark', { ...base, side: 'ETH', other: 'BTC', type: 'small', level: 'mild', fg: 'Extreme Fear', marks: 1 }, 'none'],
  ['S10 strong stalled, one mark, 8 of 13', { ...base, type: 'stalled', level: 'strong', marks: 1, hist: hist(8, 13), first: hist(8, 13) }, 'good'],
  ['S11 balanced', { ...base, side: '', type: 'balanced', level: '' }, 'none'],
  ['S12 balanced, Extreme Greed', { ...base, side: '', type: 'balanced', level: '', fg: 'Extreme Greed' }, 'none'],
  ['S13 gap closed after a BTC phase', { ...base, side: '', type: 'closed', level: '', closedSide: 'BTC' }, 'back'],
  ['S14 contradicted', { ...base, type: 'contradicted', level: 'mild', marks: 2 }, 'none']
];
const sentences = t => t.split(/(?<=[.!?])\s+/).filter(Boolean);
// the skeleton of a Reading: numbers, sides, level words and grade words replaced, so two Readings can be compared by structure
const skeleton = t => t.replace(/\d+(\.\d+)?/g, '#').replace(/\b(BTC|ETH)\b/g, 'COIN').replace(/Extreme (Fear|Greed)/g, 'SENT')
  .replace(/at the most expensive level the Formula can show against COIN|far more expensive against COIN than usual|clearly expensive against COIN/g, 'LEVEL')
  .replace(/every earlier case|nearly all earlier cases|most earlier cases|about half of the earlier cases|fewer than half of the earlier cases|hardly any of the earlier cases/g, 'GRADE');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('  FAIL', m); } };
function check(name, text, o) {
  const st = sentences(text);
  ok(st.length <= 3, name + ': more than 3 sentences (' + st.length + ')'); ok(text.length <= 380, name + ': too long (' + text.length + ')');
  ok(!/unusual/i.test(text), name + ': contains "unusual"'); ok(!/\d+ of \d+/.test(text), name + ': contains a count'); ok(!/% of days|stretches/i.test(text), name + ': contains frequency wording');
  ok(!/Very Temporary/.test(text), name + ': "Very Temporary" belongs in the Explanation');
  if (o.fgExtreme) ok(/Temporary/.test(text), name + ': Fear & Greed extreme without "Temporary"'); else ok(!/Temporary/.test(text), name + ': "Temporary" without a Fear & Greed extreme');
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
    const x = await read(), fgv = FG.find(q => q[0] === d), ext = !!fgv && (fgv[1] <= 24 || fgv[1] >= 76), deep = !!fgv && (fgv[1] <= 10 || fgv[1] >= 90);
    check(d, x.text, { fgExtreme: ext });
    ok(x.expl.length >= 4, d + ': Explanation has fewer than 4 questions'); ok(x.expl.every(q => /\?$/.test(q)), d + ': an Explanation heading is not a question');
    ok(deep === /Very Temporary/.test(x.body), d + ': "Very Temporary" in the Explanation must appear only in the deepest band');
    if (ext) ok(/Why "Temporary"\?/.test(x.expl.join('|')), d + ': no "Why Temporary" answer');
    if (call === 'good') ok(/^.*Good time to swap/.test(x.text), d + ': expected a "good time" call'); if (call === 'notyet') ok(/Not yet a good time/.test(x.text), d + ': expected "not yet"');
    out.push([d, x.score, x.text]); console.log('  ' + d + ' [' + x.score + (fgv ? ', F&G ' + fgv[1] : '') + ']  ' + x.text);
  }
  console.log('\nINVENTED SITUATIONS');
  for (const [name, sit, call] of SYN) {
    const c = await p.evaluate(s => window.coinAtlasDev.compose(s), sit), text = c.text.join(' ');
    check(name, text, { fgExtreme: !!sit.fg }); ok(c.call === call, name + ': call is "' + c.call + '", expected "' + call + '"');
    (skel[sit.type] = skel[sit.type] || new Set()).add(skeleton(text)); console.log('  ' + name + '  →  ' + text);
  }
  // grade wording follows the real fraction, and a better record reads stronger
  const g = async (a, n) => (await p.evaluate(s => window.coinAtlasDev.compose(s).text[1], { ...base, type: 'stalled', level: 'strong', hist: hist(a, n), first: hist(a, n) }));
  ok(/every earlier case/.test(await g(13, 13)), '13 of 13 must read "every"'); ok(/nearly all earlier cases/.test(await g(11, 13)), '11 of 13 must read "nearly all"'); ok(/most earlier cases/.test(await g(8, 13)), '8 of 13 must read "most"');
  ok(/about half/.test(await g(6, 13)), '6 of 13 must read "about half"'); ok(/hardly any/.test(await g(2, 13)), '2 of 13 must read "hardly any"');
  // different situation types never share a sentence skeleton
  const types = Object.keys(skel); for (let i = 0; i < types.length; i++) for (let j = i + 1; j < types.length; j++) for (const s of skel[types[i]]) ok(!skel[types[j]].has(s), 'types "' + types[i] + '" and "' + types[j] + '" share a skeleton');
  ok(errs.length === 0, 'page errors: ' + errs.join(' | '));
  console.log('\n' + (fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED') + ' · ' + REAL.length + ' real days, ' + SYN.length + ' invented situations, ' + types.length + ' situation types');
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out));
  await b.close(); process.exit(fails ? 1 : 0);
})();
