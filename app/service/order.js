angular.module('app').service('orderService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取订单列表
            getOrderList: function (currentPageNo,openID, pageSize, type) {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/order',
                    params: {
                        pageNo: currentPageNo,
                        pageSize: pageSize,
                        openid:openID,
                        type: type
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //获取订单详情
            getOrderDetails: function (id) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/order/detail',
                    params: {
                        id: id
                    }
                }).success(function (data) {
                    $rootScope.loading=false;
                    deferred.resolve(data);
                }).error(function (error) {
                    $rootScope.loading=false;
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //订单状态更改
            changeOrderState: function (id,state) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/order/status',
                    params: {
                        id: id,
                        status:state
                    }
                }).success(function (data) {
                    $rootScope.loading=false;
                    deferred.resolve(data);
                }).error(function (error) {
                    $rootScope.loading=false;
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //获取待评价订单中的商品
            getCommentProducts: function (id) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/order/products/list',
                    params: {
                        oid: id
                    }
                }).success(function (data) {
                    $rootScope.loading=false;
                    deferred.resolve(data);
                }).error(function (error) {
                    $rootScope.loading=false;
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //提交评价
            saveComment: function (commentObj) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/product/evaluate',
                    params: {
                        comment: commentObj
                    }
                }).success(function (data) {
                    $rootScope.loading=false;
                    deferred.resolve(data);
                }).error(function (error) {
                    $rootScope.loading=false;
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    }]);
