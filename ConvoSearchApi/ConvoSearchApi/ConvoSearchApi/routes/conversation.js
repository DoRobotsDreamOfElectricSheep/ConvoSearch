var express = require('express');
var moment = require('moment');
var conversationDbAdapter = require('../lib/conversation-db-adapter');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {

    var conn = conversationDbAdapter.create();
    
    var conversationStartTime = moment.utc().toDate().toUTCString()
    var conversation = "test convo"

    conn.createConversation(conversationStartTime, function (err, insertResponse) {
        if (err) return console.error(err);
        
        var chunkStartTime = moment.utc().toDate().toUTCString();
        var chunkWords = "this is a chunk";

        conn.createTextChunk(chunkStartTime, conversationStartTime, chunkWords, function (err, updateResponse) {
            if (err) return console.error(err);
            
            //testing end convo here, do real thing later
            var conversationEndTime = moment.utc().toDate().toUTCString();
            conn.endConversation(conversationStartTime, conversationEndTime, function (err, endResponse) {
                if (err) return console.error(err);

                console.log("done with convo " + endResponse);
            });
        });
    }); 
});

module.exports = router;
