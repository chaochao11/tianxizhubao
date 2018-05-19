angular.module('app').service('orderService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取订单列表
            getOrderList: function (pageNo,pageSize,type,searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/order/all',
                    params: {
                        pageNum: pageNo,
                        pageSize:pageSize,
                        type:type,
                        searchObj:searchObj
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            },
            //获取订单详情
            getOrderDetails: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/order/detail',
                    params: {
                        id:id
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            },
            //更改订单状态
            changeOrderState: function (id,state) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/order/status',
                    params: {
                        id:id,
                        status:state
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            },
            //订单发货
            transportOrder: function (id,trasportCompanyID,transportNum) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/order/send',
                    params: {
                        oid:id,
                        lid:trasportCompanyID,
                        logisticsNumber:transportNum
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            }
        }
    }]);
