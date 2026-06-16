# Sran Fort Marriage Palace — Website

A modern, mobile-responsive marriage palace website with a **Next.js** frontend and **Strapi** admin panel. Inspired by luxury resort websites like [GM Resorts](https://gmresorts.com/).

The client can manage all content (rooms, packages, gallery, testimonials, etc.) from the Strapi admin panel without touching code.

## Features

### Public Website
- **Home** — Hero, services, featured packages & rooms, gallery preview, testimonials
- **About Us** — Story, stats, vision/mission
- **Wedding Packages** — Silver, Gold, Royal packages with features
- **Rooms** — Luxury accommodation listings
- **Catering** — Menu packages and live counters
- **Decoration** — Wedding & event décor themes
- **Gallery** — Filterable photo gallery with lightbox
- **Testimonials** — Customer reviews
- **Contact** — Contact info, map, inquiry form
- **Booking Inquiry** — Event booking form

### Admin Panel (Strapi)
- Upload images for all content types
- Manage rooms, packages, decorations, catering menus
- Manage gallery and testimonials
- View and manage booking inquiries
- Edit site settings (contact info, hero text, about content)

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend  | Strapi 5 (Headless CMS) |
| Database | SQLite (dev)      |

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### 1. Start the Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

On first run, create an admin account at **http://localhost:1337/admin**.

The bootstrap script automatically:
- Sets public API permissions
- Seeds sample rooms, packages, decorations, catering, and testimonials

### 2. Start the Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open **http://localhost:3000** to view the website.

### 3. Configure Public API Access

Permissions are set automatically on bootstrap. If needed, verify in Strapi admin:

**Settings → Users & Permissions → Roles → Public**

Enable `find` / `findOne` for all content types, and `create` for Booking Inquiries.

## Admin Panel Guide

Access the admin at **http://localhost:1337/admin**

| Content Type      | What to Manage                              |
|-------------------|---------------------------------------------|
| Site Settings     | Hero text, contact info, social links       |
| Rooms             | Room names, prices, amenities, photos       |
| Wedding Packages  | Package tiers, features, pricing, photos    |
| Decorations       | Décor themes, categories, photos            |
| Catering          | Menus, cuisine type, price per plate        |
| Gallery Items     | Upload photos, assign categories            |
| Testimonials      | Customer reviews and ratings                |
| Booking Inquiries | View incoming booking requests              |

## Project Structure

```
sran_fort/
├── backend/          # Strapi CMS
│   └── src/api/      # Content types & APIs
├── frontend/         # Next.js website
│   ├── app/          # Pages (App Router)
│   ├── components/   # UI components
│   └── lib/          # API client & utilities
└── README.md
```

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production, set this to your deployed Strapi URL.

## Deployment

- **Frontend**: Deploy to Vercel, Netlify, or any Node.js host
- **Backend**: Deploy Strapi to Railway, Render, DigitalOcean, or Strapi Cloud
- Update `NEXT_PUBLIC_STRAPI_URL` to point to your production Strapi instance
- Configure CORS in `backend/config/middlewares.ts` with your frontend domain

## Design

- **Colors**: Maroon (#7B1E3A), Gold (#C9A227), Cream (#FAF7F2)
- **Fonts**: Playfair Display (headings), Lato (body)
- Fully responsive — mobile, tablet, and desktop
