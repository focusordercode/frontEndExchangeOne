// Creat by msh at 2016.10.17

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
var itemId = Request.id,
    oIndex = Request.oIndex;

//刷新函数
function windowFresh(){
    location.reload(true);
}

console.log(serverUrl); //后端接口地址


var oInfo = new Vue({
    el:'body',
    data:{
        info:'', //词库信息
        valueList:'',//词库内容
        statusList:[
            1,
            2
        ],
        relateValList:'' //关联成功列表
    },
    ready:function () {
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

        //词库项目信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/centeritem',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                id:itemId
            },
            success:function(data){
                if(data.status==100){
                    oInfo.info = data.value[0];
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
                layer.msg('向服务器请求数据失败');
            }
        })

        //词库内容
        $.ajax({
            type:'POST',
            url:serverUrl+'get/centeritemvalue',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                id:itemId
            },
            success:function(data){
                if(data.status==100){
                    oInfo.valueList = data.value;
                    var Len = oInfo.valueList.length;
                    for (var i = 0;i<Len;i++) {
                        Vue.set(oInfo.valueList[i],'edit',false);
                    }
                }else if(data.status==101) {
                    
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
                layer.msg('向服务器请求数据失败');
            }
        })

        //关联内容
        $.ajax({
            type:'POST',
            url:serverUrl+'get/center2good',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                id:itemId
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    oInfo.relateValList = data.value;
                }else if(data.status==101) {
                    
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
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求数据失败');
            }
        })
    },
    computed:{
        enabled:function () {
            var str,
                status = this.info.enabled;
            if (status==1) {
                str = '启用';
            }else{
                str = '停用';
            }
            return str
        }
    },
    methods:{
        //删除项目
        deleteItem:function () {
            var id = this.info.id;
            layer.confirm('确定删除项目?项目的内容和关联已将一并删除',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);
                if (id) {
                    $.ajax({
                        type:'POST',
                        url:serverUrl+'delete/centeritem',
                        datatype:'json',
                        data:{
                            key:oKey,
                            user_id:token,
                            id:id
                        },
                        success:function (data) {
                            if(data.status==100){
                                layer.msg('删除成功');
                                //跳转函数
                                function goNext() {
                                    var url = 'Thesaurus.html';
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
                            }else{
                                layer.msg(data.msg);
                            }
                        },
                        error:function (jqXHR) {
                            layer.msg('向服务器请求失败');
                        }
                    })
                }
            })
        },
        //跳转到修改
        jumpXG:function () {
            var id = this.info.id,
                oIndex = $('#myTab li.active').index();
            if(id) {
                var url = 'Thesaurus-xg.html';
                window.location.href = url+'?id='+id+'&oIndex='+oIndex;
            }
        }
    }
})

$(function(){
    if(oIndex){
        //选择活动的选项卡
        $('#myTab li').eq(oIndex).find('a').tab('show');
    }
})