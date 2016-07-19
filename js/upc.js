var pageNum = 1; //页码全局变量
var upcInfo = new Vue({
    el:'body',
    data:{
        upcInfo:'',
        count:''
    },
    methods:{
        //上一页
        pre:function(){
            if(pageNum==1||pageNum<=0){
                layer.msg('没有上一页啦');
            }else {
                pageNum--;
                $.ajax({
                    type: "POST",
                    url: "http://192.168.1.42/canton/index.php/get/upc", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        pageNum:pageNum
                    },
                    success: function(data){
                        if(data.status==100){
                            upcInfo.upcInfo = data.value;
                            $('.upcCtr .upcCount').text(pageNum);//更新页码
                            if(pageNum==1||pageNum<=0){
                                $('.oPager > .btn').eq(0).addClass('disabled');
                            }
                        }
                    },
                    error: function(jqXHR){     
                        layer.msg('向服务器请求失败');
                        pageNum = pageNum + 1;//请求失败后加回去
                    }
                })
            }
        },
        //下一页
        next:function(){
            pageNum++;
            if(pageNum>this.count){
                pageNum = pageNum-1;//把上面加的1减回去
                layer.msg('最后一页啦');
            }else {
                $.ajax({
                    type: "POST",
                    url: "http://192.168.1.42/canton/index.php/get/upc", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        pageNum:pageNum
                    },
                    success: function(data){
                        if(data.status==100){
                            upcInfo.upcInfo = data.value;
                            $('.upcCtr .upcCount').text(pageNum);//更新页码
                            $('.oPager > .btn').eq(0).removeClass('disabled');//上一页可操作
                        }
                    },
                    error: function(jqXHR){     
                        layer.msg('向服务器请求失败');
                        pageNum = pageNum - 1;//请求失败后减回去
                    }
                })
            }
        }
    },
    //拉取第一页
    ready:function(){
        $.ajax({
            type: "POST",
            // url: "http://192.168.1.42/canton/index.php/get/upc", //添加请求地址的参数
            url: "http://192.168.1.40/PicSystem/canton/get/upc", //添加请求地址的参数
            dataType: "json",
            data:{
                pageNum:pageNum
            },
            success: function(data){
                if(data.status==100){
                    upcInfo.upcInfo = data.value;
                    upcInfo.count = data.count;
                }else if(data.status==101){
                    layer.msg('获取UPC失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }
            },
            error: function(jqXHR){     
                layer.msg('向服务器请求失败');
            }
        })
    }
})

//跳转
$('.upcCtr .btn-jump').on('click',function(){
    $oPageNum = $('.upcCtr .pageNum').val();
    if($oPageNum<=1){
        layer.msg('输入的页码错误');
        $('.upcCtr .pageNum').val('');
    }else if($oPageNum>upcInfo.count) {
        layer.msg('不存在那么多页数');
    }else {
        $.ajax({
            type: "POST",
            url: "http://192.168.1.42/canton/index.php/get/upc", //添加请求地址的参数
            dataType: "json",
            data:{
                pageNum:$oPageNum
            },
            success: function(data){
                if(data.status==100){
                    pageNum = $oPageNum;//全局变量值改变
                    upcInfo.upcInfo = data.value;
                    $('.upcCtr .upcCount').text(pageNum);//更新页码
                    $('.oPager > .btn').eq(0).removeClass('disabled');//上一页可操作
                    $('.upcCtr .pageNum').val('');
                }else if(data.status==101){
                    layer.msg('获取UPC失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }
            },
            error: function(jqXHR){     
                layer.msg('向服务器请求失败');
            }
        })
    }
});