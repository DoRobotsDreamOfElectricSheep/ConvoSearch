var cps = require('cps-api');

var conversationDbAdapter = function() {
    var conversationConnection = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'First_Test', 'alex.d.nishikawa@gmail.com', 'rfgt&^%ehfkjtrefgF', 'document', 'document/id', { account: 100635 });
    var textChunkConnection = new cps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'TextChunks', 'alex.d.nishikawa@gmail.com', 'rfgt&^%ehfkjtrefgF', 'document', 'document/id', { account: 100635 });

    function createConversation(conversationStartTime, cb) {
        if (!conversationStartTime)
            throw new Error("conversationStartTime must be valid or exist");

        var document = {
            id: conversationStartTime
        };

        var insert_request = new cps.InsertRequest(document);
        conversationConnection.sendRequest(insert_request, cb);
    }
    
    function createTextChunk(textChunkStartTime,conversationStartTime, words, cb) {
        if (!textChunkStartTime || !conversationStartTime || !words)
            throw new Error("textChunkStartTime, conversationStartTime, and words must be valid or exist");
        
        var document = {
            id: textChunkStartTime,
            conversationId: conversationStartTime,
            words: words
        };
        
        var insert_request = new cps.InsertRequest(document);
        textChunkConnection.sendRequest(insert_request, cb);
    }
    
    function endConversation(id, endTime, cb) {
        if (!id || !endTime)
            throw new Error("id and endTime must be valid or exist");

        var document = {
            id: id,
            endTime: endTime,
        };

        var updateRequest = new cps.UpdateRequest(document, cb);
        conversationConnection.sendRequest(updateRequest, cb);
    }

    return {
        createConversation: createConversation,
        endConversation: endConversation,
        createTextChunk: createTextChunk
    };
};


exports.create = conversationDbAdapter;