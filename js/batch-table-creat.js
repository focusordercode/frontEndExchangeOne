var num = 10;//选择资料表展示个数
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
var type_code = 'batch';
var tableID = Request.tableID;
console.log(serverUrl); //后端接口地址

var tableCreat = new Vue({
	el:'body',
	data:{
		tableID:tableID,
		//类目列表
		proList:'',
		proSelected:'',
		proSelectedId:'',
		selecteTableBtn:'',
        proSelectFor:'',
		now:-1,
		is_show:false,//显示隐藏搜索列表
		//资料表列表
		tableList:'',
		keyword:'',
		tableSelected:'',//选择的资料表
		selectMBBtn:'',
		MBList:'',
		MBselected:'',
		sites:[
			'UK',
			'US',
			'France',
			'Italy',
			'Spain',
			'Germany'
		],
		siteSelect:'',
		//文件名
		tableName:'',
		file_name:'',
		//产品数量
		product_num:'',
        tablenNmber_alert:false,//控制表格编码为空出现提示
        catename_alert:false,//控制类目为空出现提示
        pname_alert:false,//控制资料为空出现提示
        tempname_alert:false,//控制批量表模板为空出现提示
		sitename_alert:false,//站点
		tablename_alert:false,//表格名称
		pnumber_alert:false//产品数量
	},
	computed:{
		// 选择产品资料表按钮
		selecteTableBtn:function(){
			if(this.proSelectedId){
				return false
			}else{
				return true
			}
		},
		//选择批量表模板按钮
		selectMBBtn:function(){
			if(this.tableSelected.id){
				return false
			}else{
				return true
			}
		},
		//模糊搜索产品资料表按钮
		searchTableBtn:function(){
			var keyword = this.keyword.trim();
			if(keyword){
				return true
			}else{
				return false
			}
		}
	},
	methods:{
		//从搜索结果中选中一个类目
		selectCate:function(pro){
			var vm = this;
			vm.proSelected = pro.cn_name;
			vm.proSelectedId = pro.id;
			vm.proList = '';
			vm.tableSelected = '';
			vm.MBselected = '';
			//把搜索框清空
			$('.searchCate').val('');
			$('.searchCompent').hide();
		},
		// 选择产品资料表
		selectTable:function(){
			var vm = this;

			if(!vm.proSelectedId){
				layer.msg('请先选择产品类目');
			}else{
				$('.selectTable').modal('show');

				var keyword; //定义个空的,这里不需要关键词
				getInfoTable(vm,num,keyword);
			}
		},
		//模糊搜索产品资料表
		searchTable:function () {
			var vm = this;
			var keyword = vm.keyword.trim();
			if(!keyword){
				layer.msg('请输入关键词');
			}else{
				getInfoTable(vm,num,keyword);
			}
		},
		//确定选中一个资料表
		confirmTable:function(){
			var vm = this;
			var Len = vm.tableList.length;
			var tableArr = new Array ();

			for(var i = 0;i<Len;i++){
				if(vm.tableList[i].checked){
					tableArr.push(vm.tableList[i]);
				}
			}

			if(tableArr.length==0){

				layer.msg('请先选择一个资料表');
			}else{
				vm.tableSelected = tableArr[0];
				vm.MBselected = '';
				$('.selectTable').modal('hide');
			}
		},
		//选择批量表模板
		selectMB:function(){
			var vm = this;

			if(!vm.tableSelected){
				layer.msg('请先选择资料表');
			}else{
				$('.selectMB').modal('show');

				$.ajax({
					type:'POST',
					url:serverUrl+'search/batchTel',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						form_id:vm.tableSelected.id
					},
					success:function(data){
						if(data.status==100){
							vm.MBList = data.value;

							var Len = vm.MBList.length;
							for(var i = 0;i<Len;i++){
								Vue.set(vm.MBList[i],'checked',false);
							}

						}else if(data.status==1012){
		                    layer.msg('请先登录',{time:2000});
		                    
		                    setTimeout(function(){
		                        jumpLogin(loginUrl,NowUrl);
		                    },2000);
		                }else if(data.status==1011){
		                    layer.msg('权限不足,请跟管理员联系');
		                }else{
							vm.MBList = '';
						}
					},
					error:function(jqXHR){
						layer.msg('向服务器请求批量表模板失败');
					}
				})
			}
		},
		//确定选中一个批量表模板
		confirmMB:function(){
			var vm = this;
			var Len = vm.MBList.length;
			var MBarr = new Array ();

			for(var i = 0;i<Len;i++){
				if(vm.MBList[i].checked){
					MBarr.push(vm.MBList[i]);
				}
			}

			if(MBarr.length==0){
				layer.msg('请先选择一个批量模板');
			}else{
				vm.MBselected = MBarr[0];
				$('.selectMB').modal('hide');
			}
		},
		//提交批量表信息
		saveTable:function(){
			var vm = this;
			var product_num = vm.product_num.trim();//产品数量
			var creator_id = cookie.get('id');
			var numTest= /^[0-9]*[1-9][0-9]*$/;//正整数正则
			vm.file_name = vm.tableSelected.company_name + "-" + vm.tableName;
			var file_name = $.trim( vm.file_name );
			if(!vm.tableID){
				/*layer.msg('没有检测到表格编码');*/
                vm.tablenNmber_alert = true;
			}else if(!vm.proSelectedId){
                vm.tablenNmber_alert = false;
                vm.catename_alert = true;
                $('.searchCompent').hide();
                $('#catename_alert').show();
				/*layer.msg('请先选择类目');*/
			}else if(!vm.tableSelected.id){
                vm.tablenNmber_alert = false;
                vm.catename_alert = false;
                vm.pname_alert = true;
				/*layer.msg('没有选择资料表');*/
			}else if(!vm.MBselected.id){
                vm.tablenNmber_alert = false;
                vm.catename_alert = false;
                vm.pname_alert = false;
                vm.tempname_alert = true;
				/*layer.msg('没有选择批量表模板');*/
			}else if(!vm.siteSelect){
                vm.tablenNmber_alert = false;
                vm.catename_alert = false;
                vm.pname_alert = false;
                vm.tempname_alert = false;
				vm.sitename_alert = true;
				/*layer.msg('没有选择站点');*/
			}else if(!vm.tableName.trim()){
                vm.tablenNmber_alert = false;
                vm.catename_alert = false;
                vm.pname_alert = false;
                vm.tempname_alert = false;
                vm.sitename_alert = false;
				vm.tablename_alert = true;
				/*layer.msg('表格名称不能为空');*/
			}else if(numTest.test(product_num)&&!product_num){
                vm.tablenNmber_alert = false;
                vm.catename_alert = false;
                vm.pname_alert = false;
                vm.tempname_alert = false;
                vm.sitename_alert = false;
                vm.tablename_alert = false;
				vm.pnumber_alert =true;
			/*	layer.msg('产品数量必须是正整数');*/
			}else{
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				$.ajax({
					type:'POST',
					url:serverUrl+'add/infoform',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
                		creator_id:creator_id,
						type_code:type_code, 
						category_id:vm.proSelectedId,//类目ID
						template_id:vm.MBselected.id,//模板ID
						form_no:vm.tableID,//表格编号
						client_id:vm.tableSelected.client_id,//客户ID
						product_form_id:vm.tableSelected.id,//资料表ID
						site_name:vm.siteSelect,//站点信息
						title:vm.tableName,//表格名称
						file_name:file_name, //文件名
						product_num:product_num //产品数量
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){

							layer.msg('保存成功');
							var Id = data.id;
							var template_id = vm.MBselected.id;

							//跳转函数
							function goNext() {
							    var url = 'batch-table-edit.html';
							    window.location.href = url+'?id='+Id+'&template_id='+template_id;
							}

							setInterval(goNext,1000);

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
						layer.msg('向服务器请求失败');
					}
				})
			}
		},
		//取消编辑表格
		cancel:function(){
			layer.confirm('确定不保存数据取消编辑吗?',{
				btn:['确定','取消']
			},function(){
				var url = 'Table-batch.html';
				window.location.href = url;
			});
		},
		get:function (ev) {
            if(ev.keyCode == 8){
                this.now = -1
            }
            if(ev.keyCode == 38 || ev.keyCode == 40)return;

            if(ev.keyCode == 13){
                this.proSelected = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectedId = this.proList[this.now].id;
                this.is_show = !this.is_show;
                this.now = -1;
            }
            var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
            $('.pors .cate-list').css('width',getWidth);
            var searchCusVal = $('.searchCate').val();
            $.ajax({
                type:'POST',
                url:serverUrl+'vague/name',
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    text:searchCusVal
                },
                success:function(data){
                    var vm = tableCreat;
                    if(data.status==100){
                        vm.proList = data.value;
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});

                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
                        vm.proList= '';
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求产品类目失败');
                }
            })
        },
        changeDown:function () {
            this.now++;
            if(this.now == this.proList.length){
                this.now = -1;
            }else{
                $('#searchInput0').animate({scrollTop:this.now*33},100);
                this.proSelectedId = this.proList[this.now].id;
                this.proSelected = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectFor = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;

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
                this.proSelectedId = this.proList[this.now].id;
                this.proSelected = this.proList[this.now].cn_name
                this.proSelectFor = this.proList[this.now].cn_name
            }
        },
		show:function () {
            this.proSelectFor = '';
            $('#searchField0').focus();
            this.is_show = !this.is_show;
        }
	}
});

//获取产品资料表函数
function getInfoTable(vm,num,keyword){
	$.ajax({
		type:'POST',
		url:serverUrl+'search/form',
		datatype:'json',
		data:{
			key:oKey,
            user_id:token,
			type_code:'info',
			status_code:'enabled',
			keyword:keyword,
			num:num,
			category_id:vm.proSelectedId
		},
		success:function(data){
			if(data.status==100){
				vm.tableList = data.value;

				var Len = vm.tableList.length;
				for(var i = 0;i<Len;i++){
					Vue.set(vm.tableList[i],'checked',false);
				}

			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
				vm.tableList = '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求产品资料表失败');
		}
	})
}


//搜索类目框
$(function(){
	$('.searchBtn').on('click',function(){
		$('.searchCompent').show();
		$('#catename_alert').hide();
        $('#searchInput0').show();
	});
	$('.closeBtn').on('click',function(){
		$('.searchCompent').hide();
	})
});
searchListTog(0);
function searchListTog(num) {
    $('body').bind('click', function(event) {
        // IE支持 event.srcElement ， FF支持 event.target
        var evt = event.srcElement ? event.srcElement : event.target;
        if(evt.id == 'blurInput'+num|| evt.id == 'searchInput'+num||evt.id == 'searchField'+num||evt.id == 'searchBtn'+num) {
            $('#searchInput'+num).show();
        } // 如果是元素本身，则返回
        else {
            $('#searchInput'+num).hide(); // 如不是则隐藏元素
        }
    });
}

//搜索类目
/*$('.searchCate').on('keyup',function(){
	var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
	$('.pors .cate-list').css('width',getWidth);
	var searchCusVal = $('.searchCate').val();

	$.ajax({
		type:'POST',
		url:serverUrl+'vague/name',
		datatype:'json',
		data:{
			key:oKey,
            user_id:token,
			text:searchCusVal
		},
		success:function(data){
			var vm = tableCreat;

			if(data.status==100){
				vm.proList = data.value;
			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
				vm.proList= '';
			}
		},
		error:function(jqXHR){
			layer.msg('向服务器请求产品类目失败');
		}
	})
});*/

//搜索列表显示隐藏
/*
$('body').bind('click', function(event) {
    // IE支持 event.srcElement ， FF支持 event.target
    var evt = event.srcElement ? event.srcElement : event.target;
    if(evt.id == 'blurInput'|| evt.id == 'searchInput'||evt.id == 'searchField'||evt.id == 'btnsearch') return; // 如果是元素本身，则返回
    else {
        $('#searchInput').hide(); // 如不是则隐藏元素
    }
});*/
