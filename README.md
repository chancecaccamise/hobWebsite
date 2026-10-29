# House of Butts

Coming-soon landing page with a launch countdown and email signup, built with [Next.js](https://nextjs.org) (App Router, TypeScript).

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script          | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server with hot reload |
| `npm run build` | Production build                 |
| `npm start`     | Serve the production build       |
| `npm run lint`  | Run ESLint                       |

## Configuration

- **Copy, launch date, social links:** [`src/config/site.ts`](src/config/site.ts). The headline and subtext are placeholders. Social links with an empty `href` are hidden.
- **Logo:** [`src/components/Logo.tsx`](src/components/Logo.tsx) renders a placeholder wordmark — replace it with the real logo when it's ready.
- **Background photo:** [`src/assets/hero.jpg`](src/assets/hero.jpg). Replace the file (same name) to change it; the darkening overlay lives in [`src/app/page.module.css`](src/app/page.module.css).
- **Launch date via env:** copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_LAUNCH_DATE` (ISO 8601 with a timezone offset). Restart `npm run dev` after changing it.

## Supabase

Email signups and admin accounts live in [Supabase](https://supabase.com). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` (and in Vercel's environment variables).

One-time setup in the Supabase dashboard:

1. **Database:** open the SQL Editor and run each file in [`supabase/migrations/`](supabase/migrations/) in order (oldest first). They create the `subscribers`, `admins` and `contact_submissions` tables and their row-level security policies.
2. **Auth URLs:** under Authentication → URL Configuration, set the Site URL to the production domain and add `http://localhost:3000/**` and `https://<your-domain>/**` to Redirect URLs, so confirmation emails link back to the right place.

## Email signups

The form submits to a Server Action ([`src/app/actions.ts`](src/app/actions.ts)) that validates the address and saves it to the `subscribers` table via [`src/lib/subscribers.ts`](src/lib/subscribers.ts). Visitors can add their email but row-level security stops anyone except admins from reading the list.

## Contact form

The "Pull up a chair" form below the signup ([`src/components/ContactForm.tsx`](src/components/ContactForm.tsx)) asks for full name, email, an optional phone number and a message. Its heading and text live in `contact` in [`src/config/site.ts`](src/config/site.ts). It submits to the `submitContact` Server Action in [`src/app/actions.ts`](src/app/actions.ts), which validates the input and saves it to `contact_submissions`. The table also has optional `subject` and `inquiryType` columns, saved if a future form sends those fields.

## Admin dashboard

Only accounts you've granted access can see the dashboard:

- `/admin`: totals and the latest signups and messages
- `/admin/email-list`: every email signup
- `/admin/contact`: contact form messages, filterable by read status. Opening a message marks it read; messages can be marked unread or deleted.

1. Create an account at `/signup` and confirm it from the email Supabase sends.
2. Grant access by running this in the Supabase SQL Editor:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'person@example.com';
   ```

3. Sign in at `/login`.

Accounts without a row in `admins` see a "waiting for access" screen and can't read any data. To remove access, delete the person's row from `admins`.

Access is enforced in three places: [`src/proxy.ts`](src/proxy.ts) redirects signed-out visitors, [`src/lib/auth.ts`](src/lib/auth.ts) checks admin status before rendering, and the database policies refuse to return rows to anyone else.

## Project structure

```
src/
  assets/hero.jpg       Background photo
  app/
    layout.tsx          Fonts, metadata
    page.tsx            Landing page
    actions.ts          Signup Server Action
    globals.css         Global styles and color tokens
    (auth)/             /login and /signup pages, auth Server Actions
    auth/confirm/       Handles the email confirmation link
    admin/              Admin dashboard (sidebar layout, pages, actions)
  components/
    Logo.tsx            Placeholder logo
    Countdown.tsx       Live countdown (client component)
    SignupForm.tsx      Email form (client component)
    ContactForm.tsx     Contact form (client component)
    SocialLinks.tsx     Social icons
  config/site.ts        Editable site content
  lib/
    auth.ts             Admin session checks
    contact.ts          Contact form storage
    subscribers.ts      Signup storage
    supabase/           Supabase clients for server code and the proxy
  proxy.ts              Refreshes sessions, guards /admin
supabase/migrations/    Database schema
```
