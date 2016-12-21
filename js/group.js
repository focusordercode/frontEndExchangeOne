console.log(serverUrl);

// 组织机构树形菜单的组件
Vue.component('item', {
    template: '#item-template',
    props: {
        model: Object,
        rol:Object
    },
    data: function() {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function() {
            return this.model.son && this.model.son.length
        },
    },
    methods: {
        //点击展开子机构
        toggle: function(model) {
            if (this.isFolder) {
                this.open = !this.open
                console.log(this.open)
            }
        },
        //点击机构
        selected: function(model) {
            var id = model.id,
                name = model.name,
                introduce = model.introduce,
                sonLen = model.son.length;
                
            var selected = {
                id,
                name,
                introduce,
                sonLen,
            };
        }
    }
})
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
		son:{},
		roledata:{},
		editOne:'',
		//新增角色数据
		addname:'',
		orgSelect:[], //选择的机构
		orgids:[],//选中机构的ID
		addremark:'',
		//搜索机构数据
		oneList:'',
		orgds:[]//修改信息时机构的数据
	},
	ready:function(){
		//获取角色的列表
		$.ajax({
			type:'POST',
			url:serverUrl+'get/roles',
			datatype:'json',
			data:{
				key:oKey,
        		user_id:token,
				vague:''
			},
			success:function(data){
				if (data.status == 100) {
					rolegroup.roledata = data.value;
				}else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }
			},
			error:function (jqXHR) {
				layer.msg('向服务器请求失败');
			}
		})
		// 获取树形的数据
		$.ajax({
            type: 'POST',
            url: serverUrl+'get/org',
            datatype: 'json',
            data:{
            	key:oKey,
        		user_id:token,
                isGetRole:1
            },
            success: function(data) {
                if(data.status==100){
                    rolegroup.son = data.value[0];
                }else if(data.status==101){
                    layer.msg(data.msg);
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }
            },
            error: function(jqXHR) {
                layer.msg('向服务器请求组织机构失败');
            }
        })
	},
	computed:{

	},
	methods:{
		//添加角色
		addrole:function(){
			var vm = this;
			var sel = vm.orgSelect; 
			var orgids = getroleid(sel);
			var creator_id = cookie.get('id');
			name = vm.addname;
			remark = vm.addremark;
			org_id = orgids;
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
						key:oKey,
                		user_id:token,
                		creator_id:creator_id,
						name:name,
						remark:remark,
						enabled:1,
						org_id:org_id
					},
					success:function(data){
						if (data.status == 100) {
							layer.msg('添加成功');
							//重新刷新
                            setTimeout(windowFresh(),1000);
						}else if (data.status == 101) {
							layer.msg('操作失败');
						}else if (data.status == 102) {
							layer.msg('参数错误');
						}else if(data.status==1012){
		                    layer.msg('请先登录',{time:2000});
		                    
		                    setTimeout(function(){
		                        jumpLogin(loginUrl,NowUrl);
		                    },2000);
		                }else if(data.status==1011){
		                    layer.msg('权限不足,请跟管理员联系');
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
		//修改时选中机构
		selectOned:function(one){
			var vm = this;
			var orgds = [];
			var hasOne = [];
			orgds = vm.editOne.org;
			console.log(orgds)
			for(var i = 0;i<orgds.length;i++){
				if(orgds[i]==one){
					hasOne.push(i);
				}
			}
			console.log(hasOne)
			if(hasOne.length){
				layer.msg("已经选中了");
			}else{
				vm.orgds.push(one);
			}
		},
		//删除选中机构
		removeOrg:function(org){
			var vm = this;
			vm.orgSelect.$remove(org);
		},
		//修改时删除机构
		removeOrgd:function(orgd){
			var vm = this;
			vm.editOne.org.$remove(orgd);
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
						key:oKey,
                		user_id:token,
						id:id
					},
					success:function(data){
						if (data.status == 100) {
							rolegroup.editOne = data.value[0];
							rolegroup.orgds = rolegroup.editOne.org;
						}else if(data.status==1012){
		                    layer.msg('请先登录',{time:2000});
		                    
		                    setTimeout(function(){
		                        jumpLogin(loginUrl,NowUrl);
		                    },2000);
		                }else if(data.status==1011){
		                    layer.msg('权限不足,请跟管理员联系');
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
			var orgs = vm.orgds;

			if (!vm.editOne.name.trim()) {
				layer.msg('角色名称不能为空');
			}else {
				$.ajax({
					type:'POST',
					url:serverUrl+'update/roles',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						role_id:id,
						name:name,
						enabled:enabled,
						remark:remark,
						org_ids:orgs
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
						}else if(data.status==1012){
		                    layer.msg('请先登录',{time:2000});
		                    
		                    setTimeout(function(){
		                        jumpLogin(loginUrl,NowUrl);
		                    },2000);
		                }else if(data.status==1011){
		                    layer.msg('权限不足,请跟管理员联系');
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
					key:oKey,
            		user_id:token,
					role_id:id
				},
				success:function(data){
					if (data.status == 100) {
						layer.msg('操作成功');
						setTimeout(getlist(),1000);
					}else if (data.status == 101) {
						layer.msg('操作失败');
					}else if (data.status == 102) {
						layer.msg(data.msg);
					}else if (data.status == 103) {
						layer.msg('角色有关联用户');
					}else if(data.status==1012){
	                    layer.msg('请先登录',{time:2000});
	                    
	                    setTimeout(function(){
	                        jumpLogin(loginUrl,NowUrl);
	                    },2000);
	                }else if(data.status==1011){
	                    layer.msg('权限不足,请跟管理员联系');
	                }
				},
				error:function (jqXHR) {
					layer.msg('向服务器请求失败');
				}
			})
		},
		getlist:function(){
			$.ajax({
			type:'POST',
			url:serverUrl+'get/roles',
			datatype:'json',
			data:{
				key:oKey,
        		user_id:token,
				vague:''
			},
			success:function(data){
				if (data.status == 100) {
					rolegroup.roledata = data.value;
				}else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
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
		url:serverUrl+'search/org',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			searchText:searchCusVal
		},
		success:function(data){
			if(data.status == 100){
				rolegroup.oneList = data.value;
			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
				rolegroup.oneList = '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求搜索机构失败');
		}
	})
});
//获取树形分类函数
function getTreeData(vm) {
    $.ajax({
        type: 'POST',
        url: serverUrl+'get/org',
        datatype: 'json',
        data:{
        	key:oKey,
    		user_id:token,
            isGetRole:0
        },
        success: function(data) {
            if(data.status==100){
                vm.son = data.value[0];
            }else if(data.status==101){
                layer.msg(data.msg);
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
        },
        error: function(jqXHR) {
            layer.msg('向服务器请求组织机构失败');
        }
    })
}

//获取选中的机构的ID
function getroleid(orgSelect){
    var orgids = [];
    for (var i = 0; i < orgSelect.length; i++) {
        orgids.push(orgSelect[i].id);
    }
    return orgids
}
//重新获取角色的列表
function getlist(){
	$.ajax({
		type:'POST',
		url:serverUrl+'get/roles',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			vague:''
		},
		success:function(data){
			if (data.status == 100) {
				rolegroup.roledata = data.value;
			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
		},
		error:function (jqXHR) {
			layer.msg('向服务器请求失败');
		}
	})
}
