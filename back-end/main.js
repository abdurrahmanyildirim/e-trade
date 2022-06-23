const express = require('express');
const app = express();
const server = require('http').Server(app);
const { isDevMode } = require('./common');
const path = require('path');

const { initJobs } = require('./jobs');

// Env files under env folder. We will change env name by the project.
process.env.NODE_ENV = 'github';
require('dotenv').config({
  path: path.join(__dirname + '/env/' + process.env.NODE_ENV + '.env')
});

const cors = require('cors');
const util = require('./app_server/services/util');
const verify = require('./app_server/services/verify');
const helmet = require('helmet');
const routes = require('./app_server/routes/routeManager');
const compression = require('compression');
const db = require('./app_server/database/connection');

db.init();

let ioCors = {};
if (!isDevMode()) {
  ioCors = {
    origin: process.env.ORIGIN
  };
}

const io = require('socket.io')(server, {
  cors: ioCors
});

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

let corsOpts = {};

if (!isDevMode()) {
  corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200 // For legacy browser support
  };
}

app.set('trust proxy', true);
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(util.bodyDecrypter);
app.use(verify.roleResolver);
app.use(compression());

if (!isDevMode()) {
  app.use(express.static(__dirname + '/dist'));
}

app.use('/api', routes);
if (!isDevMode()) {
  app.use('/*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/dist/index.html'));
  });
}

require('./app_server/services/socket').init(io);

if (!isDevMode()) {
  initJobs();
}

const PORT = process.env.PORT;
// '0.0.0.0'
server.listen(PORT, function () {
  if (isDevMode()) {
    console.log('Listening to : ' + PORT);
  }
});
