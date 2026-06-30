import { Page } from 'playwright';
import { Logger } from '../utils/Logger';
import { Selectors } from '../utils/Selectors';
import { DownloadManager } from '../components/DownloadManager';
import { Wait } from '../utils/Wait';

export class ResultPage {
  private page: Page;
  private downloadManager: DownloadManager;

  constructor(page: Page, downloadManager: DownloadManager) {
    this.page = page;
    this.downloadManager = downloadManager;
  }

  /**
   * Waits for the results page to load or detects if no records were found.
   */
  public async waitForResults(): Promise<void> {
    Logger.info('Waiting for results page to load...');
    
    // We race between the download button appearing, or an error/no-records message appearing
    try {
      await Promise.race([
        this.page.waitForSelector(Selectors.DOWNLOAD_BUTTON, { timeout: 30000 }),
        this.page.waitForSelector('text="No Data Found"', { timeout: 30000 }),
        this.page.waitForSelector('text="Invalid"', { timeout: 30000 })
      ]);
    } catch (e) {
      throw new Error('Results page timed out. Neither the download button nor a recognized error message appeared.');
    }

    const noData = await this.page.locator('text="No Data Found"').count() > 0;
    if (noData) {
      throw new Error('Search completed, but the portal returned: No Data Found for this document.');
    }

    Logger.info('Results page loaded successfully.');
  }

  /**
   * Triggers and manages the EC download from the results page.
   */
  public async downloadCertificate(identifier: string): Promise<string> {
    Logger.info('Waiting for results page to load...');
    await Wait.forNetworkIdle(this.page);
    
    // Verify that the download button exists
    const downloadButton = await Wait.forVisible(this.page, Selectors.DOWNLOAD_BUTTON);
    
    Logger.info('Results loaded. Triggering download...');
    const action = async () => {
      await downloadButton.click();
    };

    const filePath = await this.downloadManager.waitForDownload(this.page, action, `EC_${identifier}`);
    Logger.info(`EC Certificate successfully downloaded to ${filePath}`);
    
    return filePath;
  }
}
