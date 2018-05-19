angular.module('app').service('userService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取用户列表
            getUserList: function (pageNo,pageSize,searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/user/list',
                    params: {
                        pageNum: pageNo,
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
