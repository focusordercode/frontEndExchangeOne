//打开模态框
$('.modal').modal('show');
$('.modal').css('margin-top','200px');
//模糊搜索获取类目
$(document).on('keyup','.modal .proCate .search-cate',function(){
    var oText = $('.modal .proCate .search-cate').val();
    var inputWidth = $('.modal .proCate .search-cate').innerWidth();
    $('.modal .proCate ul').show();
    $('.modal .proCate ul').width(inputWidth);
    $.ajax({
        type:'POST',
        url:'http://192.168.1.40/PicSystem/canton/vague/imagename',
        datatype:'json',
        data:{
            keyword:oText
        },
        success:function(data){
            if(data.status==100){
                var $cateList = data.value;
                $('.modal .proCate ul li').remove();
                for($i=0;$i<$cateList.length;$i++){
                    $str = '<li name="'+$cateList[$i].id+'">'+$cateList[$i].cn_name+$cateList[$i].en_name+'</li>';
                    $('.modal .proCate ul').append($str);
                }
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求搜索失败');
        }
    })
});

//点击选中
$(document).on('click','.modal .proCate ul li',function(){
    var oCateID = $(this).attr('name');
    var oGallery = $('.modal .proCate .search-cate');
    $('.modal .proCate .search-cate').attr('name',oCateID);
    $('.modal .proCate .search-cate').val($(this).text());
    $('.modal .proCate ul li').remove();
});
//点击确定选好分页
$(document).on('click','.modal .modal-footer .btn',function(){
    var oGallery = $('.modal .proCate .search-cate');
    var oGallery_id = oGallery.attr('name');
    var oUrl = 'picUpload.html?id='+oGallery_id;
    if(!oGallery_id){
        layer.msg('请先选择分类');
    }else{
        window.open(oUrl);
        window.close();
    }
});