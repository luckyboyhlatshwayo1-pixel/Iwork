# Local Hands Marketplace

This is the source project for the `genuine-froyo-9469iwork` Netlify marketplace site.

## What is wired together

- `src/routes/index.tsx` contains the TanStack Router home route, provider search, category filters, saved providers, booking form, client request dashboard, and provider onboarding form.
- `src/styles.css` contains the warm marketplace theme, provider cards, panels, booking panel, forms, and responsive mobile behavior.
- `db/schema.ts` defines the Drizzle tables for saved providers, booking requests, client requests, and provider onboarding.
- `netlify/functions/marketplace.ts` exposes `/api/marketplace` for GET and POST calls used by the UI.

## Run locally

```bash
npm install
npm run dev
```

## Build for Netlify

```bash
npm run build
```

Netlify uses `netlify.toml` to publish `dist` and bundle the function.
