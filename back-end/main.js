const express = require('express');
const app = express();
const server = require('http').Server(app);
require('./app_server/models/db');
const cors = require('cors');
const util = require('./app_server/services/util');
const verify = require('./app_server/services/verify');
const helmet = require('helmet');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(util.bodyDecrypter);
app.use(verify.roleResolver);

require('./app_server/routes/routeManager')(app);

const PORT = process.env.PORT || 4205;
server.listen(PORT, function () {
  console.log('Listening to : ' + PORT);
});
