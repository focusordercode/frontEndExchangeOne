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
var tableID = Request.id;
var type_code = 'batch';
console.log(serverUrl); //后端接口地址
var oUrl = serverUrl;//图片服务器地址
var ProgressLen = 0;
//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

var uploadPic = new Vue({
    el:'body',
    data:{
        info:'',//表格数据
        picData:'',//图片数据
        success_count:0, //成功上传个数,默认为0
        again:[] //单独重新上传的数据
    },
    ready:function(){
        //获取图片
        $.ajax({
            type:'POST',
            url:serverUrl+'ready/uploadImages',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                form_id:tableID 
            },
            success:function(data){
                if(data.status==100){
                    uploadPic.picData = data.value;
                    uploadPic.count = data.count;
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
                    uploadPic.picData = '';
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求图片失败');
            }
        })

        //获取表格信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/oneform',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                id:tableID,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    uploadPic.info = data.value[0];
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
                layer.msg('向服务器获取表格信息失败');
            }
        })
    },
    computed:{
        //预览表格按钮
        uploadDoneStatus:function () {
            var vm = this;
            var Len = vm.picData.length;
            var result = Len - vm.success_count;//全部上传成功
            if(Len&&result==0){
                return true  //全部上传成功
            }else{
                return false
            }
        }
    },
    methods:{
        //删除数据
        removeLsit:function(list){
            var vm = this;
            layer.msg('删除成功',{time:1000});
            vm.picData.$remove(list);
        },
        //开始上传
        startUpload:function(){
            var vm = this;
            var picCount = vm.picData.length;
            var form_id = parseInt(vm.info.id);
            if(picCount && form_id){
                layer.confirm('上传图片到外网服务器需要5-6分钟(取决于网速和图片大小)',function(index){
                    layer.close(index);
                    //查询进度
                    var ProgressLen = 0;
                    var num1 = 0;
                    var progressbar = $('.progress-bar');
                    //设定循环获取进度函数
                    var timeid = setInterval(function(){
                        //手动进度条
                        num1 = Math.round(150/picCount);
                        ProgressLen += num1;
                        if (ProgressLen >= 96) {
                            ProgressLen = 96
                        }
                        progressbar.css('width',ProgressLen + "%");
                        progressbar.text(ProgressLen + "%");
                        //自动获取进度条
                        // $.ajax({
                        //     type:'POST',
                        //     url:serverUrl+'get/progress',
                        //     datatype:'json',
                        //     data:{
                        //         key:oKey,
                        //         user_id:token,
                        //         form_id:form_id
                        //     },
                        //     success:function(data){
                        //         if(data.status==100){
                        //             var progress = data.progress;
                        //             if(progress){
                        //                 progressbar.css('width',progress);
                        //                 progressbar.text(progress);
                        //             }
                        //         }else if(data.status==1012){
                        //             layer.msg('请先登录',{time:2000});
                        //             $(window).unbind('beforeunload');
                        //             setTimeout(function(){
                        //                 jumpLogin(loginUrl,NowUrl);
                        //             },2000);
                        //         }else if(data.status==1011){
                        //             layer.msg('权限不足,请跟管理员联系');
                        //         }else{
                        //             layer.msg('未知错误');
                        //             //解绑页面提示
                        //             $(window).unbind('beforeunload');
                        //             setInterval(windowFresh,1000);
                        //         }
                        //     },
                        //     error:function(jqXHR){
                        //         layer.msg('向服务器请求进度失败');
                        //     }
                        // })
                    },3000);

                    $('.progress-display').show();//开启遮罩层

                    $.ajax({
                        type:'POST',
                        url:serverUrl+'upload/pic',
                        datatype:'json',
                        data:{
                            key:oKey,
                            user_id:token,
                            form_id:form_id,
                            picCount:picCount,
                            picArr:vm.picData
                        },
                        success:function(data){
                            window.clearInterval(timeid);//停止执行
                            $('.progress-display').hide();//关闭遮罩层
                            ProgressLen = 0;
                            progressbar.css('width',0);//还原进度条
                            progressbar.text('0.00');
                            if(data.status==100){
                                vm.picData = data.value;
                                layer.msg('操作成功');
                                //更新上传结果
                                var arr = vm.picData;
                                vm.success_count = countPic(arr);
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
                            window.clearInterval(timeid);//停止执行
                            $('.progress-display').hide();//关闭遮罩层
                            progressbar.css('width',0);//还原进度条
                            progressbar.text('0.00');
                            layer.msg('向服务器请求上传图片失败');
                        }
                    })
                })
            }else{
                layer.msg('没有检测到图片数据和表格信息');
            }
        },
        //重新上传
        uploadagain:function(index,list){
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            var vm= this;
            var lis = index;  //当前选择的序号
            var arr = vm.picData;
            vm.again.push(list);  //把当前的选择放入数组内
            var form_id = parseInt(vm.info.id);
            $.ajax({
                type:'POST',
                url:serverUrl+'upload/pic',
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    form_id:form_id,
                    picCount:1,
                    picArr:vm.again
                },
                success:function(data){
                    layer.close(LoadIndex); //关闭遮罩层
                    vm.again = [];
                    if (data.status == 100) {
                        vm.picData.$remove(list);  //先移除当前的选择
                        vm.picData.splice(lis,0,data.value[0]);  //把新的数据填入到原来的位置
                        vm.success_count = countPic(arr);  //重新计算上传成功的数量
                        layer.msg("上传成功")
                    }else if (data.status == 101) {
                        layer.msg("上传失败，请重新上传")
                    }
                },
                error:function(jqXHR){
                    layer.close(LoadIndex); //关闭遮罩层
                    layer.msg("链接服务器失败")
                }
            })
        },
        //上传已经成功上传的图片数据给后端
        uploadDone:function(){
            var vm = this;
            var Len = vm.picData.length;
            var result = Len - vm.success_count; //全部上传成功
            //通过判断表格中是否有图片地址判断上传成功
            if(Len&&result==0){
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                //上传已经成功上传的图片数据给后端
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/completeInfo',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        form_id:tableID,
                        picCount:vm.picData.length,
                        picArr:vm.picData
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            //解绑页面提示
                            $(window).unbind('beforeunload');

                            var template_id = vm.info.template_id;
                            //跳转函数
                            function goNext() {
                                var url = 'batch-table-done.html';
                                window.location.href = url+'?id='+tableID+'&template_id='+template_id;
                            }

                            setInterval(goNext,1000);

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
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }else{
                layer.msg('图片没有上传成功');
            }
        },
        //返回上一步
        takeBack:function(){
            var vm = this;
            layer.confirm('返回上一步?',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                $.ajax({
                    type:'POST',
                    url:serverUrl+'back',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        form_id:tableID,
                        type_code:type_code
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('请求成功');
                            
                            //解绑页面提示
                            $(window).unbind('beforeunload');

                            var template_id = vm.info.template_id;

                            //跳转函数
                            function goNext1() {
                                var url = 'batch-table-edit.html';
                                window.location.href = url+'?id='+tableID+'&template_id='+template_id;
                            }
                            if(template_id&&tableID){
                                setInterval(goNext1,1000);
                            }
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
                        layer.msg('向服务器请求撤销返回失败');
                    }
                })
            })
        }
    }
})

//计算成功上传个数函数
function countPic(arr) {
    var a = 0;
    for(var i = 0;i<arr.length;i++){
        if(arr[i].status_msg == 'success'){
            a ++;
        }
    }
    return a
}

//刷新函数
function windowFresh(){
    location.reload(true);
}

Vue.filter('sizeCounter',function(value){
    var str = value;
    str = Math.round(str/1024) + 'kb';
    return str
})

$(function(){
    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
})