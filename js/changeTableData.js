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
var type_code = 'info';
var tableID = Request.id;
var template_id = Request.template_id;

console.log(type_code);
console.log(tableID);
console.log(template_id);

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址
var oUrl = 'http://192.168.1.42/canton/';//图片服务器地址

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

var oTableIn = new Vue({
    el:'body',
    data:{
        info:'',
        gridColumns: [],
        gridData: []
    },
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        //获取表格信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/oneform',
            datatype:'json',
            data:{
                id:tableID,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.info = data.value[0];
                }else if(data.status==101){
                    layer.msg('操作失败');
                }else if(data.status==102){
                    layer.msg('表格的id为空');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器获取表格信息失败');
            }
        })

        //获取表头
        $.ajax({
            type:'POST',
            url:serverUrl+'get/bootstrap',
            datatype:'json',
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.gridColumns = data.value;
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })

        //获取数据
        $.ajax({
            type:'POST',
            url:serverUrl+'/update/cHeck_msg',
            datatype:'json',
            data:{
                form_id:tableID,
                type_code:type_code
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    oTableIn.gridData = data.value;
                }else if(data.status==101){
                    // layer.msg('数据为空');
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求表格数据失败');
            }
        })
    },
    methods:{
        cancel:function () {
            layer.confirm('确认不保存关闭吗?',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                //解除未提交内容提示
                $(window).unbind('beforeunload');
                window.close();
            })
        },
        //提交保存
        saveData:function () {
            var vm = this;
            var max = this.gridData.length;
            $.ajax({
                type:'POST',
                url:serverUrl+'update/checkinfo',
                datatype:'json',
                data:{
                    max:max,
                    type_code:type_code,
                    gridColumns:vm.gridColumns,
                    gridData:vm.gridData
                },
                success:function(data){
                    if(data.status==100){
                        layer.msg('保存成功');
                        setInterval(closeW,1000);
                        function closeW () {
                            //解除未提交内容提示
                            $(window).unbind('beforeunload');
                            window.close();
                        }
                    }else{
                        layer.msg(data.msg);
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求失败');
                }
            })
        }
    }
})

$(function(){
    //检测滚动条位置，显示隐藏页面头部
    $(window).scroll(function(){
       if($(window).scrollTop() > 50){
           $('.fixed-top').slideUp(300);
           $('#table').css('padding-top','250px');
           $('#table').css('padding-top','50px');
       }
    })

    $('.pullUP').click(function(){
        $('.fixed-top').slideUp(300);
        $('#table').css('padding-top','50px');
    });

    $('.pullDown').click(function(){
        $('.fixed-top').slideDown(300);
        $('#table').css('padding-top','250px');
    });

    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
})