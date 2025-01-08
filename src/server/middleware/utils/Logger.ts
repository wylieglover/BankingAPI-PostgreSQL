// src/utils/logger.ts
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

// Ensure the logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Define custom log levels and colors
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white',
    },
};


winston.addColors(logLevels.colors);

// Define the log format
const logFormat = format.combine(
    format.timestamp({
        format: () => new Date().toISOString(),
    }),
    format.errors({ stack: true }), // Include stack trace
    format.splat(),
    format.json() // Output logs in JSON format
);

// Define transports
const loggerTransports = [
    // Console transport for development
    new transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: format.combine(
            format.colorize({ all: true }),
            format.printf(({ level, message, timestamp, stack }) => {
                return `${timestamp} [${level}]: ${stack || message}`;
            })
        ),
    }),

    // Daily rotate file transport for combined logs
    new DailyRotateFile({
        level: 'info',
        filename: path.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
    }),

    // Daily rotate file transport for error logs
    new DailyRotateFile({
        level: 'error',
        filename: path.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat,
    }),
];

// Create the Winston logger instance
const Logger: WinstonLogger = createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: loggerTransports,
    exitOnError: false, // Do not exit on handled exceptions
});

// Define a separate stream object for Morgan
const stream = {
    write: (message: string) => {
        // Morgan adds a newline at the end of each message, so we trim it
        Logger.http(message.trim());
    },
};

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error: Error) => {
    Logger.error('Uncaught Exception: %s', error.message);
    Logger.error(error.stack || '');
    process.exit(1); // Optional: exit the process
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    Logger.error('Unhandled Rejection at: %s, reason: %s', promise, reason);
    // Optionally, exit the process or perform other actions
});

// Export both Logger and stream
export { Logger, stream };