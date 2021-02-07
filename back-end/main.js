const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
require('./app_server/models/db');
const cors = require('cors');
// const Status = require('./app_server/models/status');

// const categories = [
//   {
//     key: -1,
//     desc: 'İptal Edildi'
//   }
// ];

// categories.forEach((cy) => {
//   const dbCategory = new Status(cy);
//   dbCategory.save();
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./app_server/routes/routeManager')(app);

// Socket bağlantısını kurmak için io'yu socket-files/chat dosyasına gönderiyoruz.
// require('./app_server/socket-files/chat')(io);

http.listen(4205, () => {
  console.log('listening on * : ' + 4205);
});
