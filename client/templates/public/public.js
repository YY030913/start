Template.appLayout.onRendered(function() {

    //ripple
    
	/**jQuery toolbar*/
	var ToolBar = {
        init: function( options, elem ) {
            var self = this;
            self.elem = elem;
            self.$elem = $( elem );
            self.options = $.extend( {}, $.fn.toolbar.options, options );
            self.metadata = self.$elem.data();
            self.overrideOptions();
            self.toolbar = $('<div class="tool-container" />')
                .addClass('tool-'+self.options.position)
                .addClass('toolbar-'+self.options.style)
                .append('<div class="tool-items" />')
                .append('<div class="arrow" />')
                .appendTo('body')
                .css('opacity', 0)
                .hide();
            self.toolbar_arrow = self.toolbar.find('.arrow');
            self.initializeToolbar();
        },

        overrideOptions: function() {
            var self = this;
            $.each( self.options, function( $option ) {
                if (typeof(self.$elem.data('toolbar-'+$option)) != "undefined") {
                    self.options[$option] = self.$elem.data('toolbar-'+$option);
                }
            });
        },

        initializeToolbar: function() {
            var self = this;
            self.populateContent();
            self.setTrigger();
            self.toolbarWidth = self.toolbar.width();
        },

        setTrigger: function() {
            var self = this;

            if (self.options.event != 'click') {

                var moveTime;
                function decideTimeout () {
                    if (self.$elem.hasClass('pressed')) {
                        moveTime = setTimeout(function() {
                            self.hide();
                        }, 150);
                    } else {
                        clearTimeout(moveTime);
                    };
                };

                self.$elem.on({
                    mouseenter: function(event) {
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
                        } else {
                            self.show();
                        }
                    }
                });

                self.$elem.parent().on({
                    mouseleave: function(event){ decideTimeout(); }
                });

                $('.tool-container').on({
                    mouseenter: function(event){ clearTimeout(moveTime); },
                    mouseleave: function(event){ decideTimeout(); }
                });
            }

            if (self.options.event == 'click') {
                self.$elem.on('click', function(event) {
                    event.preventDefault();
                    if(self.$elem.hasClass('pressed')) {
                        self.hide();
                    } else {
                        self.show();
                    }
                });

                if (self.options.hideOnClick) {
                    $('html').on("click.toolbar", function ( event ) {
                        if (event.target != self.elem &&
                            self.$elem.has(event.target).length === 0 &&
                            self.toolbar.has(event.target).length === 0 &&
                            self.toolbar.is(":visible")) {
                            self.hide();
                        }
                    });
                }
            }

            if (self.options.hover) {
                var moveTime;

                function decideTimeout () {
                    if (self.$elem.hasClass('pressed')) {
                        moveTime = setTimeout(function() {
                            self.hide();
                        }, 150);
                    } else {
                        clearTimeout(moveTime);
                    };
                };

                self.$elem.on({
                    mouseenter: function(event) {
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
                        } else {
                            self.show();
                        }
                    }
                });

                self.$elem.parent().on({
                    mouseleave: function(event){ decideTimeout(); }
                });

                $('.tool-container').on({
                    mouseenter: function(event){ clearTimeout(moveTime); },
                    mouseleave: function(event){ decideTimeout(); }
                });
            }

            $(window).resize(function( event ) {
                event.stopPropagation();
                if ( self.toolbar.is(":visible") ) {
                    self.toolbarCss = self.getCoordinates(self.options.position, 20);
                    self.collisionDetection();
                    self.toolbar.css( self.toolbarCss );
                    self.toolbar_arrow.css( self.arrowCss );
                }
            });
        },

        populateContent: function() {
            var self = this;
            var location = self.toolbar.find('.tool-items');
            var content = $(self.options.content).clone( true ).find('a').addClass('tool-item');
            location.html(content);
            location.find('.tool-item').on('click', function(event) {
                event.preventDefault();
                self.$elem.trigger('toolbarItemClick', this);
            });
        },

        calculatePosition: function() {
            var self = this;
                self.arrowCss = {};
                self.toolbarCss = self.getCoordinates(self.options.position, self.options.adjustment);
                self.toolbarCss.position = 'absolute';
                self.toolbarCss.zIndex = self.options.zIndex;
                self.collisionDetection();
                self.toolbar.css(self.toolbarCss);
                self.toolbar_arrow.css(self.arrowCss);
        },

        getCoordinates: function( position, adjustment ) {
            var self = this;
            self.coordinates = self.$elem.offset();

            if (self.options.adjustment && self.options.adjustment[self.options.position]) {
                adjustment = self.options.adjustment[self.options.position] + adjustment;
            }

            switch(self.options.position) {
                case 'top':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.outerWidth()/2),
                        top: self.coordinates.top-self.$elem.outerHeight()-adjustment,
                        right: 'auto'
                    };
                case 'left':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)-(self.$elem.outerWidth()/2)-adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.outerHeight()/2),
                        right: 'auto'
                    };
                case 'right':
                    return {
                        left: self.coordinates.left+(self.toolbar.width()/2)+(self.$elem.outerWidth()/2)+adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.outerHeight()/2),
                        right: 'auto'
                    };
                case 'bottom':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.outerWidth()/2),
                        top: self.coordinates.top+self.$elem.outerHeight()+adjustment,
                        right: 'auto'
                    };
            }
        },

        collisionDetection: function() {
            var self = this;
            var edgeOffset = 20;
            if(self.options.position == 'top' || self.options.position == 'bottom') {
                self.arrowCss = {left: '50%', right: '50%'};
                if( self.toolbarCss.left < edgeOffset ) {
                    self.toolbarCss.left = edgeOffset;
                    self.arrowCss.left = self.$elem.offset().left + self.$elem.width()/2-(edgeOffset);
                }
                else if(($(window).width() - (self.toolbarCss.left + self.toolbarWidth)) < edgeOffset) {
                    self.toolbarCss.right = edgeOffset;
                    self.toolbarCss.left = 'auto';
                    self.arrowCss.left = 'auto';
                    self.arrowCss.right = ($(window).width()-self.$elem.offset().left)-(self.$elem.width()/2)-(edgeOffset)-5;
                }
            }
        },

        show: function() {
            var self = this;
            self.$elem.addClass('pressed');
            self.calculatePosition();
            self.toolbar.show().css({'opacity': 1}).addClass('animate-'+self.options.animation);
            self.$elem.trigger('toolbarShown');
        },

        hide: function() {
            var self = this;
            var animation = {'opacity': 0};

            self.$elem.removeClass('pressed');

            switch(self.options.position) {
                case 'top':
                    animation.top = '+=20';
                    break;
                case 'left':
                    animation.left = '+=20';
                    break;
                case 'right':
                    animation.left = '-=20';
                    break;
                case 'bottom':
                    animation.top = '-=20';
                    break;
            }

            self.toolbar.animate(animation, 200, function() {
                self.toolbar.hide();
            });

            self.$elem.trigger('toolbarHidden');
        },

        getToolbarElement: function () {
            return this.toolbar.find('.tool-items');
        }
    };

    $.fn.toolbar = function( options ) {
        if ($.isPlainObject( options )) {
            return this.each(function() {
                var toolbarObj = Object.create( ToolBar );
                toolbarObj.init( options, this );
                $(this).data('toolbarObj', toolbarObj);
            });
        } else if ( typeof options === 'string' && options.indexOf('_') !== 0 ) {
            var toolbarObj = $(this).data('toolbarObj');
            var method = toolbarObj[options];
            return method.apply(toolbarObj, $.makeArray(arguments).slice(1));
        }
    };

    $.fn.toolbar.options = {
        content: '#myContent',
        position: 'top',
        hideOnClick: false,
        zIndex: 120,
        hover: false,
        style: 'default',
        animation: 'standard',
        adjustment: 10
    };

	/* 
	 * jQuery - Easy Ticker plugin - v1.0
	 * http://www.aakashweb.com/
	 * Copyright 2012, Aakash Chakravarthy
	 * Released under the MIT License.
	 */
	$.fn.easyTicker = function(options) {

		var defaults = {
			direction: 'up',
			easing: 'swing',
			speed: 'slow',
			interval: 2000,
			height: 'auto',
			visible: 0,
			mousePause: 1,
			controls: {
				up: '',
				down: '',
				toggle: ''
			}
		};

		// Initialize the variables
		var options = $.extend(defaults, options),
			timer = 0,
			tClass = 'et-run',
			winFocus = 0,
			vBody = $('body'),
			cUp = $(options.controls.up),
			cDown = $(options.controls.down),
			cToggle = $(options.controls.toggle);

		// The initializing function
		var init = function(obj, target) {

			target.children().css('margin', 0).children().css('margin', 0);

			obj.css({
				position: 'relative',
				height: (options.height == 'auto') ? objHeight(obj, target) : options.height,
				overflow: 'hidden'
			});

			target.css({
				'position': 'absolute',
				'margin': 0
			}).children().css('margin', 0);

			if (options.visible != 0 && options.height == 'auto') {
				adjHeight(obj, target);
			}

			// Set the class to the "toggle" control and set the timer.
			cToggle.addClass(tClass);
			setTimer(obj, target);
		}

		// Core function to move the element up and down.
		var move = function(obj, target, type) {

			if (!obj.is(':visible')) return;

			if (type == 'up') {
				var sel = ':first-child',
					eq = '-=',
					appType = 'appendTo';
			} else {
				var sel = ':last-child',
					eq = '+=',
					appType = 'prependTo';
			}

			var selChild = $(target).children(sel);
			var height = selChild.outerHeight();

			$(target).stop(true, true).animate({
				'top': eq + height + "px"
			}, options.speed, options.easing, function() {
				selChild.hide()[appType](target).fadeIn();
				$(target).css('top', 0);
				if (options.visible != 0 && options.height == 'auto') {
					adjHeight(obj, target);
				}
			});
		}

		// Activates the timer.
		var setTimer = function(obj, target) {
			if (cToggle.length == 0 || cToggle.hasClass(tClass)) {
				timer = setInterval(function() {
					if (vBody.attr('data-focus') != 1) {
						return;
					}
					move(obj, target, options.direction);
				}, options.interval);
			}
		}

		// Stops the timer
		var stopTimer = function(obj) {
			clearInterval(timer);
		}

		// Adjust the wrapper height and show the visible elements only.
		var adjHeight = function(obj, target) {
			var wrapHeight = 0;
			$(target).children(':lt(' + options.visible + ')').each(function() {
				wrapHeight += $(this).outerHeight();
			});

			obj.stop(true, true).animate({
				height: wrapHeight
			}, options.speed);
		}

		// Get the maximum height of the children.
		var objHeight = function(obj, target) {
			var height = 0;

			var tempDisp = obj.css('display');
			obj.css('display', 'block');

			$(target).children().each(function() {
				height += $(this).outerHeight();
			});

			obj.css('display', tempDisp);
			return height;
		}

		// Hack to check window status
		function onBlur() {
			vBody.attr('data-focus', 0);
		};

		function onFocus() {
			vBody.attr('data-focus', 1);
		};

		if ( /*@cc_on!@*/ false) { // check for Internet Explorer
			document.onfocusin = onFocus;
			document.onfocusout = onBlur;
		} else {
			$(window).bind('focus mouseover', onFocus);
			$(window).bind('blur', onBlur);
		}

		return this.each(function() {
			var obj = $(this);
			var tar = obj.children(':first-child');

			// Initialize the content
			init(obj, tar);

			// Bind the mousePause action
			if (options.mousePause == 1) {
				obj.mouseover(function() {
					stopTimer(obj);
				}).mouseleave(function() {
					setTimer(obj, tar);
				});
			}

			// Controls action
			cToggle.on('click', function() {
				if ($(this).hasClass(tClass)) {
					stopTimer(obj);
					$(this).removeClass(tClass);
				} else {
					$(this).addClass(tClass);
					setTimer(obj, tar);
				}
			});

			cUp.on('click', function() {
				move(obj, tar, 'up');
			});

			cDown.on('click', function() {
				move(obj, tar, 'down');
			});

		});
	};
	//sweetalert
	! function(e, t, n) {
		"use strict";
		! function o(e, t, n) {
			function a(s, l) {
				if (!t[s]) {
					if (!e[s]) {
						var i = "function" == typeof require && require;
						if (!l && i) return i(s, !0);
						if (r) return r(s, !0);
						var u = new Error("Cannot find module '" + s + "'");
						throw u.code = "MODULE_NOT_FOUND", u
					}
					var c = t[s] = {
						exports: {}
					};
					e[s][0].call(c.exports, function(t) {
						var n = e[s][1][t];
						return a(n ? n : t)
					}, c, c.exports, o, e, t, n)
				}
				return t[s].exports
			}
			for (var r = "function" == typeof require && require, s = 0; s < n.length; s++) a(n[s]);
			return a
		}({
			1: [function(o, a, r) {
				var s = function(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				};
				Object.defineProperty(r, "__esModule", {
					value: !0
				});
				var l, i, u, c, d = o("./modules/handle-dom"),
					f = o("./modules/utils"),
					p = o("./modules/handle-swal-dom"),
					m = o("./modules/handle-click"),
					v = o("./modules/handle-key"),
					y = s(v),
					h = o("./modules/default-params"),
					b = s(h),
					g = o("./modules/set-params"),
					w = s(g);
				r["default"] = u = c = function() {
					function o(e) {
						var t = a;
						return t[e] === n ? b["default"][e] : t[e]
					}
					var a = arguments[0];
					if (d.addClass(t.body, "stop-scrolling"), p.resetInput(), a === n) return f.logStr("SweetAlert expects at least 1 attribute!"), !1;
					var r = f.extend({}, b["default"]);
					switch (typeof a) {
						case "string":
							r.title = a, r.text = arguments[1] || "", r.type = arguments[2] || "";
							break;
						case "object":
							if (a.title === n) return f.logStr('Missing "title" argument!'), !1;
							r.title = a.title;
							for (var s in b["default"]) r[s] = o(s);
							r.confirmButtonText = r.showCancelButton ? "Confirm" : b["default"].confirmButtonText, r.confirmButtonText = o("confirmButtonText"), r.doneFunction = arguments[1] || null;
							break;
						default:
							return f.logStr('Unexpected type of argument! Expected "string" or "object", got ' + typeof a), !1
					}
					w["default"](r), p.fixVerticalPosition(), p.openModal(arguments[1]);
					for (var u = p.getModal(), v = u.querySelectorAll("button"), h = ["onclick", "onmouseover", "onmouseout", "onmousedown", "onmouseup", "onfocus"], g = function(e) {
							return m.handleButton(e, r, u)
						}, C = 0; C < v.length; C++)
						for (var S = 0; S < h.length; S++) {
							var x = h[S];
							v[C][x] = g
						}
					p.getOverlay().onclick = g, l = e.onkeydown;
					var k = function(e) {
						return y["default"](e, r, u)
					};
					e.onkeydown = k, e.onfocus = function() {
						setTimeout(function() {
							i !== n && (i.focus(), i = n)
						}, 0)
					}, c.enableButtons()
				}, u.setDefaults = c.setDefaults = function(e) {
					if (!e) throw new Error("userParams is required");
					if ("object" != typeof e) throw new Error("userParams has to be a object");
					f.extend(b["default"], e)
				}, u.close = c.close = function() {
					var o = p.getModal();
					d.fadeOut(p.getOverlay(), 5), d.fadeOut(o, 5), d.removeClass(o, "showSweetAlert"), d.addClass(o, "hideSweetAlert"), d.removeClass(o, "visible");
					var a = o.querySelector(".sa-icon.sa-success");
					d.removeClass(a, "animate"), d.removeClass(a.querySelector(".sa-tip"), "animateSuccessTip"), d.removeClass(a.querySelector(".sa-long"), "animateSuccessLong");
					var r = o.querySelector(".sa-icon.sa-error");
					d.removeClass(r, "animateErrorIcon"), d.removeClass(r.querySelector(".sa-x-mark"), "animateXMark");
					var s = o.querySelector(".sa-icon.sa-warning");
					return d.removeClass(s, "pulseWarning"), d.removeClass(s.querySelector(".sa-body"), "pulseWarningIns"), d.removeClass(s.querySelector(".sa-dot"), "pulseWarningIns"), setTimeout(function() {
						var e = o.getAttribute("data-custom-class");
						d.removeClass(o, e)
					}, 300), d.removeClass(t.body, "stop-scrolling"), e.onkeydown = l, e.previousActiveElement && e.previousActiveElement.focus(), i = n, clearTimeout(o.timeout), !0
				}, u.showInputError = c.showInputError = function(e) {
					var t = p.getModal(),
						n = t.querySelector(".sa-input-error");
					d.addClass(n, "show");
					var o = t.querySelector(".sa-error-container");
					d.addClass(o, "show"), o.querySelector("p").innerHTML = e, setTimeout(function() {
						u.enableButtons()
					}, 1), t.querySelector("input").focus()
				}, u.resetInputError = c.resetInputError = function(e) {
					if (e && 13 === e.keyCode) return !1;
					var t = p.getModal(),
						n = t.querySelector(".sa-input-error");
					d.removeClass(n, "show");
					var o = t.querySelector(".sa-error-container");
					d.removeClass(o, "show")
				}, u.disableButtons = c.disableButtons = function() {
					var e = p.getModal(),
						t = e.querySelector("button.confirm"),
						n = e.querySelector("button.cancel");
					t.disabled = !0, n.disabled = !0
				}, u.enableButtons = c.enableButtons = function() {
					var e = p.getModal(),
						t = e.querySelector("button.confirm"),
						n = e.querySelector("button.cancel");
					t.disabled = !1, n.disabled = !1
				}, "undefined" != typeof e ? e.sweetAlert = e.swal = u : f.logStr("SweetAlert is a frontend module!"), a.exports = r["default"]
			}, {
				"./modules/default-params": 2,
				"./modules/handle-click": 3,
				"./modules/handle-dom": 4,
				"./modules/handle-key": 5,
				"./modules/handle-swal-dom": 6,
				"./modules/set-params": 8,
				"./modules/utils": 9
			}],
			2: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var o = {
					title: "",
					text: "",
					type: null,
					allowOutsideClick: !1,
					showConfirmButton: !0,
					showCancelButton: !1,
					closeOnConfirm: !0,
					closeOnCancel: !0,
					confirmButtonText: "OK",
					confirmButtonColor: "#8CD4F5",
					cancelButtonText: "Cancel",
					imageUrl: null,
					imageSize: null,
					timer: null,
					customClass: "",
					html: !1,
					animation: !0,
					allowEscapeKey: !0,
					inputType: "text",
					inputPlaceholder: "",
					inputValue: "",
					showLoaderOnConfirm: !1
				};
				n["default"] = o, t.exports = n["default"]
			}, {}],
			3: [function(t, n, o) {
				Object.defineProperty(o, "__esModule", {
					value: !0
				});
				var a = t("./utils"),
					r = (t("./handle-swal-dom"), t("./handle-dom")),
					s = function(t, n, o) {
						function s(e) {
							m && n.confirmButtonColor && (p.style.backgroundColor = e)
						}
						var u, c, d, f = t || e.event,
							p = f.target || f.srcElement,
							m = -1 !== p.className.indexOf("confirm"),
							v = -1 !== p.className.indexOf("sweet-overlay"),
							y = r.hasClass(o, "visible"),
							h = n.doneFunction && "true" === o.getAttribute("data-has-done-function");
						switch (m && n.confirmButtonColor && (u = n.confirmButtonColor, c = a.colorLuminance(u, -.04), d = a.colorLuminance(u, -.14)), f.type) {
							case "mouseover":
								s(c);
								break;
							case "mouseout":
								s(u);
								break;
							case "mousedown":
								s(d);
								break;
							case "mouseup":
								s(c);
								break;
							case "focus":
								var b = o.querySelector("button.confirm"),
									g = o.querySelector("button.cancel");
								m ? g.style.boxShadow = "none" : b.style.boxShadow = "none";
								break;
							case "click":
								var w = o === p,
									C = r.isDescendant(o, p);
								if (!w && !C && y && !n.allowOutsideClick) break;
								m && h && y ? l(o, n) : h && y || v ? i(o, n) : r.isDescendant(o, p) && "BUTTON" === p.tagName && sweetAlert.close()
						}
					},
					l = function(e, t) {
						var n = !0;
						r.hasClass(e, "show-input") && (n = e.querySelector("input").value, n || (n = "")), t.doneFunction(n), t.closeOnConfirm && sweetAlert.close(), t.showLoaderOnConfirm && sweetAlert.disableButtons()
					},
					i = function(e, t) {
						var n = String(t.doneFunction).replace(/\s/g, ""),
							o = "function(" === n.substring(0, 9) && ")" !== n.substring(9, 10);
						o && t.doneFunction(!1), t.closeOnCancel && sweetAlert.close()
					};
				o["default"] = {
					handleButton: s,
					handleConfirm: l,
					handleCancel: i
				}, n.exports = o["default"]
			}, {
				"./handle-dom": 4,
				"./handle-swal-dom": 6,
				"./utils": 9
			}],
			4: [function(n, o, a) {
				Object.defineProperty(a, "__esModule", {
					value: !0
				});
				var r = function(e, t) {
						return new RegExp(" " + t + " ").test(" " + e.className + " ")
					},
					s = function(e, t) {
						r(e, t) || (e.className += " " + t)
					},
					l = function(e, t) {
						var n = " " + e.className.replace(/[\t\r\n]/g, " ") + " ";
						if (r(e, t)) {
							for (; n.indexOf(" " + t + " ") >= 0;) n = n.replace(" " + t + " ", " ");
							e.className = n.replace(/^\s+|\s+$/g, "")
						}
					},
					i = function(e) {
						var n = t.createElement("div");
						return n.appendChild(t.createTextNode(e)), n.innerHTML
					},
					u = function(e) {
						e.style.opacity = "", e.style.display = "block"
					},
					c = function(e) {
						if (e && !e.length) return u(e);
						for (var t = 0; t < e.length; ++t) u(e[t])
					},
					d = function(e) {
						e.style.opacity = "", e.style.display = "none"
					},
					f = function(e) {
						if (e && !e.length) return d(e);
						for (var t = 0; t < e.length; ++t) d(e[t])
					},
					p = function(e, t) {
						for (var n = t.parentNode; null !== n;) {
							if (n === e) return !0;
							n = n.parentNode
						}
						return !1
					},
					m = function(e) {
						e.style.left = "-9999px", e.style.display = "block";
						var t, n = e.clientHeight;
						return t = "undefined" != typeof getComputedStyle ? parseInt(getComputedStyle(e).getPropertyValue("padding-top"), 10) : parseInt(e.currentStyle.padding), e.style.left = "", e.style.display = "none", "-" + parseInt((n + t) / 2) + "px"
					},
					v = function(e, t) {
						if (+e.style.opacity < 1) {
							t = t || 16, e.style.opacity = 0, e.style.display = "block";
							var n = +new Date,
								o = function(e) {
									function t() {
										return e.apply(this, arguments)
									}
									return t.toString = function() {
										return e.toString()
									}, t
								}(function() {
									e.style.opacity = +e.style.opacity + (new Date - n) / 100, n = +new Date, +e.style.opacity < 1 && setTimeout(o, t)
								});
							o()
						}
						e.style.display = "block"
					},
					y = function(e, t) {
						t = t || 16, e.style.opacity = 1;
						var n = +new Date,
							o = function(e) {
								function t() {
									return e.apply(this, arguments)
								}
								return t.toString = function() {
									return e.toString()
								}, t
							}(function() {
								e.style.opacity = +e.style.opacity - (new Date - n) / 100, n = +new Date, +e.style.opacity > 0 ? setTimeout(o, t) : e.style.display = "none"
							});
						o()
					},
					h = function(n) {
						if ("function" == typeof MouseEvent) {
							var o = new MouseEvent("click", {
								view: e,
								bubbles: !1,
								cancelable: !0
							});
							n.dispatchEvent(o)
						} else if (t.createEvent) {
							var a = t.createEvent("MouseEvents");
							a.initEvent("click", !1, !1), n.dispatchEvent(a)
						} else t.createEventObject ? n.fireEvent("onclick") : "function" == typeof n.onclick && n.onclick()
					},
					b = function(t) {
						"function" == typeof t.stopPropagation ? (t.stopPropagation(), t.preventDefault()) : e.event && e.event.hasOwnProperty("cancelBubble") && (e.event.cancelBubble = !0)
					};
				a.hasClass = r, a.addClass = s, a.removeClass = l, a.escapeHtml = i, a._show = u, a.show = c, a._hide = d, a.hide = f, a.isDescendant = p, a.getTopMargin = m, a.fadeIn = v, a.fadeOut = y, a.fireClick = h, a.stopEventPropagation = b
			}, {}],
			5: [function(t, o, a) {
				Object.defineProperty(a, "__esModule", {
					value: !0
				});
				var r = t("./handle-dom"),
					s = t("./handle-swal-dom"),
					l = function(t, o, a) {
						var l = t || e.event,
							i = l.keyCode || l.which,
							u = a.querySelector("button.confirm"),
							c = a.querySelector("button.cancel"),
							d = a.querySelectorAll("button[tabindex]");
						if (-1 !== [9, 13, 32, 27].indexOf(i)) {
							for (var f = l.target || l.srcElement, p = -1, m = 0; m < d.length; m++)
								if (f === d[m]) {
									p = m;
									break
								}
							9 === i ? (f = -1 === p ? u : p === d.length - 1 ? d[0] : d[p + 1], r.stopEventPropagation(l), f.focus(), o.confirmButtonColor && s.setFocusStyle(f, o.confirmButtonColor)) : 13 === i ? ("INPUT" === f.tagName && (f = u, u.focus()), f = -1 === p ? u : n) : 27 === i && o.allowEscapeKey === !0 ? (f = c, r.fireClick(f, l)) : f = n
						}
					};
				a["default"] = l, o.exports = a["default"]
			}, {
				"./handle-dom": 4,
				"./handle-swal-dom": 6
			}],
			6: [function(n, o, a) {
				var r = function(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				};
				Object.defineProperty(a, "__esModule", {
					value: !0
				});
				var s = n("./utils"),
					l = n("./handle-dom"),
					i = n("./default-params"),
					u = r(i),
					c = n("./injected-html"),
					d = r(c),
					f = ".sweet-alert",
					p = ".sweet-overlay",
					m = function() {
						var e = t.createElement("div");
						for (e.innerHTML = d["default"]; e.firstChild;) t.body.appendChild(e.firstChild)
					},
					v = function(e) {
						function t() {
							return e.apply(this, arguments)
						}
						return t.toString = function() {
							return e.toString()
						}, t
					}(function() {
						var e = t.querySelector(f);
						return e || (m(), e = v()), e
					}),
					y = function() {
						var e = v();
						return e ? e.querySelector("input") : void 0
					},
					h = function() {
						return t.querySelector(p)
					},
					b = function(e, t) {
						var n = s.hexToRgb(t);
						e.style.boxShadow = "0 0 2px rgba(" + n + ", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"
					},
					g = function(n) {
						var o = v();
						l.fadeIn(h(), 10), l.show(o), l.addClass(o, "showSweetAlert"), l.removeClass(o, "hideSweetAlert"), e.previousActiveElement = t.activeElement;
						var a = o.querySelector("button.confirm");
						a.focus(), setTimeout(function() {
							l.addClass(o, "visible")
						}, 500);
						var r = o.getAttribute("data-timer");
						if ("null" !== r && "" !== r) {
							var s = n;
							o.timeout = setTimeout(function() {
								var e = (s || null) && "true" === o.getAttribute("data-has-done-function");
								e ? s(null) : sweetAlert.close()
							}, r)
						}
					},
					w = function() {
						var e = v(),
							t = y();
						l.removeClass(e, "show-input"), t.value = u["default"].inputValue, t.setAttribute("type", u["default"].inputType), t.setAttribute("placeholder", u["default"].inputPlaceholder), C()
					},
					C = function(e) {
						if (e && 13 === e.keyCode) return !1;
						var t = v(),
							n = t.querySelector(".sa-input-error");
						l.removeClass(n, "show");
						var o = t.querySelector(".sa-error-container");
						l.removeClass(o, "show")
					},
					S = function() {
						var e = v();
						e.style.marginTop = l.getTopMargin(v())
					};
				a.sweetAlertInitialize = m, a.getModal = v, a.getOverlay = h, a.getInput = y, a.setFocusStyle = b, a.openModal = g, a.resetInput = w, a.resetInputError = C, a.fixVerticalPosition = S
			}, {
				"./default-params": 2,
				"./handle-dom": 4,
				"./injected-html": 7,
				"./utils": 9
			}],
			7: [function(e, t, n) {
				Object.defineProperty(n, "__esModule", {
					value: !0
				});
				var o = '<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';
				n["default"] = o, t.exports = n["default"]
			}, {}],
			8: [function(e, t, o) {
				Object.defineProperty(o, "__esModule", {
					value: !0
				});
				var a = e("./utils"),
					r = e("./handle-swal-dom"),
					s = e("./handle-dom"),
					l = ["error", "warning", "info", "success", "input", "prompt"],
					i = function(e) {
						var t = r.getModal(),
							o = t.querySelector("h2"),
							i = t.querySelector("p"),
							u = t.querySelector("button.cancel"),
							c = t.querySelector("button.confirm");
						if (o.innerHTML = e.html ? e.title : s.escapeHtml(e.title).split("\n").join("<br>"), i.innerHTML = e.html ? e.text : s.escapeHtml(e.text || "").split("\n").join("<br>"), e.text && s.show(i), e.customClass) s.addClass(t, e.customClass), t.setAttribute("data-custom-class", e.customClass);
						else {
							var d = t.getAttribute("data-custom-class");
							s.removeClass(t, d), t.setAttribute("data-custom-class", "")
						}
						if (s.hide(t.querySelectorAll(".sa-icon")), e.type && !a.isIE8()) {
							var f = function() {
								for (var o = !1, a = 0; a < l.length; a++)
									if (e.type === l[a]) {
										o = !0;
										break
									}
								if (!o) return logStr("Unknown alert type: " + e.type), {
									v: !1
								};
								var i = ["success", "error", "warning", "info"],
									u = n; - 1 !== i.indexOf(e.type) && (u = t.querySelector(".sa-icon.sa-" + e.type), s.show(u));
								var c = r.getInput();
								switch (e.type) {
									case "success":
										s.addClass(u, "animate"), s.addClass(u.querySelector(".sa-tip"), "animateSuccessTip"), s.addClass(u.querySelector(".sa-long"), "animateSuccessLong");
										break;
									case "error":
										s.addClass(u, "animateErrorIcon"), s.addClass(u.querySelector(".sa-x-mark"), "animateXMark");
										break;
									case "warning":
										s.addClass(u, "pulseWarning"), s.addClass(u.querySelector(".sa-body"), "pulseWarningIns"), s.addClass(u.querySelector(".sa-dot"), "pulseWarningIns");
										break;
									case "input":
									case "prompt":
										c.setAttribute("type", e.inputType), c.value = e.inputValue, c.setAttribute("placeholder", e.inputPlaceholder), s.addClass(t, "show-input"), setTimeout(function() {
											c.focus(), c.addEventListener("keyup", swal.resetInputError)
										}, 400)
								}
							}();
							if ("object" == typeof f) return f.v
						}
						if (e.imageUrl) {
							var p = t.querySelector(".sa-icon.sa-custom");
							p.style.backgroundImage = "url(" + e.imageUrl + ")", s.show(p);
							var m = 80,
								v = 80;
							if (e.imageSize) {
								var y = e.imageSize.toString().split("x"),
									h = y[0],
									b = y[1];
								h && b ? (m = h, v = b) : logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got " + e.imageSize)
							}
							p.setAttribute("style", p.getAttribute("style") + "width:" + m + "px; height:" + v + "px")
						}
						t.setAttribute("data-has-cancel-button", e.showCancelButton), e.showCancelButton ? u.style.display = "inline-block" : s.hide(u), t.setAttribute("data-has-confirm-button", e.showConfirmButton), e.showConfirmButton ? c.style.display = "inline-block" : s.hide(c), e.cancelButtonText && (u.innerHTML = s.escapeHtml(e.cancelButtonText)), e.confirmButtonText && (c.innerHTML = s.escapeHtml(e.confirmButtonText)), e.confirmButtonColor && (c.style.backgroundColor = e.confirmButtonColor, c.style.borderLeftColor = e.confirmLoadingButtonColor, c.style.borderRightColor = e.confirmLoadingButtonColor, r.setFocusStyle(c, e.confirmButtonColor)), t.setAttribute("data-allow-outside-click", e.allowOutsideClick);
						var g = e.doneFunction ? !0 : !1;
						t.setAttribute("data-has-done-function", g), e.animation ? "string" == typeof e.animation ? t.setAttribute("data-animation", e.animation) : t.setAttribute("data-animation", "pop") : t.setAttribute("data-animation", "none"), t.setAttribute("data-timer", e.timer)
					};
				o["default"] = i, t.exports = o["default"]
			}, {
				"./handle-dom": 4,
				"./handle-swal-dom": 6,
				"./utils": 9
			}],
			9: [function(t, n, o) {
				Object.defineProperty(o, "__esModule", {
					value: !0
				});
				var a = function(e, t) {
						for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
						return e
					},
					r = function(e) {
						var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
						return t ? parseInt(t[1], 16) + ", " + parseInt(t[2], 16) + ", " + parseInt(t[3], 16) : null
					},
					s = function() {
						return e.attachEvent && !e.addEventListener
					},
					l = function(t) {
						e.console && e.console.log("SweetAlert: " + t)
					},
					i = function(e, t) {
						e = String(e).replace(/[^0-9a-f]/gi, ""), e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0;
						var n, o, a = "#";
						for (o = 0; 3 > o; o++) n = parseInt(e.substr(2 * o, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * t), 255)).toString(16), a += ("00" + n).substr(n.length);
						return a
					};
				o.extend = a, o.hexToRgb = r, o.isIE8 = s, o.logStr = l, o.colorLuminance = i
			}, {}]
		}, {}, [1]), "function" == typeof define && define.amd ? define(function() {
			return sweetAlert
		}) : "undefined" != typeof module && module.exports && (module.exports = sweetAlert)
	}(window, document);
	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var $this = $(this);
		$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var $this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
				'class="link depth-' + indent + '"' +
				((typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
				((typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
				'<span class="indent-' + indent + '"></span>' +
				$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements?
		if (this.length == 0)
			return $this;

		// Multiple elements?
		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i]).panel(userConfig);

			return $this;

		}

		// Vars.
		var $this = $(this),
			$body = $('body'),
			$window = $(window),
			id = $this.attr('id'),
			config;

		// Config.
		config = $.extend({

			// Delay.
			delay: 0,

			// Hide panel on link click.
			hideOnClick: false,

			// Hide panel on escape keypress.
			hideOnEscape: false,

			// Hide panel on swipe.
			hideOnSwipe: false,

			// Reset scroll position on hide.
			resetScroll: false,

			// Reset forms on hide.
			resetForms: false,

			// Side of viewport the panel will appear.
			side: null,

			// Target element for "class".
			target: $this,

			// Class to toggle.
			visibleClass: 'visible'

		}, userConfig);

		// Expand "target" if it's not a jQuery object already.
		if (typeof config.target != 'jQuery')
			config.target = $(config.target);

		// Panel.

		// Methods.
		$this._hide = function(event) {

			// Already hidden? Bail.
			if (!config.target.hasClass(config.visibleClass))
				return;

			// If an event was provided, cancel it.
			if (event) {

				event.preventDefault();
				event.stopPropagation();

			}

			// Hide.
			config.target.removeClass(config.visibleClass);

			// Post-hide stuff.
			window.setTimeout(function() {

				// Reset scroll position.
				if (config.resetScroll)
					$this.scrollTop(0);

				// Reset forms.
				if (config.resetForms)
					$this.find('form').each(function() {
						this.reset();
					});

			}, config.delay);

		};

		// Vendor fixes.
		$this
			.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
			.css('-webkit-overflow-scrolling', 'touch');

		// Hide on click.
		if (config.hideOnClick) {

			$this.find('a')
				.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

			$this
				.on('click', 'a', function(event) {
					var $a = $(this),
						href = $a.attr('href'),
						target = $a.attr('target');

					if (!href || href == '#' || href == '' || href == '#' + id)
						return;

					// Cancel original event.
					event.preventDefault();
					event.stopPropagation();

					// Hide panel.
					$this._hide();

					// Redirect to href.
					window.setTimeout(function() {

						if (target == '_blank')
							window.open(href);
						else
							window.location.href = href;

					}, config.delay + 10);

				});

		}

		// Event: Touch stuff.
		$this.on('touchstart', function(event) {

			$this.touchPosX = event.originalEvent.touches[0].pageX;
			$this.touchPosY = event.originalEvent.touches[0].pageY;

		})

		$this.on('touchmove', function(event) {
			if ($this.touchPosX === null || $this.touchPosY === null)
				return;

			var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
				diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
				th = $this.outerHeight(),
				ts = ($this.get(0).scrollHeight - $this.scrollTop());

			// Hide on swipe?
			if (config.hideOnSwipe) {

				var result = false,
					boundary = 20,
					delta = 50;

				switch (config.side) {

					case 'left':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
						break;

					case 'right':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
						break;

					case 'top':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
						break;

					case 'bottom':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
						break;

					default:
						break;

				}

				if (result) {

					$this.touchPosX = null;
					$this.touchPosY = null;
					$this._hide();

					return false;

				}

			}

			// Prevent vertical scrolling past the top or bottom.
			if (($this.scrollTop() < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

				event.preventDefault();
				event.stopPropagation();

			}

		});

		// Event: Prevent certain events inside the panel from bubbling.
		$this.on('click touchend touchstart touchmove', function(event) {
			event.stopPropagation();
		});

		// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
		$this.on('click', 'a[href="#' + id + '"]', function(event) {
			event.preventDefault();
			event.stopPropagation();

			config.target.removeClass(config.visibleClass);

		});

		// Body.

		// Event: Hide panel on body click/tap.
		$body.on('click touchend', function(event) {
			$this._hide(event);
		});

		// Event: Toggle.
		$body.on('click', 'a[href="#' + id + '"]', function(event) {

			event.preventDefault();
			event.stopPropagation();

			config.target.toggleClass(config.visibleClass);

		});

		// Window.

		// Event: Hide on ESC.
		if (config.hideOnEscape)
			$window.on('keydown', function(event) {

				if (event.keyCode == 27)
					$this._hide(event);

			});

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		// Browser natively supports placeholders? Bail.
		if (typeof(document.createElement('input')).placeholder != 'undefined')
			return $(this);

		// No elements?
		if (this.length == 0)
			return $this;

		// Multiple elements?
		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i]).placeholder();

			return $this;

		}

		// Vars.
		var $this = $(this);

		// Text, TextArea.
		$this.find('input[type=text],textarea')
			.each(function() {

				var i = $(this);

				if (i.val() == '' || i.val() == i.attr('placeholder'))
					i
					.addClass('polyfill-placeholder')
					.val(i.attr('placeholder'));

			})
			.on('blur', function() {

				var i = $(this);

				if (i.attr('name').match(/-polyfill-field$/))
					return;

				if (i.val() == '')
					i
					.addClass('polyfill-placeholder')
					.val(i.attr('placeholder'));

			})
			.on('focus', function() {

				var i = $(this);

				if (i.attr('name').match(/-polyfill-field$/))
					return;

				if (i.val() == i.attr('placeholder'))
					i
					.removeClass('polyfill-placeholder')
					.val('');

			});

		// Password.
		$this.find('input[type=password]')
			.each(function() {

				var i = $(this);
				var x = $(
					$('<div>')
					.append(i.clone())
					.remove()
					.html()
					.replace(/type="password"/i, 'type="text"')
					.replace(/type=password/i, 'type=text')
				);

				if (i.attr('id') != '')
					x.attr('id', i.attr('id') + '-polyfill-field');

				if (i.attr('name') != '')
					x.attr('name', i.attr('name') + '-polyfill-field');

				x.addClass('polyfill-placeholder')
					.val(x.attr('placeholder')).insertAfter(i);

				if (i.val() == '')
					i.hide();
				else
					x.hide();

				i
					.on('blur', function(event) {

						event.preventDefault();

						var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

						if (i.val() == '') {

							i.hide();
							x.show();

						}

					});

				x
					.on('focus', function(event) {

						event.preventDefault();

						var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

						x.hide();

						i
							.show()
							.focus();

					})
					.on('keypress', function(event) {

						event.preventDefault();
						x.val('');

					});

			});

		// Events.
		$this
			.on('submit', function() {

				$this.find('input[type=text],input[type=password],textarea')
					.each(function(event) {

						var i = $(this);

						if (i.attr('name').match(/-polyfill-field$/))
							i.attr('name', '');

						if (i.val() == i.attr('placeholder')) {

							i.removeClass('polyfill-placeholder');
							i.val('');

						}

					});

			})
			.on('reset', function(event) {

				event.preventDefault();

				$this.find('select')
					.val($('option:first').val());

				$this.find('input,textarea')
					.each(function() {

						var i = $(this),
							x;

						i.removeClass('polyfill-placeholder');

						switch (this.type) {

							case 'submit':
							case 'reset':
								break;

							case 'password':
								i.val(i.attr('defaultValue'));

								x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

								if (i.val() == '') {
									i.hide();
									x.show();
								} else {
									i.show();
									x.hide();
								}

								break;

							case 'checkbox':
							case 'radio':
								i.attr('checked', i.attr('defaultValue'));
								break;

							case 'text':
							case 'textarea':
								i.val(i.attr('defaultValue'));

								if (i.val() == '') {
									i.addClass('polyfill-placeholder');
									i.val(i.attr('placeholder'));
								}

								break;

							default:
								i.val(i.attr('defaultValue'));
								break;

						}
					});

			});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
		if (typeof $elements != 'jQuery')
			$elements = $($elements);

		// Step through elements.
		$elements.each(function() {

			var $e = $(this),
				$p,
				$parent = $e.parent();

			// No parent? Bail.
			if ($parent.length == 0)
				return;

			// Not moved? Move it.
			if (!$e.data(key)) {

				// Condition is false? Bail.
				if (!condition)
					return;

				// Get placeholder (which will serve as our point of reference for when this element needs to move back).
				$p = $e.prev();

				// Couldn't find anything? Means this element's already at the top, so bail.
				if ($p.length == 0)
					return;

				// Move element to top of parent.
				$e.prependTo($parent);

				// Mark element as moved.
				$e.data(key, $p);

			}

			// Moved already?
			else {

				// Condition is true? Bail.
				if (condition)
					return;

				$p = $e.data(key);

				// Move element back to its original location (using our placeholder).
				$e.insertAfter($p);

				// Unmark element as moved.
				$e.removeData(key);

			}

		});

	};

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

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	var $window = $(window),
		$body = $('body'),
		$menu = $('#menu'),
		$sidebar = $('#sidebar'),
		$main = $('#main');

	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-loading');
		}, 100);
	});

	// Fix: Placeholder polyfill.
	$('form').placeholder();

	// Prioritize "important" elements on medium.
	skel.on('+medium -medium', function() {
		$.prioritize(
			'.important\\28 medium\\29',
			skel.breakpoint('medium').active
		);
	});

	// IE<=9: Reverse order of main and sidebar.
	if (skel.vars.IEVersion <= 9)
		$main.insertAfter($sidebar);

	// Menu.
	$menu
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-menu-visible'
		});

	// Search (header).
	var $search = $('#search'),
		$search_input = $search.find('input');

	$body
		.on('click', '[href="#search"]', function(event) {

			event.preventDefault();

			// Not visible?
			if (!$search.hasClass('visible')) {

				// Reset form.
				$search[0].reset();

				// Show.
				$search.addClass('visible');

				// Focus input.
				$search_input.focus();

			}

		});

	$search_input
		.on('keydown', function(event) {

			if (event.keyCode == 27)
				$search_input.blur();

		})
		.on('blur', function() {
			window.setTimeout(function() {
				$search.removeClass('visible');
			}, 100);
		});



});

Template.appLayout.onCreated(function() {
	// Disable animations/transitions until the page has loaded.
	$('body').addClass('is-loading');
});