var CronJob = require('cron').CronJob;
const { exec } = require('child_process');

var journalCleaner = new CronJob({
  cronTime: '0 0 * * 0',
  onTick: function () {
    const commandOne = 'sudo journalctl --rotate';
    const commandTwo = 'sudo journalctl --vacuum-time=2days';
    exec(`${commandOne} && ${commandTwo}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`Journal Files had been cleaned succesfully`);
    });
  },
  runOnInit: false
});

const initJobs = () => {
  journalCleaner.start();
};

module.exports = {
  initJobs
};
