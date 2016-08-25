var tempList = new Vue({
    el:'.temp-list',
    data:{
        temp:[],
        name:''
    },
    ready:function(){
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/template", //添加请求地址的参数
            dataType: "json",
            data:{
                type_code:'info',
                get_all_data:'all'
            },
            success: function(data){
                if(data.status==100){
                    tempList.temp = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板列表信息失败');
            }
        })
    },
    methods:{
        //根据模板名称搜索
        KeywordSearch:function(){
            var name = this.name;
            var type_code = 'info';
            if(!name){
                layer.msg('请先输入关键词');
            }else{
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/vague/templatename',
                    dataType:'json',
                    data:{
                        type_code:type_code,
                        name:name
                    },
                    success:function(data){
                        if(data.status==100){
                            tempList.temp = data.value;
                            tempList.name = '';
                        }else if(data.status==101){
                            layer.msg('没有查询到数据');
                        }
                    },  
                    error:function(jqXHR){
                        layer.msg('向服务器请求搜索失败');
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
Vue.filter('statusSelect', function (value) {
    var str;
    switch(value){
        case "creating": str = "";break;
        case "editing": str = "";break;
        case "enabled": str = "选用";break;
        case "disabled": str = "";break;
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


//启用禁用状态
$(document).on('click','.temp-list .temp .btn-start',function(){
    $tempId = $(this).nextAll('.temp-id').val();
    layer.confirm('一经启用，模板不可以编辑和删除，是否启用?', {
      btn: ['确定','关闭'] //按钮
    },function(){
        $.ajax({
            type: "POST",
            url: "http://192.168.1.42/canton/index.php/use/template", //添加请求地址的参数
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
            url: "http://192.168.1.42/canton/index.php/delete/template", //添加请求地址的参数
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