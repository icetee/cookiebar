const express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);

//Set static folders
app.use(express.static('public'));
app.use('/dist', express.static(__dirname + '/dist/'));

app.get('/', function(req, res) {
    res.sendFile('/public/index.html');
});

app.listen(8080, function() {
    console.log("Watching " + this.address().port);
});
