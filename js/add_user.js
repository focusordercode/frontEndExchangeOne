console.log(serverUrl);

var adduse = new Vue ({
    el:"body",
    data:{
        id:'',
        user_name:'',
        password:'',
        passWord:'',
        real_name:'',
        email:'',
        mobile:'',
        enabled:'',
        is_staff:'',
        is_head:'',
        remark:'',
        roleid:[],
        orgSelect:[], //选择的角色
        selsectActor:'',//搜索框
        addremark:'',
        //搜索角色数据
        oneList:'',
        now:-1,
        //用于判断的数据
        al_name:false,//用户名
        al_pass:false,//密码
        al_true:false,//真实用户名
        al_mobile:false,//手机
        al_email:false,//邮箱
        al_role:false,//所属角色
        is_same:false,//密码+确认密码一致
        suer_password:false//确认密码
    },

    methods:{
        //添加用户
        adduserbtn:function () {
            var vm = adduse;
            var Select = vm.orgSelect;
            var creator_id = cookie.get('id');
            var roleid = getroleid(Select);
            var tel = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
            var word =/^[A-Za-z0-9]+$/;
            var EM = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
            if (!(vm.user_name.trim())) {//用户名
                vm.al_name = true;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;
                vm.is_same = false;
                vm.suer_password = false;
            } else if (!(vm.password.trim())||!word.test(vm.password)) {//密码
                vm.al_pass = true;
                vm.al_name = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;
                vm.is_same = false;
                vm.suer_password = false;
            } else  if(!(vm.passWord.trim())||!word.test(vm.passWord)){//确认密码
                vm.suer_password = true;
                vm.is_same = false;
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;
            }else if(vm.password != vm.passWord){//密码+确认密码一致
                vm.is_same = true;
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;
                vm.suer_password = false;
            }else if (!vm.real_name) {//用户真实姓名
                vm.al_pass = false;
                vm.al_name = false;
                vm.al_true = true;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;
                vm.is_same = false;
                vm.suer_password = false;
            } else if (vm.mobile&&!tel.test(vm.mobile)) {//手机
                vm.al_pass = false;
                vm.al_name = false;
                vm.al_true = false;
                vm.al_mobile = true;
                vm.al_email = false;
                vm.al_role = false;
                vm.is_same = false;
                vm.suer_password = false;
            } else if (vm.email&&!EM.test(vm.email)) {//邮箱
                vm.al_pass = false;
                vm.al_name = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = true;
                vm.al_role = false;
                vm.is_same = false;
                vm.suer_password = false;
            } else if (vm.orgSelect.length == 0) {//角色
                vm.al_pass = false;
                vm.al_name = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = true;
                vm.is_same = false;
                vm.suer_password = false;
                $('.searchCompent').hide();
                $('#al_role').show();
            }else {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;
                vm.is_same = false;
                vm.suer_password = false;

                $.ajax({
                    type: 'POST',
                    url: serverUrl+'add/user',
                    datatype: 'json',
                    data: {
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        username:vm.user_name,
                        password:vm.password,
                        real_name:vm.real_name,
                        email:vm.email,
                        mobile:vm.mobile,
                        is_staff:vm.is_staff,
                        is_head:vm.is_head,
                        remark:vm.remark,
                        roleid:roleid
                    },
                    success:function(data){
                        if (data.status==100) {
                            layer.msg('添加成功');

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
                    error:function(jqXHR){
                        layer.msg('向服务器请求添加失败');
                    }
                })
            }
        },
        //点击选中一个机构
        selectOne:function(one){
            var vm = this;
            var orgSelect = [];
            var hasOne = [];
            orgSelect = vm.orgSelect;
            for(var i = 0;i<orgSelect.length;i++){
                if(orgSelect[i]==one){
                    hasOne.push(i);
                }
            }
            console.log(hasOne);

            if(hasOne.length){
                layer.msg("已经选中了");
            }else{
                vm.orgSelect.push(one);
            }
        },
        //删除选中角色
        removeOrg:function(org){
            var vm = this;
            vm.orgSelect.$remove(org);
        },
        //取消编辑
        cancel:function(){
            //还原数据
            this.editOne = '';
            $('.editTable').modal('hide');
        },
        get:function (ev) {
            if(ev.keyCode == 8){
                this.now = -1
            }
            if(ev.keyCode == 38 || ev.keyCode == 40){
                return;
            }else if(ev.keyCode == 13){
                var vm = this;
                var orgSelect = [];
                var hasOne = [];
                orgSelect = vm.orgSelect;
                console.log(orgSelect);
                for(var i = 0;i<orgSelect.length;i++){
                    if(orgSelect[i]==vm.oneList[vm.now]){
                        hasOne.push(i);
                    }
                }
                console.log(hasOne);
                if(hasOne.length){
                    layer.msg("已经选中了");
                }else{
                    vm.orgSelect.push(vm.oneList[vm.now]);
                }
                /*this.orgSelect.push(this.oneList[this.now].name);*/
            }
            var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
            $('.pors .cate-list').css('width',getWidth);
            var searchCusVal = $('.searchCate').val();
            $.ajax({
                type:'POST',
                url:serverUrl+'get/roles',
                datatype:'json',
                data:{
                    key:oKey,
                    user_id:token,
                    vague:searchCusVal
                },
                success:function(data){
                    if(data.status == 100){
                        adduse.oneList = data.value;
                        console.log(data.value[0])
                    }else if(data.status==1012){
                        layer.msg('请先登录',{time:2000});
                        setTimeout(function(){
                            jumpLogin(loginUrl,NowUrl);
                        },2000);
                    }else if(data.status==1011){
                        layer.msg('权限不足,请跟管理员联系');
                    }else{
                        adduse.oneList = '';
                    }
                },
                error:function(jqXHR){
                    layer.msg('向服务器请求搜索角色失败');
                }
            })
        },
        changeDown: function () {
            this.now++;
            if(this.now == this.oneList.length){
                this.now = 0;
            }else {
                $('#seachList').animate({scrollTop:this.now*31},100);
                this.selsectActor = this.oneList[this.now].name;
            }
        },
        changeUp: function () {
            this.now--;
            if(this.now == -1||this.now == -2){
                this.now = this.oneList.length-1;
            }else{
                $('#seachList').animate({scrollTop:this.now*31},100);
                this.selsectActor = this.oneList[this.now].name;
            }
        }
    }
});

//刷新函数
function windowFresh(){
    location.reload(true);
}

$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
        $('#al_role').hide();
    });
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
});

//搜索列表隐藏
$('.goSearch').on('click',function(){
    $('#searchInput').show();
    $('#searchField').focus();
});
$('body').bind('click', function(event) {
    // IE支持 event.srcElement ， FF支持 event.target
    var evt = event.srcElement ? event.srcElement : event.target;
    if(evt.id == 'blurInput'|| evt.id == 'searchInput'||evt.id == 'searchField') return; // 如果是元素本身，则返回
    else {
        $('#searchInput').hide(); // 如不是则隐藏元素
    }
});

//搜索角色
/*$('.searchCate').on('keyup',function(){
    var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();
    $.ajax({
        type:'POST',
        url:serverUrl+'get/roles',
        datatype:'json',
        data:{
            key:oKey,
            user_id:token,
            vague:searchCusVal
        },
        success:function(data){
            if(data.status == 100){
                adduse.oneList = data.value;
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }else{
                adduse.oneList = '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求搜索角色失败');
        }
    })
}); */
function getroleid(orgSelect){
    var roleid = [];
    for (var i = 0; i < orgSelect.length; i++) {
        roleid.push(orgSelect[i].id);
    }
    return roleid
}   