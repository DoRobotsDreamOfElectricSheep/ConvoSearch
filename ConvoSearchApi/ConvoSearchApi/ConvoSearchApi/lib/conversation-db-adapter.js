var cps = require('cps-api');

var conversationDbAdapter = function() {
     var connection = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'First_Test', 'alex.d.nishikawa@gmail.com', 'rfgt&^%ehfkjtrefgF', 'document', 'document/id', { account: 100635 });

    function updateConversation(id, conversation, cb) {
        if (!id || !conversation)
            throw new Error("id and words must be valid or exist");
        
        var document = {
            id: id,
            conversation: conversation
        };
             
        var update_request = new cps.UpdateRequest(document);
        connection.sendRequest(update_request, cb);
    }

    function createConversation(id, conversation, cb) {
        if (!id)
            throw new Error("id must be valid or exist");

        var document = {
            id: id
        };
        
        if (conversation)
            document.conversation = conversation;

        var insert_request = new cps.InsertRequest(document);
        connection.sendRequest(insert_request, cb);
    }
    
    return {
        createConversation: createConversation,
        updateConversation: updateConversation
    };
}


exports.create = conversationDbAdapter;