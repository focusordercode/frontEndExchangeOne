/**
 * Created by Administrator on 2016/9/12.
 */

console.log(serverUrl); //后端接口地址

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
            data:{
                key:oKey,
                user_id:token,
            },
            success: function(data){
                if(data.status==100){
                    searchlog.state=data.state
                    layer.msg('调试状态为：'+ searchlog.state)
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }else {
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
                    key:oKey,
                    user_id:token,
                    state:state11
                },
                success: function(data){
                    if(data.status==100){
                        layer.msg('更改状态成功');
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
                    key:oKey,
                    user_id:token,
                    year:year,
                    month:month,
                    day:day
                },
                success:function(data){
                    if (data.status==100){
                        layer.msg('获取日志成功');
                        searchlog.logdata=data.value
                    }else if(data.status==101){
                        layer.msg('没有数据');
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});
                        
                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
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
                    key:oKey,
                    user_id:token,
                    url:url
                },
                success:function(data){
                    if (data.status==100){
                        searchlog.logdata=data.value
                        layer.msg('删除成功');
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});
                        
                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
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
                    key:oKey,
                    user_id:token,
                    url:dele
                },
                success:function(data){
                    var data =data;
                    var oIframe = '<iframe src="'+data+'" frameborder="0" ></iframe>';
                    $('body').append(oIframe);
                    if (data.status==100){

                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});
                        
                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }
                },
                error: function(jqXHR) {
                    layer.msg('向服务器获取信息失败');
                }
            })

        }

    }
})






