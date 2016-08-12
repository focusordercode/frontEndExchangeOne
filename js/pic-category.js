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
            var cn_name = this.cn_name;
            var en_name = this.en_name;
            var rule = /^[A-Za-z0-9]+$/;  //英文正则，包含数字
            if(rule.test(en_name)){
                layer.msg('请输入正确的英文名');
            }else if(!cn_name){
                layer.msg('中文名不能为空');
            }else{
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/post/imagesub',
                    datatype:'json',
                    data:{
                        category_id:item1.id,
                        id:item2.id,
                        cn_name:cn_name,
                        en_name:en_name
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('添加成功');
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求添加失败');
                    }
                })
            }
        }
    }
})

//修改图片目录组件
Vue.component('my-changeitem', {
    template: '#changeItem',
    props:{
        active:Object
    }
})

//修改信息组件
// Vue.component('my-xg', {
//     template: '#picxg',
//     props:{
//         data:Array
//     }
// })

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
    toggle: function (model) {
        if (this.isFolder) {
            this.open = !this.open
        }
        picGallery.active = model;

        //获取图片目录
        var cateId = model.id;
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/treeGallery',
            datatype:'json',
            data:{
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
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求图片目录失败');
            }
        })
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
    toggle: function (pictree) {
      if (this.isFolderP) {
        this.open = !this.open
      }
      // alert(pictree.id);
      // alert(pictree.cn_name);
      // alert(pictree.en_name);
      picGallery.pictreeActive.id = pictree.id;
      picGallery.pictreeActive.cn_name = pictree.cn_name;
      picGallery.pictreeActive.en_name = pictree.en_name;
      picGallery.pictreeActive.category_id = pictree.category_id;
      //加载图片数据
      var picId = pictree.id;
      if(picId){
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/image',
            datatype:'json',
            data:{
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

// 树形菜单的Vue实例
var tree = new Vue({
    el: '#tree',
    data: {
    treeData: {}
  },
    ready:function(){
        //获取树形分类
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/treeCategory',
            datatype:'json',
            success:function(data){
                tree.treeData = data;
            },
            error:function(jqXHR){
                layer.msg('向服务器请求产品目录失败');
            }
        })
  }
})


var picGallery = new Vue({
    el:'body',
    data:{
        active:{},
        picData:'',
        countPage:'',
        countImage:'',
        pageNow:'',
        onepic:{},//查看信息
        disabledp:'',
        disabledn:false,
        checkedBtn:{
            checked:false
        },
        delete:'', //删除按钮
        jumpPage:'',//跳转页面
        pictree:{
            warning: '没有图片目录'
        },
        pictreeActive:{
            id:'',
            cn_name:'',
            en_name:'',
            category_id:''
        }
    },
    methods:{
        //删除相册
        remove:function(item){
            var item = item;
            picList = this.picList;
            layer.confirm('确认删除该相册?如果有子相册将不能删除',{
                btn:['确定','取消']
            },function(yes){
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/delete/imagesub',
                    datatype:'json',
                    data:{
                        id:item.id
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('删除成功');
                            picList.$remove(item);
                        }else if(data.status==101){
                            layer.msg('操作失败');
                        }else if(data.status==113){
                            layer.msg('该相册下还有子相册，请先删除子相册');
                        }else if(data.status==114){
                            layer.msg('删除图片移动到回收站失败');
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求删除失败');
                    }
                })
            })
        },
        //图片信息
        picinfo:function(pic){
            $('.picino').modal('show');
            $('.picino').css('margin-top','200px');
            picGallery.onepic = pic;
        },
        //删除图片
        deletePic:function(pic){
            var pic = pic;
            var picData = this.picData;
            layer.confirm('确定删除图片?',{
                btn:['确定','取消']
            },function(){
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/delete/image',
                    datatype:'json',
                    data:{
                        id:pic.id
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('删除成功');
                            update(pic);
                        }else if(data.status==101){
                            layer.msg('删除图片操作失败');
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
                    url:'http://192.168.1.40/PicSystem/canton/get/image',
                    datatype:'json',
                    data:{
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
                        }else if(data.status==101){
                            // layer.msg('没有获取到图片');  //没有图片不提示了
                            picGallery.picData = '';
                        }else if(data.status==102){
                            layer.msg('参数错误');
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
                    url:'http://192.168.1.40/PicSystem/canton/get/image',
                    datatype:'json',
                    data:{
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
                    url:'http://192.168.1.40/PicSystem/canton/get/image',
                    datatype:'json',
                    data:{
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
            },function(){
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/delete/image',
                    datatype:'json',
                    data:{
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
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求删除图片失败');
                    }
                })
            })

            //更新图片函数
            function update(){
                var gallery_id = picGallery.pictreeActive.id;
                //显示加载按钮
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                //获取图片数据
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/image',
                    datatype:'json',
                    data:{
                        gallery_id:gallery_id
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
                            picGallery.picData = '';
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求图片失败');
                    }
                })
            }
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
                    url:'http://192.168.1.40/PicSystem/canton/get/image',
                    datatype:'json',
                    data:{
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
                                Vue.set(picGallery.picData[i], 'checked', false)
                            }
                        }else if(data.status==101){
                            // layer.msg('没有获取到图片');  //没有图片不提示了
                        }else if(data.status==102){
                            layer.msg('参数错误');
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求图片失败');
                    }
                })
            }
        },
        //增加图片目录
        addItem:function(){
            var item = this.active;
            $('.addItem').modal('show');
            $('.addItem').css('margin-top','200px');
        },
        //修改图片目录
        changeItem:function(){
            var item = this.active;
            $('.changeItem').modal('show');
            $('.changeItem').css('margin-top','200px');
        },
        //删除图片目录
        deleteItem:function(){
            var item = this.active;
            if(item.id==1){
                layer.msg('顶级图片目录不可以删除');
            }else{
                // layer.msg('改造中...');
            }
        }
    }
})


var oUrl = 'http://192.168.1.40/PicSystem/canton';//图片服务器地址
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

//观察当前页的数据变化，控制前后页是否可用
picGallery.$watch('pageNow', function (val) {
    if(this.pageNow<=1){
        this.disabledp = true;
        this.disabledn = false;
    }else{
        this.disabledp = false;
    }
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