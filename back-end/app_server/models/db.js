const mongoose = require('mongoose');

const connectionString = process.env.MONGO_CLOUD;
// const connectionString = process.env.MONGO_LOCAL;

mongoose.connect(
  connectionString,
  {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Db connection activeted');
    }
  }
);
