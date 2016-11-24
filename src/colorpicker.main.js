// import {defaults} from './colorpicker.wheel.js';
// import {screen} from './colorpicker.screen.js';

/* Converts: HSL, RGB, HEX */
const converts = {
	hsb2rgb: (hsb) => {
		let rgb = {};
		let h = Math.round(hsb.h);
		let s = Math.round(hsb.s * 255 / 100);
		let v = Math.round(hsb.b * 255 / 100);
		if(s === 0) {
		    rgb.r = rgb.g = rgb.b = v;
		} else {
		    let t1 = v;
		    let t2 = (255 - s) * v / 255;
		    let t3 = (t1 - t2) * (h % 60) / 60;
		    if( h === 360 ) h = 0;
		    if( h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
		    else if( h < 120 ) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
		    else if( h < 180 ) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
		    else if( h < 240 ) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
		    else if( h < 300 ) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
		    else if( h < 360 ) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
		    else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
		}
		return {
		    r: Math.round(rgb.r),
		    g: Math.round(rgb.g),
		    b: Math.round(rgb.b)
		};
	},	
	rgbString2hex: (rgb) => {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? '#' +
		('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
		('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
		('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}, 
	hsb2hex: (rgb) => {
		let hex = [
		    rgb.r.toString(16),
		    rgb.g.toString(16),
		    rgb.b.toString(16)
		];
		$.each(hex, function(nr, val) {
		    if (val.length === 1) hex[nr] = '0' + val;
		});
		return '#' + hex.join('');
	},
	hsb2hex: (hsb) => {
		return rgb2hex(hsb2rgb(hsb));
	},
	hex2hsb: (hex) => {
		let hsb = rgb2hsb(hex2rgb(hex));
     	if( hsb.s === 0 ) hsb.h = 360;
     	return hsb;
	},
	rgb2hsb: (rgb) => {
		let hsb = { h: 0, s: 0, b: 0 };
		let min = Math.min(rgb.r, rgb.g, rgb.b);
		let max = Math.max(rgb.r, rgb.g, rgb.b);
		let delta = max - min;
		hsb.b = max;
		hsb.s = max !== 0 ? 255 * delta / max : 0;
		if( hsb.s !== 0 ) {
		    if( rgb.r === max ) {
		        hsb.h = (rgb.g - rgb.b) / delta;
		    } else if( rgb.g === max ) {
		        hsb.h = 2 + (rgb.b - rgb.r) / delta;
		    } else {
		        hsb.h = 4 + (rgb.r - rgb.g) / delta;
		    }
		} else {
		    hsb.h = -1;
		}
		hsb.h *= 60;
		if( hsb.h < 0 ) {
		    hsb.h += 360;
		}
		hsb.s *= 100/255;
		hsb.b *= 100/255;
		return hsb;
	},
	hex2rgb: (hex) => {
		hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
		return {
		    /* jshint ignore:start */
		    r: hex >> 16,
		    g: (hex & 0x00FF00) >> 8,
		    b: (hex & 0x0000FF)
		    /* jshint ignore:end */
		};
	}
};

/* Selector */
class Selector {
	qs(selector) {
		return document.querySelector(selector)
	}
	qsAll(selector) {
		return document.querySelectorAll(selector);
	}
}

class Main {
	
	constructor() {
		this.event_handler();
	}

	/* Event handler */
	event_handler() {
		const box = new Box(),
			    s = new Selector();

		const event_bind = function(target, type, handler) {
			target.addEventListener(type, handler);
		}

		const movebar = s.qs('#js-movebar');

		//Start moving 
		event_bind(movebar, 'mousedown', function(event) {
		    event.preventDefault();
		    this.dataset.on = 'on';
		    box.move(this, event);
		});

		//Moving
		event_bind(movebar, 'mousemove', function(event) {
			if (this.dataset.on == 'on') {
				box.move(this, event);
			}
		});

		//Stop moving
		event_bind(movebar, 'mouseup', function(event) {
			// let moveList = ['mousedown', 'mousemove', 'mouseup'];

			// for (var i = 0, len = moveList.length; i < len; ++i) {
			// 	this.removeEventListener(moveList[i]);
			// }
			this.dataset.on = 'off';
		});
	}
}

class Box {
	/* Trigger to fadeIn and fadeOut */
	fade(target) {
		target.toggleClassList('fadeIn fadeOut');
	}

	/* Simple animate */
	animate(o, para, cb) {
		let {top = '0', left = '0', bottom = '0', right = '0'} = para;

	    o.style.top = top;
	    o.style.left = left;
	    o.style.bottom = bottom;
	    o.style.right = right;

	    if (!cb) {
			return;
		} 
		cb();
	}

	/* Appear */
	appear(trigger) {
		const templete = `
			<div class="colorpicker">
			    <div class="colorpicker-panel">
			        <div class="colorpicker-panel-mask"></div>
			        <div class="colorpicker-panel-movebar" id="js-movebar"></div>
			    </div>
			    <div class="colorpicker-toolbar">
			        <div class="colorpicker-toolbar-tool">
			            <div class="colorpicker-screen"></div>
			            <div class="colorpicker-watch"></div>
			            <div class="colorpicker-control">
			                <div class="colorpicker-control-solid">
			                  <input type="range" name="" value="10" min="1" max="10">
			                </div>
			                <div class="colorpicker-control-opacity">
			                  <input type="range" name="" value="10" min="1" max="10" step="1">
			                </div>
			            </div>
			        </div>
			        <div class="colorpicker-toolbar-input">
			            <div class="colorpicker-toolbar-input-hex">
			                <input type="text">
			                <div class="colorpicker-toolbar-input-text">HEX</div>
			            </div>
			            <div class="colorpicker-toolbar-input-rgba">
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">R</div>
			                </div>
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">G</div>
			                </div>
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">B</div>
			                </div>
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">A</div>
			                </div>
			            </div>
			            <div class="colorpicker-toolbar-input-hsla">
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">H</div>
			                </div>
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">S</div>
			                </div>
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">L</div>
			                </div>
			                <div class="colorpicker-toolbar-input-wrap">
			                    <input type="text">
			                    <div class="colorpicker-toolbar-input-text">A</div>
			                </div>
			            </div>
			            <div class="flip"></div>
			        </div>
			    </div>
			</div>
		`;
	}

	/* The movebar and control move */
	move(target, event) {
		const s = new Selector();

		let panel = s.qs('#js-panel');

		let offsetX = panel.offsetLeft,
			offsetY = panel.offsetTop,
	    offsetWidth = target.offsetWidth,
	   offsetHeight = target.offsetHeight,
				  x = Math.round(event.pageX - offsetX - offsetWidth / 2),
				  y = Math.round(event.pageY - offsetY- offsetHeight / 2);

		// Touch support
		// if (event.originalEvent.changedTouches) {
		// 	x = event.originalEvent.changedTouches[0].pageX - offsetX,
		// 	y = event.originalEvent.changedTouches[0].pageY - offsetY;
		// }

		if( x < 0 ) x = 0;
		if( y < 0 ) y = 0;
		if( x > panel.clientWidth - offsetWidth) x = panel.clientWidth - offsetWidth;
		if( y > panel.clientHeight - offsetHeight) y = panel.clientHeight - offsetHeight;

		if (target === s.qs('#js-movebar')) {
			this.animate(target, {
				top: y + 'px', 
				left: x + 'px'
			});
		} else {
			this.animate(target, {
				left: x + 'px'
			})
		}
	}
}
new Main();