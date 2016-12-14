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
console.log(serverUrl); //后端接口地址

var tempStart = new Vue({
    el:'body',
    data:{
        temp:'',
        tempData:'',
        doneBtn:'',
        temFormat:'',//模板的格式数据
        preType:preType //判断访问类型
    },
    ready:function(){
        //获取当前模板的信息
        $.ajax({
            type:'POST',
            url:serverUrl+'getById/template',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                type_code:type_code,
                id:template_id
            },
            success:function(data){
                if(data.status==100){
                    tempStart.temp = data.value[0];
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
                key:oKey,
                user_id:token,
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                if(data.status==100){
                    tempStart.tempData = data.value;
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
                layer.msg('从服务器获取模板数据失败');
            }
        })
        //获取当前模板的格式数据
        $.ajax({
            type: "POST",
            url: serverUrl+"get/temformat", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                key:oKey,
                user_id:token,
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                if(data.status==100){
                    tempStart.temFormat = data.value;
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
                        key:oKey,
                        user_id:token,
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
                        layer.msg('向服务器请求启用模板失败');
                    }
                })
            }
        }
    }
})

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
//填写方式
Vue.filter('writeType', function (value) {
    var str;
    switch(value){
        case 1: str = "固定值";break;
        case 2: str = "变化值";break;
        case 3: str = "不填写";break;
    }
    return str;
})
//数据检查类型
Vue.filter('ruleType', function (value) {
    var str;
    switch(value){
        case 1: str = "唯一";break;
        case 2: str = "重复";break;
        case 0: str = "无";break;
    }
    return str;
})