var type_code = 'batch'; //模板类型

var tempList = new Vue({
    el:'body',
    data:{
        temp:[],
        searchStatus:'',
        name:'',
        prePageBtn:'',
        nextPageBtn:'',
        count:'',
        countPage:'',
        pageNow:'',
        jump:'',
        jumpBtn:''
    },
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层 
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/template", //添加请求地址
            dataType: "json",
            data:{
                type_code:type_code,
                get_all_data:'all'
            },
            success: function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    tempList.temp = data.value;
                    tempList.count = data.count;
                    tempList.countPage = data.countPage;
                    tempList.pageNow = data.pageNow;
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
        //根据模板名称搜索
        KeywordSearch:function(){
            var name = this.name.trim();
            var status = this.searchStatus;
            // console.log(type_code)
            if(!name&&!status){
                layer.msg('必须输入关键词或者选择模板状态');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/vague/templatename',
                    dataType:'json',
                    data:{
                        type_code:type_code,
                        name:name,
                        status_code:status
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            tempList.temp = data.value;
                            tempList.count = data.count;
                            tempList.countPage = data.countPage;
                            tempList.pageNow = data.pageNow;
                            tempList.name = '';
                        }else if(data.status==101){
                            layer.msg('没有查询到数据');
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
            if(pageNow<=1){
                layer.msg('没有上一页啦');
            }else{
                pageNow--
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/template',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        get_all_data:'all',
                        next:pageNow
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            tempList.temp = data.value;
                            tempList.count = data.count;
                            tempList.countPage = data.countPage;
                            tempList.pageNow = data.pageNow;
                        }else if(data.status==101){
                            layer.msg('操作失败');
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }
                    },
                    error:function(jqXHR){
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
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/template',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        get_all_data:'all',
                        next:pageNow
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            tempList.temp = data.value;
                            tempList.count = data.count;
                            tempList.countPage = data.countPage;
                            tempList.pageNow = data.pageNow;
                        }else if(data.status==101){
                            layer.msg('操作失败');
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }
                    },
                    error:function(jqXHR){
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
                tempList.jump = '';
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/template',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        get_all_data:'all',
                        next:jump
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            tempList.temp = data.value;
                            tempList.count = data.count;
                            tempList.countPage = data.countPage;
                            tempList.pageNow = data.pageNow;
                        }else if(data.status==101){
                            layer.msg('操作失败');
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //停用模板
        stopTemp:function(todo){

            var todo = todo,
                id = todo.id,
                type_code = todo.type_code;

                layer.confirm('是否确认停用模板?',{
                    btn:['确定','取消']
                },function(index){
                    layer.close(index);

                    $.ajax({
                        type:'POST',
                        url:'http://192.168.1.40/PicSystem/canton/stop/template',
                        datatype:'json',
                        data:{
                            id:id,
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
                            }
                        },
                        error:function(jqXHR){
                            layer.msg('向服务器请求停用模板失败');
                        }
                    })
                })     
        }
    }
})
//Vue过滤器

//状态码过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "defining": str = "定义格式";break;
        case "connecting": str = "关联模板";break;
        case "values": str = "定义常用值";break;
        case "enabled": str = "启用";break;
        case "disabled": str = "停用";break;
    }
    return str;
})
//编辑按钮
Vue.filter('statusLink', function (value) {
    var id = value.id;
    var status = value.status_code;
    var url1 = 'batch-temp-define.html';
    var url2 = 'batch-temp-defineVal.html';
    var url3 = 'batch-temp-relate.html';
    var url4 = 'batch-temp-start.html';
    if(status=='creating'){
        return url1+'?id='+id;  //进入第二步
    }else if(status=='defining'){
        return url3+'?id='+id;  //进入第三步
    }else if(status=='connecting'){
        return url2+'?id='+id;  //进入第四步
    }else if(status=='values'){
        return url4+'?id='+id;  //进入第五步
    }else{
        return 'javascript:'
    }
})
//预览按钮
Vue.filter('preLink',function(value){
    var id = value.id;
    var status = value.status_code;
    var str = '&type=pre';//标记为预览访问
    var url = 'batch-temp-start.html';
    if(status=='enabled'||status=='disabled'){
        return url+'?id='+id+str;
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

var creatUrl = 'batch-temp-creat.html';//创建模板地址

//打开创建的新的模板
$('.temp-list .temp-add').click(function(){
    window.open(creatUrl+'?type_code='+type_code);
});
$('.temp-list .creatMB').click(function(){
    window.open(creatUrl+'?type_code='+type_code);
});

//popover初始化
$(function () {
  $('[data-toggle="popover"]').popover()
})


//启用模板
$(document).on('click','.temp-list .temp .btn-start',function(){
    $tempId = $(this).nextAll('.temp-id').val();
    layer.confirm('一经启用，模板不可以编辑和删除，是否启用?', {
      btn: ['确定','关闭'] //按钮
    },function(index){
        layer.close(index);
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/use/template", //添加请求地址的参数
            dataType: "json",
            data:{
                id:$tempId,
                type_code:tempList.temp[0].type_code
            },
            success: function(data){
                if(data.status==100){
                    layer.msg('请求成功');
                    location.reload(true);
                }else{
                    layer.msg(data.msg);
                }
            },
            error: function(jqXHR){     
                layer.msg('向服务器请求失败');
            }
        })
    })
});

//删除模板
$(document).on('click','.temp-list .btn-delete',function(){
    $tempId = $(this).nextAll('.temp-id').val();
    layer.confirm('确认删除?', {
      btn: ['确定','关闭'] //按钮
    },function(){
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/delete/template", //添加请求地址的参数
            dataType: "json",
            data:{
              id:$tempId,
              type_code:tempList.temp[0].type_code
            },
            success: function(data){
                if(data.status==100){
                    layer.msg('操作成功');
                    
                    location.reload(true);
                }else{
                    layer.msg(data.msg);
                }
          },
            error: function(jqXHR){     
              layer.msg('向服务器请求失败');
          }
      })  
    })
});