console.log(serverUrl); //后端接口地址

var search = serverUrl+"index.php/vague/name"; //模糊搜索地址

var type_code = 'info'; //模板类型
var num = 12;//每页展示个数

var tempList = new Vue({
    el:'body',
    data:{
        temp:[],
        search:{
            searchStatus:'',
            name:'',
            cate_name:'',
            cateId:''
        },
        prePageBtn:'',
        nextPageBtn:'',
        count:'',
        countPage:'',
        pageNow:'',
        jump:'',
        jumpBtn:'',
        // 搜索类目
        proList:'',
        //交互数据
        searchResult:'' //搜索成功后的条件
    },
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层 
        $.ajax({
            type: "POST",
            url: serverUrl+"get/temvalue", //添加请求地址
            dataType: "json",
            data:{
                key:oKey,
                user_id:token,
                type_code:type_code,
                num:num
            },
            success: function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    tempList.temp = data.value;
                    tempList.count = data.count;
                    tempList.countPage = data.countPage;
                    tempList.pageNow = data.pageNow;
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
                layer.close(LoadIndex); //关闭遮罩层     
                layer.msg('从服务器获取模板列表信息失败');
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
        //从搜索结果中选中一个类目
        selectCate:function(pro){
            this.search.cate_name = pro.cn_name;
            this.search.cateId = pro.id;
            this.proList = '';
            //清除值，隐藏框
            $('.searchField').val('');
            $('.searchInput').hide();
            $('.modal-backdrop').hide();
        },
        // 取消选中类目
        cancelCate:function () {
            this.search.cate_name = '';
            this.search.cateId = '';
        },
        //模板搜索
        KeywordSearch:function(){
            var name = this.search.name.trim();
            var status = this.search.searchStatus;
            var category_id = this.search.cateId;
            var vm = this;
            if(!name&&!status&&!category_id){
                layer.msg('必须选择类目,输入关键词或者选择模板状态');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/temvalue',
                    dataType:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        type_code:type_code,
                        vague:name,
                        category_id:category_id,
                        enabled:status,
                        num:num
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            vm.temp = data.value;
                            vm.count = data.count;
                            vm.countPage = data.countPage;
                            vm.pageNow = data.pageNow;
                            //搜索条件数据
                            var newObj = $.extend(true, {}, vm.search);
                            vm.searchResult = newObj;
                        }else if(data.status==101){
                            layer.msg('没有查询到数据');
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }
                    },  
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求搜索失败');
                    }
                })
            }
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
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                getPageData (vm,pageNow,search,num,type_code);
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
                getPageData (vm,pageNow,search,num,type_code);
            }
        },
        //跳转
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
                getPageData (vm,jump,search,num,type_code);
                vm.jump = '';
            }
        },
        //停用模板
        stopTemp:function(todo){
            layer.confirm('是否确认停用模板?',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                $.ajax({
                    type:'POST',
                    url:serverUrl+'stop/template',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        id:todo.id,
                        type_code:type_code
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('停用成功');
                            todo.status_code = 'disabled';
                        }else if(data.status==101){
                            layer.msg('停用失败');
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            
                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求停用模板失败');
                    }
                })
            })     
        },
        //删除模板
        deleteItem:function (todo) {
            var pageNow = this.pageNow;
            var search = this.searchResult;
            var vm = this;

            layer.confirm('确认删除?', {
              btn: ['确定','关闭'] //按钮
            },function(index){
                layer.close(index);
                $.ajax({
                    type: "POST",
                    url: serverUrl+"delete/template", //添加请求地址的参数
                    dataType: "json",
                    data:{
                      key:oKey,
                      user_id:token,
                      id:todo.id,
                      type_code:type_code
                    },
                    success: function(data){
                        if(data.status==100){
                            layer.msg('删除成功');
                            setTimeout(getPageData(vm,pageNow,search,num,type_code),1000);
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
        }
    }
})

//Vue过滤器

//状态码过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing": str = "定义格式";break;
        case "enabled": str = "启用";break;
        case "disabled": str = "停用";break;
    }
    return str;
})

//编辑按钮
Vue.filter('statusLink', function (value) {
    var id = value.id;
    var status = value.status_code;
    var url1 = 'info-temp-edit.html';
    var url2 = 'info-temp-done.html';
    if(status=='creating'){
        return url1+'?id='+id;  //进入第二步
    }else if(status=='editing'){
        return url2+'?id='+id;  //进入第三步
    }else{
        return 'javascript:'
    }
})
//预览按钮
Vue.filter('preLink',function(value){
    var id = value.id;
    var status = value.status_code;
    var str = '&type=pre';//标记为预览访问
    var url = 'info-temp-done.html';
    if(status=='enabled'){
        return url+'?id='+id+str;
    }else if(status=='disabled'){
        return url+'?id='+id;
    }else{
        return 'javascript:'
    }
})
//启用按钮显示
Vue.filter('startBtn',function(value){
    var value = value;
    str1 = ''; //隐藏
    str2 = 'yes'; //显示
    if(value=='creating'||value=='editing'||value=='disabled'){
        return str2
    }else if(value=='enabled'){
        return str1
    }
})
//编辑按钮显示隐藏
Vue.filter('editBtn',function(value){
    var value = value;
    str1 = ''; //隐藏
    str2 = 'yes'; //显示
    if(value=='enabled'||value=='disabled'){
        return str1
    }else{
        return str2
    }
})
//预览按钮显示隐藏
Vue.filter('preBtn',function(value){
    var value = value;
    str1 = ''; //隐藏
    str2 = 'yes'; //显示
    if(value=='enabled'||value=='disabled'){
        return str2
    }else{
        return str1
    }
})
//停用按钮显示隐藏
Vue.filter('stopBtn',function(value){
    var value = value;
    str1 = ''; //隐藏
    str2 = 'yes'; //显示
    if(value=='creating'||value=='editing'||value=='disabled'){
        return str1
    }else if(value=='enabled'){
        return str2
    }
})

//刷新函数
function windowFresh(){
    location.reload(true);
}

//获取数据函数,翻页
function getPageData (vm,pageNow,search,num,type_code) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type:'POST',
        url:serverUrl+'get/temvalue',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            type_code:type_code,
            next:pageNow,
            num:num,
            vague:search.name,
            category_id:search.cateId,
            enabled:search.searchStatus
        },
        success:function(data){
            layer.close(LoadIndex); //关闭遮罩层
            if(data.status==100){
                vm.temp = data.value;
                vm.count = data.count;
                vm.countPage = data.countPage;
                vm.pageNow = data.pageNow;
            }else if(data.status==101){
                layer.msg('操作失败');
            }else if(data.status==102){
                layer.msg('参数错误');
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
        },
        error:function(jqXHR){
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    })
}

var creatUrl = 'info-temp-creat.html';//创建模板地址

//打开创建的新的模板
$('.temp-list .temp-add').click(function(){
    // window.open(creatUrl+'?type_code='+type_code);
    window.location.href = creatUrl+'?type_code='+type_code;
});
$('.temp-list .creatMB').click(function(){
    // window.open(creatUrl+'?type_code='+type_code);
    window.location.href = creatUrl+'?type_code='+type_code;
});

$(document).ready(function(){
    //模糊搜索类目
    $('.searchField').on('keyup',function(){
        var searchCusVal = $('.searchField').val();
        if(searchCusVal){
            $.ajax({
                type:'POST',
                url:search,
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    text:searchCusVal
                },
                success:function(data){
                    if(data.status==100){
                        tempList.proList = data.value;
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});
                        
                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
                        tempList.proList= '';
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求客户信息失败');
                }
            })
        }
    });

    //打开关闭搜索
    $('.goSearch').on('click',function(){
        $('.searchInput').show();
        $('.modal-backdrop').show();
        $('.searchField').focus();
    })
    $('.modal-backdrop').on('click',function(){
        $('.searchInput').hide();
        $('.modal-backdrop').hide();
    })
});