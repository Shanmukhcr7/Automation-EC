import { config } from '../../config/default';
import { BrowserManager } from '../browser/BrowserManager';
import { Constants } from '../utils/Constants';
import { CaptchaHandler } from '../components/CaptchaHandler';
import { Logger } from '../utils/Logger';

async function collectSession() {
  Logger.info('Starting Session Collector...');
  const browserManager = new BrowserManager(config);

  try {
    const page = await browserManager.initialize();
    
    // Navigate to the login page (or EC Search which redirects to login)
    Logger.info('Navigating to portal to collect session...');
    await page.goto(Constants.URLS.EC_SEARCH, { waitUntil: 'domcontentloaded' });

    // Wait for the user to manually log in
    await CaptchaHandler.waitForManualLoginAndNavigation();

    // Verify we are actually logged in (by checking URL or looking for an element)
    if (page.url().includes('login') || await page.locator('#username').count() > 0) {
      Logger.error('Login appears to have failed. Still on the login page.');
      process.exit(1);
    }

    // Save the session
    await browserManager.saveSession();
    Logger.info('Session collection successful! You can now run the main automation.');

  } catch (error: any) {
    Logger.error(`Session Collector failed: ${error.message}`);
  } finally {
    await browserManager.close();
  }
}

collectSession().catch(console.error);
