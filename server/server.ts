import { Database } from "bun:sqlite";

const DB_PATH = process.env.DB_PATH ?? "/data/broider.db";
const PORT = parseInt(process.env.PORT ?? "8080");

const db = new Database(DB_PATH, { create: true });
db.run("PRAGMA journal_mode=WAL");
db.run(`CREATE TABLE IF NOT EXISTS broider_submissions2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataUrl TEXT NOT NULL,
  title TEXT NOT NULL,
  pixelRatio INTEGER NOT NULL DEFAULT 1,
  who TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getSubmissions() {
  const rows = db.query("SELECT dataUrl, title, pixelRatio, who FROM broider_submissions2 ORDER BY id ASC").all();
  return Response.json({ submissions: rows }, { headers: corsHeaders });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method === "POST") {
      const body = await req.json() as { dataUrl: string; title: string; pixelRatio: number; who: string };
      db.run(
        "INSERT INTO broider_submissions2 (dataUrl, title, pixelRatio, who) VALUES (?, ?, ?, ?)",
        [body.dataUrl, body.title, body.pixelRatio ?? 1, body.who ?? ""],
      );
    }

    return getSubmissions();
  },
});

console.log(`Listening on port ${PORT}, DB at ${DB_PATH}`);
