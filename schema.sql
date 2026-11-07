-- UAE Rental Car — MySQL schema (full dashboard-control Next.js app)
-- Import this FIRST in phpMyAdmin (or: mysql -u USER -p DB < schema.sql),
-- then import seed.sql. Tables are created only if they do not exist yet.

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(50) NOT NULL PRIMARY KEY,
  `value` TEXT NOT NULL
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
