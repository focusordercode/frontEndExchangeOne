// Creat by msh at 2016.10.14


var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址
var search = "http://192.168.1.42/canton/index.php/vague/name"; //模糊搜索地址
var num = 25;//每页展示个数

//状态过滤器
Vue.filter('statusFlilter',function(value){
    var str;
    switch(value){
        case 1: str = "启用";break;
        case 2: str = "停用";break;
    }
    return str;
})

//序号过滤器
Vue.filter('ListNum',function(value){
    var str = value;
    var pageNow = oPCenter.pageNow;
    if(pageNow==1){
    	str = str + 1;
    }else if(pageNow>1){
    	str = (pageNow-1)*num+str+1;
    }
    return str
})

var oPCenter = new Vue({
    el:'body',
    data:{
    	search:{
    		cateId:'',
    		status:'',
    		statusList:[
    			1,
    			2
    		],
    		cate_name:'',
    		keyword:''
    	},
    	list:'',
    	pageNow:'',
    	countPage:'',
    	count:'',
    	jump:'',
    	// 搜索类目
    	proList:'',
    	//交互数据
    	searchResult:'' //搜索结果
    },
    ready:function () {
    	var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    	$.ajax({
    	    type:'POST',
    	    url:serverUrl+'get/allcenteritem',
    	    datatype:'json',
    	    data:{
    	    	num:num
    	    },
    	    success:function(data){
    	    	layer.close(LoadIndex); //关闭遮罩层
    	        if(data.status==100){
    	            oPCenter.list = data.value;
    	            oPCenter.pageNow = data.nowpages;
    	            oPCenter.countPage = data.pages;
    	            oPCenter.count = data.count;
    	        }else{
    	            layer.msg(data.msg);
    	        }
    	    },
    	    error:function(jqXHR){
    	    	layer.close(LoadIndex); //关闭遮罩层
    	        layer.msg('向服务器请求失败');
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
    	},
    	//搜索按钮
    	searchBtn:function () {
    		if (!this.search.cateId&&!this.search.status&&!this.search.keyword){
    			return true
    		}else{
    			return false
    		}
    	}
    },
    methods:{
    	//删除项目
    	deleteItem:function (item) {
    		var item = item,
    			vm = oPCenter;
    		layer.confirm('确定删除项目?项目的内容和关联已将一并删除',{
    			btn:['确定','取消']
    		},function(index){
    			layer.close(index);
    			if (item) {
    				$.ajax({
    					type:'POST',
    					url:serverUrl+'delete/centeritem',
    					datatype:'json',
    					data:{
    						id:item.id
    					},
    					success:function (data) {
    						if(data.status==100){
    							layer.msg('删除成功');
    							vm.list.$remove(item);
    						}else{
    							layer.msg(data.msg);
    						}
    					},
    					error:function (jqXHR) {
    						layer.msg('向服务器请求失败');
    					}
    				})
    			}
    		})
    	},
    	//从搜索结果中选中一个类目
    	selectCate:function(pro){
    	    oPCenter.search.cate_name = pro.cn_name;
    	    oPCenter.search.cateId = pro.id;
    	    oPCenter.proList = '';
    	    //清除值，隐藏框
    	    $('.searchField').val('');
    	    $('.searchInput').hide();
    	    $('.modal-backdrop').hide();
    	},
    	// 取消选中类目
    	cancelCate:function () {
    		this.search.cate_name = '';
    		this.search.cateId = '';
    	},
    	//条件搜索
    	searchItem:function () {
    		var vm = oPCenter,
    		category_id = vm.search.cateId,
    		enabled = vm.search.status,
    		vague = vm.search.keyword;
    		if (!category_id&&!enabled&&!vague.trim()) {
    			layer.msg('类目，状态和关键词三个条件至少选其一');
    		}else{
    			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    			$.ajax({
    				type:'POST',
    				url:serverUrl+'get/allcenteritem',
    				datatype:'json',
    				data:{
    					category_id:category_id,
    					enabled:enabled,
    					vague:vague,
    					num:num
    				},
    				success:function(data){
    					layer.close(LoadIndex); //关闭遮罩层
    					if(data.status==100){
    						vm.list = data.value;
    						vm.pageNow = data.nowpages;
    						vm.countPage = data.pages;
    						vm.count = data.count;
    						//搜索条件数据
    						vm.searchResult = vm.search;
    					}else if(data.status==101){
    						layer.msg('没有搜索到数据');
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
    	//刷新
    	Reflesh:function(){
    		location.reload(true);
    	},
    	//上一页
    	goPrePage:function(){
    		var pageNow = this.pageNow;
    		var vm = oPCenter,
    			search = this.search;
    		if(pageNow<=1){
    			layer.msg('没有上一页啦');
    		}else{
    			pageNow--
    			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    			$.ajax({
    				type:'POST',
    				url:serverUrl+'get/allcenteritem',
    				datatype:'json',
    				data:{
    					pages:pageNow,
    					num:num,
    					category_id:search.cateId,
    					enabled:search.status,
    					vague:search.keyword
    				},
    				success:function(data){
    					layer.close(LoadIndex); //关闭遮罩层
    					if(data.status==100){
    						vm.list = data.value;
    						vm.pageNow = data.nowpages;
    						vm.countPage = data.pages;
    						vm.count = data.count;
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
    		var vm = oPCenter,
    			search = this.search;
    		if(pageNow==countPage){
    			layer.msg('没有下一页啦');
    		}else{
    			pageNow++
    			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    			$.ajax({
    				type:'POST',
    				url:serverUrl+'get/allcenteritem',
    				datatype:'json',
    				data:{
    					pages:pageNow,
    					num:num,
    					category_id:search.cateId,
    					enabled:search.status,
    					vague:search.keyword
    				},
    				success:function(data){
    					layer.close(LoadIndex); //关闭遮罩层
    					if(data.status==100){
    						vm.list = data.value;
    						vm.pageNow = data.nowpages;
    						vm.countPage = data.pages;
    						vm.count = data.count;
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
    		var vm = oPCenter,
    			search = this.search;
    		if(jump>countPage){
    			layer.msg('大于总页数啦');
    			oPCenter.jump = '';
    		}else{
    			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    			$.ajax({
    				type:'POST',
    				url:serverUrl+'get/allcenteritem',
    				datatype:'json',
    				data:{
    					pages:jump,
    					num:num,
    					category_id:search.cateId,
    					enabled:search.status,
    					vague:search.keyword
    				},
    				success:function(data){
    					layer.close(LoadIndex); //关闭遮罩层
    					if(data.status==100){
    						vm.list = data.value;
    						vm.pageNow = data.nowpages;
    						vm.countPage = data.pages;
    						vm.count = data.count;
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

//刷新函数
function windowFresh(){
    location.reload(true);
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
	    	        text:searchCusVal
	    	    },
	    	    success:function(data){
	    	        if(data.status==100){
	    	            oPCenter.proList = data.value;
	    	        }else{
	    	            oPCenter.proList= '';
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