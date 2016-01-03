// Router.plugin('loading',  loadingTemplate: 'Loading');

Template.appLoading.rendered = function() {
	if (!Session.get('loadingSplash')) {
		this.loading = window.pleaseWait({
			// logo: '/images/Meteor-logo.png',
			backgroundColor: '#7f8c8d',
			loadingHtml: message + spinner
		});
		Session.set('loadingSplash', true); // just show loading splash once
	}
};

Template.appLoading.destroyed = function() {
	if (this.loading) {
		this.loading.finish();
	}
};

var message = '<p class="loading-message">Loading Message</p>';
var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';



// Router.route '/', ->
//   	this.render 'home'
// 	,waitOn: ->
//     	Meteor.subscribe 'items'

// if  Meteor.isServe
//   	Meteor.publish 'items', ->
// 	    self = this
// 	    setTimeout ->
// 	      self.ready
// 	    , 2000