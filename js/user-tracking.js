console.log(serverUrl);

var userlist = new Vue({
	el:'body',
	data:{
		list:'',
        count:'',//统计所有的数据
        countPage:'',
        pageNow:'',
        jump:'',
        searchFeild:{
            status_code:'',
            keyword:'',
            cate_name:'',
            cateId:''
        }
	},
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:serverUrl+'get/track',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    userlist.list = data.value;
                    userlist.count = data.countTrack;
                    userlist.pageNow = data.pageNow;
                    userlist.countPage = data.countPage;
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求失败');
            }
        })
    },
    computed:{
        //三个按钮状态
        jumpBtn:function(){
            var jump = this.jump;
            if(!jump){
                return true
            }else{
                return false
            }
        },
        prePageBtn:function(){
            var pageNow = this.pageNow;
            if(pageNow<=1){
                return true
            }else{
                return false
            }
        },
        nextPageBtn:function(){
            var pageNow = this.pageNow;
            var countPage = this.countPage;
            if(pageNow==countPage||countPage==0){
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        //删除
        remove:function(info){
            var Id = info.id,
                vm = this;
            var search = vm.searchResult;
            var pageNow = vm.pageNow;

            layer.confirm('是否确认删除?', {
              btn: ['确定','关闭'] //按钮
            },function(index){
                layer.close(index);
                $.ajax({
                    type: "POST",
                    url: serverUrl+"delete/track", 
                    dataType: "json",
                    data:{
                        key:oKey,
                        user_id:token,
                        id:Id
                    },
                    success: function(data){
                        if(data.status==100){
                            vm.list.$remove(info);
                            layer.msg('删除成功');
                            setTimeout(getPageData(vm,pageNow,search),1000);
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            
                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error: function(jqXHR){     
                        layer.msg('向服务器请求失败');
                    }
                })
            })
        },
        //刷新
        Reflesh:function(){
            location.reload(true);
        },
        //上一页
        goPrePage:function(){
            var pageNow = this.pageNow;
            var search = this.searchResult;
            var vm = this;
            if(pageNow<=1){
                layer.msg('没有上一页啦');
            }else{
                pageNow--
                getPageData (vm,pageNow,search);
            }
        },
        //下一页
        goNextPage:function(){
            var pageNow = this.pageNow;
            var countPage = this.countPage;
            var search = this.searchResult;
            var vm = this;
            if(pageNow==countPage){
                layer.msg('没有下一页啦');
            }else{
                pageNow++
                getPageData (vm,pageNow,search);
            }
        },
        //页面跳转
        goJump:function(){
            var jump = this.jump;
            var countPage = this.countPage;
            var search = this.searchResult;
            var vm = this;
            if(jump>countPage){
                layer.msg('大于总页数啦');
                vm.jump = '';
            }else if (jump<=0){
                layer.msg('页码错误');
                vm.jump = '';
            }else{
                getPageData (vm,jump,search);
                vm.jump = '';
            }
        }
    }
})


//获取数据函数,分页
function getPageData (vm,pageNow,search) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type:'POST',
        url:serverUrl+'get/track',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            page:pageNow
        },
        success:function(data){
            layer.close(LoadIndex); //关闭遮罩层
            if(data.status==100){
                vm.list = data.value;
                vm.count = data.countTrack;
                vm.pageNow = data.pageNow;
                vm.countPage = data.countPage;
            }else{
                layer.msg(data.msg);
            }
        },
        error:function(jqXHR){
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    })
}

//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
})

//刷新函数
function windowFresh(){
    location.reload(true);
}