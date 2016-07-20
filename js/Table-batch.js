//刷新函数
function windowFresh(){
    location.reload(true);
}

var oTableInfo = new Vue({
	el:'body',
	data:{
		tableInfo:''
	},
	ready:function(){
		$.ajax({
		    type: "POST",
		    url: "http://192.168.1.42/canton/index.php/get/infoform", //添加请求地址的参数
		    dataType: "json",
		    timeout:5000,
		    data:{
		        category_id:'',
		        type_code:'batch',
		    },
		    success: function(data){
		        if(data.status==100){
		        	oTableInfo.tableInfo = data.value;
		        }
		    },
		    error: function(jqXHR){     
		        layer.msg('向服务器获取信息失败');
		    }
		})
	},
	methods:{
		//删除
		delete:function(item){
			var Id = item.id;
			var type_code = item.type_code;

			layer.confirm('是否确认删除?', {
			  btn: ['确定','关闭'] //按钮
			},function(){
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.42/canton/index.php/del/infoform", //添加请求地址的参数
				    dataType: "json",
				    timeout:5000,
				    data:{
				        id:Id,
				        type_code:type_code,
				    },
				    success: function(data){
				        if(data.status==100){
				        	oTableInfo.tableInfo.$remove(item);
				        	layer.msg('删除成功');
				        }else if(data.status==101){
				        	layer.msg('操作失败');
				        }else if(data.status==102){
				        	layer.msg('id为空');
				        }else if(data.status==108){
				        	layer.msg('已经启用的无法删除');
				        }
				    },
				    error: function(jqXHR){     
				        layer.msg('向服务器请求失败');
				    }
				})
			})
		},
		//启用
		start:function(item){
			var Id = item.id;
			var type_code = item.type_code;

			layer.confirm('一经启用，不可以编辑和删除，是否启用?', {
			  btn: ['确定','关闭'] //按钮
			},function(){
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.42/canton/index.php/use/infoform", //添加请求地址的参数
				    dataType: "json",
				    timeout:5000,
				    data:{
				        id:Id,
				        type_code:type_code,
				    },
				    success: function(data){
				        if(data.status==100){
				        	layer.msg('启用成功');
				        }else if(data.status==101){
				        	layer.msg('操作失败');
				        }else if(data.status==102){
				        	layer.msg('id为空');
				        }
				    },
				    error: function(jqXHR){     
				        layer.msg('向服务器请求失败');
				    }
				})
			})
		}
	}
})

//Vue过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing": str = "定义";break;
        case "enabled": str = "启用";break;
        case "disabled": str = "停用";break;
    }
    return str;
})