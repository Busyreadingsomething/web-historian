var archive = require('../helpers/archive-helpers');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
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
    console.log('--------->', data);
    archive.downloadUrls(data);
  });
};

workerBee();