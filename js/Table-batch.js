//刷新函数
function windowFresh(){
    location.reload(true);
}

var type_code = 'batch';

var oTableInfo = new Vue({
	el:'body',
	data:{
		tableInfo:'',
		type_code:'',
		status_code:'',
		keyword:'',
		count:'',
		countPage:'',
		pageNow:'',
		prePage:'',
		nextPage:'',
		prePageBtn:'',
		nextPageBtn:'',
		jump:'',
		jumpBtn:'',
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
		    url: "http://192.168.1.40/PicSystem/canton/get/infoform", //添加请求地址的参数
		    dataType: "json",
		    data:{
		        category_id:'',
		        type_code:type_code,
		    },
		    success: function(data){
		    	layer.close(LoadIndex); //关闭遮罩层
		        if(data.status==100){
		        	oTableInfo.tableInfo = data.value;
		        	oTableInfo.count = data.count;
		        	oTableInfo.countPage = data.countPage;
		        	oTableInfo.pageNow = data.pageNow;
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
			var Id = item.id;

			layer.confirm('是否确认删除?', {
			  btn: ['确定','关闭'] //按钮
			},function(){
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.40/PicSystem/canton/index.php/del/infoform", //添加请求地址的参数
				    dataType: "json",
				    data:{
				        id:Id,
				        type_code:type_code
				    },
				    success: function(data){
				        if(data.status==100){
				        	oTableInfo.tableInfo.$remove(item);
				        	layer.msg('删除成功');
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
		//修改表格信息
		infoXG:function(item){
			var vm = oTableInfo;
			var item = item;
			vm.infoCache = $.extend(true, {}, item);//复制数据
			if(item.id){
				$('.infoXG').modal('show');
			}
		},
		//新建表格
		creatTable:function(){
			var w = window.open();
			$.ajax({
				type:'POST',
				url:'http://192.168.1.40/PicSystem/canton/get/formNumber',
				datatype:'json',
				data:{
					type_code:type_code
				},
				success:function(data){
					if(data.status==100){
						var id = data.value;
						var url = 'batch-table-creat.html?tableID='+id;
						if(id){
							w.location = url;
						}
					}else if(data.status==101){
						layer.msg('请求失败，请重试');
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
		//搜索
		searchTable:function(){
			var keyword = this.keyword.trim();
			var status_code = this.status_code;
			if(!keyword&&!status_code){
				layer.msg('必须输入关键词或者选择表格状态');
			}else{
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/search/form',
					datatype:'json',
					data:{
						type_code:type_code,
						status_code:status_code,
						keyword:keyword
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							oTableInfo.tableInfo = data.value;
							oTableInfo.count = data.count;
							oTableInfo.countPage = data.countPage;
							oTableInfo.pageNow = data.pageNow;
							oTableInfo.keyword = '';
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
			if(pageNow<=1){
				layer.msg('没有上一页啦');
			}else{
				pageNow--
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/get/infoform',
					datatype:'json',
					data:{
						next:pageNow,
						type_code:type_code
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							oTableInfo.tableInfo = data.value;
							oTableInfo.count = data.count;
							oTableInfo.countPage = data.countPage;
							oTableInfo.pageNow = data.pageNow;
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==102){
							layer.msg('参数错误');
						}
					},
					error:function(jqXHR){
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//下一页
		goNextPage:function(){
			var pageNow = this.pageNow;
			var countPage = this.countPage;
			if(pageNow==countPage){
				layer.msg('没有下一页啦');
			}else{
				pageNow++
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/get/infoform',
					datatype:'json',
					data:{
						next:pageNow,
						type_code:type_code
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							oTableInfo.tableInfo = data.value;
							oTableInfo.count = data.count;
							oTableInfo.countPage = data.countPage;
							oTableInfo.pageNow = data.pageNow;
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==102){
							layer.msg('参数错误');
						}
					},
					error:function(jqXHR){
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//页面跳转
		goJump:function(){
			var jump = this.jump;
			var countPage = this.countPage;
			if(jump>countPage){
				layer.msg('大于总页数啦');
				oTableInfo.jump = '';
			}else{
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/get/infoform',
					datatype:'json',
					data:{
						next:jump,
						type_code:type_code
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							oTableInfo.tableInfo = data.value;
							oTableInfo.count = data.count;
							oTableInfo.countPage = data.countPage;
							oTableInfo.pageNow = data.pageNow;
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==102){
							layer.msg('参数错误');
						}
					},
					error:function(jqXHR){
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//提交修改
		saveXG:function(){
		    var infoCache = this.infoCache;
		    if(infoCache.id){
		        $.ajax({
		        	type:'POST',
		        	url:'http://192.168.1.40/PicSystem/canton/update/infoform',
		        	datatype:'json',
		        	data:{
		        		type_code:type_code,
		        		id:infoCache.id,
		        		category_id:infoCache.category_id,
		        		template_id:infoCache.template_id,
		        		client_id:infoCache.client_id,
		        		site_name:infoCache.name,
		        		title:infoCache.title
		        	},
		        	success:function(data){
		        		if(data.status==100){
		        			layer.msg('保存成功');

		        			$('.infoXG').modal('hide');

		        			setInterval(windowFresh,1000);
		        		}else {
		        			layer.msg(data.msg);
		        		}
		        	},
		        	error:function(jqXHR){
		        		layer.msg('向服务器请求失败');
		        	}
		        })
		    }
		}
	}
})

//Vue过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing4info": str = "编辑产品资料";break;
        case "editing4picture": str = "编辑产品图片";break;
        case "finished": str = "有效";break;
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
	var selectPic = 'batch-table-selectPic.html';
	var donePage = 'batch-table-done.html';

	if(status=='creating'){
		//进入第二步
		var str = edit + '?id='+tableID+'&template_id='+template_id;
		return str
	}else if(status=='editing4info'){
		//进入第三步
		var str = selectPic + '?id='+tableID;
		return str
	}else if(status=='editing4picture'){
		//进入第五步
		var str = donePage+'?id='+tableID+'&template_id='+template_id;
		return str
	}else if(status=='finished'){
		//进入第五步,由于是完成状态，添加一个参数，标记为访问
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
    	str = (pageNow-1)*10+str+1;
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

//修改按钮
Vue.filter('xgBtn',function(value){
    var value = value;
    str1 = ''; //隐藏
    str2 = 'yes'; //显示
    if(value=='finished'||value=='halt'){
        return str1
    }else {
        return str2
    }
})
