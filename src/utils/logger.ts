import { LOG_DIR } from '@/config';
import { LogMorgan } from '@/interfaces/logMorgan.interface';
import SysLogService from '@/services/systemLoggers.service';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

// logs dir
const logDir: string = path.join(__dirname, LOG_DIR);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

//sysLog service
const _sysLog: SysLogService = new SysLogService();

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

export const stream = {
  write: (logdata: any) => {
    const data = JSON.parse(logdata) as LogMorgan;
    data.reqBody = JSON.parse(data.reqBody);
    
    if (data.method !== 'OPTIONS') {
      _sysLog.create(data);
    }
    logger.info(`${data.method} ${data.url} ${data.status} >>> ${data.totalTime}ms`);
  },
};
