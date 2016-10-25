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
var Id = Request.id;
var type_code = 'info';

var serverUrl = "http://192.168.1.42/canton/"; //后端接口地址
var oUrl = 'http://192.168.1.42/canton';//图片服务器地址
var search = "http://192.168.1.42/canton/index.php/vague/name"; //模糊搜索地址

// 图片目录树形菜单的组件
Vue.component('tree', {
  template: '#pic-template',
  props:{
    pictree:Object
  },
  data: function () {
    return {
      open: false
    }
  },
  computed: {
    isFolderP: function () {
      return this.pictree.children &&
        this.pictree.children.length
    }
  },
  methods: {
    //点击图片目录
    toggle: function (pictree) {
      if (this.isFolderP) {
        this.open = !this.open
      }

      //点击目录
      selectPic.selectedPic = pictree.cn_name;
      selectPic.selectedPicId = pictree.id;
    }
  }
})


//Vue实例
var selectPic = new Vue({
    el:'body',
    data:{
        TableEdit:'',
        tableInfo:'',
        pictree:{},
        selectedPic:'',
        selectedPicId:'',
        pic_rate:'',
        pro_rate:'',
        re_date:'',
        file_type:'',
        getPic:'',   //控制筛选图片按钮的可用状态
        picData:'',  //筛选到的图片数据
        num_now:'',
        not_enough:0,
        count:'',
        rand_id:'',
        seeMore:false,
        //产品
        proList:'', //类目
        relateList:'', //产品
        pro:'',
        relate:'',
        relateValList:[],
        //整合了的表格数据
        tableHead:'',
        tableData:''
    },
    ready:function(){
        //获取表格信息
        $.ajax({
            type:'POST',
            url:serverUrl+'get/oneform',
            datatype:'json',
            data:{
                id:Id,
                type_code:type_code
            },
            success:function(data){
                if(data.status==100){
                    selectPic.tableInfo = data.value[0];
                }
            },
            error:function(jqXHR){
                layer.msg('向服务器获取表格信息失败');
            }
        })
    },
    computed:{
        //控制筛选图片按钮
        getPic:function(){
            if(!this.selectedPicId){
                return true
            }else{
                return false
            }
        },
        //控制进入下一步骤按钮
        NextStepStatus:function(){
            var headLen = this.tableHead.length;
            var tableDataLen = this.tableData.length;
            if(headLen>0&&tableDataLen>0){
                return false
            }else{
                return true
            }
        },
        //控制选择产品区域
        pro_zone:function () {
            if(this.picData&&this.not_enough==0){
                return false
            }else{
                return true
            }
        },
        //匹配按钮
        fitBtn:function () {
            if (this.relateValList.length>0) {
                return false
            }else{
                return true
            }
        },
        //图片展示表格显示
        PicTable:function () {
            if (this.picData.length>0&&this.tableHead.length<1) {
                return true
            }else{
                return false
            }
        }
    },
    methods:{
        //选择图片目录
        selectPicfolder:function(){
            var cateId = this.tableInfo.category_id;
            if(!cateId){
                layer.msg('没有获取到产品类目');
            }else{
                $('.selectPic').modal('show');
                $('.selectPic').css('margin-top','200px');
                $.ajax({
                    type:'POST',
                    url:serverUrl+'get/treeGallery',
                    datatype:'json',
                    data:{
                        category_id:cateId
                    },
                    success:function(data){
                        if(data.status==100){
                            selectPic.pictree = data.value[0];
                        }else if(data.status==101){
                            selectPic.pictree = data.value;
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求图片目录失败');
                    }
                })
            }
        },
        //重置条件
        resetData:function(){
            this.selectedPic = '';
            this.selectedPicId = '';
            this.pic_rate = 5;
            this.pro_rate = 1;
            this.re_date = 3;
            this.file_type = 'jpg';
        },
        //查看更多
        toSeeMore:function () {
            this.seeMore = true;
        },
        //请求并获取筛选的图片
        searchPic:function(){
            var vm = this;
            var num = vm.tableInfo.product_count;//产品个数
            var category_id = vm.tableInfo.category_id;
            var gallery_id = vm.selectedPicId;
            var pic_rate = vm.pic_rate;
            var pro_rate = vm.pro_rate;
            var re_date = vm.re_date;
            var file_type = vm.file_type;
            if(!gallery_id){
                layer.msg('请先选择图片目录');
            }else{
                var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
                //获取图片信息
                $.ajax({
                    type:'POST',
                    url:serverUrl+'marry/image',
                    datatype:'json',
                    data:{
                        tableID:Id,
                        num:num,
                        category_id:category_id,
                        gallery_id:gallery_id,
                        pic_rate:pic_rate,
                        pro_rate:pro_rate,
                        re_date:re_date,
                        file_type:file_type
                    },
                    success:function(data){
                        layer.close(LoadIndex); //关闭遮罩层
                        if(data.status==100){
                            layer.msg('筛选成功');
                            vm.picData = data.value;
                            vm.num_now = data.num_now;
                            vm.not_enough = data.not_enough;
                            vm.count = data.count;
                            vm.rand_id = data.rand_id;
                            //清空数据
                            vm.tableHead = '';
                            vm.tableData = '';
                            vm.relateValList = [];
                        }else{
                            layer.msg(data.msg);
                            vm.picData= '';
                            vm.num_now = '';
                            vm.not_enough = '';
                            vm.count = '';
                            vm.rand_id = '';
                            //清空数据
                            vm.tableHead = '';
                            vm.tableData = '';
                            vm.relateValList = [];
                        }
                    },
                    error:function(jqXHR){
                        layer.close(LoadIndex); //关闭遮罩层
                        layer.msg('向服务器获取请求图片失败');
                    }
                })
            }
        },
        //从搜索结果中选中一个类目
        selectCate:function(pro){
            this.pro = pro;
            this.proList = '';
            //清空产品
            this.relate = '';
            //清除值，隐藏框
            $('.searchCate').val('');
            $('.searchCompent').hide();
        },
        //从产品搜索结果选择一个产品
        selectRelate:function (relate) {
            this.relate = relate;
            this.relateList = '';
            //清除值，隐藏框
            $('.searchCate2').val('');
            $('.searchCompent2').hide();
        },
        //添加关联
        goRelate:function () {
            var vm = this;
            if (!(this.relate.id)) {
                layer.msg('类目和产品必须要都选择');
            }else{
                var obj = {};
                obj.category_cn = vm.pro.cn_name;
                obj.category_en = vm.pro.en_name;
                obj.cn_name = vm.relate.cn_name;
                obj.en_name = vm.relate.en_name;
                obj.id = vm.relate.id;
                vm.relateValList.push(obj);
                //清空产品
                vm.relate = '';
            }
        },
        //获取匹配的词库
        fitData:function () {
            var vm = this;
            if (vm.relateValList.length>0) {
                var count = vm.count;
                var idArr = vm.relateValList.slice();
                var picData = vm.picData.slice();
                dataSteam(count,idArr,picData,selectPic);
            }else{
                layer.msg('请先选择产品');
            }
        },
        //删除关联
        deleteRelate:function (rList) {
            this.relateValList.$remove(rList);
        },
        //跳转到编辑步骤,发送数据
        NextStep:function () {
            var vm = this;
            if (vm.tableData.length<1) {
                layer.msg('请先选择图片匹配完成');
            }else{
                $.ajax({
                    type:'POST',
                    url:serverUrl+'receive/value',
                    datatype:'json',
                    data:{
                        form_no:vm.tableInfo.form_no,
                        data:vm.tableData
                    },
                    success:function(data){
                        if(data.status==100){
                            layer.msg('请求成功');
                            //跳转函数
                            function goNext() {
                                var url = 'TableWorkflow-edit.html';
                                window.location.href = url+'?id='+Id;
                            }

                            setInterval(goNext,1000);
                        }else{
                            layer.msg(data.msg);
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        }
    }
})


//获取产品所关联的词库内容并合并数据的函数
function dataSteam (num,idArr,picData,vm) {
    var arr = [],
        header = [], //表格的表头总数据
        wordData = [], //表格的总数据
        picAdress = [];
    var defaultHead = ['photo'];

    for (var i = 0;i<idArr.length;i++) {
        arr.push(idArr[i].id)
    }

    for (var h = 0;h<picData.length;h++) {
        picAdress.push(picData[h].path+'/'+picData[h].file_name);
    }


    if (arr.length>0) {
        var LoadIndex = layer.load(3, {shade:[0.3, '#000']}); //开启遮罩层
        $.ajax({
            type:'POST',
            url:serverUrl+'get/good2centervalue',
            datatype:'json',
            data:{
                good_id:arr,
                num:num
            },
            success:function(data){
                layer.close(LoadIndex); //关闭遮罩层
                if(data.status==100){
                    //整合表头
                    var getHead = data.header;
                    header = defaultHead.concat(getHead);

                    wordData = data.value;
                    //把图片数据加进去
                    for(var y = 0;y<picAdress.length;y++){
                        wordData[y].photo=(picAdress[y]);
                    }

                    console.log(wordData);
                    //赋值给vue实例
                    vm.tableHead = header;
                    vm.tableData = wordData;
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(jqXHR){
                layer.close(LoadIndex); //关闭遮罩层
                layer.msg('向服务器请求词库数据失败');
            }
        })
    }
}

Vue.filter('sizeCounter',function(value){
    var str = value;
    str = Math.round(str/1024) + 'kb';
    return str
})

Vue.filter('imgUrl',function(value){
    var str = value;
    var file_name = value.file_name;
    var strLen = str.path.length;
    var strNew = str.path.substr(1,strLen-1);
    strNew = oUrl + strNew + '/'+file_name;
    return strNew
})

Vue.filter('imgUrl2',function(value){
    var str = value;
    var strLen = str.length;
    var strNew = str.substr(1,strLen-1);
    strNew = oUrl + strNew;
    return strNew
})

//点击图片目录树形菜单
$(document).on('click','.tree .item .label',function(){
    $('.tree .item .label').removeClass('label-success').addClass('label-primary');
    $(this).removeClass('label-primary').addClass('label-success');
});

$(function(){
    //搜索类目框
    $('.searchBtn').on('click',function(){
        $('.searchCompent').show();
        $('.searchCompent2').hide();
    })
    $('.closeBtn').on('click',function(){
        $('.searchCompent').hide();
    })

    //搜索产品框
    $('.searchBtn2').on('click',function(){
        $('.searchCompent2').show();
        $('.searchCompent').hide();
    })
    $('.closeBtn2').on('click',function(){
        $('.searchCompent2').hide();
    })
})

//模糊搜索类目
$('.searchCate').on('keyup',function(){
    var getWidth = $('.pors .cate-list').prev('.form-control').innerWidth();
    $('.pors .cate-list').css('width',getWidth);
    var searchCusVal = $('.searchCate').val();

    $.ajax({
        type:'POST',
        url:search,
        datatype:'json',
        data:{
            text:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                selectPic.proList = data.value;
            }else{
                selectPic.proList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求客户信息失败');
        }
    })
});

//搜索产品
$('.searchCate2').on('keyup',function(){
    var getWidth = $('.searchCate2').innerWidth();
    $('.searchCate2').next().css('width',getWidth);
    var searchCusVal = $('.searchCate2').val();

    $.ajax({
        type:'POST',
        url:serverUrl+'get/allproductcenter',
        datatype:'json',
        data:{
            category_id:selectPic.pro_id,
            enabled:1,
            vague:searchCusVal
        },
        success:function(data){
            if(data.status==100){
                selectPic.relateList = data.value;
            }else{
                selectPic.relateList= '';
            }
        },
        error:function(jqXHR){
            layer.msg('向服务器请求失败');
        }
    })
});
