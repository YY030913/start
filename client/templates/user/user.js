if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.user.onRendered(function() {
    	$('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
    });
}