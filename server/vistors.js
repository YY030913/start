Meteor.publish('vistorsList', function() {
  	return vistorsColl.find();
});