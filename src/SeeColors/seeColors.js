/**
 * seeColors
 * Created by suti on 2016/11/14.
 */
"use strict";
class SeeColors{
    constructor(obj,option){
        this.dom=(obj.nodeType==1)?obj:this.$(obj);
        this.option=option || {auto:"auto"};
        this.controller();
    }
    controller(option){
        if(this.option.auto=="auto"){
            let dom=this.renderDom().outerHTML;
            this.createImage(dom).then(function (img) {
                // this.$("body").appendChild(img);
                let can=this.createCanvasContainer(img);
                // this.$("body").appendChild(can.canvas);
                this.createSeeColorContainer(can.canvas);
                // console.log(can.imgData);
                this.addListener(can.canvas,(x,y)=>{
                    if(this.$('.seeColors-follow-cooky').length==0){
                        this.createFollowCookies();
                    }
                    let canvas=can.canvas,
                        width=canvas.width,
                        height=canvas.height,
                        top=canvas.offsetTop-this.$("body").scrollTop,
                        left=canvas.offsetLeft-this.$("body").scrollLeft,
                        mX=x-left,
                        mY=y-top,
                        pixel=mY*width+mX;
                    this.setFollowCookies(mX+50,mY,"rgba("+
                        can.imgData[(pixel-1)*4]+","+
                        can.imgData[(pixel-1)*4+1]+","+
                        can.imgData[(pixel-1)*4+2]+","+
                        can.imgData[(pixel-1)*4+3]/255+")");
                    console.log(mX+"  "+mY+
                        "rgba("+
                        can.imgData[(pixel-1)*4]+","+
                        can.imgData[(pixel-1)*4+1]+","+
                        can.imgData[(pixel-1)*4+2]+","+
                        can.imgData[(pixel-1)*4+3]/255+")");
                });
            }.bind(this)).catch((e)=>{
                console.log(e);
            });
        }
    }
    $(sele){
        return document.querySelector(sele);
    }
    $s(sele){
        return document.querySelectorAll(sele);
    }
    getMouseLocation(){
        let e=event || window.event;
        return {
            mouseX:e.clientX,
            mouseY:e.clientY
        };
    }
    findRom(ele,copy){
        for(let i=0; i<ele.childNodes.length;i++){
            copy.appendChild(ele.childNodes[i].cloneNode());
            this.findRom(ele.childNodes[i],copy.childNodes[i]);
        }
    }
    setStyle(ele,copy,c){
        for(let i=0; i<ele.children.length;i++){
            for(let style in this.getStyle(ele.children[i])){
                try{
                    copy.children[i].style[style]=this.getStyle(ele.children[i])[style];
                }catch (e){
                    // console.log(e);
                }
            }
            this.setStyle(ele.children[i],copy.children[i]);
        }
    }
    getStyle(ele){
        return window.getComputedStyle? window.getComputedStyle(ele, null):ele.currentStyle;
    }
    addListener(container,fn){
        container.addEventListener("mousemove",()=>{
            let mouseLocation=this.getMouseLocation();
            fn(mouseLocation.mouseX,mouseLocation.mouseY);
        },false);
        container.addEventListener("mouseover",()=>{
            let mouseLocation=this.getMouseLocation();
            this.createFollowCookies();
            this.setFollowCookies(mouseLocation.mouseX,mouseLocation.mouseY)
        },false);
        container.addEventListener("mouseout",()=>{
            this.removeFollowCookies();
        },false);
    }
    renderDom(){
        let dom=this.dom;
        let copy=document.createElement("div");
        copy.classList.add("seeColors-copy-dom");
        copy.appendChild(dom.cloneNode());
        this.findRom(dom,copy.children[0]);
        for(let style in this.getStyle(dom)){
            try{
                copy.style[style]=this.getStyle(dom)[style];
            }catch (e){
                // console.log(e);
            }
        }
        this.setStyle(dom,copy.children[0]);
        console.log(copy);
        return copy;
    }
    createImage(str){
        //use image/svg+xml;base64 仅兼容chrome
        let height=this.dom.offsetHeight,
            width=this.dom.offsetWidth,
            data= `
            <svg xmlns='http://www.w3.org/2000/svg' width='`+width+`' height='`+height+`' >
                <switch>
                    <foreignObject width='100%' height='100%' >
                        <div xmlns='http://www.w3.org/1999/xhtml' >
                            ` + str+ `
                        </div>
                    </foreignObject>
                </switch>
            </svg>`;
        let b2a=(data)=>{
            return (btoa instanceof Function)?btoa(data):window.btoa(data);
        };
        let src ='data:image/svg+xml;base64,'+b2a(unescape(encodeURIComponent(data)));
        let img=new Image;
        img.src=src;
        img.crossorigin="anonymous";
        return new Promise((resolve,reject)=>{
            img.onload=function () {
                console.log("onload!");
                resolve(this);
            };
            img.onerror=function(){
                reject();
            };
        });
    }
    createCanvasContainer(img){
        let height=this.dom.offsetHeight,
            width=this.dom.offsetWidth,
            canvas=document.createElement("canvas");
        canvas.classList.add("seeColors-temp-canvas");
        canvas.width=width;
        canvas.height=height;
        let ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0);
        let imgData=ctx.getImageData(0,0,width,height).data;
        return{
            canvas:canvas,
            ctx:ctx,
            imgData:imgData
        }
    }
    createSeeColorContainer(canvas){
        let dom=this.dom,
            top=dom.offsetTop,
            left=dom.offsetLeft,
            container=document.createElement("div"),
            style=this.getStyle(this.$('body'));
        container.style.width=style.width.split("px")[0]
            -(-style.paddingLeft.split("px")[0]
            -style.marginLeft.split("px")[0]
            -style.paddingRight.split("px")[0]
            -style.marginRight.split("px")[0])+"px";
        container.style.height=style.height.split("px")[0]
            -(-style.paddingTop.split("px")[0]
            -style.marginTop.split("px")[0]
            -style.paddingTop.split("px")[0]
            -style.marginTop.split("px")[0])+"px";
        container.style.position="absolute";
        container.style.top="0";
        container.style.left="0";
        container.style.zIndex="999";
        container.style.backgroundColor="rgba(255,255,255,.6)";
        container.appendChild(canvas);
        canvas.style.position="absolute";
        canvas.style.top=top+"px";
        canvas.style.left=left+"px";
        canvas.style.zIndex="1000";
        this.$("body").appendChild(container);
    }
    createFollowCookies(){
        let cooky=document.createElement("div");
        cooky.classList.add('seeColors-follow-cooky');
        cooky.style.position="absolute";
        cooky.style.border="1px black solid";
        // cooky.style.borderRadius="50px";
        cooky.style.width="50px";
        cooky.style.height="50px";
        this.$("body").appendChild(cooky);
    }
    removeFollowCookies(){
        this.$('.seeColors-follow-cooky').remove();
    }
    setFollowCookies(l,t,c){

        this.$('.seeColors-follow-cooky').style.zIndex="1001";
        this.$('.seeColors-follow-cooky').style.top=t+"px";
        this.$('.seeColors-follow-cooky').style.left=l+"px";
        this.$('.seeColors-follow-cooky').style.backgroundColor=c;
    }
}