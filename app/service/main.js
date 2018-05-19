angular.module('app').service('mainService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取首页商品数据
            getMainProductList: function () {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/index',
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
