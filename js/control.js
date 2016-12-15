//create by msh at 2016.12.12 15:04
var token,
username,
oKey,
loginUrl = 'login.html',//登录路径
NowUrl;//当前路径

NowUrl = getNowUrl(); //获取当前路径和参数

getCookie();
checkLogin();

//检测登录信息函数
function checkLogin() {
	if(!token||!username||!oKey){
		layer.msg('请先登录',{time:2000});
		//跳转
		setTimeout(function(){
			jumpLogin(loginUrl,NowUrl);
		},2000);
	}
}

//获取客户端cookie
function getCookie() {
	token = cookie.get('token');
	username = cookie.get('username');
	oKey = cookie.get('oKey');
}

//跳转到登录函数
function jumpLogin(loginUrl,NowUrl){
	cookie.clear();//清除cookie
	location.href = loginUrl+'?'+NowUrl;
}

//获取当前路径和参数
function getNowUrl() {
    var name,value; 
    var str = location.href;
    var num = str.lastIndexOf("/");
    str = str.substr(num+1);
    return str
}