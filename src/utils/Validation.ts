import { z } from 'zod';

/**
 * Centralized validation schemas using Zod.
 */
export const Validation = {
  configSchema: z.object({
    headless: z.boolean(),
    timeout: z.number().positive(),
    downloadPath: z.string().min(1),
    baseUrl: z.string().url(),
    logLevel: z.string(),
    screenshotOnError: z.boolean(),
  }),
};
