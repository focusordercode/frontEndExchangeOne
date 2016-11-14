//获取ID
function UrlSearch() {
    var name,value; 
    var str=location.href; 
    var num=str.indexOf("?");
    str=str.substr(num+1);
    
    var arr=str.split("&"); 
    for(var i=0;i < arr.length;i++){ 
        num=arr[i].indexOf("="); 
        if(num>0){ 
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        } 
    } 
}
var Request=new UrlSearch();
var type_code = 'info';
var tableID = Request.id;
var template_id = Request.template_id;
console.log(type_code);
console.log(tableID);
console.log(template_id);

console.log(serverUrl); //后端接口地址
var oUrl = serverUrl;//图片服务器地址

//未提交保存内容提示
// $(window).bind('beforeunload',function(){return "您修改的内容尚未保存，确定离开此页面吗？";});


var pageSize = 100;//默认每页展示多少数据，加载时用,修改这里时把data的pageSize一起改
var oPageNow; //当前页全局变量，暂存异步刷新用

var oTableIn = new Vue({
    el:'body',
    data:{
        info:'',
        //默认值
        defaultVal:'',
        variantVal:'',
        chioce:'',
        //填写规则
        fillRule:{
            sku_front:'',
            sku_num1:'',
            sku_num2:'',
            quantity1:'',
            quantity2:'',
            priceUsd1:'',
            priceUsd2:'',
            priceGbp1:'',
            priceGbp2:'',
            weight1:'',
            weight2:'',
            size1:'',
            size2:''
        },
        //数据检查数据
        checkData:'',
        //1是唯一，2是重复
        checkTyle:[
            1,
            2
        ],
        //检查结果
        checkRultData:''
    },
    ready:function(){
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        //获取表格信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/oneform',
            datatype:'json',
            data:{
                id:tableID,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.info = data.value[0];
                }else if(data.status==101){
                    layer.msg('操作失败');
                }else if(data.status==102){
                    layer.msg('表格的id为空');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器获取表格信息失败');
            }
        })


        //获取默认值
        $.ajax({
            type:'POST',
            url:serverUrl+'get/editdefault',
            datatype:'json',
            data:{
                form_id:tableID,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.defaultVal = data.value.default;
                    oTableIn.variantVal = data.value.variant;
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求默认值失败');
            }
        })

        //获取数据检查数据
        $.ajax({
            type:'POST',
            url:serverUrl+'get/checkrule',
            datatype:'json',
            data:{
                form_id:tableID,
                type_code:type_code
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    oTableIn.checkData = data.value;
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求数据检查数据失败');
            }
        })
    },
    computed:{
        //自动填表按钮
        fillBtn:function () {
            var setdatatong = this.defaultVal,setdatabian = this.variantVal;
            var arr1 = [],arr2 = [];
            for(var x in setdatatong){
                arr1.push(x);
            }
            for(var i in setdatabian){
                arr1.push(i);
            }
            if (arr1.length<1&&arr2.length<1) {
                return false
            }else{
                return true
            }
        },
        //控制数据检查按钮
        checkBtn:function () {
            if(this.checkData){
                return true
            }else{
                return false
            }
        },
        //数据检查前往修改按钮
        goXgCheckBtn:function () {
            var checkRultData = [], checkRultData = this.checkRultData;
            var arr = [];//收集收据数组
            for (var i = 0;i<checkRultData.length;i++) {
                var str = '数据无误';
                if (checkRultData[i].value ==str) {
                    arr.push(i);
                }
            }

            if(arr.length==checkRultData.length){
                return true //全部通过
            }else{
                return false //有未通过项
            }
        }
    },
    methods:{
        //返回上一步
        takeBack:function(){
            var vm = this;
            layer.confirm('返回上一步，此步骤的数据将不保存,上一步骤的数据也将被删除',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                $.ajax({
                    type:'POST',
                    url:serverUrl+'rollback/checkinfo',
                    datatype:'json',
                    data:{
                        form_id:tableID
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('请求成功');

                            //解除未提交内容提示
                            $(window).unbind('beforeunload');

                            //跳转函数
                            function goNext() {
                                var url = 'TableWorkflow-selectPic.html';
                                window.location.href = url+'?id='+tableID;
                            }

                            setInterval(goNext,1000);

                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求撤销返回失败');
                    }
                })
            })
        },
        //删除常规默认值
        removeDeval:function (key) {
            var vm = this;
            Vue.delete(vm.defaultVal,key);
        },
        //删除变体默认值
        removeVaval:function (key) {
            var vm = this;
            Vue.delete(vm.variantVal,key);
        },
        //发起自动填表
        fillTable:function () {
            var vm = this;
            var DefaultData = vm.defaultVal;
            var VariantData = vm.variantVal;

            //检查录入项是否为空
            var checkArr1 = [];
            var checkArr2 = [];
            for(var x in DefaultData){
                if (!(DefaultData[x].trim())) {
                    checkArr1.push(x)
                }
            }
            for(var n in VariantData){
                if (!(VariantData[n][0].trim())&&!(VariantData[n][1].trim())) {
                    checkArr2.push(n)
                }
            }

            //对为空的项进行判断提示
            if (checkArr1.length>0&&checkArr2.length>0) {
                var str = '常规的和变体的有项目未填'+'<br/>'+'不填写的应删除';
                layer.alert(str, function(index){
                  layer.close(index);
                });
            }else if (checkArr1.length>0) {
                var str = '常规的有项目未填'+'<br/>'+'不填写的应删除';
                layer.alert(str, function(index){
                  layer.close(index);
                });
            }else if (checkArr2.length>0) {
                var str = '变体的有项目未填'+'<br/>'+'不填写的应删除';
                layer.alert(str, function(index){
                  layer.close(index);
                });
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                var getdata = {};
                    getdata.default = DefaultData,
                    getdata.variant = VariantData;
                $.ajax({
                    type:'POST',
                    url:serverUrl+'autofill/product',
                    datatype:'json',
                    data:{
                        table_info:vm.info,
                        getdata:getdata,
                        reludata:vm.fillRule
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            layer.msg('请求成功');
                            //解除未提交内容提示
                            $(window).unbind('beforeunload');

                            setInterval(windowFresh,1000);
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //发送数据检查请求
        checkRequest:function () {
            var vm = this;
            var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
            $.ajax({
                type:'POST',
                url:serverUrl+'data/check',
                datatype:'json',
                data:{
                    form_id:vm.info.id,
                    type_code:type_code,
                    check:vm.checkData
                },
                success:function(data){
                    console.log(data);
                    layer.close(LoadIndex); //关闭遮罩层
                    if(data.status==100){
                        layer.msg('请求成功');
                        vm.checkRultData = data.value;
                    }else{
                        layer.msg(data.msg);
                    }
                },
                error:function(jqXHR){
                    layer.close(LoadIndex); //关闭遮罩层
                    layer.msg('向服务器请求失败');
                }
            })
        },
        //前往修改数据
        goXgCheck:function () {
            var vm = this,
                template_id = vm.info.template_id;
            if (template_id&&tableID) {
                var url = 'changeTableData.html?id='+tableID+'&template_id='+template_id+'&type_code='+type_code;
                window.open(url);
            }
        }
    }
})

$(document).ready(function(){
    //获取表格数据
    var headers,gridData,cols = [];
    var str1 = '<button class="btn btn-sm btn-success btn-main">主体</button><button class="btn btn-sm btn-info btn-var">变体</button><button class="btn btn-sm btn-danger btn-delete">删除</button>';
    var str2 = '<button class="btn btn-sm btn-danger btn-delete">删除</button>';
    function getAllData () {
        getHeaders ();
        getgridData ();
    }

    //获取表头
    function getHeaders() {
        $.ajax({
            type:'POST',
            url:serverUrl+'get/bootstrap',
            datatype:'json',
            async: false,
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    headers = data.value;
                    //设置cols和headers
                    if (headers.length) {
                        for(var i = 0;i<headers.length;i++){
                            var obj = {};
                            obj.data = headers[i];
                            cols.push(obj);
                        }
                        //额外cols
                        var obj1 = {},obj2 = {},obj3 = {},obj4 = {},obj5 = {};
                            obj1.data = 'product_id';
                            obj1.readOnly = true;
                            obj2.data = 'parent_id';
                            obj2.readOnly = true;
                            obj3.data = '操作';
                            obj3.renderer = "html";
                            obj3.readOnly = true;
                            obj4.data = 'types';
                            obj4.readOnly = true;
                            obj5.data = 'photo';
                            obj5.readOnly = true;
                            obj5.renderer = coverRenderer;
                        cols.unshift(obj5);    
                        cols.unshift(obj2);    
                        cols.unshift(obj1);
                        cols.unshift(obj4);
                        cols.unshift(obj3);

                        //添加表头数据
                        headers.unshift('photo');
                        headers.unshift('parent_id');
                        headers.unshift('product_id');
                        headers.unshift('types');
                        headers.unshift('操作');
                    }
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })
    }
    //获取表格数据
    function getgridData () {
        //获取缓存数据
        $.ajax({
            type:'POST',
            url:serverUrl+'get/info',
            datatype:'json',
            async: false,
            data:{
                form_id:tableID,
                template_id:template_id,
                type_code:type_code,
                status:'preview',
                pageSize:pageSize //每页展示多少数据
            },
            success:function(data){
                if(data.status==100){
                    gridData = data.value;

                    if(gridData.length){
                        for (var i = 0;i<gridData.length;i++) {
                            if(gridData[i].parent_id!=0){
                                gridData[i]['操作'] = str2;
                            }else{
                                gridData[i]['操作'] = str1;
                            }
                        }
                    }

                }else if(data.status==101){
                    // layer.msg('数据为空');
                }else if(data.status==102){
                    layer.msg('获取表格的ID为空');
                }else if(data.status==111){
                    layer.msg('表格没有数据');
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表格数据失败');
            }
        })
    }

    getAllData ();

    // console.log(headers)
    console.log(gridData)
    // console.log(cols)

    //handsontable实例
    var container = document.getElementById('table');

    var hot = new Handsontable(container, {
        data: gridData,
        rowHeaders: true,
        colHeaders: headers,
        columns:cols,
        stretchH: 'all',
        autoWrapRow: true,
        // hiddenColumns: {
        //     columns:[1,2,3]
        // },
        // colWidths:150,
        // rowHeights:30,
        width:1400,
        height:800,
        autoRowSize: true,
        autoColSize: false,
        fixedColumnsLeft: 5
    });


    //主体添加方法
    $(document).on('click','.btn-main',function() {
        hot.render();//获取前先把表格渲染一次,防止修改的没有获取到
        var rowIndex = hot.getSelected();//获取选中行的索引,返回是数组,下标0为当前行索引
        if(rowIndex.length){
            var product_id = getId();
            var rowDatas = $.extend(true, {}, gridData[rowIndex[0]]);//获取选中行的值
            rowDatas.product_id = product_id;//修改product_id
            rowDatas.types = 'yes';//标记是新增，后台需要
            gridData.push(rowDatas);
            hot.render();//渲染表格
            layer.msg('操作成功',{time:1000});
        }
    })

    //变体添加方法
    $(document).on('click','.btn-var',function() {
        hot.render();//获取前先把表格渲染一次,防止修改的没有获取到
        var rowIndex = hot.getSelected();//获取选中行的索引,返回是数组,下标0为当前行索引
        if(rowIndex.length){
            var product_id = getId();
            var rowDatas = $.extend(true, {}, gridData[rowIndex[0]]);//获取选中行的值
            var parent_id = rowDatas.product_id;//获取produ_id,用做变体的parent_id
                rowDatas['操作'] = str2; //修改操作区内容
                rowDatas.types = 'yes';//标记是新增，后台需要
                //赋值两个id
                rowDatas.product_id = product_id;
                rowDatas.parent_id = parent_id;
            gridData.splice(rowIndex[0]+1,0,rowDatas);//把新的变体数据添加进去
            hot.render();//渲染表格
            layer.msg('操作成功',{time:1000});
        }
    })

    //删除方法
    $(document).on('click','.btn-delete',function() {
        hot.render();//获取前先把表格渲染一次,防止修改的没有获取到
        var rowIndex = hot.getSelected();//获取选中行的索引,返回是数组,下标0为当前行索引
        if(rowIndex.length){
            if(rowIndex[0]==0){
                layer.msg('模板数据不可以删除');
            }else if(gridData[rowIndex[0]].parent_id!=0){ //删除变体
                var product_id = gridData[rowIndex[0]].product_id;//获取product_id
                //执行删除函数并且确认是否删除成功
                var deleteconfirm = dRequest(product_id); 
                if(deleteconfirm==1){
                    hot.alter('remove_row',rowIndex[0],1);
                    layer.msg('删除成功',{time:1000});
                }
            }else if(gridData[rowIndex[0]].parent_id==0){ //删除主体
                var product_id = gridData[rowIndex[0]].product_id;//获取product_id
                //执行删除函数并且确认是否删除成功
                var deleteconfirm = dRequest(product_id);
                if(deleteconfirm==1){
                    var gridDataLen = gridData.length;
                    var oDelete = [];
                    for(var i = 0;i<gridDataLen;i++){
                        if(gridData[i].parent_id==product_id){
                            oDelete.push(i);
                        }
                    }
                    var deleteLen = oDelete.length + 1;//统计删除的个数,加上主体本身
                    hot.alter('remove_row',rowIndex[0],deleteLen);//删除主体及其变体方法
                    layer.msg('删除成功',{time:1000});
                }
            }else{
                layer.msg('未知错误');
            }
        }
    })

    //获取product_id的函数
    function getId() {
        var a;
        $.ajax({
            type:'POST',
            url:serverUrl+'get/sysId',
            datatype:'json',
            async:false,
            data:{
                app_code:'product_information',
                num:1
            },
            success:function(data){
                if(data.status==100){
                    a = data.value[0];
                }else if(data.status==101){
                    layer.msg('操作失败');
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求增加失败');
            }
        })
        return a
    }

    //发起删除请求
    function dRequest(product_id) {
        var a;
        $.ajax({
            type:'POST',
            url:serverUrl+'delete/product',
            datatype:'json',
            async:false,
            data:{
                type_code:type_code,
                product_id:product_id
            },
            success:function(data){
                if(data.status==100){
                    a = 1;//删除成功
                }else{
                    a = 2;//删除失败
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                a = 2;//删除失败
                layer.msg('向服务器请求删除失败');
            }
        })
        return a
    }

    //photo
    function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
       var escaped = Handsontable.helper.stringify(value),
         img;
     
       if (escaped.indexOf('http') === 0) { //该链接字符串http首次出现的位置是0的情况下
         img = document.createElement('IMG');
         img.src = value;
         img.width = 50;
         img.height = 50;

         Handsontable.Dom.addEvent(img, 'mousedown', function (e){
           e.preventDefault(); // prevent selection quirk
         });
     
         Handsontable.Dom.empty(td);
         td.appendChild(img);
       }
       else {
         // render as text
         Handsontable.renderers.TextRenderer.apply(this, arguments);
       }
     
       return td;
     }

    //提交暂存
    $('.cacheData').on('click',function(){
        hot.render();//获取前先把表格渲染一次,防止修改的没有获取到
        tableData = hot.getData();
        console.log(tableData);
        console.log(gridData);
        var gridColumns = headers.slice();
        console.log(gridColumns);
        //暂存
        var vm = oTableIn;
        var max = tableData.length;
        console.log(type_code);
        layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:serverUrl+'commit/data',
            datatype:'json',
            data:{
                category_id:vm.info.category_id,
                template_id:vm.info.template_id,
                form_id:vm.info.id,
                type_code:type_code,
                max:max,
                gridColumns:gridColumns,
                gridData:tableData
            },
            success:function(data){
                layer.closeAll(); //关闭遮罩层
                if (data.status==100) {

                    layer.msg('暂存成功');
                    //解除未提交内容提示
                    // $(window).unbind('beforeunload');

                    setInterval(windowFresh,1000);
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.closeAll(); //关闭遮罩层
                layer.msg('向服务器请求暂存失败');
            }
        })
    })

    //检测滚动条位置，显示隐藏页面头部
    // $(window).scroll(function(){
    //    if($(window).scrollTop() > 50){
    //        $('.panel-top').slideUp(300);
    //        $('.pullDown').show();
    //    }
    // })

    $('.pullUP').click(function(){
        $('.panel-top').slideUp(300);
        $('.pullDown').show();
    });

    $('.pullDown').click(function(){
        $('.panel-top').slideDown(300);
        $('.pullDown').hide();
    });

    //回到顶部
    $('.scrollToTop').click(function(){
        $("html,body").animate({scrollTop:0},300);
    });
});

//刷新函数
function windowFresh() {
    location.reload(true);
}