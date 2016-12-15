console.log(serverUrl);

var num = 25;//默认展示个数

var userlist = new Vue({
	el:'body',
	data:{
		alluser:'',
		count:'',
		pageNow:'',
		countPage:'',
		jump:'',
        enabled:'',//状态
		search:'',//搜索关键字
        searchResult:''
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/user',
			data:{
                key:oKey,
                user_id:token,
				pagesize:num
			},
			datatype:'json',
			success:function(data){
				if (data.status==100) {
					userlist.alluser = data.value;
					userlist.count = data.countUser;
					userlist.pageNow = data.pageNow;
					userlist.countPage = data.countPage;
				}else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }else {
                    layer.msg(data.msg)
                }
			},
            error:function(jqXHR){
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
    },
	methods:{
        //提交搜索
        searchuse:function(){
            var vm = this;
            var enabled = userlist.enabled;
            var search = userlist.search.trim();
            if (!enabled&&!search) {
                layer.msg('必须选择状态或者填写关键字');
            } else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/user',
                    datatype:'',
                    data:{
                        key:oKey,
                        user_id:token,
                        enabled:enabled,
                        search:search
                    },
                    success:function(data){
                        if(data.status==100) {
                            userlist.alluser = data.value;
                            userlist.count = data.countUser;
                            userlist.pageNow = data.pageNow;
                            userlist.countPage = data.countPage;
                            //搜索条件数据
                            var newObj = $.extend(true, {}, vm.search);
                            vm.searchResult = newObj;
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
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
		//删除用户
    	deleteuse:function(use) {
    		var vm = this;
            var pageNow = this.pageNow;
            var search = this.search;
    		layer.confirm('确定删除用户?',{
    			btn:['确定','取消']
    		},function(index){
    			layer.close(index);
    			if (use) {
    				$.ajax({
    					type:'POST',
    					url:serverUrl+'delete/user',
    					datatype:'json',
    					data:{
                            key:oKey,
                            user_id:token,
    						uid:use.id
    					},
    					success:function (data) {
    						if(data.status==100){
    							layer.msg('删除成功');
    							vm.alluser.$remove(use);
                                //重新拉取数据
                                setTimeout(getPageData (vm,pageNow,search,num),1000);
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
    		var vm = this;
			var search = this.searchResult;
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
    		var vm = this;
    		var	search = this.searchResult;
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
        url:serverUrl+'get/user',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            page:pageNow,
            pagesize:num
        },
        success:function(data){
            layer.close(LoadIndex); //关闭遮罩层
            if(data.status==100){
                vm.alluser = data.value;
                vm.count = data.countUser;
                vm.pageNow = data.pageNow;
                vm.countPage = data.countPage;
            }else if(data.status==101){
                layer.msg('操作失败');
            }else if(data.status==102){
                layer.msg('参数错误');
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
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    })
}

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