if (Meteor.isClient) {

    Template.userdebates.onRendered(function() {
        
    });

    Template.userdebates.onRendered(function() {
    });

    Template.userdebates.events({
        
    });

    Template.userdebates.helpers({
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
        unescape: function(content) {
            return unescape(content);
        },
        debates: function() {
            return DebateColl.find({accountId: Meteor.userId()});
        },
        post: function() {
            return PostsColl.findOne({_id: this.postId }, {limit: 1});
        },
        account: function() {
            return Meteor.user();
        }
    });
}
