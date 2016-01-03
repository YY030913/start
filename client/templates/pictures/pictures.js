if (Meteor.isClient) {
    handle = LaunchScreen.hold();


    Template.pictures.onCreated(function() {
        GoogleMaps.ready('exampleMap', function(map) {
            // Add a marker to the map once it's ready
            var marker = new google.maps.Marker({
                position: map.options.center,
                map: map.instance
            });
        });
    })

    Template.pictures.onRendered(function() {
        
        handle.release();
        GoogleMaps.load();
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
        $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
    });

    Template.pictures.events({
        'click .take-photo': function() {
            console.log(Accounts.userId());
            if (Accounts.userId()) {
                MeteorCamera.getPicture({}, function(e, r) {
                    if (e) {
                        alert(e.message);
                    } else {
                        if (r != null) {
                            picturesColl.insert({
                                time: new Date(),
                                pic: r,
                                userId: userId,
                            });
                        };
                    }
                })
            } else {
                Router.go('signin');
            }
        },
        'click .right.menu .switch': function() {
            if ($('.right.menu .switch[data-tab="map"]').is(":visible")) {
                $('.right.menu .switch[data-tab="list"]').show();
                $('.right.menu .switch[data-tab="map"]').hide();
            } else {
                $('.right.menu .switch[data-tab="list"]').hide();
                $('.right.menu .switch[data-tab="map"]').show();
            }

            $(".ui.attached.tab[data-tab='list']").toggleClass("active");
            $(".ui.attached.tab[data-tab='map']").toggleClass("active");

            // $('.right.menu .switch')
            //     .tab({
            //         cache: false,
            //         // faking API request
            //         // apiSettings: {
            //         //     loadingDuration: 300,
            //         //     // mockResponse: function(settings) {
            //         //     //     console.log(settings);
            //         //     //     var response = {
            //         //     //         map: 'AJAX Tab map',
            //         //     //         list: 'AJAX Tab list',
            //         //     //     };
            //         //     //     return response[settings.urlData.tab];
            //         //     // }
            //         // },
            //         context: $(".ui.container"),
            //         // auto: true,
            //         // path: '/'
            //     });
        },
        'click .pictures-by-user': function() {
            if (this.userId) {
                Meteor.subscribe('picturesByUser', userId);
            }
        }
    });


    Template.pictures.helpers({
        'pictureLists': function() {
            Meteor.subscribe('pictureLists');
        },
        'exampleMapOptions': function() {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(-37.8136, 144.9631),
                    zoom: 8
                };
            }
        },
        'exif': function(img) {
            // EXIF.getData(document.getElementById('imgElement'), function(){ 
            return EXIF.getAllTags(img);
            // }); 
        }
    });
}