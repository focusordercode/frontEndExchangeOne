var fliemanage = new Vue({
	el:'body',
	data:{
		type:'',
		fiel:'',
		arrayurl:[],
		folder:'',
		u:'',
		count:'',
		countPage:'',
		pageNow:'',
		prePage:'',
		nextPage:'',
		prePageBtn:'',
		nextPageBtn:'',
		jump:'',
		jumpBtn:''
	},
    computed:{
        //三个按钮状态
        jumpBtn:function(){
            var jump = this.jump;
            if(!jump){
                return true
            }else{
                return false
            }
        },
        prePageBtn:function(){
            var pageNow = this.pageNow;
            if(pageNow<=1){
                return true
            }else{
                return false
            }
        },
        nextPageBtn:function(){
            var pageNow = this.pageNow;
            var countPage = this.countPage;
            if(pageNow==countPage||countPage==0){
                return true
            }else{
                return false
            }
        }
    },
	methods:{
	searchfiel:function(){
		$.ajax({
            type:'post',
            url:'http://192.168.1.40/PicSystem/canton/get/folder',
            datatype:'json',
            data:{
                type:fliemanage.type
            },
            success: function(data){
                if(data.status==100){
                    fliemanage.fiel=data.value;
                }
                else{
                	fliemanage.fiel=null,
                	layer.msg(data.msg)
                }
            },
            error: function(jqXHR){
                layer.msg('向服务器获取信息失败');
            }
        })
	},
	deleteItem:function(fiels){
		var vm = fliemanage;
		var item = fiels;
        var u=fiels.url;
		$.ajax({
            type:'post',
            url:'http://192.168.1.40/PicSystem/canton/del/file',
            datatype:'json',
            data:{
                url:item.url
            },
            success: function(data){
                if(data.status==100){
                    layer.msg("删除成功")
                    vm.fiel.$remove(item);
                }
                else{
					layer.msg(data.msg)
                }
            },
            error: function(jqXHR){
                layer.msg('向服务器获取信息失败');
            }
        })
	},
	delectfile:function(){
		$.ajax({
            type:'post',
            url:'http://192.168.1.40/PicSystem/canton/del/file',
            datatype:'json',
            data:{
                url:fliemanage.arrayurl
            },
            success: function(data){
                if(data.status==100){
                    layer.msg("成功删除文件数："+data.success+",删除失败文件数："+data.fail)

                }
                else{
					layer.msg(data.msg)
                }
            },
            error: function(jqXHR){
                layer.msg('向服务器获取信息失败');
            }
        })
	},
	openfolder:function(fiels){
		var vm = fliemanage;
		var item = fiels;
		$.ajax({
            type:'post',
            url:'http://192.168.1.40/PicSystem/canton/get/file',
            datatype:'json',
            data:{
                url:item.url
            },
            success: function(data){
                if(data.status==100){
                	vm.fiel =data.value
                    vm.count = data.count;
                    vm.countPage = data.countPage;
                    vm.pageNow = data.pageNow;
                    vm.u = item.url;
                }
                else{
                	vm.fiel=null,
					layer.msg(data.msg)
                }
            },
            error: function(jqXHR){
                layer.msg('向服务器获取信息失败');
            }
        })
    },



//上一页
goPrePage:function(){
    var pageNow = this.pageNow;
    if(pageNow<=1){
        layer.msg('没有上一页啦');
    }else{
        pageNow--
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/file',
            datatype:'json',
            data:{
                number:pageNow,
                url:fliemanage.u
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    fliemanage.fiel = data.value;
                    fliemanage.count = data.count;
                    fliemanage.countPage = data.countPage;
                    fliemanage.pageNow = data.pageNow;
                }else {
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求失败');
            }
        })
    }
},
//下一页
goNextPage:function(){
    var pageNow = this.pageNow;
    var countPage = this.countPage;
    if(pageNow==countPage){
        layer.msg('没有下一页啦');
    }else{
        pageNow++
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/file',
            datatype:'json',
            data:{
               number:pageNow,
               url:fliemanage.u
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    fliemanage.fiel = data.value;
                    fliemanage.count = data.count;
                    fliemanage.countPage = data.countPage;
                    fliemanage.pageNow = data.pageNow;
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求失败');
            }
        })
    }
},
//页面跳转
goJump:function(){
    var jump = this.jump;
    var countPage = this.countPage;
    if(jump>countPage){
        layer.msg('大于总页数啦');
        fliemanage.jump = '';
    }else{
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:'',
            datatype:'json',
            data:{
                number:pageNow,
                url:fliemanage.u
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    fliemanage.fiel = data.value;
                    fliemanage.count = data.count;
                    fliemanage.countPage = data.countPage;
                    fliemanage.pageNow = data.pageNow;
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求失败');
            }
        })
    }
}


}
})