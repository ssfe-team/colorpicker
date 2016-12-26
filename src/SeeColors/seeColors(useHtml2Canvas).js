/**
 * seeColors
 * Created by suti on 2016/11/21.
 *
 *   new SeeColors("#item").then(it=>{...});  "..."为取完颜色后的操作，it为渠道的像素颜色
 */
"use strict";
class SeeColors{
    //构造器，需要传入元素或一个css样子的选择器，一个option（可选）
    constructor(obj,option){
        this.dom=(obj.nodeType==1)?obj:this.$(obj);
        if(this.$("body").scrollTop!="0"){
            this.$("body").style.overflowY="hidden";
        }
        this.scroller=this.$("body").scrollTop;
        this.option=option || {
            auto:"auto"
            };
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
                return this.addListener(this.$('.seeColors-temp-container'),(x,y)=>{
                    if(this.$('.seeColors-follow-cooky')==null){
                        this.createFollowCookies();
                    }
                    let top=canvas.offsetTop-this.$("body").scrollTop,
                        left=canvas.offsetLeft-this.$("body").scrollLeft,
                        mX=x-left,
                        mY=y-top,
                        pixel=mY*width+mX;
                    this.setFollowCookies(x,y+this.$("body").scrollTop,can,pixel,width,height);
                    console.log(mX+","+mY+
                        ",rgba("+
                        can.imgData[(pixel-1)*4]+","+
                        can.imgData[(pixel-1)*4+1]+","+
                        can.imgData[(pixel-1)*4+2]+","+
                        can.imgData[(pixel-1)*4+3]/255+")");
                },(x,y)=>{
                    let top=canvas.offsetTop-this.$("body").scrollTop,
                        left=canvas.offsetLeft-this.$("body").scrollLeft,
                        mX=x-left,
                        mY=y-top,
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
        // container.addEventListener("mouseover",()=>{
        //     let mouseLocation=this.getMouseLocation();
        //     this.createFollowCookies();
        // },false);
        // container.addEventListener("mouseout",
        //     this.removeFollowCookies.bind(this)
        //     ,false);
        return new Promise((resolve,reject)=>{
            container.addEventListener("click",()=>{
                let mouseLocation=this.getMouseLocation();
                resolve(fin(mouseLocation.mouseX,mouseLocation.mouseY));
            },false);
        });
    }
    //根据传入的节点生成图片，返回一个Promise为当图片成功加载后的响应
    createImage(str){
        let height=(this.dom.tagName!="BODY")?this.dom.offsetHeight:document.body.clientHeight,
            width=(this.dom.tagName!="BODY")?this.dom.offsetWidth:document.body.clientWidth;
        return new Promise((resolve,reject)=>{
            html2canvas(this.dom,{
                width:width,
                height:height,
                // logging:true,
                // useCORS:true,
                onrendered:function(canvas){
                    canvas.classList.add("seeColors-temp-canvas");
                    let ctx=canvas.getContext("2d");
                    this.$("body").appendChild(canvas);
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
            canvas.style.top=this.$("body").scrollTop+"px";
            canvas.style.left=0;
        }else {
            if(this.scroller=="0"){
                canvas.style.top=top-(-domStyle.marginTop.split("px")[0]-this.$("body").scrollTop)+"px";
            }else {
                canvas.style.top=(this.$("body").scrollTop)+"px";
            }
            canvas.style.left=left-(-domStyle.marginLeft.split("px")[0])+"px";
        }
        canvas.style.zIndex="1000";
        this.$("body").appendChild(container);
    }
    //创建一个跟随鼠标的div
    createFollowCookies(){
        if(!this.$('.seeColors-follow-cooky')){

            let cooky=document.createElement("div");
            cooky.classList.add('seeColors-follow-cooky');
            cooky.style.position="absolute";
            cooky.style.border="1px black solid";
            cooky.style.width="122px";
            cooky.style.height="122px";
            cooky.style.borderRadius="61px";
            cooky.style.overflow="hidden";
            for(let i=0;i<121;i++){
                let cc=document.createElement("div");
                cc.style.width="10px";
                cc.style.height="10px";
                cc.style.borderLeft="1px #ccc solid";
                cc.style.borderTop="1px #ccc solid";
                cc.style.float="left";
                cooky.appendChild(cc);
            }
            this.$(".seeColors-temp-container").appendChild(cooky);
            this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderLeft="1px red solid";
            this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderTop="1px red solid";
            this.$('.seeColors-follow-cooky > div:nth-child(61)').style.borderRight="1px red solid";
            this.$('.seeColors-follow-cooky > div:nth-child(62)').style.borderLeft="0px";
            this.$('.seeColors-follow-cooky > div:nth-child(72)').style.borderTop="1px red solid";
            this.$('.seeColors-follow-cooky').style.transition="all 0 linear";
            this.$('.seeColors-follow-cooky > div').style.transition="all 0.1s linear";
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
    //退出处理，删除生成的类
    exit(){
        if(this.$(".seeColors-follow-cooky")){
            this.$(".seeColors-follow-cooky").remove();
        }
        this.$("body").style.overflowY="auto";
        this.$(".seeColors-temp-canvas").remove();
        this.$(".seeColors-temp-container").remove();
    }
}

// export {SeeColors};