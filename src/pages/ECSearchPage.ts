import { Page } from 'playwright';
import { Logger } from '../utils/Logger';
import { Selectors } from '../utils/Selectors';
import { Helpers } from '../utils/Helpers';
import { Dropdown } from '../components/Dropdown';
import { ECSearchCriteria } from '../types';
import { CaptchaHandler } from '../components/CaptchaHandler';
import { Constants } from '../utils/Constants';

export class ECSearchPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fills the EC search form based on the provided criteria.
   */
  public async fillSearchCriteria(criteria: ECSearchCriteria): Promise<void> {
    Logger.info(`Initiating EC Search by: ${criteria.type}`);

    if (criteria.type === 'Property') {
      await Helpers.safeClick(this.page, Selectors.SEARCH_CRITERIA_PROPERTY);
      await this.fillPropertyDetails(criteria.details);
    } else {
      await Helpers.safeClick(this.page, Selectors.SEARCH_CRITERIA_DOCUMENT);
      await this.fillDocumentDetails(criteria.details);
    }

    Logger.info('Search form filled. Waiting for user to solve CAPTCHA before submitting...');
    
    // There is a CAPTCHA on the EC Search page as well
    await CaptchaHandler.waitForManualIntervention(Constants.MESSAGES.MANUAL_CAPTCHA_PROMPT);

    Logger.info('Submitting form...');
    await Helpers.safeClick(this.page, Selectors.SUBMIT_BUTTON);
  }

  private async fillPropertyDetails(details: any): Promise<void> {
    Logger.info('Filling property details...');
    
    const districtDropdown = new Dropdown(this.page, Selectors.DISTRICT_DROPDOWN);
    await districtDropdown.selectByValueOrText(details.district);

    const sroDropdown = new Dropdown(this.page, Selectors.SRO_DROPDOWN);
    await sroDropdown.selectByValueOrText(details.sro);

    const villageDropdown = new Dropdown(this.page, Selectors.VILLAGE_DROPDOWN);
    await villageDropdown.selectByValueOrText(details.village);

    if (details.surveyNumber) {
      await Helpers.safeFill(this.page, Selectors.SURVEY_NO_INPUT, details.surveyNumber);
    }
    if (details.plotNumber) {
      await Helpers.safeFill(this.page, Selectors.PLOT_NO_INPUT, details.plotNumber);
    }

    await Helpers.safeFill(this.page, Selectors.FROM_YEAR_INPUT, details.fromYear);
    await Helpers.safeFill(this.page, Selectors.TO_YEAR_INPUT, details.toYear);
  }

  private async fillDocumentDetails(details: any): Promise<void> {
    Logger.info('Filling document details...');
    await Helpers.safeFill(this.page, Selectors.DOC_NO_INPUT, details.documentNumber);
    await Helpers.safeFill(this.page, Selectors.DOC_YEAR_INPUT, details.year);
    
    // SRO is an autocomplete input, not a simple dropdown
    await Helpers.safeFill(this.page, Selectors.DOC_SRO_INPUT, details.sro);
  }
}
