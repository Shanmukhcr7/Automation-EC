import { test, expect } from '@playwright/test';
import { Constants } from '../src/utils/Constants';

test.describe('Telangana Portal Automation Utility Tests', () => {
  test('should load the home page successfully', async ({ page }) => {
    const response = await page.goto(Constants.URLS.HOME, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    const title = await page.title();
    expect(title).toBeDefined();
  });

  test('should be able to reach the EC Search portal (will hit auth wall)', async ({ page }) => {
    const response = await page.goto(Constants.URLS.EC_SEARCH, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    
    // As observed, it redirects to User Registration/Login
    const title = await page.title();
    expect(title).toContain('Registration');
  });
});
