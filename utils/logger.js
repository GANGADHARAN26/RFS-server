const winston = require('winston'); // Import the Winston library for logging.

const logger = winston.createLogger({
    // Set the log level based on the environment
    level: process.env.NODE_ENV === 'production' ? "info" : "debug",
    // Explanation:
    // - In production, logs will only include "info" and higher levels (e.g., "error").
    // - In non-production environments, logs will include more detailed levels like "debug".

    format: winston.format.combine(
        winston.format.timestamp(), // Adds a timestamp to each log message.
        winston.format.errors({ stack: true }), // Captures and includes error stack traces in logs.
        winston.format.splat(), // Allows using string interpolation in logs (e.g., `%s` or `${}`).
        winston.format.json() // Formats the log output as JSON for easier parsing.
    ),

    defaultMeta: { service: 'rfs-server' },
    // Adds default metadata to each log entry.
    // In this case, it identifies the "service" as 'identity-service'.

    transports: [
        // Console Transport: Logs are printed to the console.
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Adds colors to log levels for better readability in the console.
                winston.format.simple() // Simplifies the log output for the console (no JSON formatting here).
            )
        }),

        // File Transport: Logs error-level messages to 'error.log'.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // - Only "error" level logs and above (e.g., "fatal") are written to this file.

        // File Transport: Logs all messages (of any level) to 'combined.log'.
        new winston.transports.File({ filename: 'combined.log' }),
        // - Includes logs of all levels for comprehensive log storage.
    ]
});

module.exports = logger;
// Exports the logger so it can be used in other parts of the application.
// Example Usage:
// const logger = require('./path/to/logger');
// logger.info('This is an info message');
// logger.error('This is an error message');
