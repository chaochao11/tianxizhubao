// angular.module('app').controller('orderTestListCtrl', ['$scope', '$rootScope','orderService', function ($scope, $rootScope,orderService) {
//   $scope.tabs = [
//     {
//       name: '全部'
//     },
//     {
//       name: '未付款'
//     },
//     {
//       name: '待发货'
//     }
//   ];
//
//   $scope.change=function (type) {
//     $scope.loadMore(1,type);
//   }
//   var currentPageNo = 0;
//   var pageSize = 6;
//   $scope.orderList = [];
//   $scope.hasMore=true;
//   $scope.loadMore = function (currentPageNo,type) {
//     var pageCount = 0;
//     currentPageNo++;
//     orderService.getOrderList(currentPageNo, $rootScope.openID, pageSize, type).then(function (dataObj) {
//       pageCount = Math.ceil(dataObj.itemCount / pageSize);
//       currentPageNo < pageCount ? $scope.hasMore = true : $scope.hasMore = false;
//       if (dataObj.data === undefined) {
//         $scope.orderList = [];
//         $scope.noData = true;
//       } else {
//         $scope.orderList = $scope.orderList.concat(dataObj.data);
//       }
//     }).finally(function () {
//       $scope.$broadcast('scroll.infiniteScrollComplete');
//     });
//   };
// }]);

/*订单列表*/
angular.module('app').controller('orderListCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'orderService',
    function ($scope, $state, $rootScope, $stateParams, orderService) {

        //当从订单列表点击后退按钮时直接回退到个人中心
        if (window.history && window.history.pushState) {
            window.history.pushState('back', null, './#/index/ucenter');
        }

        var currentPageNo = 0;
        var pageSize = 6;
        var type = $stateParams.type;
        $scope.hasMore = true;
        $scope.orderList = [];

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.loadMore = function () {
                var pageCount = 0;
                currentPageNo++;
                orderService.getOrderList(currentPageNo, localStorage.getItem('openID'), pageSize, type).then(function (response) {
                    pageCount = Math.ceil(response.itemCount / pageSize);
                    currentPageNo < pageCount ? $scope.hasMore = true : $scope.hasMore = false;
                    if (response.data === undefined) {
                        $scope.orderList = [];
                        $scope.noData = true;
                    } else {
                        $scope.orderList = $scope.orderList.concat(response.data);
                    }
                }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
        });
    }]);

/*
* 订单详情 
*/
angular.module('app').controller('orderDetailsCtrl', ['$scope', '$state', '$interval', '$timeout', '$stateParams', '$ngConfirm', '$ionicHistory', 'orderService',
    function ($scope, $state, $interval, $timeout, $stateParams, $ngConfirm, $ionicHistory, orderService) {

        $scope.$on('$locationChangeStart', function (ev, newUrl, oldUrl) {
            $scope.prevUrl = oldUrl;
            if ($state.current.name === 'index.order-details') {
                window.history.pushState('forward', null, $scope.prevUrl);
            }
        });

        if ($stateParams.id > 0) {
            orderService.getOrderDetails($stateParams.id).then(function (response) {
                console.log(response);
                $scope.orderDetailsObj = response.data;

                function getCloseOrderTime() {
                    var endTime = new Date(response.data.cutOffTime);
                    var currentTime = new Date();
                    var t = endTime.getTime() - currentTime.getTime();
                    var d = 0;
                    var h = 0;
                    var m = 0;
                    var s = 0;
                    if (t >= 0) {
                        d = Math.floor(t / 1000 / 60 / 60 / 24);
                        h = Math.floor(t / 1000 / 60 / 60 % 24);
                        m = Math.floor(t / 1000 / 60 % 60);
                        s = Math.floor(t / 1000 % 60);
                    }
                    h < 0 ? $scope.countDown = '已关闭' : $scope.countDown = h + "小时" + m + "分" + s + "秒";

                }
                $interval(function () {
                    getCloseOrderTime();
                });
            })
        }


        //取消订单
        $scope.cancelOrder = function (id) {
            $ngConfirm({
                boxWidth: '80%',
                useBootstrap: false,
                title: '确定要取消订单？',
                content: '被取消的订单将无法恢复',
                typeAnimated: true,
                buttons: {
                    tryAgain: {
                        text: '确定',
                        btnClass: 'btn-red',
                        action: function () {
                            orderService.changeOrderState(id, 5).then(function (dataObj) {
                                if (dataObj.status === 200) {
                                    $state.reload();
                                    $timeout(function () {
                                        $state.go('index.order-list', { type: 4 });
                                    }, 500)
                                }
                            }, function () {
                                alert('订单取消失败');
                            })
                        }
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        };

        //支付订单
        $scope.payOrder = function (id) {
            $ngConfirm({
                boxWidth: '80%',
                useBootstrap: false,
                title: '确定要支付？',
                content: '将会调用微信支付此订单',
                typeAnimated: true,
                buttons: {
                    tryAgain: {
                        text: '确定',
                        btnClass: 'btn-red',
                        action: function () {
                            orderService.changeOrderState(id, 1).then(function (dataObj) {
                                if (dataObj.status === 200) {
                                    $ngConfirm('订单支付成功');
                                    $timeout(function () {
                                        $state.go('index.order-list', { type: 1 });
                                    }, 500)
                                }
                            }, function () {
                                alert('订单支付失败');
                            })
                        }
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        };

        //确认收货
        $scope.confirmTake = function (id) {
            $ngConfirm({
                boxWidth: '80%',
                useBootstrap: false,
                title: '确定收货？',
                content: '确定已收到货物？',
                typeAnimated: true,
                buttons: {
                    tryAgain: {
                        text: '确定',
                        btnClass: 'btn-red',
                        action: function () {
                            orderService.changeOrderState(id, 3).then(function (dataObj) {
                                if (dataObj.status === 200) {
                                    $timeout(function () {
                                        $state.go('index.order-list', { type: 3 });
                                    }, 500)
                                }
                            }, function () {
                                alert('确认收货失败');
                            })
                        }
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        };
    }]);

/*
* 订单评价
*/
angular.module('app').controller('orderCommentCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'orderService', '$ngConfirm', '$timeout',
    function ($scope, $rootScope, $state, $stateParams, orderService, $ngConfirm, $timeout) {
        $scope.max = 5;
        //$scope.ratingVal = 4;
        $scope.readonly = false;
        $scope.onHover = function (val) {
            $scope.hoverVal = val;
        };

        $scope.onLeave = function () {
            $scope.hoverVal = null;
        };

        $scope.onChange = function (val) {
            $scope.ratingVal = val;
        };

        //获取订单中的商品列表
        orderService.getCommentProducts($stateParams.id).then(function (dataObj) {
            console.log(dataObj)
            $scope.productList = dataObj.data;
            angular.forEach($scope.productList, function (item) {
                item.ratingVal = 4;
                item.content = '';
                item.openid = localStorage.getItem('openID');
                item.attrs = item.skuattrs;
            })
        });

        //保存评价
        $scope.saveComment = function () {
            angular.forEach($scope.productList, function (item) {
                item.oid = $stateParams.id;
                item.stars = item.ratingVal;
                delete item.ratingVal;
                delete item.picture;
                delete item.skuattrs;
                orderService.saveComment(item).then(function (dataObj) {
                    $ngConfirm('商品评价成功');
                    $timeout(function () {
                        $state.go('index.order-list', { type: 4 });
                    }, 200)
                }, function () {
                    $ngConfirm('评价提交失败');
                })
            })
        }
    }]);

