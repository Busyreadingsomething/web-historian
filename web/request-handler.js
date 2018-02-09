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
      var formatedUrl = `${archive.paths.archivedSites}${url}`;
      
      archive.isUrlArchived(url, (err, data) => {
        if (data) {
          serveAssets(res, url, (err, data) => {
            res.writeHead(200, headers);
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
          res.write(`${archive.paths.archivedSites}/${body}`);
          // http.get(`${archive.paths.archivedSites}/${body}`);
          // res.writeHead(303, headers);
          res.end();
          // serveAssets(res, `${archive.paths.archivedSites}/${body}`, (err, data) => {
          //   res.writeHead(303, headers);
          //   res.end(data);
          // });
        } else {
          archive.addUrlToList(body + '\n', () => {
            res.writeHead(302, headers);
            res.end();
          });
        }
      });
    });
  } else {
    res.end(archive.paths.list); 
  }
};
