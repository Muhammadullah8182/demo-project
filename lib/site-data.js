// Server-side site data: MySQL first, hardcoded fallback second.
// Every public page loads through getSiteData() in getServerSideProps, so an
// edit in the dashboard shows on the live site immediately — no rebuild.
// If the database is unreachable (or a query fails), the page renders with
// the exact current values from data/site.js instead of a blank page.
// This file is server-only: it is imported only inside getServerSideProps
// and API routes, never by browser components.
import { dbQuery } from './db';
import {
  SITE_URL,
  WHATSAPP_NUMBER,
  PHONE_DISPLAY,
  EMAIL,
  CARS,
  POSTS,
  fmtDate,
} from '../data/site';

// ---- Settings ----
const DEFAULT_SETTINGS = {
  site_name: 'UAE Rental Car',
  site_url: SITE_URL,
  phone_display: PHONE_DISPLAY,
  phone_tel: '971555523231',
  whatsapp: WHATSAPP_NUMBER,
  email: EMAIL,
};

export async function getSettings() {
  try {
    const rows = await dbQuery('SELECT `key`, `value` FROM settings');
    const s = { ...DEFAULT_SETTINGS };
    for (const r of rows) {
      if (r.key in s && r.value !== null && r.value !== '') s[r.key] = r.value;
    }
    return s;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// ---- Cars ----
function mapCar(r) {
  const name = [r.name, r.year].filter(Boolean).join(' ');
  return {
    id: r.id,
    name,
    daily: Number(r.price_day),
    weekly: Number(r.price_week),
    monthly: Number(r.price_month),
    seats: Number(r.seats) || 5,
    bags: Number(r.bags) || 3,
    trans: r.trans || 'Automatic',
    fuel: r.fuel || 'Petrol',
    deposit: r.deposit || '',
    best: r.badge || '',
    img: r.image || '',
    alt: r.alt || name,
  };
}

export async function getCars() {
  try {
    const rows = await dbQuery(
      'SELECT * FROM cars WHERE active = 1 ORDER BY sort ASC, id ASC'
    );
    if (!rows.length) return CARS;
    return rows.map(mapCar);
  } catch {
    return CARS;
  }
}

export async function getCarsAll() {
  try {
    const rows = await dbQuery('SELECT * FROM cars ORDER BY sort ASC, id ASC');
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      year: r.year,
      category: r.category || '',
      price_day: Number(r.price_day),
      price_week: Number(r.price_week),
      price_month: Number(r.price_month),
      seats: Number(r.seats) || 5,
      bags: Number(r.bags) || 3,
      trans: r.trans || 'Automatic',
      fuel: r.fuel || 'Petrol',
      deposit: r.deposit || '',
      badge: r.badge || '',
      image: r.image || '',
      alt: r.alt || '',
      active: Number(r.active) === 1,
      sort: Number(r.sort) || 0,
    }));
  } catch {
    return null; // DB error — the admin page reports it, it does not guess
  }
}

// ---- Blog posts ----
function mapPost(r) {
  const date = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date || '').slice(0, 10);
  const updated =
    r.updated_at instanceof Date
      ? r.updated_at.toISOString().slice(0, 19).replace('T', ' ')
      : String(r.updated_at || r.date || '').slice(0, 19);
  return {
    slug: r.slug,
    title: r.title,
    date,
    updated,
    keyword: r.keyword || '',
    excerpt: r.excerpt || '',
    meta_title: r.meta_title || '',
    meta_desc: r.meta_desc || '',
    content: r.content || '',
  };
}

export async function getPosts() {
  try {
    const rows = await dbQuery(
      "SELECT * FROM posts WHERE status = 'live' ORDER BY date DESC, id DESC"
    );
    if (!rows.length) return POSTS;
    return rows.map(mapPost);
  } catch {
    return POSTS;
  }
}

export async function getPost(slug) {
  try {
    const rows = await dbQuery(
      "SELECT * FROM posts WHERE slug = ? AND status = 'live' LIMIT 1",
      [slug]
    );
    if (!rows.length) return POSTS.find((p) => p.slug === slug) || null;
    return mapPost(rows[0]);
  } catch {
    return POSTS.find((p) => p.slug === slug) || null;
  }
}

export async function getPostsAll() {
  try {
    const rows = await dbQuery('SELECT * FROM posts ORDER BY date DESC, id DESC');
    return rows.map((r) => ({ ...mapPost(r), status: r.status || 'live' }));
  } catch {
    return null;
  }
}

// ---- Pages (SEO + hero text) ----
export async function getPagesMap() {
  try {
    const rows = await dbQuery('SELECT * FROM pages');
    const map = {};
    for (const r of rows) {
      map[r.slug] = {
        slug: r.slug,
        title: r.title || '',
        meta_description: r.meta_description || '',
        h1: r.h1 || '',
        hero_title: r.hero_title || '',
        hero_subtitle: r.hero_subtitle || '',
        body_html: r.body_html || '',
      };
    }
    return map;
  } catch {
    return {};
  }
}

export async function getPageRow(slug) {
  const map = await getPagesMap();
  return map[slug] || null;
}

// ---- One call for public pages ----
export async function getSiteData() {
  const [settings, cars, posts, pages] = await Promise.all([
    getSettings(),
    getCars(),
    getPosts(),
    getPagesMap(),
  ]);
  return { settings, cars, posts, pages };
}

// ---- Bookings ----
export function bookingRef() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return (
    'URC-' +
    d.getFullYear() +
    p(d.getMonth() + 1) +
    p(d.getDate()) +
    '-' +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export async function getBookings(limit = 100) {
  try {
    const rows = await dbQuery(
      'SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?',
      [Number(limit) || 100]
    );
    return rows.map((r) => ({
      id: r.id,
      ref: r.ref,
      type: r.type,
      created: r.created_at instanceof Date ? r.created_at.toISOString().slice(0, 19).replace('T', ' ') : String(r.created_at || ''),
      name: r.name,
      phone: r.phone,
      email: r.email || '',
      vehicle: r.vehicle || '',
      flight: r.flight || '',
      notes: r.notes || '',
      details: safeJson(r.details, {}),
      status: r.status || 'new',
    }));
  } catch {
    return null;
  }
}

export function safeJson(text, fallback) {
  try {
    return JSON.parse(text || '');
  } catch {
    return fallback;
  }
}

// Re-exported for pages that format dates from DB rows.
export { fmtDate };
