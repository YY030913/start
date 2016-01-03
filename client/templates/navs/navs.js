Template.navsList.helpers({
	navsList: function() {
        return navigationsColl.find();
    },
    activeNavClass: function(navName) {
        var current = Router.current();
        if ((!current.route.getName() && navName.toLowerCase() == 'home') || current.route.getName().toLowerCase() == navName.toLowerCase()) {
            return 'active';
        }
    },
});

Template.navsListLeft.helpers({
	navsList: function() {
        return navigationsColl.find();
    },
    activeNavClass: function(navName) {
        var current = Router.current();
        if ((!current.route.getName() && navName.toLowerCase() == 'home') || current.route.getName().toLowerCase() == navName.toLowerCase()) {
            return 'active';
        }
    },
});