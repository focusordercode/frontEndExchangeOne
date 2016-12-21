// Creat by msh 2016.10.19
console.log(serverUrl); //后端接口地址

var model = new Vue({
	el:'body',
	data:{
		cn_name:'',
		en_name:'',
		remark:'',
		valueList:''
	},
	ready:function () {
		updateData();
	},
	computed:{
		//添加按钮
		addBtn:function () {
			if (!this.cn_name.trim()&&!this.en_name.trim()) {
				return true
			}else{
				return false
			}
		}
	},
	methods:{
		//添加
		addOne:function () {
			var vm = model,
				cn_name = this.cn_name,
				en_name = this.en_name,
				remark = this.remark;
			//英文正则,英文数字和空格
			var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;
			if (!cn_name.trim()) {
				layer.msg('中文名不能为空');
			}else if (!en_name.trim()||!Entext.test(en_name)) {
				layer.msg('英文名不能为空,英文名只能是大小写字母和空格');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'add/businessmodel',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						cn_name:cn_name,
						en_name:en_name,
						remark:remark
					},
					success:function (data) {
						if (data.status==100) {
							layer.msg('添加成功');
							vm.cn_name = '';
							vm.en_name = '';
							vm.remark = '';
							//更新列表
							updateData();
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
					error:function (jqXHR) {
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//删除
		deleteOne:function (table) {
			var id = table.id,
				vm = model;
			layer.confirm('确定删除?',{
				btn:['确定','取消']
			},function(index){
				layer.close(index);
				
				$.ajax({
					type:'POST',
					url:serverUrl+'delete/businessmodel',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						id:id
					},
					success:function (data) {
						if (data.status==100) {
							layer.msg('删除成功');
							
							vm.valueList.$remove(table);
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
					error:function (jqXHR) {
						layer.msg('向服务器请求失败');
					}
				})
			})
		}
	}
})

//更新列表函数
function updateData () {
	$.ajax({
		type:'POST',
		url:serverUrl+'get/businessmodel',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
		},
		success:function (data) {
			if (data.status==100) {
				model.valueList = data.value;
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
		error:function (jqXHR) {
			layer.msg('向服务器请求失败');
		}
	})
}