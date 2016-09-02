//获取地址栏模板的ID
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

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

//关闭页面函数
function closeWindow(){
    window.close();
}

//英文正则,英文数字和空格
var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;

//拉取模板的信息
var tempInfo = new Vue({
    el:'body',
    data:{
        value:'',
        tempData:[],
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
            default_value:''
        },
        oFloat:{
            data_type_code:'dc',
            cn_name:'',
            en_name:'',
            length:'',
            default_value:''
        },
        oPic:{
           data_type_code:'pic',
           cn_name:'',
           en_name:'',
           length:'',
           default_value:'' 
        },
        oDate:{
            data_type_code:'date',
            cn_name:'',
            en_name:'',
            length:'',
            default_value:''
        },
        sengMsgBtn:'',
        clearMsgBtn:''
    },
    ready:function(){
        //获取模板信息
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/template", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                id:Request.id,
                type_code:Request.type_code
            },
            success: function(data) {
                if(data.status==100){
                    tempInfo.value = data.value[0];
                }
            },
            error: function(jqXHR) {     
                layer.msg('从服务器获取模板信息失败');
            }
        })
    },
    computed:{
        //提交按钮状体
        sengMsgBtn:function(){
            var valueLen = this.tempData.length;
            if(valueLen>0){
                return false
            }else{
                return true
            }
        },
        //清除按钮状态
        clearMsgBtn:function(){
            var valueLen = this.tempData.length;
            if(valueLen>0){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //删除单个
        deleteData:function(table) {
            this.tempData.$remove(table);
        },
        //清除全部
        deleteAll:function(){
            layer.confirm('确认清除?',{
                btn:['确定','取消']
            },function(index){
                tempInfo.tempData = [];
                layer.close(index);
                layer.msg('清除成功',{time:500});
            })
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
            }else if(!item.default_value.trim()){
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
            }else if(!item.default_value.trim()||!floatEnter.test(item.default_value)){
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
            }else if(!item.default_value.trim()){
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
            }else if(!item.default_value.trim()||!EnterDate.test(item.default_value)){
                layer.msg('默认日期类型不能为空,且格式为yyyy-mm-dd');
            }else{
                var newItem = $.extend(true, {}, item);//复制json对象
                tempData.push(newItem);
                clear(item);
            }
        },
        //提交数据保存
        sengMsg:function(){
            var type_code = this.value.type_code,
                template_id = this.value.id,
                tempDataLen = this.tempData.length,
                tempData = this.tempData;

            if(tempDataLen<=0){
                layer.msg('请先添加数据再提交');
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
                            setInterval(closeWindow,2000);
                        }else if(data.status==101){
                            layer.msg('操作失败');
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }else if(data.status==103){
                            layer.msg('提交保存成功,存在重复操作的数据，未重复的已保存');
                            $(window).unbind('beforeunload');
                            layer.msg('提交保存成功');
                            setInterval(closeWindow,2000);
                        }else if(data.status==104){
                            layer.msg('该模板是启用状态，不可操作');
                        }else if(data.status==119){
                            layer.msg('系统错误，编码119');
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