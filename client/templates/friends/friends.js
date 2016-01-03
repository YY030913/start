if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.friends.onRendered(function() {
    	$('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
    	$('.menu .item').tab();
    });

    Template.friends.helpers({
    	friends: function() {
    		return friendsColl.find();
    	},
    	friendsGroup: function() {
    		return friendsGroupColl.find();
    	},
    	friendsMessages: function() {
    		return friendsMessageColl.find();
    	}    
    })
}