// /api/admin/settings — read (GET) and save (POST) the site settings.
// Only the six known keys are accepted; phone numbers must be digits.
import { dbQuery } from '../../../lib/db';
import { requireAdmin, str, methodNotAllowed } from '../../../lib/admin-api';

const KEYS = ['site_name', 'site_url', 'phone_display', 'phone_tel', 'whatsapp', 'email'];

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const rows = await dbQuery('SELECT `key`, `value` FROM settings');
      const out = {};
      for (const r of rows) out[r.key] = r.value;
      return res.json({ ok: true, settings: out });
    }
    if (req.method === 'POST') {
      const b = (req.body && req.body.settings) || {};
      for (const key of KEYS) {
        if (!(key in b)) continue;
        let v = str(b[key], 200);
        if (key === 'phone_tel' || key === 'whatsapp') {
          v = v.replace(/\D/g, '');
          if (v && (v.length < 9 || v.length > 15)) {
            return res.status(400).json({ ok: false, error: 'Phone number looks wrong — use digits only.' });
          }
        }
        if (key === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return res.status(400).json({ ok: false, error: 'Email address looks wrong.' });
        }
        if (key === 'site_url' && v && !/^https?:\/\//.test(v)) {
          return res.status(400).json({ ok: false, error: 'Site URL must start with http:// or https://.' });
        }
        await dbQuery(
          'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
          [key, v]
        );
      }
      return res.json({ ok: true });
    }
    return methodNotAllowed(req, res);
  } catch (e) {
    console.error('admin settings failed:', e.message);
    return res.status(500).json({ ok: false, error: 'Database error. Please try again.' });
  }
}
