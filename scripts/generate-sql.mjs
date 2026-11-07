// One-off generator: builds schema.sql + seed.sql for the full-dashboard
// Next.js app from the exact current values in website-nextjs/data/site.js.
// Run: node scripts/generate-sql.mjs   (writes schema.sql + seed.sql)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import mysql from 'mysql2/promise';
import { SEO, CARS, POSTS } from '../data/site.js';

const esc = (v) => mysql.escape(v);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const HERO = {
  home: ['Rent a Car in Dubai from AED 79/day', '✓ No Deposit Options ✓ Free Delivery ✓ 24/7 Support'],
  hotels: ['Your Home Away From Home', 'Handpicked hotels across Dubai at honest prices.'],
  locations: ['Car Rental Locations Across the UAE', 'Free delivery to your doorstep — anywhere in Dubai & the Emirates.'],
  contact: ['Contact Us', 'Questions, comments or suggestions? Message us — we reply fast, 24/7.'],
  taxi: ['Taxi Service in Dubai — Book a Dubai Taxi in Minutes', 'Airport transfers, city rides and intercity trips — book on WhatsApp, no app, no booking fee.'],
  compare: ['Compare Car Rental Prices in Dubai', 'Side-by-side prices, then your exact trip cost — no hidden charges.'],
  privacy: ['Privacy Policy', 'How we collect, use and protect your information.'],
  terms: ['Terms & Conditions', 'Simple, fair terms for renting with us — in plain words.'],
  ar: ['تأجير سيارات في دبي', 'بدون وديعة • توصيل مجاني • دعم 24/7'],
  'monthly-rental': ['Monthly Car Rental in Dubai', 'One fixed monthly price — up to 29% cheaper per day than daily rental.'],
  'no-deposit': ['No Deposit Car Rental in Dubai', 'Rent a car with zero deposit — no big security hold, no blocked credit card.'],
  blog: ['Dubai Car Rental Blog', 'Guides, tips & deals — new article every day.'],
};

// SEO key in data/site.js per page slug
const SEO_KEY = {
  home: 'home', hotels: 'hotels', locations: 'locations', contact: 'contact',
  taxi: 'taxi', compare: 'compare', privacy: 'privacy', terms: 'terms',
  ar: 'ar', 'monthly-rental': 'monthly', 'no-deposit': 'nodeposit', blog: 'blog',
};

const schema = `-- UAE Rental Car — MySQL schema (full dashboard-control Next.js app)
-- Import this FIRST in phpMyAdmin (or: mysql -u USER -p DB < schema.sql),
-- then import seed.sql. Tables are created only if they do not exist yet.

CREATE TABLE IF NOT EXISTS settings (
  \`key\` VARCHAR(50) NOT NULL PRIMARY KEY,
  \`value\` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cars (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  year SMALLINT NULL,
  category VARCHAR(40) NOT NULL DEFAULT 'Economy',
  price_day DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_week DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_month DECIMAL(10,2) NOT NULL DEFAULT 0,
  seats TINYINT NOT NULL DEFAULT 5,
  bags TINYINT NOT NULL DEFAULT 3,
  trans VARCHAR(20) NOT NULL DEFAULT 'Automatic',
  fuel VARCHAR(20) NOT NULL DEFAULT 'Petrol',
  deposit VARCHAR(40) NOT NULL DEFAULT '',
  badge VARCHAR(40) NOT NULL DEFAULT '',
  image VARCHAR(255) NOT NULL DEFAULT '',
  alt VARCHAR(160) NOT NULL DEFAULT '',
  active TINYINT(1) NOT NULL DEFAULT 1,
  sort INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  meta_title VARCHAR(200) NOT NULL DEFAULT '',
  meta_desc VARCHAR(300) NOT NULL DEFAULT '',
  keyword VARCHAR(80) NOT NULL DEFAULT '',
  excerpt VARCHAR(300) NOT NULL DEFAULT '',
  content MEDIUMTEXT NOT NULL,
  date DATE NOT NULL,
  status ENUM('live','draft') NOT NULL DEFAULT 'live',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_posts_status_date (status, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ref VARCHAR(20) NOT NULL UNIQUE,
  type ENUM('selfdrive','taxi') NOT NULL DEFAULT 'selfdrive',
  name VARCHAR(80) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(80) NOT NULL DEFAULT '',
  vehicle VARCHAR(60) NOT NULL DEFAULT '',
  flight VARCHAR(20) NOT NULL DEFAULT '',
  notes VARCHAR(500) NOT NULL DEFAULT '',
  details JSON NULL,
  status ENUM('new','confirmed','completed','cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bookings_status (status),
  INDEX idx_bookings_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pages (
  slug VARCHAR(40) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL DEFAULT '',
  meta_description VARCHAR(300) NOT NULL DEFAULT '',
  h1 VARCHAR(200) NOT NULL DEFAULT '',
  hero_title VARCHAR(200) NOT NULL DEFAULT '',
  hero_subtitle VARCHAR(300) NOT NULL DEFAULT '',
  body_html MEDIUMTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  pass_hash VARCHAR(200) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

let seed = `-- UAE Rental Car — seed data (exact current content of the v2 site)
-- Import AFTER schema.sql. Safe to re-import: INSERT IGNORE skips rows
-- that already exist, so your later edits are never overwritten.
-- Admin users are NOT seeded: the first visit to /admin/ creates the account.

INSERT IGNORE INTO settings (\`key\`, \`value\`) VALUES
  ('site_name', 'UAE Rental Car'),
  ('site_url', 'https://uaerentcar.com'),
  ('phone_display', '+971 55 552 3231'),
  ('phone_tel', '971555523231'),
  ('whatsapp', '971555523231'),
  ('email', 'uaerenatalcar@gmail.com');

`;

// ---- cars ----
const carRows = CARS.map((c, i) => {
  const m = c.name.match(/^(.*) (\d{4})$/);
  const name = m ? m[1] : c.name;
  const year = m ? Number(m[2]) : null;
  const category = c.id === 'tucson' ? 'SUV' : c.id === 'eclass' ? 'Luxury' : 'Economy';
  return `  (${esc(c.id)}, ${esc(name)}, ${year === null ? 'NULL' : year}, ${esc(category)}, ${c.daily}, ${c.weekly}, ${c.monthly}, ${c.seats}, ${c.bags}, ${esc(c.trans)}, ${esc(c.fuel)}, ${esc(c.deposit)}, ${esc(c.best)}, ${esc(c.img)}, ${esc(c.alt)}, 1, ${i})`;
});
seed += `INSERT IGNORE INTO cars (id, name, year, category, price_day, price_week, price_month, seats, bags, trans, fuel, deposit, badge, image, alt, active, sort) VALUES\n${carRows.join(',\n')};\n\n`;

// ---- posts ----
const postRows = POSTS.map((p) => {
  const updated = p.updated || `${p.date} 00:00:00`;
  return `  (${esc(p.slug)}, ${esc(p.title)}, ${esc(p.meta_title || '')}, ${esc(p.meta_desc || '')}, ${esc(p.keyword || '')}, ${esc(p.excerpt || '')}, ${esc(p.content)}, ${esc(p.date)}, 'live', ${esc(updated)}, ${esc(updated)})`;
});
seed += `INSERT IGNORE INTO posts (slug, title, meta_title, meta_desc, keyword, excerpt, content, date, status, created_at, updated_at) VALUES\n${postRows.join(',\n')};\n\n`;

// ---- pages ----
const pageRows = Object.keys(HERO).map((slug) => {
  const seo = SEO[SEO_KEY[slug]];
  const [h1, heroSub] = HERO[slug];
  return `  (${esc(slug)}, ${esc(seo.title)}, ${esc(seo.description)}, ${esc(h1)}, ${esc(h1)}, ${esc(heroSub)}, NULL)`;
});
seed += `INSERT IGNORE INTO pages (slug, title, meta_description, h1, hero_title, hero_subtitle, body_html) VALUES\n${pageRows.join(',\n')};\n`;

writeFileSync(join(root, 'schema.sql'), schema);
writeFileSync(join(root, 'seed.sql'), seed);
console.log('schema.sql bytes:', schema.length);
console.log('seed.sql bytes:', seed.length);
console.log('pages seeded:', Object.keys(HERO).length, '| cars:', CARS.length, '| posts:', POSTS.length);
