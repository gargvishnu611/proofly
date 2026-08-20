const { test, expect } = require('@playwright/test');

async function assertNoPageErrors(page, errors) {
  page.on('pageerror', err => errors.push(String(err)));
}

test.describe('Proofly public site', () => {
  test('home renders and primary navigation works', async ({ page }) => {
    const errors = [];
    await assertNoPageErrors(page, errors);
    await page.goto('file://' + process.cwd() + '/index.html');
    await expect(page).toHaveTitle(/Proofly/);

    for (const label of ['Check Risk', 'Create Proof', 'Verify Proof', 'Report Scam', 'Dashboard']) {
      const button = page.getByRole('button', { name: label, exact: true }).first();
      await expect(button).toBeVisible();
    }
    expect(errors, 'No uncaught page errors on initial load').toEqual([]);
  });

  test('risk check returns a result', async ({ page }) => {
    const errors = [];
    await assertNoPageErrors(page, errors);
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.getByRole('button', { name: 'Check Risk', exact: true }).first().click();
    const input = page.locator('input').filter({ has: undefined }).first();
    await input.fill('@demo_scammer');
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await expect(page.getByText(/HIGH RISK|SUSPICIOUS SIGNALS|LIMITED INFORMATION/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('create proof flow can create and verify a proof', async ({ page }) => {
    const errors = [];
    await assertNoPageErrors(page, errors);
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.getByRole('button', { name: 'Create Proof', exact: true }).first().click();

    const inputs = page.locator('input');
    const textareas = page.locator('textarea');
    await inputs.nth(0).fill('@buyer_test');
    await inputs.nth(1).fill('₹5,000');
    await textareas.first().fill('Test transaction claim for automated QA.');
    await page.getByRole('button', { name: /Create Proof/i }).last().click();

    await expect(page.getByText(/Proof Created|Proof created|PF-/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('report scam flow validates and creates a case', async ({ page }) => {
    const errors = [];
    await assertNoPageErrors(page, errors);
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.getByRole('button', { name: 'Report Scam', exact: true }).first().click();

    const inputs = page.locator('input');
    const textareas = page.locator('textarea');
    await inputs.first().fill('@report_test');
    await inputs.nth(1).fill('₹1,000');
    await textareas.first().fill('Automated QA fraud report.');
    await page.getByRole('button', { name: /Create Fraud Case/i }).click();

    await expect(page.getByText(/Case-|created|Fraud Case/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('login and account flow works', async ({ page }) => {
    const errors = [];
    await assertNoPageErrors(page, errors);
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    const email = page.locator('input[type="email"]').first();
    await email.fill('qa@example.test');
    const continueBtn = page.getByRole('button', { name: /Continue/i }).first();
    await continueBtn.click();
    await expect(page.getByText(/Dashboard|qa@example.test/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test.describe('Proofly admin entry', () => {
  test('admin page loads without client errors', async ({ page }) => {
    const errors = [];
    await assertNoPageErrors(page, errors);
    await page.goto('file://' + process.cwd() + '/admin.html');
    await expect(page).toHaveTitle(/Proofly Admin/);
    expect(errors, 'Admin page should load without uncaught JS errors').toEqual([]);
  });
});
