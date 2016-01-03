var ERRORS_KEY = 'registerErrors';
var VERIFICATION_KEY = 'verificationCode';

Template.register.onRendered(function() {
    $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
    $('.ui.dropdown').dropdown({
        on: 'click'
    });
})

Template.register.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

Template.register.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

Template.register.events({
    'click .getVerificationCode': function() {
        $(".getVerificationCode").parent().append('<i class="search icon"></i>');
        $("input[name='verification'").toggleClass("wide18");
        $(".getVerificationCode").hide();
        $(".getVerificationCode").parent().toggleClass("right left labeled loading");

        Session.set(VERIFICATION_KEY, chance.string({length: 4, pool: '0123456789'}));
        
        Meteor.call("setPhoneSMS", $("input[name='phone'").val(), Session.get(VERIFICATION_KEY));

        setTimeout(function() {
            $(".getVerificationCode").next().remove();
            $(".getVerificationCode").show();
            $(".getVerificationCode").parent().toggleClass("right left labeled loading");
        }, 30000);
    },
    'submit': function(event, template) {
        event.preventDefault();
        var telPhone = template.$('input[name=“phone”]').val();
        var password = template.$('input[name=“password”]').val();
        var confirm = template.$('input[name=“confirm”]').val();
        var verification = template.$('input[name=“verification”]').val();
        var userID = template.$('input[name=“userID”]').val();

        var errors = {};


        if (!verification) {
            errors = "verification not input";
        };
        if (Session.get(VERIFICATION_KEY)!=verification) {
            errors = "verification not correct";
        };
        if (!telPhone) {
            errors = 'telPhone required';
        };

        if (!password) {
            errors = 'Password required';
        };

        if (confirm !== password) {
            errors = 'Please confirm your password';
        };
        if (!userID) {
            errors = 'Please input userID';
        };

        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return;
        }

        Meteor.call("getUserIDInfo", userID, function(error, result) {
            if (error) {
                return Session.set(ERRORS_KEY, {
                    'none': error.reason
                });
            } else {
                if (result) {
                    Accounts.createUser({
                        telPhone: telPhone,
                        password: password,
                        userID: userID
                    }, function(error) {
                        if (error) {
                            return Session.set(ERRORS_KEY, {
                                'none': error.reason
                            });
                        }

                        Router.go('home');
                    });
                } else {
                    return Session.set(ERRORS_KEY, {
                        'none': "身份信息有误"
                    });
                }
            }
        });
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