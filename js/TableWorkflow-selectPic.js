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
        rand_id:''
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
            var picDataLen = this.picData.length;
            if(picDataLen>0){
                return false
            }else{
                return true
            }
        }
    },
    methods:{
        //选择图片目录
        selectPicfolder:function(){
            var cateId = selectPic.tableInfo.category_id;
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
                        if(data.status==100){
                            layer.msg('筛选成功');
                            selectPic.picData = data.value;
                            selectPic.num_now = data.num_now;
                            selectPic.not_enough = data.not_enough;
                            selectPic.count = data.count;
                            selectPic.rand_id = data.rand_id;
                        }else{
                            layer.msg(data.msg);
                            selectPic.picData= '';
                            selectPic.num_now = '';
                            selectPic.not_enough = '';
                            selectPic.count = '';
                            selectPic.rand_id = '';
                        }
                    },
                    error:function(jqXHR){
                        layer.msg('向服务器获取请求图片失败');
                    }
                })
            }
        },
        //跳转上传步骤
        NextStep:function(){
            var not_enough = this.not_enough;
            if(not_enough!=0){
                layer.msg('图片不足');
            }else{
                var url = 'TableWorkflow-upload.html';
                var tableID = selectPic.tableInfo.id;
                var rand_id = selectPic.rand_id;
                var pic_rate = selectPic.pic_rate;
                var pro_rate = selectPic.pro_rate;
                window.location.href = url+'?tableID='+tableID+'&rand_id='+rand_id+'&pic_rate='+pic_rate+'&pro_rate='+pro_rate;
            }
        }
    }
})

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


//点击图片目录树形菜单
$(document).on('click','.tree .item .label',function(){
    $('.tree .item .label').removeClass('label-success').addClass('label-primary');
    $(this).removeClass('label-primary').addClass('label-success');
});
