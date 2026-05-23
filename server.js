const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const USER = {
    username: "Steve Johan",
    password: "Password123"
};

app.post('/login', (req, res) => {

    const { username, password } = req.body;

    setTimeout(() => {

        if (
            username === USER.username &&
            password === USER.password
        ) {

            return res.json({
                success: true
            });

        } else {

            return res.status(401).json({
                success: false
            });
        }

    }, 2500);

});

app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
});

app.listen(PORT, () => {
    console.log(`SJT Drive running on ${PORT}`);
});