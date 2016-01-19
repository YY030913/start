if (Meteor.isServer) {
	Meteor.publish('store', function () {
    	return storesColl.find();
  	});
}