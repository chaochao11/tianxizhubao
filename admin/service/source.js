angular.module('app').service('sourceService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //访客时段分布
            getUvByTime: function (type,dateObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getUvData',
                    params:{
                        type:type,
                        dateObj:dateObj
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
            //地域分布
            getAreaData: function (type,dateObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getDistrictData',
                    params:{
                        type:type,
                        dateObj:dateObj
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
            //终端分布
            getDeviceData: function (type,dateObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getTerminalData',
                    params:{
                        type:type,
                        dateObj:dateObj
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
