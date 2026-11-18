// Records the Fed balance sheet (WALCL, total assets, weekly, in millions of US dollars) from FRED into data/fred-walcl.json.
// FRED publishes it once a week; the file keeps every week since the series began. Run: node scripts/record-fred.mjs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "fred-walcl.json");
const res = await fetch("https://fred.stlouisfed.org/graph/fredgraph.csv?id=WALCL", { headers: { "User-Agent": "CoinAtlas data job" } });
if (!res.ok) throw new Error("FRED answered " + res.status);
const days = (await res.text()).trim().split(/\r?\n/).slice(1).map(l => l.split(",")).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r[0]) && isFinite(+r[1]) && r[1] !== "").map(r => [r[0], +r[1]]);
if (days.length < 500) throw new Error("too few rows: " + days.length);
writeFileSync(OUT, '{"updated":"' + days[days.length - 1][0] + '","source":"FRED, series WALCL, millions of US dollars, weekly","days":[\n' + days.map(d => JSON.stringify(d)).join(",\n") + "\n]}\n");
console.log("WALCL:", days.length, "weeks, last", days[days.length - 1][0]);
