angular.module('app').service('categoryService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取分类列表
            getCategoryList: function (pageNo,pageSize,searchObj,type) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/types',
                    params:{
                        pageNo:pageNo,
                        pageSize:pageSize,
                        searchObj:searchObj,
                        type:type
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
