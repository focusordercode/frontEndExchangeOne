/**
 * Created by Administrator on 2016/9/12.
 */

 var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址

var searchlog = new Vue({
    el:'body',
    data:{
        state:'',
        year:'',
        month:'',
        day:'',
        logdata:'',
        logurl:'',
        urlarr:[]
    },
    ready:function(){
        $.ajax({
            type:'POST',
            url:serverUrl+'detection/debug',
            datatype:'json',
            success: function(data){
                if(data.status==100){
                    searchlog.state=data.state
                    layer.msg('调试状态为：'+ searchlog.state)
                }
                else {
                    layer.msg('获取状态失败')
                }
            },
            error: function(jqXHR){
                layer.msg('向服务器获取信息失败');
            }
        })
    },
    methods:{
        /*切换调试模式状态*/
        switchste:function(){
            var state11 = ""
            if (this.state=="open"){
                state11="close"
            }else{
                state11="open"
            }
            $("#swibtn").toggleClass("active");
            console.log(state11);
            $.ajax({
                type:'post',
                url:serverUrl+'debug',
                datatype:'json',
                data:{
                    state:state11
                },
                success: function(data){
                    if(data.status==100){
                        layer.msg('更改状态成功');
                    }
                },
                error: function(jqXHR){
                    layer.msg('向服务器获取信息失败');
                }
            })
        },
        /*获取日志*/
        searchday:function(){
            var seaurl = "";
            var year = this.year;
            var month = this.month;
            var day = this.day;
            if (day==""&&year==""&&month==""){
                seaurl = serverUrl+"get/nowlog"
            }
            else {
                seaurl = serverUrl+"get/fixlog"
            }
            $.ajax({
                type:"POST",
                url:seaurl,
                datatype:'json',
                data:{
                    year:year,
                    month:month,
                    day:day
                },
                success:function(data){
                    if (data.status==100){
                        layer.msg('获取日志成功');
                        searchlog.logdata=data.value
                        /*var Len = searchlog.logdata.length;
                        for(var i = 0;i<Len;i++){
                            Vue.set(searchlog.logdata[i],'checked',false);
                        }*/
                    }
                    else if(data.status==101){
                        layer.msg('没有数据');
                    }
                    else{
                        layer.msg('参数为空');
                    }
                },
                error: function(jqXHR) {
                    layer.msg('向服务器获取信息失败');
                }
            })
        },
        /*删除按钮*/
        deletelog:function(){
            var url = searchlog.urlarr
            $.ajax({
                type:"POST",
                url:serverUrl+"delete/log",
                datatype:'json',
                data:{
                    url:url
                },
                success:function(data){
                    if (data.status==100){
                        searchlog.logdata=data.value
                        layer.msg('删除成功');
                    }
                },
                error: function(jqXHR) {
                    layer.msg('向服务器获取信息失败');
                }
            })
        },
        /*下载按钮*/
        downloadlog:function(){
            var dele = searchlog.urlarr
            /*window.open(serverUrl+"download/log?"+dele,"_blank");*/
            $.ajax({
                type:'POST',
                url:serverUrl+'download/log',
                datatype:"json",
                data:{
                    url:dele
                },
                success:function(data){
                    /*window.location=data*/
                    /*window.open(data,"_blank");*/
                    var data =data;
                    /*alert(data)*/
                    //window.open(data,"_blank");
                    var oIframe = '<iframe src="'+data+'" frameborder="0" ></iframe>';
                    $('body').append(oIframe);
                    if (data.status==100){

                    }
                },
                error: function(jqXHR) {
                    layer.msg('向服务器获取信息失败');
                }
            })

        }

    }




})






