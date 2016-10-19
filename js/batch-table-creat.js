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
var type_code = 'batch';
var tableID = Request.tableID;

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址

var tableCreat = new Vue({
	el:'body',
	data:{
		tableID:tableID,
		proList:'',
		proSelected:'',
		proSelectedId:'',
		selecteTableBtn:'',
		tableList:'',
		tableSelected:'',
		selectMBBtn:'',
		MBList:'',
		MBselected:'',
		sites:[
			'UK',
			'USA',
			'France',
			'Italy',
			'Spain',
			'Germany'
		],
		siteSelect:'',
		tableName:''
	},
	computed:{
		// 选择产品资料表按钮
		selecteTableBtn:function(){
			if(this.proSelectedId){
				return false
			}else{
				return true
			}
		},
		//选择批量表模板按钮
		selectMBBtn:function(){
			if(this.tableSelected.id){
				return false
			}else{
				return true
			}
		}
	},
	methods:{
		//从搜索结果中选中一个类目
		selectCate:function(pro){
			var vm = tableCreat;
			vm.proSelected = pro.cn_name;
			vm.proSelectedId = pro.id;
			vm.proList = '';
			vm.tableSelected = '';
			vm.MBselected = '';
			//把搜索框清空
			$('.searchCate').val('');
			$('.searchCompent').hide();
		},
		// 选择产品资料表
		selectTable:function(){
			var vm = tableCreat;

			if(!vm.proSelectedId){
				layer.msg('请先选择产品类目');
			}else{
				$('.selectTable').modal('show');

				$.ajax({
					type:'POST',
					url:serverUrl+'get/infoform',
					datatype:'json',
					data:{
						type_code:'info',
						status_code:'enabled',
						category_id:vm.proSelectedId
					},
					success:function(data){
						if(data.status==100){
							vm.tableList = data.value;

							var Len = vm.tableList.length;
							for(var i = 0;i<Len;i++){
								Vue.set(vm.tableList[i],'checked',false);
							}

						}else{
							vm.tableList = '';
						}
					},
					error:function(jqXHR){
						layer.msg('向服务器请求产品资料表失败');
					}
				})
			}
		},
		//确定选中一个资料表
		confirmTable:function(){
			var vm = tableCreat;
			var Len = vm.tableList.length;
			var tableArr = new Array ();

			for(var i = 0;i<Len;i++){
				if(vm.tableList[i].checked){
					tableArr.push(vm.tableList[i]);
				}
			}

			if(tableArr.length==0){
				layer.msg('请先选择一个资料表');
			}else{
				vm.tableSelected = tableArr[0];
				vm.MBselected = '';
				$('.selectTable').modal('hide');
			}
		},
		//选择批量表模板
		selectMB:function(){
			var vm = tableCreat;

			if(!vm.proSelectedId){
				layer.msg('请先选择资料表模板');
			}else{
				$('.selectMB').modal('show');

				$.ajax({
					type:'POST',
					url:serverUrl+'search/batchTel',
					datatype:'json',
					data:{
						form_id:vm.tableSelected.id
					},
					success:function(data){
						if(data.status==100){
							vm.MBList = data.value;

							var Len = vm.MBList.length;
							for(var i = 0;i<Len;i++){
								Vue.set(vm.MBList[i],'checked',false);
							}

						}else{
							vm.MBList = '';
						}
					},
					error:function(jqXHR){
						layer.msg('向服务器请求批量表模板失败');
					}
				})
			}
		},
		//确定选中一个批量表模板
		confirmMB:function(){
			var vm = tableCreat;
			var Len = vm.MBList.length;
			var MBarr = new Array ();

			for(var i = 0;i<Len;i++){
				if(vm.MBList[i].checked){
					MBarr.push(vm.MBList[i]);
				}
			}

			if(MBarr.length==0){
				layer.msg('请先选择一个批量模板');
			}else{
				vm.MBselected = MBarr[0];
				$('.selectMB').modal('hide');
			}
		},
		//提交批量表信息
		saveTable:function(){
			var vm = tableCreat;
			if(!vm.tableID){
				layer.msg('没有检测到表格编码');
			}else if(!vm.proSelectedId){
				layer.msg('请先选择类目');
			}else if(!vm.tableSelected.id){
				layer.msg('没有选择资料表');
			}else if(!vm.MBselected.id){
				layer.msg('没有选择批量表模板');
			}else if(!vm.siteSelect){
				layer.msg('没有选择站点');
			}else if(!vm.tableName.trim()){
				layer.msg('表格名称不能为空');
			}else{
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:serverUrl+'add/infoform',
					datatype:'json',
					data:{
						type_code:type_code, 
						category_id:vm.proSelectedId,//类目ID
						template_id:vm.MBselected.id,//模板ID
						form_no:vm.tableID,//表格编号
						client_id:vm.tableSelected.client_id,//客户ID
						product_form_id:vm.tableSelected.id,//资料表ID
						site_name:vm.siteSelect,//站点信息
						title:vm.tableName//表格名称
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){

							layer.msg('保存成功');
							var Id = data.id;
							var template_id = vm.MBselected.id;

							//跳转函数
							function goNext() {
							    var url = 'batch-table-edit.html';
							    window.location.href = url+'?id='+Id+'&template_id='+template_id;
							}

							setInterval(goNext,1000);

						}else{
							layer.msg(data.msg);
						}
					},
					error:function(jqXHR){
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//取消编辑表格
		cancel:function(){
			layer.confirm('确定不保存数据取消编辑吗?',{
				btn:['确定','取消']
			},function(){
				var url = 'Table-batch.html';
				window.location.href = url;
			});
		}
	}
})

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
		url:serverUrl+'vague/name',
		datatype:'json',
		data:{
			text:searchCusVal
		},
		success:function(data){
			var vm = tableCreat;

			if(data.status==100){
				vm.proList = data.value;
			}else{
				vm.proList= '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求产品类目失败');
		}
	})
});