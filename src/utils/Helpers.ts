import { Page, Locator } from 'playwright';
import { Wait } from './Wait';
import { Logger } from './Logger';

/**
 * Reusable robust actions combining waiting, clicking, and filling.
 */
export class Helpers {
  static async safeClick(page: Page, selector: string, timeout?: number): Promise<void> {
    const element = await Wait.forVisible(page, selector, timeout);
    Logger.debug(`Clicking on ${selector}`);
    await element.click();
  }

  static async safeFill(page: Page, selector: string, value: string, timeout?: number): Promise<void> {
    const element = await Wait.forVisible(page, selector, timeout);
    Logger.debug(`Filling ${selector} with value: ${value}`);
    await element.fill(value);
  }

  static async takeScreenshotOnFailure(page: Page, testName: string): Promise<void> {
    const path = `logs/error-${testName}-${Date.now()}.png`;
    await page.screenshot({ path, fullPage: true });
    Logger.info(`Saved error screenshot to ${path}`);
  }
}
