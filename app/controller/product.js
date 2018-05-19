/*
* 商品列表
*/
angular.module('app').controller('productListCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'productService','$location', function ($scope, $rootScope, $stateParams, $state, productService,$location) {

  //点返回键直接返回分类列表页

    if (window.history && window.history.pushState) {
      window.history.pushState('back', null, './#/index/category');
    }

  localStorage.setItem('redirectBackUrl',$location.absUrl());

  var currentPageNo = 0;
  var pageSize = 6;
  $scope.condition = $stateParams.condition;
  var sort = $stateParams.sort;
  var type = $stateParams.type;
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
    productService.getProductList(type, $scope.condition, sort, currentPageNo, pageSize).then(function (dataObj) {
      pageCount = Math.ceil(dataObj.itemCount / pageSize);
      currentPageNo < pageCount ? $scope.hasMore = true : $scope.hasMore = false;
      $scope.productList = $scope.productList.concat(dataObj.data);
    }).finally(function () {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function (e) {
      alert(e);
    });
  };
}]);

/*商品路由菜单激活判断*/
angular.module('app').controller('productSubNavCtrl', ['$scope', '$rootScope', '$state', '$stateParams', function ($scope, $rootScope, $state, $stateParams) {

  //判断从不同路由进去商品详情Tab的激活状态
  if ($state.current.name === 'index.main-desc' || $state.current.name === 'index.product-desc') {
    $scope.isActive = true;
  }

  //获取商品的ID
  if ($stateParams.id > 0) {
    $scope.productID = $stateParams.id;
  }
}]);

/*产品简介*/
angular.module('app').controller('productDescCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'productService', '$ionicSlideBoxDelegate',
  function ($scope, $state, $rootScope, $stateParams, productService, $ionicSlideBoxDelegate) {

    if($state.current.name!=='index.main-desc') {
      if (window.history && window.history.pushState) {
        window.history.pushState('back', null, localStorage.getItem('redirectBackUrl'));
      }
    }

    $rootScope.confirmOrderObj = [];
    $scope.productObj = {};
    $scope.cartObj = {};
    $scope.quantity = 1;
    $scope.isMax = true;
    $scope.isMin = true;

    //获取产品简介
    productService.getDetailsByID(1, $stateParams.id).then(function (dataObj) {
      if (dataObj.status === 200) {
        $scope.productObj = dataObj.data;
        $scope.$broadcast('test', dataObj.data.skuResults);
        $scope.productImagesSlideList = $scope.productObj.pictures.split(',');
        $ionicSlideBoxDelegate.update();
        $scope.pic = $scope.productImagesSlideList[0];
      } else if (dataObj.status === 500) {
        alert('请求失败');
      }
    }, function () {
      alert('请求失败');
    });


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
          $scope.pic = pic;
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
        $state.current.name === 'index.main-desc' ? $state.go('index.main-order-confirm') : $state.go('index.product-order-confirm');
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

        productService.addToCart($scope.cartObj).then(function (dataObj) {
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
  }]);

/*参数售后*/
angular.module('app').controller('productAfterSalseCtrl', ['$scope', '$rootScope', '$stateParams', 'productService',
  function ($scope, $rootScope, $stateParams, productService) {

  console.log(localStorage.getItem('redirectBackUrl'));
  if (window.history && window.history.pushState) {
    window.history.pushState('back', null, localStorage.getItem('redirectBackUrl'));
  }

  //获取产品参数售后
  productService.getDetailsByID(3, $stateParams.id).then(function (dataObj) {
    if (dataObj.status === 200) {
      $scope.productObj = dataObj.data;
    } else if (dataObj.status === 500) {
      alert('请求失败');
    }
  }, function () {
    alert('请求失败');
  });
}]);

/*产品评价*/
angular.module('app').controller('productCommentCtrl', ['$scope', '$rootScope', '$stateParams', 'productService', function ($scope, $rootScope, $stateParams, productService) {

  console.log(localStorage.getItem('redirectBackUrl'));
  if (window.history && window.history.pushState) {
    window.history.pushState('back', null, localStorage.getItem('redirectBackUrl'));
  }

  //获取产品评价
  productService.getDetailsByID(4, $stateParams.id, 1, 6).then(function (dataObj) {
    if (dataObj.status === 200) {
      console.log(dataObj);
      $scope.commentObj = dataObj.data;
      $scope.commentList = $scope.commentObj.comments;
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

/*确认订单*/
angular.module('app').controller('orderConfirmCtrl', ['$scope', '$state', '$rootScope', 'productService', 'addressService', 'orderService', '$ngConfirm',
  function ($scope, $state, $rootScope, productService, addressService, orderService, $ngConfirm) {

    $scope.isSelectIntergral = true;//初始化是否选中积分抵扣

    //订单信息异常
    if ($rootScope.confirmOrderObj === undefined) {
      alert('订单信息有误');
    } else {

      if ($state.current.name === 'index.product-order-confirm') {
        $scope.jumpUrl = 'index.product-confirm-address';
      } else if ($state.current.name === 'index.cart-order-confirm') {
        $scope.jumpUrl = 'index.cart-confirm-address';
      } else {
        $scope.jumpUrl = 'index.main-confirm-address';
      }

      //获取默认地址
      $scope.$on('$ionicView.beforeEnter', function () {
        addressService.getDefaultAddress(localStorage.getItem('openID')).then(function (dataObj) {
          angular.toJson(dataObj.data) === '{}' ? $scope.hasAddress = true : $scope.hasAddress = false;

          if (dataObj.status === 200) {
            $scope.addressObj = dataObj.data;
          }
        });
      });

      //判断是否选择积分支付
      $scope.selectIntergarl = function () {
        $scope.isSelectIntergral = !$scope.isSelectIntergral;
      };

      //离开订单确认页事件，清空临时的订单数据
      $scope.$on('$ionicView.afterLeave', function () {
        if ($state.current.name !== 'index.product-confirm-address') {
          $rootScope.confirmOrderObj = [];
        }
      });

      //计算订单总价
      $scope.getTotalPrice = function () {
        var totalPrice = 0;//订单总价
        angular.forEach($scope.submitTempOrderObj, function (item) {
          $scope.itemPirce = item.quantity * item.price;
          totalPrice += $scope.itemPirce;
        });
        return totalPrice;
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
        $scope.submitOrderObj.activitydeduction = 0;
        $scope.submitOrderObj.integraldeduction = 0;
        $scope.submitOrderObj.transportationexpenses = 0;
        $scope.submitOrderObj.total = $scope.getTotalPrice();
        productService.submitOrder($scope.submitOrderObj).then(function (dataObj) {

          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": dataObj.data.appId,
                "timeStamp": dataObj.data.timeStamp,
                "nonceStr": dataObj.data.nonceStr,
                "package": dataObj.data.packAge,
                "signType": dataObj.data.signType,
                "paySign": dataObj.data.paySign
              },
              function (res) {
                if (res.err_msg === "get_brand_wcpay_request:ok") {
                  orderService.changeOrderState(dataObj.data.oid, 1).then(function () {
                    $state.go('index.order-details', {id: dataObj.data.oid});
                  })
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
          if (dataObj.status === 200) {
            // wx.chooseWXPay({
            //     appId:dataObj.data.appId,
            //     timeStamp: dataObj.data.timeStamp,
            //     nonceStr: dataObj.data.nonceStr,
            //     package: dataObj.data.packAge,
            //     signType: dataObj.data.signType,
            //     paySign: dataObj.data.paySign,
            //     success: function (res) {
            //         alert('支付成功')
            //     }
            // });

            // $ngConfirm({
            //     boxWidth: '80%',
            //     useBootstrap: false,
            //     title: '订单提交成功',
            //     content: '',
            //     type: 'black',
            //     typeAnimated: true,
            //     buttons: {
            //         tryAgain: {
            //             text: '确定',
            //             content: '点击确定返回',
            //             action: function () {
            //                 $state.go('index.order-list', {type: 0}, {reaload: true});
            //             }
            //         }
            //     }
            // });
          }
          if (dataObj.status === 400) {
            alert('订单提交失败，超出库存数量');
          }
        });
      }
    }
  }]);
