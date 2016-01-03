Meteor.publish('publicNavigations', function() {
  	return navigationsColl.find();
});