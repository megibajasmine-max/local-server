const express = require('express');
const cors = require('cors');
const app = express();

// Render sets this variable automatically, or falls back to 3000 locally
const PORT = process.env.PORT || 3000;

// 1. Configure CORS to allow incoming connections safely
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

// 2. Parse incoming JSON body data
app.use(express.json());

// 3. Base Clean Route
app.get('/', (req, res) => {
    res.send('Server is completely wiped and fresh! Ready for your next big idea.');
});

// 4. Bind server to port
app.listen(PORT, () => {
    console.log(`Fresh server running smoothly on port ${PORT}`);
});