// import {defaults} from './colorpicker.wheel.js';
// import {screen} from './colorpicker.screen.js';
// import { SeeColors } from './SeeColors/seeColors.js';

/* Setting */
let setting = {
	posX: '',
	posY: ''
};

/* Color value */
let hsla = {
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
class Selector {
	qs(selector) {
		return document.querySelector(selector);
	}
	qsAll(selector) {
		return document.querySelectorAll(selector);
	}
}

const s = new Selector();

/* Color */
class Color {
	constructor(color) {

		this.rgb = [];
		this.hex = [];
		this.hsl = [];

		let match = null;

		if (/^\D*(\d{1,3})[^°\d]+(\d{1,3})[^%\d]+(\d{1,3})\D*$/.test(color)) {
		    for (let i = 0; i < 3; i++) {
		        this.rgb[i] = RegExp['$' + (i + 1)] - 0;
		        if (this.rgb[i] > 255) {
		            this.rgb = [];
		            break;
		        }
		    }
		} else if (match = /^\s*#?([0-9a-f]{3}([0-9a-f]{3})?)\s*$/i.exec(color)) {

		    let hex = match[1],
		        len = hex.length / 3,
		        index;

		    for (let i = 0; i < hex.length; i += len) {

		        let block = hex.substr(i, len);

		        if (len == 1) {
		            block += block;   
		        }

		        index = i / len;
		        this.hex[index] = block;
		        this.rgb[index] = parseInt(block, 16);
		    }
		} else if (/^\D*(\d+)\D+(\d+(\.\d+)?)%\D+(\d+(\.\d+)?)%\D*$/.test(color)) {

		    let h = RegExp.$1 - 0,
		        s = RegExp.$2 - 0,
		        l = RegExp.$4 - 0;

		    if (h <= 360 && s <= 100 && l <= 100) {
		        this.hsl = [h, s, l];

		        h /= 360,
		        s /= 100,
		        l /= 100;

		        if (s == 0) {
		            let r = g = b = Math.ceil(l * 255);
		            this.rgb = [r, g, b];
		        } else {
		            let t2 = l >= 0.5 ? l + s - l * s : l * (1 + s);
		            let t1 = 2 * l - t2;
		            let tempRGB = [1 / 3, 0, -1 / 3];
		            for (let i = 0; i < 3; i++) {
		                let t = h + tempRGB[i];
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
		                tempRGB[i] = Math.ceil(t * 255);
		            }
		            this.rgb = tempRGB;
		        }
		    }
		}
	}

	toString(style) {

		let str = '';

		if (style) {
		    style = style.toLowerCase();   
		}

		switch (style) {

		    case 'hex':
		        if (this.hex.length != 3 && this.rgb.length == 3) {
		            for (let i = 0; i < this.rgb.length; i++) {
		                let ch = this.rgb[i].toString(16);
		                if (ch.length == 1) ch = '0' + ch;
		                this.hex[i] = ch;
		            }
		        }
		       	if (this.hex.length == 3) 
		       		return '#' + this.hex[0] + this.hex[1] + this.hex[2]; 
		        break;

		    case 'hsl':
		        if (this.hsl.length != 3 && this.rgb.length == 3) {
		            let h, s, l;
		            let r = this.rgb[0] / 255,
		                g = this.rgb[1] / 255,
		                b = this.rgb[2] / 255;
		            let max = Math.max(r, g, b);
		            let min = Math.min(r, g, b);
		            l = (max + min) / 2;
		            let diff = max - min;
		            s = diff == 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

		            if (s == 0) {
		                h = 0;
		            } else if (r == max) {
		                h = (g - b) / diff % 6;
		            } else if (g == max) {
		                h = (b - r) / diff + 2;
		            } else {
		                h = (r - g) / diff + 4;
		            }

		            h *= 60;
		            if (h < 0) h += 360;
		            this.hsl = [Math.round(h), (s * 100).toFixed(1), (l * 100).toFixed(1)];
		        }
		        if (this.hsl.length == 3) 
		            return {
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
}

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
		
		const hexInput = s.qs('#js-input-hex input'),
			  rgbaInput = s.qsAll('#js-input-rgba input'),
			  hslaInput = s.qsAll('#js-input-hsla input');

		const seeBtn = s.qs('#colorpicker-seeColors');

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

		//Convert
		let cur = 0, next;

		event_bind(convert_btn, 'click', function() {

			cur == 2 ? next = 0 : next = cur + 1;

			box.show(cur, next);

			cur == 2 ? cur = -1 : cur;

			cur++;
		});

		//Input Change bind
		event_bind(hexInput, 'input', function() {

			let hex = this.value;

			let color = new Color(hex);

			let hsl = color.toString('hsl');

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

		for (let i = 0; i < 4; ++i) {
			event_bind(rgbaInput[i], 'input', function() {

				if (i == 0) {
					rgba.r = this.value;
				} else if (i == 1) {
					rgba.g = this.value;
				} else if (i == 2) {
					rgba.b = this.value;
				} else {
					rgba.a = this.value;
				}

				let color = new Color('rgb(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ')');

				let hsl = color.toString('hsl');

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

			event_bind(hslaInput[i], 'input', function() {
				
				if (i == 0) {
					hsla.hue = this.value;
				} else if (i == 1) {
					hsla.saturation = this.value;
				} else if (i == 2) {
					hsla.lightness = this.value;
				} else {
					hsla.alpha = this.value;
				}

				let color = new Color('hsl(' + hsla.hue + ',' + hsla.saturation + ', ' + hsla.lightness + ')');

				let hsl = color.toString('hsl');

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

			//SeeColor bind
			event_bind(seeBtn, 'click', function() {
				new SeeColors('body').then(obj => {
					console.log(obj);
				});
			});

		}
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
                    <div class="colorpicker-screen" id="colorpicker-seeColors"></div>
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
                        <input type="text" value="#fff">
                        <div class="colorpicker-toolbar-input-text">HEX</div>
                    </div>
                    <div class="colorpicker-toolbar-input-rgba" id="js-input-rgba" data-show="off">
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="255">
                            <div class="colorpicker-toolbar-input-text">R</div>
                        </div>
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="255">
                            <div class="colorpicker-toolbar-input-text">G</div>
                        </div>
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="255">
                            <div class="colorpicker-toolbar-input-text">B</div>
                        </div>
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="1">
                            <div class="colorpicker-toolbar-input-text">A</div>
                        </div>
                    </div>
                    <div class="colorpicker-toolbar-input-hsla" id="js-input-hsla" data-show="off">
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="0">
                            <div class="colorpicker-toolbar-input-text">H</div>
                        </div>
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="0%">
                            <div class="colorpicker-toolbar-input-text">S</div>
                        </div>
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="100%">
                            <div class="colorpicker-toolbar-input-text">L</div>
                        </div>
                        <div class="colorpicker-toolbar-input-wrap">
                            <input type="text" value="1">
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

				hue == 360 ? hue = 0 : hue;

				hsla.hue = hue;

				this.update_panel(hue);
				this.update_watch(hsla);
				this.update_input(hsla);

			} else {
				
				let alpha = Math.round((x + 8) / control.clientWidth * 100) / 100;

				hsla.alpha = alpha;

				this.update_watch(hsla);
				this.update_input(hsla);
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

		this.update_input(hsla);
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

	/* Update input */
	update_input(para) {
		const input_hex = s.qs('#js-input-hex input'),
			 input_rgba = s.qsAll('#js-input-rgba input'),
		     input_hsla = s.qsAll('#js-input-hsla input');

		let color = new Color('hsl(' + para.hue + ', ' + para.saturation + ', ' + para.lightness + ')');
		
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
	show(cur, next) {
		const hex = s.qs('#js-input-hex'),
			 rgba = s.qs('#js-input-rgba'),
		     hsla = s.qs('#js-input-hsla');

		let queue = [hex, rgba, hsla];

		queue[cur].style.display = 'none';

		queue[next].style.display = 'block';
	}

	/* Change update */
	update_change() {
		const panel = s.qs('#js-panel'),
			movebar = s.qs('#js-movebar'),
			control = s.qs('#js-control'),
			solid_movebar = s.qs('#js-solid-movebar'),
			opacity_movebar = s.qs('#js-opacity-movebar'),
			watch = s.qs('#js-watch');

		const offsetWidth = panel.offsetWidth,
		     offsetHeight = panel.offsetHeight,
		     movebarWidth = movebar.offsetWidth / 2,
		     controlWidth = control.offsetWidth,
		     controlBarWidth = solid_movebar.offsetWidth / 2;


		//upadate movebar and background

		let offsetX = offsetWidth * parseInt(hsla.saturation.split('%')[0]) / 100 - movebarWidth,
			offsetY = offsetHeight * (100 - parseInt(hsla.lightness.split('%')[0])) / 100 - movebarWidth;

		panel.style.background = 'hsl(' + hsla.hue + ', ' + hsla.saturation + ', ' + hsla.lightness + ')';

		movebar.style.left = offsetX + 'px';
		movebar.style.top = offsetY + 'px';


		//update control bar

		let offsetX1 = controlWidth * parseInt(hsla.hue) / 360 - controlBarWidth;   

		solid_movebar.style.left = offsetX1 + 'px'; 

		let offsetX2 = controlWidth * parseInt(hsla.alpha * 100) / 100 - controlBarWidth;

		opacity_movebar.style.left = offsetX2 + 'px';


		//update watch 

		watch.style.background = 'hsla(' + hsla.hue + ', ' + hsla.saturation + ', ' + hsla.lightness + ',' + hsla.alpha + ')';

	}
}