angular.module('app').service('transportService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取物流公司
            getTransportCompanyList: function (pageNo,pageSize,searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/logistics',
                    params: {
                        pageNo: pageNo,
                        pageSize:pageSize,
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
            }
        }
    }]);
