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
    
    function getConversations(fromDate, toDate, cb) {
        if (!fromDate || !toDate)
            throw new Error("fromDate and toDate must be valid or exist");
        
        var q = "<query><id>&gt; 2015-01-01</id></query><docs>20</docs><offset>0</offset><list><document>yes</document></list>";
        var search_req = new cps.SearchRequest({ query:  '<id> > 2015-06-26</id>' }); //, endTime: '<=' + toDate});
        search_req.setOrdering(cps.NumericOrdering("id", "asc"));
        conversationConnection.sendRequest(search_req, cb);
    }
    
    
    

    return {
        createConversation: createConversation,
        endConversation: endConversation,
        createTextChunk: createTextChunk,
        getConversations: getConversations
    };
};


exports.create = conversationDbAdapter;