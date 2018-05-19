/*
* 获取活动列表
*/
angular.module('app').controller('mainCtrl', ['$scope', '$state', '$stateParams', '$mdToast', 'mainService', function ($scope, $state, $stateParams, $mdToast, mainService) {

    //获取首页待发货订单、退款订单、昨日订单、昨日交易额、总交易额
    mainService.getBasicDataInfo().then(function (response) {
        $scope.dataBasicObj = response.data;
    });

    //获取会员总数、今日新增、今日访客数、今日购买数、已购买用户占比
    mainService.getMemberDataInfo().then(function (response) {
        //console.log(response);
        $scope.memberDataObj=response.data;
    });

    //订单分布概况
    mainService.getOrderDataInfo().then(function (response) {
        $scope.$broadcast('orderData',response.data);
    });
}]);