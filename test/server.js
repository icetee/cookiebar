const path = require('path');
const rootPath = path.resolve(__dirname, '..');

const express = require('express');
const pkg = require(rootPath + '/package.json');
const app = express();
const http = require('http');
const server = http.createServer(app);

//Set static folders
app.use(express.static('example'));
app.use('/dist', express.static(rootPath + '/dist/'));

app.get('/', function(req, res) {
  res.sendFile(rootPath + '/example/index.html');
});

app.listen(pkg.config.port, function() {
  console.log("Watching " + this.address().port);
});
