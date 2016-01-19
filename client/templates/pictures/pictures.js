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

    Template.pictures.onRendered(function() {

        handle.release();
        GoogleMaps.load();
        var skel = function() {
            "use strict";
            var t = {
                breakpointIds: null,
                events: {},
                isInit: !1,
                obj: {
                    attachments: {},
                    breakpoints: {},
                    head: null,
                    states: {}
                },
                sd: "/",
                state: null,
                stateHandlers: {},
                stateId: "",
                vars: {},
                DOMReady: null,
                indexOf: null,
                isArray: null,
                iterate: null,
                matchesMedia: null,
                extend: function(e, n) {
                    t.iterate(n, function(i) {
                        t.isArray(n[i]) ? (t.isArray(e[i]) || (e[i] = []), t.extend(e[i], n[i])) : "object" == typeof n[i] ? ("object" != typeof e[i] && (e[i] = {}), t.extend(e[i], n[i])) : e[i] = n[i]
                    })
                },
                newStyle: function(t) {
                    var e = document.createElement("style");
                    return e.type = "text/css", e.innerHTML = t, e
                },
                _canUse: null,
                canUse: function(e) {
                    t._canUse || (t._canUse = document.createElement("div"));
                    var n = t._canUse.style,
                        i = e.charAt(0).toUpperCase() + e.slice(1);
                    return e in n || "Moz" + i in n || "Webkit" + i in n || "O" + i in n || "ms" + i in n
                },
                on: function(e, n) {
                    var i = e.split(/[\s]+/);
                    return t.iterate(i, function(e) {
                        var a = i[e];
                        if (t.isInit) {
                            if ("init" == a) return void n();
                            if ("change" == a) n();
                            else {
                                var r = a.charAt(0);
                                if ("+" == r || "!" == r) {
                                    var o = a.substring(1);
                                    if (o in t.obj.breakpoints)
                                        if ("+" == r && t.obj.breakpoints[o].active) n();
                                        else if ("!" == r && !t.obj.breakpoints[o].active) return void n()
                                }
                            }
                        }
                        t.events[a] || (t.events[a] = []), t.events[a].push(n)
                    }), t
                },
                trigger: function(e) {
                    return t.events[e] && 0 != t.events[e].length ? (t.iterate(t.events[e], function(n) {
                        t.events[e][n]()
                    }), t) : void 0
                },
                breakpoint: function(e) {
                    return t.obj.breakpoints[e]
                },
                breakpoints: function(e) {
                    function n(t, e) {
                        this.name = this.id = t, this.media = e, this.active = !1, this.wasActive = !1
                    }
                    return n.prototype.matches = function() {
                        return t.matchesMedia(this.media)
                    }, n.prototype.sync = function() {
                        this.wasActive = this.active, this.active = this.matches()
                    }, t.iterate(e, function(i) {
                        t.obj.breakpoints[i] = new n(i, e[i])
                    }), window.setTimeout(function() {
                        t.poll()
                    }, 0), t
                },
                addStateHandler: function(e, n) {
                    t.stateHandlers[e] = n
                },
                callStateHandler: function(e) {
                    var n = t.stateHandlers[e]();
                    t.iterate(n, function(e) {
                        t.state.attachments.push(n[e])
                    })
                },
                changeState: function(e) {
                    t.iterate(t.obj.breakpoints, function(e) {
                        t.obj.breakpoints[e].sync()
                    }), t.vars.lastStateId = t.stateId, t.stateId = e, t.breakpointIds = t.stateId === t.sd ? [] : t.stateId.substring(1).split(t.sd), t.obj.states[t.stateId] ? t.state = t.obj.states[t.stateId] : (t.obj.states[t.stateId] = {
                        attachments: []
                    }, t.state = t.obj.states[t.stateId], t.iterate(t.stateHandlers, t.callStateHandler)), t.detachAll(t.state.attachments), t.attachAll(t.state.attachments), t.vars.stateId = t.stateId, t.vars.state = t.state, t.trigger("change"), t.iterate(t.obj.breakpoints, function(e) {
                        t.obj.breakpoints[e].active ? t.obj.breakpoints[e].wasActive || t.trigger("+" + e) : t.obj.breakpoints[e].wasActive && t.trigger("-" + e)
                    })
                },
                generateStateConfig: function(e, n) {
                    var i = {};
                    return t.extend(i, e), t.iterate(t.breakpointIds, function(e) {
                        t.extend(i, n[t.breakpointIds[e]])
                    }), i
                },
                getStateId: function() {
                    var e = "";
                    return t.iterate(t.obj.breakpoints, function(n) {
                        var i = t.obj.breakpoints[n];
                        i.matches() && (e += t.sd + i.id)
                    }), e
                },
                poll: function() {
                    var e = "";
                    e = t.getStateId(), "" === e && (e = t.sd), e !== t.stateId && t.changeState(e)
                },
                _attach: null,
                attach: function(e) {
                    var n = t.obj.head,
                        i = e.element;
                    return i.parentNode && i.parentNode.tagName ? !1 : (t._attach || (t._attach = n.firstChild), n.insertBefore(i, t._attach.nextSibling), e.permanent && (t._attach = i), !0)
                },
                attachAll: function(e) {
                    var n = [];
                    t.iterate(e, function(t) {
                        n[e[t].priority] || (n[e[t].priority] = []), n[e[t].priority].push(e[t])
                    }), n.reverse(), t.iterate(n, function(e) {
                        t.iterate(n[e], function(i) {
                            t.attach(n[e][i])
                        })
                    })
                },
                detach: function(t) {
                    var e = t.element;
                    return t.permanent || !e.parentNode || e.parentNode && !e.parentNode.tagName ? !1 : (e.parentNode.removeChild(e), !0)
                },
                detachAll: function(e) {
                    var n = {};
                    t.iterate(e, function(t) {
                        n[e[t].id] = !0
                    }), t.iterate(t.obj.attachments, function(e) {
                        e in n || t.detach(t.obj.attachments[e])
                    })
                },
                attachment: function(e) {
                    return e in t.obj.attachments ? t.obj.attachments[e] : null
                },
                newAttachment: function(e, n, i, a) {
                    return t.obj.attachments[e] = {
                        id: e,
                        element: n,
                        priority: i,
                        permanent: a
                    }
                },
                init: function() {
                    t.initMethods(), t.initVars(), t.initEvents(), t.obj.head = document.getElementsByTagName("head")[0], t.isInit = !0, t.trigger("init")
                },
                initEvents: function() {
                    t.on("resize", function() {
                        t.poll()
                    }), t.on("orientationChange", function() {
                        t.poll()
                    }), t.DOMReady(function() {
                        t.trigger("ready")
                    }), window.onload && t.on("load", window.onload), window.onload = function() {
                        t.trigger("load")
                    }, window.onresize && t.on("resize", window.onresize), window.onresize = function() {
                        t.trigger("resize")
                    }, window.onorientationchange && t.on("orientationChange", window.onorientationchange), window.onorientationchange = function() {
                        t.trigger("orientationChange")
                    }
                },
                initMethods: function() {
                    document.addEventListener ? ! function(e, n) {
                        t.DOMReady = n()
                    }("domready", function() {
                        function t(t) {
                            for (r = 1; t = n.shift();) t()
                        }
                        var e, n = [],
                            i = document,
                            a = "DOMContentLoaded",
                            r = /^loaded|^c/.test(i.readyState);
                        return i.addEventListener(a, e = function() {
                                i.removeEventListener(a, e), t()
                            }),
                            function(t) {
                                r ? t() : n.push(t)
                            }
                    }) : ! function(e, n) {
                        t.DOMReady = n()
                    }("domready", function(t) {
                        function e(t) {
                            for (h = 1; t = i.shift();) t()
                        }
                        var n, i = [],
                            a = !1,
                            r = document,
                            o = r.documentElement,
                            s = o.doScroll,
                            c = "DOMContentLoaded",
                            d = "addEventListener",
                            u = "onreadystatechange",
                            l = "readyState",
                            f = s ? /^loaded|^c/ : /^loaded|c/,
                            h = f.test(r[l]);
                        return r[d] && r[d](c, n = function() {
                            r.removeEventListener(c, n, a), e()
                        }, a), s && r.attachEvent(u, n = function() {
                            /^c/.test(r[l]) && (r.detachEvent(u, n), e())
                        }), t = s ? function(e) {
                            self != top ? h ? e() : i.push(e) : function() {
                                try {
                                    o.doScroll("left")
                                } catch (n) {
                                    return setTimeout(function() {
                                        t(e)
                                    }, 50)
                                }
                                e()
                            }()
                        } : function(t) {
                            h ? t() : i.push(t)
                        }
                    }), Array.prototype.indexOf ? t.indexOf = function(t, e) {
                        return t.indexOf(e)
                    } : t.indexOf = function(t, e) {
                        if ("string" == typeof t) return t.indexOf(e);
                        var n, i, a = e ? e : 0;
                        if (!this) throw new TypeError;
                        if (i = this.length, 0 === i || a >= i) return -1;
                        for (0 > a && (a = i - Math.abs(a)), n = a; i > n; n++)
                            if (this[n] === t) return n;
                        return -1
                    }, Array.isArray ? t.isArray = function(t) {
                        return Array.isArray(t)
                    } : t.isArray = function(t) {
                        return "[object Array]" === Object.prototype.toString.call(t)
                    }, Object.keys ? t.iterate = function(t, e) {
                        if (!t) return [];
                        var n, i = Object.keys(t);
                        for (n = 0; i[n] && e(i[n], t[i[n]]) !== !1; n++);
                    } : t.iterate = function(t, e) {
                        if (!t) return [];
                        var n;
                        for (n in t)
                            if (Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]) === !1) break
                    }, window.matchMedia ? t.matchesMedia = function(t) {
                        return "" == t ? !0 : window.matchMedia(t).matches
                    } : window.styleMedia || window.media ? t.matchesMedia = function(t) {
                        if ("" == t) return !0;
                        var e = window.styleMedia || window.media;
                        return e.matchMedium(t || "all")
                    } : window.getComputedStyle ? t.matchesMedia = function(t) {
                        if ("" == t) return !0;
                        var e = document.createElement("style"),
                            n = document.getElementsByTagName("script")[0],
                            i = null;
                        e.type = "text/css", e.id = "matchmediajs-test", n.parentNode.insertBefore(e, n), i = "getComputedStyle" in window && window.getComputedStyle(e, null) || e.currentStyle;
                        var a = "@media " + t + "{ #matchmediajs-test { width: 1px; } }";
                        return e.styleSheet ? e.styleSheet.cssText = a : e.textContent = a, "1px" === i.width
                    } : t.matchesMedia = function(t) {
                        if ("" == t) return !0;
                        var e, n, i, a, r = {
                                "min-width": null,
                                "max-width": null
                            },
                            o = !1;
                        for (i = t.split(/\s+and\s+/), e = 0; e < i.length; e++) n = i[e], "(" == n.charAt(0) && (n = n.substring(1, n.length - 1), a = n.split(/:\s+/), 2 == a.length && (r[a[0].replace(/^\s+|\s+$/g, "")] = parseInt(a[1]), o = !0));
                        if (!o) return !1;
                        var s = document.documentElement.clientWidth,
                            c = document.documentElement.clientHeight;
                        return null !== r["min-width"] && s < r["min-width"] || null !== r["max-width"] && s > r["max-width"] || null !== r["min-height"] && c < r["min-height"] || null !== r["max-height"] && c > r["max-height"] ? !1 : !0
                    }, navigator.userAgent.match(/MSIE ([0-9]+)/) && RegExp.$1 < 9 && (t.newStyle = function(t) {
                        var e = document.createElement("span");
                        return e.innerHTML = '&nbsp;<style type="text/css">' + t + "</style>", e
                    })
                },
                initVars: function() {
                    var e, n, i, a = navigator.userAgent;
                    e = "other", n = 0, i = [
                        ["firefox", /Firefox\/([0-9\.]+)/],
                        ["bb", /BlackBerry.+Version\/([0-9\.]+)/],
                        ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/],
                        ["opera", /OPR\/([0-9\.]+)/],
                        ["opera", /Opera\/([0-9\.]+)/],
                        ["edge", /Edge\/([0-9\.]+)/],
                        ["safari", /Version\/([0-9\.]+).+Safari/],
                        ["chrome", /Chrome\/([0-9\.]+)/],
                        ["ie", /MSIE ([0-9]+)/],
                        ["ie", /Trident\/.+rv:([0-9]+)/]
                    ], t.iterate(i, function(t, i) {
                        return a.match(i[1]) ? (e = i[0], n = parseFloat(RegExp.$1), !1) : void 0
                    }), t.vars.browser = e, t.vars.browserVersion = n, e = "other", n = 0, i = [
                        ["ios", /([0-9_]+) like Mac OS X/, function(t) {
                            return t.replace("_", ".").replace("_", "")
                        }],
                        ["ios", /CPU like Mac OS X/, function(t) {
                            return 0
                        }],
                        ["android", /Android ([0-9\.]+)/, null],
                        ["mac", /Macintosh.+Mac OS X ([0-9_]+)/, function(t) {
                            return t.replace("_", ".").replace("_", "")
                        }],
                        ["wp", /Windows Phone ([0-9\.]+)/, null],
                        ["windows", /Windows NT ([0-9\.]+)/, null],
                        ["bb", /BlackBerry.+Version\/([0-9\.]+)/, null],
                        ["bb", /BB[0-9]+.+Version\/([0-9\.]+)/, null]
                    ], t.iterate(i, function(t, i) {
                        return a.match(i[1]) ? (e = i[0], n = parseFloat(i[2] ? i[2](RegExp.$1) : RegExp.$1), !1) : void 0
                    }), t.vars.os = e, t.vars.osVersion = n, t.vars.IEVersion = "ie" == t.vars.browser ? t.vars.browserVersion : 99, t.vars.touch = "wp" == t.vars.os ? navigator.msMaxTouchPoints > 0 : !!("ontouchstart" in window), t.vars.mobile = "wp" == t.vars.os || "android" == t.vars.os || "ios" == t.vars.os || "bb" == t.vars.os
                }
            };
            return t.init(), t
        }();
        ! function(t, e) {
            "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.skel = e()
        }(this, function() {
            return skel
        });
        var main = (function($) {
            var _ = {

                /**
                 * Settings.
                 * @var {object}
                 */
                settings: {

                    // Preload all images.
                    preload: false,

                    // Slide duration (must match "duration.slide" in _vars.scss).
                    slideDuration: 500,

                    // Layout duration (must match "duration.layout" in _vars.scss).
                    layoutDuration: 750,

                    // Thumbnails per "row" (must match "misc.thumbnails-per-row" in _vars.scss).
                    thumbnailsPerRow: 2,

                    // Side of main wrapper (must match "misc.main-side" in _vars.scss).
                    mainSide: 'right'

                },

                /**
                 * Window.
                 * @var {jQuery}
                 */
                $window: null,

                /**
                 * Body.
                 * @var {jQuery}
                 */
                $body: null,

                /**
                 * Main wrapper.
                 * @var {jQuery}
                 */
                $main: null,

                /**
                 * Thumbnails.
                 * @var {jQuery}
                 */
                $thumbnails: null,

                /**
                 * Viewer.
                 * @var {jQuery}
                 */
                $viewer: null,

                /**
                 * Toggle.
                 * @var {jQuery}
                 */
                $toggle: null,

                /**
                 * Nav (next).
                 * @var {jQuery}
                 */
                $navNext: null,

                /**
                 * Nav (previous).
                 * @var {jQuery}
                 */
                $navPrevious: null,

                /**
                 * Slides.
                 * @var {array}
                 */
                slides: [],

                /**
                 * Current slide index.
                 * @var {integer}
                 */
                current: null,

                /**
                 * Lock state.
                 * @var {bool}
                 */
                locked: false,

                /**
                 * Keyboard shortcuts.
                 * @var {object}
                 */
                keys: {

                    // Escape: Toggle main wrapper.
                    27: function() {
                        _.toggle();
                    },

                    // Up: Move up.
                    38: function() {
                        _.up();
                    },

                    // Down: Move down.
                    40: function() {
                        _.down();
                    },

                    // Space: Next.
                    32: function() {
                        _.next();
                    },

                    // Right Arrow: Next.
                    39: function() {
                        _.next();
                    },

                    // Left Arrow: Previous.
                    37: function() {
                        _.previous();
                    }

                },

                /**
                 * Initialize properties.
                 */
                initProperties: function() {

                    // Window, body.
                    _.$window = $(window);
                    _.$body = $('body');

                    // Thumbnails.
                    _.$thumbnails = $('#thumbnails');

                    // Viewer.
                    _.$viewer = $(
                        '<div id="viewer">' +
                        '<div class="inner">' +
                        '<div class="nav-next"></div>' +
                        '<div class="nav-previous"></div>' +
                        '<div class="toggle"></div>' +
                        '</div>' +
                        '</div>'
                    ).appendTo(_.$body);

                    // Nav.
                    _.$navNext = _.$viewer.find('.nav-next');
                    _.$navPrevious = _.$viewer.find('.nav-previous');

                    // Main wrapper.
                    _.$main = $('#main');

                    // Toggle.
                    $('<div class="toggle"></div>')
                        .appendTo(_.$main);

                    _.$toggle = $('.toggle');

                    // IE<9: Fix viewer width (no calc support).
                    if (skel.vars.IEVersion < 9)
                        _.$window
                        .on('resize', function() {
                            window.setTimeout(function() {
                                _.$viewer.css('width', _.$window.width() - _.$main.width());
                            }, 100);
                        })
                        .trigger('resize');

                },

                /**
                 * Initialize events.
                 */
                initEvents: function() {

                    // Window.

                    // Remove is-loading-* classes on load.
                    _.$window.on('load', function() {

                        _.$body.removeClass('is-loading-0');

                        window.setTimeout(function() {
                            _.$body.removeClass('is-loading-1');
                        }, 100);

                        window.setTimeout(function() {
                            _.$body.removeClass('is-loading-2');
                        }, 100 + Math.max(_.settings.layoutDuration - 150, 0));

                    });

                    // Disable animations/transitions on resize.
                    var resizeTimeout;

                    _.$window.on('resize', function() {

                        _.$body.addClass('is-loading-0');
                        window.clearTimeout(resizeTimeout);

                        resizeTimeout = window.setTimeout(function() {
                            _.$body.removeClass('is-loading-0');
                        }, 100);

                    });

                    // Viewer.

                    // Hide main wrapper on tap (<= medium only).
                    _.$viewer.on('touchend', function() {

                        if (skel.breakpoint('medium').active)
                            _.hide();

                    });

                    // Touch gestures.
                    _.$viewer
                        .on('touchstart', function(event) {

                            // Record start position.
                            _.$viewer.touchPosX = event.originalEvent.touches[0].pageX;
                            _.$viewer.touchPosY = event.originalEvent.touches[0].pageY;

                        })
                        .on('touchmove', function(event) {

                            // No start position recorded? Bail.
                            if (_.$viewer.touchPosX === null || _.$viewer.touchPosY === null)
                                return;

                            // Calculate stuff.
                            var diffX = _.$viewer.touchPosX - event.originalEvent.touches[0].pageX,
                                diffY = _.$viewer.touchPosY - event.originalEvent.touches[0].pageY;
                            boundary = 20,
                                delta = 50;

                            // Swipe left (next).
                            if ((diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta))
                                _.next();

                            // Swipe right (previous).
                            else if ((diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta)))
                                _.previous();

                            // Overscroll fix.
                            var th = _.$viewer.outerHeight(),
                                ts = (_.$viewer.get(0).scrollHeight - _.$viewer.scrollTop());

                            if ((_.$viewer.scrollTop() <= 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

                                event.preventDefault();
                                event.stopPropagation();

                            }

                        });

                    // Main.

                    // Touch gestures.
                    _.$main
                        .on('touchstart', function(event) {

                            // Bail on xsmall.
                            if (skel.breakpoint('xsmall').active)
                                return;

                            // Record start position.
                            _.$main.touchPosX = event.originalEvent.touches[0].pageX;
                            _.$main.touchPosY = event.originalEvent.touches[0].pageY;

                        })
                        .on('touchmove', function(event) {

                            // Bail on xsmall.
                            if (skel.breakpoint('xsmall').active)
                                return;

                            // No start position recorded? Bail.
                            if (_.$main.touchPosX === null || _.$main.touchPosY === null)
                                return;

                            // Calculate stuff.
                            var diffX = _.$main.touchPosX - event.originalEvent.touches[0].pageX,
                                diffY = _.$main.touchPosY - event.originalEvent.touches[0].pageY;
                            boundary = 20,
                                delta = 50,
                                result = false;

                            // Swipe to close.
                            switch (_.settings.mainSide) {

                                case 'left':
                                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                                    break;

                                case 'right':
                                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                                    break;

                                default:
                                    break;

                            }

                            if (result)
                                _.hide();

                            // Overscroll fix.
                            var th = _.$main.outerHeight(),
                                ts = (_.$main.get(0).scrollHeight - _.$main.scrollTop());

                            if ((_.$main.scrollTop() <= 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

                                event.preventDefault();
                                event.stopPropagation();

                            }

                        });
                    // Toggle.
                    _.$toggle.on('click', function() {
                        _.toggle();
                    });

                    // Prevent event from bubbling up to "hide event on tap" event.
                    _.$toggle.on('touchend', function(event) {
                        event.stopPropagation();
                    });

                    // Nav.
                    _.$navNext.on('click', function() {
                        _.next();
                    });

                    _.$navPrevious.on('click', function() {
                        _.previous();
                    });

                    // Keyboard shortcuts.

                    // Ignore shortcuts within form elements.
                    _.$body.on('keydown', 'input,select,textarea', function(event) {
                        event.stopPropagation();
                    });

                    _.$window.on('keydown', function(event) {

                        // Ignore if xsmall is active.
                        if (skel.breakpoint('xsmall').active)
                            return;

                        // Check keycode.
                        if (event.keyCode in _.keys) {

                            // Stop other events.
                            event.stopPropagation();
                            event.preventDefault();

                            // Call shortcut.
                            (_.keys[event.keyCode])();

                        }

                    });

                },

                /**
                 * Initialize viewer.
                 */
                initViewer: function() {

                    // Bind thumbnail click event.
                    _.$thumbnails
                        .on('click', '.thumbnail', function(event) {

                            var $this = $(this);

                            // Stop other events.
                            event.preventDefault();
                            event.stopPropagation();

                            // Locked? Blur.
                            if (_.locked)
                                $this.blur();

                            // Switch to this thumbnail's slide.
                            _.switchTo($this.data('index'));

                        });

                    // Create slides from thumbnails.
                    _.$thumbnails.children()
                        .each(function() {

                            var $this = $(this),
                                $thumbnail = $this.children('.thumbnail'),
                                s;

                            // Slide object.
                            s = {
                                $parent: $this,
                                $slide: null,
                                $slideImage: null,
                                $slideCaption: null,
                                url: $thumbnail.attr('href'),
                                loaded: false
                            };

                            // Parent.
                            $this.attr('tabIndex', '-1');

                            // Slide.

                            // Create elements.
                            s.$slide = $('<div class="slide"><div class="caption"></div><div class="image"></div></div>');

                            // Image.
                            s.$slideImage = s.$slide.children('.image');

                            // Set background stuff.
                            s.$slideImage
                                .css('background-image', '')
                                .css('background-position', ($thumbnail.data('position') || 'center'));

                            // Caption.
                            s.$slideCaption = s.$slide.find('.caption');

                            // Move everything *except* the thumbnail itself to the caption.
                            $this.children().not($thumbnail)
                                .appendTo(s.$slideCaption);

                            // Preload?
                            if (_.settings.preload) {

                                // Force image to download.
                                var $img = $('<img src="' + s.url + '" />');

                                // Set slide's background image to it.
                                s.$slideImage
                                    .css('background-image', 'url(' + s.url + ')');

                                // Mark slide as loaded.
                                s.$slide.addClass('loaded');
                                s.loaded = true;

                            }

                            // Add to slides array.
                            _.slides.push(s);

                            // Set thumbnail's index.
                            $thumbnail.data('index', _.slides.length - 1);

                        });

                },

                /**
                 * Initialize stuff.
                 */
                init: function() {

                    // IE<10: Zero out transition delays.
                    if (skel.vars.IEVersion < 10) {

                        _.settings.slideDuration = 0;
                        _.settings.layoutDuration = 0;

                    }

                    // Skel.
                    skel.breakpoints({
                        xlarge: '(max-width: 1680px)',
                        large: '(max-width: 1280px)',
                        medium: '(max-width: 980px)',
                        small: '(max-width: 736px)',
                        xsmall: '(max-width: 480px)'
                    });

                    // Everything else.
                    _.initProperties();
                    _.initViewer();
                    _.initEvents();

                    // Initial slide.
                    window.setTimeout(function() {

                        // Show first slide if xsmall isn't active or it just deactivated.
                        skel.on('-xsmall !xsmall', function() {

                            if (_.current === null)
                                _.switchTo(0, true);

                        });

                    }, 0);

                },

                /**
                 * Switch to a specific slide.
                 * @param {integer} index Index.
                 */
                switchTo: function(index, noHide) {

                    // Already at index and xsmall isn't active? Bail.
                    if (_.current == index && !skel.breakpoint('xsmall').active)
                        return;

                    // Locked? Bail.
                    if (_.locked)
                        return;

                    // Lock.
                    _.locked = true;

                    // Hide main wrapper if medium is active.
                    if (!noHide && skel.breakpoint('medium').active && skel.vars.IEVersion > 8)
                        _.hide();

                    // Get slides.
                    var oldSlide = (_.current !== null ? _.slides[_.current] : null),
                        newSlide = _.slides[index];

                    // Update current.
                    _.current = index;

                    // Deactivate old slide (if there is one).
                    if (oldSlide) {

                        // Thumbnail.
                        oldSlide.$parent
                            .removeClass('active');

                        // Slide.
                        oldSlide.$slide.removeClass('active');

                    }

                    // Activate new slide.

                    // Thumbnail.
                    newSlide.$parent
                        .addClass('active')
                        .focus();

                    // Slide.
                    var f = function() {

                        // Old slide exists? Detach it.
                        if (oldSlide)
                            oldSlide.$slide.detach();

                        // Attach new slide.
                        newSlide.$slide.appendTo(_.$viewer);

                        // New slide not yet loaded?
                        if (!newSlide.loaded) {

                            window.setTimeout(function() {

                                // Mark as loading.
                                newSlide.$slide.addClass('loading');

                                // Wait for it to load.
                                $('<img src="' + newSlide.url + '" />').on('load', function() {
                                    //window.setTimeout(function() {

                                    // Set background image.
                                    newSlide.$slideImage
                                        .css('background-image', 'url(' + newSlide.url + ')');

                                    // Mark as loaded.
                                    newSlide.loaded = true;
                                    newSlide.$slide.removeClass('loading');

                                    // Mark as active.
                                    newSlide.$slide.addClass('active');

                                    // Unlock.
                                    window.setTimeout(function() {
                                        _.locked = false;
                                    }, 100);

                                    //}, 1000);
                                });

                            }, 100);

                        }

                        // Otherwise ...
                        else {

                            window.setTimeout(function() {

                                // Mark as active.
                                newSlide.$slide.addClass('active');

                                // Unlock.
                                window.setTimeout(function() {
                                    _.locked = false;
                                }, 100);

                            }, 100);

                        }

                    };

                    // No old slide? Switch immediately.
                    if (!oldSlide)
                        (f)();

                    // Otherwise, wait for old slide to disappear first.
                    else
                        window.setTimeout(f, _.settings.slideDuration);

                },

                /**
                 * Switches to the next slide.
                 */
                next: function() {

                    // Calculate new index.
                    var i, c = _.current,
                        l = _.slides.length;

                    if (c >= l - 1)
                        i = 0;
                    else
                        i = c + 1;

                    // Switch.
                    _.switchTo(i);

                },

                /**
                 * Switches to the previous slide.
                 */
                previous: function() {

                    // Calculate new index.
                    var i, c = _.current,
                        l = _.slides.length;

                    if (c <= 0)
                        i = l - 1;
                    else
                        i = c - 1;

                    // Switch.
                    _.switchTo(i);

                },

                /**
                 * Switches to slide "above" current.
                 */
                up: function() {

                    // Fullscreen? Bail.
                    if (_.$body.hasClass('fullscreen'))
                        return;

                    // Calculate new index.
                    var i, c = _.current,
                        l = _.slides.length,
                        tpr = _.settings.thumbnailsPerRow;

                    if (c <= (tpr - 1))
                        i = l - (tpr - 1 - c) - 1;
                    else
                        i = c - tpr;

                    // Switch.
                    _.switchTo(i);

                },

                /**
                 * Switches to slide "below" current.
                 */
                down: function() {

                    // Fullscreen? Bail.
                    if (_.$body.hasClass('fullscreen'))
                        return;

                    // Calculate new index.
                    var i, c = _.current,
                        l = _.slides.length,
                        tpr = _.settings.thumbnailsPerRow;

                    if (c >= l - tpr)
                        i = c - l + tpr;
                    else
                        i = c + tpr;

                    // Switch.
                    _.switchTo(i);

                },

                /**
                 * Shows the main wrapper.
                 */
                show: function() {

                    // Already visible? Bail.
                    if (!_.$body.hasClass('fullscreen'))
                        return;

                    // Show main wrapper.
                    _.$body.removeClass('fullscreen');

                    // Focus.
                    _.$main.focus();

                },

                /**
                 * Hides the main wrapper.
                 */
                hide: function() {

                    // Already hidden? Bail.
                    if (_.$body.hasClass('fullscreen'))
                        return;

                    // Hide main wrapper.
                    _.$body.addClass('fullscreen');

                    // Blur.
                    _.$main.blur();

                },

                /**
                 * Toggles main wrapper.
                 */
                toggle: function() {

                    if (_.$body.hasClass('fullscreen'))
                        _.show();
                    else
                        _.hide();

                },

            };
            return _;
        })(jQuery);
        main.init();
    });
}