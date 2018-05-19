//路由事件
angular.module('app').run(['$rootScope', '$timeout', '$state','baseService', function ($rootScope, $timeout, $state,baseService) {
    $rootScope.$state = $state;

    $rootScope.$on('$ionicView.beforeEnter', function () {
        var statename = $state.current.name;
        if (statename === 'index.main' || statename === 'index.category' || statename === 'index.cart' || statename === 'index.ucenter') {
            return $rootScope.hideTabs = false;
        } else {
            return $rootScope.hideTabs = true;
        }
    });
}]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider','$ionicConfigProvider','$locationProvider', function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,$locationProvider) {

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    //路由配置
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/');
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                'index': {
                    templateUrl: "../app/views/tabs/tabs.html"
                }
            }
        })
        //首页
        .state('index.main', {
            url: '/main',
            views: {
                'main': {
                    controller: 'mainCtrl',
                    templateUrl: "../app/views/tabs/main.html"
                }
            },
            data: {
                pageTitle: '天禧珠宝'
            }
        })
        //首页产品跳转到产品页
        // .state('index.main-desc', {
        //     url: '/main-product-desc/:id',
        //     views: {
        //         'main': {
        //             controller: 'productDescCtrl',
        //             templateUrl: "../app/views/product/desc.html"
        //         }
        //     },
        //     data: {
        //         pageTitle: '产品详情'
        //     }
        // })
        //产品分类
        .state('index.category', {
            url: '/category',
            views: {
                'category': {
                    controller:'categoryCtrl',
                    templateUrl: "../app/views/tabs/category.html"
                }
            },
            data: {
                pageTitle: '全部分类'
            }
        })
        //购物车
        .state('index.cart', {
            url: '/cart',
            cache: false,
            views: {
                'cart': {
                    controller: 'cartListCtrl',
                    templateUrl: "../app/views/tabs/cart.html"
                }
            },
            data: {
                pageTitle: '购物车'
            }
        })
        //用户中心
        .state('index.ucenter', {
            url: '/ucenter',
            views: {
                'ucenter': {
                    controller:'ucenterCtrl',
                    templateUrl: "../app/views/tabs/ucenter.html"
                }
            },
            data: {
                pageTitle: '个人中心'
            }
        })
        //产品列表
        .state('index.goods-list', {
            url: '/goods/list/type-:type/condition-:condition/categoryID-:categoryID/useID-:useID/sort-:sort',
            views: {
                'category': {
                    controller: 'goodsListCtrl',
                    templateUrl: "../app/views/goods/list.html"
                }
            }
        })
        //从首页跳转到产品简介
        .state('index.main-details', {
            url: '/main/goods/details/:id',
            views: {
                'main': {
                    controller: 'goodsDetailsCtrl',
                    templateUrl: "../app/views/goods/details.html"
                }
            },
            data: {
                pageTitle: '产品详情'
            }
        })
        //从产品列表跳转到产品简介
        .state('index.goods-details', {
            url: '/category/goods/details/:id',
            views: {
                'category': {
                    controller: 'goodsDetailsCtrl',
                    templateUrl: "../app/views/goods/details.html"
                }
            },
            data: {
                pageTitle: '产品详情'
            }
        })
        // //产品图文详情
        // .state('index.product-details', {
        //     url: '/product/details/:id',
        //     views: {
        //         'category': {
        //             templateUrl: "../app/views/product/details.html"
        //         }
        //     },
        //     data: {
        //         pageTitle: '产品详情'
        //     }
        // })
        // //产品参数售后
        // .state('index.product-after-sale', {
        //     url: '/product/after-sale/:id',
        //     views: {
        //         'category': {
        //             controller: 'productAfterSalseCtrl',
        //             templateUrl: "../app/views/product/after-sale.html"
        //         }
        //     },
        //     data: {
        //         pageTitle: '参数/售后'
        //     }
        // })
        // //产品评价
        // .state('index.product-comment', {
        //     url: '/product/comment/:id',
        //     views: {
        //         'category': {
        //             controller: 'productCommentCtrl',
        //             templateUrl: "../app/views/product/comment.html"
        //         }
        //     },
        //     data: {
        //         pageTitle: '客户评价'
        //     }
        // })
        //从首页商品提交订单
        .state('index.main-order-confirm', {
            url: '/main-goods-order',
            views: {
                'main': {
                    controller: 'orderConfirmCtrl',
                    templateUrl: "../app/views/goods/order-confirm.html"
                }
            },
            data: {
                pageTitle: '提交订单'
            }
        })
        //从商品页提交订单
        .state('index.goods-order-confirm', {
            url: '/goods-pay',
            cache:false,
            views: {
                'category': {
                    controller: 'orderConfirmCtrl',
                    templateUrl: "../app/views/goods/order-confirm.html"
                }
            },
            data: {
                pageTitle: '提交订单'
            }
        })
        //从购物车提交订单
        .state('index.cart-order-confirm', {
            url: '/goods/cart-order-confirm',
            views: {
                'cart': {
                    controller: 'orderConfirmCtrl',
                    templateUrl: "../app/views/goods/order-confirm.html"
                }
            },
            data: {
                pageTitle: '提交订单'
            }
        })
        //全部订单
        .state('index.order-list', {
            url: '/order/list/:type',
            cache:false,
            views: {
                'ucenter': {
                    controller: 'orderListCtrl',
                    templateUrl: "../app/views/order/tabs.html"
                }
            },
            data: {
                pageTitle: '订单列表'
            }
        })
        //测试订单
        .state('index.test-order-list', {
            url: '/test-order/list/:type',
            cache:false,
            views: {
                'ucenter': {
                    controller: 'orderTestListCtrl',
                    templateUrl: "../app/views/order/list.html"
                }
            },
            data: {
                pageTitle: '订单列表'
            }
        })
        //订单详情
        .state('index.order-details', {
            url: '/order/details/:id',
            cache:false,
            views: {
                'ucenter': {
                    controller: 'orderDetailsCtrl',
                    templateUrl: "../app/views/order/details.html"
                }
            },
            data: {
                pageTitle: '订单详情'
            }
        })
        //订单评价
        .state('index.order-comment', {
            url: '/order/comment/:id',
            views: {
                'ucenter': {
                    controller: 'orderCommentCtrl',
                    templateUrl: "../app/views/order/comment.html"
                }
            },
            data: {
                pageTitle: '订单评价'
            }
        })
        //我的积分
        .state('index.intergral', {
            url: '/intergral',
            views: {
                'ucenter': {
                    controller:'intergralDetailsCtrl',
                    templateUrl: "../app/views/intergral/index.html"
                }
            },
            data: {
                pageTitle: '我的积分'
            }
        })
        //我的地址
        .state('index.address', {
            url: '/address',
            cache:false,
            views: {
                'ucenter': {
                    controller: 'addressListCtrl',
                    templateUrl: "../app/views/address/index.html"
                }
            },
            data: {
                pageTitle: '我的地址'
            }
        })
        //从首页商品详情页跳转到我的地址
        .state('index.main-confirm-address', {
            url: '/main-confirm-address',
            cache:false,
            views: {
                'main': {
                    controller: 'addressListCtrl',
                    templateUrl: "../app/views/address/index.html"
                }
            },
            data: {
                pageTitle: '我的地址'
            }
        })
        //从购物车跳转到我的地址
        .state('index.cart-confirm-address', {
            url: '/cart-confirm-address',
            cache:false,
            views: {
                'cart': {
                    controller: 'addressListCtrl',
                    templateUrl: "../app/views/address/index.html"
                }
            },
            data: {
                pageTitle: '我的地址'
            }
        })
        //从产品页跳转到我的地址
        .state('index.goods-confirm-address', {
            url: '/goods-confirm-address',
            cache:false,
            views: {
                'category': {
                    controller: 'addressListCtrl',
                    templateUrl: "../app/views/address/index.html"
                }
            },
            data: {
                pageTitle: '我的地址'
            }
        })
        //个人中心添加地址
        .state('index.add-address', {
            url: '/add-address',
            views: {
                'ucenter': {
                    controller: 'operateAddressCtrl',
                    templateUrl: "../app/views/address/operate.html"
                }
            },
            data: {
                pageTitle: '新增地址'
            }
        })
        //新增地址
        .state('index.main-add-address', {
            url: '/address/add',
            views: {
                'main': {
                    controller: 'operateAddressCtrl',
                    templateUrl: "../app/views/address/operate.html"
                }
            },
            data: {
                pageTitle: '新增地址'
            }
        })
        //从商品列表页跳转到新增地址
      .state('index.product-add-address', {
        url: '/product-add-address',
        views: {
          'category': {
            controller: 'operateAddressCtrl',
            templateUrl: "../app/views/address/operate.html"
          }
        },
        data: {
          pageTitle: '新增地址'
        }
      })
      //从购物车页跳转到新增地址
      .state('index.cart-add-address', {
        url: '/cart-add-address',
        views: {
          'cart': {
            controller: 'operateAddressCtrl',
            templateUrl: "../app/views/address/operate.html"
          }
        },
        data: {
          pageTitle: '新增地址'
        }
      })
        //从用户中心进入更新地址
        .state('index.update-address', {
            url: '/address/update/:id',
            views: {
                'ucenter': {
                    controller: 'operateAddressCtrl',
                    templateUrl: "../app/views/address/operate.html"
                }
            },
            data: {
                pageTitle: '更新地址'
            }
        })
        //从首页进入更新地址
        .state('index.main-update-address', {
            url: '/main-address/update/:id',
            views: {
                'main': {
                    controller: 'operateAddressCtrl',
                    templateUrl: "../app/views/address/operate.html"
                }
            },
            data: {
                pageTitle: '更新地址'
            }
        })
        //从购物车进入更新地址
        .state('index.cart-update-address', {
            url: '/cart-address/update/:id',
            views: {
                'cart': {
                    controller: 'operateAddressCtrl',
                    templateUrl: "../app/views/address/operate.html"
                }
            },
            data: {
                pageTitle: '更新地址'
            }
        })
        //从产品页进入更新地址
        .state('index.product-update-address', {
            url: '/product-address/update/:id',
            views: {
                'category': {
                    controller: 'operateAddressCtrl',
                    templateUrl: "../app/views/address/operate.html"
                }
            },
            data: {
                pageTitle: '更新地址'
            }
        })
        //绑定手机
        .state('index.bind-phone', {
            url: '/bind-phone',
            views: {
                'ucenter': {
                    controller: 'bindPhoneCtrl',
                    templateUrl: "../app/views/phone/bind-phone.html"
                }
            },
            data: {
                pageTitle: '绑定手机'
            }
        })
}]);