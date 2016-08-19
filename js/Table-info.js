//刷新函数
function windowFresh(){
    location.reload(true);
}

var oTableInfo = new Vue({
	el:'body',
	data:{
		tableInfo:''
	},
	ready:function(){
		$.ajax({
		    type: "POST",
		    url: "http://192.168.1.42/canton/index.php/get/infoform", //添加请求地址的参数
		    dataType: "json",
		    timeout:5000,
		    data:{
		        category_id:'',
		        type_code:'info',
		    },
		    success: function(data){
		        if(data.status==100){
		        	oTableInfo.tableInfo = data.value;
		        }
		    },
		    error: function(jqXHR){     
		        layer.msg('向服务器获取信息失败');
		    }
		})
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
				    url: "http://192.168.1.42/canton/index.php/del/infoform", //添加请求地址的参数
				    dataType: "json",
				    timeout:5000,
				    data:{
				        id:Id,
				        type_code:type_code,
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
		//启用
		start:function(item){
			var Id = item.id;
			var type_code = item.type_code;

			layer.confirm('一经启用，不可以编辑和删除，是否启用?', {
			  btn: ['确定','关闭'] //按钮
			},function(){
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.42/canton/index.php/use/infoform", //添加请求地址的参数
				    dataType: "json",
				    timeout:5000,
				    data:{
				        id:Id,
				        type_code:type_code,
				    },
				    success: function(data){
				        if(data.status==100){
				        	item.status_code = 'enabled';
				        	layer.msg('启用成功');
				        }else if(data.status==101){
				        	layer.msg('操作失败');
				        }else if(data.status==102){
				        	layer.msg('id为空');
				        }else if(data.status==109){
				        	layer.msg('已经启用了，不需要再次启用');
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
			$str+=    '<div class="form-group">';
			$str+=        '<label>客户</label>';
			$str+=        '<input type="text" value="'+item.client_name+'" class="form-control form-control3">';
			$str+=    '</div>';
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
					url:'http://192.168.1.42/canton/index.php/vague/name',
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
			    	url:'http://192.168.1.42/canton/index.php/get/linkage',
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
						url:'http://192.168.1.42/canton/index.php/update/infoform',
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
			$.ajax({
				type:'POST',
				url:'http://192.168.1.42/canton/index.php/get/sysId',
				datatype:'json',
				data:{
					app_code:'product_form'
				},
				success:function(data){
					if(data.status==100){
						var id = data.value[0];
						var url = 'TableWorkflow-creat.html';
						if(id){
							window.open(url+'?tableID='+id);
						}
					}else if(data.status==101){
						layer.msg('请求失败，请重试');
					}
				},
				error:function(jqXHR){
					layer.msg('向服务器请求创建表格失败');
				}
			})
		}
	}
})

//Vue过滤器
Vue.filter('statusCode', function (value) {
    var str;
    switch(value){
        case "creating": str = "创建";break;
        case "editing": str = "编辑";break;
        case "enabled": str = "有效";break;
        case "disabled": str = "完成";break;
    }
    return str;
})


//筛选功能
var oInputWidth = $('.pro .form-control').innerWidth();
$('.pro ul').css('width',oInputWidth);

///////////////////根据类目搜索///////////////////////
$('.pro .search-cate').on('keyup',function(){
	var searchCate = $('.pro .search-cate').val();
	$.ajax({
		type:'POST',
		url:'http://192.168.1.42/canton/index.php/vague/name',
		datatype:'json',
		data:{
			text:searchCate
		},
		success:function(data){
			if(data.status==100){
				var searchCate = data.value;
				$('.pro .search-cate').next('ul').find('li').remove();
				for($i=0;$i<searchCate.length;$i++){
				    $str = '<li name="'+searchCate[$i].id+'">'+searchCate[$i].cn_name+searchCate[$i].en_name+'</li>';
				    $('.pro .search-cate').next('ul').append($str);
				}
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器获取请求失败');
		}
	})
});

$(document).on('click','.proCate ul li',function(){
	var liName = $(this).attr('name');
    $oCateInput = $('.pro .search-cate');
    $oCateInput.val($(this).text());
    $oCateInput.attr('name',liName);
    $('.proCate ul li').remove();
});

//发起搜索请求,并更新数据
$('.search-cate-btn').on('click',function(){
	var oCateID = $('.search-cate').attr('name');
	var searchCate = $('.pro .search-cate').val();
	if(!oCateID||!searchCate){
		layer.msg('请先输入数据');
		$('.search-cate').attr('name','');
		$('.pro .search-cate').val('');
	}else{
		$.ajax({
			type:'POST',
			url:'http://192.168.1.42/canton/index.php/get/infoform',
			datatype:'json',
			data:{
				type_code:oTableInfo.tableInfo[0].type_code,
				category_id:oCateID
			},
			success:function(data){
				if(data.status==100){
					layer.msg('获取成功');
					oTableInfo.tableInfo = data.value;
					$('.search-cate').val('');
				}else if(data.status==101){
					layer.msg('没有查询到数据');
					$('.search-cate').val('');
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器获取请求失败,搜索失败');
			}
		})
	}
});

///////////////////根据模板搜索///////////////////////
$('.pro .search-temp').on('keyup',function(){
	var searchTemp = $('.pro .search-temp').val();
	$.ajax({
		type:'POST',
		url:'http://192.168.1.42/canton/index.php/vague/templatename',
		datatype:'json',
		data:{
			name:searchTemp,
			type_code:oTableInfo.tableInfo[0].type_code
		},
		success:function(data){
			if(data.status==100){
				var searchCate = data.value;
				$('.pro .search-temp').next('ul').find('li').remove();
				for($i=0;$i<searchCate.length;$i++){
				    $str = '<li name="'+searchCate[$i].id+'">'+searchCate[$i].cn_name+searchCate[$i].en_name+'</li>';
				    $('.pro .search-temp').next('ul').append($str);
				}
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器获取请求失败');
		}
	})
});

$(document).on('click','.proTemp ul li',function(){
	var liName = $(this).attr('name');
    $oCateInput = $('.pro .search-temp');
    $oCateInput.val($(this).text());
    $oCateInput.attr('name',liName);
    $('.proTemp ul li').remove();
});

//发起搜索请求,并更新数据
$('.search-temp-btn').on('click',function(){
	var oCateID = $('.search-temp').attr('name');
	var searchTemp = $('.pro .search-temp').val();
	if(!oCateID||!searchTemp){
		layer.msg('请先输入数据');
		$('.search-temp').attr('name','');
		$('.pro .search-temp').val('');
	}else{
		$.ajax({
			type:'POST',
			url:'http://192.168.1.42/canton/index.php/get/tempinfoform',
			datatype:'json',
			data:{
				type_code:oTableInfo.tableInfo[0].type_code,
				template_id:oCateID
			},
			success:function(data){
				if(data.status==100){
					layer.msg('获取成功');
					oTableInfo.tableInfo = data.value;
					$('.search-temp').val('');
				}else if(data.status==101){
					layer.msg('没有查询到数据');
					$('.pro .search-temp').val('');
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器获取请求失败,搜索失败');
			}
		})
	}
});

/////////////////////根据表格名称搜索//////////////////////////////
$('.search-name-btn').on('click',function(){
	var searchName = $('.pro .search-name').val();
	if(!searchName){
		layer.msg('请先输入数据');
		$('.pro .search-name').val('');
	}else{
		$.ajax({
			type:'POST',
			url:'http://192.168.1.42/canton/index.php/vague/formtitle',
			datatype:'json',
			data:{
				type_code:oTableInfo.tableInfo[0].type_code,
				title:searchName
			},
			success:function(data){
				if(data.status==100){
					layer.msg('获取成功');
					oTableInfo.tableInfo = data.value;
					$('.search-name').val('');
				}else if(data.status==101){
					layer.msg('没有查询到数据');
					$('.pro .search-name').val('');
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器获取请求失败,搜索失败');
			}
		})
	}
});