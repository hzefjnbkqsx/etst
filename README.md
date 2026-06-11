# Astral Dupes

Production Minecraft server website built with **Next.js**, **Supabase**, and **Minecraft RCON** (LuckPerms).

## Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind, shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL + email/password)
- **Hosting**: Vercel
- **Rank delivery**: Server-side RCON (`lp user <username> parent set <rank>`)

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL migration: `supabase/migrations/001_initial.sql`
3. Enable Email auth in Authentication → Providers
4. Copy URL and keys to `.env.local`

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RCON_HOST=
RCON_PORT=25575
RCON_PASSWORD=

# Optional PayPal webhook
PAYPAL_WEBHOOK_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

**Never** expose `SUPABASE_SERVICE_ROLE_KEY` or RCON credentials to the browser.

### 3. First admin user

After registering, promote your user in Supabase SQL:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Import the repo in Vercel
2. Add all environment variables from `.env.example`
3. Deploy

## API routes

| Route | Description |
|-------|-------------|
| `GET /api/store/list` | Active products |
| `POST /api/store/buy` | Create purchase (auth required) |
| `POST /api/tickets/create` | Create support ticket |
| `POST /api/tickets/reply` | Reply to ticket |
| `POST /api/paypal/webhook` | PayPal payment fulfillment |
| `POST /api/minecraft/rcon` | Admin-only RCON (blocked commands list) |
| `/api/admin/*` | Admin CRUD (products, users, news, etc.) |

## Products & ranks

When creating rank products in Admin → Store, set **LuckPerms Rank** (e.g. `vip`, `mvp`). On confirmed payment, the server runs:

```
lp user <minecraft_username> parent set <luckperms_rank>
```

Additional commands can be added per product (use `{player}` placeholder).

## Security

- RCON and service role keys are server-only
- Admin routes protected by middleware + API role checks
- Purchases require server-side `payment_confirmed` (webhook/admin), not client trust
