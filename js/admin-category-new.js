console.log(serverUrl); //后端接口地址

// 产品分类树形菜单的组件
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
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        //点击展开子分类
        toggle: function(model) {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        //点击分类
        selected: function(model) {
            var id = model.id,
                cn_name = model.cn_name,
                en_name = model.en_name;
            var selected = {
                id,
                cn_name,
                en_name
            };

            //赋值到父组件
            tree.selectedData = selected;
        }
    }
})

// 产品树形菜单的Vue实例
var tree = new Vue({
    el: 'body',
    data: {
        treeData: {},
        selectedData: '',
        addOne: {
            cn_name: '',
            en_name: ''
        },
        cacheData:'' //修改数据暂存
    },
    ready: function() {
        //获取树形分类
        $.ajax({
            type: 'POST',
            url: serverUrl+'get/treeCategory',
            datatype: 'json',
            data:{
                key:oKey,
                user_id:token,
                ckey:'category'
            },
            success: function(data) {
                tree.treeData = data;
                if(data.status==101){
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
                layer.msg('向服务器请求产品类目失败');
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
        }
    },
    methods: {
        //打开添加分类的面板
        addCate: function() {
            var selectedData = this.selectedData;
            //有选中才能打开
            if (selectedData.id) {
                $('.addCate').modal('show');
                $('.addCate').css('margin-top', '200px');
            }
        },
        //提交添加分类请求
        subOne: function() {
            var vm = this;
            var selectedData = this.selectedData;
            var addOne = this.addOne;
            var creator_id = cookie.get('id');
            //英文正则,英文数字和空格
            var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;

            //发起添加请求
            if (!addOne.cn_name.trim()) {
                layer.msg('中文名不能为空');
            } else if (!Entext.test(addOne.en_name) || !addOne.en_name) {
                layer.msg('英文名不能为空，且只能是英文字母数字和空格');
            } else {
                $.ajax({
                    type: 'POST',
                    url: serverUrl+'post/sub',
                    datatype: 'json',
                    data: {
                        key:oKey,
                        user_id:token,
                        id: selectedData.id,
                        creator_id:creator_id,
                        cn_name: addOne.cn_name,
                        en_name: addOne.en_name
                    },
                    success: function(data) {
                        if (data.status == 100) {
                            layer.msg('添加成功');
                            $('.addCate').modal('hide');
                            vm.addOne.cn_name = '';
                            vm.addOne.en_name = '';
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
                        layer.msg('向服务器请求添加分类失败');
                    }
                })
            }
        },
        //打开修改分类的面板
        changeOne: function() {
            var vm = this;
            var selectedData = this.selectedData;
            //缓存数据
            vm.cacheData = $.extend(true, {}, selectedData);
            //有选中才能打开
            if (selectedData.id) {
                $('.changeCate').modal('show');
                $('.changeCate').css('margin-top', '200px');
            }
        },
        //提交修改
        subChange: function() {
            var vm = this;
            var cacheData = this.cacheData;
            //英文正则,英文数字和空格
            var Entext = /^[a-zA-Z_()\s]+[0-9]*$/;

            //提交修改
            if (!cacheData.cn_name) {
                layer.msg('中文名不能为空');
            } else if (!cacheData.en_name.trim() || !Entext.test(cacheData.en_name)) {
                layer.msg('英文名不能为空，且只能是英文字母数字和空格');
            } else {
                $.ajax({
                    type: 'POST',
                    url: serverUrl+'update/name',
                    datatype: 'json',
                    data: {
                        key:oKey,
                        user_id:token,
                        id: cacheData.id,
                        cn_name: cacheData.cn_name,
                        en_name: cacheData.en_name
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
                        } else {
                            layer.msg(data.msg);
                        }
                    },
                    error: function(jqXHR) {
                        layer.msg('向服务器请求添加分类失败');
                    }
                })
            }
        },
        //删除一个分类
        deleteOne: function() {
            var vm = this;
            var selectedData = this.selectedData;
            if (selectedData.id == 1) {
                layer.msg('顶级类目无法删除');
            } else {
                layer.confirm('确定删除该类目?', {
                    btn: ['确定', '取消']
                }, function(index) {
                    layer.close(index);

                    $.ajax({
                        type: 'POST',
                        url: serverUrl+'delete/sub',
                        datatype: 'json',
                        data: {
                            key:oKey,
                            user_id:token,
                            id: selectedData.id
                        },
                        success: function(data) {
                            if (data.status == 100) {
                                layer.msg('删除成功');

                                vm.selectedData.en_name = "";
                                vm.selectedData.cn_name = "";
                                vm.selectedData.id = "";

                                setTimeout(getTreeData(vm),1000);
                            }else if(data.status==1012){
                                layer.msg('请先登录',{time:2000});

                                setTimeout(function(){
                                    jumpLogin(loginUrl,NowUrl);
                                },2000);
                            }else if(data.status==1011){
                                layer.msg('权限不足,请跟管理员联系');
                            } else {
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

//获取产品类目数据函数
function getTreeData(vm) {
    $.ajax({
        type: 'POST',
        url: serverUrl+'get/treeCategory',
        datatype: 'json',
        data:{
            key:oKey,
            user_id:token,
            ckey:'category'
        },
        success: function(data) {
            vm.treeData = data;
            if(data.status==101){
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
            layer.msg('向服务器请求产品目录失败');
        }
    })
}

//点击产品树形菜单
$(document).on('click', '.tree .item .label .selected', function() {
    $('.tree .item .label').removeClass('label-success').addClass('label-primary');
    $(this).parent('.label').removeClass('label-primary').addClass('label-success');
});
