//刷新函数
function windowFresh(){
    location.reload(true);
}

console.log(serverUrl); //后端接口地址
var oUrl = serverUrl;//图片服务器地址

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
        jumpPage:'',
        onepic:{},
        disabledp:'',
        disabledn:'',
        checkedBtn:{
            checked:false
        },
        keyword:'',
        recoverList:'',
        recoverId:'',
        delete:''
    },
    ready:function(){
        //显示加载按钮
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        //获取回收站图片数据
        $.ajax({
            type:'POST',
            url:serverUrl+'get/image',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                rubbish:1
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
                    layer.msg('没有获取到图片,回收站没有图片');  //没有图片不提示了
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
            $('.show-info').modal('show');
            $('.show-info').css('margin-top','200px');
            picGallery.onepic = pic;
        },
        //查看图片大图
        showPic:function(pic){
            $('.show-pic').modal('show');
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
                    url:serverUrl+'delete/image',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        id:pic.id,
                        delete_type:2 //传个1以外的值彻底删除图片
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('删除成功');
                            update(pic);
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
                    url:serverUrl+'get/image',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
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
        //跳转
        jumpTo:function(){
            var jumpPage = this.jumpPage;
            var allPage = this.countPage;
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
                        rubbish:1,
                        pageNum:jumpPage
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            picGallery.jumpPage = '';
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
        //搜索分类选中分类
        selectList:function(list){
            picGallery.recoverId = list.id;
            picGallery.keyword = list.cn_name;
            picGallery.recoverList = '';
        },
        //恢复图片到指定类目
        recover:function(){
            var gallery_id = picGallery.recoverId;
            var picArray = new Array();//恢复分类的图片id数组
            var picDataLength = picGallery.picData.length;
            for(var i = 0;i<picDataLength;i++){
                if(picGallery.picData[i].checked){
                   picArray.push(picGallery.picData[i].id);
                }
            }
            if(!gallery_id){
                layer.msg('请先选择要恢复的目录');
            }else if(picArray.length==0){
                layer.msg('请先选择要恢复的图片');
            }else{
                //恢复图片到分类
                $.ajax({
                    type:'POST',
                    url:serverUrl+'recover/image',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        id:picArray,
                        gallery_id:gallery_id
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('恢复成功');
                            setInterval(windowFresh,1000);
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
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
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
                    url:serverUrl+'delete/image',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        id:checked,
                        delete_type:2  //传1以外的参数删除图片
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('删除成功');
                            setInterval(windowFresh,1000);
                        }else if(data.status==101){
                            layer.msg('操作失败');
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
                        layer.msg('向服务器请求删除图片失败');
                    }
                })
            })
        },
        //清空回收站
        clearAll:function(){
            layer.confirm('确定清空回收站?此操作不可恢复',{
                btn:['确定','取消']
            },function(){
                $.ajax({
                    type:'POST',
                    url:serverUrl+'clear/image',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('操作成功');
                            setInterval(windowFresh,1000);
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
                    error:function(jqXHR){}
                })
            })
        }
    }
})


$(document).on('keyup','.pors .form-control',function(){
    var inputWidth = $('.pors .form-control').innerWidth();
    $('.pors .list-group').css('width',inputWidth);
    $.ajax({
        type:'POST',
        url:serverUrl+'vague/gallery',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            keyword:picGallery.keyword
        },
        success:function(data){
            if(data.status){
                picGallery.recoverList = data.value;
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
            layer.msg('向服务器请求模糊搜索相册类目失败');
        }
    })
});

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

//观察搜索框的变化，控制是否有分类
picGallery.$watch('keyword', function (val) {
    if(!val){
       picGallery.recoverId = ''; 
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