// created by msh at 16:06 2016.12.15

var dataCount = new Vue({
	el:'body',
	data:{
		list:[]
	},
	ready:function(){
		var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
		$.ajax({
		    type: "POST",
		    url: serverUrl+"get/tablecount", //添加请求地址
		    data:{
		    	key:oKey,
                user_id:token
		    },
		    dataType: "json",
		    success: function(data){
		        layer.close(LoadIndex); //关闭遮罩层
		        if(data.status==100){
		            dataCount.list = data.value;
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
		    error: function(jqXHR){
		        layer.close(LoadIndex); //关闭遮罩层     
		        layer.msg('从服务器请求失败');
		    }
		})
	},
	methods:{
		//刷新
		Reflesh:function(){
			location.reload(true);
		}
	}
})