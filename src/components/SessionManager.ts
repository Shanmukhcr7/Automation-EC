import { Page } from 'playwright';
import { Logger } from '../utils/Logger';

export class SessionManager {
  /**
   * Checks if the session has expired by looking for common portal indicators.
   */
  public static async isSessionExpired(page: Page): Promise<boolean> {
    const url = page.url();
    if (url.includes('sessionExpired') || url.includes('login')) {
      Logger.warn('Session expiry detected via URL.');
      return true;
    }
    
    // Check for generic session expiry text on the page
    const bodyText = await page.innerText('body').catch(() => '');
    if (bodyText.toLowerCase().includes('session expired')) {
      Logger.warn('Session expiry detected via page content.');
      return true;
    }
    
    return false;
  }
}
