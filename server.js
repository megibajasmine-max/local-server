const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process'); // Required to execute local Python scripts
const app = express();

const PORT = process.env.PORT || 3000;

// 1. Configure CORS to accept requests from local files (origin 'null') and Netlify
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

// 2. Base landing check
app.get('/', (req, res) => {
    res.send('Server is live! Stock Engine and Security Gates are fully active.');
});

// 3. POST Route: Password Verification
app.post('/secret', (req, res) => {
    const receivedSecret = req.body.secret;
    if (receivedSecret === MASTER_PASSWORD) {
        res.json({ success: true, message: "Access Granted! 🎉" });
    } else {
        res.json({ success: false, message: "Access Denied! ❌" });
    }
});

// Helper function to handle the Python spawn process lifecycle
function executePythonScript(command, args, res) {
    const pythonProcess = spawn(command, args);
    let pythonData = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    // Handle environment failures gracefully (e.g., if 'python3' command doesn't exist)
    pythonProcess.on('error', (err) => {
        if (command === 'python3') {
            console.log("python3 command failed, trying fallback to 'python'...");
            return executePythonScript('python', args, res);
        }
        return res.status(500).json({ 
            error: "Python execution environments not responding.", 
            details: err.message 
        });
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0 || pythonError) {
            console.error(`Python (${command}) Error Stream:`, pythonError);
            return res.status(500).json({ 
                error: "Python script returned a failure.", 
                details: pythonError.trim() || `Exit code: ${code}`
            });
        }

        try {
            const parsedStockDetails = JSON.parse(pythonData);
            res.json(parsedStockDetails);
        } catch (error) {
            res.status(500).json({ 
                error: "Failed to parse JSON data returned from local Python execution.",
                rawReceived: pythonData 
            });
        }
    });
}

// 4. POST Route: Python Stock Engine
app.post('/stock', (req, res) => {
    const requestedTicker = req.body.ticker || "AAPL";
    // Initiate the execution chain starting with 'python3'
    executePythonScript('python3', ['script.py', requestedTicker], res);
});

// 5. Bind server to port
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});