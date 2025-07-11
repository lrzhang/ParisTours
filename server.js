const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Handling unhandled exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting 💥 down...');
  console.log(err.name, err.message);

  // Shut down immediately
  process.exit(1);
});

// specify the path of configuration file
dotenv.config({ path: './config.env' }); // MUST BE BEFORE requiring app file

const app = require('./app');

// Handle both local MongoDB and MongoDB Atlas connections
let DB = process.env.DATABASE_URL || process.env.DATABASE;
if (process.env.DATABASE_PASSWORD && DB && DB.includes('<PASSWORD>')) {
  DB = DB.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
}

console.log(DB);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log(err));

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handling unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting 💥 down...');
  console.log(err.name, err.message);

  // Shut down gracefully
  server.close(() => {
    process.exit(1);
  });
});

// Handling SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
