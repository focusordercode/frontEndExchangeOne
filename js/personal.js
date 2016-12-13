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

var cus_id = Request.id;//个人id
var visitType = Request.visitType;

var amend = new Vue({
	el:"body",
	data:{
		userdata:'',//个人数据
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
	
	methods:{
		//跳转修改函数
		goXG:function () {
			var url = 'personal.html',
				item = this.userdata;
			if(item){
				window.location.href = url+'?id='+item.id+'&visitType=visitType';
			}
		},
		//返回个人详情
		goInfo:function () {
			var url = 'personal.html',
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
				var remark = vm.userdata.remark;

				$.ajax({
					type:'POST',
					url:'http://192.168.1.40/canton/edit/personal',
					datatype:'json',
					data:{
						uid:cus_id,
						password:password,
						mobile:mobile,
						email:email,
						real_name:real_name,
						remark:remark,
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
//刷新函数
function windowFresh(){
    location.reload(true);
}
