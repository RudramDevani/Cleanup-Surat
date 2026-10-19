# CleanUp Surat website

React (Vite) on **Netlify**, data in **Supabase** (free Postgres). No server to host:
the browser talks to Supabase, and Row Level Security keeps form submissions private.

## Setup
1. supabase.com -> New project. Then SQL Editor -> paste `supabase/schema.sql` -> Run.
2. Project Settings -> API: copy the Project URL and the anon (publishable) key.
3. Local: copy `frontend/.env.example` to `frontend/.env`, fill both values, then `cd frontend && npm install && npm run dev`.
4. Netlify: import the GitHub repo (settings come from `netlify.toml`). Before deploying, add environment variables
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Site configuration -> Environment variables). Deploy.

## Managing data (Supabase -> Table Editor)
- `submissions`: volunteer, organization, report and contact forms (details in the `data` column). Only you can see it.
- `items`: the Adopt page. Add a row per item: id (short unique text), name, category, condition, details, image.
  Photos: put files in `frontend/public/adopt/` and set `image` to `/adopt/file.jpg`, or paste any public image URL.
  After the physical auction, tick `adopted` to mark an item as adopted (it moves to the end of the list).

## Before launch
Replace the sample items; set real contact details in `Contact` (App.jsx); set the auction date and venue in `AUCTION`;
update `EVENTS` and `GALLERY`.
