const express = require('express');
const app = express();
// Use the port Render gives us, or fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// This is your default route (the homepage of your local server)
app.get('/', (req, res) => {
  res.send('Hello! Your local Node.js server is officially running.');
});

// A sample API route that returns JSON data
app.get('/api/user', (req, res) => {
  res.json({
    id: 1,
    name: 'Alex Developer',
    status: 'Active'
  });
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`🚀 Server is live at http://localhost:${PORT}`);
});