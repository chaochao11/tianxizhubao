angular.module('app').service('baseService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取用户openID
            getOpenID: function () {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/serviceManager/isLive'
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    }]);
