if (Meteor.isClient) {
  handle = LaunchScreen.hold;

  Template.home.onRendered(function() {
    $('.masthead').visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
          console.log("fade in");
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
          console.log("fade out");
        }
    });
    $('.ui.sidebar').sidebar('attach events', '.toc.item');
  });
}
