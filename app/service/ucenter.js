angular.module('app').service('ucenterService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取个人信息
            getUserInfo: function (openID) {
                var deferred = $q.defer();
                $rootScope.loading=true;
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/info',
                    params: {
                        openid: openID
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
            //获取个人积分
            getUserIntegralList: function (openID,pageNo,pageSize) {
                var deferred = $q.defer();
                $rootScope.loading=true;
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/points',
                    params: {
                        openid: openID,
                        pageNo:pageNo,
                        pageSize:pageSize
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
            //获取用户已绑定的手机号
            getBindPhone: function (openID) {
                var deferred = $q.defer();
                $rootScope.loading=true;
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/user/mobile/isBind',
                    params:{
                        openid:openID
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
            //发送手机验证码
            getCode: function (phone) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/mobile/send',
                    params:{
                        phone:phone
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            //保存用户绑定的手机号
            savePhone: function (openid,phone,code) {
                var deferred = $q.defer();
                $rootScope.loading=true;
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/mobile/check',
                    params:{
                        openid:openid,
                        phone:phone,
                        code:code
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
