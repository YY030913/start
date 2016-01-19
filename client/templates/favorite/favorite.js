if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.favorite.onRendered(function() {
    });


    Template.favorite.helpers({
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
        favorite: function() {
            return FavoriteColl.find({accountId: Meteor.userId()}, 
                {sort: [["time", "desc"]]}
            );
        },
        favoritePosts: function() {
            return PostsColl.findOne(this.postId);
        },
        postAuthor: function() {
            return Meteor.users.findOne(PostsColl.findOne(this.postId).accountId);
        }
        
    });


    Template.favorite.events({
    });
}