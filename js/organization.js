console.log(serverUrl); //后端接口地址

// 组织机构树形菜单的组件
Vue.component('item', {
    template: '#item-template',
    props: {
        model: Object
    },
    data: function() {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function() {
            return this.model.son && this.model.son.length
        }
    },
    methods: {
        //点击展开子机构
        toggle: function(model) {
            if (this.isFolder) {
                this.open = !this.open
                console.log(this.open)
            }
        },
        //点击机构
        selected: function(model) {
            var id = model.id,
                name = model.name,
                introduce = model.introduce,
                sonLen = model.son.length;
                
            var selected = {
                id,
                name,
                introduce,
                sonLen
            };

            //赋值到父组件
            tree.selectedData = selected;
        }
    }
})

//刷新函数
function windowFresh() {
    location.reload(true);
}
// Vue实例
var tree = new Vue({
    el: 'body',
    data: {
        son:{},
        selectedData: '',//点击选中的数据
        addOne: {
            name: '',
            introduce:'',
            no:''
        },
        statusList:[0,1],//0为关闭，1为启用
        cacheData:'' //暂存数据，修改
    },
    ready: function() {
        //获取树形分类
        $.ajax({
            type: 'POST',
            url: serverUrl+'get/org',
            datatype: 'json',
            data:{
                key:oKey,
                user_id:token,
                isGetRole:0
            },
            success: function(data) {
                if(data.status==100){
                    tree.son = data.value[0];
                }else if(data.status==101){
                    layer.msg(data.msg);
                }else if(data.status==1012){
                    layer.msg('请先登录',{time:2000});
                    
                    setTimeout(function(){
                        jumpLogin(loginUrl,NowUrl);
                    },2000);
                }else if(data.status==1011){
                    layer.msg('权限不足,请跟管理员联系');
                }
            },
            error: function(jqXHR) {
                layer.msg('向服务器请求组织机构失败');
            }
        })
    },
    computed: {
        ctrBtn: function() {
            if (this.selectedData.id) {
                return true
            } else {
                return false
            }
        },
    },
    methods: {
        //打开添加的面板
        addCate: function() {
            var vm = this;
            var selectedData = vm.selectedData;
            //有选中才能打开
            if (selectedData.id) {
                $('.addCate').modal('show');
                $('.addCate').css('margin-top', '200px');
            }
        },
        //提交添加请求
        subOne: function() {
            var vm = this;
            var selectedData = this.selectedData;
            var addOne = this.addOne;
            var creator_id = cookie.get('id');//创建者的ID
            var oIndex = selectedData.sonLen + 1; //排序,默认加到最后面
            //发起添加请求
            if (!addOne.name.trim()) {
                layer.msg('名称不能为空');
            } else {
                $.ajax({
                    type: 'POST',
                    url: serverUrl+'add/org',
                    datatype: 'json',
                    data: {
                        key:oKey,
                        user_id:token,
                        creator_id:creator_id,
                        name: addOne.name,
                        introduce:addOne.introduce,
                        p_id: selectedData.id,
                        no:oIndex
                    },
                    success: function(data) {
                        if (data.status == 100) {
                            layer.msg('添加成功');
                            $('.addCate').modal('hide');
                            vm.addOne.name = '';
                            vm.addOne.introduce = '';
                            setTimeout(getTreeData(vm),1000);
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            
                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }else {
                            layer.msg(data.msg);
                        }
                    },
                    error: function(jqXHR) {
                        layer.msg('向服务器请求添加失败');
                    }
                })
            }
        },
        //打开修改的面板
        changeOne: function() {
            var vm = this;
            var selectedData = this.selectedData;
            //复制选中数据
            vm.cacheData = $.extend(true, {}, selectedData);
            //有选中才能打开
            if (vm.cacheData.id) {
                $('.changeCate').modal('show');
                $('.changeCate').css('margin-top', '200px');
            }
        },
        //提交修改
        subChange: function() {
            var vm = this;
            var cacheData = vm.cacheData;
            //提交修改
            if (!cacheData.name.trim()) {
                layer.msg('名称不能为空');
            }else {
                $.ajax({
                    type: 'POST',
                    url: serverUrl+'edit/org',
                    datatype: 'json',
                    data: {
                        key:oKey,
                        user_id:token,
                        org_id: cacheData.id,
                        name: cacheData.name,
                        enabled:1,
                        introduce:cacheData.introduce
                    },
                    success: function(data) {
                        if (data.status == 100) {
                            layer.msg('修改成功');
                            $('.changeCate').modal('hide');
                            setTimeout(getTreeData(vm),1000);
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});
                            
                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }else {
                            layer.msg(data.msg);
                        }
                    },
                    error: function(jqXHR) {
                        layer.msg('向服务器请求失败');
                    }
                })
            }
        },
        //删除一个分类
        deleteOne: function() {
            var vm = this;
            var selectedData = this.selectedData;
            if (selectedData.id) {
                layer.confirm('确定删除该机构?', function(index) {
                    layer.close(index);

                    $.ajax({
                        type: 'POST',
                        url: serverUrl+'delete/org',
                        datatype: 'json',
                        data: {
                            key:oKey,
                            user_id:token,
                            org_id: selectedData.id
                        },
                        success: function(data) {
                            if (data.status == 100) {
                                layer.msg('删除成功');
                                selectedData.id = '',
                                selectedData.name = '',
                                selectedData.introduce = '',
                                selectedData.enabled = '',
                                selectedData.sonLen = '',
                                setTimeout(getTreeData(vm),1000);
                            }else if(data.status==1012){
                                layer.msg('请先登录',{time:2000});
                                
                                setTimeout(function(){
                                    jumpLogin(loginUrl,NowUrl);
                                },2000);
                            }else if(data.status==1011){
                                layer.msg('权限不足,请跟管理员联系');
                            }else {
                                layer.msg(data.msg);
                            }
                        },
                        error: function(jqXHR) {
                            layer.msg('向服务器请求删除失败');
                        }
                    })
                })
            }
        }
    }
})

//获取树形分类函数
function getTreeData(vm) {
    $.ajax({
        type: 'POST',
        url: serverUrl+'get/org',
        datatype: 'json',
        data:{
            key:oKey,
            user_id:token,
            isGetRole:0
        },
        success: function(data) {
            if(data.status==100){
                vm.son = data.value[0];
            }else if(data.status==101){
                layer.msg(data.msg);
            }else if(data.status==1012){
                layer.msg('请先登录',{time:2000});
                
                setTimeout(function(){
                    jumpLogin(loginUrl,NowUrl);
                },2000);
            }else if(data.status==1011){
                layer.msg('权限不足,请跟管理员联系');
            }
        },
        error: function(jqXHR) {
            layer.msg('向服务器请求组织机构失败');
        }
    })
}

//点击组织机构树形菜单
$(document).on('click', '.tree .item .tree-node .selected', function() {
    $('.tree .item .tree-node').removeClass('node-selected');
    $(this).parent('.tree-node').addClass('node-selected');
});
