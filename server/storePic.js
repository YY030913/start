if (Meteor.isServer) {
	Meteor.publish('storePic', function() {
		return storePicColl.find();
	});
};