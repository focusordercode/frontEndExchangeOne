/**
 * Created by Administrator on 2016/11/29.
 */
console.log(serverUrl);

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
        sex:'',
        creator_id:'',
        belong:'',
        created_time:'',
        modified_time:'',
        remark:'',
        //用于判断的数据
        al_name:false,
        al_pass:false,
        al_true:false,
        al_belong:false,


    },
    methods:{
        //添加用户
        adduserbtn:function () {
            var vm = adduse;
            if (!(vm.user_name.trim())){
                vm.al_name = true;
            }else if (!(vm.password.trim())){
                vm.al_name = false;
                vm.al_pass = true;
            }else if (!vm.real_name){
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = true;
            }else if (!vm.belong){
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_belong = true;
            }else {
                vm.al_name = false;
                vm.al_pass = false;
                vm.al_true = false;
                vm.al_belong = false;

                $.ajax({
                    type:'POST',
                    url:'',
                    datatype:'json',
                    data:{

                },
            })
        }
    }
})




