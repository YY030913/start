ERRORS_KEY = 'signinErrors'
Template.signin.onCreated(function() {
    Session.set(ERRORS_KEY, {})
});


Template.signin.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
        Session.get(ERRORS_KEY)[key] && 'error';
    }
});



Template.signin.events({
    'click .google': function() {
        Meteor.loginWithWechat(function(err, res) {
            if (err !== undefined)
                console.log('sucess ' + res)
            else
                console.log('login failed ' + err)
        });
    },
    'click .wechat': function() {
        Meteor.loginWithWechat(function(err, res) {
            if (err !== undefined)
                console.log('sucess ' + res)
            else
                console.log('login failed ' + err)
        });
    },
    'click .submit': function(event, template) {

        event.preventDefault();
        email_username = template.$('[name=email-username]').val();
        password = template.$('[name=password]').val();

        errors = {}

        if (!email_username) {
            errors.email_username = 'email or username is required';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        Session.set(ERRORS_KEY, errors)
        if (_.keys(errors).length) {
            return;
        }

        template.$('.submit').text("logining...");
        Meteor.loginWithPassword(email_username, password, function(error) {
            if (error) {
                Session.set(ERRORS_KEY, {
                    'none': error.reason
                });
                Router.go('home');
            } else {
                Router.go('home');
            }
        });
    }

});

Template.signin.onRendered(function() {
    $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
})