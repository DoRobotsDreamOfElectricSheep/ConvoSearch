var wav = require('wav');
var io = require('socket.io')();



console.log("Listening on port " + 9001)
io.listen(9001);

io.on('connection', function(socket){
    console.log("Connected");
    socket.on('data', function(data) {
        console.log(data);
    });
});