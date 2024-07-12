require ('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const summaryRouter = require('./routes/summary');
app.use('/api', summaryRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});



