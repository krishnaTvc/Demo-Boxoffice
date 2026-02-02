const { test, expect } = require('@playwright/test');

test('Add a movie and verify it appears in list (with visual waits)', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000); // 👀 see page load

  await page.getByLabel('MovieName').fill('Manasvp');
  await page.waitForTimeout(700);

  await page.getByLabel('Hero').fill('chiranjeevi');
  await page.waitForTimeout(700);

  await page.getByLabel('Collection').fill('360');
  await page.waitForTimeout(700);

  await page.getByLabel('Running').check();
  await page.waitForTimeout(700);

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(1500); // 👀 see submit + save

  await expect(page.getByText('Saved successfully')).toBeVisible();

  await page.getByRole('button', { name: 'List All' }).click();
  await page.waitForTimeout(1500); // 👀 see table refresh

  const row = page.locator('table tr', { hasText: 'Rajasaab' });
  await expect(row).toBeVisible();
});