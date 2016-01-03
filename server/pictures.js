if (Meteor.isServer) {
    Meteor.publish('pictureLists', function() {
        var self = this;
        picturesColl.find();
        self.ready();
    });

    Meteor.publish('pictureById', function(pictureId) {
        var self = this;
        picturesColl.findOne({
            pictureId: pictureId
        });
        self.ready();
    });

    Meteor.publish('picturesByUser', function(userId) {
        var self = this;
        picturesColl.find({
            userId: userId
        });
        self.ready();
    });
}