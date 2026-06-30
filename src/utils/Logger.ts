import winston from 'winston';
import fs from 'fs-extra';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
fs.ensureDirSync(LOG_DIR);

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

/**
 * Enterprise-grade logger utilizing Winston.
 * Supports colored console output and persistent file logging.
 */
export const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, `automation-${new Date().toISOString().slice(0, 10)}.log`),
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
    }),
  ],
});
