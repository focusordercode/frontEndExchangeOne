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

var picEdit = new Vue({
	el:'body',
	data:{
		picInfo:'',
		picUpload:''
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:'http://192.168.1.40/PicSystem/canton/get/imageInfo',
			datatype:'json',
			data:{
				num:Request.id
			},
			success:function(data){
				if(data.status==100){
					picEdit.picInfo = data.value;
				}
			},
			error:function(jqXHR){
				layer.msg('向服务器请求上传成功图片的信息失败');
			}
		})
	},
	computed:{
		picUpload:function(){
			var url = 'picUpload.html';
			str = url+'?id='+ Request.cate;
			return str
		}
	},
	methods:{
		saveInfo:function(){
			$.ajax({
				type:'POST',
				url:'http://192.168.1.40/PicSystem/canton/update/imageInfo',
				datatype:'json',
				data:{
					data:picEdit.picInfo
				},
				success:function(data){
					if(data.status==100){
						layer.msg('保存成功');
					}else if(data.status==101){
						layer.msg('保存失败，数据为空或者未作出修改');
					}
				},
				error:function(jqXHR){
					layer.msg('向服务器请求保存数据失败');
				}
			})
		}
	}
})

var oUrl = 'http://192.168.1.40/PicSystem/canton';//图片服务器地址

Vue.filter('imgUrl',function(value){
    var str = value;
    var file_name = value.file_name;
    var strLen = str.path.length;
    var strNew = str.path.substr(1,strLen-1);
    strNew = oUrl + strNew + '/'+file_name;
    return strNew
})
