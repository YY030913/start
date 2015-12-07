if Meteor.isClient 

  handle = LaunchScreen.hold

  Template.hello.onRendered -> handle.release

  Template.hello.events
    'click .take-photo' :-> 
        MeteorCamera.getPicture {}, (e,r) ->
          alert (e.message) if e?
          myColl.insert {time:new Date(), pic:r}
          uploadCount = (Session.get 'mycount') or 0
          uploadCount++
          Session.set 'mycount',uploadCount

  Template.list.helpers
    'pictureLists' :->
        myColl.find {},{sort:{time:-1}}

  #login
  # Template.login.helpers