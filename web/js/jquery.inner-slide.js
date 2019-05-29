$.fn.seaseeyoul = function(opts){
    _this = $(this);
    var IMGLENGTH = $(this).find(".gallery-images-item").length;
    var galleryInterval;
    //以下划线开始的属性为插件自取属性
    defaultOptions = {
        _imgLength:IMGLENGTH,
        fadeTime:350, //过渡时间
        nextButton:'.gallery-next', //上一张按钮
        prevButton:'.gallery-prev', //下一张按钮
        waiteTime:3000, //图片切换等待时间
        minImgColor:"red", //小图片边框颜色
        galleryTitle:'请输入标题', //头部标题悉
        clockWise:true //可选参数 true，false 顺时针轮播还是
    };
    _opt = $.extend({}, defaultOptions, opts);

    //自动执行函数，初始化
    !(function(){
        if(!_opt._imgLength)return false;
        init();
    })();

    //初始化函数
    function init(){
        _this.find(".gallery-images-item").eq(0).addClass("galleryed").fadeIn(_opt.fadeTime);
        _this.find(".gallery-title-main-all").text(_opt._imgLength);
        //_this.find(".gallery-top-title").text(_opt.galleryTitle);
        _this.find(".gallery-describte-title").html(_this.find(".galleryed .gallery-describtion-title").html());
        _this.find(".gallery-describte-content").html(_this.find(".galleryed .gallery-describtion-content").html());
        for(var i=0; i<_opt._imgLength;i++){
            _this.find(".gallery-images-item").eq(i).attr("gallery-index",i);
            var indexImage = $('<li class="gallery-min-images-item"  gallery-min-index = '+i+'><a href="javascript:void(0)" class="gallery-min-images-link"><img class="gallery-min-image-this" src="'+_this.find(".gallery-images-item").eq(i).find(".gallery-image").attr("src")+'"></a></li>');
            _this.find(".gallery-min-images").append(indexImage);
            //
        }
        galleryMinImgcontent();
        galleryAutoPlay(_opt.waiteTime);
        toggleImg();
        watchMaxImg(_this.find(".gallery-image"));
        galleryNext();
        galleryPrev();
		toggleAutoSlide();
    };

    //自动切换函数
    function galleryAutoPlay(t){
        if(_this.find(".gallery-images-item").length < 2){
            return false;
        }
        galleryInterval = setInterval(galleryPlay, t);
    };
    //确定小图片位置
    function galleryMinImgcontent(){
        _this.find(".gallery-min-images").css("width",_this.find(".gallery-min-images-item").length * 106 + 'px');
        _this.find(".gallery-min-image-this").eq(0).css("border-color",_opt.minImgColor);
    };
    //向下切换函数
    function galleryPlay(positiveAndNegative){
        var galleryed = _this.find(".galleryed");
        positiveAndNegative === undefined?positiveAndNegative=true:positiveAndNegative=false;
        //图片切换
        if(_opt.clockWise && positiveAndNegative){
            if(galleryed.next().attr("class") != "gallery-images-item"){
                galleryed.fadeOut(_opt.fadeTime).removeClass("galleryed");
                _this.find(".gallery-images-item").eq(0).addClass("galleryed").fadeIn(_opt.fadeTime);
            }
            galleryed.fadeOut(_opt.fadeTime).removeClass("galleryed").next().fadeIn(_opt.fadeTime).addClass("galleryed");
        }else{
            if(galleryed.prev().attr("class") != "gallery-images-item"){
                galleryed.fadeOut(_opt.fadeTime).removeClass("galleryed");
                _this.find(".gallery-images-item").eq(parseInt(_this.find(".gallery-images-item").length)-1).addClass("galleryed").fadeIn(_opt.fadeTime);
            }
            galleryed.fadeOut(_opt.fadeTime).removeClass("galleryed").prev().fadeIn(_opt.fadeTime).addClass("galleryed");
        }
        var _galleryed = _this.find(".galleryed");
        //标题切换
        _this.find(".gallery-main-length").text(parseInt(_galleryed.attr("gallery-index"))+1);
        //小图片边框切换，小图片位置刷新
        //边框切换
        _this.find(".gallery-min-image-this").css("border-color","#eee").eq(_galleryed.attr("gallery-index")).css("border-color",_opt.minImgColor);
        //位置刷新
        galleryMinRefresh(parseInt(_galleryed.attr("gallery-index")));
        //信息框文本切换
        _this.find(".gallery-describte-title").html(_galleryed.find(".gallery-describtion-title").html());
        _this.find(".gallery-describte-content").html(_galleryed.find(".gallery-describtion-content").html());
        //
    };
    //下一站
    function galleryNext(){
        if(_this.find(".gallery-images-item").length < 2){
            return false;
        }
        _this.find(".gallery-action-right").click(function(){
            clearInterval(galleryInterval);
            galleryPlay();
            galleryAutoPlay(_opt.waiteTime);
        })
    };
    //上一张
    function galleryPrev(){
        if(_this.find(".gallery-images-item").length < 2){
            return false;
        }
        _this.find(".gallery-action-left").click(function(){
            clearInterval(galleryInterval);
            galleryPlay(false);
            galleryAutoPlay(_opt.waiteTime);
        })
    };
    //小图位置刷新
    function galleryMinRefresh(index){
        var startIndex = 5;
        var endIndex = _this.find(".gallery-images-item").length -startIndex;
        if(index>startIndex && index<endIndex){
            var _left = '-'+_this.find(".gallery-min-images-item").eq(0).width() * (index - startIndex)+'px';
            _this.find(".gallery-min-images").animate({left:_left},_opt.fadeTime);
        }else if(index>=0 && index<=startIndex){
            _this.find(".gallery-min-images").animate({left:'0px'},_opt.fadeTime);
        }else{
            var _left = '-'+_this.find(".gallery-min-images-item").eq(0).width() * (endIndex - startIndex-1)+'px';
            _this.find(".gallery-min-images").animate({left:_left},_opt.fadeTime);
        }
    };
    //小图片点击切换
    function toggleImg(){
        _this.find(".gallery-min-images-item").click(function(){
            if( _this.find(".galleryed").attr("gallery-index") != $(this).attr("gallery-min-index")){
                clearInterval(galleryInterval);
                var index = parseInt($(this).attr("gallery-min-index"));
                _this.find(".gallery-main-length").text(index+1); //小标题切u按
                _this.find(".galleryed").fadeOut(_opt.fadeTime).removeClass("galleryed"); //大图切换并移除标识
                _this.find(".gallery-min-image-this").css("border-color",'#eee');//上一张小图边框框恢复默认颜色
                $(this).find(".gallery-min-image-this").css("border-color",_opt.minImgColor);//当前框添加选择边框色
                galleryMinRefresh(index);//小图整体调整
                _this.find(".gallery-images-item").eq(index).addClass("galleryed").fadeIn(_opt.fadeTime);//大图显示出来并添加标识
                _this.find(".gallery-describte-title").html(_this.find(".galleryed .gallery-describtion-title").html());
                _this.find(".gallery-describte-content").html(_this.find(".galleryed .gallery-describtion-content").html());
                galleryAutoPlay(_opt.waiteTime);
            }
        })
    };
    //点击查看大图
    function watchMaxImg(self){
        self.click(function(){
            clearInterval(galleryInterval);
            var _self = $(this);
            var galleryMaxWatchSrc = _self.attr("src");
            var galleryMaxWatch = $('<div class="gallery-watch-maxImg"><span class="gallery-watch-close">×</span><span class="gallery-watch-span"><img src="#" class="gallery-watch-max"  alt=""/><img src="./img/36.gif" class="gallery-watch-loading" alt="加载中..."   /></span><div class="gallery-watch-describte"><p class="gallery-watch-describte-title"></p><p class="gallery-watch-describte-content"></p></div></div>');
            $("body").append(galleryMaxWatch).find(".gallery-watch-maxImg").css("line-height",$(window).height() +'px');
            galleryMaxWatch.fadeIn(_opt.fadeTime);
            galleryMaxWatch.find(".gallery-watch-max").attr('src',galleryMaxWatchSrc).load(function(){
                galleryMaxWatch.find(".gallery-watch-loading").css('display','none');
                galleryMaxWatch.find(".gallery-watch-max").addClass("gallery-actived");
                galleryMaxWatch.find(".gallery-watch-describte-title").text(_self.parent().parent().find(".gallery-describtion-title").text());
                galleryMaxWatch.find(".gallery-watch-describte-content").text(_self.parent().parent().find(".gallery-describtion-content").text());
            });
        });
        $(window).delegate(".gallery-watch-span,.gallery-watch-close", "click", function () {
            $("body").find(".gallery-watch-maxImg").fadeOut(_opt.fadeTime,function(){
                $("body").find(".gallery-watch-maxImg").remove();
                galleryAutoPlay(_opt.waiteTime);
            });
        });
    }


		//鼠标移入图片，关闭自动切换
	function toggleAutoSlide(){
		_this.find(".gallery-images-item").hover(function(){
			clearInterval(galleryInterval);
		},function(){
			galleryAutoPlay(_opt.waiteTime);
		})
	}
}