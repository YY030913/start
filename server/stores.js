if (Meteor.isServer) {
	Meteor.publish('store', function () {
    	storesColl.find();
  	});
}