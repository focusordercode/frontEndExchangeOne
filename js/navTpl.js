//creat by msh 2016.11.9 
//公共导航组件

var dataText = {
	"navData":[
		{"nav_tab":"产品表格","nav_list":[{"link":"template.html","link_name":"资料表模板"},{"link":"Table-info.html","link_name":"资料表"},{"link":"template-batch-list.html","link_name":"批量表模板"},{"link":"Table-batch.html","link_name":"批量表"}]},
		{"nav_tab":"图片","nav_list":[{"link":"pic-category.html","link_name":"图片库"},{"link":"pic-trash.html","link_name":"回收站"}]},
		{"nav_tab":"资源","nav_list":[{"link":"product-center.html","link_name":"产品中心"},{"link":"Thesaurus.html","link_name":"词库"},{"link":"customer.html","link_name":"客户"},{"link":"admin-category.html","link_name":"产品类目"},{"link":"upcUpload.html","link_name":"UPC"}]},
		{"nav_tab":"系统","nav_list":[{"link":"Searchlog.html","link_name":"日志"},{"link":"partition.html","link_name":"数据库"},{"link":"FileManager.html","link_name":"文件管理器"},{"link":"model.html","link_name":"业务模块"}]}
	]
};
var navHtml = '<template v-for="tab in dataText.navData"><li class="dropdown"><a href="javascript:" class="dropdown-toggle">{{tab.nav_tab}}<span class="caret"></span></a><ul class="dropdown-menu"><template v-for="link in tab.nav_list"><li><a :href="link.link">{{link.link_name}}</a></li></template></ul></li></template>';

var navTPL = Vue.extend({
    template: navHtml,
    data: function () {
    	return { dataText }
	}
})
Vue.component('nav-component', navTPL);

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