// ERRORS_KEY = 'signinErrors'
Template.signin.onCreated(function() {
    // Session.set(ERRORS_KEY, {})
});


Template.signin.helpers({
    userName: function() {
        // if (!$('input[name="name"]').val()) {
        //     return ;
        // } else {
            return "guest";
        // }
    },
    avator: function() {
        return "/images/avator.png";
    }
    // errorMessages: function() {
    //     return _.values(Session.get(ERRORS_KEY));
    // },
    // errorClass: function(key) {
    //     Session.get(ERRORS_KEY)[key] && 'error';
    // }
});



Template.signin.events({
    'click .fa-google-plus-square': function() {
        return Meteor.loginWithGoogle({
            requestPermissions: ['email']
        }, function(error) {
            if (error) {
                console.log(error);
                swal("验证失败！");
                return ;
            } else {
                Meteor.call("updateGooleAccount", Meteor.userId(), function(err, res) {
                    if (err || !res) {
                        console.log(err);
                        console.log("google account create err");
                    } else {
                        console.log(res);
                    }
                });
                
                if (Session.get("SESSION_URL_HREF")) {
                    Router.go(Session.get("SESSION_URL_HREF"));
                } else {
                    Router.go("home");
                }
            }
        });
    },
    'click .fa-weixin': function() {
        Meteor.loginWithWechat(function(err, res) {
            if (!err) {
                if (Session.get("SESSION_URL_HREF")) {
                    Router.go(Session.get("SESSION_URL_HREF"));
                } else {
                    Router.go("home");
                }
            } else{
                console.log('login failed ' + err);
            }
        });
    },
    'click .fa-weibo': function() {
        Meteor.loginWithWeibo(function(err, res) {
            if (!err) {
                if (Session.get("SESSION_URL_HREF")) {
                    Router.go(Session.get("SESSION_URL_HREF"));
                } else {
                    Router.go("home");
                }
                console.log('sucess ' + res)
            } else {
                console.log('login failed ' + err)
            }
        });
    },
    'submit': function(event, template) {
        event.preventDefault();
        userName = template.$('input[name="name"]').val();
        password = template.$('input[name="password"]').val();

        errors = {}

        if (!userName) {
            errors.userName = '用户名不能为空！';
            swal(errors.userName);
        }

        if (!password) {
            errors.password = '密码能为空！';
            swal(errors.userName);
        }

        // Session.set(ERRORS_KEY, errors);
        if (errors.userName) {
            return;
        }

        template.$('.submit').val("logining...");
        Meteor.loginWithPassword(userName, password, function(error) {
            if (error) {
                // var phoneAccount = PhonesColl.findOne({phoneNum: userName});
                // if (phoneAccount) {
                    /*** need hack ***/
                    // Meteor.call("isExistUser", userName, function(error, result) {
                        // if (error || !result) {
                            swal("登录失败,账号不存在");
                        // } else {
                        //     Meteor.loginWithPassword(result, password, function(error) {
                        //         if (error) {
                        //             swal(error.reason);
                        //             return;
                        //         } else {
                        //             Router.go('home');
                        //         }
                        //     });
                        // }
                    // });
                // } else {
                //     swal(error.reason);
                // }
                // console.log(error);
                // Session.set(ERRORS_KEY, {
                //     'none': error.reason
                // });
            } else {
                Router.go('home');
            }
        });
        template.$('.submit').val("LOGIN");
    }

});

Template.signin.onRendered(function() {
    // $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
})