const express = require('express');
const app = express();
const http = require('http').Server(app);
require('./app_server/models/db');
const cors = require('cors');
const util = require('./app_server/services/util');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(util.bodyDecrypter);

require('./app_server/routes/routeManager')(app);

app.use((req, res, next) => {
  console.log('BU middleware');
  return res.status(200).send(req.data);
});

http.listen(4205, () => {
  console.log('listening on * : ' + 4205);
});
