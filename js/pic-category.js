var num = 1; //全选的开关

//查看信息组件
Vue.component('my-component', {
    template: '#picinfo',
    props:{
        data:Object
    }
})

//修改信息组件
// Vue.component('my-xg', {
//     template: '#picxg',
//     props:{
//         data:Array
//     }
// })

var picGallery = new Vue({
    el:'body',
    data:{
        picList:'',
        breadcrumb:'',
        active:'',
        picData:'',
        countPage:'',
        countImage:'',
        pageNow:'',
        onepic:{},
        disabledp:'',
        disabledn:false,
        checkedBtn:{
            checked:false
        }
    },
    ready:function(){
        //获取初始相册
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/imagesub',
            datatype:'json',
            data:{
                id:1
            },
            success:function(data){
                if(data.status==100){
                    picGallery.picList = data.value;
                }else if(data.status==101){
                    layer.msg('暂无相册');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求获取相册信息失败');
            }
        })
        //初始面包屑获取上级分类
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/imagepath',
            datatype:'json',
            data:{
                id:1
            },
            success:function(data){
                if(data.status==100){
                    picGallery.breadcrumb = data.value;
                }else if(data.status==101){
                    layer.msg('操作失败');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求相册失败(面包屑)');
            }
        })
        //初始面包学当前分类
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/imagegallery',
            datatype:'json',
            data:{
                id:1
            },
            success:function(data){
                if(data.status==100){
                    picGallery.active = data.value[0];
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求相册信息失败');
            }
        })
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
        //点击相册
        loadCate:function(item){
            var item = item;

            //显示加载按钮
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            //点击获取下级分类
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/PicSystem/canton/get/imagesub',
                datatype:'json',
                data:{
                    id:item.id
                },
                success:function(data){
                    if(data.status==100){
                        picGallery.picList = data.value;
                        breadcrumb(item);
                    }else if(data.status==101){
                        layer.msg('没有子类啦',{time:1000});
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求相册失败');
                }
            })
            //面包屑数据更新的函数
            function breadcrumb(item){
                //获取所有上级分类(面包屑用)
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/imagepath',
                    datatype:'json',
                    data:{
                        id:item.id
                    },
                    success:function(data){
                        if(data.status==100){
                            picGallery.breadcrumb = data.value;
                        }else if(data.status==101){
                            layer.msg('操作失败(获取上级分类)');
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求相册失败(面包屑)');
                    }
                })
                //面包屑当前分类
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/get/imagegallery',
                    datatype:'json',
                    data:{
                        id:item.id
                    },
                    success:function(data){
                        if(data.status==100){
                            picGallery.active = data.value[0];
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求相册信息失败');
                    }
                })
            }

            //获取图片数据
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/PicSystem/canton/get/image',
                datatype:'json',
                data:{
                    gallery_id:item.id
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
                            picData[i].checked = false;
                        }
                        picGallery.picData = picData;
                    }else if(data.status==101){
                        // layer.msg('没有获取到图片');  //没有图片不提示了
                        picGallery.picData = '';
                        picGallery.countPage = '';
                        picGallery.countImage = '';
                        picGallery.pageNow = '';
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
        //点击面包屑
        loadThis:function(list){
            var list = list;
            //显示加载按钮
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            //点击获取相册下级分类
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/PicSystem/canton/get/imagesub',
                datatype:'json',
                data:{
                    id:list.id
                },
                success:function(data){
                    if(data.status==100){
                        picGallery.picList = data.value;
                    }else if(data.status==101){
                        layer.msg('操作失败');
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求相册失败(面包屑)');
                }
            })
            //获取所有上级分类(面包屑)
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/PicSystem/canton/get/imagepath',
                datatype:'json',
                data:{
                    id:list.id
                },
                success:function(data){
                    if(data.status==100){
                        picGallery.breadcrumb = data.value;
                    }else if(data.status==101){
                        layer.msg('操作失败(获取上级分类)');
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求相册失败(面包屑)');
                }
            })
            //面包屑当前分类
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/PicSystem/canton/get/imagegallery',
                datatype:'json',
                data:{
                    id:list.id
                },
                success:function(data){
                    if(data.status==100){
                        picGallery.active = data.value[0];
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求相册信息失败');
                }
            })
            //获取图片数据
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/PicSystem/canton/get/image',
                datatype:'json',
                data:{
                    gallery_id:list.id
                },
                success:function(data){
                    layer.close(LoadIndex); //关闭遮罩层
                    if(data.status==100){
                        picGallery.picData = data.value;
                        picGallery.countPage = data.countPage;
                        picGallery.countImage = data.countImage;
                        picGallery.pageNow = data.pageNow;
                    }else if(data.status==101){
                        // layer.msg('没有获取到图片');
                        picGallery.picData = '';
                        picGallery.countPage = '';
                        picGallery.countImage = '';
                        picGallery.pageNow = '';
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
            var cateId = this.active.id;//当前打开的相册,从active获取
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
            var cateId = this.active.id;//当前打开的相册,从active获取
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
            //全选开关,num是全局变量
            if(num==1){
                this.checkedBtn.checked = true;
                num = 2;
            }else{
                this.checkedBtn.checked = false;
                num = 1;
            }
            //
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