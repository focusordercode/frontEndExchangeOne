console.log(serverUrl);

var adduse = new Vue ({
    el:"body",
    data:{
        id:'',
        user_name:'',
        password:'',
        real_name:'',
        email:'',
        mobile:'',
        enabled:'',
        is_staff:'',
        is_head:'',
        remark:'',
        roleid:[],
        orgSelect:[], //选择的角色
        addremark:'',
        //搜索角色数据
        oneList:'',
        //用于判断的数据
        al_name:false,
        al_pass:false,
        al_true:false,
        al_mobile:false,
        al_email:false,
        al_role:false
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
            if (!(vm.user_name.trim())) {
                vm.al_name = true;
            } else if (!(vm.password.trim())||!word.test(vm.password)) {
                vm.al_name = false;
                vm.al_pass = true;
            } else if (!vm.real_name) {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = true;
            } else if (vm.mobile&&!tel.test(vm.mobile)) {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = true;
            } else if (vm.email&&!EM.test(vm.email)) {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = true;
            } else if (vm.orgSelect.length == 0) {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = true;
            }else {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_mobile = false;
                vm.al_email = false;
                vm.al_role = false;

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
            console.log(orgSelect)
            for(var i = 0;i<orgSelect.length;i++){
                if(orgSelect[i]==one){
                    hasOne.push(i);
                }
            }
            console.log(hasOne)
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
    }
})

//刷新函数
function windowFresh(){
    location.reload(true);
}

$(function(){
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })
})

//搜索角色
$('.searchCate').on('keyup',function(){
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
}); 
function getroleid(orgSelect){
    var roleid = [];
    for (var i = 0; i < orgSelect.length; i++) {
        roleid.push(orgSelect[i].id);
    }
    return roleid
}   