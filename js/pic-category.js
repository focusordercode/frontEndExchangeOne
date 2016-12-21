/*
*┏━━━━┓
*┃◤    ◥┃
*┃  bug   ┃
*┃  stop  ┃
*┃  here  ┃
*┃        ┃
*┃ 巴  千 ┃
*┃ 格  行 ┃
*┃ 不  代 ┃
*┃ 沾  码 ┃
*┃ 身  过 ┃
*┃        ┃
*┃        ┃
*┃◣    ◢┃
*┗━━━━┛
*
*
*
*
*/

console.log(serverUrl); //后端接口地址
var oUrl = serverUrl;//图片服务器地址

//刷新函数
function windowFresh(){
	location.reload(true);
}

//查看信息组件
Vue.component('my-component', {
	template: '#picinfo',
	props:{
		data:Object
	}
})

//增加图片目录组件
Vue.component('my-additem', {
	template: '#addItem',
	props:{
		active:Object,
		pictreeActive:Object,
		cn_name:'',
		en_name:''
	},
	methods:{
		addpicItem:function(){
			//增加图片目录
			var item1 = picGallery.active;
			var item2 = picGallery.pictreeActive;
			var creator_id = cookie.get('id');
			var cn_name = this.cn_name;
			var en_name = this.en_name;
				en_name = $.trim(  en_name  );
			var rule = /^[a-zA-Z_0-9\s\'-]+$/;  //英文正则，包含数字
			if(!rule.test(en_name)){
				layer.msg('英文名只能是字母,数字，空格,横杠和单引号');
			}else if(!cn_name){
				layer.msg('中文名不能为空');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'post/imagesub',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
                		creator_id:creator_id,
						category_id:item1.id,
						id:item2.id,
						cn_name:cn_name,
						en_name:en_name
					},
					success:function(data){
						if(data.status==100){
							layer.msg('添加成功');
							setInterval(updatePictree(item1),1000);
							$('.addItem').modal('hide');
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
						layer.msg('向服务器请求添加失败');
					}
				})
			}
			//重新获取图片目录
			function updatePictree(item1){
				var cateId = item1.id;
				$.ajax({
					type:'POST',
					url:serverUrl+'get/treeGallery',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						category_id:cateId
					},
					success:function(data){
						if(data.status==100){
							picGallery.pictree = data.value[0];
						}else if(data.status==101){
							picGallery.pictree = data.value;
							picGallery.pictreeActive.id = '';
							picGallery.pictreeActive.cn_name = '';
							picGallery.pictreeActive.en_name = '';
							picGallery.pictreeActive.category_id = '';
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
						layer.msg('向服务器请求图片目录失败');
					}
				})
			}

		}
	}
})

// 产品分类树形菜单的组件
Vue.component('item', {
  template: '#item-template',
  props: {
	model: Object
  },
  data: function () {
	return {
	  open: false
	}
  },
  computed: {
	isFolder: function () {
	  return this.model.children &&
		this.model.children.length
	}
  },
  methods: {
	//点击产品树形分类
	toggle: function (model) {
		if (this.isFolder) {
			this.open = !this.open
		}

		//每次点击清空图片目录的选中的数据
		function clear(){
			picGallery.picData = '';
			picGallery.countImage = '';
			picGallery.countPage = '';
			picGallery.pictreeActive.id = '';
			picGallery.pictreeActive.cn_name = '';
			picGallery.pictreeActive.en_name = '';
			picGallery.pictreeActive.category_id = '';
		}

		clear();
		//每次点击清空图片目录的选中
		$('.tree2 .item .label').removeClass('label-success').addClass('label-primary');

		picGallery.active = model;

		//获取图片目录
		var cateId = model.id;
		if(cateId){
			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
			$.ajax({
				type:'POST',
				url:serverUrl+'get/treeGallery',
				datatype:'json',
				data:{
					key:oKey,
                	user_id:token,
					category_id:cateId
				},
				success:function(data){
					layer.close(LoadIndex); //关闭遮罩层
					if(data.status==100){
						picGallery.pictree = data.value[0];
					}else if(data.status==101){
						picGallery.pictree = data.value;
						clear();
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
					layer.close(LoadIndex); //关闭遮罩层
					layer.msg('向服务器请求图片目录失败');
				}
			})
		}
	}

  }
})

// 图片目录树形菜单的组件
Vue.component('tree', {
  template: '#pic-template',
  props:{
	pictree:Object
  },
  data: function () {
	return {
	  open: false
	}
  },
  computed: {
	isFolderP: function () {
	  return this.pictree.children &&
		this.pictree.children.length
	}
  },
  methods: {
	//点击图片目录
	toggle: function (pictree) {
	  if (this.isFolderP) {
		this.open = !this.open
	  }

	  //把当前的图片目录数据赋值到pictreeActive
	  picGallery.pictreeActive.id = pictree.id;
	  picGallery.pictreeActive.cn_name = pictree.cn_name;
	  picGallery.pictreeActive.en_name = pictree.en_name;
	  picGallery.pictreeActive.category_id = pictree.category_id;
	  //加载图片数据
	  var picId = pictree.id;
	  if(picId){
		$.ajax({
			type:'POST',
			url:serverUrl+'get/image',
			datatype:'json',
			data:{
				key:oKey,
                user_id:token,
				gallery_id:picId
			},
			success:function(data){
				if(data.status==100){
					picGallery.picData = data.value;
					picGallery.countPage = data.countPage;
					picGallery.countImage = data.countImage;
					picGallery.pageNow = data.pageNow;
					//给图片数据每个条目加上个checkbox属性
					var picData = picGallery.picData;
					var picDataLength = picData.length;
					var i = 0;
					for(i;i<picDataLength;i++){
						Vue.set(picGallery.picData[i], 'checked', false)
					}
				}else if(data.status==101){
					picGallery.picData = '';
					picGallery.countPage = '';
					picGallery.countImage = '';
					picGallery.pageNow = '';
				}else if(data.status==102){
					layer.msg('参数错误');
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
				layer.msg('向服务器请求图片失败');
			}
		})
	  }
	}
  }
})

// 产品树形菜单的Vue实例
var tree = new Vue({
	el: '#tree',
	data: {
	treeData: {}
  },
	ready:function(){
		//获取树形分类
		$.ajax({
			type:'POST',
			url:serverUrl+'get/treeCategory',
			datatype:'json',
			data:{
				key:oKey,
                user_id:token,
				ckey:'category'
			},
			success:function(data){
				tree.treeData = data;
				
				if(data.status==101){
					layer.msg(data.msg);
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
				layer.msg('向服务器请求产品目录失败');
			}
		})
  }
})

//暂存修改的数据
var cacheTitle;
var cacheTags;

//图片库示例
var picGallery = new Vue({
	el:'body',
	data:{
		active:{},//当前的产品类目
		picData:'',
		countPage:'',
		countImage:'',
		pageNow:'',
		onepic:{},//查看信息
		changepic:{},//修改图片信息
		newTags:'',//添加新的标签
		disabledp:'',
		disabledn:'',
		checkedBtn:{
			checked:false
		},
		delete:'', //删除按钮
		jumpPage:'',//跳转页面
		pictree:{
			warning: '没有图片目录'
		},
		pictreeActive:{ //当前的图片类目
			id:'',
			cn_name:'',
			en_name:'',
			category_id:''
		},
		changeData:'', //修改图片目录缓存
		imgcheck:[],//选中的图片
		aims_id:'',//移动图片的目标目录ID
		aimkey:'',//搜索目录的关键字
		aimlist:''//搜索出的目录列表
	},
	computed:{
		//控制分页按钮
		disabledp:function(){
			if(this.pageNow<=1){
				return true
			}else{
				return false
			}
		},
		disabledn:function(){
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
		//图片信息
		picinfo:function(pic){
			$('.picino').modal('show');
			$('.picino').css('margin-top','200px');
			picGallery.onepic = pic;
		},
		//查看图片大图
		showPic:function(pic){
			$('.show-pic').modal('show');
			picGallery.onepic = pic;
		},
		//图片信息修改
		picchange:function(pic){
			$('.picchange').modal('show');
			$('.picchange').css('margin-top','200px');
			picGallery.changepic = pic;
			//把数据暂存
			cacheTitle = pic.title;
			cacheTags = pic.tags.slice();
		},
		//回车添加标签
		addTags:function(){
			  var text = this.newTags.trim();
			  var changepic = this.changepic;
			  //检测标签是否有重复
			  var listLen = changepic.tags.length;
			  var sameArr = new Array();
			  for(var h = 0;h<listLen;h++){
				if(text==changepic.tags[h]){
					sameArr.push(changepic.tags[h]);
				}
			  }
			  
			  if (sameArr.length>0){
				  layer.msg('标签重复');
			   }else if(text){
					this.changepic.tags.push(text)
					this.newTags = ''
			   }
		},
		//批量添加标签
		addnumtags:function(){
			var vm = picGallery;
			var pic_ids = vm.imgcheck;
			var tag = vm.newTags;
			$.ajax({
				type:'POST',
				url:serverUrl+'add/tags',
				datatype:'json',
				data:{
					key:oKey,
                	user_id:token,
					pic_ids:pic_ids,
					tag:tag,
				},
				success:function(data){
					if (data.status==100) {
						layer.msg('添加成功');
						update();
						$('#addtags').modal('hide');
					}else if(data.status==1012){
	                    layer.msg('请先登录',{time:2000});

	                    setTimeout(function(){
	                        jumpLogin(loginUrl,NowUrl);
	                    },2000);
	                }else if(data.status==1011){
	                    layer.msg('权限不足,请跟管理员联系');
	                }else{
						layer.msg(data.msg)
					}
				},
				error:function(jqXHR){
					layer.msg('向服务器请求添加标签失败')
				}
			})
		},
		//删除标签
		removeTags:function(index){
			this.changepic.tags.splice(index, 1);
		},
		//保存图片修改
		saveChangePic:function(){
			var title = this.changepic.title;
			var changepic = this.changepic;
			if(!title){
				layer.msg('标题不能为空');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'update/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						data:changepic
					},
					success:function(data){
						if(data.status==100){
							layer.msg('修改成功');
							$('.picchange').modal('hide');
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
						layer.msg('向服务器请求保存修改失败');
					}
				})
			}
		},
		//关闭修改框，还原原来的值
		closeChange:function(){
			Vue.set(picGallery.changepic,'title',cacheTitle);
			Vue.set(picGallery.changepic,'tags',cacheTags);
			$('.picchange').modal('hide');
		},
		//删除图片
		deletePic:function(pic){
			var pic = pic;
			var picData = this.picData;
			layer.confirm('确定删除图片?',{
				btn:['确定','取消']
			},function(index){
				layer.close(index);
				$.ajax({
					type:'POST',
					url:serverUrl+'delete/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						id:pic.id
					},
					success:function(data){
						if(data.status==100){
							layer.msg('删除成功');
							update(pic);
						}else if(data.status==101){
							layer.msg('删除图片操作失败');
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
						layer.msg('向服务器请求删除失败');
					}
				})
			})
			//更新图片函数
			function update(pic){
				//显示加载按钮
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				//获取图片数据
				$.ajax({
					type:'POST',
					url:serverUrl+'get/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						gallery_id:pic.gallery_id,
						pageNum:picGallery.pageNow
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							picGallery.picData = data.value;
							picGallery.countPage = data.countPage;
							picGallery.countImage = data.countImage;
							picGallery.pageNow = data.pageNow;
							//给图片数据每个条目加上个checkbox属性
							var picData = picGallery.picData;
							var picDataLength = picData.length;
							var i = 0;
							for(i;i<picDataLength;i++){
								Vue.set(picGallery.picData[i], 'checked', false)
							}
						}else if(data.status==1012){
		                    layer.msg('请先登录',{time:2000});

		                    setTimeout(function(){
		                        jumpLogin(loginUrl,NowUrl);
		                    },2000);
		                }else if(data.status==1011){
		                    layer.msg('权限不足,请跟管理员联系');
		                }else{
							// layer.msg('没有获取到图片');  //没有图片不提示了
							picGallery.picData = '';
							picGallery.countPage = '';
							picGallery.countImage = '';
							picGallery.pageNow = '';
						}
					},
					error:function(jqXHR){
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求图片失败');
					}
				})
			}
		},
		//上一页
		preP:function(){
			//显示加载按钮
			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
			var page = this.pageNow;//当前的页码
			var allPage = this.countPage;
			var cateId = this.pictreeActive.id;//当前打开的相册,从active获取
			page--;
			if(page>allPage||!page){
				layer.close(LoadIndex); //关闭遮罩层
				layer.msg('没有上一页啦');
				page = this.pageNow;//当前的页码
			}else{
				//获取图片数据
				$.ajax({
					type:'POST',
					url:serverUrl+'get/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						gallery_id:cateId,
						pageNum:page
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							picGallery.picData = data.value;
							picGallery.countPage = data.countPage;
							picGallery.countImage = data.countImage;
							picGallery.pageNow = data.pageNow;
							//给图片数据每个条目加上个checkbox属性
							var picData = picGallery.picData;
							var picDataLength = picData.length;
							var i = 0;
							for(i;i<picDataLength;i++){
								Vue.set(picGallery.picData[i], 'checked', false)
							}
						}else if(data.status==101){
							// layer.msg('没有获取到图片');  //没有图片不提示了
						}else if(data.status==102){
							layer.msg('参数错误');
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
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求图片失败');
					}
				})   
			}
		},
		//下一页
		nextP:function(){
			//显示加载按钮
			var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
			var page = this.pageNow;//当前的页码
			var allPage = this.countPage;
			var cateId = this.pictreeActive.id;//当前打开的相册,从active获取
			page++;
			if(page>allPage||!page){
				layer.close(LoadIndex); //关闭遮罩层
				layer.msg('没有下一页啦');
				page = this.pageNow;//当前的页码
			}else{
				//获取图片数据
				$.ajax({
					type:'POST',
					url:serverUrl+'get/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						gallery_id:cateId,
						pageNum:page
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							picGallery.picData = data.value;
							picGallery.countPage = data.countPage;
							picGallery.countImage = data.countImage;
							picGallery.pageNow = data.pageNow;
							//给图片数据每个条目加上个checkbox属性
							var picData = picGallery.picData;
							var picDataLength = picData.length;
							var i = 0;
							for(i;i<picDataLength;i++){
								Vue.set(picGallery.picData[i], 'checked', false)
							}
						}else if(data.status==101){
							// layer.msg('没有获取到图片');  //没有图片不提示了
						}else if(data.status==102){
							layer.msg('参数错误');
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
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求图片失败');
					}
				})   
			}
		},
		//全选按钮
		selectAll:function(){
			var selectBtn = this.checkedBtn.checked;
			if(selectBtn==false){
				this.checkedBtn.checked = true;
				var picDataLength = picGallery.picData.length;
				for(var i = 0;i<picDataLength;i++){
					picGallery.picData[i].checked = true;
				}
			}else{
				this.checkedBtn.checked = false;
				var picDataLength = picGallery.picData.length;
				for(var i = 0;i<picDataLength;i++){
					picGallery.picData[i].checked = false;
				}
			}
		},
		//删除选中
		deleteSelet:function(){
			var picDataLength = this.picData.length;
			var checked = new Array();
			for(var i = 0;i<picDataLength;i++){
				if(this.picData[i].checked){
				   checked.push(this.picData[i].id);
				}
			}
			
			layer.confirm('确定删除选中的图片吗?',{
				btn:['确定','取消']
			},function(index){
				layer.close(index);
				$.ajax({
					type:'POST',
					url:serverUrl+'delete/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						id:checked
					},
					success:function(data){
						if(data.status==100){
							layer.msg('删除成功');
							update();
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==102){
							layer.msg('参数错误');
						}else if(data.status==103){
							layer.msg('图片已被使用，不能删除');
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
						layer.msg('向服务器请求删除图片失败');
					}
				})
			})
		},
		//获取目录列表
		searchaim:function(){
			var vm = this;
			var keyword = vm.aimkey;

			$.ajax({
				type:'POST',
				url:serverUrl+'vague/gallery',
				datatype:'json',
				data:{
					key:oKey,
                	user_id:token,
					keyword:keyword
				},
				success:function(data){
					if (data.status==100) {
						vm.aimlist = data.value;
					}else if(data.status==1012){
	                    layer.msg('请先登录',{time:2000});

	                    setTimeout(function(){
	                        jumpLogin(loginUrl,NowUrl);
	                    },2000);
	                }else if(data.status==1011){
	                    layer.msg('权限不足,请跟管理员联系');
	                }else{
						layer.msg(data.msg)
					}
				},
				error:function(jqXHR){
					layer.msg('向服务器请求目录失败')
				}	
			})
		},
		//选中图片
		imgSelet:function(){
			var picDataLength = this.picData.length;
			var checked = new Array();
			for(var i = 0;i<picDataLength;i++){
				if(this.picData[i].checked){
				   checked.push(this.picData[i].id);
				}
			}
			picGallery.imgcheck = checked;
		},
		//移动图片
		moveSelet:function(){
			var vm = this;
			var gallery_id = vm.aims_id;
			var pic_ids = vm.imgcheck;

			$.ajax({

				type:'POST',
				url:serverUrl+'move/image',
				datatype:'json',
				data:{
					key:oKey,
                	user_id:token,
					gallery_id:gallery_id,
					pic_ids:pic_ids
				},
				success:function(data){
					if (data.status == 100) {
						layer.msg('移动成功');
						update();
						$('#myModal').modal('hide');
					}else if(data.status==1012){
	                    layer.msg('请先登录',{time:2000});

	                    setTimeout(function(){
	                        jumpLogin(loginUrl,NowUrl);
	                    },2000);
	                }else if(data.status==1011){
	                    layer.msg('权限不足,请跟管理员联系');
	                }else{
						layer.msg(data.msg)
					}
				},
				error:function(){
					layer.msg('向服务器请求失败');
				}
			});
		},
		//跳转
		jumpTo:function(){
			var jumpPage = this.jumpPage;
			var allPage = this.countPage;
			var cateId = this.pictreeActive.id;//当前打开的相册,从active获取
			if(jumpPage>allPage){
				layer.msg('输入页数大于总页数',{time:1000});
				this.jumpPage = '';
			}else if(!jumpPage){
				layer.msg('请先输入要跳转的页码');
			}else{
				//显示加载按钮
				var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
				//获取图片数据
				$.ajax({
					type:'POST',
					url:serverUrl+'get/image',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						gallery_id:cateId,
						pageNum:jumpPage
					},
					success:function(data){
						layer.close(LoadIndex); //关闭遮罩层
						if(data.status==100){
							picGallery.picData = data.value;
							picGallery.countPage = data.countPage;
							picGallery.countImage = data.countImage;
							picGallery.pageNow = data.pageNow;
							picGallery.jumpPage = '';
							//给图片数据每个条目加上个checkbox属性
							var picData = picGallery.picData;
							var picDataLength = picData.length;
							var i = 0;
							for(i;i<picDataLength;i++){
								Vue.set(picGallery.picData[i], 'checked', false);
							}
						}else if(data.status==101){
							// layer.msg('没有获取到图片');  //没有图片不提示了
						}else if(data.status==102){
							layer.msg('参数错误');
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
						layer.close(LoadIndex); //关闭遮罩层
						layer.msg('向服务器请求图片失败');
					}
				});
			}
		},
		//增加图片目录
		addItem:function(){
			var item = this.active;
			$('.addItem').modal('show');
			$('.addItem').css('margin-top','200px');
		},
		//修改图片目录弹出框
		changeItem:function(){
			$('.changeItem').modal('show');
			$('.changeItem').css('margin-top','200px');
			//避开响应数据复制一个对象
			var cache = $.extend(true, {}, this.pictreeActive);
			this.changeData = cache;
		},
		//修改图片目录
		changeItemAction:function(){
			var item = this.changeData;

			//重新获取图片目录函数
			function updatePictree(item){
				var cateId = item.category_id;
				$.ajax({
					type:'POST',
					url:serverUrl+'get/treeGallery',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						category_id:cateId
					},
					success:function(data){
						if(data.status==100){
							picGallery.pictree = data.value[0];
						}else if(data.status==101){
							picGallery.pictree = data.value;
							picGallery.pictreeActive.id = '';
							picGallery.pictreeActive.cn_name = '';
							picGallery.pictreeActive.en_name = '';
							picGallery.pictreeActive.category_id = '';
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
						layer.msg('向服务器请求图片目录失败');
					}
				});
			}

			var en_name = $.trim(  item.en_name  );

			//修改图片目录
			var rule = /^[a-zA-Z_0-9\s\'-]+$/;  //英文正则，包含数字
			if(!rule.test(en_name)){
				layer.msg('英文名只能是字母,数字，空格,横杠和单引号');
			}else if(!item.cn_name){
				layer.msg('中文名不能为空');
			}else{
				$.ajax({
					type:'POST',
					url:serverUrl+'update/imagesub',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						id:item.id,
						cn_name:item.cn_name,
						en_name:en_name
					},
					success:function(data){
						if(data.status==100){
							layer.msg('修改成功',{time:1000});
							setInterval(updatePictree(item),1000);
							$('.changeItem').modal('hide');
						}else if(data.status==105){
							layer.msg('英文名不符合要求');
						}else if(data.status==106){
							layer.msg('目录英文名有重复');
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
						layer.msg('向服务器请求修改图片目录失败');
					}
				});
			}
		},
		//删除图片目录
		deleteItem:function(){
			var item = this.pictreeActive;
			layer.confirm('确认删除该目录?如果有子目录将不能删除',{
				btn:['确定','取消']
			},function(yes){
				$.ajax({
					type:'POST',
					url:serverUrl+'delete/imagesub',
					datatype:'json',
					data:{
						key:oKey,
                		user_id:token,
						id:item.id
					},
					success:function(data){
						if(data.status==100){
							layer.msg('删除成功');
							setInterval(windowFresh,1000);
							
						}else if(data.status==101){
							layer.msg('操作失败');
						}else if(data.status==113){
							layer.msg('该相册下还有子目录，请先删除子目录');
						}else if(data.status==114){
							layer.msg('删除图片移动到回收站失败');
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
						layer.msg('向服务器请求删除失败');
					}
				});
			});
		}
	}
});

//实时更新移动功能中的搜索框填入数据
$('.searchCate').on('keyup',function(){
	var vm = picGallery;
	var keyword = $('.searchCate').val();

	$.ajax({
		type:'POST',
		url:serverUrl+'vague/gallery',
		datatype:'json',
		data:{
			key:oKey,
            user_id:token,
			keyword:keyword
		},
		success:function(data){
			if (data.status==100) {
				vm.aimlist = data.value;
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
			layer.msg('向服务器请求目录失败');
		}	
	});
});
//更新图片函数
function update(){
	var vm = picGallery;
	var gallery_id = picGallery.pictreeActive.id;
	var pageNum = vm.pageNow;
	//显示加载按钮
	var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
	//获取图片数据
	$.ajax({
		type:'POST',
		url:serverUrl+'get/image',
		datatype:'json',
		data:{
			key:oKey,
            user_id:token,
			gallery_id:gallery_id,
			pageNum:pageNum
		},
		success:function(data){
			layer.close(LoadIndex); //关闭遮罩层
			if(data.status==100){
				picGallery.picData = data.value;
				picGallery.countPage = data.countPage;
				picGallery.countImage = data.countImage;
				picGallery.pageNow = data.pageNow;
				//给图片数据每个条目加上个checkbox属性
				var picData = picGallery.picData;
				var picDataLength = picData.length;
				var i = 0;
				for(i;i<picDataLength;i++){
					Vue.set(picGallery.picData[i], 'checked', false);
				}
			}else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
				// layer.msg('没有获取到图片');  //没有图片不提示了
				picGallery.picData = '';
				picGallery.countPage = '';
				picGallery.countImage = '';
				picGallery.pageNow = '';
			}
		},
		error:function(jqXHR){
			layer.close(LoadIndex); //关闭遮罩层
			layer.msg('向服务器请求图片失败');
		}
	});
}

//Vue过滤器
Vue.filter('upLink',function(value){
	var str = value;
	var strNew;
	if(str==1||!str){
		strNew = 'javascript:';
	}else{
		strNew = 'picUpload.html?id='+str;
	}
	return strNew
})
Vue.filter('imgUrl',function(value){
	var str = value;
	var file_name = value.file_name;
	var strLen = str.path.length;
	var strNew = str.path.substr(1,strLen-1);
	strNew = oUrl + strNew + '/'+file_name;
	return strNew
})
Vue.filter('sizeCounter',function(value){
	var str = value;
	str = Math.round(str/1024) + 'kb';
	return str
})


//监听picData数组的变化，改变全选按钮状态,deep监听对象内部值的变化
picGallery.$watch('picData', function (data) {
	var picDataLength = data.length;
	var checked = new Array();
	for(var i = 0;i<picDataLength;i++){
		if(data[i].checked){
		   checked.push(data[i].id);
		}
	}
	if(checked.length==picDataLength){
		picGallery.checkedBtn.checked = true;
	}else if(checked.length<picDataLength){
		picGallery.checkedBtn.checked = false;
	}
	//控制删除按钮
	if(checked.length<=0){
		picGallery.delete = true;
	}else{
		picGallery.delete = false;//点亮按钮
	}
},{
	deep: true
})

//点击产品树形菜单
$(document).on('click','#tree .item .label',function(){
	$('#tree .item .label').removeClass('label-success').addClass('label-primary');
	$(this).removeClass('label-primary').addClass('label-success');
});

//点击图片目录树形菜单
$(document).on('click','.tree2 .item .label',function(){
	$('.tree2 .item .label').removeClass('label-success').addClass('label-primary');
	$(this).removeClass('label-primary').addClass('label-success');
});

$(document).ready(function(){
    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
});