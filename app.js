// This file serves as an entry point for Render.com deployment
// It simply requires and uses the main index.js file

// Import the app from index.js
const { app } = require('./index');

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

// Start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}