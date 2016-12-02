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
			url:'http://192.168.1.40/canton/get/userbyid',
			datatype:'json',
			data:{
				uid:cus_id
			},
			success:function(data){
                if(data.status==100){
                	amend.userdata = data.value;
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
            var word = /^[A-z\s]+$/;
            var EM = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
			if(vm.password&&!word.test(vm.password)) {
				vm.al_pass = true;
			}else if (vm.mobile&&!tel.test(vm.mobile)) {
				vm.al_pass = false;
				vm.al_mobile = true;
			}else if (vm.email&&!EM.test(vm.email)) {
				vm.al_pass = false;
				vm.al_mobile = false;
				vm.al_email = true;
			}else if (vm.real_name) {
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
					url:'http://192.168.1.40/canton/edit/user',
					datatype:'json',
					data:{
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