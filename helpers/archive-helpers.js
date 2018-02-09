var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html'),
  workerLog: path.join(__dirname, '../archives/log.txt'),
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    data = data.split('\n');
    callback(err, data);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    data = data.split('\n');
    var exists = data.includes(url);
    callback(err, exists);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, callback);
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(`${exports.paths.archivedSites}/${url}`, (err, data) => {
    if (err === null) {
      callback(null, true);      
    } else if (err.code === 'ENOENT') {
      callback(null, false);
    } else {
      callback(err, null);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url) => {
    request(`https://${url}`, function(error, response, body) {
      fs.writeFile(`${exports.paths.archivedSites}/${url}`, body);
      let date = new Date();
      let log = `The url: '${url}' was appended to file at ${date}!\n`;
      fs.appendFile(exports.paths.workerLog, log, (err) => {
        if (err) {
          console.error(err);
        }
        console.log(log);
      });
    });
  });
};
