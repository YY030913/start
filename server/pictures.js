if (Meteor.isServer) {
    Meteor.publish('pictureLists', function() {
        var self = this;
        return picturesColl.find();
        // self.ready();
    });

    Meteor.publish('pictureById', function(pictureId) {
        var self = this;
        return picturesColl.findOne({
            pictureId: pictureId
        });
        // self.ready();
    });

    Meteor.publish('picturesByUser', function(userId) {
        var self = this;
        return picturesColl.find({
            userId: userId
        });
        
    });
}