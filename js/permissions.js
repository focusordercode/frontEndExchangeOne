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

var role_id = Request.id;

var role_name = Request.name;
console.log(role_name);
var permission = new Vue({
	el:'body',
	data:{
		role_info:'',//角色信息
		pers:'',//获取到的权限数据
		ids:[]
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/rule2role',
			datatype:'json',
			data:{
				role_id:role_id
			},
			success:function(data){
				if(data.status == 100){
					permission.pers = data.value;
				}else{
					layer.msg(data.msg);
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器请求权限信息失败');
			}
		})

		$.ajax({
			type:'POST',
			url:serverUrl+'get/roles',
			datatype:'json',
			data:{
				id:role_id
			},
			success:function(data){
				if (data.status == 100) {
					permission.role_info = data.value[0];
				}
			},
			error:function (jqXHR) {
				layer.msg('向服务器请求角色信息失败');
			}
		})
	},
	methods:{
		//提交保存
		addbtn:function(){
			var vm = this;
			var pers = this.pers;
			var ids = getIds(pers);
			console.log(ids);
			$.ajax({
				type:'POST',
				url:serverUrl+'allot/rule2role',
				datatype:'json',
				data:{
					role_id:role_id,
					rule_ids:ids
				},
				success:function(data){
					if (data.status == 100) {
						layer.msg('提交成功');
					}
				},
				error:function(jqXHR){
					layer.msg('向服务器请求角色信息失败');
				}
			})
		}
	}
})
function getIds(pers) {
	var ids = [];
	for(var i = 0;i<pers.length;i++){
		if(pers[i].have == true){
			ids.push(pers[i].id);
		}
		for(var h = 0;h<pers[i].son.length;h++){
			if(pers[i].son[h].have == true){
				ids.push(pers[i].son[h].id);
			}
		}
	}
	return ids
}
