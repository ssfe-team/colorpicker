'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import {defaults} from './colorpicker.wheel.js';
// import {screen} from './colorpicker.screen.js';

/* Converts: HSL, RGB, HEX */
var converts = {
	hsl2rgb: function hsl2rgb(hsl) {}
};

/* Setting */
var setting = {
	posX: '',
	posY: ''
};

/* Color value */
var hsla = {
	hue: '0',
	saturation: '100%',
	lightness: '50%',
	alpha: '1'
},
    rgba = {
	r: '255',
	g: '255',
	b: '255',
	a: '1'
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

/* Color */

var Color = function () {
	function Color(color) {
		_classCallCheck(this, Color);

		this.rgb = [];
		this.hex = [];
		this.hsl = [];

		var match = null;

		if (/^\D*(\d{1,3})[^°\d]+(\d{1,3})[^%\d]+(\d{1,3})\D*$/.test(color)) {
			for (var i = 0; i < 3; i++) {
				this.rgb[i] = RegExp['$' + (i + 1)] - 0;
				if (this.rgb[i] > 255) {
					this.rgb = [];
					break;
				}
			}
		} else if (match = /^\s*#?([0-9a-f]{3}([0-9a-f]{3})?)\s*$/i.exec(color)) {

			var hex = match[1],
			    len = hex.length / 3,
			    index = void 0;

			for (var _i = 0; _i < hex.length; _i += len) {

				var block = hex.substr(_i, len);

				if (len == 1) {
					block += block;
				}

				index = _i / len;
				this.hex[index] = block;
				this.rgb[index] = parseInt(block, 16);
			}
		} else if (/^\D*(\d+)\D+(\d+(\.\d+)?)%\D+(\d+(\.\d+)?)%\D*$/.test(color)) {

			var h = RegExp.$1 - 0,
			    _s = RegExp.$2 - 0,
			    l = RegExp.$4 - 0;

			if (h <= 360 && _s <= 100 && l <= 100) {
				this.hsl = [h, _s, l];

				h /= 360, _s /= 100, l /= 100;

				if (_s == 0) {
					var r = g = b = Math.ceil(l * 255);
					this.rgb = [r, g, b];
				} else {
					var t2 = l >= 0.5 ? l + _s - l * _s : l * (1 + _s);
					var t1 = 2 * l - t2;
					var tempRGB = [1 / 3, 0, -1 / 3];
					for (var _i2 = 0; _i2 < 3; _i2++) {
						var t = h + tempRGB[_i2];
						if (t < 0) t += 1;
						if (t > 1) t -= 1;
						if (6 * t < 1) {
							t = t1 + (t2 - t1) * 6 * t;
						} else if (2 * t < 1) {
							t = t2;
						} else if (3 * t < 2) {
							t = t1 + (t2 - t1) * (2 / 3 - t) * 6;
						} else {
							t = t1;
						}
						tempRGB[_i2] = Math.ceil(t * 255);
					}
					this.rgb = tempRGB;
				}
			}
		}
	}

	_createClass(Color, [{
		key: 'toString',
		value: function toString(style) {

			var str = '';

			if (style) {
				style = style.toLowerCase();
			}

			switch (style) {

				case 'hex':
					if (this.hex.length != 3 && this.rgb.length == 3) {
						for (var i = 0; i < this.rgb.length; i++) {
							var ch = this.rgb[i].toString(16);
							if (ch.length == 1) ch = '0' + ch;
							this.hex[i] = ch;
						}
					}
					if (this.hex.length == 3) return '#' + this.hex[0] + this.hex[1] + this.hex[2];
					break;

				case 'hsl':
					if (this.hsl.length != 3 && this.rgb.length == 3) {
						var h = void 0,
						    _s2 = void 0,
						    l = void 0;
						var r = this.rgb[0] / 255,
						    _g = this.rgb[1] / 255,
						    _b = this.rgb[2] / 255;
						var max = Math.max(r, _g, _b);
						var min = Math.min(r, _g, _b);
						l = (max + min) / 2;
						var diff = max - min;
						_s2 = diff == 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

						if (_s2 == 0) {
							h = 0;
						} else if (r == max) {
							h = (_g - _b) / diff % 6;
						} else if (_g == max) {
							h = (_b - r) / diff + 2;
						} else {
							h = (r - _g) / diff + 4;
						}

						h *= 60;
						if (h < 0) h += 360;
						this.hsl = [Math.round(h), (_s2 * 100).toFixed(1), (l * 100).toFixed(1)];
					}
					if (this.hsl.length == 3) return {
						h: this.hsl[0],
						s: this.hsl[1] + '%',
						l: this.hsl[2] + '%'
					};
					break;

				case 'rgb':

				default:
					if (this.rgb.length == 3) {
						return {
							r: this.rgb[0],
							g: this.rgb[1],
							b: this.rgb[2]
						};
					}
					break;
			}
		}
	}]);

	return Color;
}();

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

			var hexInput = s.qs('#js-input-hex input'),
			    rgbaInput = s.qsAll('#js-input-rgba input'),
			    hslaInput = s.qsAll('#js-input-hsla input');

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

			//Convert
			var cur = 0,
			    next = void 0;

			event_bind(convert_btn, 'click', function () {

				cur == 2 ? next = 0 : next = cur + 1;

				box.show(cur, next);

				cur == 2 ? cur = -1 : cur;

				cur++;
			});

			//Input Change
			// let temp = '';

			event_bind(hexInput, 'input', function () {

				var hex = this.value;

				var color = new Color(hex);

				var hsl = color.toString('hsl');

				if (hsl) {
					hsla.hue = hsl.h;
					hsla.saturation = hsl.s;
					hsla.lightness = hsl.l;

					box.update_change();
				}
			});

			// event_bind(hexInput, 'focus', function() {
			// 	temp = this.value;
			// });

			var _loop = function _loop(_i3) {
				event_bind(rgbaInput[_i3], 'input', function () {

					if (_i3 == 0) {
						rgba.r = this.value;
					} else if (_i3 == 1) {
						rgba.g = this.value;
					} else if (_i3 == 2) {
						rgba.b = this.value;
					} else {
						rgba.a = this.value;
					}

					var color = new Color('rgb(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ')');

					var hsl = color.toString('hsl');

					if (hsl) {
						hsl.hue = hsl.h;
						hsla.saturation = hsl.s;
						hsla.lightness = hsl.l;
						hsla.alpha = rgba.a;

						console.log(hsla);
						console.log(rgba);

						box.update_change();
					}
				});

				event_bind(hslaInput[_i3], 'input', function () {

					if (_i3 == 0) {
						hsla.hue = this.value;
					} else if (_i3 == 1) {
						hsla.saturation = this.value;
					} else if (_i3 == 2) {
						hsla.lightness = this.value;
					} else {
						hsla.alpha = this.value;
					}

					var color = new Color('hsl(' + hsla.hue + ',' + hsla.saturation + ', ' + hsla.lightness + ')');

					var hsl = color.toString('hsl');

					if (hsl) {
						hsla.hue = hsl.h;
						hsla.saturation = hsl.s;
						hsla.lightness = hsl.l;

						box.update_change();
					}
				});

				// event_bind(rgbaInput[i], 'focus', function() {
				// 	temp = this.value;
				// });

				// event_bind(hslaInput[i], 'focus', function() {
				// 	temp = this.value;
				// });
			};

			for (var _i3 = 0; _i3 < 4; ++_i3) {
				_loop(_i3);
			}
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
			var templete = '\n            <div class="colorpicker-panel" id="js-panel">\n                <div class="colorpicker-panel-mask"></div>\n                <div class="colorpicker-panel-movebar" id="js-movebar"></div>\n            </div>\n            <div class="colorpicker-toolbar">\n                <div class="colorpicker-toolbar-tool">\n                    <div class="colorpicker-screen"></div>\n                    <div class="colorpicker-watch" id="js-watch"></div>\n                    <div class="colorpicker-control" id="js-control">\n                        <div class="colorpicker-control-solid">\n                            <div class="colorpicker-control-movebar" id="js-solid-movebar"></div>\n                        </div>\n                        <div class="colorpicker-control-opacity" id="js-opacity-control">\n                            <div class="colorpicker-control-movebar" id="js-opacity-movebar"></div>\n                            <div class="colorpicker-control-opacity-mask"></div>\n                        </div>\n                    </div>\n                </div>\n                <div class="colorpicker-toolbar-input">\n                    <div class="colorpicker-toolbar-input-hex" id="js-input-hex" data-show="on">\n                        <input type="text" value="#fff">\n                        <div class="colorpicker-toolbar-input-text">HEX</div>\n                    </div>\n                    <div class="colorpicker-toolbar-input-rgba" id="js-input-rgba" data-show="off">\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="255">\n                            <div class="colorpicker-toolbar-input-text">R</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="255">\n                            <div class="colorpicker-toolbar-input-text">G</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="255">\n                            <div class="colorpicker-toolbar-input-text">B</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="1">\n                            <div class="colorpicker-toolbar-input-text">A</div>\n                        </div>\n                    </div>\n                    <div class="colorpicker-toolbar-input-hsla" id="js-input-hsla" data-show="off">\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="0">\n                            <div class="colorpicker-toolbar-input-text">H</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="0%">\n                            <div class="colorpicker-toolbar-input-text">S</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="100%">\n                            <div class="colorpicker-toolbar-input-text">L</div>\n                        </div>\n                        <div class="colorpicker-toolbar-input-wrap">\n                            <input type="text" value="1">\n                            <div class="colorpicker-toolbar-input-text">A</div>\n                        </div>\n                    </div>\n                    <div class="flip" id="js-convert"></div>\n                </div>\n            </div>\n        ';

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
					this.update_input(hsla);
				} else {

					var alpha = Math.round((x + 8) / control.clientWidth * 100) / 100;

					hsla.alpha = alpha;

					this.update_watch(hsla);
					this.update_input(hsla);
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

			this.update_input(hsla);
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

		/* Update input */

	}, {
		key: 'update_input',
		value: function update_input(para) {
			var input_hex = s.qs('#js-input-hex input'),
			    input_rgba = s.qsAll('#js-input-rgba input'),
			    input_hsla = s.qsAll('#js-input-hsla input');

			var color = new Color('hsl(' + para.hue + ', ' + para.saturation + ', ' + para.lightness + ')');

			input_hex.value = color.toString('hex');

			rgba.r = input_rgba[0].value = color.toString('rgb').r;
			rgba.b = input_rgba[1].value = color.toString('rgb').g;
			rgba.b = input_rgba[2].value = color.toString('rgb').b;
			rgba.a = input_rgba[3].value = para.alpha;

			input_hsla[0].value = para.hue;
			input_hsla[1].value = para.saturation;
			input_hsla[2].value = para.lightness;
			input_hsla[3].value = para.alpha;
		}

		/* Show */

	}, {
		key: 'show',
		value: function show(cur, next) {
			var hex = s.qs('#js-input-hex'),
			    rgba = s.qs('#js-input-rgba'),
			    hsla = s.qs('#js-input-hsla');

			var queue = [hex, rgba, hsla];

			queue[cur].style.display = 'none';

			queue[next].style.display = 'block';
		}

		/* Change update */

	}, {
		key: 'update_change',
		value: function update_change() {
			var panel = s.qs('#js-panel'),
			    movebar = s.qs('#js-movebar'),
			    control = s.qs('#js-control'),
			    solid_movebar = s.qs('#js-solid-movebar'),
			    opacity_movebar = s.qs('#js-opacity-movebar'),
			    watch = s.qs('#js-watch');

			var offsetWidth = panel.offsetWidth,
			    offsetHeight = panel.offsetHeight,
			    movebarWidth = movebar.offsetWidth / 2;
			controlWidth = control.offsetWidth, controlBarWidth = sodil_movebar.offsetWidth / 2;

			//upadate movebar and background

			var offsetX = offsetWidth * parseInt(hsla.saturation.split('%')[0]) / 100 - movebarWidth,
			    offsetY = offsetHeight * (100 - parseInt(hsla.lightness.split('%')[0])) / 100 - movebarWidth;

			panel.style.background = 'hsl(' + hsla.hue + ', ' + hsla.saturation + ', ' + hsla.lightness + ')';

			movebar.style.left = offsetX + 'px';
			movebar.style.top = offsetY + 'px';

			//update control bar

			var offsetX1 = controlWidth * parseInt(hsla.hue.split('%')[0]) / 360 - controlBarWidth;

			solid_movebar.style.left = offsetX1 + 'px';

			var offsetX2 = controlWidth * parseInt(hsla.alpha) - controlBarWidth;

			opacity_movebar.style.left = offsetX2 + 'px';

			//update watch 

			watch.style.background = 'hsla(' + hsla.hue + ', ' + hsla.saturation + ', ' + hsla.lightness + ',' + hsla.alpha + ')';
		}
	}]);

	return Box;
}();