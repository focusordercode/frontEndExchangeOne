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
        TableCreat:'',
        TableEdit:'',
        tableInfo:'',
        tableNum:Request.tableNum,
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
            url:'http://192.168.1.40/PicSystem/canton/get/oneform',
            datatype:'json',
            data:{
                id:Request.tableID,
                type_code:'info'
            },
            success:function(data){
                if(data.status==100){
                    selectPic.tableInfo = data.value[0];
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
    },
    computed:{
        TableCreat:function(){
            return 'TableWorkflow-creat.html'+'?tableID='+Request.tableID;
        },
        //控制筛选图片按钮
        getPic:function(){
            if(!this.tableNum||!this.selectedPicId){
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
                    url:'http://192.168.1.40/PicSystem/canton/get/treeGallery',
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
            selectPic.selectedPic = '';
            selectPic.selectedPicId = '';
            selectPic.pic_rate = 5;
            selectPic.pro_rate = 1;
            selectPic.re_date = 3;
            selectPic.file_type = 'jpg';
        },
        //请求并获取筛选的图片
        searchPic:function(){
            var num = selectPic.tableNum;
            var category_id = selectPic.tableInfo.category_id;
            var gallery_id = selectPic.selectedPicId;
            var pic_rate = selectPic.pic_rate;
            var pro_rate = selectPic.pro_rate;
            var re_date = selectPic.re_date;
            var file_type = selectPic.file_type;
            if(!gallery_id){
                layer.msg('请先选择图片目录');
            }else{
                //获取图片信息
                $.ajax({
                    type:'POST',
                    url:'http://192.168.1.40/PicSystem/canton/marry/image',
                    datatype:'json',
                    data:{
                        tableID:Request.tableID,
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
                        }else if(data.status==101){
                            layer.msg('操作失败,该相册没有此类型图片');
                            selectPic.picData= '';
                            selectPic.num_now = '';
                            selectPic.not_enough = '';
                            selectPic.count = '';
                            selectPic.rand_id = '';
                        }else if(data.status==102){
                            layer.msg('参数错误');
                            selectPic.picData= '';
                            selectPic.num_now = '';
                            selectPic.not_enough = '';
                            selectPic.count = '';
                            selectPic.rand_id = '';
                        }else if(data.status==104){
                            layer.msg('当前产品类目里没有图片类目');
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

//点击图片目录树形菜单
$(document).on('click','.tree .item .label',function(){
    $('.tree .item .label').removeClass('label-success').addClass('label-primary');
    $(this).removeClass('label-primary').addClass('label-success');
});