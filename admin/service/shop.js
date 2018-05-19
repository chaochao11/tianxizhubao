angular.module('app').service('shopService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取店铺概况数据
            getBasicDataInfo: function () {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/store/situation'
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            },
            //获取联系方式
            getContact: function () {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getConUs'
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            },
            //更新联系方式
            updateContact: function (contactObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/updateContactUs',
                    params:{
                        contactUsObj:contactObj
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
            //更新售后联系方式
            updateAfterSales: function (aferSalesObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/updateAfterSaleService',
                    params:{
                        afterSaleServiceObj:aferSalesObj
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
            //获取售后联系方式
            getAfterSalesContact: function () {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getAss'
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading = false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading = false;
                });
                return deferred.promise;
            },
            //获取员工列表
            getEmployeeList: function (pageNo,pageSize,searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getAll',
                    params:{
                        pageNo:pageNo,
                        pageSize:pageSize,
                        params:searchObj
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
            //删除员工
            deleteEmployee: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: $rootScope.baseURL + 'api/admin/deleteAdmin',
                    params:{
                        id:id
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
            //获取员工详情
            getEmployeeDetails: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/getById',
                    params:{
                        id:id
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
            //更新员工资料
            updateEmployee: function (employeeObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/updateAdmin',
                    params:{
                        adminObj:employeeObj
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
            //新增员工资料
            createEmployee: function (employeeObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/addAdmin',
                    params:{
                        adminObj:employeeObj
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
            //获取积分规则列表
            getIntegralList: function (pageNo,pageSize,searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/integral/getIntegralRuleList',
                    params:{
                        pageNo:pageNo,
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
            },
            //删除积分规则
            deleteIntegral: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: $rootScope.baseURL + 'api/integral/deleteIntegralRule',
                    params:{
                        id:id
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
            //获取积分规则详情
            getIntegralDetails: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/integral/getIntegralRuleById',
                    params:{
                        id:id
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
            //更新积分规则
            updateIntegral: function (integralObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: $rootScope.baseURL + 'api/integral/updateIntegralRule',
                    params:{
                        integralObj:integralObj
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
            //新增积分规则
            createIntegral: function (integralObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/integral/addIntegralRule',
                    params:{
                        integralObj:integralObj
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
