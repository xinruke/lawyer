/**
 * @ home aks js v 1.0.0 注意付费咨询：电脑网站微信二维码基于 WxPcPay.init()
 * @ writer:huanggongqiang time/20160825
 */
$('#questionbtn').click(function(){
	var but           = $('#questionbtn'),
        quest_content = $('#quest_content').val(), // 留言内容
        quest_mobile  = $('#quest_mobile').val(),  // 联系方式
        quest_name    = $('#quest_name').val(),	   // 名称
        quest_code    = $('#quest_code').val(),    // 验证码
        qid = '',
        pay = '',
        asktype = '';

	if (!quest_content) {
		alert('案件咨询内容不能为空 ');
        $('#quest_content').focus();
		return false;
	}
	if (quest_content.length < 10 || quest_content.length > 500) {
		alert('案件咨询内容，请输入10~500个字符！');
        $('#quest_content').focus();
		return false;
	}
	if (!quest_name) {
		alert('您的名称不能为空 ');
        $('#quest_name').focus();
		return false;
	}
    if (quest_name.length < 2 || quest_name.length > 30) {
		alert('您的名称，请输入2~30个字符！');
        $('#quest_name').focus();
		return false;
	}
	if (!quest_mobile) {
		alert('为了律师更好的解答您的疑惑，请留下您的手机号码！');
        $('#quest_mobile').focus();
		return false;
	}

	var myreg = /^1[3|4|5|7|8]\d{9}$/,
        tplreg= /^\d{3}(-|\s)\d{8}$|^\d{4}(-|\s)\d{7}$/;
		
	if(!myreg.test(quest_mobile)) 
	{ 
		alert('请输入有效的手机号码！'); 
        $('#quest_mobile').focus();
		return false; 
	} 
	if (!quest_code) {
		alert('请填写四位验证码！');
        $('#quest_code').focus();
		return false;
	}
    
    // 提交按钮
    if (but.val()) {
        but.val('正在提交...');
    } else {
        but.text('正在提交...');
    }
    
    if (but.attr('asktype') == 1) {
        qid = but.attr('qid');
        pay = but.attr('pay');
    }
    
	but.attr('disabled',true);
	$.ajax({
		type: "POST",
		url: "/ask/index.php?m=Ask&c=Question&a=addQuestion",
		data: { 'content':quest_content,'mobile':quest_mobile,'name':quest_name,'code':quest_code,'qid':qid,'pay':pay },
		dataType: "json",
		success: function(add_data) {
            // 提交按钮
            if (but.val()) {
                but.val('提交咨询');
            } else {
                but.text('提交咨询');
            }
			but.removeAttr('disabled');
            var _src ='/ask/index.php?m=Ask&c=Question&a=Verify&rand=' + Math.random();
            $('#yz_code').attr('src', _src);
            
			if (add_data.code == 1) {
                
				$('#quest_content,#quest_mobile,#quest_name,#quest_code').val(''); // 清空填写内容
				alert(add_data.message);
                
			} else if (add_data.code == 2) {
                
                but.attr('qid', add_data.paydata.qid);
                but.attr('asktype', 1);
                
                if (add_data.type_site == 1) {
                    but.attr('pay', add_data.paydata.out_trade_no);
                    
                    // 电脑网站微信二维码支付窗口
                    WxPcPay.codePay(add_data.paydata, add_data.type_site, add_data.lay_tel);
                    WxPcPay.colseCodePay();
                    
                } else if (add_data.type_site == 3) {
                    but.attr('pay', add_data.paydata.pay);
                    
                    // 跳转支付页
                    window.location.href = add_data.paydata.url;
                }
                
			} else {
				alert(add_data.message);
			}
		},
		error: function() {
            // 提交按钮
            if (but.val()) {
                but.val('提交咨询');
            } else {
                but.text('提交咨询');
            }
			but.removeAttr('disabled');
            
			alert("请求失败");
		}
	});
});

/**
 * @ home WxPay js v 1.0.0
 * @ writer:huanggongqiang time/20160825
 */
var WxPcPay = function(){
	return {
		init:function(pm){
			
		},
        /**
		 * 微信二维码支付窗口
		 */
		codePay:function(pm, type, lay_tel){
            var obj = $("._inline-mask");
            if (obj.length < 1) {
                var html =  '<div class="wrap adjacent">'
                              +'<div class="grid over">'
                                  +'<div class="col">'
                                      +'<div class="_inline-mask show">'
                                          +'<div class="payinfo-content">'
                                              +'<h3 class="payinfo-head">支付咨询费用<span class="close-pay-content"></span></h3>'
                                              +'<div class="main">'
                                                  +'<div class="pay-info active">'
                                                      +'<div class="left">'
                                                          +'<p>支付方式：<img src="http://img1.wanglv.vip/images/tpl/pc/wchart-img.png" alt="">微信支付</p>'
                                                          +'<p>购买服务：收费咨询</p>'
                                                          +'<p>应收金额：<em class="mk_pay_total_fee">￥'+pm.total_fee+'</em> 元</p>'
                                                      +'</div>'
                                                      +'<div class="right">'
                                                          +'<img  class="mk_pay_code_url" src="'+pm.code_url+'" alt="请使用微信扫描以完成支付">'
                                                          +'<p>请使用微信扫描以完成支付</p>'
                                                      +'</div>'
                                                  +'</div>'
                                                  +'<div class="success pay-success">'
                                                      +'<div class="left"><img src="http://img1.wanglv.vip/images/tpl/pc/pay-success.png"></div>'
                                                      +'<div class="right">'
                                                          +'<p class="suc">恭喜您，咨询提交成功。</p>'
                                                          +'<p style="font-size: 16px;">我会尽快回复您，请保持您的电话畅通。<br>如果1天之内没收到回复，您可以直接拨打<br>电话：'+lay_tel+'</p>'
                                                          +'<button class="close-pay-button">关闭</button>'
                                                      +'</div>'
                                                  +'</div>'
                                                  +'<div class="fail pay-fail">'
                                                      +'<div class="left"><img src="http://img1.wanglv.vip/images/tpl/pc/pay-fail.png"></div>'
                                                      +'<div class="right">'
                                                          +'<p class="suc">支付失败！</p>'
                                                          +'<p>请刷新页面，重新提交！</p>'
                                                          +'<button class="close-pay-button">关闭</button>'
                                                      +'</div>'
                                                  +'</div>'
                                              +'</div>'
                                          +'</div>'
                                      +'</div>'
                                  +'</div>'
                              +'</div>'
                          +'</div>';
                $(html).appendTo('body');
            } else {
                $(".mk_pay_total_fee").text("￥"+ pm.total_fee);
                $(".mk_pay_code_url").attr("src", pm.code_url);
                $("._inline-mask").addClass("show");
                $(".pay-info").addClass("active");
            }
            
            WxPcPay.getWxpayRespond(pm, type);
		},
		/**
		 * 微信二维码支付 关闭弹层 显示:tierok,失败:tiererr
		 */
		colseCodePay:function(){
			$(".close-pay-content,.close-pay-button").live("click", function(){
                $(this).parents().find("._inline-mask").removeClass("show");
                $(this).parents().find("._inline-mask").find(".main>div").removeClass("active");
            });
		},
        /**
		 * 获取支付状态
		 */
		getWxpayRespond:function(pm, type){
            var time   = 3000,
                status = 0,
                num    = 0,
                T      = false,
                url    = "/ask/index.php?m=Ask&c=Question&a=getWxpayRespond",
                qid    = pm.qid,
                sign   = pm.sign,
                out_trade_no = pm.out_trade_no;
                
            function getSuccess() {
                
                if (status != 0 || num==300) {
                    clearInterval(T);
                    return false;
                }
                
                setIntTime(num);
                
                $.ajax({
                    type: "POST",
                    url : url,
                    data: { "qid": qid, "out_trade_no": out_trade_no, "sign": sign },
                    dataType: "json",
                    success: function(info) {
                        
                        num++;
                    
                        if (info.code == 1) {
                            $(".pay-info").removeClass("active");
                            $(".pay-success").addClass("active");
                            $('#quest_content,#quest_mobile,#quest_name,#quest_code').val(''); // 清空填写内容
                            status = 1;
                            clearInterval(T); // 停止执行
                            
                            return true;
                            
                        } else if (info.code == 2) {
                            $(".pay-info").removeClass("active");
                            $(".pay-fail").addClass("active");
                            
                            clearInterval(T); // 停止执行
                            
                            status = 2;
                            return false;
                        }
                    }
                });
                
            }
            
            function setIntTime(num) {
                if (num==30) {
                    time = 5000;
                    clearInterval(T);
                    T = setInterval(getSuccess, time);
                } else if (num==100) {
                    time = 6000;
                    clearInterval(T);
                    T = setInterval(getSuccess, time);
                } else if (num==150) {
                    time = 10000;
                    clearInterval(T);
                    T = setInterval(getSuccess, time);
                } else if (num==260) {
                    time = 60000;
                    clearInterval(T);
                    T = setInterval(getSuccess, time);
                }
            } 
            T = setInterval(getSuccess, time);
            
            $(".close-pay-content,.close-pay-button").live("click", function(){
                clearInterval(T);
                $(this).parents().find("._inline-mask").removeClass("show");
                $(this).parents().find("._inline-mask").find(".main>div").removeClass("active");
            });
        }
	}
}();
