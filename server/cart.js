if (Meteor.isServer) {
	Meteor.publish('cartByUser', function() {
		return CartColl.find({accountId: this.userId});
	});
};