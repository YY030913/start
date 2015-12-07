if (Meteor.isServer) {
	Meteor.publish('merchants', function (merchantId) {
	    var self = this;
	    // send the "ready" message in 2 seconds.
	    setTimeout(function () {
	    	merchantsColl.find({merchantId: merchantId});
	      	self.ready();
	    }, 2000);
  	});
}