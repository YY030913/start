if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.menuExtend.onRendered(function() {
        $(".menu-extend").html("");
        // if (Session.get(SESSION_URL_CURR)=="home") {
        //     $(".menu-extend").append('<a class="fa-plus" href="createPost">新建</a>');
        // } else if (Session.get(SESSION_URL_CURR)=="createPost") {
        //     $(".menu-extend").append('<a style="text-indent:0" href="editpost">下一步</a>');
        // } else if (Session.get(SESSION_URL_CURR)=="editpost") {
        //     $(".menu-extend").append('<a style="text-indent:0" href="post">发布</a>');
        // };
    });


    Template.menuExtend.helpers({

    	menu_extend_html: function(){
    		// if (Session.get(SESSION_URL_CURR)=="home") {
    		// 	return '<a class="fa-plus" href="createPost">新建</a>';
    		// } else if (Session.get(SESSION_URL_CURR)=="createPost") {
    		// 	return '<a style="text-indent:0" href="editpost">下一步</a>';
    		// } else if (Session.get(SESSION_URL_CURR)=="editpost") {
    		// 	return '<a style="text-indent:0" href="post">发布</a>';
    		// };
    	},
    });


    Template.menuExtend.events({
    	"click .menu-extend": function() {
    		if (Session.get(SESSION_URL_CURR)=="home") {
    			Router.go("createpost");
    		} else if (Session.get(SESSION_URL_CURR)=="createpost") {
                if (!sessionStorage.SESSION_POST_TITLE) {
                    swal("标题不能为空");
                    return false;
                };
                Router.go("editpost");
    		} else if (Session.get(SESSION_URL_CURR)=="editpost") {
                if (!$("#post-content").html()) {
                    swal("文章内容不能为空！");
                } else {
                    var post_img = "";
                    if ($("#post-content").html().indexOf("<img")!=-1) {
                        post_img = $("#post-content").html().split("<img")[1].split('src=')[1].split('"')[1];
                    } else {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext("2d");
                        ctx.fillStyle = "#" + chance.color({format: 'hex'});
                        ctx.fillRect(0, 0, 1024, 720);
                        post_img = canvas.toDataURL('image/png'); 
                    }
                    post = {
                        postTitle: sessionStorage.SESSION_POST_TITLE,
                        postContent: escape($("#post-content").html()),//encodeURI encodeURIComponent
                        postImg: post_img,
                        postPositive: sessionStorage.SESSION_POST_POSITIVE || "正方观点",
                        postNegative: sessionStorage.SESSION_POST_NEGATIVE || "反方观点",
                        accountId: Meteor.userId(),
                        time: new Date(),
                    }
                    postId = PostsColl.insert(post);
                    sessionStorage.SESSION_POST_TITLE = "";
                    localStorage.LOCAL_POST_CONTENT = "";
                    Session.SESSION_POST_ID = postId;
                    Router.go("post/"+postId);
                }
        	} else if (Session.get(SESSION_URL_CURR)=="post") {
                Router.go("debate");
            } else if (Session.get(SESSION_URL_CURR)=="debate") {
                console.log(Session.SESSION_DEBATE_OPTION);
                console.log(escape($("#debate").html()));
                console.log(escape($("#debate").html()));
                var debate = {
                    option: Session.SESSION_DEBATE_OPTION,
                    debateContent: escape($("#debate").html()),
                    postId: Session.SESSION_POST_ID,
                    accountId: Meteor.userId(),
                    time: new Date(),
                }
                DebateColl.insert(debate);
                Session.SESSION_DEBATE_OPTION = "";
                localStorage.LOCAL_DEBATE_CONTENT = "";
                Router.go("post", {_id: Session.SESSION_POST_ID});
            };
    	}
    });
}