//刷新函数
function windowFresh(){
    location.reload(true);
}
//缓存修改的数据
var Ccustom_name;
var Cen_name;
var Ccompany;
var Cmobile;
var Cemail;
var Caddress;

var customer = new Vue({
	el:'body',
	data:{
		cus_count:'',
		pageNow:'',
		countPage:'',
		cusData:'',
		deleteAll:true,
		addNew:{
			custom_name:'',
			en_name:'',
			company:'',
			mobile:'',
			email:'',
			address:''
		},
		editOne:{
			id: "",
			custom_name: "",
			en_name: "",
			company: "",
			mobile: "",
			email: "",
			address: ""
		}
	},
	ready:function(){
		//获取所有客户信息
		$.ajax({
			type:'POST',
			url:'http://192.168.1.40/PicSystem/canton/get/custom',
			datatype:'json',
			success:function(data){
				if(data.status==100){
					customer.cus_count= data.cus_count;
					customer.pageNow= data.pageNow;
					customer.countPage= data.countPage;
					customer.cusData= data.value;
					var cusLen = customer.cusData.length;
					for(var i = 0;i<cusLen;i++){
						Vue.set(customer.cusData[i],'checked',false);
					}
				}else if(data.status==101){
					layer.msg('获取失败，客户信息为空');
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器请求客户信息失败');
			}
		})
	},
	methods:{
		//删除选中按钮
		removeSelect:function(){
			var cusData = this.cusData;
			var cusLen = cusData.length;
			var checkedArr = new Array();
			for(var i = 0;i<cusLen;i++){
				if(cusData[i].checked){
					checkedArr.push(cusData[i].id);
				}
			}

			layer.confirm('确定删除选中?',{
				btn:['确定','取消']
			},function(){
				if(checkedArr.length<=0){
					layer.msg('没有选中任何客户');
				}else{
					$.ajax({
						type:'POST',
						url:'http://192.168.1.40/PicSystem/canton/delete/custom',
						datatype:'json',
						data:{
							id:checkedArr
						},
						success:function(data){
							if(data.status==100){
								layer.msg('删除成功');
								setInterval(windowFresh,1000);
							}else if(data.status==101){
								layer.msg('操作失败');
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
			var table = table;
			var id = table.id;
			layer.confirm('确定删除该客户?',{
				btn:['确定','取消']
			},function(){
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/delete/custom',
					datatype:'json',
					data:{
						id:id
					},
					success:function(data){
						if(data.status==100){
							layer.msg('删除成功');
							customer.cusData.$remove(table);
						}else if(data.status==101){
							layer.msg('操作失败');
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
			var tel = /^1[34578]{1}[0-9]{9}$/;
			var EN = /^[A-z\s]+$/;
			var Email = /^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i;

			if(!addNew.custom_name){
				layer.msg('客户名称为空');
			}else if(!addNew.en_name||!EN.test(addNew.en_name)){
				layer.msg('英文名不能为空,英文只能是大小写字母和空格');
			}else if(!addNew.mobile||!tel.test(addNew.mobile)){
				layer.msg('电话不能为空，手机号格式要填写正确');
			}else if(!addNew.email){
				layer.msg('邮箱不能为空，邮箱格式要填写正确');
			}else{
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/post/custom',
					datatype:'json',
					data:{
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
			$('.editTable').modal('show');
			$('.editTable').css('margin-top','200px');
			this.editOne = table;
			//缓存修改的数据
			Ccustom_name = table.custom_name;
			Cen_name = table.en_name;
			Ccompany = table.company;
			Cmobile = table.mobile;
			Cemail = table.email;
			Caddress = table.address;
		},
		//提交编辑
		subEdit:function(){
			var addNew = this.editOne;
			var tel = /^1[34578]{1}[0-9]{9}$/;
			var EN = /^[A-z\s]+$/;
			var Email = /^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i;

			if(!addNew.custom_name){
				layer.msg('客户名称为空');
			}else if(!addNew.en_name||!EN.test(addNew.en_name)){
				layer.msg('英文名不能为空,英文只能是大小写字母和空格');
			}else if(!addNew.mobile||!tel.test(addNew.mobile)){
				layer.msg('电话不能为空，手机号格式要填写正确');
			}else if(!addNew.email){
				layer.msg('邮箱不能为空，邮箱格式要填写正确');
			}else{
				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/PicSystem/canton/update/custom',
					datatype:'json',
					data:{
						data:addNew
					},
					success:function(data){
						if(data.status==100){
							layer.msg('修改成功');
							$('.editTable').modal('hide');
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==102){
							layer.msg('参数错误');
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
			$('.editTable').modal('hide');
			Vue.set(customer.editOne,'custom_name',Ccustom_name);
			Vue.set(customer.editOne,'en_name',Cen_name);
			Vue.set(customer.editOne,'company',Ccompany);
			Vue.set(customer.editOne,'mobile',Cmobile);
			Vue.set(customer.editOne,'email',Cemail);
			Vue.set(customer.editOne,'address',Caddress);
		}
	}
})

//检测表格数据的选中状态，控制批量删除按钮
customer.$watch('cusData', function (data) {
	var cusLen = data.length;
	var checkedArr = new Array();
	for(var i = 0;i<cusLen;i++){
		if(data[i].checked){
			checkedArr.push(data[i].id);
		}
	}

	if(checkedArr.length<=0){
		customer.deleteAll = true;
	}else{
		customer.deleteAll = false;
	}
},{
	deep:true
})