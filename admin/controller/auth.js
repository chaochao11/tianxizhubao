angular.module('app').controller('loginCtrl',['$scope','$cookies','$state','authService',function ($scope,$cookies,$state,authService) {
    //回车确认登陆
    document.onkeydown = function () {
        if (event.keyCode === 13) {
            document.getElementById('btnLogin').click();
        }
    };
    //登陆验证
    $scope.loginVerify=function (loginObj,ev) {
        var md5 = require('md5');
        loginObj.password=md5(loginObj.password);
        var obj = ev.currentTarget;
        obj.disabled = true;
        obj.innerHTML = '正在登陆...';
        authService.loginValid(loginObj).then(function (response) {
            if(response.statusCode === 200) {
                var today = new Date();
                var expireDate = new Date(today);
                expireDate.setMinutes(today.getMinutes() + 60);
                $cookies.putObject('admin',loginObj.name, {'expires': expireDate});
                $state.go('index.main');
            }else{
                obj.innerHTML = '用户名或密码错误';
                obj.style.color = '#f44330';
                obj.disabled = true;
                setTimeout(function () {
                    obj.innerHTML = '登陆';
                    obj.style.color = '#fff';
                    obj.disabled = false;
                }, 2000)
            }
        })
    }
}]);