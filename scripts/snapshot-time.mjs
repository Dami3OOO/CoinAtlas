// When the daily snapshot is due. The official snapshot is taken right after midnight in New York and is the record of the
// New York day that just ended. GitHub's scheduler is started several times between 00:05 and 00:50 New York time (in summer
// and in winter), so a run that is late or fails is simply repeated; a backup run around noon fills a day that is still missing.
//   node scripts/snapshot-time.mjs            prints "run=true" or "run=false" for $GITHUB_OUTPUT
//   SNAPSHOT_MODE=midnight | backup | manual  (manual: always runs)
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function nyParts(t = Date.now()) {
  const p = {}; new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false }).formatToParts(new Date(t)).forEach(x => { p[x.type] = x.value; });
  return { day: p.year + "-" + p.month + "-" + p.day, hour: +p.hour % 24 };
}
export function nyYesterday(t = Date.now()) { const d = new Date(nyParts(t).day + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); }
/* the day a snapshot taken now belongs to: the New York day that ended at the last midnight */
export function snapshotDay(t = Date.now()) { return process.env.SNAPSHOT_DATE || nyYesterday(t); }
export function due(mode, t = Date.now(), dataDir) {
  if (mode === "manual") return { run: true, why: "started by hand" };
  const day = snapshotDay(t), file = join(dataDir, "snapshots", day + ".json"), ny = nyParts(t);
  let have = null; if (existsSync(file)) { try { have = JSON.parse(readFileSync(file, "utf8")); } catch { have = {}; } }
  if (mode === "backup") return have ? { run: false, why: day + " is already recorded" } : { run: true, why: day + " is missing, backup run" };
  if (ny.hour !== 0) return { run: false, why: "not midnight in New York (" + ny.hour + ":xx)" };
  if (have && have.ny) return { run: false, why: day + " was already taken at midnight" };
  return { run: true, why: "midnight in New York, recording " + day };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const d = due(process.env.SNAPSHOT_MODE || "manual", Date.now(), join(dirname(fileURLToPath(import.meta.url)), "..", "data"));
  console.error(d.why); console.log("run=" + d.run);
}
