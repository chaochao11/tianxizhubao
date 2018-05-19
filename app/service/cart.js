angular.module('app').service('cartService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取购物车列表
            getCartList: function (openID) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/cart',
                    params: {
                        openid: openID
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //删除购物车项
            deleteCartItem: function (itemID) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: $rootScope.baseURL + 'api/user/cart/delete',
                    params: {
                        id: itemID
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //更改购物车数量
            operateQuantity: function (itemID,quantity) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/cart/addCount',
                    params: {
                        cid: itemID,
                        proCount:quantity
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //获取购物车数量
            getCartQuantity: function (openID) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/cart/count',
                    params: {
                        openid: openID
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    }]);
