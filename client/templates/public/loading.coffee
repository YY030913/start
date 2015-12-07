Router.plugin 'loading',  loadingTemplate: 'Loading'

Router.route '/', ->
  this.render 'home'
,waitOn: ->
    Meteor.subscribe 'items'

if  Meteor.isServe
  Meteor.publish 'items', ->
    self = this
    setTimeout ->
      self.ready
    , 2000