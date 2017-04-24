/**
 * Created by Administrator on 2017/4/11.
 */

var id = get_url_param('id');//获取批次id


var creatTable = new Vue({
    el:'.coupon',
    data:{
        batchList:[],
        list:[],
        num:1,
        countPage: '',//总页数
        searchPage:'',//搜索
        thisPage:'',//当前页
        sel:'',//切换状态查询列表
        search:'',//输入优惠码查询
        remark:'',//作废理由
        remarkA:'',//作废理由
        item_id:'',//作废项Id
        pages: 10//分页显示数量
    },
    ready:function ()   {
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        var pages = this.pages;
        var num = this.num;
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
                    creatTable.thisPage = data.value.pages.page;
                    creatTable.countPage = data.value.pages.count_page;
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
                    console.log(data);
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

        },
        open:function (ids) {
            location.href = 'coupon.html?id=' + ids + '&min_id='+id
        },
        goBack:function () {
            location.href = 'index.html'
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
        void:function () {
            var remark = this.remark;
            var item_id = this.item_id;

            if(!remark){
                layer.msg('请填写作废原因')
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponVoid", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:item_id,
                        remark:remark
                    },
                    success: function (data) {
                        console.log(data);
                        creatTable.remark = "";
                        $('#myModal').modal('hide');
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
            }

          /*  layer.confirm('是否作废?', {
                btn: ['确定','关闭'] //按钮
            },function () {

            },function () {
                layer.close(LoadIndex); //关闭遮罩层
            });*/
        },
        selected:function (sel) {
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            var pageNum = this.num;
            var pages = creatTable.pages;
            console.log(sel);
            $.ajax({
                type: "POST",
                url: serverUrl + "coupon/couponList", //添加请求地址的参数
                dataType: "json",
                data: {
                    key:oKey,
                    user_id:token,
                    main_id:id,
                    num:pages,
                    page:pageNum,
                    issuant_status:sel
                },
                success: function (data) {
                    console.log(data);
                    if (data.status==100) {
                        creatTable.batchList = data.value.main;
                        creatTable.list = data.value.detail;
                        creatTable.thisPage = data.value.pages.page;
                        creatTable.countPage = data.value.pages.count_page;
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
                        console.log(data);
                        layer.close(LoadIndex);
                    }

                },
                error: function () {
                    layer.close(LoadIndex); //关闭遮罩层
                    layer.msg('向服务器请求失败');
                }
            })
        },
        //删除
        voids:function () {
            layer.confirm('是否删除?', {
                btn: ['确定','关闭'] //按钮
            },function () {
                $.ajax({
                    type: "POST",
                    url:  serverUrl + "coupon/couponsDelete", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id
                    },
                    success: function (data) {
                        console.log(data);
                        if(data.status==100){
                            layer.msg(data.msg);
                            location.href = 'index.html'
                        } else if(data.status==1012){
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

                        layer.msg('向服务器请求失败');
                    }
                });
            });


        },
        //作废
        deleteData:function () {
            var remark = this.remarkA;
            if(!remark){
                layer.msg("请填写作废原因")
            }else{
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponsVoid", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id,
                        remark:remark
                    },
                    success: function (data) {
                        console.log(data);
                        layer.msg(data.msg);
                        creatTable.remarkA = "";
                        $('#myModalA').modal('hide');
                        if(data.status=='100'){
                            layer.msg(data.msg);
                            getData()
                        } if (data.status==100) {
                            layer.msg(data.msg);
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
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                });
            }

          /*  layer.confirm('是否作废?', {
                btn: ['确定','关闭'] //按钮
            },function () {

            })*/

        },
        searched:function () {

            var pageNum = this.num;
            var search = this.search;
            console.log(search);
            if(!search){
                layer.msg("输入关键字在搜索噻")
            }else {
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                var pages = creatTable.pages;
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponList", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        main_id:id,
                        num:pages,
                        page:pageNum,
                        search:search
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.status==100) {
                            creatTable.batchList = data.value.main;
                            creatTable.list = data.value.detail;
                            creatTable.thisPage = data.value.pages.page;
                            creatTable.countPage = data.value.pages.count_page;
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
                            console.log(data);
                            layer.close(LoadIndex);
                        }

                    },
                    error: function () {
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }

        },
        getId:function (id) {

            this.item_id = id;
        }
    }
});
function getData() {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    var pages = creatTable.pages;
    $.ajax({
        type: "POST",
        url: serverUrl + "coupon/couponList", //添加请求地址的参数
        dataType: "json",
        data: {
            key:oKey,
            user_id:token,
            main_id:id,
            num:pages,
            page:creatTable.num
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
    var pages = creatTable.pages;
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

$('.download').click(function(){
    var url =  serverUrl + 'coupon/couponDownload?main_id=' + id;
    var form=$("<form>");//定义一个form表单
    form.attr("style","display:none");
    form.attr("target","");
    form.attr("method","post");//类型
    form.attr("action",url);//地址
    $("body").append(form);//将表单放置在web中
    var input1=$("<input>");
    input1.attr("type","hidden");
    input1.attr("name",'key');
    input1.attr("value",oKey);
    form.append(input1);
    var input2=$("<input>");
    input2.attr("type","hidden");
    input2.attr("name","user_id");
    input2.attr("value",token);
    form.append(input2);
    form.submit();//表单提交
});
