/*获取首页产品*/
angular.module('app').controller('mainCtrl',['$scope','mainService',function ($scope,mainService) {
    mainService.getMainProductList().then(function (dataObj) {
        $scope.mainProductList=dataObj.data;
    },function () {
        alert('获取数据失败');
    });
}]);