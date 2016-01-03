if (Meteor.isClient) {
    handle = LaunchScreen.hold;

    Template.home.onRendered(function() {
        // $('.masthead').visibility({
        //     once: false,
        //     onBottomPassed: function() {
        //         $('.fixed.menu').transition('fade in');
        //         console.log("fade in");
        //     },
        //     onBottomPassedReverse: function() {
        //         $('.fixed.menu').transition('fade out');
        //         console.log("fade out");
        //     }
        // });
        $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
        $(".ui.dropdown.icon").dropdown({
            on: 'click',
        });
        $('.ui.dropdown.selection').dropdown({
            on: 'click',
        });
        $('.ui.dropdown').dropdown({
            on: 'click'
        });
        $(".menu .browse").popup({
            inline: true,
            hoverable: true,
            position: 'bottom left',
            delay: {
                show: 300,
                hide: 800
            }
        });
    });

    Template.home.events({
                // 'click .search:first': function(event) {
                //     $(".search:first").hide();
                //     $(".ui.action.input").show();
                // },
                // 'click .ui.dropdown.icon': function() {
                //     $(".ui.dropdown.icon").dropdown({
                //         on: 'click',
                //         action: 'hide',
                //         transition: 'horizontal flip',
                //         // onChange: function(index, value) {

                //         // }
                //     });
                // },
                // 'click .ui.dropdown.selection': function() {
                //     $('.ui.dropdown.selection')
                //         .dropdown({
                //             transition: 'drop',
                //             // onChange: function(index, value) {
                //             //     $("")
                //             // }
                //         });
                // },
                // 'click .ui.dropdown.icon': function() {
                //     $(".ui.dropdown.icon").dropdown();
                // },
                // 'click .ui.dropdown.selection': function() {
                //     $(".ui.dropdown.selection").dropdown();
                // },
                // 'click .ui.dropdown': function() {
                //     $(".ui.dropdown").dropdown();
                // },
                // 'click .menu .browse': function() {
                //     $(".menu .browse").popup({
                //         inline: true,
                //         hoverable: true,
                //         position: 'bottom left',
                //         delay: {
                //             show: 300,
                //             hide: 800
                //         }
                //     })

                // },
            });
}