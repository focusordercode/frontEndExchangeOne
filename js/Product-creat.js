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


var proInfo = new Vue({
	el:'body',
	data:{
		textInfo:'',
		list:[],
		template_id:'',
		changeNum:'',
		url:''
	},
	ready:function(){
		//获取模板信息
		$.ajax({
		    type: "POST",
		    url: "http://192.168.1.42/canton/index.php/get/template", //添加请求地址的参数
		    dataType: "json",
		    data:{
		        id:Request.id
		    },
		    success: function(data){
		        if(data.status==100){
		            proInfo.textInfo = data.value[0];
		        };
		    },
		    error: function(jqXHR){     
		        layer.msg('从服务器获取模板信息失败');
		    }
		})
		//获取模板的条目
		$.ajax({
		    type: "POST",
		    url: "http://192.168.1.42/canton/index.php/get/templateitem", //添加请求地址的参数
		    dataType: "json",
		    data:{
		        template_id:Request.id,
		        category_id:Request.category_id
		    },
		    success: function(data){
		        if(data.status==100){
		            proInfo.list = data.value;
		        };
		    },
		    error: function(jqXHR){     
		        layer.msg('从服务器获取模板信息失败');
		    }
		})
	},
	computed: {
		template_id: function () {
			return this.textInfo.id;
		},
		url:function(){
			return 'Product-list.html?id=' + this.textInfo.id+ '&category_id=' + this.textInfo.category_id;
		}
	},
	methods:{
		//提交数据
		submit:function(){
			var oSaveText = $('.product-text .save-text');
			// oSaveText.each(function(){
			//   var vl=$(this).val();
			//   if(vl==""){
			//   	layer.msg('请输入内容');	
			//     }
			// });
			if (oSaveText.val()=='') {
				layer.msg('请输入内容');
			}else if($('.product-text .changeNum').val()<0){
				layer.msg('变体不能为负数，可以为空');
			}else{
				$.ajax({
				    type: "POST",
				    url: "http://192.168.1.42/canton/index.php/post/info", //添加请求地址的参数
				    dataType: "json",
				    data:{
				    	category_id:proInfo.textInfo.category_id,
				        template_id:proInfo.template_id,
				        changeNum:proInfo.changeNum,
				        allData:proInfo.list
				    },
				    success: function(data){
				        if(data.status==100){
				            layer.msg('提交成功,可点击【查看资料表】按钮查看资料表');
				            // $('.product-text .save-text').val('');
				        }else if(data.status==101){
				        	layer.msg('提交数据失败，请检查');
				        }else if(data.status==103){
				        	layer.msg('整数类型填写错误');
				        }else if(data.status==104){
				        	layer.msg('小数类型填写错误');
				        }else if(data.status==105){
				        	layer.msg('时间格式填写错误');
				        };
				    },
				    error: function(jqXHR){     
				        layer.msg('向服务器请求失败');
				    }
				})
			}
		}
	}
})
//Vue过滤器
Vue.filter('dataType', function (value) {
    var str;
    switch(value){
    	case "int": str = "整数";break;
    	case "char": str = "字符文本";break;
    	case "dc": str = "小数";break;
    	case "dt": str = "日期(格式参考:2017-01-01|2017/01/01|2017.01.01|20170101)";break;
    	case "bl": str = "是否";break;
    	case "pic": str = "图片";break;
    }
    return str;
})

