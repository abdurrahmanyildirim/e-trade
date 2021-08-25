// const { spawn } = require('child_process');
// const path = require('path');
// const zl = require('zip-lib');
// const JSZip = require('jszip');
// const fs = require('fs');

// const DB_NAME = 'e-trade';
// const ARCHIVE_PATH = path.join(__dirname);

// const child = spawn('C:/Program Files/MongoDB/Server/4.4/bin/mongodump.exe', [
//   `--db=${DB_NAME}`,
//   `--out=${ARCHIVE_PATH}`,
//   '--gzip'
// ]);
// child.stdout.on('data', (data) => {
//   console.log('stdout:\n', data);
// });
// child.stderr.on('data', (data) => {
//   console.log('stderr:\n', Buffer.from(data).toString());
// });
// child.on('error', (error) => {
//   console.log('error:\n', error);
// });
// child.on('exit', (code, signal) => {
//   if (code) console.log('Process exit with code:', code);
//   else if (signal) console.log('Process killed with signal:', signal);
//   else {
//     const zip = new JSZip();
//     const files = fs.readdirSync(`${__dirname}/e-trade`);
//     files.forEach((file) => {
//       zip.file(`${__dirname}/e-trade/${file}`);
//     });
//     zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
//       console.log(content);
//       fs.rmdirSync(`${__dirname}/e-trade`, { force: true, recursive: true });
//     });
//   }
// });
