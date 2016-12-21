//获取ID
function UrlSearch() {
    var name,value; 
    var str=location.href; 
    var num=str.indexOf("?");
    str=str.substr(num+1);
    
    var arr=str.split("&"); 
    for(var i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        } 
    } 
} 
var Request=new UrlSearch();

console.log(serverUrl); //后端接口地址


var TableCreat = new Vue({
	el:'body',
	data:{
		tableID:Request.tableID,
		TableCreat:'',
		proList:'',
		proSelected:'',
		proSelectedId:'',
		MBlist:'',
		MBkeyword:'',
		MBselected:'',
		MBselectedId:'',
		CusList:'',
		CusSelect:'',
		CusSelectId:'',
		tableName:'',
		creator_id:0,
		tableType:'', //主体变体
		product_count:'', //主体个数
		variant_num:'' //变体个数
	},
	methods:{
		//从搜索结果中选中一个类目
		selectCate:function(pro){
			var vm = this;
			vm.proSelected = pro.cn_name;
			vm.proSelectedId = pro.id;
			vm.proList = '';
			//清空值，隐藏框
			$('.searchCate').val('');
			$('.searchCompent').hide();
		},
		//打开选择模板框
		selectMB:function(){
			var vm = this;
			var category_id = vm.proSelectedId;
			if(!category_id){
				layer.msg('请先选择类目');
			}else{
				$('.selectMB').modal('show');
				$('.selectMB').css('margin-top','150px');
				//获取选中类目的模板数据
				$.ajax({
					type:'POST',
					url:serverUrl+'get/template10',
					datatype:'json',
					data:{
						key:oKey,
						user_id:token,
						type_code:'info',
						category_id:category_id
					},
					success:function(data){
						if(data.status==100){
							vm.MBlist = data.value;
							var MBlistLen = vm.MBlist.length;
							for(var i = 0;i<MBlistLen;i++){
								Vue.set(vm.MBlist[i],'checked',false);
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
						layer.msg('向服务器请求模板数据失败');
					}
				})
			}
		},
		//根据关键词搜索模板
		searchMB:function(){
			var vm = this;
			var MBkeyword = vm.MBkeyword;
			if(!MBkeyword){
				layer.msg('请先输入关键词');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'vague/templatename',
					datatype:'json',
					data:{
						key:oKey,
						user_id:token,
						type_code:'info',
						name:MBkeyword
					},
					success:function(data){
						if(data.status==100){
							vm.MBlist = data.value;
							var MBlistLen = vm.MBlist.length;
							for(var i = 0;i<MBlistLen;i++){
								Vue.set(vm.MBlist[i],'checked',false);
							}
							vm.MBkeyword = '';
						}else if(data.status==101){
							vm.MBkeyword = '';
							layer.msg('没有查找到数据');
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
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//确定选中一个模板
		selectedMB:function(){
			var vm = this;
			var MBlistLen = vm.MBlist.length;
			var MBarr = new Array ();

			for(var i = 0;i<MBlistLen;i++){
				if(vm.MBlist[i].checked){
					MBarr.push(vm.MBlist[i]);
				}
			}

			if(MBarr.length==0){
				layer.msg('请先选择一个模板');
			}else{
				vm.MBselected = MBarr[0].cn_name;
				vm.MBselectedId = MBarr[0].id;
				$('.selectMB').modal('hide');
				vm.MBkeyword = '';
			}
		},
		//从搜索结果中选中一个客户
		selectCus:function(cus){
			var vm = this;
			vm.CusSelect = cus.custom_name;
			vm.CusSelectId = cus.id;
			vm.CusList = '';
			//清除值,隐藏框
			$('.searchCus').val('');
			$('.searchCompent2').hide();
		},
		//保存表格信息
		saveTable:function(){
			var vm = this;//vue示例
			var tableID = vm.tableID,
				category_id = vm.proSelectedId,
				template_id = vm.MBselectedId,
				client_id = vm.CusSelectId,
				title = vm.tableName.trim(),
				product_count = vm.product_count,
				variant_num = vm.variant_num;

			if(!category_id){
				layer.msg('没有选择类目');
			}else if(!template_id){
				layer.msg('没有选择模板');
			}else if(!client_id){
				layer.msg('没有选择客户');
			}else if(!title){
				layer.msg('没有填写表格名');
			}else if(vm.tableType=='option2'){ //选择有变体时
				if(!product_count){
					layer.msg('产品数量不能为空');
				}else if(!variant_num){
					layer.msg('变体数量不能为空');
				}else{
					submitTable(vm);
				}
			}else if(vm.tableType=='option1'){ //选择常规时
				vm.variant_num = '';
				if(!product_count){
					layer.msg('产品数量不能为空');
				}else{
					submitTable(vm);
				}
			}
		},
		//取消编辑表格
		cancel:function(){
			layer.confirm('确定不保存数据取消编辑吗?',{
				btn:['确定','取消']
			},function(){
				var url = 'Table-info.html';
				window.location.href = url;
			});
		}
	}
}) 

//提交表格信息函数
function submitTable (vm) {
	var creator_id = cookie.get('id');
	$.ajax({
		type:'POST',
		url:serverUrl+'add/infoform',
		datatype:'json',
		data:{
			key:oKey,
			user_id:token,
			creator_id:creator_id,
			type_code:'info',
			form_no:vm.tableID,
			category_id:vm.proSelectedId,
			template_id:vm.MBselectedId,
			client_id:vm.CusSelectId,
			title:vm.tableName,
			product_count:vm.product_count,
			variant_num:vm.variant_num
			
		},
		success:function(data){
			if(data.status==100){
				var Id = data.id;
				layer.msg('提交保存成功');
				
				//跳转函数
				function goNext() {
				    var url = 'TableWorkflow-selectPic.html';
				    window.location.href = url+'?id='+Id;
				}

				setInterval(goNext,1000);
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
			layer.msg('向服务器请求保存表格失败');
		}
	})
}

//搜索客户框
$(function(){
    $('.searchBtn2').on('click',function(){
        $('.searchCompent2').show();
    })
    $('.closeBtn2').on('click',function(){
        $('.searchCompent2').hide();
    })
})

//搜索客户
$('.searchCus').on('keyup',function(){
	var getWidth = $('.pors .input-list').prev('.form-control').innerWidth();
	$('.pors .input-list').css('width',getWidth);
	var searchCusVal = $('.searchCus').val();
	$.ajax({
		type:'POST',
		url:serverUrl+'vague/custom',
		datatype:'json',
		data:{
			key:oKey,
			user_id:token,
			keyword:searchCusVal
		},
		success:function(data){
			if(data.status==100){
				TableCreat.CusList = data.value;
			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
				TableCreat.CusList= '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求客户信息失败');
		}
	})
});

//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
})

//搜索类目
$('.searchCate').on('keyup',function(){
	var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
	$('.pors .cate-list').css('width',getWidth);
	var searchCusVal = $('.searchCate').val();

	$.ajax({
		type:'POST',
		url:serverUrl+'index.php/vague/name',
		datatype:'json',
		data:{
			key:oKey,
			user_id:token,
			text:searchCusVal
		},
		success:function(data){
			if(data.status==100){
				TableCreat.proList = data.value;
			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
				TableCreat.proList= '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求客户信息失败');
		}
	})
});