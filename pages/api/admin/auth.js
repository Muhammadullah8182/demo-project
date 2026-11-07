// POST /api/admin/auth — login, first-run setup, logout.
// No default password exists: the first visit creates the admin account.
import { dbQuery } from '../../../lib/db';
import {
  hashPassword,
  verifyPassword,
  makeSessionToken,
  sessionCookie,
  clearSessionCookie,
} from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }
  const { action, username, password } = req.body || {};
  try {
    if (action === 'logout') {
      res.setHeader('Set-Cookie', clearSessionCookie());
      return res.json({ ok: true });
    }

    if (action === 'setup') {
      const users = await dbQuery('SELECT COUNT(*) AS n FROM admin_users');
      if (Number(users[0].n) > 0) {
        return res
          .status(400)
          .json({ ok: false, error: 'Admin already set up. Please log in.' });
      }
      const u = String(username || '').trim();
      const p = String(password || '');
      if (u.length < 3) {
        return res
          .status(400)
          .json({ ok: false, error: 'Username must be at least 3 characters.' });
      }
      if (p.length < 8) {
        return res
          .status(400)
          .json({ ok: false, error: 'Password must be at least 8 characters.' });
      }
      const r = await dbQuery('INSERT INTO admin_users (username, pass_hash) VALUES (?, ?)', [
        u,
        hashPassword(p),
      ]);
      res.setHeader('Set-Cookie', sessionCookie(makeSessionToken(r.insertId)));
      return res.json({ ok: true });
    }

    if (action === 'login') {
      const u = String(username || '').trim();
      const p = String(password || '');
      const rows = await dbQuery(
        'SELECT id, pass_hash FROM admin_users WHERE username = ? LIMIT 1',
        [u]
      );
      if (!rows.length || !verifyPassword(p, rows[0].pass_hash)) {
        return res
          .status(401)
          .json({ ok: false, error: 'Wrong username or password.' });
      }
      res.setHeader('Set-Cookie', sessionCookie(makeSessionToken(rows[0].id)));
      return res.json({ ok: true });
    }

    return res.status(400).json({ ok: false, error: 'Unknown action.' });
  } catch (e) {
    console.error('admin auth failed:', e.message);
    return res.status(500).json({
      ok: false,
      error: 'Database unavailable. Check the DB settings and try again.',
    });
  }
}
