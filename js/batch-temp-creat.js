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

var type_code = Request.type_code; //模板类型
console.log(serverUrl); //后端接口地址

var creatTemp = new Vue({
    el:'body',
    data:{
        cn_name:'',
        en_name:'',
        remark:'',
        proList:'',
        proName:'',
        proId:''
    },
    methods:{
        //从搜索结果中选中一个类目
        selectCate:function(pro){
            creatTemp.proName = pro.cn_name;
            creatTemp.proId = pro.id;
            creatTemp.proList = '';
            //清除值，隐藏框
            $('.searchCate').val('');
            $('.searchCompent').hide();
        },
        //提交请求
        tempSub:function(){

            //英文正则,英文数字和空格
            var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;
            var creator_id = cookie.get('id');
            if(!this.cn_name.trim()){
                layer.msg('中文名不能为空');
            }else if(!Entext.test(this.en_name)||!this.en_name){
                layer.msg('英文名不能为空，且英文名只能是英文数字和空格');
            }else if(!this.proId){
                layer.msg('必须选择类目');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'add/template',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        cn_name:creatTemp.cn_name,
                        en_name:creatTemp.en_name,
                        remark:creatTemp.remark,
                        type_code:type_code,
                        category_id:creatTemp.proId
                    },
                    success:function(data){
                        if(data.status==100){
                            var template_id = data.value;
                            layer.msg('添加成功');

                            //跳转函数
                            function goNext() {
                                var url = 'batch-temp-defineVal.html';
                                window.location.href = url+'?id='+template_id;
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
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //取消创建模板
        cancel:function(){
            layer.confirm('确定取消创建模板?数据将不保存',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);
                var url = 'template-batch-list.html';
                window.location.href = url;
            })
        }
    }
})

//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
})

//模糊搜索类目
$('.searchCate').on('keyup',function(){
    var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();

    $.ajax({
        type:'POST',
        url:serverUrl+'index.php/vague/name',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            text:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                creatTemp.proList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                creatTemp.proList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })
});