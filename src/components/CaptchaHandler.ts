import * as readline from 'readline';
import { Logger } from '../utils/Logger';
import { Constants } from '../utils/Constants';

/**
 * Handles manual intervention scenarios such as CAPTCHA, OTP, and Login.
 */
export class CaptchaHandler {
  /**
   * Pauses the Node execution and waits for the user to press ENTER in the console.
   */
  public static async waitForManualIntervention(promptMessage: string): Promise<void> {
    Logger.info('Waiting for manual intervention...');
    console.log(promptMessage);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Press ENTER once you are ready to continue...', () => {
        Logger.info('Manual intervention confirmed by user. Proceeding...');
        rl.close();
        resolve();
      });
    });
  }

  /**
   * Pauses the Node execution and waits for the user to press ENTER in the console.
   */
  public static async waitForManualLoginAndNavigation(): Promise<void> {
    return this.waitForManualIntervention(Constants.MESSAGES.MANUAL_AUTH_PROMPT);
  }
}
