var path = require('path');
var archive = require('../helpers/archive-helpers');
var {serveAssets} = require ('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  const { method, url, headers } = req;
  console.log(method, url);
  if (method === 'GET') {
    if (url === '/') {
      serveAssets(res, archive.paths.index, (err, data) => {
        res.writeHead(200, headers);
        res.end(data);
      });
    } else {
      var formatedUrl = `${archive.paths.archivedSites}${url}`;
      
      archive.isUrlArchived(url, (err, data) => {
        if (data) {
          serveAssets(res, formatedUrl, (err, data) => {
            res.writeHead(200, headers);
            res.end(data);
          });
        } else {
          res.writeHead(404, headers);
          res.end('File does not exist');
        }
      });
      
      // console.log('THEY CHANGED ME!', exists);
      
      // if (!exists) {
      //   res.writeHead(404, headers);
      //   res.end('File does not exist');
      // } else {
      //   serveAssets(res, formatedUrl, (err, data) => {
      //     res.writeHead(200, headers);
      //     res.end(data);
      //   });
      // }
    }
  } else {
    res.end(archive.paths.list); 
  }
};
