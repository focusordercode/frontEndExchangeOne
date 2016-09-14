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

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

var tempVal = new Vue({
    el:'body',
    data:{
        temp:'',
        tempData:'',
        selectedItem:'',
        addVal:'',
        addBtn:'',
        valData:[],
        sendBtn: ''
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
                    tempVal.temp = data.value[0];
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
                    tempVal.tempData = data.value;
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板数据失败');
            }
        })
    },
    computed:{
        //控制添加常用值按钮
        addBtn:function(){
            if(this.tempData&&this.addVal.trim()){
                return false
            }else{
                return true
            }
        },
        //进行重复检查的按钮
        sendBtn:function(){
            if(this.valData.length>0){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //添加常用值条目
        addItem:function(){
            var oIndex = this.selectedItem,
                tempData = this.tempData,
                addVal = this.addVal,
                valData = this.valData,
                newItem = {},
                itemArr = [];

            /*
            *    注释，此处需要生成的json数据格式为
            *    valData:[
            *        {
            *            id:1,
            *            item:'item',
            *            itemArr:[]
            *        },
            *        {
            *            id:2,
            *            item:'item',
            *            itemArr:[]
            *        }
            *    ]
            *    
            */

            //检测是否已经添加过数据
            var valDataLen = valData.length;
            var indexArr = [];
            var selectId = tempData[oIndex].id;
            for(var i = 0;i<valDataLen;i++){
                if(selectId==valData[i].id){
                    indexArr.push(i);
                }
            }

            //根据上面的判断把值添加进去
            if(indexArr.length>0){
                valData[indexArr[0]].itemArr.push(addVal);
                indexArr = [];
                tempVal.addVal = '';
            }else{
                itemArr.push(addVal);

                newItem.id = tempData[oIndex].id;
                newItem.item = tempData[oIndex].en_name;
                newItem.itemArr = itemArr;

                valData.push(newItem);
                tempVal.addVal = '';
            }
        },
        //删除常用值
        delItem:function(table,index){
            table.itemArr.splice(index, 1);
        },
        //删除整个常用值条目
        delTable:function(table){
            this.valData.$remove(table);
        },
        //检测常用值是否有重复
        // checkVal:function(){
        //     var valData = this.valData;
        //     var Len = valData.length;
        //     var save = [];
        //     //循环检测数组是否有重复
        //     for(var h = 0;h<Len;h++){
        //         var arr = valData[h].itemArr.slice();
        //         //检测数组是否用重复的方法
        //         var s = arr.join(",")+","; 
        //         for(var i=0;i<arr.length;i++) {  
                 
        //             if(s.replace(arr[i]+",","").indexOf(arr[i]+",")>-1) {   
        //                 save.push(h);//如果有重复往该数组push下标数据
        //             }  
                  
        //         }
        //     }

        //     //检测数组长度看是否有重复
        //     if(save.length>0){
        //         layer.msg('单个项目内的常用值中有重复',{time:3000});
        //     }else{
        //         layer.msg('检测通过');
        //         tempVal.sendBtn = false;
        //     }
        // },
        
        //发送数据
        sendData:function(){
            var valData = this.valData;
            var Len = valData.length;
            var save = [];
            //循环检测数组是否有重复
            for(var h = 0;h<Len;h++){
                var arr = valData[h].itemArr.slice();
                //检测数组是否用重复的方法
                var s = arr.join(",")+","; 
                for(var i=0;i<arr.length;i++) {  
                 
                    if(s.replace(arr[i]+",","").indexOf(arr[i]+",")>-1) {   
                        save.push(h);//如果有重复往该数组push下标数据
                    }  
                  
                }
            }

            if(save.length>0){
                layer.msg('单个项目内的常用值中有重复',{time:3000});
            }else{
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/validValue',
                    datatype:'json',
                    data:{
                        template_id:template_id,
                        valid_value:valData
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('保存成功');
                            //解除未提交内容提示
                            $(window).unbind('beforeunload');

                            //跳转函数
                            function goNext() {
                                var url = 'batch-temp-start.html';
                                window.location.href = url+'?id='+template_id;
                            }

                            setInterval(goNext,1000);
                            
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求保存数据失败');
                    }
                })
            }
        }
    }
})

