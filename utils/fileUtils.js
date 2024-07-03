const fs = require('fs');

const readFileAndSend = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
};

module.exports = { readFileAndSend };
