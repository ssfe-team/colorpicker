/**
 * Created by suti on 2017/5/5.
 */
(function ( global, factory ) {

  'use strict';

  // export as AMD...
  if ( typeof define !== 'undefined' && define.amd ) {
    define('colorPicker', [ './seeColors' ], factory );
  }

  // ...or as browserify
  else if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = factory( require( './seeColors' ));
  }

  global.colorPicker = factory( global.SeeColors );

}( typeof window !== 'undefined' ? window : this, function ( SeeColors ) {

  const _tpl= `
    <div class="ss-function-colorPicker">
      <div class="ss-function-colorPicker-panel">
        <div class="ss-function-colorPicker-panel-wheel">
          <div class="wheel-selector"></div>
        </div>
        <div class="ss-function-colorPicker-panel-slider">
          <div class="slider-selector"></div>
        </div>
      </div>
      <div class="ss-function-colorPicker-colors">
        <div class="color-picker"></div>
        <input type="text" class="color-input">
      </div>
      <div class="ss-function-colorPicker-confirm">
        <span class="cancel">取消</span>
        <span class="confirm">确定</span>
      </div>
    </div>`;
  const _ct=(()=>{
    return{
      fixHSB(hsb) {
        return {
          h: Math.min(360, Math.max(0, hsb.h)),
          s: Math.min(100, Math.max(0, hsb.s)),
          b: Math.min(100, Math.max(0, hsb.b))
        };
      },
      fixRGB(rgb) {
        return {
          r: Math.min(255, Math.max(0, rgb.r)),
          g: Math.min(255, Math.max(0, rgb.g)),
          b: Math.min(255, Math.max(0, rgb.b))
        };
      },
      fixHex(hex) {
        let len = 6 - hex.length;
        if (len > 0) {
          let o = [];
          for (let i=0; i<len; i++) {
            o.push('0');
          }
          o.push(hex);
          hex = o.join('');
        }
        return hex;
      },
      HexToRGB(hex) {
        hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
      },
      HexToHSB(hex) {
        return this.RGBToHSB(this.HexToRGB(hex));
      },
      RGBToHSB(rgb) {
        let hsb = {
          h: 0,
          s: 0,
          b: 0
        };
        let min = Math.min(rgb.r, rgb.g, rgb.b);
        let max = Math.max(rgb.r, rgb.g, rgb.b);
        let delta = max - min;
        hsb.b = max;
        if (max != 0) {

        }
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
          if (rgb.r == max) {
            hsb.h = (rgb.g - rgb.b) / delta;
          } else if (rgb.g == max) {
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
        hsb.s *= 100/255;
        hsb.b *= 100/255;
        return hsb;
      },
      HSBToRGB(hsb) {
        let rgb = {};
        let h = Math.round(hsb.h);
        let s = Math.round(hsb.s*255/100);
        let v = Math.round(hsb.b*255/100);
        if(s == 0) {
          rgb.r = rgb.g = rgb.b = v;
        } else {
          let t1 = v;
          let t2 = (255-s)*v/255;
          let t3 = (t1-t2)*(h%60)/60;
          if(h==360) h = 0;
          if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
          else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
          else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
          else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
          else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
          else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
          else {rgb.r=0; rgb.g=0;	rgb.b=0}
        }
        return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
      },
      RGBToHex (rgb) {
        let hex = [
          rgb.r.toString(16),
          rgb.g.toString(16),
          rgb.b.toString(16)
        ];
        Array.prototype.map.call(hex, function (val, nr) {
          if (val.length == 1) {
            hex[nr] = '0' + val;
          }
        });
        return hex.join('');
      },
      HSBToHex(hsb) {
        return this.RGBToHex(this.HSBToRGB(hsb));
      },
    }
  })()

  class ColorPicker{
    constructor(color){
      let tpl=this.build(),
        node=document.body
      node.appendChild(tpl)
      this._d_=node.querySelector('.ss-function-colorPicker')
      this._ob_()
      this.event()
	    if(color){this.curHsb=_ct.HexToHSB(color)}
    }

    getColor(fn){
      this.fn=fn
    }

    setColor(color){
      this.curHsb=_ct.HexToHSB(color);
    }

    build(){
      let t=document.createElement('div')
      t.innerHTML=_tpl
      this._f=document.createDocumentFragment()
      this._f.appendChild(t.childNodes[0])
      return t.childNodes[0]
    }

    updateSVG(svg,position){
      this.svg=svg
      this.svgPos=position||{}
    }

    _ob_(){
      this.define(this,'curHsb',this.curHsbCtrl)
      this.define(this,'wheelPos',this.setWheelPos)
      this.define(this,'sliderPosX',this.setSliderPosX)
    }

    curHsbCtrl(){
      this.computeSliderPosX()
      this.computeWheelPos()
      this.setSliderBgColor()
      this._d_.querySelector('.ss-function-colorPicker-colors .color-input').value='#'+_ct.HSBToHex(this.curHsb);
      this.fn&&this.fn(_ct.HSBToHex(this.curHsb));
    }

    event(){
      this._d_.addEventListener('mousemove',e=>{
        this.getPosition(e)
      })
      this._d_.addEventListener('mouseup',e=>{
        this.wheelSet=false
        this.sliderSet=false
      })
      this._d_.addEventListener('mouseleave',e=>{
        this.wheelSet=false
        this.sliderSet=false
      })
      this._d_.querySelector('.ss-function-colorPicker-panel-wheel').addEventListener('mousedown',e=>{
        this.wheelSet=true
        this.getPosition(e)
      })
      this._d_.querySelector('.ss-function-colorPicker-panel-slider').addEventListener('mousedown',e=>{
        this.sliderSet=true
        this.getPosition(e)
      })
      this._d_.querySelector('.ss-function-colorPicker-colors .color-input').addEventListener('input',e=>{
        if(e.target.value===''||e.target.value.substring(0,1)!=='#') e.target.value='#'
        if(e.target.value.substring(0,1)==='#')
          if(e.target.value.length<7) return
        let hex=_ct.fixHex(e.target.value.substring(1,7))
        this.curHsb=_ct.HexToHSB(hex)
      })
      this._d_.querySelector('.ss-function-colorPicker-colors .color-picker').addEventListener('click',e=>{
        new SeeColors(this.svg,null,e=>{
          this.curHsb=_ct.RGBToHSB(e)
        }).then(e=>{
          this.curHsb=_ct.RGBToHSB(e.rgbaColor)
        })
      })
    }

    getPosition(e){
      if(this.wheelSet){
        if(!e.target.classList.contains('ss-function-colorPicker-panel-wheel')) return
        let hsb={},x,y,r,phi
        x=75-e.offsetX
        y=75-e.offsetY
        r = Math.sqrt(x * x + y * y)
        phi = Math.atan2(y, x)
        if( phi < 0 ) phi += Math.PI * 2
        if( r > 75 ) {
          r = 75;
          this.wheelPos={
            x:69 - (75 * Math.cos(phi)),
            y:69 - (75 * Math.sin(phi))
          }
        }
        hsb.s = keepWithin(r / 0.75, 0, 100)
        hsb.h = keepWithin(phi * 180 / Math.PI, 0, 360)
        hsb.b = keepWithin(100 - Math.floor((this.sliderPosX===undefined?0:this.sliderPosX) * (100 / 150)), 0, 100)
        this.curHsb=hsb
      }else if(this.sliderSet){
        if(!e.target.classList.contains('ss-function-colorPicker-panel-slider')) return
        let hsb={},x
        x=e.offsetX+1
        hsb.s = this.curHsb.s
        hsb.h = this.curHsb.h
        hsb.b = keepWithin(100 - Math.floor(x * (100 / 150)), 0, 100)
        this.sliderPosX=e.offsetX
        this.curHsb=hsb
      }
    }

    computeWheelPos(){
      let phi=this.curHsb.h*Math.PI/180,
        r=this.curHsb.s*0.75
      this.wheelPos={
        x:69 - (r * Math.cos(phi)),
        y:69 - (r * Math.sin(phi))
      }
    }

    computeSliderPosX(){
      this.sliderPosX=(100-this.curHsb.b)*1.5
    }

    setWheelPos(){
      let w=this._d_.querySelector('.ss-function-colorPicker-panel-wheel>.wheel-selector')
      w.style.top=this.wheelPos.y+'px'
      w.style.left=this.wheelPos.x+'px'
    }

    setSliderPosX(){
      let w=this._d_.querySelector('.ss-function-colorPicker-panel-slider>.slider-selector')
      w.style.left=this.sliderPosX-5+'px'
    }

    setSliderBgColor(){
      let s=this._d_.querySelector('.ss-function-colorPicker-panel-slider>.slider-selector'),
        ss=this._d_.querySelector('.ss-function-colorPicker-panel-slider'),
        hsb={
          h:this.curHsb.h,
          s:this.curHsb.s,
          b:100
        }
      ss.style.backgroundColor='#'+_ct.HSBToHex(hsb)
      s.style.backgroundColor='#'+_ct.HSBToHex(this.curHsb)
    }

    define(obj,key,fc){
      let val,_this=this
      Object.defineProperty(obj,key,{
        enumerable: true,
        configurable: true,
        get: ()=>val,
        set:newVal=> {
          var value =  val
          if (newVal === value) {
            return
          }
          val = newVal
          fc.call(_this)
        }
      })
    }

  }

  function keepWithin(value, min, max) {
    if( value < min ) value = min
    if( value > max ) value = max
    return value
  }

  return ColorPicker
}))
