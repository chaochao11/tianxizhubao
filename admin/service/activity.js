angular.module('app').service('activityService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取活动列表
            getActivitysList: function (pageNo, pageSize, searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/activity/list',
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        searchObj: searchObj
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
            //获取活动类型列表
            getActivitysTypeList: function (pageNo, pageSize, searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/activityTag/list',
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        searchObj: searchObj
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
            //获取活动详情
            getActivityDetails: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/activity/details',
                    params: {
                        id: id
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
            //添加活动
            addActivity: function (activityObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/activity/add',
                    params: {
                        activityObj: activityObj
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
            //更新活动
            updateActivity: function (id,activityObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/activity/edit',
                    params: {
                        id:id,
                        activityObj: activityObj
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
            //删除活动
            deleteActivity: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: $rootScope.baseURL + 'api/admin/activity/delete',
                    params: {
                        id: id
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
