const mongoose = require('mongoose');
const config = require('../../config');

const connectionString = config.connection_strings.mongo_cloud;

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
