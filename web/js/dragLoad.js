/**
 * 初始化
 * 可用标签 {<URL>},{<TITLE>},{<CONTENT>},{<IMG>},{<YEAR>},{<DAY>},{<MONTH>},{<USERNAME>},{<CREATETIME>},{<QID>}
 *
 * var code = '<a href="{<URL>}"><h5>{<TITLE>}</h5> <p>{<CONTENT>}</p></a>';
 * loadData.init({
 *       limit: 5,
 *       class: ".article-list",
 *      siteid: '{?$_SITE.siteid?}',
 *       catid: '{?$_CAT.catid?}',
 *       code: code,
 * });
 *
 * @type {{beforeload: loadData.beforeload, load: loadData.load, afterload: loadData.afterload, debounce: loadData.debounce, init: loadData.init}}
 */
var loadData = {
    //数据加载之前...
    beforeload: function () {
        var svg = '<svg width="24" height="24" style="position:absolute" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#09f"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>'
        var loadSVG = $('<div id="svgloading" style="width:124px;height:24px; margin:0 auto; color:#000;">' + svg + '<span style="width:100px; display:inline-block;height:24px;line-height:24px;font-size:14px; position:absolute;margin-left:30px;z-index:-1;">加载中······</span></div>');
        $("body").append(loadSVG);
    },

    //数据加载函数
    load: function (options) {
        var _limit = options.limit;
        var _class = options.class;
        var _siteid = options.siteid;
        var _catid = options.catid;
        var _code = options.code;
        var _uid = options.uid;

        if ($("#dataPage").length == 0) {
            var dataPage = $('<input type="hidden"  value=2 id="dataPage" />');
            $("body").append(dataPage);
        }

        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var h = $(document).height() - $(window).height() - scrollTop;
        var loadDataLock = h <= 0 ? true : false;  //数据开关

        if (loadDataLock) {
            loaddata();
        }

        //具体加载
        function loaddata() {
            if (document.getElementById('noMore') !== null) {
                return false;
            }
            loadData.beforeload();
            var _page = $("#dataPage").val();
            $.ajax({
                type: "POST",
                url: "/home/?c=Ajax&a=loadList",
                data: {siteid: _siteid, catid: _catid, limit: _limit, page: _page, uid: _uid},
                dataType: "json",
                success: function (add_data) {
                    if (add_data.code == 1) {
                        var data = JSON.parse(add_data.data);
                        var dataLength = data.length;
                        var dataHtml = '';
                        for (var i = 0; i < dataLength; i++) {
                            var str = '';
                            var j = 0;
                            $.each(data[i], function (key, val) {
                                if (j == 0) {
                                    str = _code.replace("{<" + key + ">}", val);
                                } else {
                                    str = str.replace("{<" + key + ">}", val);
                                }
                                j++;
                                if (key == 'IMG' && !val) { //删除src为空的img标签
                                    str=str.replace(/<\s?img[^>]*>/gi,'');
                                }
                            });
                            dataHtml += str;
                        }
                        $(_class).append(dataHtml);
                        _page++;
                        $("#dataPage").val(_page);
                    } else {
                        var loadSVG = $('<div id="noMore" style="width:124px;height:24px; margin:0 auto; color:#000;"><span style="width:100px; display:inline-block;height:24px;line-height:24px;font-size:14px; position:absolute;margin-left:30px;z-index:-1;">' + add_data.message + '</span></div>');
                        $("body").append(loadSVG);
                    }
                    loadData.afterload();
                },
                error: function () {
                    alert("请求失败");
                }
            });

        }
    },
    //数据加载完成之后
    afterload: function () {
        $("#svgloading").remove();
    },
    //防高频调用函数
    debounce: function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    init: function (options) {
        var _data = this.debounce(function () {
            loadData.load(options);
        }, 500);  //防高频调用，500ms内只执行一次
        window.addEventListener('scroll', _data);
    }
}
