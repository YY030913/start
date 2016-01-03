Template.createStore.events({
    'click .createStoreLicense': function() {
        $('.ui.modal').modal('show');
    },
    'click .inputLicense': function() {
        alert("还没有开发！");
    },
    'click .closeModal': function() {
        $('.ui.modal').hide();
    },
    // 'click input[name="agreement"])':function() {
    //     console.log($('input[name="agreement"]').attr("checked"));
    //     if ($('input[name="agreement"]').attr("checked")) {
    //         $(".checkLabel").html("don't agree the <a class='createStoreLicense'>license</a>!");
    //     } else {
    //         $(".checkLabel").html("agree the <a class='createStoreLicense'>license</a>!");
    //     }
    // },
    'click .submit': function() {
        $('.ui.form')
        .form({
            inline : true,
            on: 'blur',
            fields: {
                storeName: {
                    identifier: 'storeName',
                    rules: [{
                        type: 'empty',
                        prompt: '店名不能为空'
                    }]
                },
                storeAddress: {
                    identifier: 'storeAddress',
                    rules: [{
                        type: 'empty',
                        prompt: '店铺地址不能为空'
                    }]
                },
                country: {
                    identifier: 'country',
                    rules: [{
                        // type: 'isExactly[篮球]',
                        type: 'empty',
                        prompt: '爱好只能输入“篮球”'
                    }]
                },
                licensePic: {
                    identifier: 'licensePic',
                    rules: [{
                        // type: 'email',
                        type: 'empty',
                        prompt: '请输入合法的邮箱'
                    }]
                },
                storePic: {
                    identifier: 'storePic',
                    rules: [{
                        // type: 'checked',
                        type: 'empty',
                        prompt: '请同意“协议”'
                    }]
                },
                agreement: {
                    identifier: 'agreement',
                    rules: [{
                        type: 'checked',
                        prompt: '请同意“协议”'
                    }]
                }
            },
            onSuccess: function(event, fields) {
                var storeId = storeColl.insert({storeName: $(".storeName").val(), storeAddress: $(".storeAddress").val(), storeCountry: $(".storeCountry").val(), province: $(".province").val(), city: $(".city"), user: userId})
                storePicColl.insert({store: storeId, time: new Date(), pic: "", userId: userId, type: "store"});
                storePicColl.insert({store: storeId, time: new Date(), pic: ".", userId: userId, type: "license"});
            }
        });
    }
});

Template.createStore.helpers({
    countryCodes: function() {
        // var lis = CountryCodes.getList();
        // _.each(lis, function(data) {
        //     alert(data);
        // })
        
        return null;
    },
    // myCallbacks: function() {
    //     return {
    //         formData: function() {
    //             return {
    //                 id: "232323",
    //                 other: Session.get("ReactiveParam")
    //             }
    //         },
    //         finished: function(index, fileInfo, context) {
    //         },
    //     }
    // },
    storeFormData: function() {
        console.log("storeFormData" + this);
        return {
            directoryName: 'images',
            prefix: this._id,
            _id: this._id
        }
    },
    filesToUpload: function() {
        console.log("filesToUpload" + Uploader.info.get());
        return Uploader.info.get();
    },
});


Template.createStore.onRendered(function() {
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
    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                storeName: {
                    identifier: 'storeName',
                    rules: [{
                        type: 'empty',
                        prompt: '店名不能为空'
                    }]
                },
                storeAddress: {
                    identifier: 'storeAddress',
                    rules: [{
                        type: 'empty',
                        prompt: '店铺地址不能为空'
                    }]
                },
                country: {
                    identifier: 'country',
                    rules: [{
                        // type: 'isExactly[篮球]',
                        type: 'empty',
                        prompt: '爱好只能输入“篮球”'
                    }]
                },
                licensePic: {
                    identifier: 'licensePic',
                    rules: [{
                        // type: 'email',
                        type: 'empty',
                        prompt: '请输入合法的邮箱'
                    }]
                },
                storePic: {
                    identifier: 'storePic',
                    rules: [{
                        // type: 'checked',
                        type: 'empty',
                        prompt: '请同意“协议”'
                    }]
                },
                agreement: {
                    identifier: 'agreement',
                    rules: [{
                        type: 'checked',
                        prompt: '请同意“协议”'
                    }]
                }
            }
        });
})