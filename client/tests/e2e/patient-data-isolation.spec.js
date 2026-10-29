import { expect, test } from '@playwright/test';
import process from 'node:process';
test('a doctor sees only patients linked through their appointments',async({page})=>{
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(process.env.E2E_DOCTOR_A_EMAIL);
  await page.getByLabel('Password').fill(process.env.E2E_DOCTOR_A_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
  const patientsResponse = await page.request.get('http://127.0.0.1:5000/api/patients?all=true', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(patientsResponse.status()).toBe(200);
  const responseBody = await patientsResponse.json();
  expect(Array.isArray(responseBody.data)).toBe(true);
  const returnedNames = responseBody.data.map((patient) => patient.userId?.name);
  expect.soft(returnedNames).toContain(process.env.E2E_PATIENT_A_NAME);
  expect.soft(returnedNames).not.toContain(process.env.E2E_PATIENT_B_NAME);
  await page.goto('/patients');
  const patientASearchResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === '/api/patients'
      && url.searchParams.get('search') === process.env.E2E_PATIENT_A_NAME
      && response.request().method() === 'GET';
  });
  await page.getByRole('searchbox', { name: 'Search patients' }).fill(process.env.E2E_PATIENT_A_NAME);
  const patientASearchResponse = await patientASearchResponsePromise;
  expect(patientASearchResponse.status()).toBe(200);
  const patientASearchBody = await patientASearchResponse.json();
  expect(
    patientASearchBody.data.map((patient) => patient.userId?.name),
  ).toContain(process.env.E2E_PATIENT_A_NAME);
  await expect(
    page.getByRole('cell', { name: process.env.E2E_PATIENT_A_NAME, exact: true }),
  ).toBeVisible({ timeout: 15000 });
  const searchResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === '/api/patients'
      && url.searchParams.get('search') === process.env.E2E_PATIENT_B_NAME
      && response.request().method() === 'GET';
  });
  await page.getByRole('searchbox', { name: 'Search patients' }).fill(process.env.E2E_PATIENT_B_NAME);
  expect((await searchResponse).status()).toBe(200);
  await expect(page.getByRole('searchbox', { name: 'Search patients' })).toBeVisible();
  await expect(page.getByText('No patients match your search', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('cell', { name: process.env.E2E_PATIENT_B_NAME, exact: true }),
  ).toHaveCount(0);
});
