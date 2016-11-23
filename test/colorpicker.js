/* This is a demo, use ES6 */
const 
    qs = (selector) => document.querySelector(selector),
    qsAll = (selector) => document.querySelectorAll(selector);

    function move(target) {
    	let offsetX = target.offsetLeft,
    		offsetY = target.offsetTop,
    			  x = Math.round(event.pageX - offsetX),
    			  y = Math.round(event.pageY - offsetY);

    	//Touch support
    	// if (event.originalEvent.changedTouches) {
    	// 	x = event.originalEvent.changedTouches[0].pageX - offsetX,
    	// 	y = event.originalEvent.changedTouches[0].pageY - offsetY;
    	// }

        animate(target, {
            top: y + 'px',
            left: x + 'px'
        });
    }
    function animate(o, obj, cb) {

        // let {top = '0', left = '0', bottom = '0', right = '0'} = obj; 
        let top = '0', left = '0', bottom = '0', right = '0'; 
        
        if (o.top) { top = o.top }
        else if (o.left) { left = o.left }  
        else if (o.bottom) { bottom = o.bottom } 
        else if (o.right) { right = o.right } 

        o.style.top = top;
        o.style.left = left;
        o.style.bottom = bottom;
        o.style.right = right;

        if (!cb) {
    		return;
    	} 
    	cb();
    };

    let movebar = qs('#js-movebar');

    //Handler Event 
    function event_handler() {

        let event_bind = function(target, type, handler) {
            target.addEventListener(type, handler);
        }

        // Start moving
        .on('mousedown.minicolors touchstart.minicolors', '.minicolors-grid, .minicolors-slider, .minicolors-opacity-slider', function(event) {
            var target = $(this);
            event.preventDefault();
            $(event.delegateTarget).data('minicolors-target', target);
            move(target, event, true);
        })
        // Move pickers
        .on('mousemove.minicolors touchmove.minicolors', function(event) {
            var target = $(event.delegateTarget).data('minicolors-target');
            if( target ) move(target, event);
        })
        // Stop moving
        .on('mouseup.minicolors touchend.minicolors', function() {
            $(this).removeData('minicolors-target');
        })

        //Start moving 
        event_bind('', 'mousedown', function(event) {
            event.preventDefault();
            move();
        });

        //Move pickers
        event_bind('', 'mousemove', function(event) {

        });

        //Stop moving
        event_bind('', 'mouseup', function(event) {

        });
    }

    // function move(target, event, animate) {

    //     var input = target.parents('.minicolors').find('.minicolors-input'),
    //         settings = input.data('minicolors-settings'),
    //         picker = target.find('[class$=-picker]'),
    //         offsetX = target.offset().left,
    //         offsetY = target.offset().top,
    //         x = Math.round(event.pageX - offsetX),
    //         y = Math.round(event.pageY - offsetY),
    //         duration = animate ? settings.animationSpeed : 0,
    //         wx, wy, r, phi;

    //     // Touch support
    //     if( event.originalEvent.changedTouches ) {
    //         x = event.originalEvent.changedTouches[0].pageX - offsetX;
    //         y = event.originalEvent.changedTouches[0].pageY - offsetY;
    //     }

        // Constrain picker to its container
        // if ( x < 0 ) x = 0;
        // if ( y < 0 ) y = 0;
        // if ( x > target.clientWidth ) x = target.clientWidth;
        // if ( y > target.clientHeight ) y = target.clientHeight;

        // Constrain color wheel values to the wheel
        // if( target.parent().is('.minicolors-slider-wheel') && picker.parent().is('.minicolors-grid') ) {
        //     wx = 75 - x;
        //     wy = 75 - y;
        //     r = Math.sqrt(wx * wx + wy * wy);
        //     phi = Math.atan2(wy, wx);
        //     if( phi < 0 ) phi += Math.PI * 2;
        //     if( r > 75 ) {
        //         r = 75;
        //         x = 75 - (75 * Math.cos(phi));
        //         y = 75 - (75 * Math.sin(phi));
        //     }
        //     x = Math.round(x);
        //     y = Math.round(y);
        // }

        // Move the picker
    //     if( target.is('.minicolors-grid') ) {
    //         picker
    //             .stop(true)
    //             .animate({
    //                 top: y + 'px',
    //                 left: x + 'px'
    //             }, duration, settings.animationEasing, function() {
    //                 updateFromControl(input, target);
    //             });
    //     } else {
    //         picker
    //             .stop(true)
    //             .animate({
    //                 left: x + 'px'
    //             }, duration, settings.animationEasing, function() {
    //                 updateFromControl(input, target);
    //             });
    //     }

    // }

    //Converts an HSL object to an RGB object
    function hsl2rgb(hsl) {

    }

    // Converts an HSB object to an RGB object
     function hsb2rgb(hsb) {
         var rgb = {};
         var h = Math.round(hsb.h);
         var s = Math.round(hsb.s * 255 / 100);
         var v = Math.round(hsb.b * 255 / 100);
         if(s === 0) {
             rgb.r = rgb.g = rgb.b = v;
         } else {
             var t1 = v;
             var t2 = (255 - s) * v / 255;
             var t3 = (t1 - t2) * (h % 60) / 60;
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
     }

     // Converts an RGB string to a hex string
     function rgbString2hex(rgb){
         rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
         return (rgb && rgb.length === 4) ? '#' +
         ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
     }

     // Converts an RGB object to a hex string
     function rgb2hex(rgb) {
         var hex = [
             rgb.r.toString(16),
             rgb.g.toString(16),
             rgb.b.toString(16)
         ];
         $.each(hex, function(nr, val) {
             if (val.length === 1) hex[nr] = '0' + val;
         });
         return '#' + hex.join('');
     }

     // Converts an HSB object to a hex string
     function hsb2hex(hsb) {
         return rgb2hex(hsb2rgb(hsb));
     }

     // Converts a hex string to an HSB object
     function hex2hsb(hex) {
         var hsb = rgb2hsb(hex2rgb(hex));
         if( hsb.s === 0 ) hsb.h = 360;
         return hsb;
     }

     // Converts an RGB object to an HSB object
     function rgb2hsb(rgb) {
         var hsb = { h: 0, s: 0, b: 0 };
         var min = Math.min(rgb.r, rgb.g, rgb.b);
         var max = Math.max(rgb.r, rgb.g, rgb.b);
         var delta = max - min;
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
     }

     // Converts a hex string to an RGB object
     function hex2rgb(hex) {
         hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
         return {
             /* jshint ignore:start */
             r: hex >> 16,
             g: (hex & 0x00FF00) >> 8,
             b: (hex & 0x0000FF)
             /* jshint ignore:end */
         };
     }