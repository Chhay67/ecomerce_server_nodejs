const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
// app.options('*', cors()); 


app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port} and hostname ${hostname}`);
});
