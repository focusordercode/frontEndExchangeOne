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
var type_code = 'batch';
var template_id = Request.template_id;
var visit = Request.visit;
console.log(serverUrl); //后端接口地址

var oTableIn = new Vue({
    el:'body',
    data:{
        info:'',
        gridData: [],
        downloadBtn:'',
        makeExcelBtn:'',//生成表格按钮
        downLink:'',
        productSelect:'',
        visitType:visit
    },
    ready:function(){
        //获取表格信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/oneform',
            datatype:'json',
            data:{
                key:oKey,
                user_id:token,
                id:tableID,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    oTableIn.info = data.value[0];
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
            error:function(jqXHR){
                layer.msg('向服务器获取表格信息失败');
            }
        })
    },
    computed:{
        downloadBtn:function(){
            if(this.info.url){
                return true
            }else{
                return false
            }
        },
        //生成表格按钮
        makeExcelBtn:function(){
            var gridDataLen = this.gridData.length;
            if(gridDataLen>=2){
                return false
            }else{
                return true
            }
        },
        //下载地址
        downLink:function(){
            if(this.url){
                return this.url
            }else{
                return 'javascript:'
            }
        }
    },
    methods:{
        //生成表格
        makeExcel:function(){
            var vm = this;
            var creator_id = cookie.get('id');
            layer.confirm('生成表格需要较长时间请耐心等待',{
                btn:['确定','取消']
            },function(index){
                layer.close(index);

                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                $.ajax({
                    type:'POST',
                    url:serverUrl+'set/excel',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        form_id:tableID,
                        productSelect:vm.productSelect,
                        template_id:template_id
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            vm.info.url = data.url;
                            layer.msg('生成表格成功');
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
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求生成表格失败');
                    }
                })
            })
        },
        //匹配UPC
        oFitUPC:function(){
            if(tableID){
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层

                $.ajax({
                    type:'POST',
                    url:serverUrl+'marry_upc',
                    datatype:'json',
                    data:{
                        key:oKey,
                        user_id:token,
                        form_id:tableID
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            layer.msg('请求成功');

                            function windowFresh(){
                                location.reload(true);
                            }

                            setInterval(windowFresh,1000);
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
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },

    }
})

$(document).ready(function(){

    var headers,gridData,cols = [];
    //获取数据函数
    function getAallData () {
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        //获取表头
        $.ajax({
            type:'POST',
            url:serverUrl+'get/bootstrap',
            datatype:'json',
            async: false,
            data:{
                key:oKey,
                user_id:token,
                template_id:template_id,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    headers = data.value;
                    //设置cols
                    if (headers.length) {
                        for(var i = 0;i<headers.length;i++){
                            // if(headers[i]=='main_image_url'){
                            //     var obj = {};
                            //     obj.data = headers[i];
                            //     obj.renderer = coverRenderer;
                            //     cols.push(obj);
                            // }else{
                            //     var obj = {};
                            //     obj.data = headers[i];
                            //     cols.push(obj);
                            // }
                            var obj = {};
                            obj.data = headers[i];
                            cols.push(obj);
                        }
                        //额外cols
                        var obj1 = {},obj2 = {};
                            obj1.data = 'product_id';
                            obj2.data = 'parent_id';
                        cols.unshift(obj2);    
                        cols.unshift(obj1);

                        //添加表头数据
                        headers.unshift('parent_id');
                        headers.unshift('product_id');
                    }
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
            error:function(jqXHR){
                layer.msg('向服务器请求表头信息失败');
            }
        })

        //获取表格的详细信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/info',
            datatype:'json',
            async: false,
            data:{
                key:oKey,
                user_id:token,
                form_id:tableID,
                template_id:template_id,
                type_code:type_code,
                status:'preview',
                pageSize:1000 //获取全部不分页
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    gridData = data.value;
                    //赋值给vue示例
                    oTableIn.gridData = gridData;
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
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求表格信息失败');
            }
        })
    }

    getAallData ();

    // console.log(gridData);
    console.log(headers);
    console.log(cols);
    //handsontable实例
    var container = document.getElementById('table');
    var hot = new Handsontable(container, {
      data: gridData,
      rowHeaders: true,
      colHeaders: headers,
      columns:cols,
      stretchH: 'all',
      autoWrapRow: true,
      hiddenColumns: {
          columns:[0,1]
      },
      readOnly: true,
      // colWidths:150,
      // rowHeights:30,
      width:1400,
      height:650,
      autoRowSize: false,
      autoColSize: false,
      fixedColumnsLeft: 3
    });
    
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

    //检测滚动条位置，显示隐藏页面头部
    $(window).scroll(function(){
       if($(window).scrollTop() > 50){
           $('.fixed-top').slideUp(300);
           $('#table').css('margin-top','30px');
       }
    })

    //页面顶部隐藏显示
    $('.pullUP').on('click',function(){
        $('.fixed-top').slideUp(300);
        $('#table').css('margin-top','30px');
    });

    $('.pullDown').on('click',function(){
        $('.fixed-top').slideDown(300);
        $('.fixed-top').css({'overflow':'visible'});
        $('#table').css('margin-top','255px');
    });
});