/**
 * Created by Administrator on 2017/4/12.
 */

var id = get_url_param('id');
console.log(id);
var serverUrl = "http://192.168.1.76/cantonback/index.php/Home/coupon/";

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
        use:{
            name:'',
            tel:'',
            email:'',
            time:''
        },
        checks:{
            picked:'',
            remark:''
        }
    },
    methods:{
        getData:function () {
            $.ajax({
                type: "POST",
                url: serverUrl + "couponFind", //添加请求地址的参数
                dataType: "json",
                data: {
                    id:id
                },
                success: function (data) {
                    console.log(data);
                    coupon.batchList = data.main;
                    coupon.list = data.detail;
                    console.log(coupon.list);
                    console.log(coupon.list.status);
                },
                error: function () {

                }
            })
        },
        grantData:function () {
                var orderId = this.grant.orderId;
                var time = this.grant.time;
                var name = this.grant.name;
                var tel = this.grant.tel;
                var email = this.grant.email;
            $.ajax({
                type: "POST",
                url: serverUrl + "/couponEdit", //添加请求地址的参数
                dataType: "json",
                data: {
                    id:id,
                    order_no:orderId,
                    granted_date:time,
                    holder:name,
                    holder_telephone:tel,
                    holder_email:email
                },
                success: function (data) {
                    console.log(data);
                    coupon.getData();
                },
                error: function () {

                }
            })

        },
        useData:function () {
            var time = this.use.time;
            var name = this.use.name;
            var tel = this.use.tel;
            var email = this.use.email;
            $.ajax({
                type: "POST",
                url: serverUrl + "couponEdit", //添加请求地址的参数
                dataType: "json",
                data: {
                    id:id,
                    consume_date:time,
                    consumer :name,
                    consumer_telephone:tel,
                    consumer_email:email
                },
                success: function (data) {
                    console.log(data);
                    layer.msg(data.msg);
                    coupon.getData();
                },
                error: function () {

                }
            })

        },
        checkData:function () {
            var picked = this.checks.picked;
            var remark = this.checks.remark;
            $.ajax({
                type: "POST",
                url: serverUrl + "couponEdit", //添加请求地址的参数
                dataType: "json",
                data: {
                    id:id,
                    status :picked,
                    remark :remark
                },
                success: function (data) {
                    console.log(data);
                    layer.msg(data.msg);
                    coupon.getData();
                },
                error: function () {

                }
            })

        }
    }
});
coupon.getData();


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