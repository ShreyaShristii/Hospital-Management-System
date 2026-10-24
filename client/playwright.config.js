import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.js',
  outputDir: '.features-gen',   
});

export default defineConfig({
  testDir,
  use: {
    baseURL: 'http://localhost:5173',
    headless: false,
  },
});