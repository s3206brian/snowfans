# SnowFans Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + Tailwind CSS (Mobile-first, PWA) |
| Backend/DB | Supabase (PostgreSQL + RLS + Edge Functions) |
| Auth | Supabase Auth (JWT) — Apple/Google Sign-In reserved |
| Hosting | Zeabur |

## Directory Structure

```
snowfans/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth routes (no main nav)
│   │   │   └── login/
│   │   ├── (main)/           # App routes (with main nav)
│   │   │   ├── explore/      # Explore Lobby
│   │   │   └── [username]/   # Profile Card
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── profile/          # ProfileCard, ResortFootprint, EquipmentCard...
│   │   ├── explore/          # SearchBar, FilterTags, ProfilePreviewCard...
│   │   ├── ui/               # Button, Input, Avatar, Badge...
│   │   └── layout/           # BottomNav, Header...
│   └── lib/
│       ├── supabase/         # client.ts, server.ts, middleware.ts
│       ├── hooks/            # useProfile, useExplore...
│       ├── types/            # database.ts (Supabase gen), index.ts
│       └── utils/            # formatters, privacy helpers
├── supabase/
│   ├── migrations/           # SQL migration files
│   ├── functions/            # Edge Functions
│   └── seed/                 # Seed data
└── docs/
```

## API-First Principles

- Core business logic lives in Supabase (RLS policies + Edge Functions)
- Next.js Server Components only call Supabase directly — no custom API routes for core features
- This allows future iOS/Android apps to use the same Supabase API

## Data Model

### profiles
- 1:1 with `auth.users`
- Contains: username, display_name, avatar_url, bio, short_link, trip_status, privacy_settings

### resort_visits
- Ski footprints per profile
- Linked to `resorts` reference table

### equipment
- Per-item `is_public` flag
- Respect profile-level `privacy_settings.equipment`

### Privacy Settings (JSONB)
```json
{
  "resort_visits": "public" | "followers" | "private",
  "equipment": "public" | "followers" | "private",
  "trip_status": "public" | "followers" | "private"
}
```

## MVP Scope

1. **Profile Card** (`/[username]`)
   - Short link share
   - Resort footprint map
   - Trip status badge
   - Equipment library
   - Per-section privacy controls

2. **Explore Lobby** (`/explore`)
   - Global search (username, resort, tag)
   - Quick filter tags
   - Profile preview cards
