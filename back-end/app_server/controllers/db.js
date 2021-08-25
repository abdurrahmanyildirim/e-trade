const { spawn } = require('child_process');
const path = require('path');
const JSZip = require('jszip');
const fs = require('fs');

module.exports.createBackUp = async (req, res) => {
  const DB_NAME = 'e-trade';
  const ARCHIVE_PATH = path.join(__dirname);
  const child = spawn('C:/Program Files/MongoDB/Server/4.4/bin/mongodump.exe', [
    `--db=${DB_NAME}`,
    `--out=${ARCHIVE_PATH}`
  ]);
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) {
      console.log('Process exit with code:', code);
    } else if (signal) {
      console.log('Process killed with signal:', signal);
    } else {
      const zip = new JSZip();
      const files = fs.readdirSync(`${__dirname}/e-trade`);
      files.forEach((file) => {
        const data = fs.readFileSync(`${__dirname}/e-trade/${file}`);
        zip.file(file, data);
      });
      zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
        res.status(200).send(content);
        fs.rmdirSync(`${__dirname}/e-trade`, { force: true, recursive: true });
      });
    }
  });
};
