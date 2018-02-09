var path = require('path');
var urlParser = require('url');
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
      archive.isUrlArchived(url, (err, data) => {
        if (data) {
          console.log(url);
          serveAssets(res, `${archive.paths.archivedSites}${url}`, (err, data) => {
            res.writeHead(200, headers);
            console.log(data);
            res.end(data);
          });
        } else {
          res.writeHead(404, headers);
          res.end('File does not exist');
        }
      });
    }
  } else if (method === 'POST') {
    let body = [];
    req.on('error', function(err) {
      console.error(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() { 
      body = Buffer.concat(body).toString().slice(4);

      archive.isUrlInList(body, (err, exists) => {
        console.log(exists, body);
        if (exists) {
          res.writeHead(303, {location: `/${body}`});
          res.end();
        } else {
          archive.addUrlToList(body + '\n', () => {
            res.writeHead(302, {location: `${archive.paths.loading.slice(59)}`});
            res.end();
          });
        }
      });
    });
  } else {
    res.end(archive.paths.list); 
  }
};
