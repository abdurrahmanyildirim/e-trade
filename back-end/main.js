const express = require('express');
const app = express();
const server = require('http').Server(app);
require('./app_server/models/db');
const cors = require('cors');
const util = require('./app_server/services/util');
const verify = require('./app_server/services/verify');
const helmet = require('helmet');
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(util.bodyDecrypter);
app.use(verify.roleResolver);

require('./app_server/routes/routeManager')(app);
require('./app_server/services/socket').init(io);

const PORT = process.env.PORT || 4205;
server.listen(PORT, function () {
  console.log('Listening to : ' + PORT);
});
