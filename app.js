const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 2000;
const appRoutes = require('./routes/routes');

app.use('/api', appRoutes);

const start = async () => {
  try {
    await connectDB();
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();