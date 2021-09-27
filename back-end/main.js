const express = require('express');
const app = express();
const server = require('http').Server(app);
const { isDevMode } = require('./common');
const path = require('path');
// Projelere göre değiştirilecek
process.env.NODE_ENV = 'dev';
require('dotenv').config({
  path: path.join(__dirname + '/env/' + process.env.NODE_ENV + '.env')
});
require('./app_server/models/db');
const cors = require('cors');
const util = require('./app_server/services/util');
const verify = require('./app_server/services/verify');
const helmet = require('helmet');

const ioCors = {};
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

const corsOpts = {};

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

if (!isDevMode()) {
  app.use(express.static(__dirname + '/dist'));
}

require('./app_server/routes/routeManager')(app);
require('./app_server/services/socket').init(io);

const PORT = process.env.PORT;
// '0.0.0.0'
server.listen(PORT, function () {
  if (isDevMode()) {
    console.log('Listening to : ' + PORT);
  }
});
