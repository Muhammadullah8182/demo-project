// Admin auth: password hashing (scrypt, built into Node — no extra
// dependency) and HMAC-signed session cookies (stateless, no session table).
// Session secret comes from the SESSION_SECRET env var; without it a random
// per-process secret is used (sessions then die when the app restarts).
import crypto from 'node:crypto';

export const COOKIE_NAME = 'urc_admin';
const SESSION_DAYS = 7;

function getSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (!global.__urc_secret) global.__urc_secret = crypto.randomBytes(32).toString('hex');
  return global.__urc_secret;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  try {
    const parts = String(stored || '').split(':');
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
    const [, salt, hash] = parts;
    const calc = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    if (calc.length !== expected.length) return false;
    return crypto.timingSafeEqual(calc, expected);
  } catch {
    return false;
  }
}

export function makeSessionToken(userId) {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expiry}`;
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}.${sig}`).toString('base64url');
}

export function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(String(token || ''), 'base64url').toString('utf8');
    const [userId, expiry, sig] = decoded.split('.');
    if (!userId || !expiry || !sig) return null;
    if (Number(expiry) < Date.now()) return null;
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(`${userId}.${expiry}`)
      .digest('hex');
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return { userId: Number(userId), expiry: Number(expiry) };
  } catch {
    return null;
  }
}

function cookieFlags() {
  // Secure only when explicitly enabled (SESSION_COOKIE_SECURE=1) so the
  // login still works on plain-http local testing.
  return process.env.SESSION_COOKIE_SECURE === '1' ? '; Secure' : '';
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${
    SESSION_DAYS * 24 * 60 * 60
  }${cookieFlags()}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${cookieFlags()}`;
}

// Read the session user id from an incoming request (Next.js req object).
export function getSessionUserId(req) {
  const cookie = req && req.headers && req.headers.cookie ? req.headers.cookie : '';
  const m = cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=([^;]+)'));
  if (!m) return null;
  let token = m[1];
  try {
    token = decodeURIComponent(token);
  } catch {
    /* keep raw */
  }
  const session = verifySessionToken(token);
  return session ? session.userId : null;
}
