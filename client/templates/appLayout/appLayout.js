// var USER_MENU_KEY = 'userMenuOpen';
// Session.setDefault(USER_MENU_KEY, false);
//
if (Meteor.isClient) {
    Template.appLayout.onRendered(function() {
        // this.find('.links')._uihooks = {
        //     insertElement: function(node, next) {
        //         $(node)
        //             .hide()
        //             .insertBefore(next)
        //             .fadeIn(function() {
        //                 if (listFadeInHold) {
        //                     listFadeInHold.release();
        //                 }
        //             });
        //     },
        //     removeElement: function(node) {
        //         $(node).fadeOut(function() {
        //             $(this).remove();
        //         });
        //     },
        //     moveElement: function(node, next) {
        //         var $node = $(node), $next = $(next);
        //         var oldTop = $node.offset().top;
        //         var height = $node.outerHeight(true);

        //         // 找出 next 与 node 之间所有的元素
        //         var $inBetween = $next.nextUntil(node);
        //         if ($inBetween.length === 0)
        //         $inBetween = $node.nextUntil(next);

        //         // 把 node 放在预订位置
        //         $node.insertBefore(next);

        //         // 测量新 top 偏移坐标
        //         var newTop = $node.offset().top;

        //         // 将 node *移回*至原始所在位置
        //         $node
        //         .removeClass('animate')
        //         .css('top', oldTop - newTop);

        //         // push every other element down (or up) to put them back
        //         $inBetween
        //         .removeClass('animate')
        //         .css('top', oldTop < newTop ? height : -1 * height);

        //         // 强制重绘
        //         $node.offset();

        //         // 动画，重置所有元素的 top 坐标为 0
        //         $node.addClass('animate').css('top', 0);
        //         $inBetween.addClass('animate').css('top', 0);
        //     }
        // };

        // this.find('#wrapper')._uihooks = {
        //     insertElement: function(node, next) {
        //         $(node)
        //             .hide()
        //             .insertBefore(next)
        //             .fadeIn(function() {
        //                 if (listFadeInHold) {
        //                     listFadeInHold.release();
        //                 }
        //             });
        //     },
        //     removeElement: function(node) {
        //         $(node).fadeOut(function() {
        //             $(this).remove();
        //         });
        //     },
        //     moveElement: function(node, next) {
        //         var $node = $(node), $next = $(next);
        //         var oldTop = $node.offset().top;
        //         var height = $node.outerHeight(true);

        //         // 找出 next 与 node 之间所有的元素
        //         var $inBetween = $next.nextUntil(node);
        //         if ($inBetween.length === 0)
        //         $inBetween = $node.nextUntil(next);

        //         // 把 node 放在预订位置
        //         $node.insertBefore(next);

        //         // 测量新 top 偏移坐标
        //         var newTop = $node.offset().top;

        //         // 将 node *移回*至原始所在位置
        //         $node
        //         .removeClass('animate')
        //         .css('top', oldTop - newTop);

        //         // push every other element down (or up) to put them back
        //         $inBetween
        //         .removeClass('animate')
        //         .css('top', oldTop < newTop ? height : -1 * height);

        //         // 强制重绘
        //         $node.offset();

        //         // 动画，重置所有元素的 top 坐标为 0
        //         $node.addClass('animate').css('top', 0);
        //         $inBetween.addClass('animate').css('top', 0);
        //     }
        // };
    });

    Template.appLayout.helpers({
        userLocationAddres: function() {
            if (Session.get("vistor") != null) {
                return Session.get("vistor");
            } else {
                reverseGeocode.getSecureLocation(Geolocation.currentLocation().coords.latitude, Geolocation.currentLocation().coords.longitude, function(location) {
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
            }
        },
        userLocation: function() {
            return Geolocation.currentLocation();
        },
        navigator: function() {
            return Session._id;
        },
        userName: function() {
            return Meteor.user().username || Meteor.user().profile.name;
        },
        accountId: function() {
            return Meteor.user()._id;
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
        // "click #menu": function() {
        //     alert(1111);
        //     console.log("111");
        //     console.log(Meteor.user().username);
        //     var current = Router.current();
        //     Meteor.logout(function(err){
        //         console.log(err);
        //     });

            
        //     if (current.data().userId) {
        //         Router.go('/', Lists.findOne({
        //             userId: {
        //                 $exists: false
        //             }
        //         }));
        //     }
        // },
    });
}