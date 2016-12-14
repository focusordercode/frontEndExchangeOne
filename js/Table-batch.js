console.log(serverUrl); //后端接口地址
var search = serverUrl+"index.php/vague/name"; //模糊搜索地址
var num = 25;//每页展示个数

var type_code = 'batch';

var oTableInfo = new Vue({
	el:'body',
	data:{
		tableInfo:'',//表格数据数组
		count:'',//统计所有的数据
		countPage:'',
		pageNow:'',
		jump:'',
		// 搜索类目
		proList:'',
		//搜索条件
		searchFeild:{
			status_code:'',
			keyword:'',
			cate_name:'',
			cateId:''
		},
		//交互数据
		searchResult:'', //搜索成功后的条件
        infoCache:'',//信息修改暂存
        sites:[
			'UK',
			'USA',
			'France',
			'Italy',
			'Spain',
			'Germany'
		]
	},
	ready:function(){
		var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
		$.ajax({
		    type: "POST",
		    url: serverUrl+"get/infoform", //添加请求地址的参数
		    dataType: "json",
		    data:{
		    	key:oKey,
                user_id:token,
		        category_id:'',
		        type_code:type_code,
		        num:num
		    },
		    success: function(data){
		    	layer.close(LoadIndex); //关闭遮罩层
		        if(data.status==100){
		        	oTableInfo.tableInfo = data.value;
		        	oTableInfo.count = data.count;
		        	oTableInfo.countPage = data.countPage;
		        	oTableInfo.pageNow = data.pageNow;
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
		        layer.msg('向服务器获取信息失败');
		    }
		})
	},
	computed:{
		//三个按钮状态
		jumpBtn:function(){
			var jump = this.jump;
			if(!jump){
				return true
			}else{
				return false
			}
		},
		prePageBtn:function(){
			var pageNow = this.pageNow;
			if(pageNow<=1){
				return true
			}else{
				return false
			}
		},
		nextPageBtn:function(){
			var pageNow = this.pageNow;
			var countPage = this.countPage;
			if(pageNow==countPage||countPage==0){
				return true
			}else{
				return false
			}
		}
	},
	methods:{
		//删除
		remove:function(item){
			var Id = item.id,
				vm = this;
			var search = vm.searchResult;
			var pageNow = vm.pageNow;

			layer.confirm('是否确认删除?', {
			  btn: ['确定','关闭'] //按钮
			},function(){
				$.ajax({
				    type: "POST",
				    url: serverUrl+"index.php/del/infoform", //添加请求地址的参数
				    dataType: "json",
				    data:{
				    	key:oKey,
                		user_id:token,
				        id:Id,
				        type_code:type_code
				    },
				    success: function(data){
				        if(data.status==100){
				        	vm.tableInfo.$remove(item);
				        	layer.msg('删除成功');
				        	setTimeout(getPageData(vm,pageNow,search,num,type_code),1000);
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
				        layer.msg('向服务器请求失败');
				    }
				})
			})
		},
		//新建表格
		creatTable:function(){
			// var w = window.open();
			$.ajax({
				type:'POST',
				url:serverUrl+'set/businesscode',
				datatype:'json',
				data:{
					key:oKey,
            		user_id:token,
					code:'TG'
				},
				success:function(data){
					if(data.status==100){
						var id = data.code;
						var url = 'batch-table-creat.html?tableID='+id;
						if(id){
							window.location.href = url;
						}
					}else if(data.status==101){
						layer.msg('请求失败，请重试');
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
					layer.msg('向服务器请求创建表格失败');
				}
			})
		},
		//刷新
		Reflesh:function(){
			location.reload(true);
		},
		//从搜索结果中选中一个类目
		selectCate:function(pro){
		    this.searchFeild.cate_name = pro.cn_name;
		    this.searchFeild.cateId = pro.id;
		    this.proList = '';
		    //清除值，隐藏框
		    $('.searchField').val('');
		    $('.searchInput').hide();
		    $('.modal-backdrop').hide();
		},
		// 取消选中类目
		cancelCate:function () {
			this.searchFeild.cate_name = '';
			this.searchFeild.cateId = '';
		},
		//搜索
		searchTable:function(){
			var keyword = this.searchFeild.keyword.trim();
			var status_code = this.searchFeild.status_code;
			var category_id = this.searchFeild.cateId;
			var searchFeild = this.searchFeild;
			var vm = this;
			if(!keyword&&!status_code&&!category_id){
				layer.msg('必须输入关键词,选择类目或者选择表格状态');
			}else{
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:serverUrl+'search/form',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						type_code:type_code,
						status_code:status_code,
						keyword:keyword,
						category_id:category_id,
						num:num
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							vm.tableInfo = data.value;
							vm.count = data.count;
							vm.countPage = data.countPage;
							vm.pageNow = data.pageNow;
							//搜索条件数据
							var newObj = $.extend(true, {}, vm.searchFeild);
    						vm.searchResult = newObj;
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
						layer.msg('向服务器请求搜索失败');
					}
				})
			}
		},
		//上一页
		goPrePage:function(){
			var pageNow = this.pageNow;
			var vm = this;
			var search = this.searchResult;
			if(pageNow<=1){
				layer.msg('没有上一页啦');
			}else{
				pageNow--
				getPageData (vm,pageNow,search,num,type_code);
			}
		},
		//下一页
		goNextPage:function(){
			var pageNow = this.pageNow;
			var countPage = this.countPage;
			var vm = this;
			var search = this.searchResult;
			if(pageNow==countPage){
				layer.msg('没有下一页啦');
			}else{
				pageNow++
				getPageData (vm,pageNow,search,num,type_code);
			}
		},
		//页面跳转
		goJump:function(){
			var jump = this.jump;
			var countPage = this.countPage;
			var vm = this;
			var search = this.searchResult;
			if(jump>countPage){
				layer.msg('大于总页数啦');
				vm.jump = '';
			}else if (jump<=0){
                layer.msg('页码错误');
                vm.jump = '';
            }else{
				getPageData (vm,jump,search,num,type_code);
				vm.jump = '';
			}
		},
		//修改表格信息
		infoXG:function(item){
			var vm = this;
			vm.infoCache = $.extend(true, {}, item);//复制数据
			if(item.id){
				$('.infoXG').modal('show');
			}
		},
		//提交修改
		saveXG:function(){
		    var infoCache = this.infoCache;
		    var pageNow = this.pageNow;
		    var vm = this;
		    var search = this.searchResult;
		    var title = infoCache.title.trim();
		    if(infoCache.id&&title){
		        $.ajax({
		        	type:'POST',
		        	url:serverUrl+'update/infoform',
		        	datatype:'json',
		        	data:{
		        		key:oKey,
                		user_id:token,
		        		type_code:type_code,
		        		id:infoCache.id,
		        		category_id:infoCache.category_id,
		        		template_id:infoCache.template_id,
		        		client_id:infoCache.client_id,
		        		site_name:infoCache.site_name,
		        		title:infoCache.title
		        	},
		        	success:function(data){
		        		if(data.status==100){
		        			layer.msg('保存成功');

		        			$('.infoXG').modal('hide');

		        			setTimeout(getPageData(vm,pageNow,search,num,type_code),1000);
		        		}else if(data.status==1012){
		                    layer.msg('请先登录',{time:2000});
		                    
		                    setTimeout(function(){
		                        jumpLogin(loginUrl,NowUrl);
		                    },2000);
		                }else if(data.status==1011){
		                    layer.msg('权限不足,请跟管理员联系');
		                }else {
		        			layer.msg(data.msg);
		        		}
		        	},
		        	error:function(jqXHR){
		        		layer.msg('向服务器请求失败');
		        	}
		        })
		    }else{
		    	layer.msg('不能为空');
		    }
		}
	}
})

//Vue过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing": str = "编辑产品";break;
        case "uploading": str = "上传图片";break;
        case "finished": str = "完成";break;
        case "halt": str = "终止";break;
    }
    return str;
})


//Vue过滤器
Vue.filter('statusLink',function(value){
	var item = value;
	var status = value.status_code;
	var tableID = item.id;
	var form_no = item.form_no;
	var template_id = item.template_id;
	var type_code = item.type_code;

	var edit = 'batch-table-edit.html';
	var donePage = 'batch-table-done.html';
	var upload = 'batch-table-upload.html';

	if(status=='creating'){
		//进入第二步
		var str = edit + '?id='+tableID+'&template_id='+template_id;
		return str
	}else if(status=='editing'){
		//进入第三步
		var str = upload + '?id='+tableID;
		return str
	}else if(status=='uploading'){
		//进入第四步
		var str = donePage+'?id='+tableID+'&template_id='+template_id;
		return str
	}else if(status=='finished'){
		//进入第四步,由于是完成状态，添加一个参数，标记为访问
		var str = donePage+'?id='+tableID+'&template_id='+template_id+'&visit=yes';
		return str
	}else{
		var str = 'javascript:'
		return str
	}
})

//序号过滤器
Vue.filter('ListNum',function(value){
    var str = value;
    var pageNow = oTableInfo.pageNow;
    if(pageNow==1){
    	str = str + 1;
    }else if(pageNow>1){
    	str = (pageNow-1)*num+str+1;
    }
    return str
})

//删除按钮
Vue.filter('deleteBtn',function(value){
    var value = value;
    str1 = ''; //隐藏
    str2 = 'yes'; //显示
    if(value=='enabled'||value=='finished'||value=='halt'){
        return str1
    }else {
        return str2
    }
})

//刷新函数
function windowFresh(){
    location.reload(true);
}

function getPageData (vm,pageNow,search,num,type_code) {
	var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
	$.ajax({
		type:'POST',
		url:serverUrl+'get/infoform',
		datatype:'json',
		data:{
			key:oKey,
    		user_id:token,
			next:pageNow,
			type_code:type_code,
			num:num,
			status_code:search.status_code,
			category_id:search.cateId,
			keyword:search.keyword
		},
		success:function(data){
			layer.close(LoadIndex); //关闭遮罩层
			if(data.status==100){
				vm.tableInfo = data.value;
				vm.count = data.count;
				vm.countPage = data.countPage;
				vm.pageNow = data.pageNow;
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
	        }
		},
		error:function(jqXHR){
			layer.close(LoadIndex); //关闭遮罩层
			layer.msg('向服务器请求失败');
		}
	})
}

$(document).ready(function(){
	//模糊搜索类目
	$('.searchField').on('keyup',function(){
	    var searchCusVal = $('.searchField').val();
	    if(searchCusVal){
	    	$.ajax({
	    	    type:'POST',
	    	    url:search,
	    	    datatype:'json',
	    	    data:{
	    	    	key:oKey,
            		user_id:token,
	    	        text:searchCusVal
	    	    },
	    	    success:function(data){
	    	        if(data.status==100){
	    	            oTableInfo.proList = data.value;
	    	        }else if(data.status==1012){
	                    layer.msg('请先登录',{time:2000});
	                    
	                    setTimeout(function(){
	                        jumpLogin(loginUrl,NowUrl);
	                    },2000);
	                }else if(data.status==1011){
	                    layer.msg('权限不足,请跟管理员联系');
	                }else{
	    	            oTableInfo.proList= '';
	    	        }
	    	    },
	    	    error:function(jqXHR){
	    	        layer.msg('向服务器请求客户信息失败');
	    	    }
	    	})
	    }
	});

	//打开关闭搜索
	$('.goSearch').on('click',function(){
	    $('.searchInput').show();
	    $('.modal-backdrop').show();
	    $('.searchField').focus();
	})
	$('.modal-backdrop').on('click',function(){
	    $('.searchInput').hide();
	    $('.modal-backdrop').hide();
	})
});