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
var type_code = 'batch';//批量表模板
console.log(serverUrl); //后端接口地址

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

//刷新函数
function windowFresh(){
    location.reload(true);
}


var tempRelate = new Vue({
    el:'body',
    data:{
        temp:'',
        selectBtn:'',//选择模板按钮
        MBlist:'',
        MBselected:'请选择模板',//已选中的资料表名称
        MBselectedId:'',//已选中的资料表ID
        tempData:'',  //批量表模板数据
        proData:'',  //资料表模板数据
        selectedBacth:'',
        selectedInfo:'',
        relateData:[], //关联的数据
        relateBtn:''
    },
    ready:function(){
        //获取当前模板的信息,批量表
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
                    tempRelate.temp = data.value[0];
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    $(window).unbind('beforeunload');
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

        //获取批量表的模板数据,过滤过的
        $.ajax({
            type: "POST",
            url: serverUrl+"get/eliminateItem", //添加请求地址的参数
            dataType: "json",
            data:{
                key:oKey,
                user_id:token,
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                if(data.status==100){
                    tempRelate.tempData = data.value;
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    $(window).unbind('beforeunload');
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

        //获取已经关联的模板数据,上一步撤销返回和启用状态编辑时用
        $.ajax({
            type:'POST',
            url:serverUrl+'get/contact',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                batch_template_id:template_id
            },
            success:function(data){
                if(data.status==100){
                    tempRelate.MBselected = data.template.cn_name;//已经选择的资料表模板
                    tempRelate.MBselectedId = data.template.id;
                    tempRelate.relateData = data.value; //关联的数据
                    //获取选中的资料表模板数据
                    getProData(tempRelate);
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    $(window).unbind('beforeunload');
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求该模板信息失败');
            }
        })
    },
    computed:{
        //关联按钮
        relateBtn:function(){
            if(this.selectedBacth&&this.selectedInfo){
                return false
            }else{
                return true
            }
        },
        //保存按钮
        sendBtn:function(){
            if(this.relateData.length>0){
                return false
            }else{
                return true
            }
        },
        //判断资料表模板是否有数据
        proDataSelect:function () {
            if(this.proData.length<1) {
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        //打开模板列表弹框,资料表的
        openList:function(){
            var vm = this;
            if(!this.temp.category_id){
                layer.msg('没有获取到当前模板信息');
            }else{
                $('.selectMB').modal('show');

                //拉取当前模板的类目下所有模板，包括通用模板
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/template10',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        type_code:'info',
                        category_id:vm.temp.category_id
                    },
                    success:function(data){
                        if(data.status==100){
                            vm.MBlist = data.value;
                            var MBlistLen = vm.MBlist.length;
                            for(var i = 0;i<MBlistLen;i++){
                                Vue.set(vm.MBlist[i],'checked',false);
                            }
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            $(window).unbind('beforeunload');
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
                        layer.msg('向服务器请求模板数据失败');
                    }
                })
            }
        },
        //从列表中选中一个
        selectedMB:function(){
            var vm = this;
            var MBlistLen = vm.MBlist.length;
            var MBarr = new Array ();

            for(var i = 0;i<MBlistLen;i++){
                if(vm.MBlist[i].checked){
                    MBarr.push(vm.MBlist[i]);
                }
            }

            if(MBarr.length==0){
                layer.msg('请先选择一个模板');
            }else{
                vm.MBselected = MBarr[0].cn_name;
                vm.MBselectedId = MBarr[0].id;
                $('.selectMB').modal('hide');
            }

            var batch_id = vm.temp.id,  //批量表模板id
                info_id = vm.MBselectedId;  //资料表模板id

            if(batch_id&&info_id){
                vm.relateData = [];//清空当前关联的数据
                getProData(vm);//确定选中后拉取资料表的数据
                getBatchData(vm);//确定选中后再次拉取批量表的数据
                //拉取默认关联数据
                defaultData(vm,batch_id,info_id);
            }
        },
        //点击关联后
        relate:function(){
            var vm = this;
            var relateData = this.relateData,
                batch = this.selectedBacth, //获取选中数据当前的索引
                info = this.selectedInfo,  //获取选中数据当前的索引
                newItem = {};
            if(batch&&info){
                //把数据关联添加下去
                newItem.batch = vm.tempData[batch].en_name;
                newItem.batchId = vm.tempData[batch].id;
                newItem.info = vm.proData[info].en_name;
                newItem.infoId = vm.proData[info].id;
                relateData.push(newItem);

                //把数据从待选关联选项中删除
                vm.tempData.splice(batch,1);

                //恢复按钮
                vm.selectedBacth = '';
            }else{
                layer.msg('请先选择好资料表和批量表的项目');
            }
        },
        //点击删除
        deleteItem:function(relate){
            var vm = this;
            var batItem = {};
            batItem.en_name = relate.batch;
            batItem.id = relate.batchId;

            //删除数据
            vm.relateData.$remove(relate);

            //恢复数据到选项
            vm.tempData.push(batItem);
        },
        //保存数据
        sendData:function(){
            var batch_template_id = this.temp.id;
            var template_id = this.MBselectedId;
            var relateData = this.relateData;
            var creator_id = cookie.get('id');
            if(this.relateData.length<=0){
                layer.msg('请先添加数据');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'marry/item',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        batch_template_id:batch_template_id,
                        template_id:template_id,
                        data:relateData
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('保存成功');
                            //解除未提交内容提示
                            $(window).unbind('beforeunload');
                            
                            //跳转函数
                            function goNext() {
                                var url = 'batch-temp-start.html';
                                window.location.href = url+'?id='+batch_template_id;
                            }

                            setInterval(goNext,1000);
                            
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            $(window).unbind('beforeunload');
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
                        layer.msg('向服务器请求关联失败');
                    }
                })
            }
        },
        //返回上一步
        takeBack:function(){
            layer.confirm('返回上一步，此步骤的数据将不保存',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                $.ajax({
                    type:'POST',
                    url:serverUrl+'template_back',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        template_id:template_id,
                        type_code:type_code
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('请求成功');

                            //跳转函数
                            function goNext() {
                                var url = 'batch-temp-defineVal.html?id='+template_id;
                                window.location.href = url;
                            }

                            //解除未提交内容提示
                            $(window).unbind('beforeunload');

                            setInterval(goNext,1000);

                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            $(window).unbind('beforeunload');
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
                        layer.msg('向服务器请求撤销返回失败');
                    }
                })
            })
        }
    }
})

//获取选中的资料表模板数据
function getProData(vm) {
    $.ajax({
        type: "POST",
        url: serverUrl+"get/templateitem", //添加请求地址的参数
        dataType: "json",
        data:{
            key:oKey,
            user_id:token,
            template_id:vm.MBselectedId,
            type_code:'info'
        },
        success: function(data){
            if(data.status==100){
                vm.proData = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                $(window).unbind('beforeunload');
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
}

//获取批量表的模板数据,过滤过的
function getBatchData(vm) {
    $.ajax({
        type: "POST",
        url: serverUrl+"get/eliminateItem", //添加请求地址的参数
        dataType: "json",
        data:{
            key:oKey,
            user_id:token,
            template_id:template_id,
            type_code:type_code
        },
        success: function(data){
            if(data.status==100){
                vm.tempData = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                $(window).unbind('beforeunload');
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
}

//获取默认关联数据函数
//批量表和资料表的id，整数型
function defaultData (vm,batch_id,info_id) {
    $.ajax({
        type: "POST",
        url: serverUrl+"get/relationItem", //添加请求地址的参数
        dataType: "json",
        data:{
            key:oKey,
            user_id:token,
            template_id:info_id,
            batch_template_id:batch_id
        },
        success: function(data){
            if(data.status==100){
                vm.relateData = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                $(window).unbind('beforeunload');
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
        },
        error: function(jqXHR){     
            layer.msg('从服务器获取数据失败');
        }
    })
}