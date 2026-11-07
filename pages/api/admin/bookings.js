// /api/admin/bookings — list bookings (GET) and change a status (POST).
import { dbQuery } from '../../../lib/db';
import { requireAdmin, methodNotAllowed } from '../../../lib/admin-api';

const STATUSES = ['new', 'confirmed', 'completed', 'cancelled'];

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const rows = await dbQuery('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200');
      return res.json({ ok: true, bookings: rows });
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (b.action !== 'status') {
        return res.status(400).json({ ok: false, error: 'Unknown action.' });
      }
      const id = Number(b.id);
      const status = String(b.status || '');
      if (!id || !STATUSES.includes(status)) {
        return res.status(400).json({ ok: false, error: 'Invalid booking or status.' });
      }
      await dbQuery('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
      return res.json({ ok: true });
    }
    return methodNotAllowed(req, res);
  } catch (e) {
    console.error('admin bookings failed:', e.message);
    return res.status(500).json({ ok: false, error: 'Database error. Please try again.' });
  }
}
