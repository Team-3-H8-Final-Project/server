require('dotenv').config();

const express = require('express');
const { router } = require('./routers');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router)




app.use(errorHandler)
app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`)
})