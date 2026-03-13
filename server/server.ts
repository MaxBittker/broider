interface Env {
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
};

const DEFAULT_LIMIT = 200;

async function ensureTables(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS broider_submissions2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dataUrl TEXT NOT NULL,
      title TEXT NOT NULL,
      pixelRatio INTEGER NOT NULL DEFAULT 1,
      who TEXT NOT NULL DEFAULT '',
      ip TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS ip_bans (
      ip TEXT PRIMARY KEY,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
  ]);
}

async function getSubmissions(url: URL, db: D1Database) {
  const cursor = parseInt(url.searchParams.get("cursor") ?? "0") || 0;
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? String(DEFAULT_LIMIT)) || DEFAULT_LIMIT, 500);

  const { results: rows } = await db.prepare(
    "SELECT id, dataUrl, title, pixelRatio, who FROM broider_submissions2 WHERE id > ? ORDER BY id ASC LIMIT ?",
  ).bind(cursor, limit + 1).all();

  const hasMore = rows.length > limit;
  if (hasMore) rows.pop();

  const nextCursor = hasMore ? (rows[rows.length - 1] as any).id : null;

  return Response.json(
    { submissions: rows, nextCursor },
    { headers: corsHeaders },
  );
}

function getClientIP(req: Request): string {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}

async function isIPBanned(ip: string, db: D1Database): Promise<boolean> {
  if (!ip) return false;
  const row = await db.prepare("SELECT 1 FROM ip_bans WHERE ip = ?").bind(ip).first();
  return !!row;
}

const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>broider admin</title>
<style>
  * { box-sizing: border-box; font-family: monospace; color: #333; }
  body {
    background-color: antiquewhite;
    max-width: 900px;
    margin: auto;
    padding: 8px;
    filter: drop-shadow(1px 1px 4px rgb(107, 117, 147));
  }
  h1 { margin: 8px 0; font-size: 1.4em; }
  .stats { margin-bottom: 12px; font-size: 0.9em; color: #666; }
  .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .tab {
    padding: 6px 14px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: monospace;
    font-size: 1em;
    color: #666;
  }
  .tab.active { color: #333; text-decoration: underline; }
  .tab:hover { color: #333; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 8px;
  }
  .card {
    padding: 8px;
    position: relative;
    background: rgba(255,255,255,0.3);
    border: 1px solid rgba(0,0,0,0.1);
  }
  .card img {
    width: 100%;
    image-rendering: pixelated;
    background: white;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .card .title { font-size: 12px; margin: 6px 0 2px; word-break: break-all; }
  .card .meta { font-size: 10px; color: #888; }
  .card .actions { margin-top: 6px; display: flex; gap: 6px; }
  .card .actions button {
    padding: 3px 8px;
    font-size: 11px;
    cursor: pointer;
    font-family: monospace;
    background: transparent;
    border: 1px solid #999;
    color: #333;
  }
  .card .actions button:hover { background: rgba(0,0,0,0.05); }
  .btn-delete { border-color: #c0392b !important; color: #c0392b !important; }
  .btn-delete:hover { background: #c0392b !important; color: white !important; }
  .btn-ban { border-color: #d35400 !important; color: #d35400 !important; }
  .btn-ban:hover { background: #d35400 !important; color: white !important; }
  .ban-list { max-width: 600px; }
  .ban-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: rgba(255,255,255,0.3);
    border: 1px solid rgba(0,0,0,0.1);
    margin-bottom: 4px;
    font-size: 12px;
  }
  .ban-row button {
    padding: 3px 8px;
    font-size: 11px;
    cursor: pointer;
    font-family: monospace;
    background: transparent;
    border: 1px solid #27ae60;
    color: #27ae60;
  }
  .ban-row button:hover { background: #27ae60; color: white; }
  .hidden { display: none; }
  .add-ban { margin-bottom: 16px; display: flex; gap: 8px; }
  .add-ban input {
    padding: 6px;
    font-family: monospace;
    background: transparent;
    border: 1px solid #999;
    color: #333;
  }
  .add-ban input::placeholder { color: #999; }
  .add-ban button {
    padding: 6px 12px;
    font-family: monospace;
    cursor: pointer;
    background: transparent;
    border: 1px solid #d35400;
    color: #d35400;
  }
  .add-ban button:hover { background: #d35400; color: white; }
</style>
</head>
<body>
<h1>broider admin</h1>
<div class="stats" id="stats"></div>
<div class="tabs">
  <div class="tab active" onclick="showTab('submissions')">[submissions]</div>
  <div class="tab" onclick="showTab('bans')">[ip bans]</div>
</div>

<div id="submissions-tab">
  <div class="grid" id="grid"></div>
</div>

<div id="bans-tab" class="hidden">
  <div class="add-ban">
    <input id="ban-ip" placeholder="IP address">
    <input id="ban-reason" placeholder="Reason (optional)">
    <button onclick="addBan()">[ban ip]</button>
  </div>
  <div class="ban-list" id="ban-list"></div>
</div>

<script>
const PASSWORD = new URLSearchParams(location.search).get('password');
const BASE = location.origin;

function api(path, opts) {
  return fetch(BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Password': PASSWORD, ...(opts?.headers || {}) }
  }).then(r => r.json());
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.textContent.toLowerCase().includes(name)));
  document.getElementById('submissions-tab').classList.toggle('hidden', name !== 'submissions');
  document.getElementById('bans-tab').classList.toggle('hidden', name !== 'bans');
  if (name === 'bans') loadBans();
}

async function loadSubmissions() {
  const data = await api('/admin/submissions');
  document.getElementById('stats').textContent = data.submissions.length + ' submissions';
  const grid = document.getElementById('grid');
  grid.innerHTML = data.submissions.map(s => \`
    <div class="card">
      <img src="\${s.dataUrl}" />
      <div class="title">\${s.title || '(untitled)'}</div>
      <div class="meta">ID: \${s.id} | IP: \${s.ip || 'unknown'}</div>
      <div class="meta">\${s.created_at}</div>
      <div class="actions">
        <button class="btn-delete" onclick="del(\${s.id})">[delete]</button>
        \${s.ip ? \`<button class="btn-ban" onclick="banFromSubmission(\${s.id}, '\${s.ip}')">[ban ip]</button>\` : ''}
      </div>
    </div>
  \`).join('');
}

async function del(id) {
  if (!confirm('Delete submission ' + id + '?')) return;
  await api('/admin/delete', { method: 'POST', body: JSON.stringify({ id }) });
  loadSubmissions();
}

async function banFromSubmission(id, ip) {
  const deleteAll = confirm('Ban IP ' + ip + ' and delete ALL their submissions?');
  await api('/admin/ban', { method: 'POST', body: JSON.stringify({ ip, deleteSubmissions: deleteAll }) });
  loadSubmissions();
}

async function loadBans() {
  const data = await api('/admin/bans');
  const list = document.getElementById('ban-list');
  list.innerHTML = data.bans.map(b => \`
    <div class="ban-row">
      <span>\${b.ip} \${b.reason ? '- ' + b.reason : ''} <small>(\${b.created_at})</small></span>
      <button onclick="unban('\${b.ip}')">[unban]</button>
    </div>
  \`).join('') || '<p>No bans</p>';
}

async function addBan() {
  const ip = document.getElementById('ban-ip').value.trim();
  if (!ip) return;
  const reason = document.getElementById('ban-reason').value.trim();
  await api('/admin/ban', { method: 'POST', body: JSON.stringify({ ip, reason, deleteSubmissions: true }) });
  document.getElementById('ban-ip').value = '';
  document.getElementById('ban-reason').value = '';
  loadBans();
  loadSubmissions();
}

async function unban(ip) {
  await api('/admin/unban', { method: 'POST', body: JSON.stringify({ ip }) });
  loadBans();
}

loadSubmissions();
</script>
</body>
</html>`;

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    await ensureTables(env.DB);

    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // --- Admin routes ---
    if (url.pathname.startsWith("/admin")) {
      const password = url.searchParams.get("password") ?? req.headers.get("x-admin-password");
      if (password !== env.ADMIN_PASSWORD) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
      }

      if (url.pathname === "/admin" || url.pathname === "/admin/") {
        return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html", "Cache-Control": "no-store" } });
      }

      if (url.pathname === "/admin/submissions") {
        const { results: rows } = await env.DB.prepare(
          "SELECT id, dataUrl, title, pixelRatio, who, ip, created_at FROM broider_submissions2 ORDER BY created_at DESC",
        ).all();
        return Response.json({ submissions: rows });
      }

      if (url.pathname === "/admin/bans") {
        const { results: rows } = await env.DB.prepare(
          "SELECT ip, reason, created_at FROM ip_bans ORDER BY created_at DESC",
        ).all();
        return Response.json({ bans: rows });
      }

      if (url.pathname === "/admin/delete" && req.method === "POST") {
        const body = await req.json() as { id: number };
        await env.DB.prepare("DELETE FROM broider_submissions2 WHERE id = ?").bind(body.id).run();
        return Response.json({ ok: true });
      }

      if (url.pathname === "/admin/ban" && req.method === "POST") {
        const body = await req.json() as { ip: string; reason?: string; deleteSubmissions?: boolean };
        await env.DB.prepare("INSERT OR IGNORE INTO ip_bans (ip, reason) VALUES (?, ?)").bind(body.ip, body.reason ?? "").run();
        if (body.deleteSubmissions) {
          await env.DB.prepare("DELETE FROM broider_submissions2 WHERE ip = ?").bind(body.ip).run();
        }
        return Response.json({ ok: true });
      }

      if (url.pathname === "/admin/unban" && req.method === "POST") {
        const body = await req.json() as { ip: string };
        await env.DB.prepare("DELETE FROM ip_bans WHERE ip = ?").bind(body.ip).run();
        return Response.json({ ok: true });
      }

      return Response.json({ error: "not found" }, { status: 404 });
    }

    // --- Public routes ---
    if (req.method === "POST") {
      const clientIP = getClientIP(req);
      if (await isIPBanned(clientIP, env.DB)) {
        return Response.json({ error: "banned" }, { status: 403, headers: corsHeaders });
      }
      const body = await req.json() as { dataUrl: string; title: string; pixelRatio: number; who: string };
      await env.DB.prepare(
        "INSERT INTO broider_submissions2 (dataUrl, title, pixelRatio, who, ip) VALUES (?, ?, ?, ?, ?)",
      ).bind(body.dataUrl, body.title, body.pixelRatio ?? 1, body.who ?? "", clientIP).run();
    }

    return getSubmissions(url, env.DB);
  },
};
