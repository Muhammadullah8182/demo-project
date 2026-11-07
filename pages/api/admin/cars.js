// /api/admin/cars — full fleet CRUD (GET list, POST create/update/delete).
import { dbQuery } from '../../../lib/db';
import { requireAdmin, str, num, int, slugify, methodNotAllowed } from '../../../lib/admin-api';

const CAR_FIELDS = [
  'name', 'year', 'category', 'price_day', 'price_week', 'price_month',
  'seats', 'bags', 'trans', 'fuel', 'deposit', 'badge', 'image', 'alt',
  'active', 'sort',
];

function carValues(b) {
  return {
    name: str(b.name, 80),
    year: int(b.year, 0) || null,
    category: str(b.category, 40),
    price_day: num(b.price_day, 0),
    price_week: num(b.price_week, 0),
    price_month: num(b.price_month, 0),
    seats: int(b.seats, 5),
    bags: int(b.bags, 3),
    trans: str(b.trans, 20) || 'Automatic',
    fuel: str(b.fuel, 20) || 'Petrol',
    deposit: str(b.deposit, 40),
    badge: str(b.badge, 40),
    image: str(b.image, 255),
    alt: str(b.alt, 160),
    active: b.active === false || b.active === 0 || b.active === '0' ? 0 : 1,
    sort: int(b.sort, 0),
  };
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      const rows = await dbQuery('SELECT * FROM cars ORDER BY sort ASC, id ASC');
      return res.json({ ok: true, cars: rows });
    }
    if (req.method === 'POST') {
      const b = req.body || {};

      if (b.action === 'create') {
        const v = carValues(b);
        if (!v.name) return res.status(400).json({ ok: false, error: 'Car name is required.' });
        let id = slugify(b.id || v.name);
        if (!id) return res.status(400).json({ ok: false, error: 'Could not make an id from the name.' });
        const dup = await dbQuery('SELECT id FROM cars WHERE id = ? LIMIT 1', [id]);
        if (dup.length) {
          return res.status(400).json({ ok: false, error: 'A car with this id already exists.' });
        }
        await dbQuery(
          `INSERT INTO cars (id, ${CAR_FIELDS.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, v.name, v.year, v.category, v.price_day, v.price_week, v.price_month, v.seats, v.bags, v.trans, v.fuel, v.deposit, v.badge, v.image, v.alt, v.active, v.sort]
        );
        return res.json({ ok: true, id });
      }

      if (b.action === 'update') {
        const id = String(b.id || '');
        const v = carValues(b);
        if (!id || !v.name) {
          return res.status(400).json({ ok: false, error: 'Car id and name are required.' });
        }
        await dbQuery(
          `UPDATE cars SET ${CAR_FIELDS.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
          [v.name, v.year, v.category, v.price_day, v.price_week, v.price_month, v.seats, v.bags, v.trans, v.fuel, v.deposit, v.badge, v.image, v.alt, v.active, v.sort, id]
        );
        return res.json({ ok: true });
      }

      if (b.action === 'delete') {
        const id = String(b.id || '');
        const count = await dbQuery('SELECT COUNT(*) AS n FROM cars');
        if (Number(count[0].n) <= 1) {
          return res.status(400).json({
            ok: false,
            error: 'Keep at least one car on the website — the fleet cannot be empty.',
          });
        }
        await dbQuery('DELETE FROM cars WHERE id = ?', [id]);
        return res.json({ ok: true });
      }

      return res.status(400).json({ ok: false, error: 'Unknown action.' });
    }
    return methodNotAllowed(req, res);
  } catch (e) {
    console.error('admin cars failed:', e.message);
    return res.status(500).json({ ok: false, error: 'Database error. Please try again.' });
  }
}
