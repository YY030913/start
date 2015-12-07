if Meteor.isClient
  	handle = LaunchScreen.hold
  	Template.topFollowMenu.events
		'click .logout': ->
	    	Meteor.logout();
	    	current = Router.current
	    	if current.data().userId
	      		Router.go(current.route.name, Lists.findOne({userId: {$exists: false}}));


	Template.appLayout.helpers
  		
	  	cordova: ->
	    	Meteor.isCordova && 'cordova'
	  	emailLocalPart: ->
	    	email = Meteor.user().emails[0].address
	    	email.substring 0, email.indexOf('@') 
	  	,
  		userMenuOpen: ->
	    	Session.get USER_MENU_KEY
	    ,
  		connected: ->
    		if Session.get SHOW_CONNECTION_ISSUE_KEY
    			return Meteor.status().connected
    		else
      			return true
