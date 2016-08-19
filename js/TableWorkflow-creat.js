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


var TableCreat = new Vue({
	el:'body',
	data:{
		tableID:Request.tableID,
		TableCreat:''
	},
	computed:{
		TableCreat:function(){
			return 'TableWorkflow-creat.html'+'?tableID='+this.tableID
		}
	},
	methods:{
		selectMB:function(){
			$('.selectMB').modal('show');
		}
	}
}) 