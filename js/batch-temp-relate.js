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

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址

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
        MBselected:'请选择模板',
        MBselectedId:'',
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
                type_code:type_code,
                id:template_id
            },
            success:function(data){
                if(data.status==100){
                    tempRelate.temp = data.value[0];
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求该模板信息失败');
            }
        }),

        //获取过滤后的模板数据，批量表
        $.ajax({
            type: "POST",
            url: serverUrl+"get/eliminateItem", //添加请求地址的参数
            dataType: "json",
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                if(data.status==100){
                    tempRelate.tempData = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板数据失败');
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
        //选择模板按钮
        selectBtn:function(){
            if(this.relateData.length>0){
                return true
            }else{
                return false
            }
        },
        //资料表模板是否有数据
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
                        type_code:'info',
                        category_id:tempRelate.temp.category_id
                    },
                    success:function(data){
                        if(data.status==100){
                            tempRelate.MBlist = data.value;
                            var MBlistLen = tempRelate.MBlist.length;
                            for(var i = 0;i<MBlistLen;i++){
                                Vue.set(tempRelate.MBlist[i],'checked',false);
                            }
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
            var MBlistLen = tempRelate.MBlist.length;
            var MBarr = new Array ();

            for(var i = 0;i<MBlistLen;i++){
                if(tempRelate.MBlist[i].checked){
                    MBarr.push(tempRelate.MBlist[i]);
                }
            }

            if(MBarr.length==0){
                layer.msg('请先选择一个模板');
            }else{
                tempRelate.MBselected = MBarr[0].cn_name;
                tempRelate.MBselectedId = MBarr[0].id;
                $('.selectMB').modal('hide');
            }

            //确定选中后拉取资料表的数据
            $.ajax({
                type: "POST",
                url: serverUrl+"get/templateitem", //添加请求地址的参数
                dataType: "json",
                timeout:5000,
                data:{
                    template_id:tempRelate.MBselectedId,
                    type_code:'info'
                },
                success: function(data){
                    if(data.status==100){
                        tempRelate.proData = data.value;
                    }
                },
                error: function(jqXHR){     
                    layer.msg('从服务器获取模板数据失败');
                }
            })

            var batch_id = tempRelate.temp.id,  //批量表模板id
                info_id = tempRelate.MBselectedId;  //资料表模板id
            //拉取默认关联数据
            defaultData(batch_id,info_id);
        },
        //点击关联后
        relate:function(){
            var relateData = this.relateData,
                batch = this.selectedBacth, //获取选中数据当前的索引
                info = this.selectedInfo,  //获取选中数据当前的索引
                newItem = {};
            if(batch&&info){
                //把数据关联添加下去
                newItem.batch = tempRelate.tempData[batch].en_name;
                newItem.batchId = tempRelate.tempData[batch].id;
                newItem.info = tempRelate.proData[info].en_name;
                newItem.infoId = tempRelate.proData[info].id;
                relateData.push(newItem);

                //把数据从待选关联选项中删除
                // tempRelate.proData.splice(info,1);
                tempRelate.tempData.splice(batch,1);

                //恢复按钮
                tempRelate.selectedBacth = '';
                // tempRelate.selectedInfo = '';
            }else{
                layer.msg('请先选择好资料表和批量表的项目');
            }
        },
        //点击删除
        deleteItem:function(relate){
            var relate = relate;
            // var proItem = {},
            //     batItem = {};
            var batItem = {};
            // proItem.en_name = relate.info;
            // proItem.id = relate.infoId;
            batItem.en_name = relate.batch;
            batItem.id = relate.batchId;

            //删除数据
            tempRelate.relateData.$remove(relate);

            //恢复数据到选项
            // tempRelate.proData.push(proItem);
            tempRelate.tempData.push(batItem);
        },
        //保存数据
        sendData:function(){
            var batch_template_id = this.temp.id;
            var template_id = this.MBselectedId;
            var relateData = this.relateData;

            if(this.relateData.length<=0){
                layer.msg('请先添加数据');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'marry/item',
                    datatype:'json',
                    data:{
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
            layer.confirm('返回上一步，此步骤的数据将不保存,上一步骤的数据也将被删除',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                $.ajax({
                    type:'POST',
                    url:serverUrl+'template_back',
                    datatype:'json',
                    data:{
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

//获取默认关联数据函数
//批量表和资料表的id，整数型
function defaultData (batch_id,info_id) {
    $.ajax({
        type: "POST",
        url: serverUrl+"get/relationItem", //添加请求地址的参数
        dataType: "json",
        data:{
            template_id:info_id,
            batch_template_id:batch_id
        },
        success: function(data){
            if(data.status==100){
                tempRelate.relateData = data.value;
            }
        },
        error: function(jqXHR){     
            layer.msg('从服务器获取数据失败');
        }
    })
}