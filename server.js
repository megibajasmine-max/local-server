const express = require('express');
const cors = require('cors');
const app = express();

// Render automatically provides a PORT environment variable, defaults to 3000 locally
const PORT = process.env.PORT || 3000;

// 1. Enable CORS for all methods to pass browser security and preflight checks
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middleware to parse incoming JSON payloads from your frontend
app.use(express.json());

// 3. Define the master password (uses environment variable on Render, or falls back to default)
const MASTER_PASSWORD = process.env.MY_SECRET_PASSWORD || "supersecret123";

// 4. Base landing route
app.get('/', (req, res) => {
    res.send('Server is live! Use the frontend to submit credentials.');
});

// 5. POST route for checking the credential sent by your frontend
app.post('/secret', (req, res) => {
    const receivedSecret = req.body.secret;

    if (receivedSecret === MASTER_PASSWORD) {
        res.json({ 
            success: true, 
            message: "Access Granted! The credential is correct. 🎉" 
        });
    } else {
        res.json({ 
            success: false, 
            message: "Access Denied! Incorrect credential. ❌" 
        });
    }
});

// 6. Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});