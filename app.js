require('dotenv').config();
require('express-async-errors');
// express
const express = require('express');
const app = express();
// other packages
const morgan = require('morgan');
const expressFileUpload = require('express-fileupload');

// data base
const connectDB = require('./db/connect');
// routers
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const dogRouter = require('./routes/dogRouter');
const horseRouter = require('./routes/horseRouter');
// middleWare
const errorHandler = require('./middleWare/error-handler');
const notFound = require('./middleWare/not-found');

app.use(express.static('./public'));
app.use(express.json());
app.use(expressFileUpload());
app.use(morgan('tiny'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/dogs', dogRouter);
app.use('/api/v1/horses', horseRouter);

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`app is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
