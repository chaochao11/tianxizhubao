angular.module('app').service('goodsService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取商品列表
            getGoodsList: function (pageNo, pageSize, type, searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/jewels',
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        type: type,
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
            //获取商品详情
            getGoodsDetails: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/getProductById',
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
            //获取商品详情的SKU属性
            getGoodsDetailsAttr: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/getItemByProductId',
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
            //添加商品
            addGoods: function (goodsObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/product/add',
                    params: {
                        proInfo: goodsObj
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
            //更新商品
            updateGoods: function (goodsObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: $rootScope.baseURL + 'api/jewel/updateProduct',
                    params: {
                        proInfo: goodsObj
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
            //商品上下架
            changeGoodsState: function (id, type) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/jewel/ground',
                    params: {
                        jid: id,
                        type: type
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
            //获取商品属性
            getAttrList: function (pageNo, pageSize, searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/attributes',
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
            //添加商品属性
            addAttr: function (id, name) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/attribute/add',
                    params: {
                        name: name,
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
            //删除商品属性
            deleteAttr: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: $rootScope.baseURL + 'api/admin/attributes/delete',
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
            //更新商品属性
            updateAttr: function (id, name) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/attribute/edit',
                    params: {
                        id: id,
                        name: name
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
            //获取商品评论列表
            getCommentList: function (goodsID, pageNo, pageSize, searchObj) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + '/api/admin/comments',
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        id: goodsID,
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
            //审核商品评论
            changeGoodsCommentState: function (id,state) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/admin/comment/reviewed',
                    params: {
                        id: id,
                        type:state
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
            //删除商品评论
            deleteComment: function (id) {
                $rootScope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: $rootScope.baseURL + 'api/admin/comment/delete',
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
        }
    }]);
