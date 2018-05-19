angular.module('app').service('addressService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取默认收货地址
            getDefaultAddress: function (openID) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/address/default',
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
            //获取全部收货地址
            getAddressList: function (openID) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/addresses',
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
            //新增或更新收货地址
            operateAddress: function (addressObj) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/address/add',
                    params: {
                        addressInfo: addressObj
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
            //设置默认地址
            setDefaultAddress: function (id) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/address/setDefault',
                    params: {
                        addid: id
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
            //删除地址
            deleteAddress: function (id) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/address/delete',
                    params: {
                        addid: id
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
            //更新用户地址
            updateAddress: function (addressObj) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/address/change',
                    params: {
                        addressInfo: addressObj
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
            //获取地址详情
            getAddressDetails: function (id) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/address/detail',
                    params: {
                        id: id
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            }
        }
    }]);
