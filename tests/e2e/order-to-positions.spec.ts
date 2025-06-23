import { test, expect } from '@playwright/test';

test('should place an order and see it in PositionsWidget', async ({ page }) => {
  // 1. Open homepage
  await page.goto('/');

  // 2. Wait for TradeTicket and PositionsWidget to render
  await expect(page.getByText(/Trade/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Positions/i })).toBeVisible();

  // 3. Fill order form
  await page.getByLabel('Price (USDT)').fill('1000000');
  await page.getByLabel(/Amount/i).fill('0.01');

  // 4. Submit order (use unique button)
  await page.getByRole('button', { name: /Buy BTC/i }).click();

  // 5. Wait for order to be accepted
  await expect(page.getByText(/Order accepted/i)).toBeVisible({ timeout: 3000 });

  // 6. Assert position appears
  await expect(page.getByText(/BTCUSDT/i)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'LONG' })).toBeVisible();
  await expect(page.getByText('1000000.00')).toBeVisible();
  await expect(page.getByText('0.01')).toBeVisible();
}); 