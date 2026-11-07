// /api/admin/posts — full blog CRUD (GET list, POST create/update/delete).
// The slug is fixed after creation: changing a live article URL would break
// its Google ranking, so updates never change the slug.
import { dbQuery } from '../../../lib/db';
import { requireAdmin, str, slugify, methodNotAllowed } from '../../../lib/admin-api';

function validDate(d) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(d || '')) ? d : new Date().toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const rows = await dbQuery('SELECT * FROM posts ORDER BY date DESC, id DESC');
      return res.json({ ok: true, posts: rows });
    }
    if (req.method === 'POST') {
      const b = req.body || {};

      if (b.action === 'create') {
        const slug = slugify(b.slug || b.title);
        const title = str(b.title, 200);
        if (!slug || !title) {
          return res.status(400).json({ ok: false, error: 'Title is required.' });
        }
        const dup = await dbQuery('SELECT slug FROM posts WHERE slug = ? LIMIT 1', [slug]);
        if (dup.length) {
          return res.status(400).json({ ok: false, error: 'A post with this URL already exists.' });
        }
        await dbQuery(
          'INSERT INTO posts (slug, title, meta_title, meta_desc, keyword, excerpt, content, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            slug,
            title,
            str(b.meta_title, 200),
            str(b.meta_desc, 300),
            str(b.keyword, 80),
            str(b.excerpt, 300),
            str(b.content, 100000),
            validDate(b.date),
            b.status === 'draft' ? 'draft' : 'live',
          ]
        );
        return res.json({ ok: true, slug });
      }

      if (b.action === 'update') {
        const slug = String(b.slug || '');
        const title = str(b.title, 200);
        if (!slug || !title) {
          return res.status(400).json({ ok: false, error: 'Post slug and title are required.' });
        }
        await dbQuery(
          'UPDATE posts SET title = ?, meta_title = ?, meta_desc = ?, keyword = ?, excerpt = ?, content = ?, date = ?, status = ? WHERE slug = ?',
          [
            title,
            str(b.meta_title, 200),
            str(b.meta_desc, 300),
            str(b.keyword, 80),
            str(b.excerpt, 300),
            str(b.content, 100000),
            validDate(b.date),
            b.status === 'draft' ? 'draft' : 'live',
            slug,
          ]
        );
        return res.json({ ok: true });
      }

      if (b.action === 'delete') {
        const slug = String(b.slug || '');
        await dbQuery('DELETE FROM posts WHERE slug = ?', [slug]);
        return res.json({ ok: true });
      }

      return res.status(400).json({ ok: false, error: 'Unknown action.' });
    }
    return methodNotAllowed(req, res);
  } catch (e) {
    console.error('admin posts failed:', e.message);
    return res.status(500).json({ ok: false, error: 'Database error. Please try again.' });
  }
}
