
var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址

//刷新函数
function windowFresh(){
    location.reload(true);
}

var pageNum = 1; //页码全局变量
var upcInfo = new Vue({
    el:'body',
    data:{
        upcInfo:'',
        countPage:'',    //总页数
        pageNow:'',     //当前页
        Allupc:'',      //全部UPC
        usedUpc:'',     //已使用UPC
        lockedUpc:'',   //已锁定的UPC
        upc:'',          //未使用的UPC
        prePageBtn:'',
        nextPageBtn:'',
        jump:'',
        jumpBtn:''
        
    },
    //拉取第一页
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

        $.ajax({
            type: "POST",
            url: serverUrl+"get/upc", //添加请求地址的参数
            dataType: "json",
            data:{
                pageNum:pageNum
            },
            success: function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    upcInfo.upcInfo = data.value;
                    upcInfo.countPage = data.count;
                    upcInfo.pageNow = data.pageNow;
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
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求失败');
            }
        })
    },
    computed:{
        //上一页按钮
        prePageBtn:function(){
            var pageNow = this.pageNow;
            if(pageNow<=1){
                return true
            }else{
                return false
            }
        },
        //下一页按钮
        nextPageBtn:function(){
            var pageNow = this.pageNow;
            var countPage = this.countPage;
            if(pageNow==countPage){
                return true
            }else{
                return false
            }
        },
        //三个按钮状态
        jumpBtn:function(){
            var jump = this.jump;
            if(!jump){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        //上一页
        goPrePage:function(){
            var pageNow = this.pageNow;
            if(pageNow<=1){
                layer.msg('没有上一页啦');
            }else{
                pageNow--
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type: "POST",
                    url: serverUrl+"get/upc", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        pageNum:pageNow
                    },
                    success: function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            upcInfo.upcInfo = data.value;
                            upcInfo.countPage = data.count;
                            upcInfo.pageNow = data.pageNow;
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
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //下一页
        goNextPage:function(){
            var pageNow = this.pageNow;
            var countPage = this.countPage;
            if(pageNow==countPage){
                layer.msg('没有下一页啦');
            }else{
                pageNow++
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type: "POST",
                    url: serverUrl+"get/upc", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        pageNum:pageNow
                    },
                    success: function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            upcInfo.upcInfo = data.value;
                            upcInfo.countPage = data.count;
                            upcInfo.pageNow = data.pageNow;
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
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //跳转
        goJump:function(){
            var jump = this.jump;
            var countPage = this.countPage;
            if(jump>countPage){
                layer.msg('大于总页数啦');
                this.jump = '';
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type: "POST",
                    url: serverUrl+"get/upc", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        pageNum:jump
                    },
                    success: function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            upcInfo.upcInfo = data.value;
                            upcInfo.countPage = data.count;
                            upcInfo.pageNow = data.pageNow;
                            upcInfo.Allupc = data.allupc;
                            upcInfo.usedUpc = data.usedupc;
                            upcInfo.lockedUpc = data.lockedupc;
                            upcInfo.upc = data.upc;
                            upcInfo.jump = '';
                        }else if(data.status==101){
                            layer.msg('获取UPC失败');
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }else if(data.status==110){
                            layer.msg('没有UPC');
                        }
                    },
                    error: function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        }
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
            url: serverUrl+"get/upc", //添加请求地址的参数
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
        url: serverUrl+'post/upc',
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
