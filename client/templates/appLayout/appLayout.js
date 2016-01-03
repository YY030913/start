var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);


// Template.appLayout.onRendered(function() {
//     this.find('.navs-container')._uihooks = {
//         insertElement: function(node, next) {
//             console.log(node);
//             $(node)
//                 .hide()
//                 .insertBefore(next)
//                 .fadeIn(function() {
//                     if (listFadeInHold) {
//                         listFadeInHold.release();
//                     }
//                 });
//         },
//         removeElement: function(node) {
//             console.log(node);
//             $(node).fadeOut(function() {
//                 $(this).remove();
//             });
//         }
//     };
// });

var saveNavs = function(navsList, value) {
    navigationsColl.update(navsList._id, {
        $set: {
            name: value
        }
    });
}
var delNavs = function(navsList) {
    navigationsColl.remove(navsList._id);
}

Template.appLayout.helpers({
    userLocationAddres: function() {
        console.log(Session.get("vistor"));
        if (Session.get("vistor") != null) {
            return Session.get("vistor");
        } else {
            reverseGeocode.getSecureLocation(Geolocation.currentLocation().coords.latitude, Geolocation.currentLocation().coords.longitude, function(location) {
                console.log(reverseGeocode.getAddrStr());
                Session.set('location', reverseGeocode.getAddrStr());
            });
            var vistor = {};
            _.each(reverseGeocode.getAddrObj(), function(obj) {
                if (obj.type == "country") {
                    vistor.country = obj.longName;
                };
                if (obj.type == "administrative_area_level_1") {
                    vistor.administrative_area_level_1 = obj.longName;
                };
                if (obj.type == "locality") {
                    vistor.locality = obj.longName;
                };
                if (obj.type == "sublocality_level_1") {
                    vistor.sublocality_level_1 = obj.longName;
                };
                if (obj.type == "route") {
                    vistor.route = obj.longName;
                };
                if (obj.type == "postal_code") {
                    vistor.postal_code = obj.longName;
                };
            });
            vistor.latitude = Geolocation.currentLocation().coords.latitude;
            vistor.longitude = Geolocation.currentLocation().coords.longitude;
            Session.set("vistor", vistor);
            vistor.userAgent = navigator.userAgent;
            vistor.appVersion = navigator.appVersion;
            vistor.time = new Date();
            vistorsColl.insert(vistor);
            vistor.clientIP = this.connection.clientAddress;
            console.log("clientAddress : " + vistor.clientIP);
            console.log(reverseGeocode.getAddrObj());
            console.log(reverseGeocode.data);
        }
    },
    userLocation: function() {
        console.log(Geolocation.currentLocation());
        return Geolocation.currentLocation();
    },
    navigator: function() {
        return Session._id;
    },
    userName: function() {
        return Meteor.user().username;
    },
    // adminUser: function() {
    //     return Meteor.user().username == "admin";
    // },
    thisArray: function() {
        console.log(this);
        return [this];
    },
    cordova: function() {
        return Meteor.isCordova && 'cordova';
    }
});

Template.appLayout.events({
    'click .avatar.icon': function(event) {
        if (Accounts.userId()) {
            alert("1111");
        } else {
            Router.go('signin');
        }
    },

    'click .remove': function(event) {
        delNavs(this);
    },

    'blur input[type=text]': function(event, template) {
        saveNavs(this, $(event.currentTarget).val());
    },

    'click .js-menu': function() {
        Session.set(MENU_KEY, !Session.get(MENU_KEY));
    },

    'click .content-overlay': function(event) {
        event.preventDefault();
    },

    'click .js-user-menu': function(event) {
        Session.set(USER_MENU_KEY, !Session.get(USER_MENU_KEY));
        event.stopImmediatePropagation();
    },

    'click .js-logout': function() {
        Meteor.logout();

        var current = Router.current();
        if (current.data().userId) {
            Router.go('/', Lists.findOne({
                userId: {
                    $exists: false
                }
            }));
        }
    },

    'click .js-new-nav': function() {
        var nav = {
            name: navigationsColl.defaultName(),
            totalCount: 0
        };
        nav._id = navigationsColl.insert(nav);

        Router.go('/');
    }
});