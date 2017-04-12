/**
 * Created by Administrator on 2017/4/11.
 */

var id = get_url_param('id');//获取批次id
var  serverUrl="http://192.168.1.76/cantonback/index.php/Home/coupon/";

var creatTable = new Vue({
    el:'.coupon',
    data:{
        isShow:false,//表格创建
        sale:false,//出售
        use:false,//使用
        check:false,//审核
        batchList:[],
        list:[]

    },
    methods:{
       getList:function () {
           console.log(id);
           $.ajax({
               type: "POST",
               url: serverUrl + "/couponList", //添加请求地址的参数
               dataType: "json",
               data: {
                   main_id:id
               },
               success: function (data) {
                   console.log(data);
                   creatTable.batchList = data.value.main;
                   creatTable.list = data.value.detail;
                   console.log(creatTable.list);

               },
               error: function () {

               }
           })
       },
        downLoad:function () {
           location.href = serverUrl + "/couponDownload?main_id=" + id;

        },
        open:function (id) {
            location.href = 'coupon.html?id=' + id
        }
    }
});
creatTable.getList();
/* 在地址栏获取对应字节的值 */
function get_url_param(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}
