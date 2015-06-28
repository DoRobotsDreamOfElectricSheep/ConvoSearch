var express = require("express");
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');
var request = require('request');

var sq = require('simplequeue');
var queue = sq.createQueue();

var port = 3700;
var app = express();
app.set('views', __dirname + '/');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/'))

app.get("/", function(req, res){
  res.render("index");
});

app.listen(port);

binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {

  client.on('stream', function(stream) {
  	
    stream.on('data', function(data){

	  	queue.putMessage(data);

	  	while(queue.next != queue.first) {
			var message = queue.getMessage(function(err, msg){

		    	var fileWriter = new wav.FileWriter('temp.wav', {
				  	chanels: 1,
				  	sampleRate: 48000,
				  	bitDepth: 16
				});

				fileWriter.write(msg);
				request.post(
				    'https://api.idolondemand.com/1/api/async/recognizespeech/v1?apikey=f35bb7a5-895f-423d-82dd-f0faffcd20c9&file=temp.wav',
				    { form: { apikey: 'f35bb7a5-895f-423d-82dd-f0faffcd20c9',
				    		  url: 'temp.wav' } },
				    function (error, response, body) {
				        if (!error && response.statusCode == 200) {
				            console.log(body)
				        } 
				    }
				);

		    });
		    
		}
	  	console.log("Push");
    });
  });
});


