import { config } from '../config/default';
import { AutomationService } from './services/AutomationService';
import { DownloadService } from './services/DownloadService';
import { Logger } from './utils/Logger';
import { ECSearchCriteria } from './types';
import * as fs from 'fs-extra';
import * as path from 'path';

async function main() {
  Logger.info('Starting Telangana Registration Portal Automation...');

  const sessionPath = path.join(process.cwd(), 'session.json');
  if (!fs.existsSync(sessionPath)) {
    Logger.error('Session cookies not found. Please run the collector file first: npm run collect');
    process.exit(1);
  }

  // Initialize Services
  const automationService = new AutomationService(config);
  const downloadService = new DownloadService(config.downloadPath);

  // Optional: Cleanup old downloads
  await downloadService.cleanup();

  // Define Search Criteria
  // In a real-world scenario, this would come from a database, API, or message queue.
  const searchCriteria: ECSearchCriteria = {
    type: 'Document',
    details: {
      documentNumber: '1234',
      year: '2023',
      sro: 'Hyderabad',
    },
  };

  // Execute Automation
  const result = await automationService.retrieveEC(searchCriteria);

  if (result.success) {
    Logger.info(`Automation completed successfully. File saved at: ${result.filePath}`);
    process.exit(0);
  } else {
    Logger.error(`Automation failed: ${result.error}`);
    process.exit(1);
  }
}

main().catch((error) => {
  Logger.error(`Unhandled Exception: ${error.message}`);
  process.exit(1);
});
