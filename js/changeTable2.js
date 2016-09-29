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

var serverUrl = "http://192.168.1.40/PicSystem/canton/"; //后端接口地址

var TableCreat = new Vue({
	el:'body',
	data:{
		tableID:Request.tableID,
		tableInfo:'',
		CusList:'',
		CusSelect:'',
		CusSelectId:'',
		tableName:''
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/oneform',
			datatype:'json',
			data:{
				type_code:'info',
				id:Request.tableID
			},
			success:function(data){
				if(data.status==100){
					TableCreat.tableInfo = data.value[0];
				}else if(data.status==101){
					layer.msg('操作失败，该表格不存在');
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器请求表格信息失败');
			}
		})
	},
	methods:{
		//从搜索结果中选中一个客户
		selectCus:function(cus){
			TableCreat.CusSelect = cus.custom_name;
			TableCreat.CusSelectId = cus.id;
			TableCreat.CusList = '';
		},
		//保存表格信息
		saveTable:function(){
			var client_id = TableCreat.CusSelectId;
			var tableInfo = this.tableInfo;
			var title = this.tableName;
			if(!client_id){
				layer.msg('没有选择客户');
			}else if(!title){
				layer.msg('没有填写表格名');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'update/infoform',
					datatype:'json',
					data:{
						type_code:'info',
						id:tableInfo.id,
						category_id:tableInfo.category_id,
						template_id:tableInfo.template_id,
						creator_id:tableInfo.creator_id,
						//修改的部分
						client_id:client_id,
						title:title
					},
					success:function(data){
						if(data.status==100){
							layer.msg('保存成功');
							function back() {
								var url = 'Table-info.html';
								window.location.href = url;
							}
							setInterval(back,1000);
						}else{
							layer.msg(data.msg);
						}
					},
					error:function(jqXHR){
						layer.msg('向服务器请求保存表格失败');
					}
				})
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
			keyword:searchCusVal
		},
		success:function(data){
			if(data.status==100){
				TableCreat.CusList = data.value;
			}else{
				TableCreat.CusList= '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求客户信息失败');
		}
	})
});


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


//观察搜索框的变化，控制是否有客户
TableCreat.$watch('CusSelect', function (val) {
    if(!val){
       TableCreat.CusSelectId = '';
    }
})
