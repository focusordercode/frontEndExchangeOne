//获取ID
function UrlSearch() {
    var name,value; 
    var str=location.href; 
    var num=str.indexOf("?");
    str=str.substr(num+1);
    
    var arr=str.split("&"); 
    for(var i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        } 
    } 
} 
var Request=new UrlSearch();

//刷新函数
function windowFresh(){
    location.reload(true);
}

//模糊搜索
var oCateID;
$oCateInput = $('.temp-info .temp-belong');
$oCateInput.keyup(function(){
    $oCateText = $.trim($('.temp-info .temp-belong').val());
    if($oCateText==''){
        oCateID=0;
    }
    $.ajax({
        type: "POST",    
        url: "http://192.168.1.40/PicSystem/canton/vague/name", //添加请求地址的参数
        dataType: "json",
        data: {
            text:$oCateText
        },
        success: function(data){
            if (data.status==100) {
                $cateList = data.value;
                $('.temp-info .cateList li').remove();
                for($i=0;$i<$cateList.length;$i++){
                    $str = '<li name="'+$cateList[$i].id+'">'+$cateList[$i].cn_name+$cateList[$i].en_name+'</li>';
                    $('.temp-info .cateList').append($str);
                }
            }else{
                $('.temp-info .cateList li').remove();
            }
        },
        error: function(jqXHR){     
            layer.msg("获取分类失败");
        }
    })
});

$(document).on('click','.temp-info .cateList li',function(){
    oCateID = $(this).attr('name');
    $oCateInput = $('.temp-info .temp-belong');
    $oCateInput.val($(this).text());
    $('.temp-info .cateList li').remove();
});


//获取模板信息
var tempEditAgain = new Vue({
    el:'.temp-info',
    data:{
        value:''
    },
    ready:function(){
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/template", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                id:Request.id,
                type_code:Request.type_code
            },
            success: function(data){
                if(data.status==100){
                    tempEditAgain.value = data.value[0];
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板信息失败');
            }
        })
    }
})

//提交模板信息
$('.temp-info .btn-xg').on('click',function(){
    $cnName = $('.temp-info-xg .cn-name').val();
    $enName = $('.temp-info-xg .en-name').val();
    $remark = $('.temp-info-xg .remark').val();
    $.ajax({
        type: "POST",
        url: "http://192.168.1.40/PicSystem/canton/update/template", //添加请求地址的参数
        dataType: "json",
        data:{
            id:Request.id,
            category_id:oCateID,
            cn_name:$cnName,
            en_name:$enName,
            remark:$remark,
            type_code:Request.type_code
        },
        success: function(data){
            if(data.status==100){
                layer.msg('修改成功');
                setInterval(windowFresh,1000);
            }else if(data.status==102){
                layer.msg('参数错误');
            }else if(data.status==103){
                layer.msg('请勿重复操作');
            }else if(data.status==104){
                layer.msg('启用状态不可操作');
            }
        },
        error: function(jqXHR){     
            alert("error");
        }
    })
});

//获取模板条目
var tempEdit = new Vue({
    el:'.temp-edit',
    data:{
        table:'',
    },
    ready:function(){
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/templateitem", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                template_id:Request.id,
                type_code:Request.type_code
            },
            success: function(data){
                if(data.status==100){
                    tempEdit.table = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板信息失败');
            }
        })
    },
    methods:{
        //生成默认模板
        creatMB:function(){
            $.ajax({
                type: "POST",
                url: "http://192.168.1.40/PicSystem/canton/post/default", 
                dataType: "json",
                timeout:5000,
                data:{
                    template_id:Request.id
                },
                success: function(data){
                    if(data.status==100){
                        layer.msg('生成成功');
                        setInterval(windowFresh,1000);
                    }else if(data.status==101){
                        layer.msg('生成失败');
                    }else if(data.status==102){
                        layer.msg('已经有模板数据不能生成');
                    }
                },
                error: function(jqXHR){     
                    layer.msg('向服务器请求生成默认模板失败');
                }
            })
        },
        //提交保存
        send:function(){
            $.ajax({
                type: "POST",
                url: "http://192.168.1.40/PicSystem/canton/update/templateitem", //添加请求地址的参数
                dataType: "json",
                timeout:5000,
                data:{
                    tempData:this.table,
                    type_code:Request.type_code
                },
                success: function(data){
                    if(data.status==100){
                        layer.msg('修改成功');
                        setInterval(windowFresh,1000);
                    }else {
                        layer.msg(data.msg);
                    }
                },
                error: function(jqXHR){     
                    layer.msg('提交修改失败');
                }
            })
        }
    }
})
//Vue过滤器
Vue.filter('dataType', function (value) {
    var str;
    switch(value){
        case "int": str = "整数";break;
        case "char": str = "字符文本";break;
        case "dc": str = "小数";break;
        case "dt": str = "日期";break;
        case "bl": str = "是否";break;
        case "pic": str = "图片";break;
    }
    return str;
})

//删除单个条目
$(document).on("click",".temp-edit .delete i",function(){
    $id = $(this).next("input").val();
        layer.confirm(' 确定删除该条目?', {
              btn: ['确定','取消'] //按钮
            },function(){
              $.ajax({
                  type: "POST",
                  url: "http://192.168.1.40/PicSystem/canton/delete/templateitem", //添加请求地址的参数
                  dataType: "json",
                  timeout:5000,
                  data:{
                      id:$id,
                      type_code:Request.type_code
                  },
                  success: function(data){
                      if(data.status==100){
                          location.reload(true);
                      }
                  },
                  error: function(jqXHR){     
                      layer.msg('从服务器获取模板信息失败');
                  }
              });  
        })
});

//添加按钮的链接
if(Request.id==null){
    $('.temp-edit .btn-add').attr({'href':'#','target':''});
}else{
    $('.temp-edit .btn-add').attr('href','template-edit.html?id='+Request.id+'&type_code='+Request.type_code+'');
};
