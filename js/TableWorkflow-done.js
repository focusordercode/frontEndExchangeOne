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
var tableID = Request.id;
var template_id = Request.template_id;
var type_code = 'info';
console.log(tableID);
console.log(template_id);
console.log(type_code);

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址

// register the grid component
Vue.component('demo-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  }
})

Vue.filter('startBtn',function(value){
    var str1 = ''; //隐藏
    var str2 = 'yes';//显示
    if(value=='enabled'){
        return str1
    }else{
        return str2
    }
})

var oTableIn = new Vue({
    el:'body',
    data:{
        info:'',
        gridColumns: [],
        gridData: [],
        downloadBtn:'',
        newData:''
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
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器获取表格信息失败');
            }
        })

        //获取表头
        $.ajax({
            type:'POST',
            url:serverUrl+'get/bootstrap',
            datatype:'json',
            data:{
                template_id:template_id,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.gridColumns = data.value;
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })

        //获取表格的详细信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/info',
            datatype:'json',
            data:{
                form_id:tableID,
                template_id:template_id,
                type_code:type_code,
                pageSize:1000 //获取全部不分页
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    oTableIn.gridData = data.value;
                    Vue.nextTick(function () {
                        FixTable("tablelie", 2, 1400, 650);
                    })
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求表格信息失败');
            }
        })
    },
    computed:{
        downloadBtn:function(){
            var gridDataLen = this.gridData.length;
            //根据表格的长度控制下载按钮
            if(gridDataLen>=2){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //下载表格
        downloadTable:function(){
            if(tableID){
                window.location.href = serverUrl+'export?form_id='+tableID;
            }
        },
        //启用表格
        startTable:function(){
            if(tableID){
                $.ajax({
                    type:'POST',
                    url:serverUrl+'use/infoform',
                    datatype:'json',
                    data:{
                        id:tableID,
                        type_code:type_code
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('启用成功');
                            oTableIn.info.status_code = 'enabled';
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求表格信息失败');
                    }
                })
            }
        },
        //返回上一步
        takeBack:function(){
            var vm = this;
            layer.confirm('返回上一步，此步骤的数据将不保存',{
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
                            var template_id = vm.info.template_id;
                            //跳转函数
                            function goNext() {
                                var url = 'TableWorkflow-edit.html';
                                window.location.href = url+'?id='+tableID+'&template_id='+template_id;
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
        }
    }
})

$(function(){
    //检测滚动条位置，显示隐藏页面头部
    $(window).scroll(function(){
       if($(window).scrollTop() > 50){
           $('.tableTop').slideUp(300);
       }
    })

    //页面顶部隐藏显示
    $('.pullUP').on('click',function(){
        $('.tableTop').slideUp(300);
    });

    $('.pullDown').on('click',function(){
        $('.tableTop').slideDown(300);
        $('.tableTop').css({'overflow':'visible'});
    });
})

//冻结函数
function FixTable(TableID, FixColumnNumber, width, height) {
    if ($("#" + TableID + "_tableLayout").length != 0) {
        $("#" + TableID + "_tableLayout").before($("#" + TableID));
        $("#" + TableID + "_tableLayout").empty();
    }
    else {
        $("#" + TableID).after("<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");
    }

    $('<div id="' + TableID + '_tableFix"></div>'
        + '<div id="' + TableID + '_tableHead"></div>'
        + '<div id="' + TableID + '_tableColumn"></div>'
        + '<div id="' + TableID + '_tableData"></div>').appendTo("#" + TableID + "_tableLayout");


    var oldtable = $("#" + TableID);

    var tableFixClone = oldtable.clone(true);
    tableFixClone.attr("id", TableID + "_tableFixClone");
    $("#" + TableID + "_tableFix").append(tableFixClone);
    var tableHeadClone = oldtable.clone(true);
    tableHeadClone.attr("id", TableID + "_tableHeadClone");
    $("#" + TableID + "_tableHead").append(tableHeadClone);
    var tableColumnClone = oldtable.clone(true);
    tableColumnClone.attr("id", TableID + "_tableColumnClone");
    $("#" + TableID + "_tableColumn").append(tableColumnClone);
    $("#" + TableID + "_tableData").append(oldtable);

    $("#" + TableID + "_tableLayout table").each(function () {
        $(this).css("margin", "0");
    });


    var HeadHeight = $("#" + TableID + "_tableHead thead").height();
    HeadHeight += 2;
    $("#" + TableID + "_tableHead").css("height", HeadHeight);
    $("#" + TableID + "_tableFix").css("height", HeadHeight);


    var ColumnsWidth = 0;
    var ColumnsNumber = 0;
    $("#" + TableID + "_tableColumn tr:last td:lt(" + FixColumnNumber + ")").each(function () {
        ColumnsWidth += $(this).outerWidth(true);
        ColumnsNumber++;
    });
    ColumnsWidth += 2;
    if ($.browser.msie) {
        switch ($.browser.version) {
            case "7.0":
                if (ColumnsNumber >= 3) ColumnsWidth--;
                break;
            case "8.0":
                if (ColumnsNumber >= 2) ColumnsWidth--;
                break;
        }
    }
    $("#" + TableID + "_tableColumn").css("width", ColumnsWidth);
    $("#" + TableID + "_tableFix").css("width", ColumnsWidth);


    $("#" + TableID + "_tableData").scroll(function () {
        $("#" + TableID + "_tableHead").scrollLeft($("#" + TableID + "_tableData").scrollLeft());
        $("#" + TableID + "_tableColumn").scrollTop($("#" + TableID + "_tableData").scrollTop());
    });

    $("#" + TableID + "_tableFix").css({ "overflow": "hidden", "position": "relative", "z-index": "50", "background-color": "Silver" });
    $("#" + TableID + "_tableHead").css({ "overflow": "hidden", "width": width - 17, "position": "relative", "z-index": "45", "background-color": "Silver" });
    $("#" + TableID + "_tableColumn").css({ "overflow": "hidden", "height": height - 17, "position": "relative", "z-index": "40", "background-color": "Silver" });
    $("#" + TableID + "_tableData").css({ "overflow": "scroll", "width": width, "height": height, "position": "relative", "z-index": "35" });

    $("#" + TableID + "_tableFix").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableHead").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableColumn").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableData").offset($("#" + TableID + "_tableLayout").offset());

    if ($("#" + TableID + "_tableHead").width() > $("#" + TableID + "_tableFix table").width()) {
        $("#" + TableID + "_tableHead").css("width", $("#" + TableID + "_tableFix table").width());
        $("#" + TableID + "_tableData").css("width", $("#" + TableID + "_tableFix table").width() + 17);
    }
    if ($("#" + TableID + "_tableColumn").height() > $("#" + TableID + "_tableColumn table").height()) {
        $("#" + TableID + "_tableColumn").css("height", $("#" + TableID + "_tableColumn table").height());
        $("#" + TableID + "_tableData").css("height", $("#" + TableID + "_tableFix table").height() + 17);
    }
}