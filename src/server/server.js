import express from 'express'; // Import the Express framework to create a web server
import cors from 'cors'; // Import the CORS middleware
import cookieParser from 'cookie-parser';

// import fileUpload from "express-fileupload";
import path from 'path'; // Import the path module to handle file and directory paths

// use fileURLToPath to recreate dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import api endpoint routes
import apiRouter from './routes/api.js';

const PORT = process.env.PORT || 3000; // Set the port to the environment variable PORT or default to 3000

// Create an instance of an Express application
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true,
  })
); // Add this line to enable CORS

app.use(cookieParser());

// Enable file upload middleware
// app.use(fileUpload());

// parse incoming request body in JSON format
app.use(express.json());

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
 * configure express global error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'DEFAULT ERROR: Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'Internal Server Error' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.error('GLOBAL ERROR HANDLER: ', {
    log: errorObj.log,
    status: errorObj.status,
    message: errorObj.message,
    stack: errorObj.stack, // Add stack trace
    path: req.path, // Add request path
    method: req.method, // Add request method
  });
  return res.status(errorObj.status).json(errorObj.message);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
});
