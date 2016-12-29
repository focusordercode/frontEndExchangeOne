console.log(serverUrl);
var num = 35;//默认显示数量

var userlist = new Vue({
	el:'body',
	data:{
		list:'',
        count:'',//统计所有的数据
        countPage:'',
        pageNow:'',
        jump:'',
        users:'',//用户列表
        searchFeild:{
            startdate:'',
            enddate:'',
            uid:'',
            uidName:''
        },
        selectedArr:[],
        searchResult:'' //搜索成功后的条件
	},
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:serverUrl+'get/track',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                pagesize:num
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
        },
        allChecked: {
            get: function() {
                return this.checkedCount == this.list.length;
            },
            set: function(value) {
                if (value) {
                  this.selectedArr = this.list.map(function(info) {
                    return info.id
                  })
                } else {
                  this.selectedArr = []
                }
            }
        },
        checkedCount: {
            get: function() {
                return this.selectedArr.length;
            }
        },
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
                            setTimeout(getPageData(vm,pageNow,search,num),1000);
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
                getPageData (vm,pageNow,search,num);
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
                getPageData (vm,pageNow,search,num);
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
                getPageData (vm,jump,search,num);
                vm.jump = '';
            }
        },
        //选择一个用户
        selectusr:function(usr){
            this.searchFeild.uid = usr.id;
            this.searchFeild.uidName = usr.username;
            this.users = '';
            $('.searchCompent').hide();
            $('.search-usrbtn').show();
        },
        //全选删除的条目
        
        // selectall:function(){
        //     // var all = $('.table td input');
        //     // for (var i = 0; i < all.length; i++) {
        //     //     if (all[i].is(':checked')) {
        //     //         all[i].attr('checked',false)
        //     //     }else{
        //     //         all[i].attr('checked',trues)
        //     //     }
        //     // }
        //     $('input[type="checkbox"]').prop("checked",true);
        // },
        //搜索
        searchInfo:function(){
            var vm = this;
            var startdate = this.searchFeild.startdate.trim();
            var enddate = this.searchFeild.enddate.trim();
            var searchFeild = this.searchFeild;

            if(!startdate&&!enddate&&!searchFeild.uid){
                layer.msg('时间和用户为必选其一');
            }else if(startdate&&!enddate){
                layer.msg('开始时间和结束时间都必须选');
            }else if(!startdate&&enddate){
                layer.msg('开始时间和结束时间都必须选');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层 
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/track',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        uid:searchFeild.uid,
                        startdate:startdate,
                        enddate:enddate,
                        pagesize:num
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            vm.list = data.value;
                            vm.count = data.countTrack;
                            vm.pageNow = data.pageNow;
                            vm.countPage = data.countPage;
                            //搜索条件数据
                            var newObj = $.extend(true, {}, vm.searchFeild);
                            vm.searchResult = newObj;
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
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求搜索失败');
                    }
                })
            }
        }
    }
})


//获取数据函数,分页
function getPageData (vm,pageNow,search,num) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type:'POST',
        url:serverUrl+'get/track',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            uid:search.uid,
            startdate:search.startdate,
            enddate:search.enddate,
            page:pageNow,
            pagesize:num
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
        $('.search-usrbtn').hide();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
        $('.search-usrbtn').show();
    })

    //用户
    $('.searchCate').on('keyup',function(){
        var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
        $('.pors .cate-list').css('width',getWidth);
        var searchCusVal = $('.searchCate').val();

        $.ajax({
            type:'POST',
            url:serverUrl+'get/user',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                search:searchCusVal
            },
            success:function(data){
                var vm = userlist;

                if(data.status==100){
                    vm.users = data.value;
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }else{
                    vm.users= '';
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求失败');
            }
        })
    });

    //时间选择框控件
    $(".date").datetimepicker({
        format: 'yyyy-mm-dd',
        minView: "month"
    });

    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
})

//刷新函数
function windowFresh(){
    location.reload(true);
}