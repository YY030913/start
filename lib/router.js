// Router.plugin('loading', {loadingTemplate: 'Loading'});
// common setting
Router.configure({
  	// we use the  appBody template to define the layout for the entire app
  	layoutTemplate: 'appLayout',
});


// route ruler
dataReadyHold = null;

Router.route('signin');

Router.route('/', function(){
	// set the layout programmatically
  	this.layout('appLayout');
  	//需要添加slider top
  	this.render("topFollowMenu", {to: "top"});
  	this.render("slidebarMenu", {to: "aside"});
  	this.render("home");
});


Router.route('/merchants', {
    path: '/merchant/:_id',
    onBeforeAction: function() {
        this.merchantsHandle = Meteor.subscribe('merchants', this.params._id);

        if (this.ready()) {
            dataReadyHold.release();
        }
    },
    data: function() {
        return merchants.findOne(this.params._id);
    },
    action: function() {
        this.render("merchant");
    }
});


Router.route('/pictures', function () {
    this.layout('appLayout');
    
    this.render("topFollowMenu", {to: "top"});
    this.render("slidebarMenu", {to: "aside"}); 
  	this.render('pictures');
}, {
    waitOn: function () {
        // the loading plugin will render the loading template
        // until this subscription is ready
        return Meteor.subscribe('pictureLists');
    },
    action: function() {
        if (this.ready()) {
            this.render('pictures');
        } else {
            this.render('appLoading');
        }
    }
});

if(Meteor.isClient) {
    console.log(Router.current().route.name)
}