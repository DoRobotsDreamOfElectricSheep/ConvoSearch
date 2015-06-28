var express = require('express');
var moment = require('moment');
var conversationDbAdapter = require('../lib/conversation-db-adapter');

var router = express.Router();

router.post('/', function (req, res) {

    
    
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

router.get('/', function (req, res) {
    if (!req.query.fromDate || !req.query.toDate || !req.query.keywords)
        throw new Error("invalid query");
    
    var conn = conversationDbAdapter.create();
    
    //Get conversations id's that fit time frame
    conn.getConversations(req.query.fromDate, req.query.toDate, function (err, response) {
        if (err)
            throw new Error("Could't get conversations: " + err);
        //then get chunks that fit ids
    });
});

module.exports = router;
