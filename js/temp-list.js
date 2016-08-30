var tempList = new Vue({
    el:'body',
    data:{
        temp:[],
        name:'',
        searchStatus:'',
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
            url: "http://192.168.1.40/PicSystem/canton/get/template", //添加请求地址的参数
            dataType: "json",
            data:{
                type_code:'info',
                get_all_data:'all'
            },
            success: function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    tempList.temp = data.value;
                    tempList.count = data.count;
                    tempList.countPage = data.countPage;
                    tempList.pageNow = data.pageNow;
                }
            },
            error: function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层     
                layer.msg('从服务器获取模板列表信息失败');
            }
        })
    },
    computed:{
        //搜索按钮状态控制
        searchStatus:function(){
            var name = this.name;
            if(!name){
                return true
            }else{
                return false
            }
        },
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
            var name = this.name;
            var type_code = 'info';
            if(!name){
                layer.msg('请先输入关键词');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/vague/templatename',
                    dataType:'json',
                    data:{
                        type_code:type_code,
                        name:name
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            tempList.temp = data.value;
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
                        type_code:'info',
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
                        type_code:'info',
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
                        type_code:'info',
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
        }
    }
})
//Vue过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing": str = "编辑";break;
        case "enabled": str = "有效";break;
        case "disabled": str = "完成";break;
    }
    return str;
})
Vue.filter('statusEdit', function (value) {
    var str;
    switch(value){
        case "creating": str = "编辑";break;
        case "editing": str = "编辑";break;
        case "enabled": str = "";break;
        case "disabled": str = "";break;
    }
    return str;
})

//打开创建的新的模板
$('.temp-list .temp-add').click(function(){
    window.open('template-creat.html?type_code=info');
});
$('.temp-list .creatMB').click(function(){
    window.open('template-creat.html?type_code=info');
});

//popover初始化
$(function () {
  $('[data-toggle="popover"]').popover()
})


//启用禁用状态
$(document).on('click','.temp-list .temp .btn-start',function(){
    $tempId = $(this).nextAll('.temp-id').val();
    layer.confirm('一经启用，模板不可以编辑和删除，是否启用?', {
      btn: ['确定','关闭'] //按钮
    },function(){
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
                }else if(data.status==101){
                    layer.msg('启用失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }else if(data.status==103){
                    layer.msg('重复添加数据!');
                }else if(data.status==104){
                    layer.msg('启用状态下不可操作');
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
                }else if(data.status==101){
                    layer.msg('操作失败');
                }else if(data.status==102){
                    layer.msg('参数错误');
                }else if(data.status==103){
                    layer.msg('重复操作!');
                }else if(data.status==104){
                    layer.msg('启用状态下不可操作');
              }
          },
            error: function(jqXHR){     
              layer.msg('向服务器请求失败');
          }
      })  
    })
});