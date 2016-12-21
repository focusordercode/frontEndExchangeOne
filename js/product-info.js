// Creat by msh at 2016.10.14

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
var visitType = Request.visitType,
	itemId = Request.id;

//刷新函数
function windowFresh(){
    location.reload(true);
}

console.log(serverUrl); //后端接口地址
var search = serverUrl+"index.php/vague/name"; //模糊搜索地址
var temp = serverUrl+"Public/file/ProductTemplate.xlsx"  //模板地址

//状态过滤器
Vue.filter('statusFlilter',function(value){
    var str;
    switch(value){
        case 1: str = "启用";break;
        case 2: str = "停用";break;
    }
    return str;
})

var oInfo = new Vue({
	el:'body',
	data:{
		visitType:visitType,//访问类型
		info:'', //产品信息
		statusList:[
			1,
			2
		],
		// 下面的是交互用的数据
		proList:'',
		cate_name:'',
		cn_alert:false,
		en_alert:false,
		cate_alert:false,
	},
	ready:function () {
		$.ajax({
		    type:'POST',
		    url:serverUrl+'get/productcenter',
		    datatype:'json',
		    data:{
		    	key:oKey,
                user_id:token,
		        id:itemId
		    },
		    success:function(data){
		        if(data.status==100){
		            oInfo.info = data.value[0];
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
		        layer.msg('向服务器请求数据失败');
		    }
		})
	},
	computed:{
		enabled:function () {
			var str,
				status = this.info.enabled;
			if (status==1) {
				str = '启用';
			}else{
				str = '停用';
			}
			return str
		}
	},
	methods:{
		//删除产品
		deleteItem:function () {
			var item = this.info,
				vm = oInfo;
			layer.confirm('确定删除产品?',{
				btn:['确定','取消']
			},function(index){
				layer.close(index);
				if (item) {
					$.ajax({
						type:'POST',
						url:serverUrl+'delete/productcenter',
						datatype:'json',
						data:{
							key:oKey,
                			user_id:token,
							id:item.id
						},
						success:function (data) {
							if(data.status==100){
								layer.msg('删除成功');
								//跳转函数
								function goNext() {
								    var url = 'product-center.html';
								    window.location.href = url;
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
						error:function (jqXHR) {
							layer.msg('向服务器请求失败');
						}
					})
				}
			})
		},
		//跳转到修改
		goXG:function () {
			var url = 'product-info.html'
				item = this.info;
			if(item){
				window.location.href = url+'?id='+item.id+'&visitType=visitType';
			}
		},
		//返回产品详情
		goInfo:function () {
			var url = 'product-info.html'
				item = this.info;
			if(item){
				window.location.href = url+'?id='+item.id;
			}
		},
		//从搜索结果中选中一个类目
		selectCate:function(pro){
		    oInfo.info.category_name = pro.cn_name;
		    oInfo.info.category_id = pro.id;
		    oInfo.proList = '';
		    //清除值，隐藏框
		    $('.searchCate').val('');
		    $('.searchCompent').hide();
		},
		// 提交修改
		update:function () {
			var vm = oInfo,
				info = vm.info;
			//英文正则,英文数字和空格
			var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;
			var creator_id = cookie.get('id');
			if(!(info.cn_name.trim())){
				this.cn_alert = true;
			}else if(!Entext.test(info.en_name)||!(info.en_name.trim())){
				this.cn_alert = false;
				this.en_alert = true;
			}else if(!info.category_id){
				this.cn_alert = false;
				this.en_alert = false;
				this.cate_alert = true;
			}else{
				this.cn_alert = false;
				this.en_alert = false;
				this.cate_alert = false;

				$.ajax({
				    type:'POST',
				    url:serverUrl+'set/productcenter',
				    datatype:'json',
				    data:{
				    	key:oKey,
                		user_id:token,
                		creator_id:creator_id,
				    	id:info.id,
				        cn_name:info.cn_name,
				        en_name:info.en_name,
				        category_id:info.category_id,
				        remark:info.remark,
				        enabled:info.enabled,
				        state:'update'
				    },
				    success:function(data){
				        if(data.status==100){
				            layer.msg('保存成功');

				            function goNext() {
				            	var url = 'product-info.html'
				            		item = vm.info;
				            	if(item){
				            		window.location.href = url+'?id='+item.id;
				            	}
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
				        layer.msg('向服务器请求失败');
				    }
				})
			}
		}
	}
})

//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
        oInfo.cate_alert = false;
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
})

//模糊搜索类目
$('.searchCate').on('keyup',function(){
    var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();

    $.ajax({
        type:'POST',
        url:search,
        datatype:'json',
        data:{
        	key:oKey,
            user_id:token,
            text:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                oInfo.proList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                oInfo.proList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })
});