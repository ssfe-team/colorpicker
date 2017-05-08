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

  global.ColorPicker = factory( global.SeeColors );

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
        <span>取消</span>
        <span>确定</span>
      </div>
    </div>`;

  class ColorPicker{
    constructor(){

    }
    build(){
      let t=document.createElement('div')
      t.innerHTML=_tpl
      this._f=document.createDocumentFragment()
      this._f.appendChild(t.childNodes[0])

    }

    define(){

    }
  }

}))
