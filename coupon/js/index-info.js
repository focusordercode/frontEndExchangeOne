/**
 * Created by Administrator on 2017/4/11.
 */

var id = get_url_param('id');//获取批次id

var pages = 10;
var creatTable = new Vue({
    el:'.coupon',
    data:{
        batchList:[],
        list:[],
        num:1,
        countPage: '',//总页数
        searchPage:'',//搜索
        thisPage:''//当前页
    },
    ready:function () {
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type: "POST",
            url: serverUrl + "coupon/couponList", //添加请求地址的参数
            dataType: "json",
            data: {
                key:oKey,
                user_id:token,
                main_id:id,
                num:pages,
                page:this.num
            },
            success: function (data) {
                console.log(data);
               /* creatTable.batchList = data.value.main;
                creatTable.list = data.value.detail;
                console.log(creatTable.list);*/
                if (data.status==100) {
                    creatTable.batchList = data.value.main;
                    creatTable.list = data.value.detail;
                    creatTable.thisPage = data.value.pages.page;
                    creatTable.countPage = data.value.pages.count_page;
                    console.log(creatTable.list);
                    layer.close(LoadIndex);
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});

                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                    layer.close(LoadIndex);
                }else{
                    layer.msg(data.msg);
                    layer.close(LoadIndex);
                }

            },
            error: function () {
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求失败');
            }
        })
    },
    methods:{
        downLoad:function () {
           location.href = serverUrl + "coupon/couponDownload?main_id=" + id;
        },
        open:function (id) {
            location.href = 'coupon.html?id=' + id
        },
        goBack:function () {
            window.history.back(-1)
        },
        goPrePage:function () {
            this.num--;
            console.log(this.num);
            if(this.num < 1){
                layer.msg("已经是第一页了");
                this.num = 1;
            }else{
                getPageData(this.num)
            }
        },
        goNextPage:function () {
            this.num++;
            console.log(this.num);
            console.log(this.countPage);
            if(this.num > this.countPage){
                layer.msg("已经是最后一页了");
                this.num = this.countPage;
            }else{
                getPageData(this.num)
            }
        },
        go:function () {
            if(this.searchPage>this.countPage || this.searchPage <1){
                layer.msg("不在跳转范围内")
            }else{
                getPageData(this.searchPage);
            }
        },
        void:function (id) {
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
                        }
                    },
                    error: function () {
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }

                });
            });
        }
    }
});
function getData() {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type: "POST",
        url: serverUrl + "coupon/couponList", //添加请求地址的参数
        dataType: "json",
        data: {
            key:oKey,
            user_id:token,
            main_id:id,
            num:pages,
            page:this.num
        },
        success: function (data) {
            console.log(data);
            /* creatTable.batchList = data.value.main;
             creatTable.list = data.value.detail;
             console.log(creatTable.list);*/
            if (data.status==100) {
                creatTable.batchList = data.value.main;
                creatTable.list = data.value.detail;
                creatTable.thisPage = data.value.pages.page;
                creatTable.countPage = data.value.pages.count_page;
                console.log(creatTable.list);
                layer.close(LoadIndex);
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});

                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
                layer.close(LoadIndex);
            }else{
                layer.msg(data.msg);
                layer.close(LoadIndex);
            }

        },
        error: function () {
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    })
}
function getPageData (num) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

    $.ajax({
        type: "POST",
        url: serverUrl + "coupon/couponList", //添加请求地址的参数
        dataType: "json",
        data: {
            key:oKey,
            user_id:token,
            main_id:id,
            num:pages,
            page:num
        },
        success: function (data) {
            console.log(data);
            /* creatTable.batchList = data.value.main;
             creatTable.list = data.value.detail;
             console.log(creatTable.list);*/
            if (data.status==100) {
                creatTable.batchList = data.value.main;
                creatTable.list = data.value.detail;
                console.log(creatTable.list);
                creatTable.thisPage = data.value.pages.page;
                creatTable.countPage = data.value.pages.count_page;
                creatTable.num = num;
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
                layer.close(LoadIndex)
            }

        },
        error: function () {
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    })
}
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
