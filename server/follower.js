if (Meteor.isServer) {
    Meteor.publish('follower', function(accountId, followerId) {
        return FollowerColl.find({
            accountId: accountId, 
            follower: followerId,
            status: ""
        });
        // self.ready();
    });

    Meteor.publish('followerAll', function(accountId) {
        check(accountId, String);
 
        return FollowerColl.find({
            accountId: accountId,
            status: ""
        });
        // self.ready();
    });
}