/**
 * Created by Administrator on 2017/4/11.
 */


var  serverUrl="http://192.168.1.76/cantonback/index.php/Home/coupon/";



var info = new Vue({
    el:'body',
    data:{
        isShow:false,//表格创建
        tableInfo:{
            name:'',
            couponType:'',
            minConsume:'',
            faceValue:'',
            preNumber:'',
            price:'',
            singleNumber:'',
            startDate:'',
            endDate:'',
            description:'',
            picked:''
        },
        list:[],
        countPage:'',
        page:''
    },
    methods: {
        creat: function () {
            this.isShow = !this.isShow
        },
        getInfo: function () {
            alert('a');
            location.href = 'index-info.html'
        },
        upData: function () {
            var name = this.tableInfo.name.trim();
            var minConsume = this.tableInfo.minConsume.trim();
            var faceValue = this.tableInfo.faceValue.trim();
            var preNumber = this.tableInfo.preNumber.trim();
            var price = this.tableInfo.price.trim();
            var singleNumber = this.tableInfo.singleNumber.trim();
            var startDate = this.tableInfo.startDate.trim();
            var endDate = this.tableInfo.endDate.trim();
            var description = this.tableInfo.description.trim();
            var picked = this.tableInfo.picked;
            console.log(this.tableInfo.picked);

            if (!name) {
                layer.msg('请填写名字')
            } else if (!minConsume) {
                layer.msg('请填写最低消费')
            } else if (!faceValue) {
                layer.msg('请填写面值')
            } else if (!preNumber) {
                layer.msg('请填写预发数量')
            } else if (!price) {
                layer.msg('请填写价格')
            } else if (!singleNumber) {
                layer.msg('请填写使用个数')
            } else if (!startDate) {
                layer.msg('请填写开始日期')
            } else if (!endDate) {
                layer.msg('请填写结束日期')
            } else /*if (!description) {
                layer.msg('请填写说明')
            }*/ /*else*/ {
                $.ajax({
                    type: "POST",
                    url: serverUrl + "/couponsCreate", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        name: name,
                        type: 1,
                        min_amount: minConsume,
                        denomination: faceValue,
                        price: price,
                        issuant_amount: preNumber,
                        restriction_amount: singleNumber,
                        validity_begin: startDate,
                        validity_end: endDate,
                        issuant_status: picked,
                        remark: description
                    },
                    success: function (data) {
                        console.log(data);
                        if(data.status==100){
                            layer.msg("创建成功");
                            info.getList();
                            $('#myModal').modal('hide')
                        }
                    },
                    error: function () {

                    }
                })
            }
        },
        getList:function () {
            $.ajax({
                type: "POST",
                url: serverUrl + "couponsList", //添加请求地址的参数
                dataType: "json",
                data: {
                  num:15
                },
                success: function (data) {
                     info.list = data.value;
                    info.countPage = data.pages.count_page;
                    info.page = data.pages.page;
                },
                error: function () {

                }
            })

        }, 
        void:function (id) {
            $.ajax({
                type: "POST",
                url: "http://192.168.1.76/cantonback/index.php/Home/coupon/couponsDelete", //添加请求地址的参数
                dataType: "json",
                data: {
                    id:id
                },
                success: function (data) {
                    console.log(data);
                    layer.msg(data.msg);
                    if(data.status=='100'){
                        layer.msg(data.msg);
                        info.getList();
                    }
                },
                error: function () {

                }
            });
        },
        deleteData:function (id) {
            $.ajax({
                type: "POST",
                url: "http://192.168.1.76/cantonback/index.php/Home/coupon/couponsVoid", //添加请求地址的参数
                dataType: "json",
                data: {
                    id:id
                },
                success: function (data) {
                    console.log(data);
                    layer.msg(data.msg);
                },
                error: function () {

                }
            });
        },
        publish:function (list_id) {
            location.href = "index-info.html?id=" + list_id
        }

    }
});
info.getList();
//获取url参数

/* 时间控件 */
var date = new Date();
$(".date").datetimepicker({
    format: 'yyyy-mm-dd',
    minView: "month",
    autoclose: true
});
