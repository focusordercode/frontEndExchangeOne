
console.log(serverUrl); //后端接口地址

var token,
username,
oKey,
curent,//之前访问的地址和参数
defualtUrl = 'Table-info.html'; //默认跳转页面

//检测是否已经登录
getCookie();
checkLogMsg();

curent = getNowUrl();//获取之前访问的地址和参数

$(function(){
    var box = document.getElementById('box');

    $('.login-btn').on('click',function(){
        var userInput = $('.user-input');
        var pswInput = $('.psw-input');
        var username = $('.user-input').val().trim();//用户名
        var psw = $('.psw-input').val().trim();//密码
        submitData(userInput,pswInput,username,psw,box);
    })

    $(document).keyup(function(event){
        var userInput = $('.user-input');
        var pswInput = $('.psw-input');
        var username = $('.user-input').val().trim();//用户名
        var psw = $('.psw-input').val().trim();//密码
        if(event.keyCode ==13){
        submitData(userInput,pswInput,username,psw,box);
      }
    });

    $('.form-control').on('focus',function(){
        $('.form-control').popover('destroy');//隐藏提示框
    })

    //提交登录
    function submitData(userInput,pswInput,username,psw,box) {
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
                url:serverUrl+'login',
                data:{
                    username:username,
                    password:psw
                },
                datatype:'json',
                success:function(data){
                    if(data.status==100){
                        layer.msg('登录成功');
                        var pens = data.value;
                        // console.log(pens);
                        // console.log(pens.user);
                        if(pens){
                            setCookie(pens);
                            setTimeout(function(){
                                if(curent){
                                    location.href = curent;
                                }else{
                                    location.href = defualtUrl;
                                }
                            },1000);
                        }
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
                    }else if(data.status==104){
                        $('.form-control').popover('destroy');//隐藏提示框
                        Shake(box);
                        layer.msg('错误次数太多,15分钟后再试');
                    }
                },
                error:function(jqXHR){
                    layer.msg('请服务器请求登录失败!!!');
                }
            })
        }
    }

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

//设置cookie函数
function setCookie(pens) {
    var username = pens.user.username,
        token_cookie = pens.user_id,
        oKey_cookie = pens.key,
        ID = pens.user.uid;
    cookie.set({'token':token_cookie,'username':username,'oKey':oKey_cookie,'id':ID},{  //批量设置
    "expires": '',
    "path": '/',
    "domain":""
    });
}

//获取地址栏的路径和参数
function getNowUrl() {
    var name,value; 
    var str = location.href;
    var num = str.indexOf("?");
    if(num<0){
        str = '';
    }else{
        str = str.substr(num+1);
    }
    return str
}

//检测登录信息
function checkLogMsg() {
    if(token&&username&&oKey){
        location.href = defualtUrl;
    }
}

//获取客户端cookie
function getCookie() {
    token = cookie.get('token');
    username = cookie.get('username');
    oKey = cookie.get('oKey');
}