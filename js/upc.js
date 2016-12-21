
console.log(serverUrl); //后端接口地址

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
        jump:''
        
    },
    //拉取第一页
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

        $.ajax({
            type: "POST",
            url: serverUrl+"get/upc", //添加请求地址的参数
            dataType: "json",
            data:{
                key:oKey,
                user_id:token,
                pageNum:pageNum
            },
            success: function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    upcInfo.upcInfo = data.value;
                    upcInfo.countPage = data.count; //总页数
                    upcInfo.pageNow = data.pageNow; //当前页
                    upcInfo.Allupc = data.allupc;  //全部UPC
                    upcInfo.usedUpc = data.usedupc; //已使用UPC
                    upcInfo.lockedUpc = data.lockedupc; //已锁定的UPC
                    upcInfo.upc = data.upc;
                }else if(data.status==101){
                    layer.msg('获取UPC失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }else if(data.status==110){
                    layer.msg('没有UPC');
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});

                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
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
        //跳转按钮
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
            var vm = this;
            var pageNow = this.pageNow;
            if(pageNow<=1){
                layer.msg('没有上一页啦');
            }else{
                pageNow--
                getPageData(vm,pageNow);
            }
        },
        //下一页
        goNextPage:function(){
            var vm = this;
            var pageNow = this.pageNow;
            var countPage = this.countPage;
            if(pageNow==countPage){
                layer.msg('没有下一页啦');
            }else{
                pageNow++
                getPageData(vm,pageNow);
            }
        },
        //跳转
        goJump:function(){
            var vm = this;
            var jump = this.jump;
            var countPage = this.countPage;
            if(jump>countPage){
                layer.msg('大于总页数啦');
                this.jump = '';
            }else if (jump<=0){
                layer.msg('页码错误');
                vm.jump = '';
            }else{
                getPageData(vm,jump);
                vm.jump = '';
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

//刷新函数
function windowFresh(){
    location.reload(true);
}

//获取数据函数,分页
function getPageData(vm,pageNow) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type: "POST",
        url: serverUrl+"get/upc", //添加请求地址的参数
        dataType: "json",
        data:{
            key:oKey,
            user_id:token,
            pageNum:pageNow
        },
        success: function(data){
            layer.close(LoadIndex); //关闭遮罩层
            if(data.status==100){
                vm.upcInfo = data.value;
                vm.countPage = data.count;
                vm.pageNow = data.pageNow;
                vm.Allupc = data.allupc;
                vm.usedUpc = data.usedupc;
                vm.lockedUpc = data.lockedupc;
                vm.upc = data.upc;
            }else if(data.status==101){
                layer.msg('获取UPC失败');
            }else if(data.status==102){
                layer.msg('参数错误');
            }else if(data.status==110){
                layer.msg('没有UPC');
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
        },
        error: function(jqXHR){
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    })
}

//UPC上传
$('#upload').on('click',function(){
    var fileData = $('#file').val();
    if(!fileData){
        layer.msg('请先选择文件');
    }else{
        var formData = new FormData();
        formData.append('file', $('#file')[0].files[0]);
        formData.append('key', oKey);//参数
        formData.append('user_id', token);//参数
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层 
        $.ajax({
            url: serverUrl+'post/upc',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function(res) {
            layer.close(LoadIndex); //关闭遮罩层
            if(res.status==100){
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
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
        }).fail(function(res) {
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('上传失败');
        });
    }
});
