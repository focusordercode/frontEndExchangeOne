//creat by msh 2016.11.9 
//公共组件

console.log(serverUrl)

//导航组件
var dataText;

$.ajax({
    type:'POST',
    url:serverUrl+'usernav',
    datatype:'json',
    async: false,
    data:{
        user_id:token
    },
    success:function(data){
        if(data.status==100){
            dataText = data.value;
            // console.log(data.value)
        }else if(data.status==1012){
            layer.msg('请先登录',{time:2000});
            $(window).unbind('beforeunload');
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
        layer.msg('向服务器请求导航数据失败');
    }
})

var navHtml = '<template v-for="tab in dataText.navData"><li class="dropdown"><a href="javascript:" class="dropdown-toggle">{{tab.nav_tab}}<span class="caret"></span></a><ul class="dropdown-menu"><template v-for="link in tab.nav_list"><li><a :href="link.link">{{link.link_name}}</a></li></template></ul></li></template>';

var navTPL = Vue.extend({
    template: navHtml,
    data: function () {
    	return { dataText }
	}
})
Vue.component('nav-component', navTPL);

//登录登出组件
var oUid = cookie.get('id');
var oUserName = cookie.get('username');
var logHtml = '<div class="log-msg"><span @click="goUserInfo"><i class="fa fa-user fa-fw"></i>{{username}}</span><div class="btn-group"><span class="dropdown-toggle"data-toggle="dropdown"><i class="fa fa-caret-down"></i></span><ul class="dropdown-menu"role="menu"><li @click="goUserInfo"><span><i class="fa fa-user fa-fw"></i>个人信息</span></li><li @click="goLogOut"><span><i class="fa fa-sign-out fa-fw"></i>登出</span></li></ul></div></div>';

var logTPL = Vue.extend({
    template: logHtml,
    data:function(){
        return {username:oUserName}
    },
    methods:{
        goUserInfo:function(){
            if(oUid){
                location.href = 'personal.html?id='+ oUid;
            }
        },
        goLogOut:function(){
            $.ajax({
                type:'POST',
                url:serverUrl+'logout',
                datatype:'json',
                success:function(data){},
                error:function(jqXHR){}
            })
            cookie.clear();
            location.href = loginUrl;
        }
    }
})
Vue.component('log-component', logTPL);


$(document).on('click','.dropdown',function(){
	var hasClass = $(this).hasClass("open");
	if(hasClass){
		$(this).removeClass('open');
	}else{
		$('.dropdown').removeClass('open');
		$(this).addClass('open');
	}
});

$(document).on('click',function(e){
    var _con = $('.dropdown');
    if(!_con.is(e.target) && _con.has(e.target).length === 0){
    	$('.dropdown').removeClass('open');
    }
})

//模板的html标签
/*
<template v-for="tab in dataText.navData">
    <li class="dropdown">
        <a href="javascript:" class="dropdown-toggle">{{tab.nav_tab}}<span class="caret"></span></a>
        <ul class="dropdown-menu">
        	<template v-for="link in tab.nav_list">
            	<li><a :href="link.link">{{link.link_name}}</a></li>
        	</template>
        </ul>
    </li>
</template>
*/