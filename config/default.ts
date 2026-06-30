import dotenv from 'dotenv';
import path from 'path';
import { Validation } from '../src/utils/Validation';
import { AppConfig } from '../src/types';

// Load environment variables from .env file
dotenv.config();

/**
 * Initializes and validates the application configuration.
 * Exits the process if validation fails.
 */
function loadConfig(): AppConfig {
  const rawConfig = {
    headless: process.env.HEADLESS === 'true',
    timeout: parseInt(process.env.TIMEOUT || '60000', 10),
    downloadPath: path.resolve(process.cwd(), process.env.DOWNLOAD_PATH || './downloads'),
    baseUrl: process.env.BASE_URL || 'https://registration.telangana.gov.in',
    logLevel: process.env.LOG_LEVEL || 'info',
    screenshotOnError: process.env.SCREENSHOT_ON_ERROR !== 'false',
  };

  try {
    return Validation.configSchema.parse(rawConfig);
  } catch (error) {
    console.error('Configuration Validation Failed:', error);
    process.exit(1);
  }
}

export const config = loadConfig();
