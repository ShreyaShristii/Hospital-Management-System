import { defineConfig } from '@playwright/test';
import process from 'node:process';
import { createRequire } from 'node:module';

const backendRequire = createRequire(new URL('../backend/package.json', import.meta.url));
backendRequire('dotenv').config({ path: new URL('.env.e2e.local', import.meta.url) });

for (const name of [
  'E2E_DOCTOR_A_EMAIL',
  'E2E_DOCTOR_A_PASSWORD',
  'E2E_PATIENT_A_NAME',
  'E2E_PATIENT_B_NAME',
]) {
  if (!process.env[name]?.trim()) {
    throw new Error(`Set ${name} in client/.env.e2e.local before running the isolation test.`);
  }
}

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'patient-data-isolation.spec.js',
  use: {
    baseURL: 'http://127.0.0.1:5173',
  },
  webServer: {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
      cwd: '.',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      env: {
        NODE_ENV: 'development',
        VITE_API_URL: 'http://127.0.0.1:5000/api',
      },
  },
});
