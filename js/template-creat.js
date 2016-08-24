//获取地址栏参数
function UrlSearch() {
    var name,value; 
    var str=location.href; 
    var num=str.indexOf("?");
    str=str.substr(num+1);
    
    var arr=str.split("&"); 
    for(var i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        } 
    } 
} 
var Request=new UrlSearch();


//关闭页面函数
function closeWindow(){
    window.close();
}
//模糊搜索
var oCateID;
$oCateInput = $('.temp-info .temp-belong');
$oCateInput.keyup(function(){
    $oCateText = $.trim($('.temp-info .temp-belong').val());
    if($oCateText==''){
        oCateID=0;
    }
    $.ajax({
        type: "POST",    
        url: "http://192.168.1.40/PicSystem/canton/index.php/vague/name", //添加请求地址的参数
        dataType: "json",
        data: {
            text:$oCateText
        },
        success: function(data){
            if (data.status==100) {
                $cateList = data.value;
                $('.temp-info .cateList li').remove();
                for($i=0;$i<$cateList.length;$i++){
                    $str = '<li name="'+$cateList[$i].id+'">'+$cateList[$i].cn_name+$cateList[$i].en_name+'</li>';
                    $('.temp-info .cateList').append($str);
                }
            }else{
                $('.temp-info .cateList li').remove();
            }
        },
        error: function(jqXHR){     
            layer.msg("获取分类失败");
        }
    })
});

$(document).on('click','.temp-info .cateList li',function(){
    oCateID = $(this).attr('name');
    $oCateInput = $('.temp-info .temp-belong');
    $oCateInput.val($(this).text());
    $('.temp-info .cateList li').remove();
});


//创建模板信息
$('.temp-info-xg .btn-xg').click(function(){
    $InfoCnName = $('.temp-info-xg .cn-name').val();
    $InfoEnName = $('.temp-info-xg .en-name').val();
    $InfocateId = $('.temp-info-save .temp-belong').val();
    $InfoRemark = $('.temp-info-xg .remark').val();
    var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;
    if(!$InfoCnName||!$InfoEnName||!$InfoRemark){
    	layer.msg('请填写完整的内容');
    	$('.temp-info-xg .form-group').addClass('has-error');
    }else if(!Entext.test($InfoEnName)){
        layer.msg('英文名只能包含英文数字空格');
    }else{
    	$.ajax({
    	    type: "POST",    
    	    url: "http://192.168.1.40/PicSystem/canton/add/template", //添加请求地址的参数
    	    dataType: "json",
    	    data: {
    	        cn_name:$InfoCnName,
    	        en_name:$InfoEnName,
    	        remark:$InfoRemark,
                type_code:Request.type_code,
                category_id:oCateID
    	    },
    	    success: function(data){
    	        if (data.status==100) {
    	            layer.msg("提交成功");
                    setInterval(closeWindow,2000);
    	        }else if(data.status==101){
                    layer.msg('错误失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }else if(data.status==103){
                    layer.msg('重复操作!');
                }else if(data.status==104){
                    layer.msg('启用状态下不可操作');
                }
    	    },
    	    error: function(jqXHR){     
    	        layer.msg("请求服务器错误");
    	    }
    	})
    }
});
