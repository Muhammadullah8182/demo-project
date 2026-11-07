# Deploy — UAE Rental Car full-dashboard app on CreemHost cPanel

Plain steps, in order. You need: your CreemHost client login, the
`uaerentcar-nextjs-full-v1.zip` file, and a computer with Node.js
installed (to build the app once).

## What you are deploying

- A **Node.js app** (not plain files). It runs on your CreemHost server
  and reads the content from a **MySQL database**.
- The domain **uaerentcar.com** will point at this app. Your current
  static site files in `public_html` stay untouched as a backup — the
  Node app takes over the domain once it is attached (step 5).

---

## Step 1 — Create the MySQL database

1. Log in to **cPanel**.
2. Open **MySQL® Databases**.
3. Under **Create New Database**, type a name, e.g. `rental` — cPanel
   adds a prefix, so the real name becomes something like
   `youruser_rental`. **Write down the full name.**
4. Scroll to **MySQL Users → Add New User**: username e.g. `rentaluser`,
   pick a strong password. **Write down the full username and the
   password.**
5. Under **Add User To Database**, pick the user and the database, click
   **Add**, tick **ALL PRIVILEGES**, click **Make Changes**.

## Step 2 — Import the tables and the content

1. In cPanel, open **phpMyAdmin**.
2. Click your new database name on the left.
3. Click the **Import** tab at the top.
4. Click **Choose File**, pick **`schema.sql`** from the unzipped
   project, click **Go**. You should see 6 tables created:
   `settings`, `cars`, `posts`, `pages`, `bookings`, `admin_users`.
5. Click **Import** again, pick **`seed.sql`**, click **Go**. This fills
   the tables with the exact current website content (phone, prices,
   3 cars, 1 blog post, all page titles).

## Step 3 — Build the app on your computer

1. Unzip `uaerentcar-nextjs-full-v1.zip` on your computer.
2. Open a terminal in the unzipped folder and run:
   ```
   npm install
   npm run build
   ```
   (First build takes 1–2 minutes. It must finish with no errors.)
3. After the build, find the folder **`.next/standalone/`** inside the
   project. This is what you upload — it contains `server.js`,
   `.next/` and `public/`.

## Step 4 — Make a session secret

The dashboard login needs a long random secret. In your terminal run:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the long string it prints. **Write it down** — you need it in the
next step.

## Step 5 — Create the Node.js app in cPanel

1. In cPanel, open **Setup Node.js App** (under Software).
2. Click **Create Application** and fill in:
   - **Node.js version:** 20 (pick the highest 20.x available; 18.18+
     is the minimum).
   - **Application mode:** Production.
   - **Application root:** a new folder name, e.g. `uaerentcar-app`
     (this folder is created next to `public_html`, NOT inside it).
   - **Application URL:** pick **uaerentcar.com** and leave the path
     empty (`/`).
   - **Application startup file:** `server.js`
3. Click **Create**. The app is created but not running yet.

## Step 6 — Upload the built app

1. In cPanel, open **File Manager** and go into the application root
   folder you just made (`uaerentcar-app`).
2. Upload **three things** into that folder (all three are needed —
   the app will load without JavaScript, CSS or images if you skip
   the last two):
   - **a)** the **contents** of your computer's `.next/standalone/`
     folder — so the folder ends up containing `server.js`, a `.next`
     folder and a `node_modules` folder. (Upload a zip and extract
     it there if that is easier — File Manager has an Extract button.)
   - **b)** the **`public/`** folder from the project (the logo, car
     photos, hero image and `robots.txt` live here).
   - **c)** the **`static/`** folder from inside your computer's
     `.next/` folder — copy it into the **`.next`** folder that is
     already in the app root (from step a), so the app root ends up
     with `.next/static/` next to `.next/server/`. This is the
     JavaScript and CSS the site needs to work.
3. Do **not** upload the project's `node_modules` folder — the
   standalone folder already has everything the app needs.

## Step 7 — Set the environment variables

1. Back in **Setup Node.js App**, open your application and find
   **Environment variables** (or "Environment Variables" → Add).
2. Add these six (use YOUR values from steps 1 and 4):

   | Name | Value |
   |---|---|
   | `DB_HOST` | `localhost` |
   | `DB_PORT` | `3306` |
   | `DB_USER` | the full MySQL username from step 1 |
   | `DB_PASSWORD` | the MySQL user password from step 1 |
   | `DB_NAME` | the full database name from step 1 |
   | `SESSION_SECRET` | the long string from step 4 |

3. Click **Save**.

## Step 8 — Start the app and check the site

1. In **Setup Node.js App**, click **Restart** (or Start) for the app.
2. Wait ~30 seconds, then open **https://uaerentcar.com** — the
   homepage should load exactly like the current site.
3. If it shows an error page, open the app's **logs** in Setup Node.js
   App and check the message (see "If something goes wrong" below).

## Step 9 — Create your admin account

1. Open **https://uaerentcar.com/admin/** — the first visit shows
   **"Welcome! Create your admin account"**.
2. Pick a username and a password (at least 8 characters) and submit.
   There is no default password — this account is the only login.
3. You are now in the dashboard: edit pages, fleet, blog posts,
   bookings and settings. Every save is live immediately.

## Step 10 — Tell Google about the new sitemap

1. In **Google Search Console**, submit the new sitemap:
   `https://uaerentcar.com/sitemap.xml`
2. (The old `sitemap.php` no longer exists — use the `.xml` address.)

---

## Updating the site later

- **Content (prices, text, cars, posts, settings):** just save in the
  `/admin/` dashboard. No upload, no rebuild.
- **New photos:** upload the image in File Manager under the app folder
  → `public/images/`, then paste its path (e.g. `/images/my-car.webp`)
  in the car form. **Keep a copy of your photos:** re-uploading a fresh
  build replaces `public/`.
- **Code changes:** rebuild on your computer (`npm run build`) and
  re-upload the contents of `.next/standalone/`, then Restart the app
  in Setup Node.js App.

## If something goes wrong

- **Site shows an error / blank page:** in Setup Node.js App, open the
  app logs. The most common cause is a wrong `DB_*` variable — check
  the names against step 1. Note: even with the database down, the
  public pages should still load (they fall back to the built-in
  content) — a blank page usually means the app itself did not start.
- **"Database unavailable" on /admin/:** the dashboard needs MySQL.
  Check the six environment variables and that the MySQL user has
  ALL PRIVILEGES on the database.
- **App won't start / "Cannot find module":** make sure you uploaded
  the *contents* of `.next/standalone/` (not the folder itself) and
  that `server.js` is directly inside the application root.
- **Old site still shows:** the Application URL in step 5 must be the
  domain `uaerentcar.com` with an empty path. If the static site in
  `public_html` still answers, the Node app is not attached to the
  domain yet — check step 5.
- **Forgot the admin password:** in phpMyAdmin, delete the row in the
  `admin_users` table. The next visit to `/admin/` shows the setup
  form again so you can create a new account.
