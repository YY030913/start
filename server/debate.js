if (Meteor.isServer) {
    Meteor.publish('debateByPost', function(postId) {
        check(postId, String);
 
        var self = this;
        return DebateColl.find({postId:postId});
        // self.ready();
    });


    Meteor.publishComposite('debateByUser', function(accountId) {
        check(accountId, String);
        return {
            find: function() {
                return DebateColl.find({accountId: accountId}, {sort: [["time", "desc"]]});
            },
            children: [
                {
                    find: function(debate) {
                        // Find post author. Even though we only want to return
                        // one record here, we use "find" instead of "findOne"
                        // since this function should return a cursor.
                        console.log(PostsColl.find().count());
                        return PostsColl.find(
                            { _id: debate.postId },
                            { limit: 1});
                    },
                },
            ]
        }
        
    });
}