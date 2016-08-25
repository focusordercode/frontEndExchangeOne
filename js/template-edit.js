//获取地址栏模板的ID
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


//添加模板条目
// 左边
var oTempIndexNum = $('.temp-edit .table tr');
var oTempIndex = $('.temp-edit .table .temp-index');//顺序的节点
var oTempCnName = $('.temp-edit .table .cn-name');//中文名的节点
var oTempEnName = $('.temp-edit .table .en-name');//英文名的节点
var oTempInputType = $('.temp-edit .table .input-type');//英文名的节点
//右边
var oCtrCnName = $('.temp-edit-ctr .common-type .cn-name');
var oCtrEnName = $('.temp-edit-ctr .common-type .en-name');
var oCtrInputType = $('.temp-edit-ctr .common-type .input-type');
var oCtrBtnCommon = $('.temp-edit-ctr .common-type .btn-common');
var oCtrBtns= $('.temp-edit-ctr .char-type .btn-s');
var oCtrcharCn = $('.temp-edit-ctr .char-type .cn-name');
var oCtrcharEn = $('.temp-edit-ctr .char-type .en-name');
var oCtrcharLen = $('.temp-edit-ctr .char-type .input-num');

var num = 0;

// 生成表单1
var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;
oCtrBtnCommon.on('click',function(){
	if (!oCtrCnName.val()||!oCtrEnName.val()) {
		layer.msg('请输入内容');
		oCtrCnName.val('');
		oCtrEnName.val('');
	}else if(!Entext.test(oCtrEnName.val())){
		layer.msg('英文名只能包含英文数字空格');
	}else{
		$oInputText = '';
		$oInputText += '<tr>';
		$oInputText +=  '<th class="temp-index text-middle"></th>';
		$oInputText +=  '<td class="cn-name">'+'<input type="hidden" name="cn_name" value="'+oCtrCnName.val()+'" />'+oCtrCnName.val()+'</td>';
		$oInputText +=  '<td class="en-name">'+'<input type="hidden" name="en_name" value="'+oCtrEnName.val()+'" />'+oCtrEnName.val()+'</td>';  
		$oInputText +=  '<td class="input-type">'+'<input type="hidden" name="data_type_code" value="'+oCtrInputType.val()+'" class="input1" />'+'<input type="hidden" name="length" value="" class="input2" />'+'输入类型为【'+oCtrInputType.find("option:selected").text()+'】'+'</td>';
		$oInputText +=  '</tr>';
		$('.temp-edit .table').append($oInputText);
		ListIndex();//排序
		oCtrCnName.val('');
		oCtrEnName.val('');
		$('.temp-edit .text-danger').remove();
	}  
});

//生成表单2
oCtrBtns.on('click',function(){
	if (!oCtrcharCn.val()||!oCtrcharEn.val()||!oCtrcharLen.val()) {
		layer.msg('请输入内容');
		oCtrcharCn.val('');
		oCtrcharEn.val('');
		oCtrcharLen.val('100');
	}else if(!Entext.test(oCtrcharEn.val())){
		layer.msg('英文名只能包含英文数字空格');
	}else if(oCtrcharLen.val()==0||oCtrcharLen.val()<0){
		layer.msg('字符数必须大于0');
		oCtrcharCn.val('');
		oCtrcharEn.val('');
		oCtrcharLen.val('100');
	}else{
		$oInputText = '';
		$oInputText += '<tr>';
		$oInputText +=  '<th class="temp-index text-middle"></th>';
		$oInputText +=  '<td class="cn-name">'+'<input type="hidden" name="cn_name" value="'+oCtrcharCn.val()+'" />'+oCtrcharCn.val()+'</td>';
		$oInputText +=  '<td class="en-name">'+'<input type="hidden" name="en_name" value="'+oCtrcharEn.val()+'" />'+oCtrcharEn.val()+'</td>';  
		$oInputText +=  '<td class="input-type">'+'<input type="hidden" name="data_type_code" value="char" class="input1" />'+'<input type="hidden" name="length" value="'+oCtrcharLen.val()+'" class="input2" />'+'输入【文本】字符数为'+oCtrcharLen.val()+'</td>';
		$oInputText +=  '</tr>';
		$('.temp-edit .table').append($oInputText);
		ListIndex();//排序
		oCtrcharCn.val('');
		oCtrcharEn.val('');
		oCtrcharLen.val('100');
		$('.temp-edit .text-danger').remove();
	}
});

//排序函数
function ListIndex(){
	for($h=0;$h<$('.temp-edit .table tr').length;$h++){
		$('.temp-edit .table .temp-index').eq($h).text($h+1);
	}
}


//删除表单
var oDelete = $('.temp-edit .btn-d');
var oDeleteAll = $('.temp-edit .btn-all');
var oDeleteNum = $('.temp-edit .delete-num');

oDelete.on('click',function(){
	if(!oDeleteNum.val()){
		layer.msg('请输入序号');
	}else if($('.temp-edit .table tr').length==0){
		layer.msg('不存在任何条目');
		oDeleteNum.val('');
	}else if(oDeleteNum.val()>$('.temp-edit .table tr').length||oDeleteNum.val()==0||oDeleteNum.val()<0){
		layer.msg("请输入大于0且小于条目总数的数字!");
		oDeleteNum.val('');
	}else{
		$('.temp-edit .table tr').eq(oDeleteNum.val()-1).remove();
		oDeleteNum.val('');
		ListIndex();//重新排序
	}
});

//清除所有
oDeleteAll.on('click',function(){
	if($('.temp-edit .table tr').length==0){
		layer.msg('请先添加条目');
	}else{
		layer.confirm('确定清除所有条目?', {
		  btn: ['清除','取消'] //按钮
		},function(){
			$('.temp-edit .table tr').remove();
		    layer.msg('清除成功');   
		})
	}
});

//关闭页面函数
function closeWindow(){
    window.close();
}

//拉取模板的信息
var tempInfo = new Vue({
    el:'.temp-info',
    data:{
        value:''
    },
    ready:function(){
        $.ajax({
            type: "POST",
            url: "http://192.168.1.40/PicSystem/canton/get/template", //添加请求地址的参数
            dataType: "json",
            timeout:5000,
            data:{
                id:Request.id,
                type_code:Request.type_code
            },
            success: function(data){
                if(data.status==100){
                    tempInfo.value = data.value[0];
                }
            },
            error: function(jqXHR){     
                layer.msg('从服务器获取模板信息失败');
            }
        })
    }
})