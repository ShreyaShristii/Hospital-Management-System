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

Run the Playwright login test from the repository root with `npm test` or
`npm run test:e2e`. Playwright starts the Vite frontend automatically. The login
rejection test stubs the authentication API response, so it does not require a
running backend or a database account.

The patient data-isolation test uses manually prepared fake accounts on the
local backend at port 5000. Keep that backend running against development/test
data. Patient A must have an appointment with Doctor A; Patient B must have an
appointment with Doctor B only.

Set `E2E_DOCTOR_A_EMAIL`, `E2E_DOCTOR_A_PASSWORD`, `E2E_PATIENT_A_NAME`, and
`E2E_PATIENT_B_NAME` in `client/.env.e2e.local` (ignored by Git). The patient
variables are exact display names. Never commit credentials or use real patient
records. The test only reads records; it does not create or delete them.

From `client`, run `npx playwright test --config playwright.isolation.config.js`.
Stop any existing frontend on port 5173 first: Playwright starts its own frontend
there to ensure it calls the correct local backend. This test checks the full API
list and the searched patient table. The usual login-only command is
`npx playwright test tests/e2e/login.spec.js`; the isolation test requires its
separate config and local credentials.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
