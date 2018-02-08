var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const { method, url, headers } = req;
  console.log(method, url, headers);
  if (method === 'GET' && url === '/') {
    res.end('<html><body><h1>Hello, World!</h1></body></html>');
  }
  res.end(archive.paths.list);
};
