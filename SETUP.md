# Sran Fort — Setup Complete

This document contains everything needed to access and manage the website.

## Admin Panel Login

**URL:** http://localhost:1337/admin

| Field    | Value                |
|----------|----------------------|
| Email    | `admin@sranfort.com` |
| Password | `SranFort@2026`      |

> **Important:** Change this password after first login via **Settings → Profile → Change password**

---

## Website

**URL:** http://localhost:3000

---

## What Was Configured

### Admin account
- Created admin user `admin@sranfort.com` for managing all content

### Contact details (Site Settings)
- **Phone:** +91 73000 02346
- **Phone 2:** +91 73000 02348
- **Email:** info@sranfort.com
- **WhatsApp:** +91 73000 02346
- **Address:** Sran Fort Marriage Palace, Satipura Bypass Road, Hanumangarh, Rajasthan 335513

### Images uploaded
All content now has real photos (seeded automatically on Strapi startup):

| Content          | Images                                      |
|------------------|---------------------------------------------|
| Site Settings    | Hero image, About images (slider)           |
| Rooms (3)        | Royal Suite, Super Deluxe, Deluxe           |
| Wedding Packages | Silver, Gold, Royal                         |
| Decorations (3)  | Mandap, Floral, Entrance                    |
| Catering (2)     | Royal Feast, Traditional Thali              |
| Gallery (9)      | Weddings, events, rooms, catering, décor    |

### Logo
- Custom logo added at `/logo.svg` (shown in header and footer)

### Local fallback images
- Images stored in `frontend/public/images/` — used when Strapi is offline

---

## Email Notifications (Booking Inquiries)

When a user submits a booking inquiry, an email is sent to **beant.singh36@gmail.com**.

### Quick start (no SMTP setup)

By default, inquiries use **FormSubmit** when SMTP is not configured.

1. Submit one test inquiry from the booking form
2. Check **beant.singh36@gmail.com** for an email from FormSubmit titled **"Activate Form"**
3. Click the activation link (one-time only)
4. Future inquiries will arrive in that inbox automatically

### Recommended: Gmail SMTP (production)

1. Go to [Google Account → App Passwords](https://myaccount.google.com/apppasswords)
2. Create an app password for "Mail"
3. Uncomment and fill in these lines in `frontend/.env.local`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=beant.singh36@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="Sran Fort Website <beant.singh36@gmail.com>"
```

4. Restart the frontend server after adding env vars

### WhatsApp notifications (+91 77349 10001)

Inquiries are also sent to WhatsApp **7734910001** via [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) (free, one-time setup):

1. On the phone **7734910001**, add **+34 644 44 71 67** to WhatsApp contacts (name it "CallMeBot")
2. Send this exact message to that number:
   ```
   I allow callmebot to send me messages
   ```
3. CallMeBot will reply with your **API key**
4. Add to `frontend/.env.local`:
   ```
   INQUIRY_WHATSAPP_NUMBER=917734910001
   CALLMEBOT_API_KEY=paste-your-api-key-here
   ```
5. Restart the frontend server

After setup, every booking inquiry arrives on WhatsApp with name, phone, email, event details, and message.

---

## Fix: `better-sqlite3` Node version error

If backend fails with `NODE_MODULE_VERSION` / `better_sqlite3.node` error, use **Node 20** and rebuild:

```bash
cd backend
nvm use 20       # project has .nvmrc — requires nvm installed
node -v          # should show v20.x
bash scripts/rebuild-sqlite.sh
npm run develop
```

`npm run develop` now auto-rebuilds `better-sqlite3` before starting Strapi.

If it still fails:

```bash
cd backend
rm -rf node_modules
npm install
npm run develop
```

This happens when `better-sqlite3` was compiled under a different Node.js version (e.g. Node 22 vs Node 20).

---

## How to Start

```bash
# Terminal 1 — Backend
cd backend
npm run develop

# Terminal 2 — Frontend
cd frontend
npm run dev
```

---

## Managing Images (Admin Panel)

The admin panel at **http://localhost:1337/admin** is branded **Sran Fort CMS** with helpful hints under each image field.

### Quick steps

1. Log in at http://localhost:1337/admin
2. Open **Content Manager**
3. Upload your image on the relevant entry
4. Click **Save** — for Rooms, Gallery, Packages, etc. also click **Publish**
5. Changes appear on the website within ~60 seconds (or instantly if webhooks are configured — see below)

### Where each image appears on the website

| Admin location | Field | Shows on website |
|----------------|-------|------------------|
| **Site Settings & Images** | Logo | Header and footer |
| **Site Settings & Images** | Hero Image | Homepage hero background |
| **Site Settings & Images** | About Images | About slider (Home + About pages) |
| **Site Settings & Images** | Cta Image | "Ready to Plan Your Dream Event?" section |
| **Gallery Photo** | Image | Gallery page + homepage preview |
| **Room** | Images | Rooms page + homepage cards |
| **Wedding Package** | Images | Packages page + homepage cards |
| **Decoration** | Images | Decoration page |
| **Catering** | Images | Catering page |
| **Testimonial** | Avatar | Customer Reviews carousel (optional) |

### Site Settings & Images (most common)

1. **Content Manager → Site Settings & Images** (under Single Types)
2. Upload or replace: **Logo**, **Hero Image**, **About Images**, **Cta Image**
3. Click **Save** — no Publish step needed for Site Settings

### Collection content (rooms, gallery, packages, etc.)

1. Open the entry (e.g. **Gallery Photo → Grand Wedding Ceremony**)
2. Click the image field → upload or pick from Media Library
3. **Save** then **Publish** (draft content is hidden on the live site)

### Instant updates (optional webhook)

Add to `frontend/.env.local`:

```
REVALIDATE_SECRET=your-random-secret
```

In Strapi admin → **Settings → Webhooks → Create**:
- **URL:** `http://localhost:3000/api/revalidate?secret=your-random-secret`
- **Events:** `entry.create`, `entry.update`, `entry.delete`, `entry.publish`

After saving an image, the website refreshes within seconds.

### Environment flag

Set `NEXT_PUBLIC_USE_STATIC_IMAGES=false` in `frontend/.env.local` (default in `.env.local.example`) so all pages use admin-uploaded photos instead of local placeholders.

---

## Hero Background Image (Strapi)

The homepage hero loads from **Site Settings & Images → Hero Image**.

1. Start the backend: `cd backend && npm run develop`
2. Open **http://localhost:1337/admin**
3. Go to **Content Manager → Site Settings & Images**
4. Upload to **Hero Image** (recommended: wide landscape, 1920×1080 or larger)
5. Optionally update **Hero Title** and **Hero Subtitle**
6. Click **Save**

### About Us image slider (multiple images)

The About section shows an **auto-rotating image slider** (changes every 2 seconds).

**Option A — Upload via Strapi admin (recommended)**

1. Start the backend: `cd backend && npm run develop`
2. Open **http://localhost:1337/admin** → **Content Manager → Site Settings**
3. Scroll to **About Images** (plural) — click **Add** and upload multiple photos (up to 12)
4. Drag to reorder if needed; the slider follows this order
5. Click **Save**

The home and About pages pick up the new images within ~60 seconds.

> **About Image** (singular) is still used as a fallback poster when **About Images** is empty.

**Option B — Edit code (no Strapi upload)**

Add paths to `ABOUT_SLIDER_IMAGES` in `frontend/lib/constants.ts` and place JPEGs in `frontend/public/images/`.

### About Us video link

Below the slider, a **Video link** opens your YouTube video in a new tab (embedded autoplay is unreliable in browsers).

1. Open your video on YouTube → **Share** → copy the link  
   e.g. `https://youtu.be/sesx8Q4Gs6A`
2. Add it in **one** of these places:
   - **Strapi admin** → Site Settings → **About Video Url** → Save  
   - **or** `frontend/.env.local` → `NEXT_PUBLIC_ABOUT_YOUTUBE_URL=https://youtu.be/...`
3. Restart frontend if you changed `.env.local`

> Use a **single video link** (`watch?v=...` or `youtu.be/...`), not the channel URL (`@sranfortpalace`).

### Verify the API

```bash
curl -s "http://localhost:1337/api/site-setting?populate=heroImage,aboutImages" | jq '.data.aboutImages'
```

You should see a path like `/uploads/hero_abc123.jpg`. The frontend builds the full URL as `http://localhost:1337/uploads/...`.

---

## Updating Contact Info

1. Admin → **Site Settings** (under Single Types)
2. Edit phone, email, address, social links
3. Save

The website pulls contact info from Site Settings automatically.

---

## Re-seed Images (if needed)

Delete uploaded files and gallery items from Strapi admin, then restart the backend:

```bash
cd backend
npm run develop
```

The bootstrap script will re-upload images from `backend/data/seed-images/`.
