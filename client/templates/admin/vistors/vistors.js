if (Meteor.isClient) {
	Template.vistors.helpers({
	    vistorsList: function() {
	        return vistorsColl.find();
	    }
	});
	Template.vistors.onRendered(function() {
		$('.masthead').visibility({
            once: false,
            onBottomPassed: function() {
                $('.fixed.menu').transition('fade in');
                console.log("fade in");
            },
            onBottomPassedReverse: function() {
                $('.fixed.menu').transition('fade out');
                console.log("fade out");
            }
        });
        $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
	})
}