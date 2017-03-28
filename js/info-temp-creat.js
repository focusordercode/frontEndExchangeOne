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
console.log();
var Request=new UrlSearch();
var type_code = 'info';
console.log(serverUrl); //后端接口地址

//英文正则,英文数字和空格
var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;

var tempCreat = new Vue({
    el:'body',
    data:{
        proList:'',
        proSelected:'',
        proSelectFor:'',//搜索框value值
        ishsow_SelectList:false,
        proSelectedId:'',
        cn_name:'',
        en_name:'',
        remark:'',
        tempen_alert:false,
        tempcn_alert:false,
        tempname_alert:false,
        now:-1
    },
    methods:{
        //从搜索结果中选中一个类目
        selectCate:function(pro){
            var vm = tempCreat;
            vm.proSelected = pro.cn_name;
            vm.proSelectedId = pro.id;
            vm.proList = '';
            //把搜索框清空
            $('.searchCate').val('');
            $('.searchCompent').hide();
        },
        //保存模板信息
        sendMsg:function(){
            var vm = tempCreat;
            var creator_id = cookie.get('id');
            if(!(this.cn_name.trim())){
               /* layer.msg('中文名不能为空');*/
               console.log(this.cn_name);
                vm.tempcn_alert = true;
                vm.tempen_alert = false;
                vm.tempname_alert = false;
            }else if(!this.en_name.trim()||!Entext.test(this.en_name)){
               /* layer.msg('英文名不能为空，且只能是字母数字和空格');*/
                vm.tempen_alert = true;
                vm.tempcn_alert = false;
                vm.tempname_alert = false;
            }else if(!this.proSelectedId){

                $('.searchCompent').hide();
                $('#tempname_alert').show();
                vm.tempname_alert = true;
                vm.tempen_alert = false;
                vm.tempcn_alert = false;
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'add/template',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        en_name:vm.en_name,
                        cn_name:vm.cn_name,
                        remark:vm.remark,
                        type_code:type_code,
                        category_id:vm.proSelectedId
                    },
                    success:function(data){
                        if(data.status==100){
                            var Id = data.value;
                            layer.msg('创建成功');

                            //跳转函数
                            function goNext() {
                                var url = 'info-temp-edit.html';
                                window.location.href = url+'?id='+Id;
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
        //取消
        cancel:function(){
            layer.confirm('确定不保存数据取消编辑吗?',{
                btn:['确定','取消']
            },function(){
                var url = 'template.html';
                window.location.href = url;
            });
        },
        //输入关键字搜索类目
        get:function (ev) {
            if(ev.keyCode == 8){
                this.now = -1
            }
            var searchCusVal = this.proSelectFor;
            if(ev.keyCode == 38 || ev.keyCode == 40)return;

            if(ev.keyCode == 13){
                /*window.open('https://www.baidu.com/s?wd='+this.t1);*/
                this.proSelected = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectedId = this.proList[this.now].id;
                this.ishsow_SelectList = !this.ishsow_SelectList;
            }
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
                    var vm = tempCreat;

                    if(data.status==100){
                        vm.proList = data.value;
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
                this.proSelectedId = this.proList[this.now].id;
                this.proSelected = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectFor = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;

            }
        },
        changeUp:function(){//键盘上方向选择下拉
           /* if (this.proList.length == 0 || this.proList.length == -1)return;*/
            this.now--;
            if(this.now == -2){
                this.now = this.proList.length-1;
            }else if(this.now == -1){
                this.now = -1
            }else {
                this.proSelectedId = this.proList[this.now].id;
                this.proSelected = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
                this.proSelectFor = this.proList[this.now].cn_name +' '+ this.proList[this.now].en_name;
            }
        },
        show:function () {
            this.ishsow_SelectList = !this.ishsow_SelectList;
            this.proSelectFor = ''
        }
    }
});


//搜索类目框
$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
        $('#tempname_alert').hide();
        $('#searchInputa').show();
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
    if(evt.id == 'blurInput'|| evt.id == 'searchInput'||evt.id == 'searchField') return; // 如果是元素本身，则返回
    else {
        tempCreat.ishsow_SelectList=false;
        $('#searchInput').hide(); // 如不是则隐藏元素
    }
});
//搜索类目
$('.searchCate').on('keyup',function(){
    /*var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();*/

   /* $.ajax({
        type:'POST',
        url:serverUrl+'vague/name',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            text:searchCusVal
        },
        success:function(data){
            var vm = tempCreat;

            if(data.status==100){
                vm.proList = data.value;
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
    })*/
});

