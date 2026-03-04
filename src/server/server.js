import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRouter from './routes/api.js';
import logger, { requestLogger } from './shared/logger.js';
import { AppError } from './shared/errorHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000; // Set the port to the environment variable PORT or default to 3000

// Create an instance of an Express application
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both frontend origins
    credentials: true,
  })
);

app.use(cookieParser());

// app.use(xmlparser());

// Enable file upload middleware
// app.use(fileUpload());

app.use(express.json());
app.use(requestLogger);

// Serve static files
app.use(express.static(path.join(__dirname, '../build')));

// define route for api endpoints
app.use('/api', apiRouter);

// // Define a route for the root URL
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html")); // Send the index.html file as a response
// });
// Catch-all route to serve index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Send the index.html file as a response
});

/**
 * handle unknown route: 404
 */
app.use((req, res) => res.sendStatus(404));

/**
 * Global error handler.
 * Supports both the new AppError class and the legacy { status, message: { err }, log } format.
 * Always returns the standard envelope: { success: false, error: string }
 */
app.use((err, req, res, _next) => {
  let status, userMessage, logMessage;

  if (err instanceof AppError) {
    status = err.status;
    userMessage = err.message;
    logMessage = err.log;
  } else if (err.status && err.message) {
    // Legacy format: { status, message: { err: string }, log }
    status = err.status || 500;
    userMessage =
      (typeof err.message === 'object' && err.message?.err) ||
      (typeof err.message === 'string' && err.message) ||
      'Internal Server Error';
    logMessage = err.log || userMessage;
  } else {
    status = 500;
    userMessage = 'Internal Server Error';
    logMessage = err.message || String(err);
  }

  logger.error(
    { status, path: req.path, method: req.method, error: logMessage, stack: err.stack },
    'Request error'
  );

  return res.status(status).json({
    success: false,
    error: userMessage,
  });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
