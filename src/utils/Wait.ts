import { Page, Locator } from 'playwright';
import { Logger } from './Logger';

export class Wait {
  /**
   * Utility to wait for an element to be visible and stable.
   */
  static async forVisible(page: Page, selector: string, timeout: number = 30000): Promise<Locator> {
    Logger.debug(`Waiting for visibility: ${selector}`);
    const locator = page.locator(selector).first();
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Utility to wait for network idle to ensure AJAX requests are completed.
   */
  static async forNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    Logger.debug('Waiting for network idle...');
    await page.waitForLoadState('networkidle', { timeout });
  }
}
