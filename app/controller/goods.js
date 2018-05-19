/*
* 商品分类
*/
angular.module('app').controller('categoryCtrl', ['$scope','$state','goodsService', function ($scope,$state,goodsService) {

    //获取珍珠品种分类
    goodsService.getGoodsCategory(1,1,0,'').then(function (response) {
        $scope.goodsCategory=response.data;
    });

    $scope.searchGoodsByCategory=function (id) {
        $state.go('index.goods-list',{
            type:1,
            condition:'',
            categoryID:id,
            useID:'',
            sort:'',
        })
    };

    //获取珍珠用途分类
    goodsService.getGoodsCategory(2,1,0,'').then(function (response) {
        console.log(response);
        $scope.goodsUses=response.data;
    });

    $scope.searchGoodsByUse=function (id) {
        $state.go('index.goods-list',{
            type:1,
            condition:'',
            categoryID:'',
            useID:id,
            sort:'',
        })
    };
}]);

/*
* 商品列表
*/
angular.module('app').controller('goodsListCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'goodsService', '$location', function ($scope, $rootScope, $stateParams, $state, goodsService, $location) {

    //点返回键直接返回分类列表页
    if (window.history && window.history.pushState) {
        window.history.pushState('back', null, './#/index/category');
    }

    localStorage.setItem('redirectBackUrl', $location.absUrl());

    var currentPageNo = 0;
    var pageSize = 6;
    $scope.condition = $stateParams.condition;
    var sort = $stateParams.sort;
    var type = $stateParams.type;
    $scope.categoryID=$stateParams.categoryID;
    $scope.useID=$stateParams.useID;
    $scope.hasMore = true;
    $scope.productList = [];

    //判断是否在价格排序下
    if ($stateParams.sort === 'asc-price' || $stateParams.sort === 'desc-price') {
        $scope.isActive = true;
    }

    //显示子菜单
    $scope.showSubNav = function () {
        $scope.isSubNavShow === 'open' ? $scope.isSubNavShow = '' : $scope.isSubNavShow = 'open';
    };

    //隐藏子菜单
    $scope.hideSubNav = function () {
        $scope.isSubNavShow = '';
    };

    //获取产品列表
    $scope.loadMore = function () {
        var pageCount = 0;
        currentPageNo++;
        goodsService.getGoodsList(type, $scope.condition, sort,$scope.categoryID,$scope.useID, currentPageNo, pageSize).then(function (response) {
            console.log(response);
            pageCount = Math.ceil(response.itemCount / pageSize);
            currentPageNo < pageCount ? $scope.hasMore = true : $scope.hasMore = false;
            $scope.productList = $scope.productList.concat(response.data);
        }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (e) {
            alert(e);
        });
    };
}]);

/*
* 商品详情
*/
angular.module('app').controller('goodsDetailsCtrl', ['$scope', '$sce', '$rootScope', '$stateParams', '$state', '$timeout', 'goodsService', '$ionicSlideBoxDelegate', function ($scope, $sce, $rootScope, $stateParams, $state, $timeout, goodsService, $ionicSlideBoxDelegate) {
    $scope.tabState = 1;
    $rootScope.confirmOrderObj = [];
    $scope.productObj = {};
    $scope.cartObj = {};
    $scope.quantity = 1;
    $scope.isMax = true;
    $scope.isMin = true;

    //Tab切换
    $scope.switchTabs = function (param) {
        $scope.tabState = param;
    };

    //获取产品简介
    goodsService.getDetailsByID(1, $stateParams.id).then(function (response) {
        $scope.productObj = response.data;
        $scope.$broadcast('getSku', response.data.skuResults);
        $scope.productImagesSlideList = $scope.productObj.pictures.split(',');
        $ionicSlideBoxDelegate.update();
        $scope.pic = $scope.productImagesSlideList[0];
    }, function () {
        alert('请求失败');
    });

    //获取产品图文详情
    goodsService.getDetailsByID(2, $stateParams.id).then(function (response) {
        $scope.productDetailsObj = response.data.content;
        $scope.productDetailsObj = $sce.trustAsHtml($scope.productDetailsObj);
    }, function () {
        alert('请求失败');
    });

    //获取产品参数售后详情
    goodsService.getDetailsByID(3, $stateParams.id).then(function (response) {
        $scope.attrWithServiceObj = response.data;
        $scope.packageContent = $sce.trustAsHtml(response.data.packinglist);
        $scope.custserviceContent = $sce.trustAsHtml(response.data.custservice);
    }, function () {
        alert('请求失败');
    });

    //获取产品评价
    goodsService.getDetailsByID(4, $stateParams.id, 1, 6).then(function (response) {
        $scope.commentObj = response.data;
        $scope.commentList = $scope.commentObj.comments;
    }, function () {
        alert('请求失败');
    });

    $scope.max = 5;
    $scope.ratingVal = 4;
    $scope.readonly = true;
    $scope.onHover = function (val) {
        $scope.hoverVal = val;
    };

    $scope.onLeave = function () {
        $scope.hoverVal = null;
    };

    $scope.onChange = function (val) {
        $scope.ratingVal = val;
    };


    //增加数量
    $scope.add = function () {
        $scope.quantity++;
    };

    //减少数量
    $scope.reduce = function () {
        $scope.quantity--;
    };

    //手动输入数量
    $scope.changeNum = function (num) {
        $scope.n = parseInt(num);
        $scope.$watch('n', function (newVal) {
            if (newVal === 1) {
                $scope.isMin = true;
                $scope.isMax = false;
            } else if (newVal > $scope.stock) {
                alert('超出库存数量，请重新输入！');
                $scope.isValid = true;
                $scope.isMax = true;
                $scope.isMin = false;
            }
        })
    };


    //获取选择的属性和数量
    $scope.isValid = true;
    $scope.$on('selectedPro', function (ev, data) {
        $scope.callback = function (stock, price, pic, skuid) {
            if (data.length === 3) {
                $scope.stock = stock;
                $scope.price = price;
                $scope.imgLoading = true;
                $timeout(function () {
                    $scope.imgLoading = false;
                    $scope.pic = pic;
                }, 2000);
                $scope.skuID = skuid;
            }
        };
        if (data.length === 3) {
            $scope.isValid = false;
            $scope.isMin = false;
            $scope.isMax = false;
        } else {
            $scope.isValid = true;
            $scope.isMin = true;
            $scope.isMax = true;
        }
        $scope.getSelectedProperty = function () {
            $scope.selectedPropertyText = data.join(',');
            $scope.productObj.defaultPrice = $scope.price;
            $scope.hidePanel();
        }
    });

    //立即购买
    $scope.buyImmediately = function () {
        $rootScope.confirmOrderObj = [];
        if ($scope.selectedPropertyText === undefined) {
            $scope.showSchedulePanel();
        } else {
            $scope.orderObj = {};
            $scope.orderObj.id = $scope.productObj.jid;
            $scope.orderObj.name = $scope.productObj.name;
            $scope.orderObj.pic = $scope.productImagesSlideList[0];
            $scope.orderObj.property = $scope.selectedPropertyText;
            $scope.orderObj.quantity = $scope.quantity;
            $scope.orderObj.price = $scope.price;
            $scope.orderObj.skuID = $scope.skuID;
            $rootScope.confirmOrderObj.push($scope.orderObj);
            $state.current.name === 'index.main-details' ? $state.go('index.main-order-confirm') : $state.go('index.goods-order-confirm');
        }
    };

    //添加到购物车
    $scope.addToCart = function () {
        if ($scope.selectedPropertyText === undefined) {
            $scope.showSchedulePanel();
        } else {
            $scope.cartObj.openid = localStorage.getItem('openID');
            $scope.cartObj.jid = $scope.productObj.jid;
            $scope.cartObj.attrvalues = $scope.selectedPropertyText;
            $scope.cartObj.num = $scope.quantity;
            $scope.cartObj.skuid = $scope.skuID;

            goodsService.addToCart($scope.cartObj).then(function (dataObj) {
                $scope.$emit('cartQuantity', dataObj.data.count);
            })
        }
    };

    //显示属性选择面板
    $scope.showSchedulePanel = function () {
        $scope.isPanelShow = 'show';
    };

    //隐藏属性选择面板
    $scope.hidePanel = function () {
        $scope.isPanelShow = '';
    };


    //获取产品参数售后
    goodsService.getDetailsByID(3, $stateParams.id).then(function (dataObj) {
        if (dataObj.status === 200) {
            $scope.productObj = dataObj.data;
        } else if (dataObj.status === 500) {
            alert('请求失败');
        }
    }, function () {
        alert('请求失败');
    });


    //获取产品评价
    goodsService.getDetailsByID(4, $stateParams.id, 1, 6).then(function (dataObj) {
        console.log(dataObj);
        if (dataObj.status === 200) {
            $scope.commentObj = dataObj.data;
            $scope.commentList = dataObj.data.comments;
        } else if (dataObj.status === 500) {
            alert('请求失败');
        }
    }, function () {
        alert('请求失败');
    });


    $scope.max = 5;
    $scope.ratingVal = 4;
    $scope.readonly = true;
    $scope.onHover = function (val) {
        $scope.hoverVal = val;
    };

    $scope.onLeave = function () {
        $scope.hoverVal = null;
    };

    $scope.onChange = function (val) {
        $scope.ratingVal = val;
    };
}]);

/**
 * 确认订单
 */
angular.module('app').controller('orderConfirmCtrl', ['$scope', '$state', '$rootScope', 'goodsService', 'addressService', 'orderService', '$ngConfirm', '$timeout',
    function ($scope, $state, $rootScope, goodsService, addressService, orderService, $ngConfirm, $timeout) {

        $scope.couponArray = [];//
        $scope.totalReducePrice = 0;//所有应获得的优惠金额

        // console.log($rootScope.confirmOrderObj);

        //取得订单列表中的商品ID、商品单价、商品数量、SKUID
        angular.forEach($rootScope.confirmOrderObj, function (item) {
            $scope.couponArray.push(item.id + ',' + item.price + ',' + item.quantity + ',' + item.skuID);
        });
        var couponObj = $scope.couponArray.join(';');

        //获取商品的优惠
        goodsService.getOrderCoupon(couponObj).then(function (response) {
            $scope.canGetIntegral = response.data.integral;
            $scope.activityList = response.data.activityList;
            //获取一共需要优惠的金额
            angular.forEach($scope.activityList, function (item) {
                $scope.totalReducePrice += item.reducePrice;
            });
            $scope.$broadcast('totalReducePrice', $scope.totalReducePrice)
        });


        $scope.isSelectIntergral = true;//初始化是否选中积分抵扣

        //订单信息异常
        if ($rootScope.confirmOrderObj === undefined) {
            alert('订单信息有误');
        } else {

            if ($state.current.name === 'index.goods-order-confirm') {
                $scope.jumpUrl = 'index.goods-confirm-address';
            } else if ($state.current.name === 'index.cart-order-confirm') {
                $scope.jumpUrl = 'index.cart-confirm-address';
            } else {
                $scope.jumpUrl = 'index.main-confirm-address';
            }

            //获取默认地址
            $scope.$on('$ionicView.beforeEnter', function () {
                addressService.getDefaultAddress(localStorage.getItem('openID')).then(function (response) {
                    angular.toJson(response.data) === '{}' ? $scope.hasAddress = true : $scope.hasAddress = false;
                    if (response.status === 200) {
                        $scope.addressObj = response.data;
                    }
                });
            });

            //判断是否选择积分支付
            $scope.selectIntergarl = function () {
                $scope.isSelectIntergral = !$scope.isSelectIntergral;
            };

            //离开订单确认页事件，清空临时的订单数据
            $scope.$on('$ionicView.afterLeave', function () {
                console.log($state.current.name);
                if ($state.current.name !== 'index.goods-confirm-address' || $scope.current.name !== 'index.main-confirm-address') {
                    //$rootScope.confirmOrderObj = [];
                }
            });

            //计算订单总价
            $scope.getTotalPrice = function () {
                var totalPrice = 0;//订单总价
                angular.forEach($scope.submitTempOrderObj, function (item) {
                    $scope.itemPirce = item.quantity * item.price;
                    totalPrice += $scope.itemPirce;
                });

                //获取优惠总金额
                $scope.$on('totalReducePrice', function (ev, data) {
                    $scope.totalPriceWithReduce = totalPrice - data;
                });

                return Number($scope.totalPriceWithReduce).toFixed(2);
            };

            //获取提交的商品详情
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.submitTempOrderObj = $rootScope.confirmOrderObj;
                //console.log($scope.submitTempOrderObj);
            });

            //提交订单
            $scope.submitOrder = function () {
                $scope.skus = [];
                $scope.submitOrderObj = {};

                //获取SKU集合
                angular.forEach($scope.submitTempOrderObj, function (item) {
                    var skuItem = item.skuID + ',' + item.quantity;
                    $scope.skus.push(skuItem);
                });

                //订单数据对象
                $scope.submitOrderObj.openid = localStorage.getItem('openID');
                $scope.submitOrderObj.addid = $scope.addressObj.id;
                $scope.submitOrderObj.skus = $scope.skus.join(';');
                $scope.submitOrderObj.status = 0;
                $scope.submitOrderObj.activitydeduction = $scope.totalReducePrice;
                $scope.submitOrderObj.integraldeduction = 0;
                $scope.submitOrderObj.transportationexpenses = 0;
                $scope.submitOrderObj.total = $scope.getTotalPrice();
                console.log($scope.submitOrderObj);

                //提交订单
                goodsService.submitOrder($scope.submitOrderObj).then(function (response) {
                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId": response.data.appId,
                                "timeStamp": response.data.timeStamp,
                                "nonceStr": response.data.nonceStr,
                                "package": response.data.packAge,
                                "signType": response.data.signType,
                                "paySign": response.data.paySign
                            },
                            function (res) {
                                if (res.err_msg === "get_brand_wcpay_request:ok") {
                                    orderService.changeOrderState(response.data.oid, 1).then(function () {
                                        $state.go('index.order-list', {type: 1});
                                        //$state.go('index.order-details', {id: dataObj.data.oid});
                                    })
                                } else {
                                    alert('支付失败');
                                    $state.go('index.order-list', {type: 0});
                                }
                            }
                        );
                    }

                    if (typeof WeixinJSBridge === "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                    if (dataObj.status === 400) {
                        alert('订单提交失败，超出库存数量');
                    }
                });
            }
        }
    }]);