/**
 * Created by suti on 2017/4/21.
 */
"use strict";
class Container{
  constructor(node){
    this.refs.svg=node.querySelector('svg');
    this.canvasFrag=document.createDocumentFragment();
    this.canvas=document.createElement('canvas');
    this.svg=this.refs.svg.outerHTML
    // if(!this.canvas.classList.contains('.color-picker-container')){
    //   this.canvas.classList.add('.color-picker-container');
    //   node.appendChild(this.canvas);
    // }
    this.canvas.width=node.style.width
    this.canvas.height=node.style.height
    this.canvas.style.cssText='position:absolute;top:0;left:0;z-index:999;width:'+node.style.width+';height:'+node.style.height
    this.canvasFrag.appendChild(this.canvas);

  }

  setCanvas(){

  }

  createFollowCookies(){

    if(!this.$('.seeColors-follow-cooky')){
      let cooky=document.createElement("div");
      cooky.classList.add('seeColors-follow-cooky');
      cooky.style.cssText='position:absolute;border:1px black solid;width:122px;height:122px;border-radius:61px;overflow;hidden;z-index:1999'

      for(let i=0;i<121;i++){
        let cc=document.createElement("div");
        cc.style.cssText='width:10px;height:10px;border-left:1px #ccc solid;border-right:1px #ccc solid;float:left'
        cooky.appendChild(cc);
      }

      this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderLeft="1px red solid";
      this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderTop="1px red solid";
      this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderRight="1px red solid";
      this.$('.seeColors-follow-cooky > div:nth-child(62)').style.borderLeft="0px";
      this.$('.seeColors-follow-cooky > div:nth-child(72)').style.borderTop="1px red solid";
      this.canvasFrag.appendChild(cooky);
    }else {
      this.$('.seeColors-follow-cooky').style.display="block";
    }
  }

  //删除跟随鼠标的div
  removeFollowCookies(t){
    this.$('.seeColors-follow-cooky').style.display="none";
  }

  //为那个跟随鼠标的div提供位置和选中的颜色
  setFollowCookies(l,t,can,p,w,h){

    let left=(w-l>110)?l:l-110,
      top=t>20?(h-t>110?t:t-110):t+30,
      canvas=can.canvas,
      pl=p-4*65;

    return new Promise((resolve,reject)=>{

      this.$('.seeColors-follow-cooky').style.zIndex="1001";
      this.$('.seeColors-follow-cooky').style.top=top+"px";
      this.$('.seeColors-follow-cooky').style.left=left+"px";

      for(let i=0;i<121;i++){

        let ci=p-(5*canvas.width+5)+(Number.parseInt(i/11))*canvas.width+i%11,
          n=i+1;

        this.$('.seeColors-follow-cooky > div:nth-child('+n+')').style.backgroundColor="rgba("+
          can.imgData[(ci-1)*4]+","+
          can.imgData[(ci-1)*4+1]+","+
          can.imgData[(ci-1)*4+2]+","+
          can.imgData[(ci-1)*4+3]/255+")";

      }

      resolve();

    });

  }

  $(sele){
    return document.querySelector(sele);
  }

  $s(sele){
    return document.querySelectorAll(sele);
  }
}

// export {SeeColors};