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


var template_id = Request.id;//模板ID
var type_code = 'batch';//批量表模板


//英文正则,英文数字和空格
var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;

var tempDefine = new Vue({
    el:'body',
    data:{
        temp:'',
        tempData:[],
        uploadBtn:''
    },
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

        //获取当前模板的信息
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/getById/template',
            datatype:'json',
            data:{
                type_code:type_code,
                id:template_id
            },
            success:function(data){
                if(data.status==100){
                    tempDefine.temp = data.value[0];
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层 
                layer.msg('向服务器请求该模板信息失败');
            }
        })

        //获取当前模板的数据
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/title_valid", //添加请求地址的参数
            dataType: "json",
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                layer.close(LoadIndex); //关闭遮罩层 
                if(data.status==100){
                    tempDefine.tempData = data.value;
                }
            },
            error: function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层      
                layer.msg('从服务器获取模板数据失败');
            }
        })
    },
    computed:{
        //控制上传按钮
        uploadBtn:function(){
            if(this.temp){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //上传模板文件
        upload:function(){
            layer.confirm('如果该模板有数据，再次上传原来数据将会覆盖',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                var formData = new FormData();
                formData.append('file', $('#file')[0].files[0]);//文件
                formData.append('template_id', template_id);//参数
                formData.append('type_code', type_code);//参数

                $.ajax({
                    url:'http://192.168.1.40/PicSystem/canton/upload/item',
                    type:'POST',
                    cache: false,
                    data:formData,
                    processData: false,
                    contentType: false,
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            layer.msg('上传成功');

                            //解除未提交内容提示
                            $(window).unbind('beforeunload');

                            //刷新页面
                            setInterval(windowFresh,1000);
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('上传失败');
                    }
                })
            })
        },
        //删除常用值条目
        deleteVal:function(table){
            var vm = tempDefine;
            var table = table;
            if(table.id){
                $.ajax({
                    type: "POST",
                    url: "http://192.168.1.40/PicSystem/canton/delete/templateitem", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        id:table.id,
                        type_code:type_code
                    },
                    success: function(data){
                        if(data.status==100){
                            layer.msg('删除成功',{time:1000})
                            vm.tempData.$remove(table);
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error: function(jqXHR){     
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //发送数据
        sendData:function(){
            var template_id = this.temp.id,
                tempDataLen = this.tempData.length,
                tempData = this.tempData;

            if(!template_id){
                layer.msg('没有检测到模板');
            }else if(tempDataLen<=0){
                layer.msg('请先添加数据');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/update/templateitem',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        template_id:template_id,
                        item_num:tempDataLen,
                        tempData:tempData
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            //解除未提交内容提示
                            $(window).unbind('beforeunload');

                            layer.msg('提交保存成功');
                            
                            //跳转函数
                            function goNext() {
                                var url = 'batch-temp-relate.html';
                                window.location.href = url+'?id='+template_id;
                            }

                            setInterval(goNext,1000);
                            
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求提交保存失败');
                    }
                })
            }
        }
    }
})

//数据类型框
Vue.filter('dataTypeFilter',function(value){
    var table = value;
    var valid_value = table.valid_value;  //常用值 
    if(valid_value.length>1){
        return true
    }else{
        return false
    }
})

//长度选择框
Vue.filter('textType',function(value){
    var table = value;
    var valid_value = table.valid_value;  //常用值 
    var datatype = table.data_type_code;  //类型 
    if(valid_value.length>1){   //
        return true
    }else if(datatype=='char'){
        return false
    }else{
        return true
    }
})

//精度选择框
Vue.filter('dcType',function(value){
    var table = value;
    var valid_value = table.valid_value;  //常用值 
    var datatype = table.data_type_code;  //类型 
    if(valid_value.length>1){   //
        return true
    }else if(datatype=='dc'){
        return false
    }else{
        return true
    }
})

//默认值
// Vue.filter('defaultVal', function (value,table) {
//     var table = table;
//     var str = value;
//     if(table.data_type_code=='int'){
//         return 123
//     }
// })

//数据类型
Vue.filter('dataType', function (value) {
    var str;
    switch(value){
        case "int": str = "整数";break;
        case "char": str = "文本";break;
        case "dc": str = "小数";break;
        case "dt": str = "日期";break;
        case "bl": str = "是否";break;
        case "pic": str = "图片";break;
        case "upc_code": str = "UPC码";break;
    }
    return str;
})


$(document).ready(function(){
    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
});