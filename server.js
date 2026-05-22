const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process'); // Required to run python scripts
const app = express();

const PORT = process.env.PORT || 3000;

// 1. Configure CORS to accept local testing pages cleanly
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin === 'null') {
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

const MASTER_PASSWORD = process.env.MY_SECRET_PASSWORD || "supersecret123";

// 2. Base Route
app.get('/', (req, res) => {
    res.send('Server is live! Ready for stock lookups and validation.');
});

// 3. Password Validation Route
app.post('/secret', (req, res) => {
    const receivedSecret = req.body.secret;
    if (receivedSecret === MASTER_PASSWORD) {
        res.json({ success: true, message: "Access Granted! 🎉" });
    } else {
        res.json({ success: false, message: "Access Denied! ❌" });
    }
});

// 4. Python Stock Engine Route (The missing route causing your 404!)
app.post('/stock', (req, res) => {
    const requestedTicker = req.body.ticker || "AAPL";

    // Spawns 'python3 script.py TICKER' on the Render system
    const pythonProcess = spawn('python3', ['script.py', requestedTicker]);

    let pythonData = '';

    // Catch data printed by Python's print() statement
    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    // Send data back to frontend once script closes
    pythonProcess.on('close', (code) => {
        try {
            const parsedStockDetails = JSON.parse(pythonData);
            res.json(parsedStockDetails);
        } catch (error) {
            res.status(500).json({ error: "Failed to read data from local Python script." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});