/**
 *
 * Created by suti on 2016/11/21.
 */
/**
 * seeColors
 * Created by suti on 2016/11/14.
 *   new SeeColors("#item").then(it=>{...});  "..."为取完颜色后的操作，it为渠道的像素颜色
 */
"use strict";
// const html2canvas = require('html2canvas.min.js');
class SeeColors{
    //构造器，需要传入元素或一个css样子的选择器，一个option（可选）
    constructor(obj,option){
        this.dom=(obj.nodeType==1)?obj:this.$(obj);
        if(this.dom.tagName=="BODY")
            this.dom.style.overflow="hidden";
        this.option=option || {auto:"auto"};
        return new Promise((resolve,reject)=>{
            this.controller().then((it)=>{
                this.exit();
                resolve(it);
            });
        });
    }
    //控制函数，链接渲染、生成图片和创建响应的函数。返回一个被选中的像素点颜色
    controller(){
        if(this.option.auto=="auto"){
            return this.createImage().then(function (can) {
                this.createSeeColorContainer(can.canvas);
                let canvas=can.canvas,
                    width=canvas.width,
                    height=canvas.height;
                console.log(canvas.width);
                return this.addListener(can.canvas,(x,y)=>{
                    if(this.$('.seeColors-follow-cooky').length==0){
                        this.createFollowCookies();
                    }
                    let top=canvas.offsetTop-this.$("body").scrollTop,
                        left=canvas.offsetLeft-this.$("body").scrollLeft,
                        mX=(this.dom.tagName=="BODY")?x-left:x,
                        mY=(this.dom.tagName=="BODY")?y-top:y,
                        pixel=mY*width+mX;
                    this.setFollowCookies(mX,mY,"rgba("+
                        can.imgData[(pixel-1)*4]+","+
                        can.imgData[(pixel-1)*4+1]+","+
                        can.imgData[(pixel-1)*4+2]+","+
                        can.imgData[(pixel-1)*4+3]/255+")",width,height);
                    console.log(mX+","+mY+
                        ",rgba("+
                        can.imgData[(pixel-1)*4]+","+
                        can.imgData[(pixel-1)*4+1]+","+
                        can.imgData[(pixel-1)*4+2]+","+
                        can.imgData[(pixel-1)*4+3]/255+")");
                },(x,y)=>{
                    let top=canvas.offsetTop-this.$("body").scrollTop,
                        left=canvas.offsetLeft-this.$("body").scrollLeft,
                        mX=(this.dom.tagName=="BODY")?x-left:x,
                        mY=(this.dom.tagName=="BODY")?y-top:y,
                        pixel=mY*width+mX;
                    return{
                        pixelX:mX,
                        pixelY:mY,
                        colorString:"rgba("+
                        can.imgData[(pixel-1)*4]+","+
                        can.imgData[(pixel-1)*4+1]+","+
                        can.imgData[(pixel-1)*4+2]+","+
                        can.imgData[(pixel-1)*4+3]/255+")",
                        color:[can.imgData[(pixel-1)*4],
                            can.imgData[(pixel-1)*4+1],
                            can.imgData[(pixel-1)*4+2],
                            can.imgData[(pixel-1)*4+3]/255]
                    }
                }).then((it)=>{
                    return it;
                });
            }.bind(this)).then((it)=>{
                return it;
            }).catch(()=>{
                console.log("渲染失败!");
                return null;
            });
        }
    }
    $(sele){
        return document.querySelector(sele);
    }
    $s(sele){
        return document.querySelectorAll(sele);
    }
    //获取鼠标坐标
    getMouseLocation(){
        let e=event || window.event;
        return {
            mouseX:e.clientX,
            mouseY:e.clientY
        };
    }
    //遍历并复制dom，ele为被拷贝节点，copy为拷贝节点
    findRom(ele,copy){
        for(let i=0; i<ele.childNodes.length;i++){
            copy.appendChild(ele.childNodes[i].cloneNode());
            this.findRom(ele.childNodes[i],copy.childNodes[i]);
        }
    }
    //遍历并赋值样式，ele为被拷贝样式的节点，copy为拷贝样式的节点
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
    //获取ele的样式
    getStyle(ele){
        return window.getComputedStyle? window.getComputedStyle(ele, null):ele.currentStyle;
    }
    //为container添加响应，fn为mousemove的响应，fin为click的响应
    addListener(container,fn,fin){
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
        return new Promise((resolve,reject)=>{
            container.addEventListener("click",()=>{
                let mouseLocation=this.getMouseLocation();
                resolve(fin(mouseLocation.mouseX,mouseLocation.mouseY));
            },false);
        });
    }
    //渲染dom（复制dom节点及属性），返回一个复制好了的父节点
    renderDom(){
        let dom=this.dom;
        let copy=document.createElement("div");
        copy.classList.add("seeColors-copy-dom");
        copy.appendChild(dom.cloneNode());
        this.findRom(dom,copy.children[0]);
        for(let style in this.getStyle(dom)){
            try{
                copy.children[0].style[style]=this.getStyle(dom)[style];
            }catch (e){
                // console.log(e);
            }
        }
        this.setStyle(dom,copy.children[0]);
        console.log(copy);
        return copy;
    }
    //根据传入的节点生成图片，返回一个Promise为当图片成功加载后的响应
    createImage(str){
        // //use image/svg+xml;base64 仅兼容chrome
        // let height=this.dom.offsetHeight,
        //     width=this.dom.offsetWidth,
        //     data= `
        //     <svg xmlns='http://www.w3.org/2000/svg' width='`+width+`' height='`+height+`' >
        //         <switch>
        //             <foreignObject width='100%' height='100%' >
        //                 <div xmlns='http://www.w3.org/1999/xhtml' >
        //                     ` + str+ `
        //                 </div>
        //             </foreignObject>
        //         </switch>
        //     </svg>`;
        // let b2a=(data)=>{
        //     return (btoa instanceof Function)?btoa(data):window.btoa(data);
        // };
        // let src ='data:image/svg+xml;base64,'+b2a(unescape(encodeURIComponent(data)));
        // let img=new Image;
        // img.src=src;
        // img.crossorigin="anonymous";
        // return new Promise((resolve,reject)=>{
        //     img.onload=function () {
        //         console.log("onload!");
        //         resolve(this);
        //     };
        //     img.onerror=function(){
        //         reject();
        //     };
        // });
        let height=(this.dom.tagName!="BODY")?this.dom.offsetHeight:document.body.clientHeight,
            width=(this.dom.tagName!="BODY")?this.dom.offsetWidth:document.body.clientWidth;
        // console.log(this.dom.offsetHeight+","+document.body.clientHeight)
        // console.log(this.dom.offsetWidth+","+document.body.clientWidth)
        return new Promise((resolve,reject)=>{
            html2canvas(this.dom,{
                width:width,
                height:height,
                onrendered:function(canvas){
                    canvas.classList.add("seeColors-temp-canvas");
                    let ctx=canvas.getContext("2d");
                    let imgData=ctx.getImageData(0,0,canvas.width,canvas.height).data;
                    resolve({
                        canvas:canvas,
                        ctx:ctx,
                        imgData:imgData
                    });
                }.bind(this)
            });
        });

    }
    //根据图片创建一个和图片一样大小的canvas，并读取其每一个像素信息，返回该创建的canvas和像素信息
    // createCanvasContainer(canvas){
    //     let height=this.dom.offsetHeight,
    //         width=this.dom.offsetWidth;
    //         // canvas=document.createElement("canvas");
    //     canvas.classList.add("seeColors-temp-canvas");
    //     canvas.width=width;
    //     canvas.height=height;
    //     let ctx=canvas.getContext("2d");
    //     // ctx.drawImage(img,0,0);
    //     let imgData=ctx.getImageData(0,0,width,height).data;
    //     return{
    //         canvas:canvas,
    //         ctx:ctx,
    //         imgData:imgData
    //     }
    // }
    //创建一个div标签，这个标签覆盖整个body体并为白色半透明，并为canvas设置位置。效果为：截屏时，this.dom以外的其他元素有模糊效果
    createSeeColorContainer(canvas){
        let dom=this.dom,
            domStyle=this.getStyle(dom),
            top=dom.offsetTop,
            left=dom.offsetLeft,
            container=document.createElement("div"),
            bodyStyle=this.getStyle(this.$('body'));
        container.classList.add('seeColors-temp-container');
        container.style.width=bodyStyle.width.split("px")[0]
            -(-bodyStyle.paddingLeft.split("px")[0]
            -bodyStyle.marginLeft.split("px")[0]
            -bodyStyle.paddingRight.split("px")[0]
            -bodyStyle.marginRight.split("px")[0])+"px";
        container.style.height=bodyStyle.height.split("px")[0]
            -(-bodyStyle.paddingTop.split("px")[0]
            -bodyStyle.marginTop.split("px")[0]
            -bodyStyle.paddingTop.split("px")[0]
            -bodyStyle.marginTop.split("px")[0])+"px";
        container.style.position="absolute";
        container.style.top="0";
        container.style.left="0";
        container.style.zIndex="999";
        container.style.backgroundColor="rgba(255,255,255,.6)";
        container.appendChild(canvas);
        canvas.style.position="absolute";
        if(this.dom.tagName=="BODY"){
            canvas.style.top=0;
            canvas.style.left=0;
        }else {
            canvas.style.top=top-(-domStyle.marginTop.split("px")[0])+"px";
            canvas.style.left=left-(-domStyle.marginLeft.split("px")[0])+"px";
        }
        canvas.style.zIndex="1000";
        this.$("body").appendChild(container);
    }
    //创建一个跟随鼠标的div
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
    //删除跟随鼠标的div
    removeFollowCookies(){
        this.$('.seeColors-follow-cooky').remove();
    }
    //为那个跟随鼠标的div提供位置和选中的颜色
    setFollowCookies(l,t,c,w,h){
        let left=(w-l>80)?l+40:l-60,
            top=t>50?(h-t>60?t:t-40):t+30;
        this.$('.seeColors-follow-cooky').style.zIndex="1001";
        this.$('.seeColors-follow-cooky').style.top=top+"px";
        this.$('.seeColors-follow-cooky').style.left=left+"px";
        this.$('.seeColors-follow-cooky').style.backgroundColor=c;
    }
    //退出处理，删除生成的类
    exit(){
        if(this.$(".seeColors-follow-cooky").length!=0)
            this.$(".seeColors-follow-cooky").remove();
        this.dom.style.overflow="";
        this.$(".seeColors-temp-canvas").remove();
        this.$(".seeColors-temp-container").remove();
    }
}

// export {SeeColors};