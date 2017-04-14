/**
 * Created by Administrator on 2017/4/12.
 */

var id = get_url_param('id');
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
                var orderId = this.grant.orderId.trim();
                var time = this.grant.time.trim();
                var name = this.grant.name.trim();
                var tel = this.grant.tel.trim();
                var email = this.grant.email.trim();
               /* if(!vm.userdata.password ||!word.test(vm.userdata.password))*/
                if(!orderId || !Order.test(orderId)){
                    this.isGrant.orderId = true;
                    this.isGrant.time = false;
                    this.isGrant.name = false;
                    this.isGrant.tel = false;
                    this.isGrant.email = false;
                }else if(!time){
                    this.isGrant.orderId = false;
                    this.isGrant.time = true;
                    this.isGrant.name = false;
                    this.isGrant.tel = false;
                    this.isGrant.email = false;
                }else if(!name){
                    this.isGrant.orderId = false;
                    this.isGrant.time = false;
                    this.isGrant.name = true;
                    this.isGrant.tel = false;
                    this.isGrant.email = false;
                }else if(!tel || !Tel.test(tel)){
                    this.isGrant.orderId = false;
                    this.isGrant.time = false;
                    this.isGrant.name = false;
                    this.isGrant.tel = true;
                    this.isGrant.email = false;
                }else if(!email || !EM.test(email)){
                    this.isGrant.orderId = false;
                    this.isGrant.time = false;
                    this.isGrant.name = false;
                    this.isGrant.tel = false;
                    this.isGrant.email = true;
                }else{
                    this.isGrant.orderId = false;
                    this.isGrant.time = false;
                    this.isGrant.name = false;
                    this.isGrant.tel = false;
                    this.isGrant.email = false;
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


        },
        useData:function () {
            var time = this.use.time.trim();
            var name = this.use.name.trim();
            var tel = this.use.tel.trim();
            var email = this.use.email.trim();
            console.log(name);
            if(!name){
                this.isUse.time = false;
                this.isUse.name = true;
                this.isUse.tel = false;
                this.isUse.email = false;
            }else if(!tel || !tel.test(Tel)){
                this.isUse.time = false;
                this.isUse.name = false;
                this.isUse.tel = true;
                this.isUse.email = false;
            }else if(!email || !email.test(EM)){
                this.isUse.time = false;
                this.isUse.name = false;
                this.isUse.tel = false;
                this.isUse.email = true;
            }else if(!time){
                this.isUse.time = true;
                this.isUse.name = false;
                this.isUse.tel = false;
                this.isUse.email = false;
            }else{
                this.isUse.time = false;
                this.isUse.name = false;
                this.isUse.tel = false;
                this.isUse.email = false;
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponEdit", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id,
                        consume_date:time,
                        consumer :name,
                        consumer_telephone:tel,
                        consumer_email:email
                    },
                    success: function (data) {
                        console.log(data);
                        /*if(data.status==100){
                            layer.msg(data.msg);
                            getDatas();
                        }*/
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
        checkData:function () {
            var picked = this.checks.picked;
            var remark = this.checks.remark;
            console.log(picked);
            console.log(remark);
            $.ajax({
                type: "POST",
                url: serverUrl + "coupon/couponEdit", //添加请求地址的参数
                dataType: "json",
                data: {
                    key:oKey,
                    user_id:token,
                    id:id,
                    status :picked,
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

        },
        goBack:function () {
            layer.confirm('当前操作还未完成，确认返回?', {
                btn: ['确定','关闭'] //按钮
            },function () {
                window.history.back(-1);
            })

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
/*
* 日期解析，字符串转日期
* @param dateString 可以为2017-02-16，2017/02/16，2017.02.16
* @returns {Date} 返回对应的日期对象
*/
function dateParse(dateString){
    var SEPARATOR_BAR = "-";
    var SEPARATOR_SLASH = "/";
    var SEPARATOR_DOT = ".";
    var dateArray;
    if(dateString.indexOf(SEPARATOR_BAR) > -1){
        dateArray = dateString.split(SEPARATOR_BAR);
    }else if(dateString.indexOf(SEPARATOR_SLASH) > -1){
        dateArray = dateString.split(SEPARATOR_SLASH);
    }else{
        dateArray = dateString.split(SEPARATOR_DOT);
    }
    return new Date(dateArray[0], dateArray[1]-1, dateArray[2]);
};
/**
 * 判断日期是否在区间内，在区间内返回true，否返回false
 * @param dateString 日期字符串
 * @param startDateString 区间开始日期字符串
 * @param endDateString 区间结束日期字符串
 * @returns {Number}
 */
function isDateBetween(dateString, startDateString, endDateString){
    var flag = false;
    var startFlag = (dateCompare(dateString, startDateString) < 1);
    var endFlag = (dateCompare(dateString, endDateString) > -1);
    if(startFlag && endFlag){
        flag = true;
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