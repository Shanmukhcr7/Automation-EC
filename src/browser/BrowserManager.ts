import { chromium, Browser, BrowserContext, Page } from 'playwright';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Logger } from '../utils/Logger';
import { AppConfig } from '../types';

const SESSION_FILE = path.join(process.cwd(), 'session.json');

export class BrowserManager {
  private config: AppConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor(config: AppConfig) {
    this.config = config;
  }

  public async initialize(): Promise<Page> {
    Logger.info(`Initializing BrowserManager. Headless: ${this.config.headless}`);
    
    this.browser = await chromium.launch({
      headless: this.config.headless,
      slowMo: 50, // Slight slow down to mimic human behavior
    });

    let storageState: string | undefined = undefined;
    if (fs.existsSync(SESSION_FILE)) {
      storageState = SESSION_FILE;
      Logger.info('Found existing session.json. Injecting session cookies...');
    }

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true,
      ignoreHTTPSErrors: true, // Common requirement for government portals
      storageState: storageState,
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.timeout);

    return this.page;
  }

  public async saveSession(): Promise<void> {
    if (this.context) {
      await this.context.storageState({ path: SESSION_FILE });
      Logger.info(`Session successfully saved to ${SESSION_FILE}`);
    }
  }

  public async close(): Promise<void> {
    Logger.info('Closing BrowserManager and cleaning up resources...');
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  public getPage(): Page {
    if (!this.page) {
      throw new Error('BrowserManager is not initialized. Call initialize() first.');
    }
    return this.page;
  }
}
