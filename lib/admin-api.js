// Shared helpers for the admin API routes.
import { getSessionUserId } from './auth';

export function requireAdmin(req, res) {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: 'Please log in.' });
    return null;
  }
  return userId;
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function str(v, max = 1000) {
  return String(v ?? '').trim().slice(0, max);
}

export function num(v, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

export function int(v, def = 0) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

export function methodNotAllowed(req, res) {
  return res.status(405).json({ ok: false, error: 'Method not allowed.' });
}
