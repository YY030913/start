Template.stores.onRendered(function() {
    // $('.ui.sidebar').sidebar('attach events', '.sidebar.icon');
    // this.find('#stores-container')._uihooks = {
    //     insertElement: function(node, next) {
    //         $(node)
    //             .hide()
    //             .insertBefore(next)
    //             .fadeIn(function() {
    //                 if (listFadeInHold) {  
    //                     listFadeInHold.release();
    //                 }
    //             });
    //     },
    //     removeElement: function(node) {
    //         $(node).fadeOut(function() {
    //             $(this).remove();
    //         });
    //     }
    // };

    // Intro.
    // var $intro = $('#intro');

    // Move to main on <=large, back to sidebar on >large.
    // skel
    //     .on('+large', function() {
    //         $intro.prependTo($main);
    //     })
    //     .on('-large', function() {
    //         $intro.prependTo($sidebar);
    //     });
});

Template.stores.helpers({
    stores: function() {
        return storesColl.find();
    },
    // emptyStores: function() {
    //     return storesColl.find().count()==0;
    // },
    storePictures: function(storeId) {
        return storePicColl.find({storeId: storeId, type: "store"}, {sort: {createdAt : -1}});
    }
});

Template.stores.events({
    'click checkbox': function() {

    }
});


// Template.createStore.onCreated(function() {
//     $('.ui.modal').hide();
//     console.log("created");
//     $('#fileupload').fileupload({
//         dataType: 'json',//指定server返回数据类型
//         disableImageResize: /Android(?!.*Chrome)|Opera/
//         .test(window.navigator && navigator.userAgent),
//         imageMaxWidth: 800,
//         imageMaxHeight: 800,
//         imageCrop: true,// Force cropped images
//         add: function (e, data) {
//             data.context = $('<button/>').text('Upload')
//                 .appendTo(document.body)
//                 .click(function () {
//                     data.context = $('<p/>').text('Uploading...').replaceAll($(this));
//                     data.submit();
//                 });
//         },
//         done: function (e, data) {
//             data.context.text('Upload finished.');
//             $.each(data.result.files, function (index, file) {
//                 $('<p/>').text(f4ile.name).appendTo(document.body);
//             });
//         },
//         progressall: function (e, data) {
//             var progress = parseInt(data.loaded / data.total * 100, 10);
//             $('.progress .bar').css(
//                 'width',
//                 progress + '%'
//             );
//         },

//     });
// });