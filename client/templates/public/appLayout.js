var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function() {
    $(document.body).touchwipe({
        wipeLeft: function() {
            Session.set(MENU_KEY, false);
        },
        wipeRight: function() {
            Session.set(MENU_KEY, true);
        },
        preventDefaultEvents: false
    });

    setTimeout(function() {
        dataReadyHold.release();

        Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
    }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appLayout.onRendered(function() {
    this.find('#content-container')._uihooks = {
        insertElement: function(node, next) {
            $(node)
                .hide()
                .insertBefore(next)
                .fadeIn(function() {
                    if (listFadeInHold) {
                        listFadeInHold.release();
                    }
                });
        },
        removeElement: function(node) {
            $(node).fadeOut(function() {
                $(this).remove();
            });
        }
    };
});

Template.appBody.helpers({
    thisArray: function() {
        return [this];
    },
    menuOpen: function() {
        return Session.get(MENU_KEY) && 'menu-open';
    },
    cordova: function() {
        return Meteor.isCordova && 'cordova';
    },
    connected: function() {
        if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});

Template.appBody.events({
    'click .js-menu': function() {
        Session.set(MENU_KEY, !Session.get(MENU_KEY));
    },

    'click .content-overlay': function(event) {
        Session.set(MENU_KEY, false);
        event.preventDefault();
    },

    'click .js-user-menu': function(event) {
        Session.set(USER_MENU_KEY, !Session.get(USER_MENU_KEY));
        // stop the menu from closing
        event.stopImmediatePropagation();
    },

    'click #menu a': function() {
        Session.set(MENU_KEY, false);
    },

    'click .js-logout': function() {
        Meteor.logout();

        // if we are on a private list, we'll need to go to a public one
        var current = Router.current();
        if (current.route.name === 'listsShow' && current.data().userId) {
            Router.go('listsShow', Lists.findOne({
                userId: {
                    $exists: false
                }
            }));
        }
    },

    'click .js-new-list': function() {
        var list = {
            name: Lists.defaultName(),
            incompleteCount: 0
        };
        list._id = Lists.insert(list);

        Router.go('listsShow', list);
    }
});