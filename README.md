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

## Email signups

The form submits to a Server Action ([`src/app/actions.ts`](src/app/actions.ts)) that validates the address and saves it with [`src/lib/subscribers.ts`](src/lib/subscribers.ts).

Right now signups are stored locally in `data/subscribers.json` (gitignored), which is fine for development. Before deploying, replace `addSubscriber` with a call to an email provider or database — most hosts (e.g. Vercel) don't persist files written at runtime.

## Project structure

```
src/
  assets/hero.jpg     Background photo
  app/
    layout.tsx        Fonts, metadata
    page.tsx          Landing page
    actions.ts        Signup Server Action
    globals.css       Global styles and color tokens
  components/
    Logo.tsx          Placeholder logo
    Countdown.tsx     Live countdown (client component)
    SignupForm.tsx    Email form (client component)
    SocialLinks.tsx   Social icons
  config/site.ts      Editable site content
  lib/subscribers.ts  Signup storage
```
