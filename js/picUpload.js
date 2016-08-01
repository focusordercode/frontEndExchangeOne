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


var inputWidth = $('.picUpload .proCate .search-cate').innerWidth();
$('.picUpload .proCate ul').width(inputWidth);
var oUrl;
var oGallery_id;
$(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});

//模糊搜索获取类目
$(document).on('keyup','.picUpload .proCate .search-cate',function(){
    var oText = $('.picUpload .proCate .search-cate').val();
    $.ajax({
        type:'POST',
        url:'http://192.168.1.40/PicSystem/canton/vague/imagename',
        datatype:'json',
        data:{
            keyword:oText
        },
        success:function(data){
            if(data.status==100){
                var $cateList = data.value;
                $('.picUpload .proCate ul li').remove();
                for($i=0;$i<$cateList.length;$i++){
                    $str = '<li name="'+$cateList[$i].id+'">'+$cateList[$i].cn_name+$cateList[$i].en_name+'</li>';
                    $('.picUpload .proCate ul').append($str);
                }
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求搜索失败');
        }
    })
});

//点击选中
$(document).on('click','.picUpload .proCate ul li',function(){
    var oCateID = $(this).attr('name');
    var oGallery = $('.picUpload .proCate .search-cate');
    $('.picUpload .proCate .search-cate').attr('name',oCateID);
    $('.picUpload .proCate .search-cate').val($(this).text());
    $('.picUpload .proCate ul li').remove();
    var oGallery_id = oGallery.attr('name');
    //var oUrl = 'http://192.168.1.40/PicSystem/canton/Picture/upload/gallery_id/'+oGallery_id;
    debugger
});


var uploader = new plupload.Uploader({
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : 'pickfiles', 
    container: document.getElementById('container'), 
    url : 'http://192.168.1.40/PicSystem/canton/Picture/upload/gallery_id/'+Request.id,
    flash_swf_url : 'js/Moxie.swf',
    silverlight_xap_url : 'js/Moxie.xap',
    
    filters : {
        max_file_size : '10mb',
        mime_types: [
            {title : "Image files", extensions : "jpg,gif,png"},
            {title : "Zip files", extensions : "zip"}
        ]
    },

    init: {
        PostInit: function() {
            $('.panel-body .alert').hide();
            document.getElementById('uploadfiles').onclick = function() {
                uploader.start();
                //return false;
            };
        },

        FilesAdded: function(up, files) {
            plupload.each(files, function(file) {
                document.getElementById('filelist').innerHTML += '<li class="list-group-item list-group-item-warning" id="' + file.id + '">' + file.name + '(' + plupload.formatSize(file.size) + ') <b></b></li>';
            });
        },

        UploadProgress: function(up, file) {
            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            //解绑页面离开提示
            $(window).unbind('beforeunload');
        },

        Error: function(up, err) {
            document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
        }
    }
});

uploader.init();
