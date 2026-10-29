import {test,expect} from '@playwright/test'

test('Blocks the login when both fields are empty', async({page})=>{
  let loginRequestCount=0;
  await page.route('**/auth/login', async(route)=>{
    loginRequestCount+=1;
    await route.fulfill({status:401,body:'{}'});
  });

  await page.goto('/login');
  await page.getByRole('button',{name:'Sign in'}).click();
  const emailIsMissing=await page.getByLabel('Email Address').evaluate((input)=>input.validity.valueMissing);
  const passwordIsMissing=await page.getByLabel('Password').evaluate((input)=>input.validity.valueMissing);
  expect(emailIsMissing).toBe(true);
  expect(passwordIsMissing).toBe(true);
  expect(loginRequestCount).toBe(0);
})


test("blocks a malformed email", async({page})=>{
  
  let loginRequestCount=0;
  await page.route('**/auth/login', async(route)=>{
    loginRequestCount+=1;
    await route.fulfill({status:401,body:'{}'});
  });
await page.goto('/login');

const emailInput=page.getByLabel('Email Address');
await emailInput.fill('blahhh');
await page.getByLabel("Password").fill('iaugf');
await page.getByRole('button',{name:'Sign in'}).click();
const hasTypeMismatch=await emailInput.evaluate((input)=>input.validity.typeMismatch);
expect(hasTypeMismatch).toBe(true);
expect(loginRequestCount).toBe(0)
//expect(loginRequestCount).toBe(0);

})

test('shows a rejection message for a valid email with no account', async ({ page }) => {
  let loginRequestCount = 0;
  await page.route('**/auth/login', async (route) => {
    loginRequestCount += 1;
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid email or password' }),
    });
  });

  await page.goto('/login');
  const emailInput = page.getByLabel('Email Address');
  await emailInput.fill('newperson@example.com');
  await page.getByLabel('Password').fill('some-password');

  const emailHasTypeMismatch = await emailInput.evaluate(
    (input) => input.validity.typeMismatch,
  );
  expect(emailHasTypeMismatch).toBe(false);

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid email or password');
  await expect(page).toHaveURL(/\/login$/);
  expect(loginRequestCount).toBe(1);
});