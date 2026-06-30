import { Page } from 'playwright';
import { Logger } from '../utils/Logger';
import { Wait } from '../utils/Wait';

export class Dropdown {
  private page: Page;
  private selector: string;

  constructor(page: Page, selector: string) {
    this.page = page;
    this.selector = selector;
  }

  /**
   * Safely selects an option from the dropdown and waits for AJAX.
   */
  public async selectByValueOrText(valueOrText: string): Promise<void> {
    Logger.debug(`Selecting "${valueOrText}" in dropdown ${this.selector}`);
    const element = await Wait.forVisible(this.page, this.selector);
    
    // Select the option
    await element.selectOption({ label: valueOrText }).catch(() => element.selectOption({ value: valueOrText }));
    
    // Dropdowns in government portals often trigger AJAX to populate the next dropdown
    await Wait.forNetworkIdle(this.page);
  }
}
