//获取标签
$checkedLabel = $('.category-content .checkboxFour label');
$selectPic = $('.category-pic .caption .category-select-pic');
$btnCtr = $('.control-pic .control-button-1 .btn');

$checkedLabel.click(function(){
    $checkedLabel.toggleClass('checked');//checkbox选中
    $hasClass = $checkedLabel.hasClass('checked');//如果checkedLabel有这个class返回布尔值
    if ($hasClass) {
        $selectPic.show();
    }else{
        $selectPic.hide();
        $selectPic.hide().prop("checked",false);
        $btnCtr.attr("disabled",true);
    }
});

//选中后可操作
$selectPic.on('click',function(){
    $hasChecked = $selectPic.is(':checked');
    if($hasChecked){
        //选中的时候的操作
        $btnCtr.attr("disabled",false);    
    }else{
        //未选中的时候的操作
        $btnCtr.attr("disabled",true);
    }
});

    //弹层交互操作

//单个相册询问是否删除
$('.category-content .btn-delete').on('click',function(){
	$oCategory = $(this).closest('ul.category-pic');//获取元素所在的相册
	$oLiindex = $(this).closest('li').index();//获取相册元素容器的索引
	// alert($oLiindex);
    layer.confirm('确定删除相册和相册下的子相册？', {
      btn: ['删除','取消'] //按钮
    },function(yes){
    	$.ajax({
		    type: "GET", 	
			url: "http://192.168.1.42/test/index.php/log", //添加请求地址的参数
			dataType: "json",
			timeout: 5000,
			success: function(data){
				if (data.status==438) {
					$oCategory.find('li').eq($oLiindex).hide(500);
					layer.msg('删除成功');
				}
			},
			error: function(jqXHR){     
				layer.msg('服务器请求错误');
			},
    	})    
    }
)
});
//图片信息
$('.category-content .btn-msg').on('click',function(){
    layer.open({
      title:'XXX图片信息',  
      type: 1,
      skin: 'css/index.css', //样式类名
      closeBtn: 0, //不显示关闭按钮
      shift: 2,
      shadeClose: true, //开启遮罩关闭
      content: '图片信息'
    });
});
//修改文件名
$('.category-content .btn-name').on('click',function(){
    $this = $(this);
    var fileName1 = $(this).parent("p").prev("h4").text();//获取文件名
    $extension = fileName1;
    layer.prompt({
        title:'输入修改的文件名',
        value:$extension,
        formType: 0,
        maxlength: 20,
        shadeClose: true
    },function(val){
        var values = val;//把文件后缀加回去
        layer.msg('修改成功'+values);
        $this.parent("p").prev("h4").text(values);
    });   
});