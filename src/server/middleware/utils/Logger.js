"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.Logger = void 0;
// src/utils/logger.ts
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const winston_2 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const fs_1 = __importDefault(require("fs"));
// Ensure the logs directory exists
const logDir = path_1.default.join(__dirname, '../logs');
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
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
winston_2.default.addColors(logLevels.colors);
// Define the log format
const logFormat = winston_1.format.combine(winston_1.format.timestamp({
    format: () => new Date().toISOString(),
}), winston_1.format.errors({ stack: true }), // Include stack trace
winston_1.format.splat(), winston_1.format.json() // Output logs in JSON format
);
// Define transports
const loggerTransports = [
    // Console transport for development
    new winston_1.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston_1.format.combine(winston_1.format.colorize({ all: true }), winston_1.format.printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} [${level}]: ${stack || message}`;
        })),
    }),
    // Daily rotate file transport for combined logs
    new winston_daily_rotate_file_1.default({
        level: 'info',
        filename: path_1.default.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: logFormat,
    }),
    // Daily rotate file transport for error logs
    new winston_daily_rotate_file_1.default({
        level: 'error',
        filename: path_1.default.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: logFormat,
    }),
];
// Create the Winston logger instance
const Logger = (0, winston_1.createLogger)({
    levels: logLevels.levels,
    format: logFormat,
    transports: loggerTransports,
    exitOnError: false, // Do not exit on handled exceptions
});
exports.Logger = Logger;
// Define a separate stream object for Morgan
const stream = {
    write: (message) => {
        // Morgan adds a newline at the end of each message, so we trim it
        Logger.http(message.trim());
    },
};
exports.stream = stream;
// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception: %s', error.message);
    Logger.error(error.stack || '');
    process.exit(1); // Optional: exit the process
});
process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at: %s, reason: %s', promise, reason);
    // Optionally, exit the process or perform other actions
});
