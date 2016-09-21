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
        newData:''
    },
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        //获取表格信息
        $.ajax({
            type:'POST',
            url:'http://192.168.1.42/canton/index.php/get/oneform',
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
            url:'http://192.168.1.42/canton/index.php/get/bootstrap',
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
            url:'http://192.168.1.42/canton/index.php/get/info',
            datatype:'json',
            data:{
                form_id:tableID,
                template_id:template_id,
                type_code:type_code
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
            var gridDataLen = this.gridData.length;
            //根据表格的长度控制下载按钮
            if(gridDataLen>=2){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //生成表格
        makeExcel:function(){
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            $.ajax({
                type:'POST',
                url:'http://192.168.1.42/canton/set/excel',
                datatype:'json',
                data:{
                    form_id:tableID,
                    template_id:template_id
                },
                success:function(data){
                    if(data.status==100){
                        layer.close(LoadIndex); //关闭遮罩层
                    }else{
                        layer.msg(data.msg);
                    }
                },
                error:function(jqXHR){
                    layer.close(LoadIndex); //关闭遮罩层
                    layer.msg('向服务器请求生成表格失败');
                }
            })
        },
        //下载表格
        downloadTable:function(){
            var form_id = Request.tableID;
            if(form_id){
                window.location.href = 'http://192.168.1.40/PicSystem/canton/export?form_id='+form_id;
                // window.location.href = 'http://192.168.1.42/canton/Public/Template/Data/2016-09-21-18-37-58.xls';
            }
        }
    }
})


$(document).ready(function(){
    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
});