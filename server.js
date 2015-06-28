var wav = require('wav');


var io = require('socket.io')();
io.on('connection', function(socket){
    console.log("Connected");
});
io.listen(9001);
