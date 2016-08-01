//全选操作，并且全选后操作按钮可用
$(function(){
    $('.select-all .checkboxFour').click(function(){
        $('.checkboxFour label').toggleClass("checked");
        var hasClass = $('.select-all .checkboxFour label').hasClass("checked");
        if (hasClass) {
            $('.pic-content .select-pic').prop("checked",true);
            $('.control-pic .control-button-1 .btn').attr("disabled",false);
        }else {
           $('.pic-content .select-pic').prop("checked",false);
           $('.control-pic .control-button-1 .btn').attr("disabled",true); 
        }
    }); 
});

$('.pic-content .select-pic').on('click',function(){
    var hasChecked = $('.pic-content .select-pic').is(':checked');
    checkedALL();
    if(hasChecked){
        //选中的时候的操作
        $('.control-pic .control-button-1 .btn').attr("disabled",false);    
    }else{
        //未选中的时候的操作
        $('.control-pic .control-button-1 .btn').attr("disabled",true);
        $('.checkboxFour label').removeClass("checked");
    }
});
//检测列表下面选中所有的函数
function checkedALL(){
    var checkedNum = 0;
    var len = $('.pic-content input[type="checkbox"]').length;
    for($i=0;$i<len;$i++){
        if($('.pic-content input[type="checkbox"]:eq('+$i+')').prop("checked")==true){
            checkedNum += 1;
        }
    }
    if(checkedNum<len){
        $('.select-all .checkboxFour label').removeClass("checked");
    }else{
        $('.select-all .checkboxFour label').addClass("checked");
    }
}

//单个图片询问是否删除
$('.pic-content .btn-delete').on('click',function(){
    layer.confirm('确定删除图片？', {
      btn: ['删除','取消'] //按钮
    },function(){
        layer.msg('删除成功');    
    }
)
});
//图片信息
$('.pic-content .btn-msg').on('click',function(){
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
$('.pic-content .btn-name').on('click',function(){
    $this = $(this);
    var fileName1 = $(this).parent("p").prev("h4").text();//获取文件名
    $extension = (fileName1.split("."))[0];//分割字符串去除文件后缀字符串
    layer.prompt({
        title:'输入修改的文件名',
        value:$extension,
        formType: 0,
        maxlength: 20,
        shadeClose: true
    },function(val){
        var values = val+"."+(fileName1.split("."))[1];//把文件后缀加回去
        layer.msg('修改成功'+values);
        $this.parent("p").prev("h4").text(values);
    });   
});