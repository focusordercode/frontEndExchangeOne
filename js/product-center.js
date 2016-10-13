// Creat by msh at 2016.10.13


var serverUrl = "http://192.168.1.40/PicSystem/canton/"; //后端接口地址

//状态过滤器
Vue.filter('statusFlilter',function(value){
    var str;
    switch(value){
        case 1: str = "启用";break;
        case 2: str = "停用";break;
    }
    return str;
})

var oPCenter = new Vue({
    el:'body',
    data:{
    	search:{
    		cateId:'',
    		status:'',
    		statusList:[
    			1,
    			2
    		],
    		keyword:''
    	}
    },
    methods:{
    	//创建产品
    	creatProduct:function(){

    	},
    	//刷新
    	Reflesh:function(){
    		location.reload(true);
    	}
    }
})

//刷新函数
function windowFresh(){
    location.reload(true);
}

$(document).ready(function(){
	
});