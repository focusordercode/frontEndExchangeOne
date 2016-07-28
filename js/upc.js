//刷新函数
function windowFresh(){
    location.reload(true);
}

var pageNum = 1; //页码全局变量
var upcInfo = new Vue({
    el:'body',
    data:{
        upcInfo:'',
        count:'',       //总页数
        Allupc:'',      //全部UPC
        usedUpc:'',     //已使用UPC
        lockedUpc:'',   //已锁定的UPC
        upc:''          //未使用的UPC
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
            url: "http://192.168.1.42/canton/index.php/get/upc", //添加请求地址的参数
            // url: "http://192.168.1.40/PicSystem/canton/get/upc", //添加请求地址的参数
            dataType: "json",
            data:{
                pageNum:pageNum
            },
            success: function(data){
                if(data.status==100){
                    upcInfo.upcInfo = data.value;
                    upcInfo.count = data.count;
                    upcInfo.Allupc = data.allupc;
                    upcInfo.usedUpc = data.usedupc;
                    upcInfo.lockedUpc = data.lockedupc;
                    upcInfo.upc = data.upc;
                }else if(data.status==101){
                    layer.msg('获取UPC失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }else if(data.status==110){
                    layer.msg('没有UPC');
                }
            },
            error: function(jqXHR){     
                layer.msg('向服务器请求失败');
            }
        })
    }
})
//Vue过滤器
Vue.filter('UseTime',function(value){
    if(value==null){
        value = '未使用'
    }
    return value
})
Vue.filter('lockStatus',function(value){
    switch(value){
        case '0': value='未锁定';break;
        case '1': value='已锁定';break;
    }
    return value
})


//跳转
$('.upcCtr .btn-jump').on('click',function(){
    $oPageNum = $('.upcCtr .pageNum').val();
    if($oPageNum<1){
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

//UPC上传
$('#upload').on('click',function(){
    var formData = new FormData();
    formData.append('file', $('#file')[0].files[0]);
    $.ajax({
        url: 'http://192.168.1.42/canton/index.php/post/upc',
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false
    }).done(function(res) {
        if(res.status==100){
            // layer.alert('上传成功!'+'文件中已存在的UPC:'+res.value.same_upc+'&nbsp;添加成功的UPC:'+res.value.inserted+'');

            layer.alert('上传成功!'+'文件中已存在的UPC:'+res.value.same_upc+'&nbsp;添加成功的UPC:'+res.value.inserted+'', function(yes){
                windowFresh();
            }); 
        }else if(res.status==102){
            layer.msg('没有文档上传');
        }else if(res.status==103){
            layer.msg('文件类型不符合要求');
        }else if(res.status==104){
            layer.msg('上传文件大小超过1M');
        }else if(res.status==105){
            layer.msg('文档upc格式不符合要求');
        }
    }).fail(function(res) {
        layer.msg('上传失败');
    });
});
