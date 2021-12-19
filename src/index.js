const path = require('path')
require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;

const keeper = require('./keeper');
keeper.init();

app.get('*', (req, res) => {
    res.status(404);
    res.send('Ooops... this URL does not exist');
});

app.listen(PORT, () => {
    console.log(`Monitor running on port ${PORT}...`);
});
