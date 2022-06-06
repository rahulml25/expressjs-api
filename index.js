const express = require('express');
const { errorHandler } = require('./middleware/error');
require('dotenv').config();

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', require('./api'));

app.use(errorHandler);
app.listen(port, () => console.log(`Server started: http://localhost:${port}`));
