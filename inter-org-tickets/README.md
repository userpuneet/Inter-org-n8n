# inter-org-tickets

An inter-organization ticketing and project management platform built with React, TypeScript, Supabase, and Tailwind CSS.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd inter-org-tickets
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Open `.env` and set:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase dashboard under **Project Settings → API**.

### 3. Apply database migrations

Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Or run the SQL files in `supabase/migrations/` manually in the Supabase SQL editor, in order.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

**Never commit `.env` to version control.** It is already listed in `.gitignore`.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tooling)
- **Tailwind CSS** + **shadcn/ui** (styling)
- **Supabase** (database + auth)
- **TanStack Query** (data fetching)
- **React Router v6** (routing)
- **Recharts** (charts)

## Project Structure

```
src/
  components/       # Reusable UI components
    project/        # Kanban/project management components
    thread-comments/ # Threaded comment system
    anomaly/        # Anomaly detection dashboard
    user-management/ # User/role management
  hooks/            # Custom React hooks (useThreads, useProjectBoard, …)
  integrations/
    supabase/       # Supabase client + generated types
  pages/            # Route-level page components
    features/       # Advanced feature pages
  types/            # Shared TypeScript type definitions
supabase/
  migrations/       # SQL migration files
```

## Security Notes

- The app uses Supabase Row Level Security (RLS). Write operations require an authenticated session.
- Read policies are currently open for development. Before going to production, scope them to `auth.uid()` or org membership.
- See `supabase/migrations/20260222000000_restrict_rls_policies.sql` for the current write restrictions.

## Deployment

This project was originally built with [Lovable](https://lovable.dev). To deploy:

1. Push your code to GitHub
2. Connect the repo to Vercel, Netlify, or your preferred host
3. Set the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in your host's dashboard
