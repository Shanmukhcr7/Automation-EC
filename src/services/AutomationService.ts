import { BrowserManager } from '../browser/BrowserManager';
import { HomePage } from '../pages/HomePage';
import { ECSearchPage } from '../pages/ECSearchPage';
import { ResultPage } from '../pages/ResultPage';
import { DownloadManager } from '../components/DownloadManager';
import { AppConfig, ECSearchCriteria, AutomationResult } from '../types';
import { Logger } from '../utils/Logger';
import { Helpers } from '../utils/Helpers';

export class AutomationService {
  private config: AppConfig;
  private browserManager: BrowserManager;

  constructor(config: AppConfig) {
    this.config = config;
    this.browserManager = new BrowserManager(this.config);
  }

  /**
   * Orchestrates the complete EC retrieval workflow.
   */
  public async retrieveEC(criteria: ECSearchCriteria): Promise<AutomationResult> {
    Logger.info('Starting EC Retrieval Automation Workflow...');
    let page;

    try {
      page = await this.browserManager.initialize();
      const downloadManager = new DownloadManager(this.config.downloadPath);

      const homePage = new HomePage(page);
      const searchPage = new ECSearchPage(page);
      const resultPage = new ResultPage(page, downloadManager);

      // 1. Navigate directly to the EC Search Intro to preserve session
      await homePage.navigateToECSearch();

      // 2. Fill search criteria
      await searchPage.fillSearchCriteria(criteria);

      // 3. Wait for result and download
      const identifier = criteria.type === 'Property' 
        ? `${criteria.details.district}_${criteria.details.village}` 
        : criteria.details.documentNumber;
        
      const downloadedFilePath = await resultPage.downloadCertificate(identifier);

      Logger.info('Automation Workflow completed successfully.');
      return { success: true, filePath: downloadedFilePath };

    } catch (error: any) {
      Logger.error(`Automation Workflow failed: ${error.message}`);
      if (page && this.config.screenshotOnError) {
        await Helpers.takeScreenshotOnFailure(page, 'retrieveEC');
      }
      return { success: false, error: error.message };
    } finally {
      await this.browserManager.close();
    }
  }
}
