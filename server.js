var wav = require('wav');
var binaryServer = require('binaryjs').BinaryServer;

var server = binaryServer({port: 9001});

server.on('connection', function(client){
    console.log('connected');
    client.on('stream', function(stream, meta){
        console.log(meta);
    });
});