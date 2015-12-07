Meteor.publish('navigations', function(navName) {
  	check(navId, String);

  	return Todos.find({navName: navName});
});