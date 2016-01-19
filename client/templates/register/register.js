Template.register.onRendered(function() {
    $("#signup-form input[type='submit']").hide();
    $('#signup-form .signup-extends').hide();
})

Template.register.onCreated(function() {
    Session.set(SESSION_REGISTER_ERROR, {});
});

Template.register.helpers({
    errorMessages: function() {
        return _.values(Session.get(SESSION_REGISTER_ERROR));
    },
    errorClass: function(key) {
        return Session.get(SESSION_REGISTER_ERROR)[key] && 'error';
    },
    count: function() {
        console.log(PhonesColl.find().count());
        return PhonesColl.find().count();
    }
});

var timer;
var interval_verification = 60;
timedCount = function() {
    if (interval_verification > 0) {
        $("#signup-form input[type='button']").val(interval_verification--);
        timer = setTimeout("timedCount()", 1000)
    } else {
        $("#signup-form input[type='button']").toggleClass('disabled');
        $("#signup-form input[type='button']").val('获取验证码');
        interval_verification = 60;
        clearTimeout(timer);
    }
}

Template.register.events({
    'click #signup-form input[type="button"]': function() {
        // $(".getVerificationCode").parent().append('<i class="search icon"></i>');
        // $("input[name='verification'").toggleClass("wide18");
        // $(".getVerificationCode").hide();
        // $(".getVerificationCode").parent().toggleClass("right left labeled loading");
        if ($("input[name='phone']").val().trim() == "" || $("input[name='phone']").val().trim().length != 11) {
            // swal({   title: "Are you sure?",   text: "You will not be able to recover this imaginary file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   swal("Deleted!", "Your imaginary file has been deleted.", "success"); });
            swal("请输入正确手机号码！");
            return;
        };

        // https://github.com/googlei18n/libphonenumber
        // unadd
        // if (LibPhoneNumber.PhoneNumberUtil.getInstance().isValidNumber($("input[name='phone']").val())) {
        //     swal("手机号码不合法！");
        //     return;
        // };
        var ifExits = Meteor.users.find({"profile.phoneNum": $("input[name='phone']").val().trim()}).count();//Meteor.subscribe("phones");
        if (ifExits) {
            swal("该手机号码已经注册！请直接登陆");
            Router.go('signin');
            return;
        };

        Meteor.call(
            "sendPhoneSMS", 
            $("input[name='phone']").val(), 
            function(error, result){
                if (error || !result) {
                    swal("发送验证码失败，请重试！");
                } else {
                    Session.set(SESSION_REGISTER_PHONENUMBER, $("input[name='phone']").val());
                    $("#signup-form input[type='submit']").show();
                    $('#signup-form .signup-extends').show();
                    $("#signup-form input[type='button']").toggleClass('disabled');
                    timedCount();
                }
            });
        // var timer = setInterval(function() {
        //     // $("#signup-form input[name='verification']").val();

        //     // $(".getVerificationCode").next().remove();
        //     // $(".getVerificationCode").show();
        //     // $(".getVerificationCode").parent().toggleClass("right left labeled loading");
        // }, 1000);
    },
    'submit': function(event, template) {
        event.preventDefault();
        var password = template.$('input[name="password"]').val();
        // var confirm = template.$('input[name="confirm"]').val();
        var verification = template.$('input[name="verification"]').val();
        // var userID = template.$('input[name="userID"]').val();

        var errors = {};

        if (!Session.get(SESSION_REGISTER_PHONENUMBER)) {
            errors = "请勿进行非法操作";
            swal(errors);
            return;
        };

        if (Session.get(SESSION_REGISTER_PHONENUMBER) != template.$('input[name="phone"]').val()) {
            errors = "请重新填写手机号码！请不要随意更改！";
            swal(errors);
            return;
        };

        Meteor.call("checkVerification", verification, function(error, result) {
            if (error || !result) {
                errors = "验证码不正确，请重新输入";
                swal(errors);
                return;
            };
        });

        if (!password) {
            errors = '账号密码不能为空';
            swal(errors);
            return;
        };

        // if (confirm !== password) {
        //     errors = 'Please confirm your password';
        // };
        // if (!userID) {
        //     errors = 'Please input userID';
        // };

        // Session.set(SESSION_REGISTER_ERROR, errors);
        // if (_.keys(errors).length) {

        // }

    //     Meteor.call("getUserIDInfo", userID, function(error, result) {
    //         if (error) {
    //             swal(errors);
    //             return;
    //         } else {
    //             if (result) {
                    var phone = Session.get(SESSION_REGISTER_PHONENUMBER);
                    Accounts.createUser({
                        password: password,
                        username: phone,
                    }, function(error) {
                        if (error) {
                            console.log(error);
                            swal("创建用户失败");
                            return;
                        } else {
                            Meteor.call("createAccount", Meteor.userId(), phone, function(error, result) {

                                if (error) {
                                    console.log(error);
                                    return;
                                } else {
                                    var phoneId = PhonesColl.findOne({"phoneNum": phone})._id;
                                    PhonesColl.update(
                                        PhonesColl.findOne({"phoneNum": phone})._id, 
                                        {
                                            $set: {
                                                "accountId": Meteor.userId()
                                            }
                                        }
                                    );//, "username": Meteor.user().username
                                    Router.go('home');
                                }
                            });
                        }
                    })
                    
    //             } else {
    //                  swal("身份信息有误，请重新输入！");
    //                  return;
    //             }
    //         }
    //     });
    }
});

//meteor add emgee:libphonenumber
if (Meteor.isServer) {
    var util = LibPhoneNumber.PhoneNumberUtil.getInstance();
    var format = LibPhoneNumber.PhoneNumberFormat;
    var types = LibPhoneNumber.PhoneNumberType;

    function getKey(obj, val) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                if (obj[prop] === val)
                    return prop;
        }
    };

    function parsePhone(opts) {
        var parsedNumber = util.parse(opts.phone, opts.country || "US");
        var type = getKey(types, util.getNumberType(parsedNumber));

        return {
            phone: util.format(parsedNumber, format.E164),
            isValid: util.isValidNumber(parsedNumber),
            type: type
        };
    }
}