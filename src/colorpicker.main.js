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

/* Setting */
let setting = {
	posX: '',
	posY: ''
};

/* Color value */
let hex = '',

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
class Selector {
	qs(selector) {
		return document.querySelector(selector)
	}
	qsAll(selector) {
		return document.querySelectorAll(selector);
	}
}

const s = new Selector();

class Main {

	/* Setting by user */
	set(para) {
		let {posX = '0px', posY = '0px'} = para;

		setting.posX = posX;
		setting.posY = posY;
	}

	/* Event handler */
	event_handler() {
		const box = new Box();

		const event_bind = function(target, type, handler) {
			target.addEventListener(type, handler);
		};

		//Append templete
		box.appendTpl();

		const trigger = s.qs('#js-colorpicker-trigger'); 

		const colorpicker = s.qs('.colorpicker'),
			      movebar = s.qs('#js-movebar'),
				    panel = s.qs('#js-panel'),
				  control = s.qs('#js-control'),
		    solid_movebar = s.qs('#js-solid-movebar'),
		  opacity_movebar = s.qs('#js-opacity-movebar'),
		      convert_btn = s.qs('#js-convert');
		
		const queue = [movebar, solid_movebar, opacity_movebar];

		//Trigger box 
		event_bind(trigger, 'click', box.appear);

		//Hide Box 
		event_bind(window, 'keydown', box.hide);

		for (var i = 0, len = queue.length; i < len; ++i) {

			//Start moving 
			event_bind(queue[i], 'mousedown', function(event) {
			    event.preventDefault();
			    this.dataset.on = 'on';
			    box.move(this, event);
			});

			//Moving
			event_bind(queue[i], 'mousemove', function(event) {
				if (this.dataset.on == 'on') {
					box.move(this, event);
				}
			});

			//Stop moving
			event_bind(queue[i], 'mouseup', function() {
				this.dataset.on = 'off';
			});
		}	

		//Moveout
		event_bind(movebar, 'mouseout', function() {
			this.dataset.on = 'off';
		});

		//Click to move 
		event_bind(panel, 'click', function(event) {
			box.move(this, event);
		});

		// event_bind(control, 'click', function(event) {
		// 	box.move(this, event);
		// });

		//Convert
		let cur = 0, next;

		event_bind(convert_btn, 'click', function() {

			if (cur == 2) {
				next = 0;
			} else {
				next = cur + 1;
			}

			box.show(cur, next);

			cur++;
		});
	}

	/* init */
	init() {
		this.event_handler();
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

	/* Append templete */
	appendTpl() {
		const templete = `
            <div class="colorpicker-panel" id="js-panel">
                <div class="colorpicker-panel-mask"></div>
                <div class="colorpicker-panel-movebar" id="js-movebar"></div>
            </div>
            <div class="colorpicker-toolbar">
                <div class="colorpicker-toolbar-tool">
                    <div class="colorpicker-screen"></div>
                    <div class="colorpicker-watch" id="js-watch"></div>
                    <div class="colorpicker-control" id="js-control">
                        <div class="colorpicker-control-solid">
                            <div class="colorpicker-control-movebar" id="js-solid-movebar"></div>
                        </div>
                        <div class="colorpicker-control-opacity" id="js-opacity-control">
                            <div class="colorpicker-control-movebar" id="js-opacity-movebar"></div>
                            <div class="colorpicker-control-opacity-mask"></div>
                        </div>
                    </div>
                </div>
                <div class="colorpicker-toolbar-input">
                    <div class="colorpicker-toolbar-input-hex" id="js-input-hex" data-show="on">
                        <input type="text">
                        <div class="colorpicker-toolbar-input-text">HEX</div>
                    </div>
                    <div class="colorpicker-toolbar-input-rgba" id="js-input-rgba" data-show="off">
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
                    <div class="colorpicker-toolbar-input-hsla" id="js-input-hsla" data-show="off">
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
                    <div class="flip" id="js-convert"></div>
                </div>
            </div>
        `;

       const script = s.qs('script');

       let colorpicker = document.createElement('div');

       colorpicker.classList.add('colorpicker');
       colorpicker.dataset.appear = 'off';
       colorpicker.innerHTML = templete;

       document.body.insertBefore(colorpicker, script);
	}

	appear() {
		const colorpicker = s.qs('.colorpicker');

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

			setTimeout(function() {
				colorpicker.style.display = 'none';
			}, 400);
		}
	}

	hide(event) {
		const colorpicker = s.qs('.colorpicker');

		if (event && event.keyCode == 27) {
			colorpicker.classList.add('fade-out');
			colorpicker.classList.remove('fade-in');
			colorpicker.dataset.appear = 'off';

			setTimeout(function() {
				colorpicker.style.display = 'none';
			}, 400);
		}
	}

	/* The movebar and control move */
	move(target, event) {
		let colorpicker = s.qs('.colorpicker'),
		          panel = s.qs('#js-panel'),
			    movebar = s.qs('#js-movebar'),
				control = s.qs('#js-control'),
		  solid_movebar = s.qs('#js-solid-movebar'),
		opacity_movebar = s.qs('#js-opacity-movebar');

		let offsetX = colorpicker.offsetLeft,
			offsetY = colorpicker.offsetTop,
	    offsetWidth = target.offsetWidth,
	   offsetHeight = target.offsetHeight,
				  x = Math.round(event.pageX - offsetX - offsetWidth / 2),
				  y = Math.round(event.pageY - offsetY - offsetHeight / 2);

		if( x < 0 ) x = 0;
		if( y < 0 ) y = 0;
		if( x > panel.clientWidth - offsetWidth ) x = panel.clientWidth - offsetWidth;
		if( y > panel.clientHeight - offsetHeight ) y = panel.clientHeight - offsetHeight;

		if (target === movebar) {
			this.animate(target, {
				top: y + 'px', 
				left: x + 'px'
			});
			this.move_picker(x, y);
		} else if (target === panel) {
			x = Math.round(event.pageX - offsetX),
			y = Math.round(event.pageY - offsetY);
	
			this.animate(movebar, {
				top: y + 'px',
				left: x + 'px'
			});
			this.move_picker(x, y);
		} else {
			offsetX = control.offsetLeft + colorpicker.offsetLeft,
				  x = Math.round(event.pageX - offsetX - offsetWidth / 2);
			
			x < -8 ? x = -8 : x;
			x > control.clientWidth - offsetWidth ? x = control.clientWidth - offsetWidth + 8 : x;

			this.animate(target, {
				left: x + 'px'
			}, function() {
				target.style.top = '-1px';
			});

			if (target === solid_movebar) {

				let hue = Math.round((1 - (x + 8) / control.clientWidth) * 360);

				hue == 360 ? hue = 0 : hue ;

				hsla.hue = hue;

				this.update_panel(hue);
				this.update_watch(hsla);

			} else {
				
				let alpha = Math.round((x + 8) / control.clientWidth * 100) / 100;

				hsla.alpha = alpha;

				this.update_watch(hsla);
			}
		}
	}

	/* Move picker */
	move_picker(x, y) {
		const panel = s.qs('#js-panel'),
		      watch = s.qs('#js-watch'),
		      opacity_control = s.qs('#js-opacity-control');

		let saturation = Math.round(x / panel.clientWidth * 100),
		     lightness = Math.round((1 - y / panel.clientHeight) * 50);

		hsla.saturation = saturation + '%';
		hsla.lightness = lightness + '%';

		let queue = [watch, opacity_control];

		for (var i = 0, len = queue.length; i < len; ++i) {
			queue[i].style.background = 'hsla(' + hsla.hue + ', ' + hsla.saturation + ', ' + hsla.lightness + ', ' + hsla.alpha + ')';
		}

		console.log('hue:' + hsla.hue);
		console.log('saturation:' + hsla.saturation);
		console.log('lightness: ' + hsla.lightness);
		console.log('alpha: ' + hsla.alpha);
	}

	/* Update panel */
	update_panel(hue) {
		const panel = s.qs('#js-panel'),
			  opacity_control = s.qs('#js-opacity-control');

		panel.style.background = 'hsla(' + hue + ', 100%, 50%, 1)';
		opacity_control.style.background = 'hsla(' + hue + ', 100%, 50%, 1)';

	}

	/* Update watch */
	update_watch(para) {
		const watch = s.qs('#js-watch');

		let {hue, saturation, lightness, alpha} = para;

		watch.style.background = 'hsla(' + hue + ', ' + saturation + ', ' + lightness + ', ' + alpha + ')';
	}

	/* Show */
	show(cur, next) {
		const input_hex = s.qs('#js-input-hex'),
			 input_rgba = s.qs('#js-input-rgba'),
		     input_hsla = s.qs('#js-input-hsla');

		let queue = [input_hex, input_rgba, input_hsla];

		queue[cur].style.display = 'none';

		queue[next].style.display = 'block';
	}
}