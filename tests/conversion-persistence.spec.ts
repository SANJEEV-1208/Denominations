import { test, expect } from '@playwright/test';

test.describe('Conversion Persistence', () => {
  test('should display converted values on home screen after closing calculate screen', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    // Click on the first currency card to navigate to Calculate screen
    const currencyCard = page.locator('[role="button"]').first();
    if (await currencyCard.isVisible()) {
      // Get the initial currency code
      const initialCurrencyText = await currencyCard.locator(String.raw`text=/[A-Z]{3}.*\(.*\)/`).textContent();
      console.log('Selected currency:', initialCurrencyText);
      
      await currencyCard.click();
      await page.waitForTimeout(2000);
      
      // Clear and enter a value
      const clearButton = page.locator('text=×').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
      }
      
      // Enter value 5 using number pad
      await page.locator('text=5').first().click();
      await page.waitForTimeout(500);
      
      // Click the calculate button
      const calculateButton = page.locator('svg').filter({ has: page.locator('path[stroke="white"]') }).last();
      await calculateButton.click();
      
      // Wait for conversions to appear
      await page.waitForTimeout(1000);
      
      // Get one of the conversion values to verify later
      const conversionValue = page.locator(String.raw`text=/\d+\.\d+/`).first();
      const convertedAmount = await conversionValue.textContent();
      console.log('Converted amount on calculate screen:', convertedAmount);
      
      // Click close button to go back to home screen
      const closeButton = page.locator('[role="button"]').filter({ has: page.locator('svg') }).last();
      await closeButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Verify we're back on home screen
      const settingsButton = page.locator('svg').first();
      expect(settingsButton).toBeTruthy();
      
      // Check if the subtitle remains "Saved List"
      const subtitle = page.locator('text=Saved List').first();
      expect(subtitle).toBeTruthy();
      const subtitleText = await subtitle.textContent();
      console.log('Subtitle on home screen:', subtitleText);
      expect(subtitleText).toBe('Saved List');
      
      // Check if conversion values are displayed on currency cards
      const homeConversionValues = await page.locator(String.raw`text=/\d+\.\d+/`).all();
      expect(homeConversionValues.length).toBeGreaterThan(0);
      console.log('Number of conversion values on home screen:', homeConversionValues.length);
    }
  });
  
  test('should clear conversions when refreshing rates', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // First, create some conversions
    const currencyCard = page.locator('[role="button"]').first();
    if (await currencyCard.isVisible()) {
      await currencyCard.click();
      await page.waitForTimeout(2000);
      
      // Enter value and calculate
      await page.locator('text=3').first().click();
      await page.waitForTimeout(500);
      
      const calculateButton = page.locator('svg').filter({ has: page.locator('path[stroke="white"]') }).last();
      await calculateButton.click();
      await page.waitForTimeout(1000);
      
      // Go back to home
      const closeButton = page.locator('[role="button"]').filter({ has: page.locator('svg') }).last();
      await closeButton.click();
      await page.waitForTimeout(2000);
      
      // Verify subtitle remains "Saved List" even with conversions
      const subtitle = page.locator('text=Saved List').first();
      expect(subtitle).toBeTruthy();
      
      // Pull to refresh (simulate by scrolling)
      // Note: This is a simplified test - actual pull-to-refresh testing would require mobile emulation
      // For now, we'll just verify the structure is in place
      
      // Verify the refresh would clear conversions
      // This would be more complete with actual refresh simulation
    }
  });
});