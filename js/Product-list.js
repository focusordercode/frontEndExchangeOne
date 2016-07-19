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


//获取产品资料表信息
var ProductList = new Vue({
    el:'body',
    data:{
        titles:'',
        lists:''
    },
    ready:function(){
        //获取模板条目
        $.ajax({
            type: "POST",
            url: "http://192.168.1.42/canton/index.php/get/templateitem", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                template_id:Request.id,
                category_id:Request.category_id
            },
            success: function(data){
                if(data.status==100){
                    ProductList.titles = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板条目信息失败');
            }
        })
        //获取产品资料条目
        $.ajax({
            type: "POST",
            url: "http://192.168.1.42/canton/index.php/get/allinfo", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                template_id:Request.id,
                category_id:Request.category_id
            },
            success: function(data){
                if(data.status==100){
                    ProductList.lists = data.value;
                }
            },
            error: function(jqXHR){
                layer.msg('从服务器获取表格失败');
            }
        })
    },
    methods:{
        xg:function(list){
            var product_id = list[0].product_id;
            window.open ('Product-edit.html?id='+product_id+'');
        },
        delect:function(list){
            var product_id = list[0].product_id;

            //删除产品信息类目
            layer.confirm(' 确定删除该条目?', {
                  btn: ['确定','取消'] //按钮
                },function(){
                    $.ajax({
                        type: "POST",
                        url: "http://192.168.1.42/canton/index.php/del/info", //添加请求地址的参数
                        dataType: "json",
                        timeout:5000,
                        data:{
                            product_id:product_id
                        },
                        success: function(data){
                            if(data.status==100){
                                layer.msg('删除成功');
                                // this.lists.$remove(list);
                                location.reload(true);
                            }
                        },
                        error: function(jqXHR){     
                            layer.msg('请求失败');
                        }
                    })
                })
        }
    }
})