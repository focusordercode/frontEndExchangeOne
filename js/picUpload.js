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

//拉取类目
var picUpload = new Vue({
    el:'body',
    data:{
        picCate:''
    },
    ready:function(){
        $.ajax({
            type:'POST',
            url:'http://192.168.1.40/PicSystem/canton/get/imagegallery',
            datatype:'json',
            data:{
                id:Request.id
            },
            success:function(data){
                if(data.status==100){
                    picUpload.picCate = data.value[0];
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求相册信息失败');
            }
        })
    },
    methods:{
        unbind:function(){
            $(window).unbind('beforeunload');
        }
    }
})



$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

//图片数量
var len = 50;
//上传功能
var uploader = new plupload.Uploader({
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : 'pickfiles', 
    container: document.getElementById('container'), 
    url : 'http://192.168.1.40/PicSystem/canton/Picture/upload/gallery_id/'+Request.id,
    flash_swf_url : 'js/Moxie.swf',
    silverlight_xap_url : 'js/Moxie.xap',
    
    filters : {
        max_file_size : '5mb',
        mime_types: [
            {title : "Image files", extensions : "jpg,jpeg,gif,png"},
            {title : "Zip files", extensions : "zip"}
        ]
    },

    init: {
        PostInit: function() {
            $('.panel-body .alert').hide();
            document.getElementById('uploadfiles').onclick = function() {
                if(!(Request.id)){
                    layer.msg('上传没有找到分类，请先选择分类');
                }else{
                    uploader.start();
                }
                
                //return false;
            };
        },

        FilesAdded: function(up, files) {
            plupload.each(files, function(file) {
                document.getElementById('filelist').innerHTML += '<li class="list-group-item list-group-item-warning" id="' + file.id + '">' + file.name + '(' + plupload.formatSize(file.size) + ') <b></b></li>';
            });
            //更新已经选择图片的函数
            function updateLen() {
                var countLen = len - files.length;
                document.getElementById('seletedLen').getElementsByTagName('b')[0].innerHTML = '还可以选择'+countLen+'张图片';
            }
            updateLen();

            //检测图片数量是否超出
            if(files.length > len){
                alert('上传数量超载！');
                $(window).unbind('beforeunload');
                location.reload(true);
            }
        },

        UploadProgress: function(up, file) {
            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
        },

        Error: function(up, err) {
            document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
        },
        UploadComplete: function (uploader,files){
            //解绑页面离开提示
            $(window).unbind('beforeunload');

            var str = "上传成功 "+files.length+" 张图片。";
            layer.confirm(str+'去编辑上传成功图片信息',{
                btn:['确定','取消']
            },function(yes){
                var url = 'picUpload-edit.html?id='+files.length+'&cate='+Request.id;
                window.open(url);
                location.reload(true);
            },function(cancel){
                location.reload(true);
            })
        }
    }
});

uploader.init();