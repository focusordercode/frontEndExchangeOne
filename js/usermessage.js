console.log(serverUrl);

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

var cus_id = Request.id;//用户id
var visitType = Request.visitType;

//员工领导过滤器
Vue.filter('uFlilter',function(value){
    var str;
    if (value == 0) {
    	str = "否";
    }else if (value == 1) {
    	str = "是";
    }
    return str;
})
//状态过滤
Vue.filter('staFlilter',function(value){
    var str;
    if (value == 0) {
    	str = "关闭";
    }else if (value == 1) {
    	str = "启用";
    }
    return str;
})

console.log(serverUrl);
var amend = new Vue({
	el:"body",
	data:{
		userdata:'',//用户数据
		visitType:visitType,
		//01数据状态
		//判断数据
		al_pass:false,
		al_mobile:false,
		al_email:false,
		al_true:false
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/userbyid',
			datatype:'json',
			data:{
				key:oKey,
        		user_id:token,
				uid:cus_id
			},
			success:function(data){
                if(data.status==100){
                	amend.userdata = data.value;
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
                layer.msg('向服务器获取表格信息失败');
            }
		})
	},
	computed:{
		head:function(){

		}
	},
	methods:{
		//跳转修改函数
		goXG:function () {
			var url = 'usermessage.html',
				item = this.userdata;
			if(item){
				window.location.href = url+'?id='+item.id+'&visitType=visitType';
			}
		},
		//返回用户详情
		goInfo:function () {
			var url = 'usermessage.html',
				item = this.userdata;
			if(item){
				window.location.href = url+'?id='+item.id;
			}
		},
		//保存
		save:function(){
			var vm = amend;
			var tel = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
            var word =/^[A-Za-z0-9]+$/;
            var EM = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
			if(vm.userdata.password&&!word.test(vm.userdata.password)) {
				vm.al_pass = true;
			}else if (vm.userdata.mobile&&!tel.test(vm.userdata.mobile)) {
				vm.al_pass = false;
				vm.al_mobile = true;
			}else if (vm.userdata.email&&!EM.test(vm.userdata.email)) {
				vm.al_pass = false;
				vm.al_mobile = false;
				vm.al_email = true;
			}else if (!vm.userdata.real_name) {
				vm.al_pass = false;
				vm.al_mobile = false;
				vm.al_email = false;
				vm.al_true = true;
			}else{
				vm.al_pass = false;
				vm.al_mobile = false;
				vm.al_email = false;
				vm.al_true = false;

				var password = vm.userdata.password;
				var mobile = vm.userdata.mobile;
				var email = vm.userdata.email;
				var real_name = vm.userdata.real_name;
				var is_head = vm.userdata.is_head;
				var is_staff = vm.userdata.is_staff;
				var remark = vm.userdata.remark;
				var enabled = vm.userdata.enabled;

				$.ajax({
					type:'POST',
					url:serverUrl+'edit/user',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						uid:cus_id,
						password:password,
						mobile:mobile,
						email:email,
						real_name:real_name,
						is_head:is_head,
						is_staff:is_staff,
						remark:remark,
						enabled:enabled
					},
					success:function(data){

                        if (data.status==100) {
                            layer.msg('保存成功');
                            setTimeout(location.reload(true),1000);
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
                        layer.msg('向服务器请求添加失败');
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
