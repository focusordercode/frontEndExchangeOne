console.log(serverUrl); //后端接口地址
var num = 15;//每页展示个数

var customer = new Vue({
	el:'body',
	data:{
		cusData:'',
		//分页
		cus_count:'',
		pageNow:'',
		countPage:'',
		prePage:'',
		nextPage:'',
		jumpPage:'',
		jumpBtn:'',
		//控制删除全部和全选按钮
		deleteAll:'',
		selectAllBtn:{
			checked:false
		},
		//添加新客户
		addNew:{
			custom_name:'',
			en_name:'',
			company:'',
			mobile:'',
			email:'',
			address:''
		},
		//编辑客户
		editOne:''
	},
	ready:function(){
		var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

		//获取所有客户信息
		$.ajax({
			type:'POST',
			url:serverUrl+'get/custom',
			datatype:'json',
			data:{
				key:oKey,
                user_id:token,
				pageSize:num
			},
			success:function(data){
				layer.close(LoadIndex); //关闭遮罩层
				if(data.status==100){
					customer.cus_count = data.cus_count;
					customer.pageNow = data.pageNow;
					customer.countPage = data.countPage;
					customer.cusData = data.value;
					var cusLen = customer.cusData.length;
					for(var i = 0;i<cusLen;i++){
						Vue.set(customer.cusData[i],'checked',false);
					}
				}else if(data.status==101){
					layer.msg('获取失败，客户信息为空');
				}else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});

                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }
			},
			error:function(jqXHR){
				layer.close(LoadIndex); //关闭遮罩层
				layer.msg('向服务器请求客户信息失败');
			}
		})
	},
	computed:{
		//上一页的可用状态
		prePage:function(){
			var pageNow = this.pageNow;
			if(pageNow<=1){
				return true
			}else {
				return false
			}
		},
		//下一页的可用状态
		nextPage:function(){
			var countPage = this.countPage;
			var pageNow = this.pageNow;
			if(countPage<=1){
				return true
			}else if(pageNow==countPage) {
				return true
			}else{
				return false
			}
		},
		//跳转按钮可用状态
		jumpBtn:function(){
			var jumpPage = this.jumpPage;
			if(!jumpPage){
				return true
			}else{
				return false
			}
		}
	},
	methods:{
		//删除选中按钮
		removeSelect:function(){
			var vm = this,
				cusData = vm.cusData,
				cusLen = cusData.length;
			var checkedArr = [];
			for(var i = 0;i<cusLen;i++){
				if(cusData[i].checked){
					checkedArr.push(cusData[i].id);
				}
			}

			layer.confirm('确定删除选中?',{
				btn:['确定','取消']
			},function(){
				if(!checkedArr.length){
					layer.msg('没有选中任何客户');
				}else{
					$.ajax({
						type:'POST',
						url:serverUrl+'delete/custom',
						datatype:'json',
						data:{
							key:oKey,
                			user_id:token,
							id:checkedArr
						},
						success:function(data){
							if(data.status==100){
								layer.msg('删除成功');
								setInterval(windowFresh,1000);
							}else if(data.status==101){
								layer.msg('操作失败');
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
							layer.msg('向服务器请求删除失败');
						}
					})
				}
			})
		},
		removeThis:function(table){
			var vm = this;
			var pageNow = this.pageNow;

			layer.confirm('确定删除该客户?',{
				btn:['确定','取消']
			},function(index){
				layer.close(index);

				$.ajax({
					type:'POST',
					url:serverUrl+'delete/custom',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						id:table.id
					},
					success:function(data){
						if(data.status==100){
							vm.cusData.$remove(table);
							layer.msg('删除成功');
							setTimeout(getPageData (vm,pageNow,num),1000);
						}else if(data.status==101){
							layer.msg('操作失败');
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
						layer.msg('向服务器请求删除失败');
					}
				})
			});
		},
		addTable:function(){
			$('.addTable').modal('show');
			$('.addTable').css('margin-top','200px');
		},
		//提交新增客户
		subTable:function(){
			var addNew = this.addNew;
			// var tel = /^1[34578]{1}[0-9]{9}$/;
			var tel = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
			var EN = /^[A-z\s]+$/;
			var Email = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;

			if(!(addNew.custom_name.trim())){
				layer.msg('客户名称为空');
			}else if(!(addNew.en_name.trim())&&!EN.test(addNew.en_name)){
				layer.msg('英文名不能为空,英文名只能是大小写字母和空格');
			}else if (!(addNew.company.trim())) {
				layer.msg('公司名不能为空');
			}else if(!tel.test(addNew.mobile)&&addNew.mobile.trim()){
				layer.msg('电话格式要填写正确');
			}else if(!Email.test(addNew.email)&&addNew.email.trim()){
				layer.msg('邮箱格式要填写正确');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'post/custom',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						data:addNew
					},
					success:function(data){
						if(data.status==100){
							layer.msg('添加成功');
							setInterval(windowFresh,1000);
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==102){
							layer.msg('参数错误');
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
						layer.msg('向服务器请求添加失败');
					}
				})
			}
		},
		//编辑客户
		edit:function(table,index){
			var vm = this;
			$('.editTable').modal('show');
			$('.editTable').css('margin-top','200px');
			vm.editOne = $.extend(true, {}, table);
		},
		//提交编辑
		subEdit:function(){
			var addNew = this.editOne;
			// var tel = /^1[34578]{1}[0-9]{9}$/;
			var tel = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
			var EN = /^[A-z\s]+$/;
			var Email = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;

			if(!(addNew.custom_name.trim())){
				layer.msg('客户名称为空');
			}else if(!(addNew.en_name.trim())&&!EN.test(addNew.en_name)){
				layer.msg('英文名不能为空,英文名只能是大小写字母和空格');
			}else if (!(addNew.company.trim())) {
				layer.msg('公司名不能为空');
			}else if(!tel.test(addNew.mobile)&&addNew.mobile.trim()){
				layer.msg('电话格式要填写正确');
			}else if(!Email.test(addNew.email)&&addNew.email.trim()){
				layer.msg('邮箱格式要填写正确');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'update/custom',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						data:addNew
					},
					success:function(data){
						if(data.status==100){
							layer.msg('修改成功');
							$('.editTable').modal('hide');
							setInterval(windowFresh,1000);
						}else if(data.status==101){
							layer.msg('操作失败,未作出任何修改');
						}else if(data.status==102){
							layer.msg('参数错误');
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
						layer.msg('向服务器请求修改失败');
					}
				})
			}
		},
		//取消编辑
		cancel:function(){
			//还原数据
			this.editOne = '';
			$('.editTable').modal('hide');
		},
		//上一页
		preP:function(){
			var pageNow = this.pageNow;
			var vm = this;
			if(pageNow<=1){
			    layer.msg('没有上一页啦');
			}else{
			    pageNow--
			    getPageData (vm,pageNow,num);
			}
		},
		//下一页
		nextP:function(){
			var pageNow = this.pageNow;
			var countPage = this.countPage;
			var vm = this;
			if(pageNow==countPage){
			    layer.msg('没有下一页啦');
			}else{
			    pageNow++
			    getPageData (vm,pageNow,num);
			}
		},
		//跳转
		jumpP:function(){
			var jumpPage = this.jumpPage;
			var countPage = this.countPage;
			var vm = this;
			//获取客户信息
			if(jumpPage<1){
				layer.msg('输入页数不符合要求');
			}else if(jumpPage>countPage){
				layer.msg('输入页码大于总页数');
				vm.jumpPage = '';
			}else{
				getPageData (vm,jumpPage,num);
			}
		},
		//全选按钮
		selectAll:function(){
			var selectBtn = this.selectAllBtn.checked;
			var vm = this;
			if(selectBtn==false){
				selectBtn = true;
				var picDataLength = vm.cusData.length;
				for(var i = 0;i<picDataLength;i++){
					vm.cusData[i].checked = true;
				}
			}else{
				selectBtn = false;
				var picDataLength = vm.cusData.length;
				for(var i = 0;i<picDataLength;i++){
					vm.cusData[i].checked = false;
				}
			}
		}
	}
})

//检测表格数据的选中状态，控制批量删除按钮全选按钮
customer.$watch('cusData', function (data) {
	var cusLen = data.length;
	var checkedArr = new Array();
	for(var i = 0;i<cusLen;i++){
		if(data[i].checked){
			checkedArr.push(data[i].id);
		}
	}

	if(checkedArr.length<=0){
		customer.deleteAll = false;
	}else{
		customer.deleteAll = true;
	}
	//全选按钮
	if(checkedArr.length==data.length){
		customer.selectAllBtn.checked =  true
	}else{
		customer.selectAllBtn.checked =  false
	}
},{
	deep:true
})

//Vue过滤器
Vue.filter('ListNum',function(value){
    var str = value;
    var pageNow = customer.pageNow;
    if(pageNow==1){
    	str = str + 1;
    }else if(pageNow>1){
    	str = (pageNow-1)*num+str+1;
    }
    return str
})

//刷新函数
function windowFresh(){
    location.reload(true);
}

//获取数据函数,翻页
function getPageData (vm,pageNow,num) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
    	type:'POST',
    	url:serverUrl+'get/custom',
    	datatype:'json',
    	data:{
    		key:oKey,
            user_id:token,
    		pageNow:pageNow,
    		pageSize:num
    	},
    	success:function(data){
    		layer.close(LoadIndex); //关闭遮罩层
    		if(data.status==100){
    			vm.cus_count= data.cus_count;
    			vm.pageNow= data.pageNow;
    			vm.countPage= data.countPage;
    			vm.cusData= data.value;
    			var cusLen = vm.cusData.length;
    			for(var i = 0;i<cusLen;i++){
    				Vue.set(vm.cusData[i],'checked',false);
    			}
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
    		layer.msg('向服务器请求客户信息失败');
    	}
    })
}