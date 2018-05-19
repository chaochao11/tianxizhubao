angular.module('app').service('tradeService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取交易概况
            getTradeData: function (type,date) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getTradeData',
                    params:{
                        type:type,
                        dateObj:date
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
            //获取交易数据概况
            getTradeChartData: function (type,date) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/getSaleGeneralSituation',
                    params:{
                        type:type,
                        dateObj:date
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
