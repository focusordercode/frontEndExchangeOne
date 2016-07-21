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


$(document).ready(function(){
	var oTempID = Request.template_id;
	var oCategory_id = Request.category_id;
	var oType_code = Request.type_code;

	//当前页面跳转
	function CreatOk() {
		window.location.href="Product-creat.html";
	}

	//创建表格信息发送
	$('.temp-info .btn-Creat').on('click',function(){
		var oTitle = $('.temp-info .table-title').val();
		if(!oTitle){
			layer.msg('表格名为空');
		}else{
			$.ajax({
			    type: "POST",
			    url: "http://192.168.1.42/canton/index.php/add/infoform", //添加请求地址的参数
			    dataType: "json",
			    timeout:5000,
			    data:{
			        template_id:oTempID,
			        category_id:oCategory_id,
			        type_code:oType_code,
			        title:oTitle,
			        client_id:'', 	//暂无留空
			        creator_id:'' 	//暂无留空
			    },
			    success: function(data){
			        if(data.status==100){
			        	$('.temp-info .table-title').val('');//清空表格名
			        	var oTableID = data.id;
			        	layer.alert('创建成功', function(yes){
			        		var url = 'Product-creat.html?'+'template_id='+oTempID+'&type_code='+oType_code+'&oTableID='+oTableID;
			        		window.location.href = url;
			        	});
			        }else if(data.status==101){
			        	layer.msg('创建失败');
			        }else if(data.status==103){
			        	layer.msg('类目错误');
			        }else if(data.status==104){
			        	layer.msg('模板错误');
			        }else if(data.status==105){
			        	layer.msg('表格名为空');
			        }
			    },
			    error: function(jqXHR){     
			        layer.msg('向服务器请求失败');
			    }
			})
		}
	});

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
	        url: "http://192.168.1.42/canton/index.php/vague/name", //添加请求地址的参数
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
});