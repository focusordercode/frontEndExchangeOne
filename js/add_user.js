/**
 * Created by Administrator on 2016/11/29.
 */
console.log(serverUrl);
serverUrl = 'http://192.168.1.40/canton/';
var adduse = new Vue ({
    el:"body",
    data:{
        id:'',
        user_name:'',
        password:'',
        pwdsuffix:'',
        real_name:'',
        email:'',
        mobile:'',
        enabled:'',
        is_staff:'',
        is_head:'',
        creator_id:'',
        belong:'管理员',
        remark:'',
        roleid:'',
        //用于判断的数据
        al_name:false,
        al_pass:false,
        al_true:false,
        al_belong:false,
        al_mobile:false,
        al_email:false
    },

    methods:{
        //添加用户
        adduserbtn:function () {
            var vm = adduse;
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
            } else if (!vm.belong) {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_email = false;
                vm.al_mobile = false;
                vm.al_belong = true;
            } else {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_belong = false;
                vm.al_mobile = false;
                vm.al_email = false;

                $.ajax({
                    type: 'POST',
                    url: serverUrl+'add/user',
                    datatype: 'json',
                    data: {
                        username:vm.user_name,
                        password:vm.password,
                        real_name:vm.real_name,
                        email:vm.email,
                        mobile:vm.mobile,
                        is_staff:vm.is_staff,
                        is_head:vm.is_head,
                        belong:vm.belong,
                        remark:vm.remark,
                        roleid:vm.roleid
                    },
                    success:function(data){
                        if (data.status==100) {
                            layer.msg('添加成功');

                            setInterval(windowFresh,1000);
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求添加失败');
                    }
                })
            }
        }
    }
})

//刷新函数
function windowFresh(){
    location.reload(true);
}