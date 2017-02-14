/**
 * Created by Administrator on 2016/9/12.
 */

console.log(serverUrl); //后端接口地址

$(document).ready(function() {  
    $("#onoffswitch").on('click', function(){  
        clickSwitch();
        togglesw();  
    });
});

var searchlog = new Vue({
    el:'body',
    data:{
        state:'',
        year:'',
        month:'',
        day:'',
        logdata:'',
        logurl:'',
        urlarr:[],
        months:[01,02,03,04,05,06,07,08,09,10,11,12],
        days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
    },
    ready:function(){

        getnewstatus();
        var vm = this;
        var nowDate = new Date();
        var nowdays = nowDate.getDate();
        var nowmonthes = nowDate.getMonth();
        var nowyears = nowDate.getFullYear();
        vm.year = nowyears;
        vm.month = nowmonthes<10?'0'+(nowmonthes + 1):nowmonthes + 1;
        vm.day = nowdays;
    },
    computed:{
        /*获取时间，并展示在月份、日期选项*/
        nowtimemonth:function(){
            var vm = this;
            var nowDate = new Date();
            var nowdays = nowDate.getDate();
            var nowmonthes = nowDate.getMonth();
            var nowyears = nowDate.getFullYear();
            var nowyear = vm.year;
            if (nowyear == 2016) {
                return vm.months.filter(function (number) {
                    return number >= 10;
                });
            }else if (nowyear == nowyears) {
                return vm.months.filter(function (number) {
                    return number <= nowmonthes+1;
                });
            }else {
                return vm.months;
            }
        },
        nowtimeday:function(){
            var vm = this;
            var nowDate = new Date();
            var nowdays = nowDate.getDate();
            var nowmonthes = nowDate.getMonth();
            var nowyears = nowDate.getFullYear();
            if (vm.year == nowyears && vm.month == (nowmonthes+1)) {
                return vm.days.filter(function (number) {
                    return number <= nowdays;
                })
            }else{
                return vm.days;
            }
        },
        nowtimeyear:function(){
            var vm = this;
            var nowDate = new Date();
            var nowdays = nowDate.getDate();
            var nowmonthes = nowDate.getMonth();
            var nowyears = nowDate.getFullYear();
            return parseInt(nowyears - 2015);
        }
    },
    methods:{

        /*获取日志*/
        searchday:function(){
            var vm = this;
            var seaurl = "";
            var year = vm.year;
            var month = vm.month;
            var day = vm.day;
            if (day ==""&&year ==""&&month ==""){
                seaurl = serverUrl+"get/nowlog";
            }
            else {
                seaurl = serverUrl+"get/fixlog";
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
});
//更改调试的状态
function togglesw(){
    var vm = searchlog;
    var state11 = "";
    if (vm.state=="open"){
        state11="close"
    }else{
        state11="open"
    }
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
                getnewstatus();//重新拉取调试状态数据
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
};
//重新获取调试状态函数
function getnewstatus(){
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
                layer.msg('调试状态为：'+ searchlog.state);
                if (searchlog.state == 'open') {
                    $("#onoffswitch").attr("checked",true);
                }else if (searchlog.state == 'close'){
                    $("#onoffswitch").attr("checked",false);
                }
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
}






