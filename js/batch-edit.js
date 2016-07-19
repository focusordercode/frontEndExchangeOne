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


var productEdit = new Vue({
	el:'body',
	data:{
		allData:'',
		Blength:'',
		addNum:''
	},
	ready:function(){
		//获取要修改的数据
		$.ajax({
		    type: "POST",
		    url: "http://192.168.1.42/canton/index.php/get/onebatch", //添加请求地址的参数
		    dataType: "json",
		    timeout:5000,
		    data:{
		        product_id:Request.id
		    },
		    success: function(data){
		        if(data.status==100){
		            productEdit.allData = data.value;
		            productEdit.Blength = data.Blength;
		        }
		    },
		    error: function(jqXHR){     
		        layer.msg('从服务器获取信息失败');
		    }
		})
	},
	methods:{
		//提交修改
		xg:function(){
			$.ajax({
			    type: "POST",
			    url: "http://192.168.1.42/canton/index.php/update/batchinfo", //添加请求地址的参数
			    dataType: "json",
			    timeout:5000,
			    data:{
			        allData:productEdit.allData
			    },
			    success: function(data){
			        if(data.status==100){
			            layer.msg('修改成功');
			            setInterval(windowFresh,1000);
			        }else if(data.status==101){
			        	layer.msg('操作失败');
			        }else if(data.status==103){
			        	layer.msg('填写数据不是整数类型');
			        }else if(data.status==104){
			        	layer.msg('填写数据不是小数类型');
			        }else if(data.status==105){
			        	layer.msg('日期格式不对');
			        }else if(data.status==106){
			        	layer.msg('字符串长度超出所规定的长度');
			        }
			    },
			    error: function(jqXHR){     
			        layer.msg('向服务器请求失败');
			    }
			})
		},
		//额外添加变体
		addVa:function(){
			if(productEdit.addNum==0){
				layer.msg('请先输入变体数');
			}else if(productEdit.addNum<0){
				layer.msg('请输入整数');
			}else{
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.42/canton/index.php/post/variant", //添加请求地址的参数
				    dataType: "json",
				    timeout:5000,
				    data:{
				        addNum:productEdit.addNum,
				        realBody:productEdit.allData.body
				    },
				    success: function(data){
				        if(data.status==100){
				            layer.msg('添加成功');
				            location.reload(true);
				        }else if(data.status==101){
				        	layer.msg('添加失败');
				        }else if(data.status==103){
				        	layer.msg('整数类型错误');
				        }else if(data.status==104){
				        	layer.msg('小数类型错误');
				        }else if(data.status==105){
				        	layer.msg('日期类型错误');
				        }else if(data.status==106){
				        	layer.msg('字符文本长度错误');
				        }
				    },
				    error: function(jqXHR){     
				        layer.msg('请求失败');
				    }
				})
			}
		},
		remove:function(list){
			//删除产品信息类目
			var product_id = list[0].product_id;
			layer.confirm(' 确定删除该条目(如果删除的是主体，变体也将一起删除)?', {
			      btn: ['确定','取消'] //按钮
			    },function(){
			        $.ajax({
			            type: "POST",
			            url: "http://192.168.1.42/canton/index.php/del/batchinfo", //添加请求地址的参数
			            dataType: "json",
			            timeout:5000,
			            data:{
			                product_id:product_id
			            },
			            success: function(data){
			                if(data.status==100){
			                    layer.msg('删除成功');
			                    location.reload(true);
			                }
			            },
			            error: function(jqXHR){     
			                layer.msg('请求失败');
			            }
			        })
			    })
		}
	}
})