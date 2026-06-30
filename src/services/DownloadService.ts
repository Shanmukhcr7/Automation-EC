import * as fs from 'fs-extra';
import * as path from 'path';
import { Logger } from '../utils/Logger';

/**
 * Service to manage auxiliary download operations (e.g. cleanup, archiving).
 * The actual intercepting happens via DownloadManager.
 */
export class DownloadService {
  private downloadPath: string;

  constructor(downloadPath: string) {
    this.downloadPath = downloadPath;
  }

  /**
   * Cleans up older files in the download directory if necessary.
   */
  public async cleanup(daysOld: number = 7): Promise<void> {
    Logger.info(`Cleaning up downloads older than ${daysOld} days...`);
    if (!fs.existsSync(this.downloadPath)) {
      return;
    }

    const files = await fs.readdir(this.downloadPath);
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(this.downloadPath, file);
      const stats = await fs.stat(filePath);
      
      const diffDays = (now - stats.mtimeMs) / msInDay;
      if (diffDays > daysOld) {
        await fs.remove(filePath);
        Logger.debug(`Deleted old download: ${file}`);
      }
    }
  }
}
