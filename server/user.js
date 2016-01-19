if (Meteor.isServer) {
    Meteor.publish('userById', function(accountId) {
        return Meteor.users.find(accountId);
    });
}