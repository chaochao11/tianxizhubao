angular.module('app').service('fluxService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //访问店铺数据
            getUvByTime: function (type,date) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getFlowInfo',
                    params:{
                        type:type,
                        date:date
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
