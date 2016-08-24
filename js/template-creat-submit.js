//提交数据
$('.temp-edit .btn-submit').on('click',function(){
	$template_id = $('.temp-info .cate-id').val();
    var oList = new Array();
    var cnNameArr = new Array();
    var enNameArr = new Array();
    var dataType = new Array();
    var charLength = new Array();
    
    $oTableLength = $('.temp-edit .table tr').length;
    for($i=0;$i<$oTableLength;$i++){
        oList[$i] = $('.temp-edit .table tr').eq($i).find('.temp-index').text();
        cnNameArr[$i] = $('.temp-edit .table tr').eq($i).find('.cn-name > input').val();
        enNameArr[$i] = $('.temp-edit .table tr').eq($i).find('.en-name > input').val();
        dataType[$i] = $('.temp-edit .table tr').eq($i).find('.input1').val();
        charLength[$i] = $('.temp-edit .table tr').eq($i).find('.input2').val();
    }
    if ($oTableLength==0) {
    	layer.msg("请先添加条目");
    }else{
    	$.ajax({
    	    type: "POST",
    		url: "http://192.168.1.40/PicSystem/canton/add/templateitem", //添加请求地址的参数
    		dataType: "json",
    		data:{
    			template_id:$template_id,
    			no:oList,
    			cn_name:cnNameArr,
    			en_name:enNameArr,
    			data_type_code:dataType,
    			length:charLength,
                type_code:Request.type_code,
                form_type_code:'text'
    		},
    		success: function(data){
    			if(data.status==101){
    				layer.msg('添加失败');
    			}else if(data.status==102){
    				layer.msg('参数错误');
    			}else if(data.status==103){
    				layer.msg('提交的内容中有重复');
    			}else if(data.status==104){
                    layer.msg('启用状态不可操作');
                }else if(data.status==100){
    				// layer.confirm('添加成功,关闭页面?', {
    				//   btn: ['关闭'] //按钮
    				// },function(){
    				//     window.close();
    				// })
    				layer.msg('提交成功');
    				setInterval(closeWindow,2000);
    			}
    		},
    		error: function(jqXHR){     
    			alert("向服务器请求错误");
    		}
    	})
    }
});