const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
// app.options('*', cors()); 


app.get('/', (req, res) => {
  res.send('Hello World!');
});
const env = process.env;
const port = env.PORT || 3000;
const hostname = env.HOSTNAME || 'localhost';

mongoose.connect(env.MONGODB_CONNECTION_STRING).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
} );

app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port} and hostname ${hostname}`);
});
