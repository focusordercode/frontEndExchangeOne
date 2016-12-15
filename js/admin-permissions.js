console.log(serverUrl);

Vue.component('per', {
    template: '#per-template',
    props: {
        model: Array
    },
    data: function() {
        return {
            //父节点
            add_father:{
            	p_id:0,
            	auth_address:'',
            	name:''
            },
            open_father:false,//添加父节点开关
            //子节点
            add_son:{
            	p_id:'',
            	auth_address:'',
            	name:''
            }
        }
    },
	methods:{
		//打开添加父节点
		open_big:function () {
			if(this.open_father){
				this.open_father = false
			}else{
				this.open_father = true
			}
		},
		//添加父节点
		add_big:function(){
			var vm = this;
			var En = /^[A-z/]+$/;
			var p_id = 0;
			var address = vm.add_father.auth_address.trim();
			var name = vm.add_father.name.trim();
			if(!address||!En.test(address)){
				layer.msg('地址不能为空,且必须是英文');
			}else if(!name){
				layer.msg('名称不能为空');
			}else{
				addData(vm,p_id,address,name);
			}
		},
		//打开添加子节点:
		open_small:function(per){
			if(per.open_son){
				per.open_son = false
			}else{
				per.open_son = true
			}
		},
		//添加子节点
		add_small:function(per){
			var vm = this;
			var En = /^[A-z/]+$/;
			var p_id = per.id;
			var address = vm.add_son.auth_address.trim();
			var name = vm.add_son.name.trim();
			if(!address||!En.test(address)){
				layer.msg('地址不能为空,且必须是英文');
			}else if(!name){
				layer.msg('名称不能为空');
			}else{
				addData(vm,p_id,address,name);
			}
		},
		//删除父节点
		deleteBigOne:function(per){
			var vm = this;
			var id = per.id;
			layer.confirm('确认删除?',function(index){
				layer.close(index);
				deleteData(id);
			})
		},
		//删除子节点
		deleteSmallOne:function(model_son){
			var vm = this;
			var id = model_son.id;
			layer.confirm('确认删除?',function(index){
				layer.close(index);
				deleteData(id);
			})
		},
		//打开编辑父节点
		open_big_eidt:function(per){
			permission.edit_big =  $.extend(true, {}, per);
			$('.editBig').modal('show');
		},
		//打开编辑子节点
		open_small_eidt:function(model_son){
			permission.editOne =  $.extend(true, {}, model_son);
			$('.editTable').modal('show');
		}
	}
})

var permission = new Vue({
	el:'body',
	data:{
		pers:[],//获取到的权限节点数据
		editOne:'',//编辑子节点
		edit_big:'' //编辑父节点
	},
	ready:function(){
		var enabled = 1;
		getPers(enabled);
	},
	methods:{
		//提交子节点编辑
		save_edit:function(){
			var vm = this;
			var En = /^[A-z/]+$/;
			var rule_id = vm.editOne.id;
			var address = vm.editOne.auth_address.trim();
			var name = vm.editOne.name.trim();
			if(!address||!En.test(address)){
				layer.msg('地址不能为空,且必须是英文');
			}else if(!name){
				layer.msg('名称不能为空');
			}else{
				updateData(vm,rule_id,address,name);
			}
		},
		//提交父节点编辑
		save_big:function(){
			var vm = this;
			var En = /^[A-z/]+$/;
			var rule_id = vm.edit_big.id;
			var address = vm.edit_big.auth_address.trim();
			var name = vm.edit_big.name.trim();
			if(!address||!En.test(address)){
				layer.msg('地址不能为空,且必须是英文');
			}else if(!name){
				layer.msg('名称不能为空');
			}else{
				updateData(vm,rule_id,address,name)
			}
		}
	}
})

//获取权限节点函数
function getPers(enabled) {
	$.ajax({
		type:'POST',
		url:serverUrl+'get/rule',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			enabled:enabled
		},
		success:function(data){
			if(data.status == 100){
				permission.pers = data.value;
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
			layer.msg('向服务器请求权限节点失败');
		}
	})
}

//添加节点函数
function addData(vm,p_id,address,name){
	$.ajax({
		type:'POST',
		url:serverUrl+'add/rule',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			p_id:p_id,
			auth_address:address,
			name:name
		},
		success:function(data){
			if(data.status == 100){
				layer.msg('添加成功');
				vm.add_father.auth_address = '';
				vm.add_father.name = '';
				vm.add_son.auth_address = '';
				vm.add_son.name = '';
				//刷新
				var enabled = 1;
				getPers(enabled);
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

//提交编辑函数
function updateData(vm,rule_id,address,name){
	$.ajax({
		type:'POST',
		url:serverUrl+'edit/rule',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			rule_id:rule_id,
			auth_address:address,
			name:name,
			enabled:1
		},
		success:function(data){
			if(data.status == 100){
				layer.msg('保存成功');
				$('.editTable').modal('hide');
				$('.editBig').modal('hide');
				//刷新
				var enabled = 1;
				getPers(enabled);
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

//删除节点函数
function deleteData(id){
	$.ajax({
		type:'POST',
		url:serverUrl+'delete/rule',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			rule_id:id
		},
		success:function(data){
			if(data.status == 100){
				layer.msg('删除成功');
				//刷新
				var enabled = 1;
				getPers(enabled);
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

$(document).ready(function(){
    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
});