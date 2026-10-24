# React + Vite

## Local login setup

Copy `.env.example` to `.env.local` and keep `VITE_API_URL=http://localhost:5000/api`
when using the local backend. Run `npm run dev` in both `backend` and `client`
from separate terminals. Restart Vite after changing environment variables.
Accounts must exist in the database configured for that backend; a hosted account
does not automatically exist in your local database.

For deployment, set `VITE_API_URL` to your HTTPS API URL before building and configure
the backend's `PROD_CLIENT_URL` to match the frontend origin. Never disable certificate
verification to work around a failed connection.

Passwords are masked in the form but remain visible in your own browser's Network
request payload. HTTPS encrypts them in transit; the backend hashes passwords with
bcrypt and excludes them from authentication responses. Do not include credentials
in recordings or logs. Redux DevTools redact password fields from auth actions in
development and are disabled in production. Session tokens, not passwords, are
stored in local storage; protect against XSS and use demo-only accounts for demos.

Run focused authentication regression tests with `node --test tests/auth.test.mjs`
from `client`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
