if (Meteor.isServer) {
	Meteor.publish('pictureLists', function () {
	    var self = this;
	    // send the "ready" message in 2 seconds.
	    setTimeout(function () {
	    	picturesColl.find();
	      	self.ready();
	    }, 2000);
  	});
}