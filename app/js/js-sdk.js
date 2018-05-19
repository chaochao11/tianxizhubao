//
//
// /*
//  * 注意：
//  * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
//  * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
//  * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
//  *
//  * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
//  * 邮箱地址：weixin-open@qq.com
//  * 邮件主题：【微信JS-SDK反馈】具体问题
//  * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
//  */
//
// /**
//  * 获取wxConfig配置
//  */
function setWxConfig(url) {
    var timestamp = '';//时间戳
    var nonceStr = '';//随机字符串
    var signature = '';//签名
    // alert("wei-SDK获取到的url=="+url);
    //请求获取wxConfig参数
    // $.ajax({
    //     type: 'GET',
    //     url: 'api/serviceManager/WxConfig',
    //     data:{
    //         url:url
    //     },
    //     success: function (data) {
    //         //alert('成功');
    //         var wxConfig = data;
    //         // console.log(wxConfig.appId);
    //         timestamp = wxConfig.timestamp;
    //         nonceStr = wxConfig.nonceStr;
    //         signature = wxConfig.signature;
    //         //配置wxConfig参数
    //         wx.config({
    //             debug: false,
    //             appId: 'wxf9dfc25d36ba1c3d',
    //             timestamp: timestamp,
    //             nonceStr: nonceStr,
    //             signature: signature,
    //             jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','chooseImage','chooseWXPay']
    //         });
    //     },
    //     error:function(){
    //         //alert("未能成功获取到 wx.config 配置");
    //     }
    // });
}
setWxConfig(window.location.href);
/**
 * config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
 * 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
 * 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
 *
 */

wx.checkJsApi({
    jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQZone',
        'chooseImage',//选择图片
        'uploadImage',//上传图片
        'downloadImage',//下载图片
        'getNetworkType',
        'previewImage',//预览图片
        'getLocation',//获取地理位置坐标
        'hideOptionMenu',
        'chooseWXPay'
    ],
    success: function (res) {
        alert(JSON.stringify(res));
    },
    fail:function(res){
        alert(JSON.stringify(res));
    }
});

wx.ready(function () {
    //隐藏右上角按钮接口
    //wx.showAllNonBaseMenuItem();
    wx.onMenuShareTimeline({
        title: '常州车管家网络，分享二维码给好友，好友注册后即获50积分', // 分享标题，
        imgUrl: 'http://www.czcargj.com/statics/images/logo.jpg', // 分享图标
        success: function () {
            alert('分享成功');
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareAppMessage({
        title: '常州车管家网络', // 分享标题
        desc: '分享二维码给好友，好友注册后即获50积分', // 分享描述
        imgUrl: 'http://www.czcargj.com/statics/images/logo.jpg', // 分享图标
        success: function () {
            alert('分享成功');
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});
function onBridgeReady(){
    //WeixinJSBridge.call('showOptionMenu');
    WeixinJSBridge.call('hideOptionMenu');
    WeixinJSBridge.call('hideToolbar');
}

if (typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
}else{
    onBridgeReady();
}


//用户触发时才调用的接口
// $(document).ready(function () {
//
//     //扫描二维码并返回结果
//     $(document).on('click','.scanQRCode',function () {
//         //alert("调用扫码");
//         wx.scanQRCode({
//             needResult: 1,
//             desc: 'scanQRCode desc',
//             success: function (res) {
//                 //返回扫描结果
//                 location.href=eval(res).resultStr;
//                 /*alert(eval(res).resultStr);*/
//                 /*alert(JSON.stringify(res));*/
//             }
//         });
//     });


    //图片接口
    // var images = {
    //     localIds: [],
    //     serverIds: []
    // };
    // var uploadImageList=[];
    // $(document).on('click','.chooseImage',function () {
    //     //按钮类型(签单拍照按钮/异拍照按钮)
    //     var buttonType=$(this).attr("mytype");
    //     //alert("选择图片(拍照或从相册选择)");
    //     //选择图片(拍照或从相册选择)
    //     wx.chooseImage({
    //         success: function (res) {
    //             images.localIds = res.localIds;
    //
    //             //if(images.localIds.length<=3){//上传图片限制最多为3张
    //
    //             var i= 0,length=images.localIds.length;
    //
    //             var upload=function(){
    //                 wx.uploadImage({
    //                     localId: images.localIds[i].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得(必须转换成字符串格式)
    //                     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //                     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //                     isShowProgressTips: 1, // 默认为1，显示进度提示
    //                     success: function (res) {
    //                         var serverId=res.serverId;// res.serverId  是返回图片的服务器端ID
    //                         //alert("serverId=="+serverId);
    //                         //将返回的ID拼接成字符串，返回服务器，转移图片到正式文件夹
    //                         //
    //                         //待扩展
    //
    //
    //                         //var j=$("img[class=receiptImg]").length;//页面上img标签生成计数器
    //                         if(length<=1){
    //                             $.post('ServiceAction_downLoadMaterial?mediaId='+serverId).success(function(data){
    //                             var SRC='';
    //                             angular.forEach(data,function(val,key){
    //                                 if(key=='filePath')
    //                                     SRC=val;
    //                             });
    //                             uploadImageList.push({'id':i+1,'src':SRC});
    //
    //                             if(buttonType=='drivingLice'){
    //                                 alert(11);
    //                                 //$("#drivingLiceList").append('<li><a class="remove-img"><img mytype="drivingLice" src="'+SRC+'"></a></li>');
    //                             }else{
    //                                 alert(22);
    //                                 //$("#except_div").append('<a class="unusual-img col-33 exceptImg" href="#"><img mytype="exceptImg" src="'+SRC+'"></a>');
    //                             }
    //                             i++;
    //                             if (i < length)
    //                                 upload();//此处运用递归，循环上传，一张上传成功之后，继续传下一张
    //                             else{
    //                               /*/!*  //保存签收图片到服务器
    //                                 var url ="OrderAction_uploadImage";
    //                                 if("drivingLice" == buttonType){
    //                                     url = "";
    //                                 }else{
    //                                     url = "OrderAction_uploadImage";
    //                                 }
    //                                 //保存图片到服务器数据库
    //                                 imgStr(url,materialNum);*!/
    //                                 /!*for(var i=0;i<uploadImageList.length;i++){*!/
    //                                     alert(uploadImageList.length);
    //                                     $("#uploadImageListLength").val(uploadImageList);
    //                                 /!*}*!/*/
    //                                 alert(uploadImageList);
    //
    //                             }
    //                         });
    //                         }else{
    //                             alert("一次只能上传1张图片");
    //                         }
    //
    //                     },
    //                     fail:function(res){
    //                         alert("上传图片失败");
    //                     }
    //                 });
    //             }
    //             upload();
    //
    //             //}else{
    //             //    alert("最多只能上传3张图片");
    //             //    return false;
    //             //}
    //
    //
    //         }
    //     });
    // });





    //删除预览图
    //1、移除页面img元素
    // $(document).on('click','.remove-img',function(){
    //     $(this).remove();
    // });

    //2、从服务器上删除图片
    //src是图片在服务器的地址
    // var filePath="";
    // $.post('ServiceAction_downLoadMaterial?filePath='+filePath).success(function(data){
    //
    // });




    //获取导航地图
//     $(document).on('click','.location-btn',function(){
//         //var url='';
//         //wx.getLocation({
//         //    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
//         //    success: function (res) {
//         //        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//         //        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//         //        var speed = res.speed; // 速度，以米/每秒计
//         //        var accuracy = res.accuracy; // 位置精度
//         //
//         //        var origin=longitude+','+latitude;//将要转换的坐标格式：114.21892734521,29.575429778924
//         //        /*alert("获取到的地理位置："+origin);*/
//         //        $.ajax({
//         //            type:'post',
//         //            url:'ServiceAction_mapDirection?origin='+origin+'&destination=31.582703541925778,120.30554965668202&fromType=wgs84&region=无锡',
//         //            success:function(data){
//         //                url=data.url;
//         //                /*alert("百度导航地图url=="+url);*/
//         //                //微信浏览器打开百度地图
//         //                location.href=url;
//         //            },
//         //            error:function(){
//         //                //alert("请求获取百度导航地图失败");
//         //            },
//         //        });
//         //    },
//         //    fail:function(){
//         //        //alert("调用网页SDK获取地理位置，失败");
//         //    }
//         //
//         //});
//
//     });
// });
//
//
// //调试的程序的时候打开
// wx.error(function (res) {
//     //alert("错误返回码：" + res.errMsg);
// });


//保存图片到服务器数据库
// function imgStr(url,materialNum){
//     /*alert(window.location.protocol);//设置或获取 协议
//     alert(window.location.host);//设置或获取 location 或 URL 的 hostname 和 port 号码*/
//     var baseUrl = window.location.protocol+'//'+window.location.host+'/';
//     //获取图片名字的字符串
//     //签收图片
//     var signImgStr = $("img[mytype=receiptImg]").map(function(i,item){
//         //去掉服务器url获得相对路径
//         return item.src.replace(baseUrl,"");
//     }).get().join(",");
//     //异常反馈图片
//     var excepImgStr = $("img[mytype=exceptImg]").map(function(i,item){
//         //去掉服务器url获得相对路径
//         return item.src.replace(baseUrl,"");
//     }).get().join(",");
//     /*alert("signImage="+signImgStr+",excepImgStr="+excepImgStr);*/
//     //请求参数
//     var params = {
//         signImgStr:signImgStr,
//         excepImgStr:excepImgStr,
//         materialNum:materialNum
//     };
//     var paramStr = JSON.stringify(params);
//     /*alert("图片上传的请求参数："+paramStr);*/
//
//     //保存到服务器
//     if(signImgStr.length>0||excepImgStr.length>0){//有图片上传的时候执行
//         $.ajax({
//             type:'post',
//             url:url,
//             data:{
//                 params:paramStr
//             },
//             success:function(data){
//                 if($.trim(data) == 'success')
//                     alert("图片上传成功！\n系统审核通过后，将给您发放现金红包！");
//                 else if($.trim(data) == 'error')
//                     alert("上传错误！")
//                 else
//                     alert("非法的请求参数！");
//             },
//             error:function(data){
//                 alert("图片上传错误，请重试！\n"+data);
//             }
//         });
//     }
// }