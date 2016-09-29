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

var template_id = Request.id;//模板ID
var type_code = 'info';//资料表模板
var preType = Request.type;//访问类型

var serverUrl = "http://192.168.1.40/PicSystem/canton/"; //后端接口地址

var tempStart = new Vue({
    el:'body',
    data:{
        temp:'',
        tempData:'',
        doneBtn:'',
        preType:preType //判断访问类型
    },
    ready:function(){
        //获取当前模板的信息
        $.ajax({
            type:'POST',
            url:serverUrl+'getById/template',
            datatype:'json',
            data:{
                type_code:type_code,
                id:template_id
            },
            success:function(data){
                if(data.status==100){
                    tempStart.temp = data.value[0];
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求该模板信息失败');
            }
        }),

        //获取当前模板的数据
        $.ajax({
            type: "POST",
            url: serverUrl+"get/templateitem", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                if(data.status==100){
                    tempStart.tempData = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板数据失败');
            }
        })
    },
    computed:{
        //完成按钮
        doneBtn:function(){
            if(this.temp.id){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        getStart:function(){

            if(!tempStart.temp.id){
                layer.msg('没有检测到模板数据');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'use/template',
                    datatype:'json',
                    data:{
                        id:template_id,
                        type_code:type_code
                    },
                    success:function(data){
                        if (data.status==100) {
                            layer.msg('启用成功');

                            //跳转函数
                            function goNext() {
                                var url = 'template.html';
                                window.location.href = url;
                            }

                            setInterval(goNext,1000);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求启用模板失败');
                    }
                })
            }
        }
    }
})