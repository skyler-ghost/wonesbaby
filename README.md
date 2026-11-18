# Wones Baby

React (Vite + Tailwind) storefront + Express/MongoDB API. Everything on the site (products, prices, stock,
orders, admin dashboard) now comes from the database through the API.

## Setup
1. `npm install`
2. `cp .env.example .env` and fill in `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   (and set `DEFAULT_CURRENCY`, e.g. `NGN`).
3. `npm run seed`      loads the 13 sample products + photos (only if the products collection is empty)
4. `npm run server:dev`  API on http://localhost:5000 (creates the owner admin from .env on first start)
5. `npm run dev`         site on http://localhost:5173 (Vite proxies /api and /uploads to the API)

## Pages
- `/shop`, `/product/:id`, `/cart`: live products, stock and prices
- `/checkout`: guest checkout, creates the order via `POST /api/orders` (prices are recalculated on the server)
- `/track`: customers track an order with order number + email (the order emails link here)
- `/admin`: login, dashboard, product management (with image upload), order + payment management

## Production
`npm run build`, then run the server with `NODE_ENV=production`: Express serves `dist/` and the API together.
If the frontend is hosted separately, set `VITE_API_URL` at build time and `CLIENT_URL` on the server (CORS).
