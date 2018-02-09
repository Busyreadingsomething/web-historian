var archive = require('../helpers/archive-helpers');
// var CronJob = require('cron').CronJob;
// // Use the code in `archive-helpers.js` to actually download the urls
// // that are waiting.

// var job = new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
const workerBee = function() {
  archive.readListOfUrls((err, data) => {
    if (err) {
      let badCall = `Logging Error: ${err}`;
      fs.appendFile(exports.paths.workerLog, badCall, (err) => {
        if (err) {
          console.error(err);
        }
        console.log('Error Logged');
      });
    }
    data.pop();
    archive.downloadUrls(data);
  });
};

workerBee();