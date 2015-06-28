var express = require('express');
var moment = require('moment');
var conversationDbAdapter = require('../lib/conversation-db-adapter');

var router = express.Router();

router.post('/textChunk', function (req, res) {
    var conn = conversationDbAdapter.create();
    var chunkStartTime = moment().valueOf();
    var chunkWords = req.body.textChunk;
    var conversationId = req.body.conversationId;

    conn.createTextChunk(chunkStartTime, conversationId, chunkWords, function (err, updateResponse) {
        if (err) {
            res.json({ error: err });
            return;
        }
        
        res.json({ textChunkId: chunkStartTime });
    });
});

router.put('/end', function (req, res) {
    var conn = conversationDbAdapter.create();
    var conversationEndTime = moment().valueOf();
    var conversationId = req.body.conversationId;
    conn.endConversation(conversationId, conversationEndTime, function (err, endResponse) {
        if (err) return console.error(err);
        
        res.json({ ended: conversationEndTime });
    });
});

router.post('/create', function (req, res) {
    var conn = conversationDbAdapter.create();
    var conversationStartTime = moment().valueOf();
    
    conn.createConversation(conversationStartTime, function (err, insertResponse) {
        if (err) {
            res.json({ error: err });
            return;
        }
        
        res.json({conversationId: conversationStartTime}); 
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
        
        if (!response.results)
            res.json({}   ); 

        conn.getTextChunks(response.results.document, function (err, response) {
            if (!response.results) {
                res.json({ results: 0 });
                return;
            }

            res.json(response.results.document); 
        });
       
    });
});

module.exports = router;
