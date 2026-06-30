import { Page, Download } from 'playwright';
import * as path from 'path';
import fs from 'fs-extra';
import { Logger } from '../utils/Logger';

export class DownloadManager {
  private downloadPath: string;

  constructor(downloadPath: string) {
    this.downloadPath = downloadPath;
    fs.ensureDirSync(this.downloadPath);
  }

  /**
   * Waits for a download event on the page, saves it, and validates its size.
   */
  public async waitForDownload(page: Page, action: () => Promise<void>, customName: string): Promise<string> {
    Logger.info('Initiating download sequence...');
    
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      action()
    ]);

    const suggestedFilename = download.suggestedFilename();
    Logger.debug(`Suggested filename: ${suggestedFilename}`);

    const ext = path.extname(suggestedFilename) || '.pdf';
    const finalName = `${customName}_${new Date().toISOString().replace(/[:.]/g, '')}${ext}`;
    const finalPath = path.join(this.downloadPath, finalName);

    Logger.info(`Saving download to: ${finalPath}`);
    await download.saveAs(finalPath);

    this.verifyDownload(finalPath);

    return finalPath;
  }

  private verifyDownload(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Download verification failed: File does not exist at ${filePath}`);
    }
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error(`Download verification failed: File size is 0 bytes at ${filePath}`);
    }
    Logger.info(`Download verified successfully. Size: ${stats.size} bytes.`);
  }
}
