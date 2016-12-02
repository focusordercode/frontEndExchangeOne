console.log(serverUrl); //后端接口地址

$(function(){
    var box = document.getElementById('box');
    $('.login-btn').on('click',function(){
        var userInput = $('.user-input');
        var pswInput = $('.psw-input');
        var username = $('.user-input').val().trim();//用户名
        var psw = $('.psw-input').val().trim();//密码
        if(!username){
            userInput.attr('data-content','请输入用户名');
            userInput.popover('show');
            Shake(box);
        }else if(!psw){
            pswInput.attr('data-content','请输入密码');
            pswInput.popover('show');
            Shake(box);
        }else{
            $.ajax({
                type:'POST',
                url:'http://192.168.1.40/canton/login',
                data:{
                    username:username,
                    password:psw
                },
                datatype:'json',
                success:function(data){
                    if(data.status==100){
                        layer.msg('成功');
                    }else if(data.status==101){
                        //密码错误
                        pswInput.attr('data-content','密码错误');
                        pswInput.popover('show');
                        Shake(box);
                    }else if(data.status==102){
                        //用户不存在
                        userInput.attr('data-content','用户不存在');
                        userInput.popover('show');
                        Shake(box);
                    }
                },
                error:function(jqXHR){
                    layer.msg('请服务器请求登录失败!!!');
                }
            })
        }
    })
    $('.form-control').on('focus',function(){
        $('.form-control').popover('destroy');//隐藏提示框
    })
    //震动函数
    function Shake(box){
        var i = 20,
            that = box;
    
        var Timer = setTimeout(active,15);
    
        function active(){
            if(i>=0){
                that.style.padding = 0;
                i%2 == 0 ? that.style.paddingLeft = i + "px" : that.style.paddingRight = i + "px";
                i--;
                Timer = setTimeout(active,15);
            }else{
                clearTimeout(Timer);
            };
        };
    }
})