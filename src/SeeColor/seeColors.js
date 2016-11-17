/**
 * seeColors
 * Created by suti on 2016/11/14.
 */
"use strict";
class SeeColors{
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
    setStyle(ele,copy){
        // try{
        //     copy.style[style]=this.getStyle(ele)[style];
        // }catch (e){
        //     // console.log(e);
        // }
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
    constructor(obj,option){
        this.dom=(obj.nodeType==1)?obj:this.$(obj);
        this.option=option || {auto:"auto"};
        if(this.option.auto=="auto"){
            let dom=this.renderDom().outerHTML;
            this.createImage(dom).then(function (img) {
                this.$("body").appendChild(img);
                let can=this.createCanvasContainer(img);
                this.$("body").appendChild(can.canvas);
                console.log(can.imgData);
            }.bind(this));
        }
    }
    controller(option){

    }
    addListener(container,fn){
        container.addEventListener("mousemove",()=>{
            let mouseLocation=this.getMouseLocation();
            fn(mouseLocation.mouseX,mouseLocation.mouseY);
        },false)
    }
    renderDom(){
        let dom=this.dom;
        let copy=document.createElement("div");
        copy.classList.add("seeColors-copy-dom");
        copy.appendChild(dom.cloneNode());
        this.findRom(dom,copy.children[0]);
        this.setStyle(dom,copy.children[0]);
        console.log(copy);
        return copy;
    }
    createImage(str){
        //use image/svg+xml;base64 仅兼容chrome
        let height=this.dom.offsetHeight,
            width=this.dom.offsetWidth,
            data= `
            <svg xmlns='http://www.w3.org/2000/svg' width='`+width+`' height='`+height+`'>
                <switch>
                    <foreignObject width='100%' height='100%'>
                        <body xmlns='http://www.w3.org/1999/xhtml'>
                            ` + str+ `
                        </body>
                    </foreignObject>
                </switch>
            </svg>`;
        let src ='data:image/svg+xml;base64,'+btoa(data);
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
}