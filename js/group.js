console.log(serverUrl);

//状态过滤
Vue.filter('staFlilter',function(value){
    var str;
    if (value == 0) {
    	str = "关闭";
    }else if (value == 1) {
    	str = "启用";
    }
    return str;
})

var rolegroup = new Vue({
	el:'body',
	data:{
		roledata:{},
		editOne:'',
		//新增用户数据
		addname:'',
		orgSelect:[], //选择的机构
		addremark:'',
		//搜索机构数据
		oneList:''
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/roles',
			datatype:'json',
			data:{
				vague:''
			},
			success:function(data){
				if (data.status == 100) {
					rolegroup.roledata = data.value;
				}
			},
			error:function (jqXHR) {
				layer.msg('向服务器请求失败');
			}
		})
	},
	computed:{

	},
	methods:{
		//添加角色
		addrole:function(){
			var vm = this;
			var orgid = [];
			name = vm.addname;
			remark = vm.addremark;
			org_id = vm.orgSelect;
			if (!name.trim()) {
				layer.msg('请填写角色名称');
			}else if (org_id=='') {
				layer.msg('请选择组织机构');
			}else {
				$.ajax({
					type:'POST',
					url:serverUrl+'add/roles',
					datatype:'json',
					data:{
						name:name,
						remark:remark,
						enabled:1,
						org_id:org_id
					},
					success:function(data){
						if (data.status == 100) {
							layer.msg('操作成功');
							//重新刷新
                            
						}else if (data.status == 101) {
							layer.msg('操作失败');
						}else if (data.status == 102) {
							layer.msg('参数错误');
						}
					},
					error:function (jqXHR) {
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//点击选中一个机构
		selectOne:function(one){
			var vm = this;
			var orgSelect = [];
			var hasOne = [];
			orgSelect = vm.orgSelect;
			console.log(orgSelect)
			for(var i = 0;i<orgSelect.length;i++){
				if(orgSelect[i]==one){
					hasOne.push(i);
				}
			}
			console.log(hasOne)
			if(hasOne.length){
				layer.msg("已经选中了");
			}else{
				vm.orgSelect.push(one);
			}
		},
		//删除选中机构
		removeOrg:function(org){
			var vm = this;
			vm.orgSelect.$remove(org);
		},
		//修改角色信息
		edit:function(role,index){
			var vm = this;
			var id = role.id;
			$('.editTable').modal('show');
			$('.editTable').css('margin-top','200px');
				$.ajax({
					type:'POST',
					url:serverUrl+'get/roles',
					datatype:'json',
					data:{
						id:id
					},
					success:function(data){
						if (data.status == 100) {
							rolegroup.editOne = data.value[0];
						}
					},
					error:function (jqXHR) {
						layer.msg('向服务器请求失败');
					}
				})
		},
		//取消编辑
		cancel:function(){
			//还原数据
			this.editOne = '';
			$('.editTable').modal('hide');
		},
		//提交保存
		subrole:function(){
			var vm = this;
			var id = vm.editOne.id;
			var name = vm.editOne.name;
			var enabled = vm.editOne.enabled;
			var remark = vm.editOne.remark;

			if (!vm.editOne.name.trim()) {
				layer.msg('角色名称不能为空');
			}else {
				$.ajax({
					type:'POST',
					url:serverUrl+'update/roles',
					datatype:'json',
					data:{
						role_id:id,
						name:name,
						enabled:enabled,
						remark:remark,
					},
					success:function(data){
						if (data.status == 100) {
							layer.msg('操作成功');
							//重新刷新
                            setTimeout(windowFresh(),1000);
						}else if (data.status == 101) {
							layer.msg('操作失败');
						}else if (data.status == 102) {
							layer.msg('参数错误');
						}
					},
					error:function (jqXHR) {
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//删除按钮
		delerole:function(role){
			var vm = this;
			var id = role.id;
			$.ajax({
				type:'POST',
				url:serverUrl+'del/roles',
				datatype:'json',
				data:{
					role_id:id
				},
				success:function(data){
					if (data.status == 100) {
						layer.msg('操作成功');
						setTimeout(windowFresh(),1000);
					}else if (data.status == 101) {
						layer.msg('操作失败');
					}else if (data.status == 102) {
						layer.msg('参数错误');
					}else if (data.status == 103) {
						layer.msg('角色有关联用户');
					}
				},
				error:function (jqXHR) {
					layer.msg('向服务器请求失败');
				}
			})
		}
	}
})
//刷新函数
function windowFresh(){
    location.reload(true);
}

//搜索机构框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
})

//搜索机构
$('.searchCate').on('keyup',function(){
	var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
	$('.pors .cate-list').css('width',getWidth);
	var searchCusVal = $('.searchCate').val();
	$.ajax({
		type:'POST',
		url:'http://192.168.1.40/canton/search/org',
		datatype:'json',
		data:{
			searchText:searchCusVal
		},
		success:function(data){
			if(data.status == 100){
				rolegroup.oneList = data.value;
			}else{
				rolegroup.oneList = '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求搜索机构失败');
		}
	})
});