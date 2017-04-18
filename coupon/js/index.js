/**
 * Created by Administrator on 2017/4/11.
 */



console.log(serverUrl);
var pages = 10;
var info = new Vue({
    el:'body',
    data:{
        isShow:false,//表格创建
        tableInfo:{//生成批次表单需要的字段
            name:'',
            couponType:'',
            minConsume:'',
            faceValue:'',
            preNumber:'',
            price:'',
            singleNumber:'',
            startDate:'',
            endDate:'',
            description:''
        },
        list:[],//批次表单列表
        count_page:'',//总页数
        page:'',//当前页
        num:1,//翻页
        searchPage:'',
        sel:''//切换状态查询
    },
    ready:function () {
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        if(this.num == 0){
            var numKey = this.num+1;
        }else{
             numKey = this.num
        }
        $.ajax({
            type: "POST",
            url: serverUrl + "coupon/couponsList", //添加请求地址的参数
            dataType: "json",
            data: {
                key:oKey,
                user_id:token,
                num:pages,
                page:numKey
            },
            success: function (data) {
                console.log(data);
                layer.close(LoadIndex);
                if (data.status==100) {
                    info.list = data.value;
                    info.count_page = data.pages.count_page;
                    info.page = data.pages.page;
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
        })
    },
    methods: {
        creat: function () {
            this.isShow = !this.isShow
        },
        selected : function (id) {
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            if(this.num == 0){
                var numKey = this.num+1;
            }else{
                numKey = this.num
            }
            console.log(id);
            $.ajax({
                type: "POST",
                url: serverUrl + "coupon/couponsList", //添加请求地址的参数
                dataType: "json",
                data: {
                    key:oKey,
                    user_id:token,
                    num:pages,
                    page:numKey,
                    issuant_status:id
                },
                success: function (data) {
                    console.log(data);
                    layer.close(LoadIndex);
                    if (data.status==100) {
                        info.list = data.value;
                        info.count_page = data.pages.count_page;
                        info.page = data.pages.page;
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
            })
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
            var flag = isDateBetween(startDate,endDate);
            if (!name) {
                layer.msg('请填写优惠券名称')
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
            } else if (!flag) {
                layer.msg('开始时间不能大于结束时间')
            } else {
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponsCreate", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        name: name,
                        type: 1,
                        min_amount: minConsume,
                        denomination: faceValue,
                        price: price,
                        issuant_amount: preNumber,
                        restriction_amount: singleNumber,
                        validity_begin: startDate,
                        validity_end: endDate,
                        remark: description
                    },
                    success: function (data) {
                        console.log(data);

                       /* if(data.status==100){
                            layer.msg("创建成功");
                            info.getList();
                            $('#myModal').modal('hide')
                        }*/
                       console.log(data.status);
                        if(data.status==100){
                            layer.msg("创建成功");
                            setTimeout(function(){
                                getData();
                                layer.close(LoadIndex); //关闭遮罩层
                            },2000);

                            $('#myModal').modal('hide')
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }else{
                            layer.close(LoadIndex); //关闭遮罩层
                            layer.msg(data.msg);
                        }

                    },
                    error: function () {
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        void:function (id) {
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
                        if(data.status=='100'){
                            layer.msg(data.msg);
                            getData()
                        } if (data.status==100) {
                            layer.msg(data.msg);
                            getData();
                            layer.close(LoadIndex);
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

                        layer.msg('向服务器请求失败');
                    }
                });
            });


        },
        deleteData:function (id) {
            layer.confirm('是否作废?', {
                btn: ['确定','关闭'] //按钮
            },function () {
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/couponsVoid", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id
                    },
                    success: function (data) {
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
            })

        },
        issue:function (id) {
            layer.confirm('确认发行?', {
                btn: ['确定','关闭'] //按钮
            },function () {
                $.ajax({
                    type: "POST",
                    url: serverUrl + "coupon/releaseCoupon", //添加请求地址的参数
                    dataType: "json",
                    data: {
                        key:oKey,
                        user_id:token,
                        id:id
                    },
                    success: function (data) {
                        console.log(data);
                        if(data.status==100){
                            layer.msg("发行成功");
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
                            layer.msg('向服务器请求失败');
                        }

                });
            });

        },
        publish:function (list_id) {
            location.href = "index-info.html?id=" + list_id
        },
        goNext:function () {
            this.num++;
            if(this.num > this.count_page){
                layer.msg("已经是最后一页了");
                this.num = this.count_page;
            }else{
                getPageData(this.num)
            }
        },
        goPre:function () {
            this.num--;
            if(this.num < 1){
                layer.msg("已经是第一页了");
                this.num = 1;
            }else{
                getPageData(this.num)
            }
        },
        go:function () {
            if(this.searchPage>this.count_page || this.searchPage <1){
                layer.msg("不在跳转范围内")
            }else{
                getPageData(this.searchPage);
            }
        }


    }
});
function getData() {
    $.ajax({
        type: "POST",
        url: serverUrl + "coupon/couponsList", //添加请求地址的参数
        dataType: "json",
        data: {
            key:oKey,
            user_id:token,
            num:pages,
            page:info.num
        },
        success: function (data) {
            console.log(data);
            if (data.status==100) {
                info.list = data.value;
                info.count_page = data.pages.count_page;
                info.page = data.pages.page;
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
//获取分页函数
function getPageData (num) {
    var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
    $.ajax({
        type: "POST",
        url: serverUrl + "coupon/couponsList", //添加请求地址的参数
        dataType: "json",
        data: {
            key:oKey,
            user_id:token,
            num:pages,
            page:num
        },
        success: function (data) {
            console.log(data);
            if (data.status==100) {
                info.list = data.value;
                info.count_page = data.pages.count_page;
                info.page = data.pages.page;
                info.num = num;
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
            }
        },
        error: function () {
            layer.close(LoadIndex); //关闭遮罩层
            layer.msg('向服务器请求失败');
        }
    });

}

/* 时间控件 */
$(".date").datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss',
    minView: 0,
    autoclose: true,
    minuteStep:1
});


/*  2014-04-20 10:10:10转换成时间戳 */
function getTime(day){
    re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
    return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;
}
/*时间是否在区间内*/
function isDateBetween(startDateString, endDateString) {
    var flag = false;
    var startDateString = getTime(startDateString);
    var endDateString = getTime(endDateString);
    if(startDateString < endDateString){
        flag = true;
    }
    return flag;
}
