// Tests for the CoinAtlas Formula Reading. Run: node tests/reading-test.js   (needs Playwright with Chromium)
// The rules are written down in docs/reading-spec.md. The page is opened with the history stored in data/history, so the result does not depend on the network.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const H = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/history/btc-eth.json'), 'utf8')).days, FG = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/history/fear-greed.json'), 'utf8')).days;
const rows = sym => H.map(x => { const t = Date.parse(x[0] + 'T00:00:00Z'), p = String(sym === 'BTCUSDT' ? x[1] : x[2]); return [t, p, p, p, p, '1', t + 864e5 - 1, '1', 1, '1', '1', '0']; });
const TODAY = H[H.length - 1][0];
// real days, replayed with only the data of that day: [date, expected call, expected stage or buy side]
const REAL = [['2025-06-22', 'swap', 'A'], ['2022-06-11', 'swap', 'B'], ['2025-07-10', 'hold'], ['2025-08-09', 'back'], ['2025-04-21', 'buy', 'ETH'], ['2022-11-19', 'buy', ''],
  ['2024-03-10', 'none'], ['2023-01-20', 'none'], [TODAY, null]];
// invented situations, one for every kind of recommendation
const base = { side: 'BTC', other: 'ETH', dir: 1, score: 4, tier: 'Strong', marks: 0, contradicted: false, zone: '', fgV: 50, lead: 20, phase: 'BTC', nz: false, win: null, watch: false, yt: 'Bridge Year', stage: '', buySide: '', fellMore: false, open: null };
const SYN = [
  ['S1 Stage A in Fear', { ...base, call: 'swap', stage: 'A', score: 5, lead: 48, zone: 'Fear', fgV: 35, buySide: 'ETH' }, /^Now is a good time to swap BTC into ETH\. /],
  ['S2 Stage B in Extreme Fear', { ...base, call: 'swap', stage: 'B', score: 2, tier: 'Mild', lead: -45, phase: 'ETH', zone: 'Extreme Fear', fgV: 12, buySide: 'ETH' }, /^Now is a good time to swap BTC into ETH\. /],
  ['S3 swap complete in Greed', { ...base, call: 'back', zone: 'Greed', fgV: 68, buySide: 'BTC', open: { t: Date.UTC(2025, 5, 22), r: 45.3 } }, /^Now is a good time to swap ETH into BTC\. /],
  ['S4 swap running', { ...base, call: 'hold', buySide: 'ETH', open: { t: Date.UTC(2025, 5, 22), r: 45.3 } }, /^Hold your ETH: the swap from 22 Jun 2025 is still running\./],
  ['S5 buy the cheaper side in Fear', { ...base, call: 'buy', score: 2, tier: 'Mild', zone: 'Extreme Fear', fgV: 13, buySide: 'ETH', fellMore: true }, /^Now is a good time to buy ETH with USDC\. /],
  ['S6 buy without a lean', { ...base, call: 'buy', side: '', dir: 0, score: 0, tier: '', zone: 'Fear', fgV: 30 }, /^Now is a good time to add to what you already hold with USDC\. /],
  ['S7 nothing to do in Greed', { ...base, call: 'none', score: 3, zone: 'Greed', fgV: 70 }, /^Nothing to do today\. /],
  ['S8 Neutral zone of the lines', { ...base, call: 'none', score: -1, side: 'ETH', other: 'BTC', dir: -1, tier: 'Mild', lead: 4, nz: true }, /^Nothing to do today\. /],
  ['S9 Strong reading in an Extreme Window', { ...base, call: 'none', score: 4, win: [0, 1], watch: true }, /^Nothing to do today\. /]
];
const sentences = t => t.split(/(?<=[.!?])\s+/).filter(Boolean);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('  FAIL', m); } };
function check(name, text, o) {
  const st = sentences(text.replace(/\d+ [A-Z][a-z]{2} \d{4}/g, 'DATE'));
  ok(st.length <= 4, name + ': more than 4 sentences (' + st.length + ')'); ok(text.length <= 520, name + ': too long (' + text.length + ')');
  ok(!/\d+ of \d+|\d%|% of days/.test(text), name + ': contains statistics, they belong in the Explanation'); ok(!/\bgap\b|ended ahead|unusual/i.test(text), name + ': uses a banned word');
  ok(!/could|might|maybe|perhaps|theoretically/i.test(text), name + ': hedges'); ok(!/swap(ping)? back|If you swapped/i.test(text), name + ': talks about swapping back');
  const z = o.zone || '';
  if (/Greed/.test(z)) { ok(!/buy (BTC|ETH) with USDC|add to what you already hold/.test(text), name + ': recommends buying during Greed'); if (o.call === 'none') ok(/keep your USDC and wait for Fear/.test(text), name + ': Greed without the advice to keep USDC'); }
  if (/Fear/.test(z) && (o.call === 'swap' || o.call === 'back' || o.call === 'hold')) ok(/strong time to buy (BTC|ETH) with USDC/.test(text), name + ': a swap during Fear must also name the purchase');
  if (o.call === 'buy') ok(/Fear/.test(z), name + ': a purchase outside of Fear');
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
  const readAt = d => p.evaluate(v => window.coinAtlasDev.readAt(Date.parse(v + 'T00:00:00Z')), d);
  const qs = h => (h.match(/class="rt-rd-q">([^<]*(?:<[^>]+>[^<]*)*?)<\/span>/g) || []).map(x => x.replace(/^class="rt-rd-q">/, '').replace(/<[^>]+>/g, ''));
  console.log('REAL DAYS (replayed with only the data of each day)');
  for (const [d, call, extra] of REAL) {
    const x = await readAt(d), q = qs(x.expl);
    check(d, x.text, { zone: x.zone, call: x.call });
    ok(q.length >= 3, d + ': Explanation has fewer than 3 questions'); ok(q.every(s => /\?$/.test(s)), d + ': an Explanation heading is not a question');
    if (call) ok(x.call === call, d + ': call is "' + x.call + '", expected "' + call + '"');
    if (call === 'swap') { ok(x.stage === extra, d + ': stage ' + x.stage + ', expected ' + extra); ok(q.includes('Why swap BTC into ETH today?'), d + ': no question for the swap'); }
    if (call === 'back') ok(q.includes('Why swap ETH into BTC now?'), d + ': no question for completing the swap');
    if (call === 'hold') ok(q.includes('When is the swap complete?'), d + ': no question for the running swap');
    if (call === 'buy') { ok(x.buy === extra, d + ': buys "' + x.buy + '", expected "' + extra + '"'); ok(q.some(s => /^Why buy/.test(s)), d + ': no question for the purchase'); }
    if (x.win) ok(q.some(s => /Extreme Window|this window/.test(s)), d + ': inside an Extreme Window without explaining it');
    if (x.nz) ok(q.some(s => /Neutral zone/.test(s)), d + ': Neutral zone of the lines without explaining it');
    console.log('  ' + d + ' [' + x.call + (x.stage ? ' ' + x.stage : '') + ', score ' + x.score + ', lines ' + x.lead.toFixed(0) + '%' + (x.fg != null ? ', F&G ' + x.fg : '') + ']  ' + x.text);
  }
  console.log('\nINVENTED SITUATIONS');
  for (const [name, sit, re] of SYN) {
    const c = await p.evaluate(s => window.coinAtlasDev.compose(s), sit), text = c.text.join(' ');
    check(name, text, { zone: sit.zone, call: sit.call }); ok(re.test(text), name + ': unexpected start: ' + text.slice(0, 80)); ok(c.call === sit.call, name + ': call changed');
    if (sit.nz) ok(/Neutral zone/.test(text), name + ': the Neutral zone of the lines is not named'); if (sit.watch) ok(/worth watching/.test(text), name + ': a Strong reading in the window is not named');
    console.log('  ' + name + '  →  ' + text);
  }
  // the page around the Reading: the dev Hindsight judges a Reading, the chart shows both lines and their distance, the mini swaps are gone
  await p.evaluate(() => document.getElementById('dev-toggle').click());
  for (const d of ['2025-06-22', '2025-04-21']) {
    await p.evaluate(v => { const e = document.getElementById('rt-asof'); e.value = v; e.dispatchEvent(new Event('change')); }, d); await p.waitForTimeout(400);
    const hs = await p.evaluate(() => (document.querySelector('.rt-rd-hs') || {}).textContent || '');
    ok(/The Reading (was right|was wrong|missed)/.test(hs), d + ': Hindsight gives no verdict'); console.log('\n  HINDSIGHT ' + d + '  ' + hs.slice(0, 220));
  }
  ok(await p.evaluate(() => /[+−]\d+%/.test((document.querySelector('.rt-gap') || {}).textContent || '')), 'the Ratio chart shows no distance between the lines');
  ok(await p.evaluate(() => /Neutral zone/.test((document.querySelector('.rt-phase-note') || {}).textContent || '')), 'Past Years has no phase note');
  ok(await p.evaluate(() => !document.getElementById('rt-target-toggle') && !document.querySelector('.rt-target')), 'the mini swaps are still on the page');
  ok(errs.length === 0, 'page errors: ' + errs.join(' | '));
  console.log('\n' + (fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED') + ' · ' + REAL.length + ' real days, ' + SYN.length + ' invented situations');
  await b.close(); process.exit(fails ? 1 : 0);
})();
