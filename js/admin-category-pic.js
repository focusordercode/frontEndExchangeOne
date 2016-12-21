//图片目录管理，此功能暂时废弃了

console.log(serverUrl); //后端接口地址

// 获取标签
            $oAddtopBtn = $('.easy-tree-toolbar .addtop > button');//创建顶级分类按钮
            $oAddtopConfirm = $('.easy-tree-toolbar .addtop .confirm');//创建顶级分类下的确定按钮
            $oAddtopCancel = $('.easy-tree-toolbar .addtop .cancel');//创建顶级分类下的取消按钮
            $oAddtopInput =$('.easy-tree-toolbar .addtop .input-group > input');
            $oCreatBtn = $('.easy-tree .easy-tree-toolbar .create > button');//创建按钮
            $oInputgroup = $('.easy-tree .easy-tree-toolbar .create .input-group');//按钮组
            $oCancel = $('.easy-tree .easy-tree-toolbar .create .cancel');//创建分类下的取消按钮
            $oConfirm = $('.easy-tree .easy-tree-toolbar .create .confirm');//创建分类下的确定按钮
            $oCreatInput = $('.easy-tree .create .input-group > .form-control');//创建分类下的内容的输入框
            $oEditBtn = $('.easy-tree .easy-tree-toolbar .edit');//编辑按钮
            $oDelete = $('.easy-tree .easy-tree-toolbar .remove');//删除按钮
            
            //加载顶级分类
            function loadPage(){
                $.ajax({
                    type: "GET",    
                    url: serverUrl+"get/imageancestors", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        key:oKey,
                        user_id:token, 
                    },
                    success: function(data){
                        if(data.status == 100){
                            for($i=0;$i<data.value.length;$i++){
                                $str = "";
                                $str += '<li class="parent_li" name="'+data.value[$i].id+'">';
                                $str +=     '<span title="展开分支" app_code="'+data.value[$i].app_code +'" onclick="open_again(\''+data.value[$i].id+'\',\''+data.value[$i].app_code+'\')">';
                                $str +=        '<span class="glyphicon glyphicon-folder-close"></span>';
                                $str +=         '<a title="选择">'+data.value[$i].cn_name+'</a>';
                                $str +=         '<a title="en">'+data.value[$i].en_name+'</a>';
                                $str +=     '</span>';
                                $str += '</li>';
                                $("#level-content").append($str);
                            }
                            // $('#level-content a[title="en"]').hide();//隐藏英文名
                            //点击选中类目
                            $('#level-content li > span').on("click",function(){
                                $('#level-content li > span').parent('li').removeClass('li_selected');//移除所有span上一个父元素的class
                                $(this).parent('li').addClass('li_selected');//给当前的span上一个父元素添加class
                                $oEditBtn.css('display','inline-block');
                                $oDelete.css('display','inline-block');
                            });
                            
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }
                             
                    },
                    error: function(jqXHR){     
                        layer.msg('向服务器请求失败');
                    },
                })
            };

            //执行
            loadPage();

            //获取子类目
            function open_again(ids,app_codes){
                $.ajax({ 
                    type: "POST",   
                    url: serverUrl+"get/imagesub", //添加请求地址的参数
                    dataType: "json",
                    data:{
                        key:oKey,
                        user_id:token,
                        id:ids,
                        app_code:app_codes
                    },
                    success: function(data) {
                        if(data.status == 100){
                            $str = "<ul>";
                            for($i=0;$i<data.value.length;$i++){
                                $str += '<li class="parent_li" name="'+data.value[$i].id+'">';
                                $str +=     '<span title="展开分支" app_code="'+data.value[$i].app_code +'" onclick="open_again(\''+data.value[$i].id+'\',\''+data.value[$i].app_code+'\')">';
                                $str +=        '<span class="glyphicon glyphicon-folder-close"></span>';
                                $str +=         '<a title="选择">'+data.value[$i].cn_name+'</a>';
                                $str +=         '<a title="en">'+data.value[$i].en_name+'</a>';
                                $str +=     '</span>';
                                $str += '</li>';
                            }
                            $str += "</ul>";
                            $("li[name='"+ids+"']").find("ul").remove();
                            $("li[name='"+ids+"']").append($str);
                            // $('#level-content a[title="en"]').hide();//隐藏英文名
                        }else if(data.status==1012){
                            layer.msg('请先登录',{time:2000});

                            setTimeout(function(){
                                jumpLogin(loginUrl,NowUrl);
                            },2000);
                        }else if(data.status==1011){
                            layer.msg('权限不足,请跟管理员联系');
                        }
                    },
                    error: function(jqXHR){     
                       layer.msg('向服务器请求错误');
                    },     
                })
                //点击选中类目
                $('#level-content li > span').click(function(){
                    $('#level-content li > span').parent('li').removeClass('li_selected');//移除所有span上一个父元素的class
                    $(this).parent('li').addClass('li_selected');//给当前的span上一个父元素添加class
                    $oEditBtn.removeClass('disabled');
                    $oDelete.removeClass('disabled');
                });
            }

            // 点击编辑
            $('.easy-tree-toolbar .edit > button').click(function(){
                $oLiName = $('#level-content .li_selected').attr('name');
                $oCn_name = $('#level-content .li_selected > span  a[title="选择"]').text();
                $oEn_name = $('#level-content .li_selected > span  a[title="en"]').text();
                layer.prompt({
                    title:'中文名//英文名',
                    value: $oCn_name + '//' + $oEn_name,
                    formType: 0,
                    maxlength: 20,
                    shadeClose: true
                },function(val){
                    $oCn_name2 = (val.split("//"))[0];
                    $oEn_name2 = (val.split("//"))[1];
                    $.ajax({
                        type: "POST",    
                        url: serverUrl+"update/imagesub", //添加请求地址的参数
                        dataType: "json",
                        data:{
                            key:oKey,
                            user_id:token,
                            id:$oLiName,
                            cn_name:$oCn_name2,
                            en_name:$oEn_name2
                        },
                        success: function(data){
                           if(data.status==100){
                                $('#level-content .li_selected > span  a[title="选择"]').text($oCn_name2);
                                $('#level-content .li_selected > span  a[title="en"]').text($oEn_name2);
                                layer.msg('修改成功');
                           }else if(data.status==101){
                                layer.msg('操作失败，请重试');
                           }else if (data.status==104) {
                                layer.msg('中文名称为空');
                           }else if (data.status==105) {
                                layer.msg('英文名称为空');
                           }else if(data.status==1012){
                                layer.msg('请先登录',{time:2000});

                                setTimeout(function(){
                                    jumpLogin(loginUrl,NowUrl);
                                },2000);
                            }else if(data.status==1011){
                                layer.msg('权限不足,请跟管理员联系');
                            }
                        },
                        error: function(jqXHR){     
                            layer.msg('服务器请求错误');
                        },
                    })
                });
            });

            // 点击删除
            $('.easy-tree-toolbar .remove > button').click(function(){
                    $oLiName = $('#level-content .li_selected').attr('name');
                    $oApp_code = $('#level-content .li_selected > span').attr('app_code');
                    layer.confirm('确定删除分类和其子分类？', {
                      btn: ['删除','取消'] //按钮
                    },function(yes){
                        $.ajax({
                            type: "POST",    
                            url: serverUrl+"delete/imagesub", //添加请求地址的参数
                            dataType: "json",
                            data:{
                                key:oKey,
                                user_id:token,
                                id:$oLiName,
                                app_code:$oApp_code
                            },
                            success: function(data){
                                if (data.status==100) {
                                    $('#level-content .li_selected').remove();
                                    layer.msg('删除成功');
                                }else if(data.status==101){
                                    layer.msg('操作失败，检查分类是否已经被使用');
                                }else if(data.status==112){
                                    layer.msg('顶级分类不能删除');
                                }else if(data.status==1012){
                                    layer.msg('请先登录',{time:2000});

                                    setTimeout(function(){
                                        jumpLogin(loginUrl,NowUrl);
                                    },2000);
                                }else if(data.status==1011){
                                    layer.msg('权限不足,请跟管理员联系');
                                }
                            },
                            error: function(jqXHR){     
                                layer.msg('服务器请求错误');
                            },
                        })    
                    }
                )
            });

            //点击显示创建
            $oCreatBtn.click(function(){
                $oInputgroup.addClass('creat-show');
            });
            //移除creat-show和has-error的函数
            function oDispear(){
                $oInputgroup.removeClass('creat-show');
                $oInputgroup.removeClass('has-error');
            };
            //点击取消隐藏
            $oCancel.click(function(){
                oDispear();
                $oCreatInput.val('');
            });

            //点击确定添加分类后的动作
            $oConfirm.click(function(){
                $oLiName = $('#level-content .li_selected').attr('name');
                $oLiAppcode = $('#level-content .li_selected > span').attr('app_code');
                $oCn_name = $('.easy-tree .create .input-group > .cn-name').val();
                $oEn_name = $('.easy-tree .create .input-group > .en-name').val();
                if($oCreatInput.val()==''){ //如果创建内容的输入框为空
                    $oInputgroup.addClass('has-error');
                }else if($oLiName==null){
                    layer.msg('没有选中上级分类');
                }else{
                    $.ajax({
                        type: "POST",    
                        url: serverUrl+"post/imagesub", //添加请求地址的参数
                        dataType: "json",
                        data:{
                            key:oKey,
                            user_id:token,
                            id:$oLiName,
                            app_code:$oLiAppcode,
                            cn_name:$oCn_name,
                            en_name:$oEn_name
                        },
                        success: function(data){
                            if (data.status==100) {
                                layer.msg('添加成功');
                                location.reload(true);
                            }else if(data.status==101){
                                layer.msg('操作失败');
                            }else if(data.status==102){
                                layer.msg('没有选中上级分类');
                            }else if(data.status==104){
                                layer.msg('中文名错误');
                            }else if(data.status==105){
                                layer.msg('英文名错误');
                            }else if(data.status==1012){
                                layer.msg('请先登录',{time:2000});

                                setTimeout(function(){
                                    jumpLogin(loginUrl,NowUrl);
                                },2000);
                            }else if(data.status==1011){
                                layer.msg('权限不足,请跟管理员联系');
                            }
                        },
                        error: function(jqXHR){     
                            layer.msg('服务器请求错误');
                        },
                    })
                }
            });

            //点击确定添加顶级分类后的动作
            // $oAddtopBtn.click(function(){
            //     $('.easy-tree-toolbar .addtop .input-group').addClass('creat-show');
            //     $.ajax({
            //         type: "GET",    
            //         url: "http://192.168.1.42/canton/index.php/get/appcode", //添加请求地址的参数
            //         dataType: "json",
            //         success: function(data){
            //             if (data.status==100) {
            //                 $('.addtop .input-group select').html('');

            //                 for($i=0;$i<data.value.length;$i++){
            //                     $option = '<option>'+ data.value[$i].app_code +'</option>';
            //                     $('.addtop .input-group select').append($option);
            //                 } 
            //             }else if(data.status==101){
            //                 layer.msg('操作失败');
            //             }
            //         },
            //         error: function(jqXHR){     
            //             layer.msg('服务器请求错误');
            //         },
            //     })
            // });
            // //顶级分类的取消按钮
            // $oAddtopCancel.click(function(){
            //     $('.easy-tree-toolbar .addtop .input-group').removeClass('creat-show');
            //     $('.easy-tree-toolbar .addtop .input-group').removeClass('has-error');
            //     $('.easy-tree-toolbar .addtop .input-group > input').val('');
            // });
            // //顶级分类的确定按钮
            // $oAddtopConfirm.click(function(){
            //     $oApp_code = $('.easy-tree-toolbar .addtop select.form-control').val();
            //     $oCn_name = $('.easy-tree .addtop .input-group > .cn-name').val();
            //     $oEn_name = $('.easy-tree .addtop .input-group > .en-name').val();
            //     if($oAddtopInput.val()==''){
            //        $('.easy-tree-toolbar .addtop .input-group').addClass('has-error'); 
            //     }else{
            //         $.ajax({
            //             type: "POST",    
            //             url: "http://192.168.1.42/canton/index.php/post/ancestors", //添加请求地址的参数
            //             dataType: "json",
            //             data: {
            //                 app_code:$oApp_code,
            //                 cn_name:$oCn_name,
            //                 en_name:$oEn_name
            //             },
            //             success: function(data){
            //                 if (data.status==100) {
            //                     layer.msg('添加成功');
            //                     location.reload(true);
            //                 }else if(data.status==113){
            //                     layer.msg('模块已存在');
            //                 }
            //             },
            //             error: function(jqXHR){
            //                 layer.msg('服务器请求错误');
            //             },
            //         })
            //     }
            // });