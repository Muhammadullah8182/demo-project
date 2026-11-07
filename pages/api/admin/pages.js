// /api/admin/pages — list page SEO/hero rows (GET) and update one (POST).
// The URL slug is NEVER changed here: changing a live URL would break its
// Google ranking. Only title, meta description, H1, hero text and the
// optional intro HTML are editable.
import { dbQuery } from '../../../lib/db';
import { requireAdmin, str, methodNotAllowed } from '../../../lib/admin-api';
import { PAGE_SLUGS } from '../../../lib/page-meta';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const rows = await dbQuery('SELECT * FROM pages ORDER BY slug ASC');
      return res.json({ ok: true, pages: rows });
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (b.action !== 'update') {
        return res.status(400).json({ ok: false, error: 'Unknown action.' });
      }
      const slug = String(b.slug || '');
      if (!PAGE_SLUGS.includes(slug)) {
        return res.status(400).json({ ok: false, error: 'Unknown page.' });
      }
      await dbQuery(
        'UPDATE pages SET title = ?, meta_description = ?, h1 = ?, hero_title = ?, hero_subtitle = ?, body_html = ? WHERE slug = ?',
        [
          str(b.title, 200),
          str(b.meta_description, 300),
          str(b.h1, 200),
          str(b.hero_title, 200),
          str(b.hero_subtitle, 300),
          str(b.body_html, 20000),
          slug,
        ]
      );
      return res.json({ ok: true });
    }
    return methodNotAllowed(req, res);
  } catch (e) {
    console.error('admin pages failed:', e.message);
    return res.status(500).json({ ok: false, error: 'Database error. Please try again.' });
  }
}
