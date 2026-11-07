// POST /api/booking — saves a booking to MySQL and returns the URC- ref.
// On database failure it returns 500 {ok:false}; the booking modal then
// falls back to a locally generated ref + WhatsApp (same behaviour as the
// old booking.php endpoint).
import { dbQuery } from '../../lib/db';
import { bookingRef } from '../../lib/site-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }
  const data = req.body || {};
  const type = data.type === 'taxi' ? 'taxi' : 'selfdrive';
  const name = String(data.name || '').trim();
  const phone = String(data.phone || '').trim();
  if (name.length < 2) {
    return res.status(400).json({ ok: false, error: 'Please enter your full name.' });
  }
  if (!/^[+\d][\d\s\-()]{6,18}$/.test(phone)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid mobile number.' });
  }
  const email = String(data.email || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  const ref = bookingRef();
  const details =
    data.details && typeof data.details === 'object' ? data.details : {};
  try {
    await dbQuery(
      'INSERT INTO bookings (ref, type, name, phone, email, vehicle, flight, notes, details, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        ref,
        type,
        name.slice(0, 80),
        phone.slice(0, 25),
        email.slice(0, 80),
        String(data.vehicle || '').slice(0, 60),
        String(data.flight || '').slice(0, 20),
        String(data.notes || '').slice(0, 500),
        JSON.stringify(details),
        'new',
      ]
    );
    return res.status(200).json({ ok: true, ref });
  } catch (e) {
    console.error('booking save failed:', e.message);
    return res
      .status(500)
      .json({ ok: false, error: 'Could not save booking. Please try again.' });
  }
}
