var path = require('path');
var archive = require('../helpers/archive-helpers');
var {serveAssets} = require ('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const { method, url, headers } = req;
  if (method === 'GET' && url === '/') {
    serveAssets(res, archive.paths.index, (err, data) => {
      res.writeHead(200, headers);
      res.end(data);
    });
  } else {
    res.end(archive.paths.list); 
  }
};
