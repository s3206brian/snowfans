# SnowFans

**SnowFans** is an open-source, non-profit project dedicated to promoting skiing and snowboarding culture. Our goal is to build a community platform that helps beginners get started with snow sports, shares resort information, and connects enthusiasts across the world. We hope to leverage Claude to enhance user experience through intelligent Q&A, personalized recommendations, and multilingual support for a global audience.

> 專為中文語系滑雪愛好者打造的開源互助社群平台。
> An open-source community platform built for Chinese-speaking ski and snowboard enthusiasts.

🌐 **[snowfans.org](https://snowfans.org)**

---

## About

SnowFans is a non-profit, community-driven platform — we do not take commissions, run ads, or process payments. Users connect with each other directly through their social media (Instagram, LINE, etc.) after finding a match on the platform.

- **Non-profit** — No fees, no commissions, no ads
- **Open source** — Licensed under AGPLv3
- **Community first** — Built by and for snow sports enthusiasts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + Tailwind CSS (Mobile-first, PWA) |
| Backend / DB | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Hosting | Zeabur |

---

## Features

- **Profile Card** — Personal ski/snowboard profile with a shareable short link
- **Trip Board** — Post upcoming trips and find people to ski with
- **Resort Footprint** — Log every resort you've visited
- **Equipment Library** — Showcase your gear
- **Explore Lobby** — Search and filter users by status, resort, or tags

---

## Getting Started

### Prerequisites

- Node.js 22+
- A [Supabase](https://supabase.com) project

### Setup

```bash
git clone https://github.com/s3206brian/snowfans.git
cd snowfans
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials in .env.local
```

Run all database migrations in your Supabase SQL Editor, in order:
- `supabase/migrations/001_initial_schema.sql` … `supabase/migrations/012_account_type.sql`

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

[AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html) — This project is free and open source.
