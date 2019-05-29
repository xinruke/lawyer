// 全局函数
function onError(obj, value, attr)
{
    attr = ("undefined" == typeof(attr)) ?'src' :attr;
    if ("object" != typeof(obj))  return false;
    $(obj).attr(attr, value);
    $(obj).attr('onerror', null);
}

// IE 下兼容 placeholder
  $(document).ready(function(){   
   var doc=document,
    inputs=doc.getElementsByTagName('input'),
    supportPlaceholder='placeholder'in doc.createElement('input'),
    
    placeholder=function(input){
     var text=input.getAttribute('placeholder'),
     defaultValue=input.defaultValue;
     if(defaultValue==''){
        input.value=text
     }
     input.onfocus=function(){
        if(input.value===text)
        {
            this.value=''
        }
      };
     input.onblur=function(){
        if(input.value===''){
            this.value=text
        }
      }
  };
  if(!supportPlaceholder){
     for(var i=0,len=inputs.length;i<len;i++){
          var input=inputs[i],
          text=input.getAttribute('placeholder');
          if(input.type==='text'&&text){
             placeholder(input)
          }
      }
  }
 });
$(function(){
    $(".nav>li").hover(function(){
        $(this).find(".sec").slideDown();
        //$(this).find(".sec").fadeIn();
    },function(){
        $(this).find(".sec").slideUp();
        //$(this).find(".sec").fadeOut();
    })
    //col下无内容，则删除wgc
    $(".wrap").each(function(){
        if(!$(this).find('div').is('.col')){
            $(this).remove();
        }
    });
});
