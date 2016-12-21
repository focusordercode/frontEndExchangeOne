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

console.log(serverUrl); //后端接口地址
var oUrl = serverUrl;//图片服务器地址

var picEdit = new Vue({
	el:'body',
	data:{
		picInfo:'',
		picUpload:'',
		tag:''
	},
	ready:function(){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/imageInfo',
			datatype:'json',
			data:{
				key:oKey,
                user_id:token,
				num:Request.id
			},
			success:function(data){
				if(data.status==100){
					picEdit.picInfo = data.value;
					var picInfoLen = picEdit.picInfo.length;
					for(var i = 0;i<picInfoLen;i++){
						Vue.set(picEdit.picInfo[i],'tag','');
					}
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
		//发送请求保存
		saveInfo:function(){
			$.ajax({
				type:'POST',
				url:serverUrl+'update/imageInfo',
				datatype:'json',
				data:{
					key:oKey,
                	user_id:token,
					data:picEdit.picInfo
				},
				success:function(data){
					if(data.status==100){
						layer.msg('保存成功');
					}else if(data.status==101){
						layer.msg('保存失败，数据为空或者未作出修改');
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
					layer.msg('向服务器请求保存数据失败');
				}
			})
		},
		//添加标签
		addTags:function(index,list){
			var text = list.tag.trim();
			//检测标签是否有重复
			var listLen = list.tags.length;
			var sameArr = new Array();
			for(var h = 0;h<listLen;h++){
				if(text==list.tags[h]){
					sameArr.push(list.tags[h]);
				}
			}
			
			if (sameArr.length>0){
			    layer.msg('标签重复');
			 }else if(text){
			 	this.picInfo[index].tags.push(text);
			    list.tag = '';
			 }
		},
		//删除标签
		removeTags:function(index,list){
			list.tags.splice(index, 1);
		},
		//复制标题
		copyTitle:function(){
			var title = this.picInfo[0].title;
			var picLen = this.picInfo.length;
			for(var i = 0;i<picLen;i++){
				Vue.set(picEdit.picInfo[i],'title',title);
			}
		},
		//复制标签
		copyTags:function(){
			var picLen = this.picInfo.length;
			for(var i = 0;i<picLen;i++){
				picEdit.picInfo[i].tags = picEdit.picInfo[0].tags.slice();
			}
		}
	}
})

Vue.filter('imgUrl',function(value){
    var str = value;
    var file_name = value.file_name;
    var strLen = str.path.length;
    var strNew = str.path.substr(1,strLen-1);
    strNew = oUrl + strNew + '/'+file_name;
    return strNew
})
