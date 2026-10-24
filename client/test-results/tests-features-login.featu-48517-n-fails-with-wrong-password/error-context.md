# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\features\login.feature.spec.js >> User Login >> Login fails with wrong password
- Location: client\.features-gen\tests\features\login.feature.spec.js:13:3

# Error details

```
Error: Missing step: Given I am on the login page
```

# Test source

```ts
  1  | // Generated from: tests\features\login.feature
  2  | import { test } from "playwright-bdd";
  3  | 
  4  | test.describe('User Login', () => {
  5  | 
  6  |   test('Successful login with valid credentials', async ({ Given, When, Then, And, page }) => { 
  7  |     await Given('I am on the login page', null, { page }); 
  8  |     await When('I enter email "admin@hms.com" and password "admin123"', null, { page }); 
  9  |     await And('I click Sign In', null, { page }); 
  10 |     await Then('I should be on the dashboard', null, { page }); 
  11 |   });
  12 | 
  13 |   test('Login fails with wrong password', async ({ Given,When,Then, And, page }) => { 
> 14 |     await Given('I am on the login page', null, { page }); 
     |           ^ Error: Missing step: Given I am on the login page
  15 |     await When('I enter email "admin@hms.com" and password"wrongpass"', null, { page }); 
  16 |     await And('I click Sign In', null, { page }); 
  17 |     await Then('I should see an error message', null, {page}); 
  18 |   });
  19 | 
  20 | });
  21 | 
  22 | // == technical section ==
  23 | 
  24 | test.use({
  25 |   $test: [({}, use) => use(test), { scope: 'test', box: true }],
  26 |   $uri: [({}, use) => use('tests\\features\\login.feature'), { scope: 'test', box: true }],
  27 |   $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
  28 | });
  29 | 
  30 | const bddFileData = [ // bdd-data-start
  31 |   {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I enter email \"admin@hms.com\" and password \"admin123\"","stepMatchArguments":[{"group":{"start":14,"value":"\"admin@hms.com\"","children":[{"start":15,"value":"admin@hms.com","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"admin123\"","children":[{"start":44,"value":"admin123","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And I click Sign In","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then I should be on the dashboard","stepMatchArguments":[]}]},
  32 |   {"pwTestLine":13,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":14,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I enter email \"admin@hms.com\" and password \"wrongpass\"","stepMatchArguments":[{"group":{"start":14,"value":"\"admin@hms.com\"","children":[{"start":15,"value":"admin@hms.com","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"wrongpass\"","children":[{"start":44,"value":"wrongpass","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I click Sign In","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message","stepMatchArguments":[]}]},
  33 | ]; 
```