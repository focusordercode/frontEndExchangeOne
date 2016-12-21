// Creat by msh at 2016.10.14

var temp = serverUrl+"Public/file/CenterItem.xlsx"  //模板地址
console.log(serverUrl); //后端接口地址

var oCreat = new Vue({
    el:'body',
    data:{
		name:'',
		remark:'',
		enabled:1,
		// 下面的是交互用的数据
		en_alert:false,
		// 批量
		download:temp,
		respons:''
    },
    methods:{
    	//创建产品
    	creatProduct:function(){
    		var vm = oCreat;
            var creator_id = cookie.get('id');
    		if(!(this.name.trim())){
    			this.en_alert = true;
    		}else{
    			this.en_alert = false;

    			$.ajax({
    			    type:'POST',
    			    url:serverUrl+'add/centeritem',
    			    datatype:'json',
    			    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
    			        name:vm.name,
    			        remark:vm.remark,
    			        enabled:vm.enabled,
    			        state:'single'
    			    },
    			    success:function(data){
    			        if(data.status==100){
    			            layer.msg('保存成功');
    			            vm.name = '';
    			            vm.remark = '';
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
    			    error:function(jqXHR){
    			        layer.msg('向服务器请求失败');
    			    }
    			})
    		}
    	},
    	//上传模板文件
    	upload:function(){
    		var fileData = $('#file').val();//文件数据
            if(!fileData){
    			this.cate_alert = false;
    			layer.msg('请先选择文件');
    		}else{
    			this.cate_alert = false;

    			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

    			var vm = oCreat;
    			var state = 'many';//类型
                var creator_id = cookie.get('id');
    			var formData = new FormData();
    			formData.append('file', $('#file')[0].files[0]);//文件
    			formData.append('state', state);//参数
                formData.append('key', oKey);//参数
                formData.append('user_id', token);//参数
                formData.append('creator_id', creator_id);//创建者的ID

    			$.ajax({
    			    url:serverUrl+'add/centeritem',
    			    type:'POST',
    			    cache: false,
    			    data:formData,
    			    processData: false,
    			    contentType: false,
    			    success:function(data){
    			        layer.close(LoadIndex); //关闭遮罩层
    			        if(data.status==100){
    			            layer.msg('上传成功');
    			            vm.respons = data.value;
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
    			    error:function(jqXHR){
    			        layer.close(LoadIndex); //关闭遮罩层
    			        layer.msg('上传失败');
    			    }
    			})
    		}
    	}
    }
})