const express = require('express');
const app = express();
const http = require('http').Server(app);
require('./app_server/models/db');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./app_server/routes/routeManager')(app);

http.listen(4205, () => {
  console.log('listening on * : ' + 4205);
});
