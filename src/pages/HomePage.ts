import { Page } from 'playwright';
import { Logger } from '../utils/Logger';
import { Constants } from '../utils/Constants';
import { Retry } from '../utils/Retry';
import { CaptchaHandler } from '../components/CaptchaHandler';
import { Helpers } from '../utils/Helpers';
import { Selectors } from '../utils/Selectors';

export class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the portal home page.
   */
  public async navigate(): Promise<void> {
    Logger.info(`Navigating to home page: ${Constants.URLS.HOME}`);
    await Retry.execute(async () => {
      await this.page.goto(Constants.URLS.HOME, { waitUntil: 'domcontentloaded' });
      Logger.info('Home page loaded successfully.');
    });
  }

  /**
   * Navigates to the EC Search page.
   * Throws an error if the session is missing or expired.
   */
  public async navigateToECSearch(): Promise<void> {
    Logger.info('Attempting to navigate to EC Search Intro Page...');
    
    // We must navigate to the EC Search Intro page first.
    // Jumping directly to tgigrs.telangana.gov.in causes an "Unauthorised Access" error
    // because the portal relies on a form POST/redirect to pass the session across domains.
    await Retry.execute(async () => {
      await this.page.goto(Constants.URLS.EC_SEARCH, { waitUntil: 'domcontentloaded' });
    });

    // Check if we hit the login wall (meaning session is invalid/expired)
    const loginFormExists = await this.page.locator(Selectors.LOGIN_USERNAME).count() > 0;

    if (loginFormExists) {
      const msg = 'Session invalid or expired. Please re-run the collector script (npm run collect).';
      Logger.error(msg);
      throw new Error(msg);
    }

    Logger.info('Valid session detected! We are on the EC Intro page. Clicking Submit to cross domains...');
    
    // Click the submit button that transfers us to the tgigrs domain
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.click(Selectors.INTRO_SUBMIT_BUTTON)
    ]);
    
    Logger.info('Successfully navigated to the final EC Document Search form.');
  }
}
