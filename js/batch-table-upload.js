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

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址1
var serverUrl2 = "http://192.168.1.40/PicSystem/canton/"; //后端接口地址2

//未提交保存内容提示
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

var uploadPic = new Vue({
    el:'body',
    data:{
        info:'',
        picData:'',
        count:'',
        version_id:'',
        uploadDoneStatus:'',
        success:'',
        error:''
    },
    ready:function(){
        //获取上一步骤筛选的图片
        // $.ajax({
        //     type:'POST',
        //     url:serverUrl+'Picture/get_cache_pic',
        //     datatype:'json',
        //     data:{
        //         key:'oD~8dyxGS9Az',
        //         rand_id:Request.rand_id
        //     },
        //     success:function(data){
        //         if(data.status==100){
        //             uploadPic.picData = data.value;
        //             uploadPic.count = data.count;
        //         }else{
        //             layer.msg(data.msg);
        //             uploadPic.picData = '';
        //             uploadPic.count = '';
        //         }
        //     },
        //     error:function(jqXHR){
        //         layer.msg('向服务器请求筛选成功的图片失败');
        //     }
        // })

        //获取图片
        $.ajax({
            type:'POST',
            url:serverUrl+'ready/uploadImages',
            datatype:'json',
            data:{
                form_id:2 
            },
            success:function(data){
                if(data.status==100){
                    uploadPic.picData = data.value;
                    uploadPic.count = data.count;
                }else{
                    layer.msg(data.msg);
                    uploadPic.picData = '';
                    uploadPic.count = '';
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求筛选成功的图片失败');
            }
        })

        //获取表格信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/oneform',
            datatype:'json',
            data:{
                id:tableID,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    uploadPic.info = data.value[0];
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
        error:function(){
            var allPic = this.picData.length;
            var success = this.success;
            return allPic - success;
        },
        //预览表格按钮
        uploadDoneStatus:function () {
            var picData = this.picData;
            var picLen = this.picData.length;
            var successArr = [];
            for (var i = 0;i<picLen;i++) {
                if (picData[i].status_msg) {
                    successArr.push(1);
                }
            }
            if (successArr.length==picLen) {
                return true //全部成功
            }else{
                return false
            }
        }
    },
    methods:{
        //删除数据
        removeLsit:function(list){
            uploadPic.picData.$remove(list);
        },
        //获取版本号
        getReady:function(){
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            //获取版本号
            $.ajax({
                type:'POST',
                url:'http://120.25.228.115/ImagesUpload/Index.php/Home/Index/version',
                datatype:'json',
                data:{
                    key:'1818d506396d77b3d035f719885c4cd1',
                },
                success:function(data){
                    layer.close(LoadIndex); //关闭遮罩层
                    if(data.status==100){
                        uploadPic.version_id = data.version;
                    }else{
                        layer.msg(data.msg);
                    }
                },
                error:function(jqXHR){
                    layer.close(LoadIndex); //关闭遮罩层
                    layer.msg('向图片服务器请求版本失败');
                }
            })
        },
        //开始上传
        startUpload:function(){
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            //开始上传
            var vm = this;
            var version_id = vm.version_id;
            var picArr = vm.picData;
            var prorate = Request.pro_rate;
            var picrate = Request.pic_rate;

            if(!version_id){
                layer.msg('没有获取到图片服务器版本号不能上传');
            }else{
                $.ajax({
                    type:'POST',
                    url:'http://120.25.228.115/ImagesUpload/index.php/Home/Index/php_upload',
                    // url:'http://www.sayshun.cc/ImagesUpload/index.php/Home/Index/php_upload',
                    datatype:'json',
                    data:{
                        picCount:picArr.length,
                        information_id:tableID,
                        version_id:version_id,
                        prorate:prorate,
                        picrate:picrate,
                        picArr:picArr
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            vm.picData = data.value;
                            vm.success = data.success;
                            vm.status_msg = data.status_msg;
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求上传图片失败');
                    }
                })
            }
        },
        //上传已经成功上传的图片数据给后端
        uploadDone:function(){
            //通过判断表格中是否有图片地址判断上传成功
            if(!this.uploadDoneStatus){
                layer.msg('图片没有上传成功');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                var vm = uploadPic;

                //上传已经成功上传的图片数据给后端
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/completeInfo',
                    datatype:'json',
                    data:{
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
        //返回上一步
        takeBack:function(){
            var vm = this;
            layer.confirm('返回上一步，此步骤的数据将不保存,上一步骤的数据也将被删除',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                $.ajax({
                    type:'POST',
                    url:serverUrl+'back',
                    datatype:'json',
                    data:{
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
                            function goNext() {
                                var url = 'batch-table-edit.html';
                                window.location.href = url+'?id='+tableID+'&template_id='+template_id;
                            }

                            setInterval(goNext,1000);

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

Vue.filter('sizeCounter',function(value){
    var str = value;
    str = Math.round(str/1024) + 'kb';
    return str
})