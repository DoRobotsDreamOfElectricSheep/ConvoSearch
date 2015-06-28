var express = require('express');
var moment = require('moment');
var conversationDbAdapter = require('../lib/conversation-db-adapter');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {

    var conn = conversationDbAdapter.create();
    
    var id = moment.utc().toDate().toUTCString()
    var conversation = "test convo"

    conn.createConversation(id, conversation, function (err, insertResponse) {
        if (err) return console.error(err);
        
        conversation = conversation + " more convo";

        conn.updateConversation(id, conversation, function (err, updateResponse) {
            if (err) return console.error(err);
            
            //do whatever next
        });
    }); 
});

module.exports = router;
