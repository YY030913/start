if (Meteor.isServer) {
	Meteor.publish('transportByUser', function() {
		return TransportColl.find({accountId: this.userId});
	});
};