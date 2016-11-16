'use strict';

var _colorpickerWheel = require('./colorpicker.wheel.js');

var _colorpickerScreen = require('./colorpicker.screen.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
                                                                                                                                                           *	colorpicker.main.js
                                                                                                                                                           *	mnichangxin 2016/11/16 weixin:lichangxin678
                                                                                                                                                           */

var Main = function Main() {
  _classCallCheck(this, Main);
};

// class Define {
// 	define(factory) {
// 		/* jshint ignore:start */
// 		if (typeof define === 'function' && define.amd) {
// 		    // AMD. Register as an anonymous module.
// 		    define(['jquery'], factory);
// 		} else if (typeof exports === 'object') {
// 		    // Node/CommonJS
// 		    module.exports = factory(require('jquery'));
// 		} else if (typeof export == 'object') {
// 			//ES6
// 			export {main};
// 		} else {
// 		    // Browser globals
// 		    factory(jQuery);
// 		}
// 		/* jshint ignore:end */
// 	}
// }

new Main();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var screen = 2;

exports.screen = screen;
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/*
 *	colorpicker.wheel.js
 *	mnichangxin 2016/11/16 weixin:lichangxin678
 */

var defaults = {
	animationSpeed: 50,
	animationEasing: 'swing',
	change: null,
	changeDelay: 0,
	control: 'hue',
	dataUris: true,
	defaultValue: '',
	format: 'hex',
	hide: null,
	hideSpeed: 100,
	inline: false,
	keywords: '',
	letterCase: 'lowercase',
	opacity: false,
	position: 'bottom left',
	show: null,
	showSpeed: 100,
	theme: 'default',
	swatches: []
};

exports.defaults = defaults;