if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.user.onCreated(function() {
    	if (!Meteor.userId()) {
    		swal("请先登录");
    		Session.set(SESSION_URL_HREF, Router.current().url);
    		Router.go("signin");
    		return false;
    	};	
    });

    Template.user.onRendered(function() {
    	// $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
    	// console.log(Router.current());
    });

    Template.user.helpers({
    	user: function() {
    		return Meteor.users.findOne(Router.current().params._id);
    	},
        edit: function() {
            return Meteor.userId() == Router.current().params._id;
        },
        follower: function() {
            var follower = FollowerColl.findOne({
                accountId: Meteor.userId(),
                follower: Router.current().params._id,
                status: "",
            });
            console.log(follower);
            return follower;
        },

    });

    Template.user.events({
        "click .fa-comments-o": function(event) {
            Router.go("userdebates", {_id: Router.current().params._id});
        },
    	"blur #userName": function(event, template) {
            Meteor.call("updateUsername", template.$('#userName').val(), function(error, result) {
                console.log(error);
                console.log(result);
                if (error || !result) {
                    swal("更新失败，请稍后再试！");
                    return;
                };
            });
    		// console.log(template.$('#userName').val());
      //       var $set = {};
      //       $set["username"] = template.$('#userName').val();
    		// Meteor.users.update( Meteor.user().userId, $set);
    	},
        "blur #aboutMe": function(event, template) {
            if (template.$('#aboutMe').html().length > 100) {
                swal("请言简意赅！");
                template.$('#aboutMe').html(
                    template.$('#aboutMe').html().substr(0, 100)
                );
                console.log(template.$('#aboutMe').html());
            }
            Meteor.call("updateAboutMe", template.$('#aboutMe').val(), function(error, result) {
                if (error || !result) {
                    swal("更新失败，请稍后再试！");
                    return;
                };
            });
            // if (template.$('#aboutMe').html().split("<div>") > 2) {
            //     swal("最多允许2个换行！");
            //     template.$('#aboutMe').html(
            //         template.$('#aboutMe').html().substr(
            //             0, 
            //             template.$('#aboutMe').html().lastIndexOf("</div>") + 5
            //         )
            //     );
            // };
            // var $set = {};
            // $set.profile = {};
            // $set.profile["aboutMe"] = escape(template.$('#aboutMe').html());
            // Meteor.users.update(Meteor.user().userId, $set);
        },
    	"click .follow": function() {
            if ($(".follow").attr("data-follower")) {
                Meteor.call("deleteFollwer", $(".follow").attr("data-follower"), function(error, result) {
                    if (error || !result) {
                        swal("取消关注失败，请稍后再试！");
                        return;
                    };
                    $(".follow").toggleClass("follower");
                });
            } else {
                Meteor.call("addFollwer", Router.current().params._id, function(error, result) {
                    if (error || !result) {
                        swal("添加关注失败，请稍后再试！");
                        return;
                    };
                    $(".follow").toggleClass("follower");
                });
            }
            
    	},
    })
}