// Creat by msh at 2016.10.13
var search = serverUrl+"index.php/vague/name"; //模糊搜索地址
var temp = serverUrl+"Public/file/ProductTemplate.xlsx";  //模板地址
console.log(serverUrl); //后端接口地址

var oCreat = new Vue({
    el:'body',
    data:{
		cn_name:'',
		en_name:'',
		cateId:'',
        proSelectFor:'',
        proSelectFora:'',
        now:-1,
        ishsow_SelectList:false,
        temp_now:-1,
        ishsow_SelectListTemp:false,
		remark:'',
		enabled:1,
		// 下面的是交互用的数据
		proList:'',
		cate_name:'',
		cn_alert:false,
		en_alert:false,
		cate_alert:false,
		// 批量
		download:temp,
		respons:''
    },
    methods:{
    	//创建产品
    	creatProduct:function(){
    		var vm = oCreat;
            var creator_id = cookie.get('id');
    		//英文正则,英文数字和空格
    		var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;
    		if(!(this.cn_name.trim())){
    			this.cn_alert = true;
                this.en_alert = false;
                this.cate_alert = false;
    		}else if(!Entext.test(this.en_name)||!(this.en_name.trim())){
    			this.cn_alert = false;
    			this.en_alert = true;
                this.cate_alert = false;
    		}else if(!this.cateId){
    			this.cn_alert = false;
    			this.en_alert = false;
    			this.cate_alert = true;
    		}else{
    			this.cn_alert = false;
    			this.en_alert = false;
    			this.cate_alert = false;

    			$.ajax({
    			    type:'POST',
    			    url:serverUrl+'set/productcenter',
    			    datatype:'json',
    			    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
    			        cn_name:vm.cn_name,
    			        en_name:vm.en_name,
    			        category_id:vm.cateId,
    			        remark:vm.remark,
    			        enabled:vm.enabled,
    			        state:'single'
    			    },
    			    success:function(data){
    			        if(data.status==100){
    			            layer.msg('保存成功');
    			            vm.cn_name = '';
    			            vm.en_name = '';
    			            vm.cateId = '';
    			            vm.cate_name = '';
    			            vm.remark = '';
    			        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

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
    			        layer.msg('向服务器请求失败');
    			    }
    			})
    		}
    	},
    	//从搜索结果中选中一个类目
    	selectCate:function(pro){
    	    oCreat.cate_name = pro.cn_name;
    	    oCreat.cateId = pro.id;
    	    oCreat.proList = '';
    	    //清除值，隐藏框
    	    $('.searchCate').val('');
    	    $('.searchCompent').hide();
    	    $('.searchCate2').val('');
    	    $('.searchCompent2').hide();
    	},
    	//上传模板文件
    	upload:function(){
    		var fileData = $('#file').val();//文件数据
    		if(!this.cateId){
    			this.cate_alert = true;
                $('.searchCompent2').hide();
    		}else if(!fileData){
    			this.cate_alert = false;
    			layer.msg('请先选择文件');
    		}else{
    			this.cate_alert = false;

    			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

    			var vm = oCreat;
                var creator_id = cookie.get('id');
    			var category_id = vm.cateId;//类目
    			var state = 'many';//类型
    			var formData = new FormData();
    			formData.append('file', $('#file')[0].files[0]);//文件
    			formData.append('category_id', category_id);//参数
    			formData.append('state', state);//参数
                formData.append('key', oKey);//参数
                formData.append('user_id', token);//参数
                formData.append('creator_id', creator_id);//参数

    			$.ajax({
    			    url:serverUrl+'set/productcenter',
    			    type:'POST',
    			    cache: false,
    			    data:formData,
    			    processData: false,
    			    contentType: false,
    			    success:function(data){
    			        layer.close(LoadIndex); //关闭遮罩层
    			        if(data.status==100){
    			            layer.msg('上传成功');
    			            vm.respons = data.value;
    			        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

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
    			        layer.close(LoadIndex); //关闭遮罩层
    			        layer.msg('上传失败');
    			    }
    			})
    		}
    	},
        get:function (ev) {
            if(ev.keyCode == 8){
                this.now = -1
            }
            if(ev.keyCode == 38 || ev.keyCode == 40)return;

            if(ev.keyCode == 13){
                this.ishsow_SelectList = !this.ishsow_SelectList;
            }
            var getWidth = $('.pors .cate-listA').prev('.form-control').innerWidth();
            $('.pors .cate-listA').css('width',getWidth);
            var searchCusVal = $('.searchCate').val();

            $.ajax({
                type:'POST',
                url:search,
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    text:searchCusVal
                },
                success:function(data){
                    if(data.status==100){
                        oCreat.proList = data.value;
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});

                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
                        oCreat.proList= '';
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求客户信息失败');
                }
            })
        },
        changeDown:function () {
            this.now++;
            if(this.now == this.proList.length){
                this.now = -1;
            }else{
                $('#searchInput0').animate({scrollTop:this.now*33},100);
                this.cateId = this.proList[this.now].id;
                this.cate_name = this.proList[this.now].cn_name;
                this.proSelectFor = this.proList[this.now].cn_name;

            }
        },
        changeUp:function () {
            this.now--;
            if(this.now == -2){
                this.now = this.proList.length-1;
            }else if(this.now == -1){
                this.now = this.proList.length;
            }else {
                $('#searchInput0').animate({scrollTop:this.now*33},100);
                this.cateId = this.proList[this.now].id;
                this.cate_name = this.proList[this.now].cn_name ;
                this.proSelectFor = this.proList[this.now].cn_name;
            }
        },
        show:function () {
            this.ishsow_SelectList = !this.ishsow_SelectList;
            this.proSelectFor = ''
        },
        getTemp: function (ev) {
            if(ev.keyCode == 8){
                this.now = -1
            }
            if(ev.keyCode == 38 || ev.keyCode == 40)return;

            if(ev.keyCode == 13){
                this.ishsow_SelectListTemp = !this.ishsow_SelectListTemp;
            }
            var getWidth = $('.searchCate2').innerWidth();
            $('.cate-listB').css('width',getWidth);
            var searchCusVal = $('.searchCate2').val();
            // debugger
            $.ajax({
                type:'POST',
                url:search,
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    text:searchCusVal
                },
                success:function(data){
                    if(data.status==100){
                        oCreat.proList = data.value;
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});

                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
                        oCreat.proList= '';
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求客户信息失败');
                }
            })
        },
        changeDownTemp:function () {
            this.temp_now++;
            if(this.temp_now == this.proList.length){
                this.temp_now = -1;
            }else{
                $('#searchInput1').animate({scrollTop:this.temp_now*33},100);
                this.cateId = this.proList[this.temp_now].id;
                this.cate_name = this.proList[this.temp_now].cn_name;
                this.proSelectFora = this.proList[this.temp_now].cn_name;

            }
        },
        changeUpTemp:function () {
            this.temp_now--;
            if(this.temp_now == -2){
                this.temp_now = this.proList.length-1;
            }else if(this.temp_now == -1){
                this.temp_now = this.proList.length;
            }else {
                $('#searchInput1').animate({scrollTop:this.temp_now*33},100);
                this.cateId = this.proList[this.temp_now].id;
                this.cate_name = this.proList[this.temp_now].cn_name ;
                this.proSelectFor = this.proList[this.temp_now].cn_name;
            }
        },
        showTemp:function () {
            this.ishsow_SelectListTemp = !this.ishsow_SelectListTemp;
            this.proSelectFora = ''
        }
    }
});

//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        oCreat.cate_alert = false;
        $('.searchCompent').show();
        $('#searchInput1').hide();
        $('#searchInput0').show();
    });
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
        oCreat.ishsow_SelectList = !oCreat.ishsow_SelectList;
    });

    //批量上传的搜索
    $('.searchBtn2').on('click',function(){
        $('.searchCompent2').show();
        $('#searchInput0').hide();
        $('#searchInput1').show();
        oCreat.cate_alert = false;

    });
    $('.closeBtn2').on('click',function(){
        $('.searchCompent2').hide();
        oCreat.ishsow_SelectListTemp = !oCreat.ishsow_SelectListTemp;
    })
});
//搜索列表显示隐藏的函数提取到control.js
searchListTog(0);
searchListTog(1);



//模糊搜索类目
/*$('.searchCate').on('keyup',function(){
   /!* var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();

    $.ajax({
        type:'POST',
        url:search,
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            text:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                oCreat.proList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                oCreat.proList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })*!/
});*/

//批量上传的搜索
/*
$('.searchCate2').on('keyup',function(){
   /!* var getWidth = $('.searchCate2').innerWidth();
    $('.searchCate2').next().css('width',getWidth);
    var searchCusVal = $('.searchCate2').val();
    // debugger
    $.ajax({
        type:'POST',
        url:search,
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            text:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                oCreat.proList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                oCreat.proList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })*!/
});*/
