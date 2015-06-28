var wav = require('wav');
var exp = require('express');
var http = require('http').Server(exp);
var io = require('socket.io')(http);


console.log("Listening on port " + 9001)


io.on('connection', function(socket){
    console.log("Connected");
    socket.on('data', function(data) {
        console.log(data);
    });
});

http.listen(9001);
