if (Meteor.isClient) {
    handle = LaunchScreen.hold;
    postFadeInHold = null;
    checkVaildUser = function() {
        if (!Meteor.userId()) {
            swal("创建新话题需要登陆账号");
            Session.set(SESSION_URL_HREF, "createpost");
            Router.go('signin');
            return;
        } else {
            Meteor.call(
                "isValidUserID",
                Meteor.userId(),
                function(error, result) {
                    if (error || !result) {
                        swal({
                            title: "请先进行身份认证",
                            text: "输入你的身份证号",
                            type: "input",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true,
                            animation: "slide-from-top",
                            inputPlaceholder: "your id"
                        }, function(inputValue) {
                            if (inputValue === false) {
                                Router.go('home');
                                return false;
                            }
                            if (inputValue === "") {
                                swal.showInputError("身份证号不能为空");
                                return false
                            }
                            Meteor.call(
                                "getUserIDInfo",
                                inputValue,
                                function(error, result) {
                                    if (error || !result) {
                                        swal.showInputError("身份验证失败，请输入正确的身份信息");
                                        return false;
                                    } else {
                                        swal({
                                            title: "SUCCESS",
                                            text: "通过验证",
                                            timer: 2000,
                                            showConfirmButton: false
                                        });
                                    }
                                }
                            );
                        });
                    };
                }
            );
        }
    }

    Template.post.onCreated(function() {
    });

    Template.post.onRendered(function() {
        $('.vticker').easyTicker();
        $(".menu-extend").html('<a style="text-indent:0;text-align: center;">添加观点</a>');
    });
    Template.post.helpers({
        post: function() {
            return PostsColl.findOne({_id: Session.SESSION_POST_ID});
        },
        debates: function() {
            return DebateColl.find({
                postId: Session.SESSION_POST_ID
            }, {
                sort: {
                    "time": -1
                }
            });
        },
        unescape: function(content) {
            return unescape(content);
        },
        account: function() {
            return Meteor.users.findOne(this.accountId);
        },
        postive: function(option) {
            return option == "positive" ? true : false;
        },
    });


    Template.post.events({
        "click .positive": function() {
            Session.SESSION_DEBATE_OPTION = "positive";
            Router.go("debate");
        },
        "click .negative": function() {
            Session.SESSION_DEBATE_OPTION = "negative";
            Router.go("debate");
        }
    });


    Template.createpost.onCreated(function() {
        checkVaildUser();
    })

    Template.createpost.onRendered(function() {
        $(".menu-extend").html('<a style="text-indent:0;text-align: center;">下一步</a>');
    });


    Template.createpost.helpers({
        // count: function() {
        //     return UserIdColl.find({
        //         accountId: Meteor.userId()
        //     }).count();
        // }
        post_title: function() {
            return sessionStorage.SESSION_POST_TITLE;
        },
        post_search_list: function() {
            return PostsColl.find({
                post_title: "/" + $("#post-title").val() + "/"
            });
        }
    });


    Template.createpost.events({
        "blur #post-title": function() {
            var title = $("#post-title").val();
            if (title.length > 100) {
                swal("标题最长100字！");
                $("#post-title").val(title.substr(0, 100));
            };
            sessionStorage.SESSION_POST_TITLE = $("#post-title").val();
        },
    });

    Template.editpost.onCreated(function() {
        checkVaildUser();
    });

    Template.editpost.onRendered(function() {
        $(".menu-extend").html('<a style="text-indent:0;text-align: center;">发布</a>');
        // var chunkSize = 1024*1024;
        // var offset = 0;
        console.log(localStorage.LOCAL_POST_CONTENT);
        if (localStorage.LOCAL_POST_CONTENT != "") {
            $("#post-content").append(localStorage.LOCAL_POST_CONTENT);
        };
        $("#upload_img").change(function(event) {
            console.log(event);
            files = event.target.files;
            _.each(files, function(file) {
                // var start = offset * chunkSize;
                // var stop = Math.min(file.size, (this.offset + 1) * chunkSize);
                // var chunks = Math.max(
                //     Math.ceil(file.size / chunkSize), 1
                // );
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    console.log(theFile);
                    return function(e) {
                        // Render thumbnail.
                        // console.log(e.target);
                        // for (var offset = 0; offset < chunks; offset++) {
                        //     if (file.webkitSlice) {
                        //         var blob = file.webkitSlice(start, stop + 1);
                        //     } else if (file.mozSlice) {
                        //         var blob = file.mozSlice(start, stop + 1);
                        //     } else {
                        //         file.slice(start, stop + 1);
                        //     }
                        // }
                        
                        if (e.target.readyState == FileReader.DONE) { // DONE == 2
                            $("#post-content").html($("#post-content").html() + "<img width='100%' src='" + e.target.result + "'/>");
                            localStorage.LOCAL_POST_CONTENT = $("#post-content").html();
                        }
                    };
                })(file);
                reader.readAsDataURL(file);
            });

        });
    });


    Template.editpost.helpers({
    });



    Template.editpost.events({
        "click p": function() {
            var left_margin = -$(document).width() / 2 + 0.675 * 16;
            $(".left-side").animate({
                marginLeft: left_margin
            }, "normal", "swing");
            var right_margin = -$(document).width() / 2 + 2 * 16;
            $(".right-side").animate({
                marginRight: right_margin
            }, "normal", "swing");
        },
        "blur #post-content": function() {
            var right_margin = -$(document).width() / 2 + 2 * 16;
            $(".right-side").animate({
                marginRight: right_margin
            }, "normal", "swing");
            var left_margin = -$(document).width() / 2 + 0.675 * 16;
            $(".left-side").animate({
                marginLeft: left_margin
            }, "normal", "swing");

            var content = $("#post-content").html();
            // if (content.length > 20000) {
            //     swal("内容最长20000字！");
            //     $("#post-content").html(content.substr(0, 20000));
            // };
            localStorage.LOCAL_POST_CONTENT = $("#post-content").html();
            console.log(localStorage.LOCAL_POST_CONTENT);
        },
        "click .left-side": function() {
            var right_margin = -$(document).width() / 2 + 2 * 16;
            $(".right-side").animate({
                marginRight: right_margin
            }, "normal", "swing");
            $(".left-side").animate({
                marginLeft: "0px"
            }, "normal", "swing");
        },
        "click .right-side": function() {
            var left_margin = -$(document).width() / 2 + 0.675 * 16;
            $(".right-side").animate({
                marginRight: "0px"
            }, "normal", "swing");
            $(".left-side").animate({
                marginLeft: left_margin
            }, "normal", "swing");
        },
        "blur .negative_input": function() {
            sessionStorage.SESSION_POST_NEGATIVE = $(".negative_input").val();
        },
        "blur .positive_input": function() {
            sessionStorage.SESSION_POST_POSITIVE = $(".positive_input").val();
        },
        "click .fa-file-image-o": function() {
            if (Meteor.isCordova) {
                // 获取设备端
                getPicture({
                    width: 350,
                    height: 350,
                    quality: 75,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
            } else {
                $("#upload_img").click();
            // function(err) {
            // if (err) {
            //     alert(err);
            // };
            // alert(data);
            // }
            // pc获取图片
            }
        }

    });

    var getPicture = function(opts) {
        MeteorCamera.getPicture(opts, function(err, data) {
            if (err) {
                console.log('error', err);
            }
            if (data) {
                $("#post-content").html($("#post-content").html() + '"' + "<img src='" + e.target.result + "'/>");
                Session.set('img', data);
                alert(data);
                // $("#post_content").html(localStorage.LOCAL_POST_CONTENT + '"' + "<img src='" +  + "'/>");
            }
        });
    };
}