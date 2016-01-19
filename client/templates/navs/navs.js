var saveNavs = function(navsList, key, value) {
    switch(key){
        case "name":
            navigationsColl.update(navsList._id, {
                $set: {
                    name: value
                }
            });
            break;
        case "href":
            navigationsColl.update(navsList._id, {
                $set: {
                    href: value
                }
            });
            break;
    }
    
}
var delNavs = function(navsList) {
    navigationsColl.remove(navsList._id);
}

Template.navsList.events({
    'click .add-nav': function() {
        var nav = {
            href: "",
            name: navigationsColl.defaultName(),
            totalCount: 0
        };
        nav._id = navigationsColl.insert(nav);

        Router.go('/');
    },
    
    'blur .links input[type=text]': function(event, template) {
        console.log($(event.currentTarget).val());
        if ($(event.currentTarget).val()=="") {
            delNavs(this);
        } else {
            saveNavs(this, key, $(event.currentTarget).val());
        }
    },
});

Template.navsListLeft.events({
    'click .add-nav': function() {
        var nav = {
            name: navigationsColl.defaultName(),
            totalCount: 0
        };
        nav._id = navigationsColl.insert(nav);

        Router.go('/');
    },
    
    'blur input[type=text]': function(event, template) {
        console.log($(event.currentTarget).val());
        var key = $(event.currentTarget).attr("name");
        if ($(event.currentTarget).val()=="") {
            delNavs(this);
        } else {
            saveNavs(this, key, $(event.currentTarget).val());
        }
    },
});

Template.navsList.helpers({
	navsList: function() {
        return navigationsColl.find();
    },
    activeNavClass: function(navName) {
        var current = Router.current();
        if ((!current.route.getName() && navName == 'home') || current.route.getName() == navName) {
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
        if ((!current.route.getName() && navName == 'home') || current.route.getName() == navName) {
            return 'active';
        }
    },
});