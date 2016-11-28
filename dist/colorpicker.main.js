'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _converts;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import {defaults} from './colorpicker.wheel.js';
// import {screen} from './colorpicker.screen.js';

/* Converts: HSL, RGB, HEX */
var converts = (_converts = {
	hsb2rgb: function hsb2rgb(hsb) {
		var rgb = {};
		var h = Math.round(hsb.h);
		var s = Math.round(hsb.s * 255 / 100);
		var v = Math.round(hsb.b * 255 / 100);
		if (s === 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255 - s) * v / 255;
			var t3 = (t1 - t2) * (h % 60) / 60;
			if (h === 360) h = 0;
			if (h < 60) {
				rgb.r = t1;rgb.b = t2;rgb.g = t2 + t3;
			} else if (h < 120) {
				rgb.g = t1;rgb.b = t2;rgb.r = t1 - t3;
			} else if (h < 180) {
				rgb.g = t1;rgb.r = t2;rgb.b = t2 + t3;
			} else if (h < 240) {
				rgb.b = t1;rgb.r = t2;rgb.g = t1 - t3;
			} else if (h < 300) {
				rgb.b = t1;rgb.g = t2;rgb.r = t2 + t3;
			} else if (h < 360) {
				rgb.r = t1;rgb.g = t2;rgb.b = t1 - t3;
			} else {
				rgb.r = 0;rgb.g = 0;rgb.b = 0;
			}
		}
		return {
			r: Math.round(rgb.r),
			g: Math.round(rgb.g),
			b: Math.round(rgb.b)
		};
	},
	rgbString2hex: function rgbString2hex(rgb) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return rgb && rgb.length === 4 ? '#' + ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
	},
	hsb2hex: function hsb2hex(rgb) {
		var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
		$.each(hex, function (nr, val) {
			if (val.length === 1) hex[nr] = '0' + val;
		});
		return '#' + hex.join('');
	}
}, _defineProperty(_converts, 'hsb2hex', function hsb2hex(hsb) {
	return rgb2hex(hsb2rgb(hsb));
}), _defineProperty(_converts, 'hex2hsb', function hex2hsb(hex) {
	var hsb = rgb2hsb(hex2rgb(hex));
	if (hsb.s === 0) hsb.h = 360;
	return hsb;
}), _defineProperty(_converts, 'rgb2hsb', function rgb2hsb(rgb) {
	var hsb = { h: 0, s: 0, b: 0 };
	var min = Math.min(rgb.r, rgb.g, rgb.b);
	var max = Math.max(rgb.r, rgb.g, rgb.b);
	var delta = max - min;
	hsb.b = max;
	hsb.s = max !== 0 ? 255 * delta / max : 0;
	if (hsb.s !== 0) {
		if (rgb.r === max) {
			hsb.h = (rgb.g - rgb.b) / delta;
		} else if (rgb.g === max) {
			hsb.h = 2 + (rgb.b - rgb.r) / delta;
		} else {
			hsb.h = 4 + (rgb.r - rgb.g) / delta;
		}
	} else {
		hsb.h = -1;
	}
	hsb.h *= 60;
	if (hsb.h < 0) {
		hsb.h += 360;
	}
	hsb.s *= 100 / 255;
	hsb.b *= 100 / 255;
	return hsb;
}), _defineProperty(_converts, 'hex2rgb', function hex2rgb(hex) {
	hex = parseInt(hex.indexOf('#') > -1 ? hex.substring(1) : hex, 16);
	return {
		/* jshint ignore:start */
		r: hex >> 16,
		g: (hex & 0x00FF00) >> 8,
		b: hex & 0x0000FF
		/* jshint ignore:end */
	};
}), _converts);

/* Setting */
var setting = {
	posX: '',
	posY: ''
};

/* Color value */
var hex = '',
    rgba = {
	r: '',
	g: '',
	b: '',
	a: ''
},
    hsla = {
	hue: '0',
	saturation: '100%',
	lightness: '50%',
	alpha: '1'
};

/* Selector */

var Selector = function () {
	function Selector() {
		_classCallCheck(this, Selector);
	}

	_createClass(Selector, [{
		key: 'qs',
		value: function qs(selector) {
			return document.querySelector(selector);
		}
	}, {
		key: 'qsAll',
		value: function qsAll(selector) {
			return document.querySelectorAll(selector);
		}
	}]);

	return Selector;
}();

var s = new Selector();

var Main = function () {
	function Main() {
		_classCallCheck(this, Main);
	}

	_createClass(Main, [{
		key: 'set',


		/* Setting by user */
		value: function set(para) {
			var _para$posX = para.posX,
			    posX = _para$posX === undefined ? '0px' : _para$posX,
			    _para$posY = para.posY,
			    posY = _para$posY === undefined ? '0px' : _para$posY;


			setting.posX = posX;
			setting.posY = posY;
		}

		/* Event handler */

	}, {
		key: 'event_handler',
		value: function event_handler() {
			var box = new Box();

			var event_bind = function event_bind(target, type, handler) {
				target.addEventListener(type, handler);
			};

			//Append templete
			box.appendTpl();

			var trigger = s.qs('#js-colorpicker-trigger');

			var colorpicker = s.qs('.colorpicker'),
			    movebar = s.qs('#js-movebar'),
			    panel = s.qs('#js-panel'),
			    control = s.qs('#js-control'),
			    solid_movebar = s.qs('#js-solid-movebar'),
			    opacity_movebar = s.qs('#js-opacity-movebar'),
			    convert_btn = s.qs('#js-convert');

			var queue = [movebar, solid_movebar, opacity_movebar];

			//Trigger box 
			event_bind(trigger, 'click', box.appear);

			//Hide Box 
			event_bind(window, 'keydown', box.hide);

			for (var i = 0, len = queue.length; i < len; ++i) {

				//Start moving 
				event_bind(queue[i], 'mousedown', function (event) {
					event.preventDefault();
					this.dataset.on = 'on';
					box.move(this, event);
				});

				//Moving
				event_bind(queue[i], 'mousemove', function (event) {
					if (this.dataset.on == 'on') {
						box.move(this, event);
					}
				});

				//Stop moving
				event_bind(queue[i], 'mouseup', function () {
					this.dataset.on = 'off';
				});
			}

			//Moveout
			event_bind(movebar, 'mouseout', function () {
				this.dataset.on = 'off';
			});

			//Click to move 
			event_bind(panel, 'click', function (event) {
				box.move(this, event);
			});

			// event_bind(control, 'click', function(event) {
			// 	box.move(this, event);
			// });

			//Convert
			var cur = 0,
			    next = void 0;

			event_bind(convert_btn, 'click', function () {

				// if (cur == 2) {
				// 	next = 0;
				// } else {
				// 	next = cur + 1;
				// }
				cur == 2 ? next = 0 : next = cur + 1;

				box.show(cur, next);

				cur == 2 ? cur = -1 : cur;
				cur++;
			});
		}

		/* init */

	}, {
		key: 'init',
		value: function init() {
			this.event_handler();
		}
	}]);

	return Main;
}();

var Box = function () {
	function Box() {
		_classCallCheck(this, Box);
	}

	_createClass(Box, [{
		key: 'fade',

		/* Trigger to fadeIn and fadeOut */
		value: function fade(target) {
			target.toggleClassList('fadeIn fadeOut');
		}

		/* Simple animate */

	}, {
		key: 'animate',
		value: function animate(o, para, cb) {
			var _para$top = para.top,
			    top = _para$top === undefined ? '0' : _para$top,
			    _para$left = para.left,
			    left = _para$left === undefined ? '0' : _para$left,
			    _para$bottom = para.bottom,
			    bottom = _para$bottom === undefined ? '0' : _para$bottom,
			    _para$right = para.right,
			    right = _para$right === undefined ? '0' : _para$right;


			o.style.top = top;
			o.style.left = left;
			o.style.bottom = bottom;
			o.style.right = right;

			if (!cb) {
				return;
			}
			cb();
		}

		/* Append templete */

	}, {
		key: 'appendTpl',
		value: function appendTpl() {
			var templete = '\n            <div class="colorpicker-panel" id="js-panel">\n                <div class="colorpicker-panel-mask"></div>\n                <div class="colorpicker-panel-movebar" id="js-movebar"></div>\n            </div>\n            <div class="colorpicker-toolbar">\n                <div class="colorpicker-toolbar-tool">\n                    <div class="colorpicker-screen"></div>\n                    <div class="colorpicker-watch" id="js-watch"></div>\n                    <div class="colorpicker-control" id="js-control">\n                        <div class="colorpicker-control-solid">\n                            <div class="colorpicker-control-movebar" id="js-solid-movebar"></div>\n                        </div>\n                        <div class="colorpicker-control-opacity" id="js-opacity-control">\n                            <div class="colorpicker-control-movebar" id="js-opacity-movebar"></div>\n                            <div class="colorpicker-control-opacity-mask"></div>\n                        </div>\n                    </div>\n                </div>\n                <div class="colorpicker-toolbar-input">\n                    <div class="colorpicker-toolbar-input-hex" id="js-input-hex" data-show="on">\n                        <input type="text">\n                        <div class="colorpicker-toolbar-input-text">HEX</div>\n                    </div>\n                    <div class="colorpicker-toolbar-input-rgba" id="js-input-rgba" data-show="off">\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">R</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">G</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">B</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">A</div>\n                        </div>\n                    </div>\n                    <div class="colorpicker-toolbar-input-hsla" id="js-input-hsla" data-show="off">\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">H</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">S</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">L</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text">\n                            <div class="colorpicker-toolbar-input-text">A</div>\n                        </div>\n                    </div>\n                    <div class="flip" id="js-convert"></div>\n                </div>\n            </div>\n        ';

			var script = s.qs('script');

			var colorpicker = document.createElement('div');

			colorpicker.classList.add('colorpicker');
			colorpicker.dataset.appear = 'off';
			colorpicker.innerHTML = templete;

			document.body.insertBefore(colorpicker, script);
		}
	}, {
		key: 'appear',
		value: function appear() {
			var colorpicker = s.qs('.colorpicker');

			if (colorpicker.dataset.appear == 'off') {
				colorpicker.style.display = 'block';
				colorpicker.style.left = setting.posX;
				colorpicker.style.top = setting.posY;

				colorpicker.classList.add('fade-in');
				colorpicker.classList.remove('fade-out');
				colorpicker.dataset.appear = 'on';
			} else {
				colorpicker.classList.add('fade-out');
				colorpicker.classList.remove('fade-in');
				colorpicker.dataset.appear = 'off';

				setTimeout(function () {
					colorpicker.style.display = 'none';
				}, 400);
			}
		}
	}, {
		key: 'hide',
		value: function hide(event) {
			var colorpicker = s.qs('.colorpicker');

			if (event && event.keyCode == 27) {
				colorpicker.classList.add('fade-out');
				colorpicker.classList.remove('fade-in');
				colorpicker.dataset.appear = 'off';

				setTimeout(function () {
					colorpicker.style.display = 'none';
				}, 400);
			}
		}

		/* The movebar and control move */

	}, {
		key: 'move',
		value: function move(target, event) {
			var colorpicker = s.qs('.colorpicker'),
			    panel = s.qs('#js-panel'),
			    movebar = s.qs('#js-movebar'),
			    control = s.qs('#js-control'),
			    solid_movebar = s.qs('#js-solid-movebar'),
			    opacity_movebar = s.qs('#js-opacity-movebar');

			var offsetX = colorpicker.offsetLeft,
			    offsetY = colorpicker.offsetTop,
			    offsetWidth = target.offsetWidth,
			    offsetHeight = target.offsetHeight,
			    x = Math.round(event.pageX - offsetX - offsetWidth / 2),
			    y = Math.round(event.pageY - offsetY - offsetHeight / 2);

			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x > panel.clientWidth - offsetWidth) x = panel.clientWidth - offsetWidth;
			if (y > panel.clientHeight - offsetHeight) y = panel.clientHeight - offsetHeight;

			if (target === movebar) {
				this.animate(target, {
					top: y + 'px',
					left: x + 'px'
				});
				this.move_picker(x, y);
			} else if (target === panel) {
				x = Math.round(event.pageX - offsetX), y = Math.round(event.pageY - offsetY);

				this.animate(movebar, {
					top: y + 'px',
					left: x + 'px'
				});
				this.move_picker(x, y);
			} else {
				offsetX = control.offsetLeft + colorpicker.offsetLeft, x = Math.round(event.pageX - offsetX - offsetWidth / 2);

				x < -8 ? x = -8 : x;
				x > control.clientWidth - offsetWidth ? x = control.clientWidth - offsetWidth + 8 : x;

				this.animate(target, {
					left: x + 'px'
				}, function () {
					target.style.top = '-1px';
				});

				if (target === solid_movebar) {

					var hue = Math.round((1 - (x + 8) / control.clientWidth) * 360);

					hue == 360 ? hue = 0 : hue;

					hsla.hue = hue;

					this.update_panel(hue);
					this.update_watch(hsla);
				} else {

					var alpha = Math.round((x + 8) / control.clientWidth * 100) / 100;

					hsla.alpha = alpha;

					this.update_watch(hsla);
				}
			}
		}

		/* Move picker */

	}, {
		key: 'move_picker',
		value: function move_picker(x, y) {
			var panel = s.qs('#js-panel'),
			    watch = s.qs('#js-watch'),
			    opacity_control = s.qs('#js-opacity-control');

			var saturation = Math.round(x / panel.clientWidth * 100),
			    lightness = Math.round((1 - y / panel.clientHeight) * 50);

			hsla.saturation = saturation + '%';
			hsla.lightness = lightness + '%';

			var queue = [watch, opacity_control];

			for (var i = 0, len = queue.length; i < len; ++i) {
				queue[i].style.background = 'hsla(' + hsla.hue + ', ' + hsla.saturation + ', ' + hsla.lightness + ', ' + hsla.alpha + ')';
			}

			console.log('hue:' + hsla.hue);
			console.log('saturation:' + hsla.saturation);
			console.log('lightness: ' + hsla.lightness);
			console.log('alpha: ' + hsla.alpha);
		}

		/* Update panel */

	}, {
		key: 'update_panel',
		value: function update_panel(hue) {
			var panel = s.qs('#js-panel'),
			    opacity_control = s.qs('#js-opacity-control');

			panel.style.background = 'hsla(' + hue + ', 100%, 50%, 1)';
			opacity_control.style.background = 'hsla(' + hue + ', 100%, 50%, 1)';
		}

		/* Update watch */

	}, {
		key: 'update_watch',
		value: function update_watch(para) {
			var watch = s.qs('#js-watch');

			var hue = para.hue,
			    saturation = para.saturation,
			    lightness = para.lightness,
			    alpha = para.alpha;


			watch.style.background = 'hsla(' + hue + ', ' + saturation + ', ' + lightness + ', ' + alpha + ')';
		}

		/* Show */

	}, {
		key: 'show',
		value: function show(cur, next) {
			var input_hex = s.qs('#js-input-hex'),
			    input_rgba = s.qs('#js-input-rgba'),
			    input_hsla = s.qs('#js-input-hsla');

			var queue = [input_hex, input_rgba, input_hsla];

			queue[cur].style.display = 'none';

			queue[next].style.display = 'block';
		}
	}]);

	return Box;
}();