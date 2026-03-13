import { Database } from "bun:sqlite";

const dbPath = process.argv.includes("--db")
  ? process.argv[process.argv.indexOf("--db") + 1]
  : "./data/broider.db";

console.log(`Fetching submissions from val.town...`);
const res = await fetch("https://maxbittker-broider.web.val.run/");
const data = await res.json() as { submissions: { dataUrl: string; title: string; pixelRatio: number; who: string }[] };
console.log(`Fetched ${data.submissions.length} submissions`);

const db = new Database(dbPath, { create: true });
db.run("PRAGMA journal_mode=WAL");
db.run(`CREATE TABLE IF NOT EXISTS broider_submissions2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataUrl TEXT NOT NULL,
  title TEXT NOT NULL,
  pixelRatio INTEGER NOT NULL DEFAULT 1,
  who TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const insert = db.prepare(
  "INSERT INTO broider_submissions2 (dataUrl, title, pixelRatio, who) VALUES (?, ?, ?, ?)"
);

const tx = db.transaction(() => {
  for (const s of data.submissions) {
    insert.run(s.dataUrl, s.title, s.pixelRatio ?? 1, s.who ?? "");
  }
});
tx();

console.log(`Imported ${data.submissions.length} submissions into ${dbPath}`);
db.close();
