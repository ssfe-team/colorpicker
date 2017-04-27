/**
 * Created by suti on 2017/4/26.
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvg = require('./canvg');

var _canvg2 = _interopRequireDefault(_canvg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SeeColors = function () {
  //构造器，需要传入元素或一个css样子的选择器，一个option（可选）

  function SeeColors(obj, option) {
    var _this = this;

    _classCallCheck(this, SeeColors);

    if (!obj) return;
    var temp = obj.split('NaNpx');
    this.svg = temp.join();
    temp = this.svg.split('&nbsp;');
    this.svg = temp.join(' ');
    temp = this.svg.split('href="//');
    this.svg = temp.join('href="http://');

    this.dom = document.createElement('div');
    this.dom.innerHTML = this.svg;

    var width = this.dom.querySelector('svg').getAttribute('width').split('px')[0],
        height = this.dom.querySelector('svg').getAttribute('height').split('px')[0];
    this.scroller = this.$("body").scrollTop;
    this.option = option || {
      width: width,
      height: height,
      left: 0,
      top: 0
    };

    // Object.defineProperty(this.__ob__,'canvas',{
    // })

    return new Promise(function (resolve, reject) {

      _this.controller().then(function (it) {
        _this.exit();
        resolve(it);
      });
    });

    // this.createImage().then(e=>{
    //   this.__ob__.canvas=e;
    // })
  }

  _createClass(SeeColors, [{
    key: 'run',
    value: function run() {}

    //控制函数，链接渲染、生成图片和创建响应的函数。返回一个被选中的像素点颜色

  }, {
    key: 'controller',
    value: function controller() {

      return this.createImage().then(function (can) {
        var _this2 = this;

        this.createSeeColorContainer(can.canvas);

        var canvas = can.canvas,
            width = canvas.width,
            height = canvas.height;

        return this.addListener(this.$('.seeColors-temp-container'), function (x, y) {

          if (_this2.$('.seeColors-follow-cooky') == null) {
            _this2.createFollowCookies();
          }

          var top = canvas.offsetTop,
              left = canvas.offsetLeft,
              mX = x - left,
              mY = y - top,
              pixel = mY * width + mX;

          _this2.setFollowCookies(x, y + _this2.$("body").scrollTop, can, pixel, width, height);

          // console.log(mX+","+mY+
          //   ",rgba("+
          //   can.imgData[(pixel-1)*4]+","+
          //   can.imgData[(pixel-1)*4+1]+","+
          //   can.imgData[(pixel-1)*4+2]+","+
          //   can.imgData[(pixel-1)*4+3]/255+")");
        }, function (x, y) {

          var top = canvas.offsetTop - _this2.$("body").scrollTop,
              left = canvas.offsetLeft - _this2.$("body").scrollLeft,
              mX = x - left,
              mY = y - top,
              pixel = mY * width + mX;

          return {
            pixelX: mX,
            pixelY: mY,
            colorString: "rgba(" + can.imgData[(pixel - 1) * 4] + "," + can.imgData[(pixel - 1) * 4 + 1] + "," + can.imgData[(pixel - 1) * 4 + 2] + "," + can.imgData[(pixel - 1) * 4 + 3] / 255 + ")",
            color: [can.imgData[(pixel - 1) * 4], can.imgData[(pixel - 1) * 4 + 1], can.imgData[(pixel - 1) * 4 + 2], can.imgData[(pixel - 1) * 4 + 3] / 255]
          };
        }).then(function (it) {

          return it;
        });
      }.bind(this)).then(function (it) {

        return it;
      }).catch(function (e) {

        console.log(e + "渲染失败!");
        return null;
      });
    }
  }, {
    key: '$',
    value: function $(sele) {
      return document.querySelector(sele);
    }
  }, {
    key: '$s',
    value: function $s(sele) {
      return document.querySelectorAll(sele);
    }

    //获取鼠标坐标

  }, {
    key: 'getMouseLocation',
    value: function getMouseLocation(e) {
      // let e=e|| window.event;
      return {
        mouseX: e.clientX,
        mouseY: e.clientY
      };
    }

    //获取ele的样式

  }, {
    key: 'getStyle',
    value: function getStyle(ele) {
      return window.getComputedStyle ? window.getComputedStyle(ele, null) : ele.currentStyle;
    }

    //为container添加响应，fn为mousemove的响应，fin为click的响应

  }, {
    key: 'addListener',
    value: function addListener(container, fn, fin) {
      var _this3 = this;

      container.addEventListener("mousemove", function (e) {

        var mouseLocation = _this3.getMouseLocation(e);
        fn(mouseLocation.mouseX, mouseLocation.mouseY);
      }, false);

      // container.addEventListener("mouseover",()=>{
      //     let mouseLocation=this.getMouseLocation();
      //     this.createFollowCookies();
      // },false);
      // container.addEventListener("mouseout",
      //     this.removeFollowCookies.bind(this)
      //     ,false);

      return new Promise(function (resolve, reject) {

        container.addEventListener("click", function (e) {

          var mouseLocation = _this3.getMouseLocation(e);
          resolve(fin(mouseLocation.mouseX, mouseLocation.mouseY));
        }, false);
      });
    }
    //根据传入的节点生成图片，返回一个Promise为当图片成功加载后的响应

  }, {
    key: 'createImage',
    value: function createImage() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var c = document.createElement('canvas');
        (0, _canvg2.default)(c, _this4.svg, { log: true, ignoreMouse: true, renderCallback: function renderCallback(e) {
            var ctx = c.getContext('2d');
            var imgData = ctx.getImageData(0, 0, _this4.option.width, _this4.option.height).data;
            console.log(imgData);
            resolve({
              canvas: c,
              ctx: ctx,
              imgData: imgData
            });
          } });
      });
    }

    //创建一个div标签，这个标签覆盖整个body体并为白色半透明，并为canvas设置位置。效果为：截屏时，this.dom以外的其他元素有模糊效果

  }, {
    key: 'createSeeColorContainer',
    value: function createSeeColorContainer(canvas) {
      var container = document.createElement("div");
      container.classList.add('seeColors-temp-container');
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.position = "fixed";
      container.style.zIndex = "999";
      container.style.top = "0";
      container.style.left = "0";
      container.style.backgroundColor = "rgba(0,0,0,.6)";
      container.appendChild(canvas);
      canvas.style.position = "absolute";
      canvas.classList.add('seeColors-temp-canvas');
      canvas.style.zIndex = "1000";
      this.$("body").appendChild(container);
      console.log((container.offsetHeight - this.option.height) / 2);
      canvas.style.left = (container.offsetWidth - this.option.width) / 2 + 'px';
      canvas.style.top = (container.offsetHeight - this.option.height) / 2 + 'px';
    }

    //创建一个跟随鼠标的div

  }, {
    key: 'createFollowCookies',
    value: function createFollowCookies() {

      if (!this.$('.seeColors-follow-cooky')) {

        var cooky = document.createElement("div");
        cooky.classList.add('seeColors-follow-cooky');
        cooky.style.position = "absolute";
        cooky.style.border = "1px black solid";
        cooky.style.width = "122px";
        cooky.style.height = "122px";
        cooky.style.borderRadius = "61px";
        cooky.style.overflow = "hidden";

        for (var i = 0; i < 121; i++) {

          var cc = document.createElement("div");
          cc.style.width = "10px";
          cc.style.height = "10px";
          cc.style.borderLeft = "1px #ccc solid";
          cc.style.borderTop = "1px #ccc solid";
          cc.style.float = "left";
          cooky.appendChild(cc);
        }

        this.$(".seeColors-temp-container").appendChild(cooky);
        this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderLeft = "1px red solid";
        this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderTop = "1px red solid";
        this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderRight = "1px red solid";
        this.$('.seeColors-follow-cooky > div:nth-child(62)').style.borderLeft = "0px";
        this.$('.seeColors-follow-cooky > div:nth-child(72)').style.borderTop = "1px red solid";
        this.$('.seeColors-follow-cooky').style.transition = "all 0 linear";
        this.$('.seeColors-follow-cooky > div').style.transition = "all 0.1s linear";
      } else {
        this.$('.seeColors-follow-cooky').style.display = "block";
      }
    }

    //删除跟随鼠标的div

  }, {
    key: 'removeFollowCookies',
    value: function removeFollowCookies(t) {

      this.$('.seeColors-follow-cooky').style.display = "none";
    }

    //为那个跟随鼠标的div提供位置和选中的颜色

  }, {
    key: 'setFollowCookies',
    value: function setFollowCookies(l, t, can, p, w, h) {
      var _this5 = this;

      var left = w - l > 110 ? l : l - 110,
          top = t > 20 ? h - t > 110 ? t : t - 110 : t + 30,
          canvas = can.canvas,
          pl = p - 4 * 65;

      return new Promise(function (resolve, reject) {
        // this.$('.seeColors-follow-cooky').display='none';
        _this5.$('.seeColors-follow-cooky').style.zIndex = "1001";
        _this5.$('.seeColors-follow-cooky').style.top = top + "px";
        _this5.$('.seeColors-follow-cooky').style.left = left + "px";

        for (var i = 0; i < 121; i++) {

          var ci = p - (5 * canvas.width + 5) + Number.parseInt(i / 11) * canvas.width + i % 11,
              n = i + 1;

          _this5.$('.seeColors-follow-cooky > div:nth-child(' + n + ')').style.backgroundColor = "rgba(" + can.imgData[(ci - 1) * 4] + "," + can.imgData[(ci - 1) * 4 + 1] + "," + can.imgData[(ci - 1) * 4 + 2] + "," + can.imgData[(ci - 1) * 4 + 3] / 255 + ")";
        }
        _this5.$('.seeColors-follow-cooky').display = 'block';
        resolve();
      });
    }

    //退出处理，删除生成的类

  }, {
    key: 'exit',
    value: function exit() {

      if (this.$(".seeColors-follow-cooky")) {
        this.$(".seeColors-follow-cooky").remove();
      }

      this.$("body").style.overflowY = "auto";
      this.$(".seeColors-temp-canvas").remove();
      this.$(".seeColors-temp-container").remove();
    }
  }]);

  return SeeColors;
}();

// export {SeeColors};