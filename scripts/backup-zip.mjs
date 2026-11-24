// Weekly backup of everything CoinAtlas recorded, as one ZIP sorted by calendar week:
//   CoinAtlas Backup/2026/Week 47 2026/21 NOV 2026/snapshot.json, intraday.json, day.json (that day's Dominance, Reading, Derivatives, Staking rates)
//   CoinAtlas Backup/Restore/data/...  the whole data folder exactly as the site reads it: unzip it into the repository to restore
import fs from "fs"; import path from "path"; import { execSync } from "child_process";
const OUT = process.argv[2] || "backup", ROOT = path.join(OUT, "CoinAtlas Backup");
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const isoWeek = (k) => { const t = Date.parse(k + "T00:00:00Z"), mon = t - ((new Date(t).getUTCDay() + 6) % 7) * 864e5, y = new Date(mon + 3 * 864e5).getUTCFullYear(), j4 = Date.UTC(y, 0, 4), m1 = j4 - ((new Date(j4).getUTCDay() + 6) % 7) * 864e5; return { y, w: Math.round((mon - m1) / (7 * 864e5)) + 1 }; };
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } };
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(ROOT, { recursive: true });
const big = { dominance: read("data/dominance.json"), reading: read("data/readings.json"), derivatives: read("data/derivatives.json"), staking: read("data/staking-history.json") };
const days = fs.readdirSync("data/snapshots").filter((f) => /^\d{4}-\d\d-\d\d\.json$/.test(f)).map((f) => f.slice(0, 10)).sort();
for (const k of days) {
  const { y, w } = isoWeek(k), dir = path.join(ROOT, String(y), `Week ${w} ${y}`, `${+k.slice(8)} ${MON[+k.slice(5, 7) - 1]} ${k.slice(0, 4)}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(`data/snapshots/${k}.json`, path.join(dir, "snapshot.json"));
  if (fs.existsSync(`data/intraday/${k}.json`)) fs.copyFileSync(`data/intraday/${k}.json`, path.join(dir, "intraday.json"));
  const day = { date: k }; for (const [n, d] of Object.entries(big)) if (d && d[k] !== undefined) day[n] = d[k];
  fs.writeFileSync(path.join(dir, "day.json"), JSON.stringify(day, null, 1));
}
fs.cpSync("data", path.join(ROOT, "Restore", "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "README.txt"), "CoinAtlas Backup\n\nThe year and week folders hold every recorded day: snapshot.json (the list), intraday.json (5 minute day charts) and day.json (that day's Dominance, Reading, Derivatives and Staking rates).\nTo restore the site's data, copy Restore/data into the repository, replacing its data folder. The files are the same JSON the site reads.\n");
const name = process.argv[3] || "coinatlas-backup.zip";
execSync(`cd "${OUT}" && zip -qr "../${name}" "CoinAtlas Backup"`);
console.log(`${name}: ${days.length} days`);
