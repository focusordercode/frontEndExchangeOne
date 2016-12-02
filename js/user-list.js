console.log(serverUrl);

serverUrl = 'http://192.168.1.40/canton/';
//序号过滤器
Vue.filter('ListNum',function(value){
    var str = value;
    var pageNow = userlist.pageNow;
    if(pageNow==1){
    	str = str + 1;
    }else if(pageNow>1){
    	str = (pageNow-1)*num+str+1;
    }
    return str
})


var userlist = new Vue({
	el:'body',
	data:{
		alluser:'',
		countUser:'',
		pageNow:'',
		countPage:'',
		jump:''
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/user',
			datatype:'json',
			success:function(data){
				if (data.status==100) {
					userlist.alluser = data.value;
					userlist.countUser = data.countUser;
					userlist.pageNow = data.pageNow;
					userlist.countPage = data.countPage;
				}
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
    },
	methods:{
		//删除产品
    	deleteuse:function(use) {
    		var vm = this;
            var pageNow = this.pageNow;
            var search = this.search;
    		layer.confirm('确定删除产品?',{
    			btn:['确定','取消']
    		},function(index){
    			layer.close(index);
    			if (use) {
    				$.ajax({
    					type:'POST',
    					url:serverUrl+'delete/user',
    					datatype:'json',
    					data:{
    						uid:use.id
    					},
    					success:function (data) {
    						if(data.status==100){
    							layer.msg('删除成功');
    							vm.alluser.$remove(use);
                                //重新拉取数据
                                setTimeout(getPageData (vm,pageNow,search,num),1000);
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
    	//刷新
    	Reflesh:function(){
    		location.reload(true);
    	},
    	//上一页
    	goPrePage:function(){
    		var pageNow = this.pageNow;
    		var vm = this,
    			search = this.searchResult;
    		if(pageNow<=1){
    			layer.msg('没有上一页啦');
    		}else{
    			pageNow--
    			getPageData (vm,pageNow,search,num);
    		}
    	},
    	//下一页
    	goNextPage:function(){
    		var pageNow = this.pageNow;
    		var countPage = this.countPage;
    		var vm = this,
    			search = this.searchResult;
    		if(pageNow==countPage){
    			layer.msg('没有下一页啦');
    		}else{
    			pageNow++
    			getPageData (vm,pageNow,search,num);
    		}
    	},
    	//页面跳转
    	goJump:function(){
    		var jump = this.jump;
    		var countPage = this.countPage;
    		var vm = this,
    			search = this.searchResult;
    		if(jump>countPage){
    			layer.msg('大于总页数啦');
    			vm.jump = '';
    		}else if (jump<=0){
                layer.msg('页码错误');
                vm.jump = '';
            }else{
    			getPageData (vm,jump,search,num);
                vm.jump = '';
    		}
    	},
    }
})

//刷新函数
function windowFresh(){
    location.reload(true);
}

//获取数据函数,翻页
function getPageData (vm,pageNow,search,num) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type:'POST',
        url:serverUrl+'get/allproductcenter',
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






