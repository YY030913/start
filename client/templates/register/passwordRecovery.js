Template.passwordRecovery.events({
	'click #signup-form input[type="button"]': function() {
        if ($("input[name='phone']").val().trim() == "" || $("input[name='phone']").val().trim().length != 11) {
            // swal({   title: "Are you sure?",   text: "You will not be able to recover this imaginary file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",   closeOnConfirm: false }, function(){   swal("Deleted!", "Your imaginary file has been deleted.", "success"); });
            swal("请输入正确手机号码！");
            return;
        };

		var ifExits = Meteor.users.find({"profile.phoneNum": $("input[name='phone']").val().trim()}).count();//Meteor.subscribe("phones");
        if (ifExits) {

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
	        
        } else {
        	swal("手机号码未注册!");
        	return;
        }
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

        var phone = Session.get(SESSION_REGISTER_PHONENUMBER);
        Meteor.call("isValidUsername", phone, function(error, result) {
        	// Meteor.users.update(, {password: password});
        });
    }
});