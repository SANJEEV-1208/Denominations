import { test, expect } from '@playwright/test';

test.describe('Calculate Button Functionality', () => {
  test('should show real-time conversions as user types and navigate home on calculate', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the app to load and currencies to be fetched
    await page.waitForTimeout(3000);

    // Click on the first currency card to navigate to Calculate screen
    const currencyCard = await page.locator('[role="button"]').first();
    if (await currencyCard.isVisible()) {
      await currencyCard.click();
      await page.waitForTimeout(2000);

      // Clear the input field
      const clearButton = await page.locator('text=×').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
      }

      // Enter value using number pad
      await page.locator('text=2').first().click(); // Click number 2
      await page.waitForTimeout(500);

      // Check that conversions are shown in real-time (no dashes)
      const dashesWhileTyping = await page.locator('text=—').all();
      expect(dashesWhileTyping.length).toBe(0);
      console.log('Dashes while typing (should be 0):', dashesWhileTyping.length);

      // Check if conversion values are displayed in real-time
      const conversionValues = await page.locator('text=/\\d+\\.\\d+/').all();
      expect(conversionValues.length).toBeGreaterThan(0);
      console.log('Number of conversions displayed while typing:', conversionValues.length);

      // Click the calculate button - should navigate back to home
      const calculateButton = await page.locator('svg').filter({ has: page.locator('path[stroke="white"]') }).last();
      await calculateButton.click();

      // Wait for navigation
      await page.waitForTimeout(1000);

      // Verify we're back on the home screen (should see multiple currency cards)
      const homeCards = await page.locator('[role="button"]').all();
      expect(homeCards.length).toBeGreaterThan(0);
      console.log('Back on home screen with currency cards:', homeCards.length);
    }
  });
  
  test('should show conversions for all saved currencies', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Count the number of currency cards on home screen
    const homeCards = await page.locator('[role="button"]').all();
    const savedCurrencyCount = homeCards.length;
    console.log('Number of saved currencies:', savedCurrencyCount);
    
    if (savedCurrencyCount > 0) {
      // Click on the first currency
      await homeCards[0].click();
      await page.waitForTimeout(2000);
      
      // Enter a value
      await page.locator('text=5').first().click();
      await page.waitForTimeout(500);
      
      // Click calculate button
      const calculateButton = await page.locator('svg').filter({ has: page.locator('path[stroke="white"]') }).last();
      await calculateButton.click();
      await page.waitForTimeout(1000);
      
      // Count conversion cards (should be savedCurrencyCount - 1, excluding the selected currency)
      const conversionCards = await page.locator('text=/[A-Z]{3}.*\\(.*\\)/').all();
      console.log('Number of conversion cards:', conversionCards.length);
      
      // Verify we have conversions for all other currencies
      expect(conversionCards.length).toBe(savedCurrencyCount - 1);
    }
  });
});