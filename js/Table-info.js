//刷新函数
function windowFresh(){
    location.reload(true);
}

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
		jumpBtn:''
	},
	ready:function(){
		var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层 
		$.ajax({
		    type: "POST",
		    url: "http://192.168.1.40/PicSystem/canton/get/infoform", //添加请求地址的参数
		    dataType: "json",
		    timeout:5000,
		    data:{
		        category_id:'',
		        type_code:'info',
		    },
		    success: function(data){
		    	layer.close(LoadIndex); //关闭遮罩层
		        if(data.status==100){
		        	oTableInfo.tableInfo = data.value;
		        	oTableInfo.count = data.count;
		        	oTableInfo.countPage = data.countPage;
		        	oTableInfo.pageNow = data.pageNow;
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
			var type_code = item.type_code;

			layer.confirm('是否确认删除?', {
			  btn: ['确定','关闭'] //按钮
			},function(){
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.40/PicSystem/canton/index.php/del/infoform", //添加请求地址的参数
				    dataType: "json",
				    timeout:5000,
				    data:{
				        id:Id,
				        type_code:type_code
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
		//修改
		modified:function(item){
			var item = item;
			//定义弹出层里面的HTML内容
			$str = '';
			$str+='<div class="form">';
			$str+=    '<div class="form-group">';
			$str+=        '<label>表格名</label>';
			$str+=        '<input type="text" value="'+item.title+'" class="form-control form-control0">';
			$str+=    '</div>';
			$str+=    '<div class="form-group cate">';
			$str+=        '<label>类目</label>';
			$str+=        '<input type="text" value="'+item.name+'" class="form-control form-control1">';
			$str+=        '<ul></ul>';
			$str+=    '</div>';
			$str+=    '<div class="form-group">';
			$str+=        '<label>模板</label>';
			$str+=        '<select class="form-control form-control2">';
			$str+=		       '<option value="'+item.template_id+'"></option>';
			$str+=        '</select>';
			$str+=    '</div>';
			// $str+=    '<div class="form-group">';
			// $str+=        '<label>客户</label>';
			// $str+=        '<input type="text" value="'+item.client_name+'" class="form-control form-control3">';
			// $str+=    '</div>';
			$str+=    '<div class="form-group">';
            $str+=        '<button class="btn btn-success">提交</button>';
            $str+=	  '</div>'; 
			$str+='</div>';
			//打开修改的弹层
			if(item.status_code=='enabled'||item.status_code=='disabled'){
				layer.msg('当前状态无法修改');
			}else{
				layer.open({  //这里也要获取弹出层的index，后面关闭会使用
				    type: 1,
				    title:'修改表格信息',
				    skin: 'modified col-md-4', //样式类名
				    closeBtn: 1,  //关闭按钮
				    shift: 0,
				    shadeClose: true, //开启遮罩关闭
				    content: $str
				});
			}
			$('.modified .layui-layer-content .form-control1').eq(0).attr('name',item.category_id);
			$('.modified .layui-layer-content .form-control2 option').eq(0).text(item.tempname);
			//模糊搜索获取类目
			$(document).on('keyup','.modified .layui-layer-content .form-control1',function(){
				var oText = $('.modified .layui-layer-content .form-control1').val();
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/vague/name',
					datatype:'json',
					data:{
						text:oText
					},
					success:function(data){
						if(data.status==100){
							var $cateList = data.value;
							$('.modified .cate ul li').remove();
							for($i=0;$i<$cateList.length;$i++){
							    $str = '<li name="'+$cateList[$i].id+'">'+$cateList[$i].cn_name+$cateList[$i].en_name+'</li>';
							    $('.modified .cate ul').append($str);
							} 
						}
					},
					error:function(jqXHR){
						layer.msg('请求服务器失败');
					}
				})
			});
			//选中类目
			$(document).on('click','.modified .cate ul li',function(){
			     var oCateID = $(this).attr('name');
			    $('.modified .layui-layer-content .form-control1').attr('name',oCateID);
			    $('.modified .layui-layer-content .form-control1').val($(this).text());
			    $('.modified .cate ul li').remove();
			    //获取该类目下的所有模板
			    $.ajax({
			    	type:'POST',
			    	url:'http://192.168.1.40/PicSystem/canton/get/linkage',
			    	datatype:'json',
			    	data:{
			    		type_code:item.type_code,
			    		category_id:oCateID
			    	},
			    	success:function(data){
			    		if(data.status==100){
			    			//获取模板后更新dom
			    			var oTemp = data.value;
			    			$('.modified .layui-layer-content .form-control2 option').remove();
			    			for($r=0;$r<oTemp.length;$r++){
			    			    $str = '<option value="'+oTemp[$r].id+'">'+oTemp[$r].cn_name+'</option>';
			    			    $('.modified .layui-layer-content .form-control2').append($str);
			    			}
			    		}
			    	},
			    	error:function(jqXHR){
			    		layer.msg('请求模板信息失败');
			    	}
			    })
			});
			//提交修改
			$(document).on('click','.modified .layui-layer-content .btn',function(){
				var oTitle = $('.modified .layui-layer-content .form-control0').val();
				var oTempID = $('.modified .layui-layer-content .form-control2').val();
				var oCateID = $('.modified .layui-layer-content .form-control1').attr('name');
				if(!oTitle||!oTempID){
					layer.msg('请输入完整的数据');
				}else{
					$.ajax({
						type:'POST',
						url:'http://192.168.1.40/PicSystem/canton/update/infoform',
						datatype:'json',
						data:{
							type_code:item.type_code,
							id:item.id,
							category_id:oCateID,
							template_id:oTempID,
							client_id:item.client_id,
							title:oTitle
						},
						success:function(data){
							if(data.status==100){
								layer.msg('修改成功');

								setInterval(windowFresh,1000);

							}else if(data.status==101){
								layer.msg('操作失败');
							}else if(data.status==103){
								layer.msg('类目错误');
							}else if(data.status==104){
								layer.msg('模板错误');
							}else if(data.status==105){
								layer.msg('表格名称为空');
							}else if(data.status==108){
								layer.msg('当前状态无法修改');
							}
						},
						error:function(jqXHR){
							layer.msg('提交修改，向服务器请求失败');
						}
					})
				}
				
			});
		},
		//新建表格
		creatTable:function(){
			var w = window.open();
			$.ajax({
				type:'POST',
				url:'http://192.168.1.40/PicSystem/canton/get/formNumber',
				datatype:'json',
				data:{
					app_code:'product_form'
				},
				success:function(data){
					if(data.status==100){
						var id = data.value;
						var url = 'TableWorkflow-creat.html?tableID='+id;
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
		//搜索
		searchTable:function(){
			var type_code = this.type_code;
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
			var type_code = this.tableInfo[0].type_code;
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
			var type_code = this.tableInfo[0].type_code;
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
			var type_code = this.tableInfo[0].type_code;
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
		}
	}
})

//Vue过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing": str = "编辑";break;
        case "editing4info": str = "编辑-筛选图片";break;
        case "editing4picture": str = "编辑-上传图片";break;
        case "enabled": str = "有效";break;
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
	var edit = 'TableWorkflow-edit.html';
	var selectPic = 'TableWorkflow-selectPic.html';
	var donePage = 'TableWorkflow-done.html';
	if(status=='creating'){
		//进入第二步
		var str = edit + '?form_no='+form_no+'&id='+tableID+'&template_id='+template_id+'&type_code='+type_code;
		return str
	}else if(status=='editing4info'){
		//进入第三步
		var str = selectPic + '?tableID='+tableID;
		return str
	}else if(status=='enabled'||'finished'){
		//进入第五步
		var str = donePage+'?tableID='+tableID+'&template_id='+template_id+'&type_code='+type_code;
		return str
	}else{
		var str = 'javascript:'
		return str
	}
})

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