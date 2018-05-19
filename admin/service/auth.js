angular.module('app').service('authService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
        return {
            //验证登陆
            loginValid: function (adminObj) {
                console.log($rootScope.baseURL);
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/login',
                    params: {
                        adminObj: adminObj
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