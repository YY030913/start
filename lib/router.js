Router.configure({
    notFoundTemplate: '404',
    loadingTemplate: "appLoading",
    // layoutTemplate: "appLayout",
    // yieldRegions: {
    //     'slidebarMenu': {to: 'aside'},
    //     'topFollowMenu': {to: 'top'}
    // },
});

Router.route('/', {
    controller: 'HomeController',
    action: 'home'
});

Router.route('cart', {
    controller: 'CartController',
    action: 'cart',
});

Router.route('createpost', {
    controller: 'PostController',
    action: 'createpost',
});

Router.route('debate', {
    controller: 'DebateController',
    action: 'debate',
});

Router.route('editpost', {
    controller: 'PostController',
    action: 'editpost',
});

Router.route('favorite', {
    controller: 'FavoriteController',
    action: 'favorite',
});

// --------friends--------
Router.route('friends', {
    controller: 'FriendsController',
    action: 'friends',
});

Router.route("home", {
    controller: 'HomeController',
    action: 'home'
});

Router.route("order", {
    controller: 'OrderController',
    action: 'order'
});


Router.route('pictures', {
    controller: 'PicturesController',
    action: 'pictures',
});


// --------post--------
Router.route('post', {
    controller: 'PostController',
    path: '/post/:_id',
    action: 'post',
});

Router.route('product', {
    controller: 'ProductController',
    path: '/product/:_id',
    action: 'product',
});

Router.route('register', {
    controller: 'RegisterController',
    action: 'register'
});

Router.route('signin', {
    controller: 'SigninController',
    action: 'signin'
});

Router.route('stores', {
    controller: 'StoresController',
    action: 'stores',
});

Router.route('/createstore', {
    controller: 'CreateStoreController',
    action: 'createstore',
});

Router.route('/transport', {
    controller: 'TransportController',
    action: 'transport',
});


// --------USER--------
Router.route('user', {
    controller: 'UserController',
    path: '/user/:_id',
    action: 'user',
});

Router.route('userdebates', {
    controller: 'UserDebatesController',
    path: '/userdebates/:_id',
    action: 'userdebates',
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
        notFoundTemplate: '404',
        loadingTemplate: "appLoading",
        // yieldRegions: {
        //     'slidebarMenu': {
        //         to: 'aside'
        //     },
        //     'topFollowMenu': {
        //         to: 'top'
        //     }
        // },
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

    CartController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('cartByUser');
            this.next();
        },
        cart: function() {
            Session.set(SESSION_URL_CURR, "cart");
            this.render('cart');
        }
    });

    DebateController = ApplicationController.extend({
        onBeforeAction: function() {
            this.next();
        },
        debate: function() {
            Session.set(SESSION_URL_CURR, "debate");
            this.render('debate');
        }
    });
    // -------

    SigninController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('phones');
            this.next();
        },
        signin: function() {
            Session.set(SESSION_URL_CURR, "signin");
            this.render('signin');
        }
    });

    RegisterController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('phones');
            this.next();
        },
        register: function() {
            Session.set(SESSION_URL_CURR, "register");
            this.render('register');
        }
    });

    FavoriteController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('favoriteByUser');
            this.next();
        },
        favorite: function() {
            Session.set(SESSION_URL_CURR, "favorite");
            this.render('favorite');
        }
    });

    // -------
    HomeController = ApplicationController.extend({
        // increment: 5, 
        onBeforeAction: function() {
            Meteor.subscribe('hotPosts');
            Meteor.subscribe('miniPosts');
            this.next();
        },
        home: function() {
            Session.set(SESSION_URL_CURR, "home");
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
                Session.set(SESSION_URL_CURR, "pictures");
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
            Session.set(SESSION_URL_CURR, "stores");
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
        createstore: function() {
            Session.set(SESSION_URL_CURR, "createstore");
            this.render('createstore');
        },
    });


    //-----
    UserController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('userById', this.params._id);
            Meteor.subscribe('follower', Meteor.userId(), this.params._id);
            this.next();
        },
        user: function() {
            Session.set(SESSION_URL_CURR, "friends");
            this.render('user');
        }
    });

    FriendsController = ApplicationController.extend({
        onBeforeAction: function() {
            this.next();
        },
        friends: function() {
            Session.set(SESSION_URL_CURR, "friends");
            this.render('friends');
        }
    });

    userIDController = ApplicationController.extend({
        onBeforeAction: function() {
            this.next();
        },
        userID: function() {
            this.render('userID');
        }
    });

    PostController = ApplicationController.extend({
        onBeforeAction: function() {
            this.postHandle = Meteor.subscribe('postById', this.params._id);

            // if (this.ready()) {
            //   // Handle for launch screen defined in app-body.js
            //   dataReadyHold.release();
            // }
            Meteor.subscribe('postById', this.params._id);
            Session.SESSION_POST_ID = this.params._id;
            // Meteor.subscribe('userid');
            this.next();
        },
        post: function() {
            Session.set(SESSION_URL_CURR, "post");
            this.render('post');
        },
        createpost: function() {
            Session.set(SESSION_URL_CURR, "createpost");
            this.render('createpost');
        },
        editpost: function() {
            Session.set(SESSION_URL_CURR, "editpost");
            this.render('editpost');
        },
    }),

    UserDebatesController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('debateByUser', this.params._id);
            this.next();
        },
        userdebates: function() {
            this.render('userdebates');
        }
    });

    ProductController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('productById', this.params._id);
            this.next();
        },
        product: function() {
            this.render('product');
        }
    });

    TransportController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('transportByUser');
            this.next();
        },
        transport: function() {
            this.render('transport');
        }
    });

    OrderController = ApplicationController.extend({
        onBeforeAction: function() {
            Meteor.subscribe('orderByUser');
            this.next();
        },
        order: function() {
            this.render('order');
        }
    });
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