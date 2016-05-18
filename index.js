const express = require('express'),
    pkg = require('./package.json'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);

//Set static folders
app.use(express.static('example'));
app.use('/dist', express.static(__dirname + '/dist/'));

app.get('/', function(req, res) {
    res.sendFile('/example/index.html');
});

app.listen(pkg.config.port, function() {
    console.log("Watching " + this.address().port);
});
