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
var search = serverUrl+"index.php/vague/name"; //模糊搜索地址
var temp = serverUrl+"Public/file/CenterItemValue.xlsx";

//状态过滤器
Vue.filter('statusFlilter',function(value){
    var str;
    switch(value){
        case 1: str = "启用";break;
        case 2: str = "停用";break;
    }
    return str;
})

var oInfo = new Vue({
    el:'body',
    data:{
        info:'', //词库信息
        valueList:'',//词库内容
        statusList:[
            1,
            2
        ],
        //内容添加
        newVal:'',
        respons:'',
        // 下面的是交互用的数据
        en_alert:false,
        inputType:'',
        download:temp,
        //关联
        proList:'',
        pro_name:'',
        pro_id:'',
        relateList:'', //产品列表
        reate_name:'',
        reate_id:'',
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
        },
        //产品搜索可用
        relateable:function () {
            if(this.pro_id) {
                return false
            }else{
                return true
            }
        },
        //产品关联可用
        goRelateBtn:function () {
            if (this.reate_id) {
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //从搜索结果中选中一个类目
        selectCate:function(pro){
            oInfo.pro_name = pro.cn_name;
            oInfo.pro_id = pro.id;
            oInfo.proList = '';
            //清空产品
            oInfo.reate_name = '';
            oInfo.reate_id = '';
            oInfo.relateList = '';
            //清除值，隐藏框
            $('.searchCate').val('');
            $('.searchCompent').hide();
        },
        //从产品搜索结果选择一个产品
        selectRelate:function (reate) {
            oInfo.reate_name = reate.cn_name;
            oInfo.reate_id = reate.id;
            oInfo.relateList = '';
            //清除值，隐藏框
            $('.searchCate2').val('');
            $('.searchCompent2').hide();
        },
        // 提交修改
        update:function () {
            var info = this.info;
            if(!info.name.trim()){
                this.en_alert = true;
            }else{
                this.en_alert = false;

                $.ajax({
                    type:'POST',
                    url:serverUrl+'update/centeritem',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        id:info.id,
                        name:info.name,
                        remark:info.remark,
                        enabled:info.enabled
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('保存成功');
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
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //手工录入内容
        addVal:function () {
            var info = this.info;
            var creator_id = cookie.get('id');
                vm = oInfo,
                newVal = this.newVal;
                if(!newVal.trim()) {
                    layer.msg('内容不能为空');
                }else{
                    $.ajax({
                        type:'POST',
                        url:serverUrl+'add/centeritemvalue',
                        datatype:'json',
                        data:{
                            key:oKey,
                            user_id:token,
                            creator_id:creator_id,
                            id:info.id,
                            text:newVal,
                            state:'single'
                        },
                        success:function(data){
                            if(data.status==100){
                                layer.msg('添加成功');
                                vm.newVal = '';
                                updateVal();
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
                }
        },
        //批量录入
        uploadVal:function () {
            var fileData = $('#file').val();//文件数据
            if(!fileData){
                layer.msg('请先选择文件');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                var vm = oInfo;
                var creator_id = cookie.get('id');
                var state = 'many';//类型
                var id = vm.info.id;
                var formData = new FormData();
                formData.append('file', $('#file')[0].files[0]);//文件
                formData.append('state', state);//参数
                formData.append('id', id);//参数
                formData.append('key', oKey);//参数
                formData.append('user_id', token);//参数
                formData.append('creator_id', creator_id);//参数

                $.ajax({
                    url:serverUrl+'add/centeritemvalue',
                    type:'POST',
                    cache: false,
                    data:formData,
                    processData: false,
                    contentType: false,
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            layer.msg('上传文件成功');
                            vm.respons = data.value;
                            updateVal();
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
                        layer.msg('上传失败');
                    }
                })
            }
        },
        //重新获取内容值,刷新按钮
        getVal:function () {
            updateVal ();
        },
        //点击修改
        editable:function (table) {
            table.edit = true;
        },
        //保存修改
        saveVal:function (table) {
            var table = table;
            if(!(table.value.trim())){
                layer.msg('内容不能为空');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'update/centeritemvalue',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        id:table.id,
                        text:table.value
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('保存成功');
                            updateVal();
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
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //删除内容条目
        deleteItem:function (table) {
            var table = table,
                vm = oInfo;
            $.ajax({
                type:'POST',
                url:serverUrl+'delete/centeritemvalue',
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    id:table.id
                },
                success:function(data){
                    if(data.status==100){
                        layer.msg('删除成功');
                        vm.valueList.$remove(table);
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
                    layer.msg('向服务器请求失败');
                }
            })
        },
        //添加关联
        goRelate:function () {
            var vm = oInfo;
            var creator_id = cookie.get('id');
            if (!this.reate_id) {
                layer.msg('类目和产品必须要都选择');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'add/center2good',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        item_id:vm.info.id,
                        good_id:vm.reate_id
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('关联成功');
                            vm.pro_name = '';
                            vm.pro_id = '';
                            vm.reate_name = '';
                            vm.reate_id = '';
                            updateRelate();
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
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //删除关联
        deleteRelate:function (rList) {
            var rList = rList;
            $.ajax({
                type:'POST',
                url:serverUrl+'delete/center2good',
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    id:rList.id
                },
                success:function(data){
                    if(data.status==100){
                        layer.msg('删除成功');
                        oInfo.relateValList.$remove(rList);
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
                    layer.msg('向服务器请求失败');
                }
            })
        },
        //返回项目详情
        goback:function () {
            var id = this.info.id,
                oIndex = $('#myTab li.active').index();
            if (id) {
                var url = 'Thesaurus-info.html';
                window.location.href = url+'?id='+id+'&oIndex='+oIndex;
            }
        }
    }
})

//更新获取内容值函数
function updateVal () {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
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
            layer.close(LoadIndex); //关闭遮罩层
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
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求数据失败');
        }
    })
}

//更新获取关联内容函数
function updateRelate () {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
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
}

$(function(){
    //搜索类目框
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
        $('.searchCompent2').hide();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })

    //搜索产品框
    $('.searchBtn2').on('click',function(){
        $('.searchCompent2').show();
        $('.searchCompent').hide();
    })
    $('.closeBtn2').on('click',function(){
        $('.searchCompent2').hide();
    })

    if(oIndex){
        //选择活动的选项卡
        $('#myTab li').eq(oIndex).find('a').tab('show');
    }
})

//模糊搜索类目
$('.searchCate').on('keyup',function(){
    var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();

    $.ajax({
        type:'POST',
        url:search,
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            text:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                oInfo.proList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                oInfo.proList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })
});

//搜索产品
$('.searchCate2').on('keyup',function(){
    var getWidth = $('.searchCate2').innerWidth();
    $('.searchCate2').next().css('width',getWidth);
    var searchCusVal = $('.searchCate2').val();

    $.ajax({
        type:'POST',
        url:serverUrl+'get/allproductcenter',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            category_id:oInfo.pro_id,
            enabled:1,
            vague:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                oInfo.relateList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                oInfo.relateList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })
});