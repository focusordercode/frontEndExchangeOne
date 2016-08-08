
//查看信息组件
Vue.component('my-component', {
    template: '#picinfo',
    props:{
        data:Object
    }
})

var picGallery = new Vue({
    el:'body',
    data:{
        picData:'',
        countPage:'',
        countImage:'',
        pageNow:'',
        onepic:{},
        disabledp:'',
        disabledn:''
    },
    ready:function(){
        //显示加载按钮
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        //获取回收站图片数据
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/image',
            datatype:'json',
            data:{
                rubbish:1
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    picGallery.picData = data.value;
                    picGallery.countPage = data.countPage;
                    picGallery.countImage = data.countImage;
                    picGallery.pageNow = data.pageNow;
                }else if(data.status==101){
                    layer.msg('没有获取到图片');  //没有图片不提示了
                }else if(data.status==102){
                    layer.msg('参数错误');
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求图片失败');
            }
        })
    },
    methods:{
        //图片信息
        picinfo:function(pic){
            $('.modal').modal('show');
            $('.modal').css('margin-top','200px');
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
                        id:pic.id,
                        delete_type:2 //传个1以外的值彻底删除图片
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
                        rubbish:1,
                        pageNum:picGallery.pageNow
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            picGallery.picData = data.value;
                            picGallery.countPage = data.countPage;
                            picGallery.countImage = data.countImage;
                            picGallery.pageNow = data.pageNow;
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
        //上一页
        preP:function(){
            //显示加载按钮
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            var page = this.pageNow;//当前的页码
            var allPage = this.countPage;
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
                        rubbish:1,
                        pageNum:page
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            picGallery.picData = data.value;
                            picGallery.countPage = data.countPage;
                            picGallery.countImage = data.countImage;
                            picGallery.pageNow = data.pageNow;
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
            debugger
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
                        rubbish:1,
                        pageNum:page
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            picGallery.picData = data.value;
                            picGallery.countPage = data.countPage;
                            picGallery.countImage = data.countImage;
                            picGallery.pageNow = data.pageNow;
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