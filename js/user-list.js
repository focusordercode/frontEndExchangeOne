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
		countPage:''
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
    	}
	}
})





