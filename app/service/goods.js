angular.module('app').service('goodsService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //获取商品详情
            getGoodsCategory: function (type, pageNo,pageSize) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/admin/types',
                    params: {
                        type: type,
                        pageNo:pageNo,
                        pageSize:pageSize
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //获取商品列表
            getGoodsList: function (type, condition,sort,categoryID,useID,pageNo,pageSize) {
                var deferred = $q.defer();
                $rootScope.loading=true;
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/condition',
                    params: {
                        type: type,
                        condition: condition,
                        sort:sort,
                        categoryId:categoryID,
                        use:useID,
                        pageNo:pageNo,
                        pageSize:pageSize
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //获取商品详情
            getDetailsByID: function (type, id,pageNo,pageSize) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/introduction',
                    params: {
                        type: type,
                        jid: id,
                        pageNo:pageNo,
                        pageSize:pageSize
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //添加到购物车
            addToCart: function (cartObj) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/cart/add',
                    params: {
                        cartDetail: cartObj
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //提交订单
            submitOrder: function (confirmOrderObj) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: $rootScope.baseURL + 'api/user/order/add',
                    params: {
                        orderObj: confirmOrderObj
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                    $rootScope.loading=false;
                }).error(function (error) {
                    deferred.reject(error);
                    $rootScope.loading=false;
                });
                return deferred.promise;
            },
            //获取订单中的优惠活动
            getOrderCoupon: function (goodsObj) {
                $rootScope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.baseURL + 'api/jewel/getDiscount',
                    params: {
                        orders: goodsObj
                    }
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
