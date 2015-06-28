var express = require('express');
var pkg = require('./package.json');


var app = express();


module.exports = app;

app.set('port', process.env.PORT || 15000);



var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log('a user connected');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
