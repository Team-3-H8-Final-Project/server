if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const cors = require('cors');
const express = require('express');

const { router } = require('./routers');
const errorHandler = require('./middleware/errorHandler');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router)

app.use(errorHandler)

module.exports = app
