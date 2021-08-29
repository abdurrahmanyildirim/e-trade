const { spawn } = require('child_process');
const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/e-trade'; // env'den alınabilir ama gerek yok.
const dbName = 'e-trade';
const backupPath = `${__dirname}/back-up/`;

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
      mongoose.connection.dropDatabase().then(() => {
        restoreDb();
      });
    }
  }
);


const restoreDb = () => {
  // Linux için mongorestore komutu yeterli
  const child = spawn('C:/Program Files/MongoDB/Server/4.4/bin/mongorestore.exe', [
    `--nsInclude=${dbName}.*`,
    `${backupPath}`
  ]);
  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else {
      console.log('Mongostore finished');
    }
  });
};
