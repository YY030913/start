Router.configure({
    notFoundTemplate: '404',
    loadingTemplate: "appLoading",
    // layoutTemplate: "appLayout",
    // yieldRegions: {
    //     'slidebarMenu': {to: 'aside'},
    //     'topFollowMenu': {to: 'top'}
    // },
});

Router.route('signin', {
    controller: 'SigninController',
    action: 'signin'
});
Router.route('register', {
    controller: 'RegisterController',
    action: 'register'
});

Router.route('/', {
    controller: 'HomeController',
    action: 'home'
});

Router.route("home", {
    controller: 'HomeController',
    action: 'home'
});

Router.route('pictures', {
    controller: 'PicturesController',
    action: 'pictures',
});

Router.route('stores', {
    controller: 'StoresController',
    action: 'stores',
});

Router.route('/stores/createStore', {
    controller: 'CreateStoreController',
    action: 'createStore',
});
// --------USER--------
Router.route('user', {
    controller: 'UserController',
    action: 'user',
});
// --------friends--------
Router.route('friends', {
    controller: 'FriendsController',
    action: 'friends',
});

//userID
Router.route('userID', {
    controller: 'userIDController',
    action: 'userID',
});

dataReadyHold = null;

if (Meteor.isClient) {
    ApplicationController = RouteController.extend({
        layoutTemplate: 'appLayout',
        yieldRegions: {
            'slidebarMenu': {
                to: 'aside'
            },
            'topFollowMenu': {
                to: 'top'
            }
        },
        onBeforeAction: function() {
            console.log('app before action');
            this.next();
        },
        action: function() {
            console.log("app action");
        },
        waitOn: function() {
            return [
                Meteor.subscribe('publicNavigations'),
            ];
        }
    });


    // -------

    SigninController = ApplicationController.extend({
        signin: function() {
            this.render('signin');
        }
    });

    RegisterController = ApplicationController.extend({
        register: function() {
            this.render('register');
        }
    });

    // -------
    HomeController = ApplicationController.extend({
        home: function() {
            this.render('home');
        }
    });

    PicturesController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('pictureLists');
            this.next();
        },
        pictures: function() {
            // if (this.ready) {
                this.render('pictures');
            // } else {
            //     this.render('appLoading');
            // }
        }
    });

    StoresController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('stores');
            this.next();
        },
        stores: function() {
            console.log("stores action");
            this.render('stores');
        },
    });

    CreateStoreController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('storePic');
            this.next();
        },
        data: function() {
            return {
                uploadStorePic: storePicColl.find(),
                uploadStoreLicense: storePicColl.find(),
            }
        },
        createStore: function() {
            this.render('createStore');
        },
    });


    //-----
    UserController = ApplicationController.extend({
        onBeforeAction: function() {
            this.next();
        },
        user: function() {
            this.render('user');
        }
    });

    FriendsController = ApplicationController.extend({
        onBeforeAction: function() {
            this.next();
        },
        friends: function() {
            this.render('friends');
        }
    })

    userIDController = ApplicationController.extend({
        onBeforeAction: function() {
            this.next();
        },
        userID: function() {
            this.render('userID');
        }
    })
};



// dataReadyHold = null;


// Router.route('/', function(){
//     // set the layout programmatically
//     this.layout('appLayout');
//     //需要添加slider top
//     this.render("topFollowMenu", {to: "top"});
//     this.render("slidebarMenu", {to: "aside"});
//     this.render("home");
// });


// Router.route('/stores', {
//     path: '/stores/:_id',
//     layoutTemplate: 'appLayout',

//     onBeforeAction: function() {
//         this.storesHandle = Meteor.subscribe('stores', this.params._id);

//         if (this.ready()) {
//             dataReadyHold.release();
//         } 
//     },
//     data: function() {
//         return stores.findOne(this.params._id);
//     },
//     action: function() {
//         this.render("merchant");
//     }
// });


// Router.route('/pictures', function () {
//     this.layout('appLayout');

//     this.render("topFollowMenu", {to: "top"});
//     this.render("slidebarMenu", {to: "aside"}); 
//     this.render('pictures');
// }, {
//     waitOn: function () {
//         // the loading plugin will render the loading template
//         // until this subscription is ready
//         return Meteor.subscribe('pictureLists');
//     },
//     action: function() {
//         if (this.ready()) {
//             this.render('pictures');
//         } else {
//             this.render('appLoading');
//         }
//     }
// });