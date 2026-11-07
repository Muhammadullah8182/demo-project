// /admin — login / first-run setup / full dashboard.
// Same v2 look as the PHP dashboard (emerald sidebar, warm background,
// rounded cards). All data is loaded server-side; edits save through the
// /api/admin/* routes and show on the live site immediately — no rebuild.
import { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export async function getServerSideProps({ req }) {
  const { getSessionUserId } = await import('../../lib/auth');
  const { dbPing, dbQuery } = await import('../../lib/db');
  const siteData = await import('../../lib/site-data');

  // 1. Database must be reachable for anything admin-related.
  try {
    await dbPing();
  } catch (e) {
    return { props: { authed: false, dbOk: false, dbError: e.message || 'Cannot connect to the database.' } };
  }

  // 2. First run? (no admin users yet -> show the setup form)
  let needsSetup = false;
  try {
    const rows = await dbQuery('SELECT COUNT(*) AS n FROM admin_users');
    needsSetup = Number(rows[0].n) === 0;
  } catch (e) {
    return { props: { authed: false, dbOk: false, dbError: e.message } };
  }

  // 3. Logged in?
  const userId = getSessionUserId(req);
  if (!userId) {
    return { props: { authed: false, dbOk: true, needsSetup } };
  }

  // 4. Load everything the dashboard shows.
  const [settings, cars, posts, pages, bookings] = await Promise.all([
    siteData.getSettings(),
    siteData.getCarsAll(),
    siteData.getPostsAll(),
    siteData.getPagesMap(),
    siteData.getBookings(200),
  ]);
  const safeCars = cars || [];
  const safePosts = posts || [];
  const safeBookings = bookings || [];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const stats = {
    newBookings: safeBookings.filter((b) => b.status === 'new').length,
    totalBookings: safeBookings.length,
    totalPosts: safePosts.filter((p) => p.status === 'live').length,
    postsThisWeek: safePosts.filter((p) => (p.date || '') >= weekAgo).length,
    totalCars: safeCars.length,
    activeCars: safeCars.filter((c) => c.active).length,
  };
  return {
    props: {
      authed: true,
      dbOk: true,
      needsSetup: false,
      data: { settings, cars: safeCars, posts: safePosts, pages, bookings: safeBookings, stats },
    },
  };
}

async function api(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

const fmtAed = (n) => 'AED ' + Number(n || 0).toLocaleString('en-US');
const fmtDate = (ymd) => {
  const t = new Date((ymd || '') + 'T00:00:00');
  return isNaN(t) ? '' : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const waDigits = (phone) => String(phone || '').replace(/\D/g, '');

const ADMIN_CSS = `
.adm{font-family:'Segoe UI',system-ui,Arial,sans-serif;background:#f7f5ef;color:#1f2a24;line-height:1.6;min-height:100vh}
.adm *{box-sizing:border-box}
.adm a{color:#0b5c43}
.adm .btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 20px;border-radius:12px;font-weight:700;border:none;cursor:pointer;text-decoration:none;font-size:.95rem;min-height:46px}
.adm .btn-green{background:#0b5c43;color:#fff}
.adm .btn-green:hover{background:#073d2c}
.adm .btn-gold{background:linear-gradient(135deg,#c9a227,#f2c94c);color:#3a2c00;box-shadow:0 6px 16px rgba(201,162,39,.35)}
.adm .btn-red{background:#dc2626;color:#fff}
.adm .btn-ghost{background:#eef1f0;color:#1f2a24}
.adm .muted{color:#6b7a72}
.adm .ok{background:#dcfce7;color:#166534;padding:12px 16px;border-radius:12px;margin-bottom:16px;font-weight:600}
.adm .err{background:#fee2e2;color:#991b1b;padding:12px 16px;border-radius:12px;margin-bottom:16px;font-weight:600}
.adm .card{background:#fff;border-radius:20px;padding:22px;box-shadow:0 8px 24px rgba(11,92,67,.08);margin-bottom:16px}
.adm .dash{display:flex;min-height:100vh}
.adm .mobile-bar{display:none}
.adm .sidebar{width:248px;background:linear-gradient(180deg,#0b5c43,#073d2c);color:#fff;padding:24px 0 20px;flex-shrink:0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh}
.adm .brand{padding:0 24px 20px;border-bottom:1px solid rgba(255,255,255,.14)}
.adm .brand strong{font-size:21px;display:block}
.adm .brand small{color:#f2c94c;letter-spacing:3px;font-size:11px;font-weight:700}
.adm .side-nav{padding:16px 12px;display:flex;flex-direction:column;gap:3px}
.adm .side-nav button{color:rgba(255,255,255,.85);padding:12px 14px;border-radius:12px;font-weight:600;font-size:15px;display:flex;gap:11px;align-items:center;text-decoration:none;background:none;border:none;cursor:pointer;text-align:left;width:100%;font-family:inherit}
.adm .side-nav button.active{background:rgba(255,255,255,.14);color:#fff;box-shadow:inset 3px 0 0 #f2c94c}
.adm .side-nav button:hover{background:rgba(255,255,255,.08)}
.adm .side-nav .count{margin-left:auto;background:#f2c94c;color:#3a2c00;font-size:11px;font-weight:800;padding:2px 8px;border-radius:99px}
.adm .side-foot{margin-top:auto;padding:16px 24px;font-size:13px;color:rgba(255,255,255,.65);line-height:1.6}
.adm .side-foot b{color:#fff}
.adm .main{flex:1;padding:30px;min-width:0}
.adm .topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:12px}
.adm .topbar h1{font-size:27px;color:#0b5c43;margin:0}
.adm .topbar p{color:#6b7a72;font-size:14px;margin-top:2px}
.adm .top-actions{display:flex;gap:10px}
.adm .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}
.adm .stat{background:#fff;border-radius:20px;padding:20px;box-shadow:0 8px 24px rgba(11,92,67,.08);position:relative;overflow:hidden;text-align:left}
.adm .stat:after{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#0b5c43,#c9a227)}
.adm .stat .ic{font-size:26px}
.adm .stat small{color:#6b7a72;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:11px;display:block;margin:8px 0 2px}
.adm .stat strong{font-size:31px;color:#0b5c43}
.adm .stat span{font-size:13px;color:#6b7a72;display:block;margin-top:2px}
.adm .grid{display:grid;grid-template-columns:1.65fr 1fr;gap:16px;margin-bottom:16px}
.adm .panel{background:#fff;border-radius:20px;padding:22px;box-shadow:0 8px 24px rgba(11,92,67,.08);margin-bottom:0}
.adm .panel h2{font-size:18px;margin:0 0 16px;display:flex;justify-content:space-between;align-items:center}
.adm .panel h2 a{font-size:13px;color:#0b5c43;text-decoration:none}
.adm .panel h2 .muted{font-size:13px}
.adm table{width:100%;border-collapse:collapse;font-size:14px}
.adm th{text-align:left;color:#6b7a72;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:8px 6px;border-bottom:2px solid #f0ede4}
.adm td{padding:12px 6px;border-bottom:1px solid #f4f1e8;vertical-align:top}
.adm tr:last-child td{border-bottom:none}
.adm .ref{font-weight:800;color:#0b5c43;white-space:nowrap}
.adm .pill{display:inline-block;padding:4px 11px;border-radius:99px;font-size:12px;font-weight:700;white-space:nowrap}
.adm .pill-new{background:#fef3c7;color:#92400e}
.adm .pill-ok{background:#dcfce7;color:#166534}
.adm .pill-info{background:#dbeafe;color:#1e40af}
.adm .pill-neutral{background:#eef1f0;color:#4b5563}
.adm .wa-mini{background:#1faa53;color:#fff;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:700;white-space:nowrap;text-decoration:none;display:inline-block}
.adm .car-row{margin-bottom:16px}
.adm .car-row .row-top{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;gap:10px}
.adm .car-row .row-top strong{color:#0b5c43;white-space:nowrap}
.adm .kw{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #f4f1e8;font-size:14px;gap:10px}
.adm .kw:last-child{border-bottom:none}
.adm .pos{font-weight:800;color:#0b5c43;white-space:nowrap}
.adm .check{list-style:none;padding:0;margin:0}
.adm .check li{padding:10px 0;border-bottom:1px solid #f4f1e8;font-size:14px}
.adm .check li:last-child{border-bottom:none}
.adm .note{font-size:13px;color:#6b7a72;margin-top:12px;line-height:1.5}
.adm .qa .btn{width:100%;margin-bottom:10px}
.adm .qa .btn:last-child{margin-bottom:0}
.adm .field{margin-bottom:14px}
.adm label{display:block;font-weight:700;margin-bottom:6px;font-size:14px}
.adm input[type=text],.adm input[type=password],.adm input[type=number],.adm input[type=date],.adm select,.adm textarea{width:100%;padding:11px 12px;border:1.5px solid #d1d5db;border-radius:10px;font:inherit;font-size:14px;background:#fff;color:#1f2a24}
.adm input:focus,.adm select:focus,.adm textarea:focus{border-color:#0b5c43;outline:none}
.adm .hint{font-size:13px;color:#6b7a72;margin-top:4px}
.adm .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.adm .toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.adm .toolbar button{padding:8px 14px;border-radius:8px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-weight:700}
.adm .auth-wrap{max-width:460px;margin:80px auto;padding:0 16px}
.adm .row-actions{white-space:nowrap}
.adm .row-actions .btn{padding:8px 14px;min-height:0;font-size:.85rem;margin-right:6px}
.adm .danger{color:#991b1b}
.adm .warn-box{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:12px 14px;font-size:14px;margin-bottom:14px}
@media(max-width:900px){
  .adm .sidebar{display:none}
  .adm .mobile-bar{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(180deg,#0b5c43,#073d2c);color:#fff;padding:14px 18px;font-weight:700}
  .adm .mobile-bar a{color:#f2c94c;text-decoration:none;font-size:14px}
  .adm .dash{display:block}
  .adm .stats{grid-template-columns:repeat(2,1fr)}
  .adm .grid{grid-template-columns:1fr}
  .adm .main{padding:20px 16px}
  .adm .form-grid{grid-template-columns:1fr}
}
`;

// ---------- Login / first-run setup ----------
function AuthCard({ needsSetup }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (needsSetup && password !== password2) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await api('/api/admin/auth/', {
        action: needsSetup ? 'setup' : 'login',
        username,
        password,
      });
      router.reload();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="adm">
      <style jsx global>{ADMIN_CSS}</style>
      <Head>
        <title>{needsSetup ? 'Create admin account' : 'Dashboard login'} | UAE Rental Car</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="auth-wrap">
        <div className="card" style={{ borderTop: '4px solid #c9a227' }}>
          <h1 style={{ color: '#0b5c43', marginTop: 0 }}>
            {needsSetup ? 'Welcome! Create your admin account' : 'Dashboard login'}
          </h1>
          <p className="muted">
            {needsSetup
              ? 'This is a one-time setup. You will use this username and password to log in at /admin/.'
              : 'Log in to manage pages, fleet, blog posts and bookings.'}
          </p>
          {error && <div className="err">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="au_user">Username</label>
              <input
                id="au_user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                autoComplete="username"
                placeholder="e.g. admin"
              />
            </div>
            <div className="field">
              <label htmlFor="au_pass">{needsSetup ? 'New password' : 'Password'}</label>
              <input
                id="au_pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={needsSetup ? 'new-password' : 'current-password'}
                placeholder="At least 8 characters"
              />
            </div>
            {needsSetup && (
              <div className="field">
                <label htmlFor="au_pass2">Repeat password</label>
                <input
                  id="au_pass2"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="hint">Use a strong password you don&apos;t use elsewhere.</p>
              </div>
            )}
            <button className="btn btn-green" type="submit" disabled={busy} style={{ width: '100%' }}>
              {busy ? 'Please wait…' : needsSetup ? 'Create account & log in' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------- Shared bits ----------
function statusPill(status) {
  const cls =
    status === 'new' ? 'pill-new' : status === 'confirmed' ? 'pill-ok' : status === 'completed' ? 'pill-info' : 'pill-neutral';
  const label = status === 'new' ? 'NEW' : status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
  return <span className={`pill ${cls}`}>{label}</span>;
}

function tripLines(b) {
  const d = b.details || {};
  if (b.type === 'taxi') {
    return (
      <>
        🚕 Taxi
        <br />
        {d.pickup || ''} → {d.dropoff || ''}
        <br />
        <span className="muted">
          {d.date || ''} {d.time || ''}
        </span>
        {d.return_date ? (
          <>
            <br />
            <span className="muted">
              Return: {d.return_date} {d.return_time || ''}
            </span>
          </>
        ) : null}
      </>
    );
  }
  return (
    <>
      🚗 Self-drive
      <br />
      {d.location || ''}
      <br />
      <span className="muted">
        {d.from || ''} → {d.to || ''}
      </span>
    </>
  );
}

function BookingsTable({ bookings, showAll }) {
  const list = showAll ? bookings : bookings.slice(0, 8);
  if (!bookings.length) {
    return (
      <p className="muted">
        No bookings yet. When a visitor completes the booking form on the site, it appears here with a
        reference number.
      </p>
    );
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Ref</th>
            <th>Customer</th>
            <th>Trip</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((b) => {
            const wa = waDigits(b.phone);
            return (
              <tr key={b.id}>
                <td>
                  <span className="ref">{b.ref}</span>
                  <br />
                  <span className="muted" style={{ fontSize: '.8rem' }}>
                    {b.created}
                  </span>
                </td>
                <td>
                  <strong>{b.name}</strong>
                  <br />
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                    {b.phone}
                  </a>
                  <br />
                  <span className="muted">{b.vehicle || ''}</span>
                  {b.flight ? (
                    <>
                      <br />
                      <span className="muted">✈ {b.flight}</span>
                    </>
                  ) : null}
                  {b.notes ? (
                    <>
                      <br />
                      <span className="muted">&ldquo;{b.notes}&rdquo;</span>
                    </>
                  ) : null}
                </td>
                <td>{tripLines(b)}</td>
                <td>{statusPill(b.status)}</td>
                <td>
                  {wa ? (
                    <a className="wa-mini" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const PAGE_LIST = [
  { slug: 'home', label: 'Home', url: '/' },
  { slug: 'hotels', label: 'Hotels', url: '/hotels/' },
  { slug: 'locations', label: 'Locations', url: '/locations/' },
  { slug: 'contact', label: 'Contact', url: '/contact/' },
  { slug: 'taxi', label: 'Taxi', url: '/taxi/' },
  { slug: 'compare', label: 'Compare', url: '/compare/' },
  { slug: 'monthly-rental', label: 'Monthly Rental', url: '/monthly-rental/' },
  { slug: 'no-deposit', label: 'No Deposit', url: '/no-deposit/' },
  { slug: 'privacy', label: 'Privacy Policy', url: '/privacy/' },
  { slug: 'terms', label: 'Terms & Conditions', url: '/terms/' },
  { slug: 'ar', label: 'Arabic landing', url: '/ar/' },
  { slug: 'blog', label: 'Blog list', url: '/blog/' },
];

// ---------- Dashboard (overview) tab ----------
function DashboardTab({ data, goTab, openPost }) {
  const { stats, bookings, cars, posts, settings } = data;
  return (
    <>
      <div className="stats">
        <div className="stat">
          <span className="ic">📩</span>
          <small>New bookings</small>
          <strong>{stats.newBookings}</strong>
          <span>{stats.newBookings > 0 ? 'waiting for your reply' : "you're all caught up"}</span>
        </div>
        <div className="stat">
          <span className="ic">📋</span>
          <small>Total bookings</small>
          <strong>{stats.totalBookings}</strong>
          <span>all time</span>
        </div>
        <div className="stat">
          <span className="ic">📝</span>
          <small>Total posts</small>
          <strong>{stats.totalPosts}</strong>
          <span>live on the blog</span>
        </div>
        <div className="stat">
          <span className="ic">🚙</span>
          <small>Fleet cars</small>
          <strong>{stats.activeCars}</strong>
          <span>
            {stats.totalCars} in the fleet{stats.totalCars !== stats.activeCars ? ` (${stats.totalCars - stats.activeCars} hidden)` : ''}
          </span>
        </div>
      </div>

      <div className="grid">
        <div className="panel" id="bookings">
          <h2>
            📩 Booking requests <span className="muted">{stats.totalBookings} total</span>
          </h2>
          <BookingsTable bookings={bookings} />
          {bookings.length > 8 ? (
            <p className="note">
              <a href="#" onClick={(e) => { e.preventDefault(); goTab('bookings'); }} style={{ color: '#0b5c43', fontWeight: 700 }}>
                See all bookings →
              </a>
            </p>
          ) : null}
        </div>

        <div className="panel">
          <h2>🚙 Fleet on the website</h2>
          {cars.length === 0 && <p className="muted">No cars yet — add your first car in the Fleet tab.</p>}
          {cars.map((c) => (
            <div className="car-row" key={c.id}>
              <div className="row-top">
                <span>
                  {c.name} {c.year || ''}
                  {c.active ? '' : ' (hidden)'}
                </span>
                <strong>{fmtAed(c.price_day)}/day</strong>
              </div>
            </div>
          ))}
          <p className="note">
            <a href="#" onClick={(e) => { e.preventDefault(); goTab('fleet'); }} style={{ color: '#0b5c43', fontWeight: 700 }}>
              Manage fleet →
            </a>
          </p>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h2>📈 Google rankings</h2>
          {['rent a car dubai', 'taxi service dubai', 'no deposit car rental dubai', 'monthly car rental dubai', 'luxury car rental dubai', 'car rental dubai'].map((k) => (
            <div className="kw" key={k}>
              <span>{k}</span>
              <span className="pos">—</span>
            </div>
          ))}
          <p className="note">Sample layout — connect Google Search Console after launch to fill in real positions.</p>
        </div>

        <div className="panel" id="posts">
          <h2>
            📝 Blog posts{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); openPost('new'); }}>
              + New post
            </a>
          </h2>
          {posts.length === 0 && <p className="muted">No posts yet. Write your first SEO article with the button above.</p>}
          {posts.slice(0, 5).map((p) => (
            <div key={p.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f4f1e8', gap: 10 }}>
              <div>
                <strong style={{ fontSize: 14, display: 'block' }}>{p.title}</strong>
                <small className="muted">{fmtDate(p.date)} · {p.keyword || 'no focus keyword'}</small>
              </div>
              <span style={{ display: 'flex', gap: 6, whiteSpace: 'nowrap' }}>
                <span className={`pill ${p.status === 'live' ? 'pill-ok' : 'pill-neutral'}`}>{p.status === 'live' ? 'Live' : 'Draft'}</span>
                <button className="btn btn-ghost" style={{ padding: '6px 12px', minHeight: 0, fontSize: '.85rem' }} type="button" onClick={() => openPost(p.slug)}>
                  Edit
                </button>
              </span>
            </div>
          ))}
          {posts.length > 5 ? (
            <p className="note">
              <a href="#" onClick={(e) => { e.preventDefault(); goTab('blog'); }} style={{ color: '#0b5c43', fontWeight: 700 }}>
                See all posts →
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h2>✅ Daily SEO routine</h2>
          <ul className="check">
            <li><strong>Post daily:</strong> 1 article per day targeting one keyword (e.g. &ldquo;monthly car rental dubai&rdquo;, &ldquo;rent SUV dubai marina&rdquo;).</li>
            <li><strong>Internal links:</strong> link every post to your homepage and 1–2 related posts — this spreads ranking power.</li>
            <li><strong>Backlinks:</strong> share each post on Facebook, Instagram, TikTok &amp; WhatsApp groups; answer car-rental questions on forums/Quora linking back to the article.</li>
            <li><strong>Keyword in:</strong> title, first paragraph, one H2, meta title &amp; image alt text.</li>
            <li><strong>Length:</strong> aim for 400+ words per post.</li>
          </ul>
        </div>

        <div className="panel qa">
          <h2>⚡ Quick actions</h2>
          <button className="btn btn-gold" type="button" onClick={() => openPost('new')}>✏️ New blog post</button>
          <a className="btn btn-green" href={settings.site_url || '/'} target="_blank" rel="noreferrer">🌐 View website</a>
          <button className="btn btn-ghost" type="button" onClick={() => goTab('settings')}>⚙️ Site settings</button>
        </div>
      </div>
    </>
  );
}

// ---------- Pages tab ----------
function PagesTab({ pages, siteUrl, setMsg }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  function startEdit(slug) {
    const row = pages[slug] || {};
    setForm({
      title: row.title || '',
      meta_description: row.meta_description || '',
      h1: row.h1 || '',
      hero_title: row.hero_title || '',
      hero_subtitle: row.hero_subtitle || '',
      body_html: row.body_html || '',
    });
    setEditing(slug);
    setErr('');
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api('/api/admin/pages/', { action: 'update', slug: editing, ...form });
      setMsg('Page saved — it is live on the website now.');
      router.reload();
    } catch (err2) {
      setErr(err2.message);
      setBusy(false);
    }
  }

  const label = (PAGE_LIST.find((p) => p.slug === editing) || {}).label || editing;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>📄 Pages — titles, descriptions &amp; hero text</h2>
      <p className="muted">
        These are the words Google shows for each page. Changes go live the moment you save — no rebuild.
      </p>
      <div className="warn-box">
        ⚠️ <strong>Do not change a page&apos;s URL.</strong> The address (slug) is fixed — changing it would
        break the page&apos;s Google ranking. Only the title, description, headings and intro text are editable here.
      </div>
      {!editing && (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Page</th>
                <th>URL</th>
                <th>Title (Google)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {PAGE_LIST.map((p) => {
                const row = pages[p.slug] || {};
                return (
                  <tr key={p.slug}>
                    <td><strong>{p.label}</strong></td>
                    <td>
                      <a href={`${siteUrl.replace(/\/$/, '')}${p.url}`} target="_blank" rel="noreferrer">
                        {p.url}
                      </a>
                    </td>
                    <td>{row.title || '—'}</td>
                    <td className="row-actions">
                      <button className="btn btn-ghost" type="button" onClick={() => startEdit(p.slug)}>Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {editing && form && (
        <form onSubmit={save}>
          <h3 style={{ marginTop: 0 }}>Editing: {label}</h3>
          {err && <div className="err">{err}</div>}
          <div className="field">
            <label htmlFor="pg_title">Page title (shown on Google) *</label>
            <input id="pg_title" type="text" value={form.title} maxLength={200} required
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <p className="hint">{form.title.length}/200 — keep under 60 characters so Google doesn&apos;t cut it off.</p>
          </div>
          <div className="field">
            <label htmlFor="pg_md">Meta description</label>
            <textarea id="pg_md" rows={2} maxLength={300} value={form.meta_description}
              onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
            <p className="hint">{form.meta_description.length}/300 — keep under 155 characters.</p>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="pg_h1">H1 heading (on the page)</label>
              <input id="pg_h1" type="text" value={form.h1} maxLength={200}
                onChange={(e) => setForm({ ...form, h1: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="pg_ht">Hero title</label>
              <input id="pg_ht" type="text" value={form.hero_title} maxLength={200}
                onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="pg_hs">Hero subtitle</label>
            <input id="pg_hs" type="text" value={form.hero_subtitle} maxLength={300}
              onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="pg_body">Intro paragraph (optional, shown under the hero)</label>
            <textarea id="pg_body" rows={3} value={form.body_html}
              placeholder="<p>Your intro text here…</p>"
              onChange={(e) => setForm({ ...form, body_html: e.target.value })} />
            <p className="hint">Basic HTML is allowed. Leave empty to show nothing extra.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-green" type="submit" disabled={busy}>💾 Save page</button>
            <button className="btn btn-ghost" type="button" onClick={() => { setEditing(null); setForm(null); }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------- Fleet tab ----------
const EMPTY_CAR = {
  id: '', name: '', year: '', category: 'Economy', price_day: '', price_week: '', price_month: '',
  seats: 5, bags: 3, trans: 'Automatic', fuel: 'Petrol', deposit: 'No deposit',
  badge: '', image: '', alt: '', active: true, sort: 0,
};

function FleetTab({ cars, setMsg }) {
  const router = useRouter();
  const [editing, setEditing] = useState(null); // null = list, 'new' or car id
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  function startEdit(car) {
    if (car === 'new') {
      setForm({ ...EMPTY_CAR, sort: cars.length });
    } else {
      setForm({ ...car, active: !!car.active });
    }
    setEditing(car === 'new' ? 'new' : car.id);
    setErr('');
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      if (editing === 'new') {
        await api('/api/admin/cars/', { action: 'create', ...form });
        setMsg('Car added — it is live on the website now.');
      } else {
        await api('/api/admin/cars/', { action: 'update', id: editing, ...form });
        setMsg('Car saved — the new prices are live on the website now.');
      }
      router.reload();
    } catch (err2) {
      setErr(err2.message);
      setBusy(false);
    }
  }

  async function remove(car) {
    if (!window.confirm(`Delete ${car.name} ${car.year || ''} from the fleet?`)) return;
    setBusy(true);
    try {
      await api('/api/admin/cars/', { action: 'delete', id: car.id });
      setMsg('Car deleted.');
      router.reload();
    } catch (err2) {
      setErr(err2.message);
      setBusy(false);
    }
  }

  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🚙 Fleet — cars &amp; prices</h2>
      <p className="muted">Add, edit or hide cars. Prices update on the website the moment you save.</p>
      {err && <div className="err">{err}</div>}
      {!editing && (
        <>
          <p>
            <button className="btn btn-gold" type="button" onClick={() => startEdit('new')}>+ Add a car</button>
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Daily</th>
                  <th>Weekly</th>
                  <th>Monthly</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name} {c.year || ''}</strong>
                      <br />
                      <span className="muted">{c.category || ''}{c.badge ? ` · ${c.badge}` : ''}</span>
                    </td>
                    <td>{fmtAed(c.price_day)}</td>
                    <td>{fmtAed(c.price_week)}</td>
                    <td>{fmtAed(c.price_month)}</td>
                    <td>{c.active ? <span className="pill pill-ok">Live</span> : <span className="pill pill-neutral">Hidden</span>}</td>
                    <td className="row-actions">
                      <button className="btn btn-ghost" type="button" onClick={() => startEdit(c)}>Edit</button>
                      <button className="btn btn-red" type="button" onClick={() => remove(c)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cars.length === 0 && <p className="muted">No cars yet — add your first car with the button above.</p>}
        </>
      )}
      {editing && form && (
        <form onSubmit={save}>
          <h3 style={{ marginTop: 0 }}>{editing === 'new' ? 'Add a car' : `Edit: ${form.name}`}</h3>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_name">Car name *</label>
              <input id="car_name" type="text" value={form.name} required maxLength={80}
                placeholder="e.g. Toyota Camry" onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="car_year">Year</label>
              <input id="car_year" type="number" value={form.year} min={1990} max={2030}
                placeholder="e.g. 2024" onChange={(e) => set('year', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_cat">Category</label>
              <select id="car_cat" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option>Economy</option>
                <option>SUV</option>
                <option>Luxury</option>
                <option>Sports</option>
                <option>Van</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="car_badge">Badge (shown on the card)</label>
              <input id="car_badge" type="text" value={form.badge} maxLength={40}
                placeholder="e.g. Most popular" onChange={(e) => set('badge', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_day">Daily price (AED) *</label>
              <input id="car_day" type="number" value={form.price_day} required min={0}
                onChange={(e) => set('price_day', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="car_week">Weekly price (AED)</label>
              <input id="car_week" type="number" value={form.price_week} min={0}
                onChange={(e) => set('price_week', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_month">Monthly price (AED)</label>
              <input id="car_month" type="number" value={form.price_month} min={0}
                onChange={(e) => set('price_month', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="car_dep">Deposit</label>
              <input id="car_dep" type="text" value={form.deposit} maxLength={40}
                placeholder="e.g. No deposit" onChange={(e) => set('deposit', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_seats">Seats</label>
              <input id="car_seats" type="number" value={form.seats} min={2} max={9}
                onChange={(e) => set('seats', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="car_bags">Large bags</label>
              <input id="car_bags" type="number" value={form.bags} min={0} max={9}
                onChange={(e) => set('bags', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_trans">Gearbox</label>
              <select id="car_trans" value={form.trans} onChange={(e) => set('trans', e.target.value)}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="car_fuel">Fuel</label>
              <select id="car_fuel" value={form.fuel} onChange={(e) => set('fuel', e.target.value)}>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="car_img">Photo (image path)</label>
            <input id="car_img" type="text" value={form.image} maxLength={255}
              placeholder="/images/my-car.webp"
              onChange={(e) => set('image', e.target.value)} />
            <p className="hint">
              Upload the photo first in cPanel File Manager (inside the app folder: <code>public/images/</code>),
              then paste its path here, e.g. <code>/images/my-car.webp</code>.
            </p>
          </div>
          <div className="field">
            <label htmlFor="car_alt">Photo description (for Google)</label>
            <input id="car_alt" type="text" value={form.alt} maxLength={160}
              placeholder="e.g. White Toyota Camry 2024 for rent in Dubai"
              onChange={(e) => set('alt', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="car_sort">Order on the site</label>
              <input id="car_sort" type="number" value={form.sort}
                onChange={(e) => set('sort', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="car_active">Visible on the website?</label>
              <select id="car_active" value={form.active ? '1' : '0'}
                onChange={(e) => set('active', e.target.value === '1')}>
                <option value="1">Yes — live</option>
                <option value="0">No — hidden</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-green" type="submit" disabled={busy}>💾 Save car</button>
            <button className="btn btn-ghost" type="button" onClick={() => { setEditing(null); setForm(null); }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------- Blog tab ----------
const EMPTY_POST = {
  slug: '', title: '', meta_title: '', meta_desc: '', keyword: '', excerpt: '',
  content: '', date: new Date().toISOString().slice(0, 10), status: 'live',
};

function BlogTab({ posts, siteUrl, setMsg, editSlug, setEditSlug }) {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const contentRef = useRef(null);

  const editing = editSlug; // null = list, 'new' or a slug
  const isNew = editing === 'new';

  function startEdit(target) {
    if (target === 'new') {
      setForm({ ...EMPTY_POST });
    } else {
      const p = posts.find((x) => x.slug === target);
      if (!p) return;
      setForm({ ...p });
    }
    setEditSlug(target);
    setErr('');
  }

  function closeEdit() {
    setEditSlug(null);
    setForm(null);
  }

  function slugifyTitle(t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  }

  function insertTag(tag) {
    const ta = contentRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const sel = ta.value.slice(s, e) || 'text';
    let open = `<${tag}>`;
    let close = `</${tag}>`;
    if (tag === 'a') open = '<a href="PASTE-LINK-HERE">';
    if (tag === 'ul') {
      open = '<ul>\n<li>';
      close = '</li>\n<li></li>\n</ul>';
    }
    const next = ta.value.slice(0, s) + open + sel + close + ta.value.slice(e);
    setForm({ ...form, content: next });
    setTimeout(() => ta.focus(), 0);
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const payload = { ...form };
      if (isNew && !payload.slug) payload.slug = slugifyTitle(payload.title);
      if (isNew) {
        await api('/api/admin/posts/', { action: 'create', ...payload });
        setMsg('Post published — it is live on the blog now.');
      } else {
        await api('/api/admin/posts/', { action: 'update', ...payload });
        setMsg('Post saved — the updated article is live now.');
      }
      router.reload();
    } catch (err2) {
      setErr(err2.message);
      setBusy(false);
    }
  }

  async function remove(p) {
    if (!window.confirm(`Delete the post "${p.title}"?`)) return;
    setBusy(true);
    try {
      await api('/api/admin/posts/', { action: 'delete', slug: p.slug });
      setMsg('Post deleted.');
      router.reload();
    } catch (err2) {
      setErr(err2.message);
      setBusy(false);
    }
  }

  const set = (k, v) => setForm({ ...form, [k]: v });
  const wordCount = form ? form.content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>📝 Blog posts</h2>
      <p className="muted">Write SEO articles — each one targets one keyword. Published posts appear on the blog and in the sitemap at once.</p>
      {err && <div className="err">{err}</div>}
      {!editing && (
        <>
          <p>
            <button className="btn btn-gold" type="button" onClick={() => startEdit('new')}>+ New post</button>
          </p>
          {posts.length === 0 && <p className="muted">No posts yet. Write your first SEO article with the button above.</p>}
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Focus keyword</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.slug}>
                    <td>
                      <strong>{p.title}</strong>
                      <br />
                      <a className="muted" style={{ fontSize: '.8rem' }} href={`${siteUrl.replace(/\/$/, '')}/blog/${p.slug}/`} target="_blank" rel="noreferrer">
                        view →
                      </a>
                    </td>
                    <td>{fmtDate(p.date)}</td>
                    <td>{p.keyword || '—'}</td>
                    <td>{p.status === 'live' ? <span className="pill pill-ok">Live</span> : <span className="pill pill-neutral">Draft</span>}</td>
                    <td className="row-actions">
                      <button className="btn btn-ghost" type="button" onClick={() => startEdit(p.slug)}>Edit</button>
                      <button className="btn btn-red" type="button" onClick={() => remove(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {editing && form && (
        <form onSubmit={save}>
          <h3 style={{ marginTop: 0 }}>{isNew ? 'New blog post' : 'Edit post'}</h3>
          <div className="field">
            <label htmlFor="bp_title">Post title *</label>
            <input id="bp_title" type="text" value={form.title} required maxLength={200}
              placeholder="e.g. Monthly Car Rental Dubai: Prices, Deposits & Best Deals"
              onChange={(e) => {
                const t = e.target.value;
                setForm({ ...form, title: t, slug: isNew && !form.slugTouched ? slugifyTitle(t) : form.slug });
              }} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bp_slug">URL slug *</label>
              <input id="bp_slug" type="text" value={form.slug} required disabled={!isNew}
                placeholder="monthly-car-rental-dubai"
                onChange={(e) => setForm({ ...form, slug: e.target.value, slugTouched: true })} />
              <p className="hint">
                {isNew ? 'Lowercase, hyphens only. Auto-made from the title.' : 'The URL never changes after publishing — it protects the article’s Google ranking.'}
              </p>
            </div>
            <div className="field">
              <label htmlFor="bp_date">Publish date</label>
              <input id="bp_date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bp_kw">Focus keyword</label>
              <input id="bp_kw" type="text" value={form.keyword} maxLength={80}
                placeholder="e.g. monthly car rental dubai"
                onChange={(e) => set('keyword', e.target.value)} />
              <p className="hint">The ONE search term this post targets.</p>
            </div>
            <div className="field">
              <label htmlFor="bp_status">Status</label>
              <select id="bp_status" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="live">Live — visible on the blog</option>
                <option value="draft">Draft — hidden</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="bp_mt">Meta title <span className="muted">({form.meta_title.length}/60)</span></label>
            <input id="bp_mt" type="text" value={form.meta_title} maxLength={70}
              placeholder="Shown on Google — leave empty to use the post title"
              onChange={(e) => set('meta_title', e.target.value)} />
            <p className="hint">Keep under 60 characters so Google doesn&apos;t cut it off.</p>
          </div>
          <div className="field">
            <label htmlFor="bp_md">Meta description <span className="muted">({form.meta_desc.length}/155)</span></label>
            <textarea id="bp_md" rows={2} maxLength={160} value={form.meta_desc}
              placeholder="1–2 sentences shown under the title on Google."
              onChange={(e) => set('meta_desc', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="bp_ex">Excerpt (shown on blog listing)</label>
            <textarea id="bp_ex" rows={2} maxLength={200} value={form.excerpt}
              placeholder="Short summary for the blog cards."
              onChange={(e) => set('excerpt', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="bp_content">Content * <span className="muted">({wordCount} words)</span></label>
            <div className="toolbar">
              <button type="button" onClick={() => insertTag('h2')}>H2</button>
              <button type="button" onClick={() => insertTag('h3')}>H3</button>
              <button type="button" onClick={() => insertTag('strong')}>Bold</button>
              <button type="button" onClick={() => insertTag('em')}>Italic</button>
              <button type="button" onClick={() => insertTag('ul')}>• List</button>
              <button type="button" onClick={() => insertTag('a')}>Link</button>
              <button type="button" onClick={() => insertTag('p')}>Paragraph</button>
            </div>
            <textarea id="bp_content" ref={contentRef} rows={16} required value={form.content}
              placeholder="<p>Start with a paragraph containing your focus keyword...</p>"
              onChange={(e) => set('content', e.target.value)} />
            <p className="hint">Basic HTML is allowed (headings, bold, lists, links). Aim for 400+ words.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-green" type="submit" disabled={busy}>💾 Publish post</button>
            <button className="btn btn-ghost" type="button" onClick={closeEdit}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------- Bookings tab ----------
function BookingsTab({ bookings, setMsg }) {
  const router = useRouter();
  const [err, setErr] = useState('');

  async function setStatus(id, status) {
    setErr('');
    try {
      await api('/api/admin/bookings/', { action: 'status', id, status });
      setMsg('Booking status updated.');
      router.reload();
    } catch (err2) {
      setErr(err2.message);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>📩 Booking requests</h2>
      <p className="muted">New bookings arrive here the moment a visitor confirms on the site. Change the status after you reply on WhatsApp.</p>
      {err && <div className="err">{err}</div>}
      <BookingsTable bookings={bookings} showAll />
      {bookings.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Change status</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Customer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td><span className="ref">{b.ref}</span></td>
                    <td>{b.name}</td>
                    <td>
                      <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)} style={{ width: 'auto', minWidth: 150 }}>
                        <option value="new">NEW — needs reply</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Settings tab ----------
function SettingsTab({ settings, setMsg }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...settings });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api('/api/admin/settings/', { settings: form });
      setMsg('Settings saved — the whole website uses the new details now.');
      router.reload();
    } catch (err2) {
      setErr(err2.message);
      setBusy(false);
    }
  }

  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>⚙️ Site settings</h2>
      <p className="muted">
        These details appear on every page — header, footer, contact page and all WhatsApp buttons.
        Change them here once and the whole site updates.
      </p>
      {err && <div className="err">{err}</div>}
      <form onSubmit={save}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="st_name">Site name</label>
            <input id="st_name" type="text" value={form.site_name || ''} maxLength={80}
              onChange={(e) => set('site_name', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="st_url">Site URL</label>
            <input id="st_url" type="text" value={form.site_url || ''} maxLength={200}
              placeholder="https://uaerentcar.com"
              onChange={(e) => set('site_url', e.target.value)} />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="st_phone">Phone (shown on the site)</label>
            <input id="st_phone" type="text" value={form.phone_display || ''} maxLength={40}
              placeholder="+971 55 552 3231"
              onChange={(e) => set('phone_display', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="st_tel">Phone (for tap-to-call links, digits only)</label>
            <input id="st_tel" type="text" value={form.phone_tel || ''} maxLength={15}
              placeholder="971555523231"
              onChange={(e) => set('phone_tel', e.target.value)} />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="st_wa">WhatsApp number (digits only)</label>
            <input id="st_wa" type="text" value={form.whatsapp || ''} maxLength={15}
              placeholder="971555523231"
              onChange={(e) => set('whatsapp', e.target.value)} />
            <p className="hint">Every WhatsApp button on the site opens a chat with this number.</p>
          </div>
          <div className="field">
            <label htmlFor="st_email">Email</label>
            <input id="st_email" type="text" value={form.email || ''} maxLength={120}
              placeholder="uaerenatalcar@gmail.com"
              onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>
        <button className="btn btn-green" type="submit" disabled={busy}>💾 Save settings</button>
      </form>
    </div>
  );
}

// ---------- Dashboard shell ----------
function Dashboard({ data }) {
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [msg, setMsg] = useState('');
  const [editSlug, setEditSlug] = useState(null);
  const { stats, settings } = data;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  async function logout() {
    try {
      await api('/api/admin/auth/', { action: 'logout' });
    } catch {
      /* still reload below */
    }
    router.reload();
  }

  function goTab(t) {
    setTab(t);
    setEditSlug(null);
    window.scrollTo({ top: 0 });
  }

  function openPost(slug) {
    setEditSlug(slug);
    setTab('blog');
    window.scrollTo({ top: 0 });
  }

  const nav = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'pages', label: '📄 Pages' },
    { key: 'fleet', label: '🚙 Fleet' },
    { key: 'blog', label: '📝 Blog Posts' },
    { key: 'bookings', label: '📩 Bookings', count: stats.newBookings },
    { key: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <div className="adm">
      <style jsx global>{ADMIN_CSS}</style>
      <Head>
        <title>Dashboard | UAE Rental Car</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="dash">
        <div className="mobile-bar">
          <span>🚗 UAE Rental Car</span>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Log out</a>
        </div>
        <aside className="sidebar">
          <div className="brand">
            <strong>🚗 UAE Rental Car</strong>
            <small>ADMIN DASHBOARD</small>
          </div>
          <nav className="side-nav">
            {nav.map((n) => (
              <button key={n.key} type="button" className={tab === n.key ? 'active' : ''} onClick={() => goTab(n.key)}>
                {n.label}
                {n.count > 0 ? <span className="count">{n.count} new</span> : null}
              </button>
            ))}
            <button type="button" onClick={() => window.open(settings.site_url || '/', '_blank')}>
              🌐 View Website
            </button>
            <button type="button" onClick={logout}>🚪 Log out</button>
          </nav>
          <div className="side-foot">
            👋 <b>{greet}!</b>
            <br />
            uaerentcar.com
            <br />
            {stats.newBookings > 0
              ? `${stats.newBookings} ${stats.newBookings === 1 ? 'new booking needs' : 'new bookings need'} your reply.`
              : 'No new bookings — you\u2019re all caught up.'}
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <h1>{greet} 👋</h1>
              <p>{today} · Here&rsquo;s your business at a glance.</p>
            </div>
            <div className="top-actions">
              <a className="btn btn-green" href={settings.site_url || '/'} target="_blank" rel="noreferrer">🌐 View Website</a>
              <button className="btn btn-gold" type="button" onClick={() => openPost('new')}>+ New Blog Post</button>
            </div>
          </div>

          {msg && <div className="ok">{msg}</div>}

          {tab === 'dashboard' && <DashboardTab data={data} goTab={goTab} openPost={openPost} />}
          {tab === 'pages' && <PagesTab pages={data.pages} siteUrl={settings.site_url || 'https://uaerentcar.com'} setMsg={setMsg} />}
          {tab === 'fleet' && <FleetTab cars={data.cars} setMsg={setMsg} />}
          {tab === 'blog' && <BlogTab posts={data.posts} siteUrl={settings.site_url || 'https://uaerentcar.com'} setMsg={setMsg} editSlug={editSlug} setEditSlug={setEditSlug} />}
          {tab === 'bookings' && <BookingsTab bookings={data.bookings} setMsg={setMsg} />}
          {tab === 'settings' && <SettingsTab settings={data.settings} setMsg={setMsg} />}
        </main>
      </div>
    </div>
  );
}

export default function Admin(props) {
  if (!props.dbOk) {
    return (
      <div className="adm">
        <style jsx global>{ADMIN_CSS}</style>
        <Head>
          <title>Database unavailable | UAE Rental Car</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="auth-wrap">
          <div className="card" style={{ borderTop: '4px solid #dc2626' }}>
            <h1 style={{ color: '#991b1b', marginTop: 0 }}>⚠️ Database unavailable</h1>
            <p>The dashboard needs the MySQL database, but it could not connect.</p>
            <p className="muted">{props.dbError || ''}</p>
            <p>
              Check the database settings in cPanel &gt; Setup Node.js App &gt; Environment variables
              (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME), make sure the database and user exist, then
              reload this page.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!props.authed) return <AuthCard needsSetup={props.needsSetup} />;
  return <Dashboard data={props.data} />;
}
