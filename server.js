const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, 'files.json');

app.use(cors());

app.use(express.json({
    limit: '50mb'
}));

app.use(express.static(__dirname));

const USER = {
    username: 'Steve Johan',
    password: 'Password123'
};

app.get('/', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'index.html')
    );

});

app.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (
        username === USER.username &&
        password === USER.password
    ) {

        res.json({
            success: true
        });

    } else {

        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });

    }

});

app.post('https://local-server-1-0ht9.onrender.com', (req, res) => {

    const fileData = req.body;

    let files = [];

    if (fs.existsSync(DB_FILE)) {

        files = JSON.parse(
            fs.readFileSync(DB_FILE)
        );

    }

    files.unshift(fileData);

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(files, null, 2)
    );

    res.json({
        success: true
    });

});

app.get('/files', (req, res) => {

    if (!fs.existsSync(DB_FILE)) {
        return res.json([]);
    }

    const files = JSON.parse(
        fs.readFileSync(DB_FILE)
    );

    res.json(files);

});

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});