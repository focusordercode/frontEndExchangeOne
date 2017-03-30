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
        proSelectFor:'',//搜索input框
        proId:'',
        now:'',
        cn_alert:false,//中文名字为空，出现提示
        en_alert:false,//英文名字为空，出现提示
        name_alert:false,//类目为空，出现提示
        ishsow_SelectList:false//类目搜索框显示隐藏
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
               /* layer.msg('中文名不能为空');*/
                this.cn_alert = true;
                this.en_alert = false;
                this.name_alert = false;
            }else if(!Entext.test(this.en_name)||!this.en_name){
                this.cn_alert = false;
                this.en_alert = true;
                this.name_alert = false;
                /*layer.msg('英文名不能为空，且英文名只能是英文数字和空格');*/
            }else if(!this.proId){
                $('.searchCompent').hide();
                $('#name_alert').show();
                this.cn_alert = false;
                this.en_alert = false;
                this.name_alert = true;
               /* layer.msg('必须选择类目');*/
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
        get:function (ev) {
            if(ev.keyCode == 8){
                this.now = -1
            }
            if(ev.keyCode == 38 || ev.keyCode == 40)return;

            if(ev.keyCode == 13){

                this.proName = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proId = this.proList[this.now].id;
                this.now = -1;
            }
            var searchCusVal = this.proSelectFor;
            $.ajax({
                type:'POST',
                url:serverUrl+'vague/name',
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    text:searchCusVal
                },
                success:function(data){
                    var vm = creatTemp;
                    if(data.status==100){
                        vm.proList = data.value;
                        var getWidth = $('#searchField').outerWidth();
                        $('#searchInput').css('width',getWidth);

                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});

                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
                        vm.proList= '';
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求产品类目失败');
                }
            })
        },
        changeDown:function () {//键盘下方向选择下拉
            /* if (this.proList.length == 0 || this.proList.length == -1)return;*/

            this.now++;
            if(this.now == this.proList.length){
                this.now = -1;
            }else{
                $('#searchInput').animate({scrollTop:this.now*33},100);
                this.proId = this.proList[this.now].id;
                this.proName = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectFor = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;

            }
        },
        changeUp:function(){//键盘上方向选择下拉
            /* if (this.proList.length == 0 || this.proList.length == -1)return;*/
            this.now--;
            if(this.now == -2){
                this.now = this.proList.length-1;
            }else if(this.now == -1){
                this.now = this.proList.length;
            }else {
                $('#searchInput').animate({scrollTop:this.now*33},100);
                this.proId = this.proList[this.now].id;
                this.proName = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectFor = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
            }
        },
        show:function () {
            this.ishsow_SelectList = !this.ishsow_SelectList;
            this.proSelectFor = ''
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
});

//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
        $('#name_alert').hide();
        $('#searchInput').show();
    });
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
});

//搜索类目列表隐藏
$('.goSearch').on('click',function(){
    $('#searchInput').show();
    $('#searchField').focus();
});
$('body').bind('click', function(event) {
    // IE支持 event.srcElement ， FF支持 event.target
    var evt = event.srcElement ? event.srcElement : event.target;
    if(evt.id == 'blurInput'|| evt.id == 'searchInput'||evt.id == 'searchField') {
        $('#searchInput').show();
    } // 如果是元素本身，则返回
    else {
        $('#searchInput').hide(); // 如不是则隐藏元素
    }
});

//模糊搜索类目
/*
$('.searchCate').on('keyup',function(){
  /!*  var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
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
    })*!/
});*/
