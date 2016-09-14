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

//刷新函数
function windowFresh(){
    location.reload(true);
}

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

var template_id = Request.id;//模板ID
var type_code = 'batch';//批量表模板

//英文正则,英文数字和空格
var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;


var tempDefine = new Vue({
    el:'body',
    data:{
        temp:'',
        MBlist:'',
        MBselected:'选择模板',
        MBselectedId:'',
        copyBtn:'',
        tempData:'',
        oText:{
            data_type_code:'char',
            cn_name:'',
            en_name:'',
            length:'',
            default_value:''
        },
        oNum:{
            data_type_code:'int',
            cn_name:'',
            en_name:'',
            length:'',
            default_value:12345678
        },
        oFloat:{
            data_type_code:'dc',
            cn_name:'',
            en_name:'',
            length:'',
            default_value:1.25
        },
        oPic:{
           data_type_code:'pic',
           cn_name:'',
           en_name:'',
           length:'',
           default_value:'imgURL' 
        },
        oDate:{
            data_type_code:'dt',
            cn_name:'',
            en_name:'',
            length:'',
            default_value:'2016-12-01'
        },
    },
    computed:{
        //复制按钮状态
        copyBtn:function(){
            if(this.MBselectedId){
                return false
            }else{
                return true
            }
        }
    },
    ready:function(){
        //获取当前模板的信息
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/getById/template',
            datatype:'json',
            data:{
                type_code:type_code,
                id:template_id
            },
            success:function(data){
                if(data.status==100){
                    tempDefine.temp = data.value[0];
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求该模板信息失败');
            }
        })
        //获取当前模板的数据
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/templateitem", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success: function(data){
                if(data.status==100){
                    tempDefine.tempData = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板数据失败');
            }
        })
    },
    methods:{
        //打开模板列表弹框
        openList:function(){
            if(!this.temp.category_id){
                layer.msg('没有获取到当前模板信息');
            }else{
                $('.selectMB').modal('show');

                //拉取当前模板的类目下所有模板，包括通用模板
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/template10',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        category_id:tempDefine.temp.category_id
                    },
                    success:function(data){
                        if(data.status==100){
                            tempDefine.MBlist = data.value;
                            var MBlistLen = tempDefine.MBlist.length;
                            for(var i = 0;i<MBlistLen;i++){
                                Vue.set(tempDefine.MBlist[i],'checked',false);
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
            var MBlistLen = tempDefine.MBlist.length;
            var MBarr = new Array ();

            for(var i = 0;i<MBlistLen;i++){
                if(tempDefine.MBlist[i].checked){
                    MBarr.push(tempDefine.MBlist[i]);
                }
            }

            if(MBarr.length==0){
                layer.msg('请先选择一个模板');
            }else{
                tempDefine.MBselected = MBarr[0].cn_name;
                tempDefine.MBselectedId = MBarr[0].id;
                $('.selectMB').modal('hide');
            }
        },
        //复制模板
        copyMB:function(){
            if(!this.MBselectedId){
                layer.msg('请先选择模板');
            }else{
                layer.confirm('如果当前模板有数据，使用复制功能将被清除',{
                    btn:['确定','取消']
                },function(index){
                    layer.close(index);

                    //解除未提交内容提示
                    $(window).unbind('beforeunload');

                    $.ajax({
                        type:'POST',
                        url:'http://192.168.1.40/PicSystem/canton/copy/batchItemTemplate',
                        datatype:'json',
                        data:{
                            template_id:tempDefine.MBselectedId,    //被复制的批量表模板id
                            copy_template_id:tempDefine.temp.id    //当前模板ID
                        },
                        success:function(data){
                            if(data.status==100){
                                layer.msg('复制成功');

                                setInterval(windowFresh,1000);
                            }else{
                                layer.msg(data.msg);
                            }
                        },
                        error:function(jqXHR){
                            layer.msg('向服务器请求复制模板失败');
                        }
                    })
                })
            }
        },
        //添加文本类型
        addText:function(){
            var item = this.oText;
            tempData = this.tempData;

            //清除数据函数
            function clear(item){
                item.cn_name = '';
                item.en_name = '';
                item.default_value = '';
            }
            
            if(!item.cn_name.trim()){
                layer.msg('中文名不能为空');
            }else if(!item.en_name||!Entext.test(item.en_name)){
                layer.msg('英文名不能为空，且英文名只能是英文数字和空格');
            }else if(!item.default_value.trim()){
                layer.msg('默认文本不能为空');
            }else{
                var newItem = $.extend(true, {}, item);//复制json对象
                tempData.push(newItem);
                clear(item);
            }
        },
        //添加整数
        addNum:function(){
            var item = this.oNum;
            tempData = this.tempData;

            //清除数据函数
            function clear(item){
                item.cn_name = '';
                item.en_name = '';
                item.default_value = '';
            }
            
            if(!item.cn_name.trim()){
                layer.msg('中文名不能为空');
            }else if(!item.en_name||!Entext.test(item.en_name)){
                layer.msg('英文名不能为空，且英文名只能是英文数字和空格');
            }else if(!item.default_value){
                layer.msg('默认整数不能为空');
            }else{
                var newItem = $.extend(true, {}, item);//复制json对象
                tempData.push(newItem);
                clear(item);
            }
        },
        //添加小数
        addFloat:function(){
            var item = this.oFloat;
            tempData = this.tempData;

            //清除数据函数
            function clear(item){
                item.cn_name = '';
                item.en_name = '';
                item.default_value = '';
            }
            
            //验证小数
            var floatEnter = /^-?\d+\.\d+$/;

            if(!item.cn_name.trim()){
                layer.msg('中文名不能为空');
            }else if(!item.en_name||!Entext.test(item.en_name)){
                layer.msg('英文名不能为空，且英文名只能是英文数字和空格');
            }else if(!item.default_value||!floatEnter.test(item.default_value)){
                layer.msg('默认小数不能为空，且类型必须为小数');
            }else{
                var newItem = $.extend(true, {}, item);//复制json对象
                tempData.push(newItem);
                clear(item);
            }
        },
        //添加图片类型
        addPic:function(){
            var item = this.oPic;
            tempData = this.tempData;

            //清除数据函数
            function clear(item){
                item.cn_name = '';
                item.en_name = '';
                item.default_value = '';
            }
            
            if(!item.cn_name.trim()){
                layer.msg('中文名不能为空');
            }else if(!item.en_name||!Entext.test(item.en_name)){
                layer.msg('英文名不能为空，且英文名只能是英文数字和空格');
            }else if(!item.default_value){
                layer.msg('默认图片类型不能为空');
            }else{
                var newItem = $.extend(true, {}, item);//复制json对象
                tempData.push(newItem);
                clear(item);
            }
        },
        //添加日期类型
        addDate:function(){
            var item = this.oDate;
            tempData = this.tempData;

            //清除数据函数
            function clear(item){
                item.cn_name = '';
                item.en_name = '';
                item.default_value = '';
            }
            
            //验证日期
            var EnterDate = /\d{4}-\d{2}-\d{2}/;

            if(!item.cn_name.trim()){
                layer.msg('中文名不能为空');
            }else if(!item.en_name||!Entext.test(item.en_name)){
                layer.msg('英文名不能为空，且英文名只能是英文数字和空格');
            }else if(!item.default_value||!EnterDate.test(item.default_value)){
                layer.msg('默认日期类型不能为空,且格式为yyyy-mm-dd');
            }else{
                var newItem = $.extend(true, {}, item);//复制json对象
                tempData.push(newItem);
                clear(item);
            }
        },
        //复制条目
        // copyItem:function(table,index){
        //     var table = table;
        //     var newItem = {},
        //         tempData = this.tempData;

        //         //筛选要复制的数据
        //         newItem.data_type_code = table.data_type_code;
        //         newItem.cn_name = table.cn_name;
        //         newItem.en_name = table.en_name;
        //         newItem.length = table.length;
        //         newItem.default_value = table.default_value;

        //         //把数据放进去
        //         tempData.splice(index+1,0,newItem);

        // },
        //删除模板条目
        deleteData:function(table){
            var table = table;
            if(table.id){  //判断是服务器拉取的数据

                //向服务器请求删除条目
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/delete/templateitem',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        id:table.id
                    },
                    success:function(data){
                        if(data.status==100){
                            tempDefine.tempData.$remove(table);
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求删除数据');
                    }
                })
            }else{
                tempDefine.tempData.$remove(table);
            }
        },
        sendData:function(){
            var template_id = this.temp.id,
                tempDataLen = this.tempData.length,
                tempData = this.tempData;

            if(!template_id){
                layer.msg('没有检测到模板');
            }else if(tempDataLen<=0){
                layer.msg('请先添加数据');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/add/templateitem',
                    datatype:'json',
                    data:{
                        type_code:type_code,
                        template_id:template_id,
                        tempData:tempData
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            //解除未提交内容提示
                            $(window).unbind('beforeunload');
                            layer.msg('提交保存成功');
                            
                            //跳转函数
                            function goNext() {
                                var url = 'batch-temp-relate.html';
                                window.location.href = url+'?id='+template_id;
                            }

                            setInterval(goNext,1000);
                            
                        }else if(data.status==103){
                            layer.msg('提交保存成功,存在重复操作的数据，未重复的已保存');
                            $(window).unbind('beforeunload');
                            layer.msg('提交保存成功');
                            
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求提交保存失败');
                    }
                })
            }
        }
    }
})


//Vue过滤器
Vue.filter('dataType', function (value) {
    var str;
    switch(value){
        case "int": str = "整数";break;
        case "char": str = "字符文本";break;
        case "dc": str = "小数";break;
        case "dt": str = "日期";break;
        case "bl": str = "是否";break;
        case "pic": str = "图片";break;
    }
    return str;
})