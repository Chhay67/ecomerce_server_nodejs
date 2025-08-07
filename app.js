const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const env = process.env;
const apiPrefix = env.API_PREFIX;
const app = express();
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./middlewares/error_handler');
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(authJwt());
app.use(errorHandler)
// app.options('*', cors()); 
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

app.use(`${apiPrefix}/`, authRouter);
app.use(`${apiPrefix}/users`, userRouter);
app.use(`${apiPrefix}/admin`, adminRouter);

const port = env.PORT;
const hostname = env.HOST;

mongoose.connect(env.MONGODB_CONNECTION_STRING).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port} and hostname ${hostname} apiPrefix ${apiPrefix}`);
});
