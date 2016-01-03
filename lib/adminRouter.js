Router.route('/admin/vistors', {
    controller: 'vistorsController',
    action: 'vistors',
});

if (Meteor.isClient) {
    ApplicationController = RouteController.extend({
        layoutTemplate: 'appLayout',
        yieldRegions: {
            'slidebarMenu': {
                to: 'aside'
            },
            'topFollowMenu': {
                to: 'top'
            }
        },
        onBeforeAction: function() {
            console.log('app before action');
            this.next();
        },
        action: function() {
            console.log("app action");
        },
        waitOn: function() {
            return null;
        }
    });
	vistorsController = ApplicationController.extend({
		waitOn: function() {
            return [
                Meteor.subscribe('publicNavigations'),
                Meteor.subscribe('pictureLists'),
            ];
        },
        vistors: function() {
            this.render('vistors');
        }
    });
}