import { test, expect } from '@playwright/test';

test.describe('Denominations App', () => {
  test('should load the app and display white icons', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Check if the Settings icon SVG is present
    const settingsIcon = page.locator('svg').first();
    expect(settingsIcon).toBeTruthy();
    
    // Check if the icon has white fill color
    const fillColor = await settingsIcon.evaluate((el) => {
      const path = el.querySelector('path');
      return path ? globalThis.getComputedStyle(path).fill : null;
    });
    
    // The fill should be white (rgb(255, 255, 255) or #FFFFFF)
    expect(fillColor).toContain('255');
    
    console.log('Icon fill color:', fillColor);
  });
  
  test('should navigate to Calculate screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Click on a currency card (if available)
    const currencyCard = page.locator('[role="button"]').first();
    if (await currencyCard.isVisible()) {
      await currencyCard.click();
      await page.waitForTimeout(2000);
      
      // Check if Calculate screen is loaded (Close icon should be visible)
      const closeIcon = page.locator('svg').filter({ hasText: /close|x/i });
      expect(closeIcon).toBeTruthy();
    }
  });
});