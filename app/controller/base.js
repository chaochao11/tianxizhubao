angular.module('app').controller('baseCtrl',['$scope','$state','$rootScope','baseService','cartService',function ($scope,$state,$rootScope,baseService,cartService) {
    //接口路径
    $rootScope.baseURL = 'http://tianxi.loforce.cn/';
    //localStorage.setItem('openID','okZjxs2Tq6huaaN5AABAhcSUsUpw');

    //获取用户openID
    baseService.getOpenID().then(function (response) {
        if(response.status===500){
          //window.location.href = $rootScope.baseURL + '/api/serviceManager/getOpenId';
          localStorage.setItem('openID','okZjxs7VtaT230F0UJx4ff98Ahck');
        }else{
          // localStorage.setItem('openID', dataObj.openid);
          // localStorage.setItem('avatar',dataObj.headImgUrl);
          // localStorage.setItem('nickName',dataObj.nickName);
          // localStorage.setItem('integral',dataObj.totalPoint);
          localStorage.setItem('openID','okZjxs7VtaT230F0UJx4ff98Ahck');
        }
    }).then(function () {
        //获取购物车数量
        cartService.getCartQuantity(localStorage.getItem('openID')).then(function (dataObj) {
            $scope.cartQuantity=dataObj.data.count;
        });
    });

    //底部Tab切换
    $scope.tabSwitch=function (state) {
        $state.go(state);
    };


    //当添加或删除时更新购物车数量
    $scope.$on('cartQuantity',function (event,data) {
        $scope.cartQuantity=data;
    })
}]);
