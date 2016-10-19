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
var tableID = Request.id;
var type_code = 'batch';
var template_id = Request.template_id;
var visit = Request.visit;

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址

// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  }
})

var oTableIn = new Vue({
    el:'body',
    data:{
        info:'',
        gridColumns: [],
        gridData: [],
        downloadBtn:'',
        makeExcelBtn:'',//生成表格按钮
        url:'',
        downLink:'',
        newData:'',
        visitType:visit
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
                }else{
                    layer.msg(data.msg);
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
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })

        //获取表格的详细信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/info',
            datatype:'json',
            data:{
                form_id:tableID,
                template_id:template_id,
                type_code:type_code,
                pageSize:1000 //获取全部不分页
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    oTableIn.gridData = data.value;
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求表格信息失败');
            }
        })
    },
    computed:{
        downloadBtn:function(){
            if(this.url){
                return false
            }else{
                return true
            }
        },
        //生成表格按钮
        makeExcelBtn:function(){
            var gridDataLen = this.gridData.length;
            if(gridDataLen>=2){
                return false
            }else{
                return true
            }
        },
        //下载地址
        downLink:function(){
            if(this.url){
                return this.url
            }else{
                return 'javascript:'
            }
        }
    },
    methods:{
        //生成表格
        makeExcel:function(){
            layer.confirm('生成表格需要较长时间请耐心等待',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                $.ajax({
                    type:'POST',
                    url:serverUrl+'set/excel',
                    datatype:'json',
                    data:{
                        form_id:tableID,
                        template_id:template_id
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            oTableIn.url = data.url;
                            layer.msg('生成表格成功');
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求生成表格失败');
                    }
                })
            })
        },
        //匹配UPC
        oFitUPC:function(){
            if(tableID){
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                $.ajax({
                    type:'POST',
                    url:serverUrl+'marry_upc',
                    datatype:'json',
                    data:{
                        form_id:tableID
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            layer.msg('请求成功');

                            function windowFresh(){
                                location.reload(true);
                            }

                            setInterval(windowFresh,1000);
                        }else{
                            layer.msg(data.msg);
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

$(document).ready(function(){
    //检测滚动条位置，显示隐藏页面头部
    $(window).scroll(function(){
       if($(window).scrollTop() > 50){
           $('.fixed-top').slideUp(300);
           $('#table').css('padding-top','30px');
       }
    })

    //页面顶部隐藏显示
    $('.pullUP').on('click',function(){
        $('.fixed-top').slideUp(300);
        $('#table').css('padding-top','30px');
    });

    $('.pullDown').on('click',function(){
        $('.fixed-top').slideDown(300);
        $('#table').css('padding-top','200px');
    });

    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
});