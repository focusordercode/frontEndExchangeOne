/**
 * Created by Administrator on 2017/4/12.
 */

var id = get_url_param('id');
var main_id = get_url_param('min_id');
var Tel = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
var word =/^[A-Za-z0-9]+$/;
var EM = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
var Order = /^[1-9]\d{12,20}$/;
console.log(id);
var coupon = new Vue({
    el:'body',
    data:{
        batchList:[],
        list:[],
        grant:{
            orderId:'',
            time:'',
            name:'',
            tel:'',
            email:''
        },
        isGrant:{//发放表单验证错误提示
            orderId:false,
            time:false,
            name:false,
            tel:false,
            email:false
        },
        use:{
            name:'',
            tel:'',
            email:'',
            time:''
        },
        isUse:{
            name:false,
            tel:false,
            email:false,
            time:false
        },
        checks:{
            picked:'',
            remark:''
        }
    },
    ready:function () {
        $.ajax({
            type: "POST",
            url: serverUrl + "coupon/couponFind", //添加请求地址的参数
            dataType: "json",
            data: {
                key:oKey,
                user_id:token,
                id:id
            },
            success: function (data) {
                console.log(data);
                /*coupon.batchList = data.main;
                coupon.list = data.detail;
                console.log(coupon.list);*/
                /* console.log(coupon.list.status);*/
                if (data.status==100) {
                    coupon.batchList = data.main;
                    coupon.list = data.detail;
                    console.log(coupon.list);
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
            error: function () {

            }
        })
    },
    methods:{
        grantData:function () {
                var time = coupon.grant.time.trim();
                if(time){
                    var startDateString = coupon.batchList.validity_begin;
                    var endDateString = coupon.batchList.validity_end;
                    var flag = isDateBetween(time, startDateString, endDateString);
                }
                if(!flag){
                    layer.confirm('您所选的时间不在优惠券有效期间内，是否继续提交?', {
                        btn: ['确定','关闭'] //按钮
                    },function () {
                        layer.closeAll('dialog');
                        dataUp(coupon)
                    })
                }else{
                    dataUp(coupon)
                }
               /* if(!vm.userdata.password ||!word.test(vm.userdata.password))*/

                function dataUp(coupon) {
                    var orderId = coupon.grant.orderId.trim();
                    var time = coupon.grant.time.trim();
                    var name = coupon.grant.name.trim();
                    var tel = coupon.grant.tel.trim();
                    var email = coupon.grant.email.trim();

                    if(!orderId || !Order.test(orderId)){
                        coupon.isGrant.orderId = true;
                        coupon.isGrant.time = false;
                        coupon.isGrant.name = false;
                        coupon.isGrant.tel = false;
                        coupon.isGrant.email = false;
                    }else if(!time){
                        coupon.isGrant.orderId = false;
                        coupon.isGrant.time = true;
                        coupon.isGrant.name = false;
                        coupon.isGrant.tel = false;
                        coupon.isGrant.email = false;
                    }else if(!name){
                        coupon.isGrant.orderId = false;
                        coupon.isGrant.time = false;
                        coupon.isGrant.name = true;
                        coupon.isGrant.tel = false;
                        coupon.isGrant.email = false;
                    }else if(!tel || !Tel.test(tel)){
                        coupon.isGrant.orderId = false;
                        coupon.isGrant.time = false;
                        coupon.isGrant.name = false;
                        coupon.isGrant.tel = true;
                        coupon.isGrant.email = false;
                    }else if(!email || !EM.test(email)){
                        coupon.isGrant.orderId = false;
                        coupon.isGrant.time = false;
                        coupon.isGrant.name = false;
                        coupon.isGrant.tel = false;
                        coupon.isGrant.email = true;
                    }else{
                        coupon.isGrant.orderId = false;
                        coupon.isGrant.time = false;
                        coupon.isGrant.name = false;
                        coupon.isGrant.tel = false;
                        coupon.isGrant.email = false;
                        $.ajax({
                            type: "POST",
                            url: serverUrl + "coupon/couponEdit", //添加请求地址的参数
                            dataType: "json",
                            data: {
                                key:oKey,
                                user_id:token,
                                id:id,
                                order_no:orderId,
                                granted_date:time,
                                holder:name,
                                holder_telephone:tel,
                                holder_email:email
                            },
                            success: function (data) {
                                /* console.log(data);
                                 layer.msg(data.msg);
                                 getDatas();*/
                                getData();
                                console.log(data);
                                if (data.status==100) {
                                    console.log(data);
                                    layer.msg("操作成功");
                                    getData();
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
                            error: function () {

                            }
                        })
                    }
                }


        },
        useData:function () {
            var time = this.use.time.trim();
            if(time){
                var startDateString = this.batchList.validity_begin;
                var endDateString = this.batchList.validity_end;
                var flag = isDateBetween(time, startDateString, endDateString);
            }
            if(!flag){
                layer.confirm('您所选的时间不在有效期间，是否继续提交?', {
                    btn: ['确定','关闭'] //按钮
                },function () {
                    layer.closeAll('dialog');
                    useUpData(coupon);
                })
            }else{
                useUpData(coupon);
            }
            console.log(name);
            function useUpData(coupon) {
                var time = coupon.use.time.trim();
                var name = coupon.use.name.trim();
                var tel = coupon.use.tel.trim();
                var email = coupon.use.email.trim();
                if(!name){
                    coupon.isUse.time = false;
                    coupon.isUse.name = true;
                    coupon.isUse.tel = false;
                    coupon.isUse.email = false;
                }else if(!tel || !Tel.test(tel)){
                    coupon.isUse.time = false;
                    coupon.isUse.name = false;
                    coupon.isUse.tel = true;
                    coupon.isUse.email = false;
                }else if(!email || !EM.test(email)){
                    coupon.isUse.time = false;
                    coupon.isUse.name = false;
                    coupon.isUse.tel = false;
                    coupon.isUse.email = true;
                }else if(!time){
                    coupon.isUse.time = true;
                    coupon.isUse.name = false;
                    coupon.isUse.tel = false;
                    coupon.isUse.email = false;
                }else {
                    coupon.isUse.time = false;
                    coupon.isUse.name = false;
                    coupon.isUse.tel = false;
                    coupon.isUse.email = false;
                    $.ajax({
                        type: "POST",
                        url: serverUrl + "coupon/couponEdit", //添加请求地址的参数
                        dataType: "json",
                        data: {
                            key: oKey,
                            user_id: token,
                            id: id,
                            consume_date: time,
                            consumer: name,
                            consumer_telephone: tel,
                            consumer_email: email
                        },
                        success: function (data) {
                            console.log(data);
                            /*if(data.status==100){
                             layer.msg(data.msg);
                             getDatas();
                             }*/
                            if (data.status == 100) {
                                layer.msg("操作成功");
                                getData();
                            } else if (data.status == 1012) {
                                layer.msg('请先登录', {time: 2000});

                                setTimeout(function () {
                                    jumpLogin(loginUrl, NowUrl);
                                }, 2000);
                            } else if (data.status == 1011) {
                                layer.msg('权限不足,请跟管理员联系');
                            } else {
                                layer.msg(data.msg);
                            }
                        },
                        error: function () {

                        }

                    })
                }
            }

        },
        checkData:function () {
            var picked = this.checks.picked;
            var remark = this.checks.remark;
            console.log(picked);
            console.log(remark);
            if(picked==2){
                if(!this.checks.remark){
                    layer.msg('请填写申请说明')
                }else{
                    $.ajax({
                        type: "POST",
                        url: serverUrl + "coupon/couponEdit", //添加请求地址的参数
                        dataType: "json",
                        data: {
                            key:oKey,
                            user_id:token,
                            id:id,
                            auditl :picked,
                            remark :remark
                        },
                        success: function (data) {
                            if (data.status==100) {
                                layer.msg("操作成功");
                                getData();
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
                        error: function () {

                        }
                    })
                }
            }else {
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponEdit", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id,
                        auditl :picked,
                        remark :remark
                    },
                    success: function (data) {
                        if (data.status==100) {
                            layer.msg("操作成功");
                            getData();
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
                    error: function () {

                    }
                })
            }


        },
        goBack:function () {
            layer.confirm('当前操作还未完成，确认返回?', {
                btn: ['确定','关闭'] //按钮
            },function () {
                location.href = 'index-info.html?id='+ main_id
            })

        },
        void:function () {
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            layer.confirm('是否作废?', {
                btn: ['确定','关闭'] //按钮
            },function () {
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponVoid", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id
                    },
                    success: function (data) {
                        console.log(data);
                        if(data.status==100){
                            layer.msg("已作废");
                            getData();
                            layer.close(LoadIndex); //关闭遮罩层
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                            layer.close(LoadIndex); //关闭遮罩层
                        }else{
                            layer.msg(data.msg);
                            setTimeout(function(){
                                layer.close(LoadIndex);
                            },1000);
                            /* layer.close(LoadIndex);*/
                        }
                    },
                    error: function () {
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }

                });
            },function () {
                layer.close(LoadIndex); //关闭遮罩层
            });
        }
    }
});
function getData() {
    $.ajax({
        type: "POST",
        url: serverUrl + "coupon/couponFind", //添加请求地址的参数
        dataType: "json",
        data: {
            key:oKey,
            user_id:token,
            id:id
        },
        success: function (data) {
            console.log(data);
            /*coupon.batchList = data.main;
             coupon.list = data.detail;
             console.log(coupon.list);*/
            /* console.log(coupon.list.status);*/
            if (data.status==100) {
                coupon.batchList = data.main;
                coupon.list = data.detail;
                console.log(coupon.list);
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
        error: function () {

        }
    })
}
/*  2014-04-20 10:10:10转换成时间戳 */
function getTime(day){
    re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
    return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;
}
/*时间是否在区间内*/
function isDateBetween(dateString, startDateString, endDateString) {
    var flag = false;
    var dateString = getTime(dateString);
    var startDateString = getTime(startDateString);
    var endDateString = getTime(endDateString);
    if(startDateString <= dateString && dateString <= endDateString){
        flag = true;
    }else{
    }
    return flag;
}


/* 时间控件 */
$(".date").datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss',
    minView: 0,
    autoclose: true,
    minuteStep:1
});

function get_url_param(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}