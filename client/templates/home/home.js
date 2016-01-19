if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.home.onRendered(function() {
        $(".menu-extend").html('<a class="fa-plus">新建</a>');
    });


    Template.home.helpers({
        momentFormate: function(time) {
            moment.locale('zh', {
                relativeTime : {
                    future: "%s 后",
                    past:   "%s 前",
                    s:  "一秒",
                    m:  "一分",
                    mm: "%d 分",
                }
            });
            if ((moment().unix() - moment(time).unix()) < 3600) {
                return moment(time).fromNow();
            } else {
                return moment(time).format("YYYY-MM-DD");
            }
        },
        maxNum: function(num) {
            return num ? num : 0;
        },
        postUnescape: function(content) {
            var post = unescape(content);
            var imgIndex = post.indexOf("<img");
            return imgIndex < 100 ? 
                post.substr(0, post.substr(0, imgIndex).lastIndexOf("</div>") + 6) : 
                post.substr(0, post.substr(0, 100).lastIndexOf("</div>") + 6) + "...";
        },
        accountUsername: function(_id) {
            return Meteor.users.findOne({_id:_id}).username;
        },
        postAbstract: function(content) {
            var post = unescape(content);
            var start = post.indexOf("<div>") + 5;
            var end = post.indexOf("</div>");
            return (end - start) < 9 ? post.substr(start, end) : post.substr(start, 9) + "...";
        },
        count: function() {
            return PostsColl.find().count();
        },
        hotPosts: function() {
            return PostsColl.find({}, {sort: [["hot", "desc"],["time", "desc"]], limit : 3});
        },
        postAuthor: function() {
            return Meteor.users.findOne(this.accountId);
        },
        miniPost: function() {
            return PostsColl.find({}, {sort: {time: -1}});
        },
        postFavorite: function(postId) {
            return FavoriteColl.find({postId: postId}).count();
        },
        favorite: function(postId) {
            return FavoriteColl.findOne({postId: postId, accountId: Meteor.userId()});
        },
        favoriteId: function(postId) {
            return FavoriteColl.findOne({postId: postId, accountId: Meteor.userId()})._id;
        },
        postDebate: function(postId) {
            return DebateColl.find({postId: postId}).count();
        },
        debate: function(postId) {
            return DebateColl.findOne({postId: postId, accountId: Meteor.userId()});
        },
    });


    Template.home.events({
        "click .fa-heart": function(event, template) {
            if ($(this).hasClass("active")) {
                Meteor.call("deleteFavorite", $(event.target).attr("data-favorite"), function(error, result) {
                    if (error || !result) {
                        swal("取消收藏失败!");
                    } else {
                        $(event.target).toggleClass("active");
                    }
                });
            } else {
                Meteor.call("addFavorite", $(event.target).attr("data-post"), function(error, result) {
                    if (error || !result) {
                        swal("收藏失败!");
                    } else {
                        $(event.target).toggleClass("active");
                    }
                });
            }
        },
        "click .fa-comment": function(event, template) {
            console.log("helo");
        },
                // 'click .search:first': function(event) {
                //     $(".search:first").hide();
                //     $(".ui.action.input").show();
                // },
                // 'click .ui.dropdown.icon': function() {
                //     $(".ui.dropdown.icon").dropdown({
                //         on: 'click',
                //         action: 'hide',
                //         transition: 'horizontal flip',
                //         // onChange: function(index, value) {

                //         // }
                //     });
                // },
                // 'click .ui.dropdown.selection': function() {
                //     $('.ui.dropdown.selection')
                //         .dropdown({
                //             transition: 'drop',
                //             // onChange: function(index, value) {
                //             //     $("")
                //             // }
                //         });
                // },
                // 'click .ui.dropdown.icon': function() {
                //     $(".ui.dropdown.icon").dropdown();
                // },
                // 'click .ui.dropdown.selection': function() {
                //     $(".ui.dropdown.selection").dropdown();
                // },
                // 'click .ui.dropdown': function() {
                //     $(".ui.dropdown").dropdown();
                // },
                // 'click .menu .browse': function() {
                //     $(".menu .browse").popup({
                //         inline: true,
                //         hoverable: true,
                //         position: 'bottom left',
                //         delay: {
                //             show: 300,
                //             hide: 800
                //         }
                //     })

                // },
    });
}