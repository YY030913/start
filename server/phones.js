if (Meteor.isServer) {
	Meteor.publish('phones', function() {
    	return PhonesColl.find();
  	});
}