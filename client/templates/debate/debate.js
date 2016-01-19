if (Meteor.isClient) {

    Template.debate.onRendered(function() {
        if (Session.SESSION_DEBATE_OPTION == "" || !Session.SESSION_DEBATE_OPTION) {
            swal("请先选择观点!");
            console.log(Session.SESSION_POST_ID);
            if (Session.SESSION_POST_ID != null) {
                Router.go("post", {_id: Session.SESSION_POST_ID});
            } else {
                Router.go("home");
            }
            return;
        };
    });

    Template.debate.onRendered(function() {
        $(".menu-extend").html('<a style="text-indent:0;text-align: center;">完成</a>');
        $("#debate").append(localStorage.LOCAL_DEBATE_CONTENT);
    });

    Template.debate.events({
        "blur #debate": function() {
            localStorage.LOCAL_DEBATE_CONTENT = $("#debate").html();
        }
    });

    Template.debate.helpers({

    });
}
