import { test, expect } from '@playwright/test';

test('dummy test', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await page.getByRole('button', { name: 'turn up' }).click();
  await expect(page.locator('#mega-counter')).toContainText('1');
});
