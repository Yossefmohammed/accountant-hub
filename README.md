# Accountant Hub

A small Upwork-style platform where companies post accounting jobs and accountants browse listings, view details, and submit bids.

Built for the **Vibe Coder / Solo Full-Stack Developer** assessment.

## Live demo

> Deploy to Vercel (or similar) and add your URL here after deployment.

## Test credentials

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `accountant@demo.com` |
| Password | `password123`         |

## Tech stack

| Layer    | Choice                                      |
| -------- | ------------------------------------------- |
| Frontend | Next.js 15 (App Router), React 19, CSS Modules |
| Backend  | Next.js API Routes                          |
| Database | SQLite via Prisma (MySQL-ready schema)      |
| Auth     | JWT in HTTP-only cookie, bcrypt passwords   |

**Why not Laravel + MySQL?** The task allows another stack when explained. Next.js full-stack keeps one codebase, typed API routes, and simple deployment (e.g. Vercel + SQLite file or PlanetScale/MySQL). The Prisma schema maps cleanly to the suggested entities.

## Features

### Required

- **Jobs listing** — title, company, description, budget, deadline, category, bid count, posted date, open/closed status
- **Filters** — search by title, category, budget range, sort (newest / highest budget / oldest), status
- **Job details** — full description, client info, skills, delivery time, budget, attachments note, bid count, apply flow
- **Submit bid** — price, delivery time, cover letter, experience; one bid per user per job; success feedback
- **Auth** — register, login, logout; only logged-in users can bid

### Bonus

- My bids dashboard (`/dashboard`)
- Open / closed job status
- Pagination on job listing
- Reusable UI components
- Consistent JSON API responses
- Seeded demo data

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd vibecoder_task
npm install
cp .env.example .env
# Edit .env — set JWT_SECRET to a long random string
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## API endpoints

| Method | Endpoint              | Auth | Description                    |
| ------ | --------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/register`  | No   | Create accountant account      |
| POST   | `/api/auth/login`     | No   | Log in                         |
| POST   | `/api/auth/logout`    | No   | Log out                        |
| GET    | `/api/auth/me`        | No   | Current user or `null`         |
| GET    | `/api/categories`     | No   | List job categories            |
| GET    | `/api/jobs`           | No   | List jobs (query filters below)|
| GET    | `/api/jobs/:id`       | No   | Job detail + `userHasBid`      |
| POST   | `/api/jobs/:id/bids`  | Yes  | Submit bid                     |
| GET    | `/api/bids/my`        | Yes  | Current user's bids            |

### Jobs list query params

- `search` — title contains
- `category` — category name
- `budgetMin`, `budgetMax` — budget overlap filter
- `status` — `open` or `closed`
- `sort` — `newest` (default), `budget`, `oldest`
- `page`, `perPage` — pagination (default 9 per page)

## Database

- **Users** — accountants (bidders)
- **JobCategory** — taxonomy
- **Job** — client postings (seeded; no client login)
- **Bid** — unique `(jobId, userId)`

## Assumptions

- Only **accountants** register; companies/clients do not log in — jobs are seeded.
- Job `status` is `open` or `closed` (lowercase in DB, displayed capitalized).
- SQLite is used locally for zero-config setup; switch `provider` and `DATABASE_URL` in Prisma for MySQL.
- Attachments are described in text only (no file upload).
- Currency is USD.

## Project structure

```
src/
  app/           # Pages + API routes
  components/    # UI (Header, JobCard, filters, forms)
  lib/           # Auth, Prisma, jobs query, API helpers
prisma/          # Schema + seed
```

## Deployment (Vercel)

1. Push to GitHub.
2. Import project in Vercel.
3. Set `JWT_SECRET` and `DATABASE_URL` (e.g. Turso/PlanetScale or file-based SQLite if supported).
4. Build command: `npm run build` (runs `prisma generate`).
5. Run `prisma db push` and `db:seed` once against production DB.

## Design

Brand colors: **black** (`#0a0a0a`) and **green** (`#019a51`).
