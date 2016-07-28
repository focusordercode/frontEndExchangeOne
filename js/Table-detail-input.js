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

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  methods:{
    remove:function(entry,$index){
        var entry = entry;
        var product_id = entry.product_id;
        var form_id = oTableIn.info.id;
        var parent_id = entry.parent_id;
        var BigData = this.data;
        if($index==0){
            layer.msg('模板数据不可以删除');
        }else if(parent_id==0){ //如果是主条目,进入循环删除变体
            var oDelete = new Array();
            for(var i=0;i<BigData.length;i++){
                if(BigData[i].parent_id==product_id) {
                    oDelete.unshift(i);//倒叙存
                }
            }
            for(var h=0;h<oDelete.length;h++){
                var i = oDelete[h];//获取oDelete数组中的下标，上面一个for循环存的
                BigData.splice(i,1);
            }
            BigData.$remove(entry);
        }else if(parent_id!=0){ //如果是变体
            BigData.$remove(entry);
        }
    },
    //添加主体
    addline:function(entry,$index){
        var BigData = this.data; 
        var newData = BigData.slice();//复制整个数组
        //添加条目获取ID
        $.ajax({
            type:'POST',
            url:'http://192.168.1.42/canton/index.php/get/sysId',
            datatype:'json',
            data:{
                app_code:'product_information',
                num:1
            },
            success:function(data){
                if(data.status==100){
                    newObj = $.extend(true, {}, newData[$index]);//复制json对象,此方法只能复制json对象
                    newObj.product_id = data.value[0];//添加ID，好区别开来
                    BigData.push(newObj);//把新的对象push进去
                }else if(data.status==101){
                    layer.msg('操作失败');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求增加失败');
            }
        })
    },
    //添加变体
    addchange:function(entry,$index){
        var BigData = this.data; 
        var newData = BigData.slice();//复制整个数组
        var parent_id = entry.product_id;
        //添加条目获取ID
        $.ajax({
            type:'POST',
            url:'http://192.168.1.42/canton/index.php/get/sysId',
            datatype:'json',
            data:{
                app_code:'product_information',
                num:1
            },
            success:function(data){
                if(data.status==100){
                    newObj = $.extend(true, {}, newData[$index]);//复制json对象,此方法只能复制json对象
                    newObj.product_id = data.value[0];//添加ID，好区别开来
                    newObj.parent_id = parent_id;
                    BigData.splice($index+1,0,newObj);//把新的对象push进去
                }else if(data.status==101){
                    layer.msg('操作失败');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求增加失败');
            }
        })
    }
  }
})

var oTableIn = new Vue({
    el:'body',
    data:{
        info:'',
        gridColumns: [],
        gridData: [],
        newData:''
    },
    ready:function(){
        //获取表格信息
        $.ajax({
            type:'POST',
            url:'http://192.168.1.42/canton/index.php/get/oneform',
            datatype:'json',
            data:{
                id:Request.id,
                type_code:Request.type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.info = data.value[0];
                }else if(data.status==101){
                    layer.msg('操作失败');
                }else if(data.status==102){
                    layer.msg('表格的id为空');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器获取表格信息失败');
            }
        })

        //获取表头
        $.ajax({
            type:'POST',
            url:'http://192.168.1.42/canton/index.php/get/bootstrap',
            datatype:'json',
            data:{
                template_id:Request.template_id,
                type_code:Request.type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.gridColumns = data.value;
                    oTableIn.gridData = data.data;
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })
    },
    methods:{
        sendMsg:function(){
            var max = oTableIn.gridData.length;
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层 
            $.ajax({
                type:'POST',
                url:'http://192.168.1.42/canton/index.php/post/info',
                datatype:'json',
                data:{
                    category_id:oTableIn.info.category_id,
                    template_id:oTableIn.info.template_id,
                    form_id:oTableIn.info.id,
                    gridColumns:oTableIn.gridColumns,
                    max:max,
                    gridData:oTableIn.gridData
                },
                success:function(data){
                    layer.close(LoadIndex); //关闭遮罩层
                    if (data.status==100) {
                        layer.msg('成功');
                        //解除未提交内容提示
                        oTableIn.newData = data.t;
                        $(window).unbind('beforeunload');
                    }else if(data.status==101){
                        layer.msg('操作失败');
                    }else if(data.status==102){
                        layer.msg('产品ID为空');
                    }else if(data.status==103){
                        layer.msg('整数类型错误');
                    }else if(data.status==104){
                        layer.msg('小数类型错误');
                    }else if(data.status==105){
                        layer.msg('日期格式错误');
                    }else if(data.status==106){
                        layer.msg('数据长度错误');
                    }
                },
                error:function(jqXHR){
                    layer.close(LoadIndex); //关闭遮罩层
                    layer.msg('提交失败');
                }
            })
        }
    }
})