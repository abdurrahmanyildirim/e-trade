const mongoose = require('mongoose');
const { isDevMode } = require('../../common');

const connectionString = isDevMode() ? process.env.MONGO_CLOUD : process.env.MONGO_LOCAL;

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
      if (isDevMode()) {
        console.log('Db connection activeted');
      }
    }
  }
);
