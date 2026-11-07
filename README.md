# UAE Rental Car — Next.js (full dashboard-control server app)

The full-dashboard version of the UAE Rental Car website (uaerentcar.com).
Same design, same content, same prices, same phone/email/WhatsApp as the
static v12 / Next.js v2 site — but the content now lives in MySQL and
**everything is editable from the dashboard** (`/admin`): page titles and
hero text, fleet cars and prices, blog posts, bookings and site settings.
Edits show on the live site immediately — **no rebuild, no re-upload**.

## How it differs from the v2 static export

| | v2 (static export) | This version (server app) |
|---|---|---|
| Runs on | plain files in `public_html` | Node.js app on cPanel ("Setup Node.js App") |
| Content source | hardcoded in `data/site.js` | MySQL (`settings`, `cars`, `posts`, `pages`, `bookings`) |
| Edit a price/text | edit a file, rebuild, re-upload | save in `/admin`, live instantly |
| Blog posts | need a rebuild | publish in `/admin`, live instantly |
| Bookings | PHP `booking.php` + JSON files | API route + MySQL |
| Sitemap | `sitemap.php` | `/sitemap.xml` (dynamic) |
| Admin | PHP dashboard in `public/admin/` | Next.js dashboard at `/admin` |

## What the dashboard edits

- **Pages** — title, meta description, H1, hero title/subtitle and an
  optional intro paragraph for each of the 12 pages. The URL (slug) is
  never editable: changing a live URL would break its Google ranking.
- **Fleet** — full car CRUD: name, year, category, daily/weekly/monthly
  prices, seats, bags, gearbox, fuel, deposit, badge, photo, visibility.
- **Blog** — full post CRUD with SEO fields (meta title/description,
  focus keyword, excerpt, publish date, live/draft).
- **Bookings** — list with WhatsApp links; status NEW → Confirmed →
  Completed / Cancelled.
- **Settings** — site name, site URL, phone, WhatsApp number, email.
  These appear on every page (header, footer, contact page, all
  WhatsApp buttons).

## Safety net: the site never shows a blank page

If MySQL is unreachable, every public page renders with the exact current
v2 values from `data/site.js` (same prices, same text, same SEO meta).
Only the admin area requires the database.

## Setup (local)

```bash
cd website-nextjs-full
npm install
```

Node 18.18+ is required (built and tested with Node 24). For local work
with a database, create `.env.local` (never commit it):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database
SESSION_SECRET=a-long-random-string
```

Then import `schema.sql` and `seed.sql` into that database.

```bash
npm run dev     # local dev server at http://localhost:3000
npm run build   # production build -> .next/standalone/
npm start       # run the production server locally
```

**Important:** after `npm run build`, the upload needs three parts —
the contents of `.next/standalone/` **plus** the `public/` folder
**plus** `.next/static/` copied into the app root's `.next/static/`.
Next.js does not put the last two inside the standalone folder, so
without them the live site would have no JavaScript, CSS or images.
See DEPLOY.md step 6.

## Deploy (CreemHost cPanel)

Full step-by-step guide: **[DEPLOY.md](DEPLOY.md)** — MySQL database +
user, import `schema.sql` + `seed.sql`, upload `.next/standalone/`,
"Setup Node.js App" settings (Node 20, startup file `server.js`,
environment variables), first admin password at `/admin/`.

## Pages

| Route | Page |
|---|---|
| `/` | Home — hero + search widget, trust badges, categories, featured cars, 4 steps, Google reviews widget (4.9/127), FAQ |
| `/hotels/` | Hotel booking page |
| `/locations/` | Rental locations & programs across the UAE |
| `/contact/` | Contact form (opens WhatsApp) + map |
| `/taxi/` | Taxi SEO page — fare tables + FAQ |
| `/compare/` | Car comparison tool + rental cost calculator |
| `/privacy/` | Privacy Policy |
| `/terms/` | Terms & Conditions |
| `/ar/` | Arabic RTL landing page |
| `/monthly-rental/` | Monthly rental deals |
| `/no-deposit/` | No-deposit rentals |
| `/blog/` | Blog list |
| `/blog/<slug>/` | Blog article |
| `/admin/` | Dashboard (login / first-run setup) |
| `/sitemap.xml` | Dynamic sitemap (pages + live posts) |

## Files

- `schema.sql` — the 6 MySQL tables.
- `seed.sql` — the exact current content (settings, 3 cars, 1 blog post,
  12 page rows). Safe to re-import: `INSERT IGNORE` never overwrites
  your edits.
- `scripts/generate-sql.mjs` — regenerates `seed.sql` from
  `data/site.js` (used to build the seed; not needed on the server).
- `lib/db.js` — MySQL pool (env vars only, 3s fail-fast timeout).
- `lib/site-data.js` — DB reads with hardcoded fallback.
- `lib/auth.js` — scrypt password hashing + HMAC-signed session cookies.
- `pages/api/booking.js` — booking endpoint (saves to MySQL, returns
  the `URC-YYYYMMDD-XXXX` ref; on DB failure the modal falls back to a
  local ref + WhatsApp).
- `pages/api/admin/*` — auth, pages, cars, posts, bookings, settings.
- `DEPLOY.md` — the cPanel deployment guide.

## Notes & limits

- The booking modal's vehicle list and prices are the same hardcoded
  options as v2 (the modal itself is unchanged).
- Edited hero text is not auto-translated: the EN/AR switcher translates
  by exact text match, so a changed headline stays in English when the
  visitor switches to Arabic.
- Car photos are files: upload a photo in cPanel File Manager under the
  app folder (`public/images/`) and paste its path (e.g.
  `/images/my-car.webp`) in the car form. Re-uploading a fresh build
  replaces `public/` — keep a copy of your uploaded photos.
- If the `cars` table is ever empty, the site shows the original 3 cars
  (fallback) instead of an empty fleet page.
