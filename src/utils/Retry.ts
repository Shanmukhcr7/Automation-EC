import { Logger } from './Logger';

/**
 * Reusable retry logic for transient failures.
 */
export class Retry {
  static async execute<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 2000
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        Logger.warn(`Operation failed (Attempt ${attempt}/${retries}): ${error.message}`);
        if (attempt >= retries) {
          Logger.error(`Operation completely failed after ${retries} attempts.`);
          throw error;
        }
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
    throw new Error('Unreachable code in retry loop');
  }
}
