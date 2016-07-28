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

// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
    methods:{
        //删除
        remove:function(entry){
            var entry = entry;
            var product_id = entry.product_id;
            var form_id = oTableIn.info.id;
            var parent_id = entry.parent_id;
            var BigData = this.data;
            layer.confirm('如果删除的是主条目，其变体也将一并删除,是否确认删除?',{
                btn:['确定','取消']
            },function(){
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.42/canton/index.php/del/info',
                    datatype:'json',
                    data:{
                        product_id:product_id,
                        form_id:form_id
                    },
                    success:function(data){
                        if(data.status==100){
                            if(parent_id==0){    //如果是主体进入删除变体循环   
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
                                layer.msg('删除成功');
                            }else { //如果是变体
                                BigData.$remove(entry);
                                layer.msg('删除变体成功');
                            }
                        }else if(data.status==101){
                            layer.msg('操作失败');
                        }else if(data.status==102){
                            layer.msg('ID为空');
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求删除失败');
                    }
                })
            });
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
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
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
                layer.close(LoadIndex); //关闭遮罩层
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
                }else if(data.status==101){
                    layer.msg('表格头数据为空');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })

        //获取表格的详细信息
        $.ajax({
            type:'POST',
            url:'http://192.168.1.42/canton/index.php/get/info',
            datatype:'json',
            data:{
                form_id:Request.id
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    oTableIn.gridData = data.value;
                }else if(data.status==101){
                    layer.msg('数据为空');
                }else if(data.status==102){
                    layer.msg('获取表格的ID为空');
                }else if(data.status==111){
                    layer.msg('表格没有数据');
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求表格信息失败');
            }
        })
    },
    methods:{
        saveAll:function(){
            var max = oTableIn.gridData.length;
            var LoadIndex = layer.load(2, {shade:[0.3, '#000']}); //开启遮罩层 
            $.ajax({
                type:'POST',
                url:'http://192.168.1.42/canton/index.php/update/info',
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
                    if(data.status==100){
                        // oTableIn.newData = data.t;
                        layer.msg('保存成功');
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
                    layer.msg('向服务器请求保存数据失败');
                }
            })
        }
    }
})

//点击变成可修改
$(document).on('click','.clickTochange',function(){
    $('.td-input').hide();
    $(this).next('.td-input').show();
});

//点击确定修改内容
$(document).on('click','.clickTosave',function(){
    $('.td-input').hide();
});