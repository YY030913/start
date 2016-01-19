if (Meteor.isServer) {
    Meteor.publish('userid', function() {
        return UserIdColl.find({accountId: Meteor.user().userId});
    });
}