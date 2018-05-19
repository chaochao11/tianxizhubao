//路由事件
angular.module('app').run(['$rootScope', '$timeout', '$state', function ($rootScope, $timeout, $state) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //从页面底部返回时跳转到页面顶部
        $timeout(function () {
            var obj = document.getElementById('scroll_bar');
            if (obj !== null) {
                obj.scrollTop = 0;
            }
        });

        $rootScope.fromState=fromState.name;
        $rootScope.fromParams=fromParams;
    });
    $rootScope.$state = $state;
}]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {

        /*坑爹的IE11配置，本地必须注释，否则接口报错*/
        // if (!$httpProvider.defaults.headers.get) {
        //     $httpProvider.defaults.headers.get = {};
        // }
        // $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        // $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        //
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        ///路由配置
        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/login');
        $httpProvider.interceptors.push('adminIntercepter');
        $stateProvider
        //登录页
            .state('login', {
                url: '/login',
                views: {
                    'login': {
                        controller: 'loginCtrl',
                        templateUrl: 'views/auth/login.html'
                    }
                }
            })
            //后台主页
            .state('index', {
                url: "/",
                views: {
                    "main": {
                        controller: 'layoutCtrl as userMenuCtrl',
                        templateUrl: 'template/layout-content.html'
                    }
                }
            })
            //后台首页
            .state('index.main', {
                url: 'main',
                views: {
                    'layoutContent': {
                        controller: 'mainCtrl',
                        templateUrl: 'views/main.html'
                    }
                }
            })
            //概况
            .state('index.shop', {
                url: 'shop',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/shop/index.html'
                    }
                }
            })
            //整体概况
            .state('index.shop.main', {
                url: '/main',
                views: {
                    'shop': {
                        controller: 'shopCtrl',
                        templateUrl: 'views/shop/main.html'
                    }
                }
            })
            //联系方式管理
            .state('index.shop.contact', {
                url: '/contact',
                views: {
                    'shop': {
                        controller:'contactCtrl',
                        templateUrl: 'views/shop/contact.html'
                    }
                }
            })
            //员工管理
            .state('index.shop.employee', {
                url: '/employee/:pageNo/:pageSize/:searchObj',
                views: {
                    'shop': {
                        controller:'employeeListCtrl',
                        templateUrl: 'views/shop/employee.html'
                    }
                }
            })
            //新增员工
            .state('index.shop.employee-add', {
                url: '/employee/add',
                views: {
                    'shop': {
                        controller:'operateEmployeeCtrl',
                        templateUrl: 'views/shop/operate-employee.html'
                    }
                }
            })
            //更新员工
            .state('index.shop.employee-update', {
                url: '/employee/update/:id',
                views: {
                    'shop': {
                        controller:'operateEmployeeCtrl',
                        templateUrl: 'views/shop/operate-employee.html'
                    }
                }
            })
            //积分管理
            .state('index.shop.integral', {
                url: '/integral/:pageNo/:pageSize/:searchObj',
                views: {
                    'shop': {
                        controller:'integralListCtrl',
                        templateUrl: 'views/shop/integral.html'
                    }
                }
            })
            //新增积分规则
            .state('index.shop.integral-add', {
                url: '/integral/add',
                views: {
                    'shop': {
                        controller:'operateIntegralCtrl',
                        templateUrl: 'views/shop/operate-integral.html'
                    }
                }
            })
            //更新积分规则
            .state('index.shop.integral-update', {
                url: '/integral/update/:id',
                views: {
                    'shop': {
                        controller:'operateIntegralCtrl',
                        templateUrl: 'views/shop/operate-integral.html'
                    }
                }
            })
            //商品管理
            .state('index.goods', {
                url: 'goods',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/goods/index.html'
                    }
                }
            })
            //在售商品列表
            .state('index.goods.sales-list', {
                url: '/sales-list/:pageNo/:pageSize/:type/:searchObj',
                views: {
                    'goods': {
                        controller: 'goodsListCtrl',
                        templateUrl: 'views/goods/list.html'
                    }
                }
            })
            //已下架商品列表
            .state('index.goods.unsales-list', {
                url: '/unsales-list/:pageNo/:pageSize/:type/:searchObj',
                views: {
                    'goods': {
                        controller: 'goodsListCtrl',
                        templateUrl: 'views/goods/list.html'
                    }
                }
            })
            //新增商品
            .state('index.goods.add', {
                url: '/add',
                views: {
                    'goods': {
                        controller: 'operateGoodsCtrl',
                        templateUrl: 'views/goods/operate.html'
                    }
                }
            })
            //新增商品test
            .state('index.goods.add-test', {
                url: '/add-test',
                views: {
                    'goods': {
                        controller: 'operateGoodsTestCtrl',
                        templateUrl: 'views/goods/operate-test.html'
                    }
                }
            })
            //更新商品
          .state('index.goods.update', {
            url: '/update/:id',
            views: {
              'goods': {
                controller: 'operateGoodsCtrl',
                templateUrl: 'views/goods/operate.html'
              }
            }
          })
            //商品评论列表
            .state('index.goods.comment', {
                url: '/comment/list/:goodsID/:pageNo/:pageSize/:searchObj',
                views: {
                    'goods': {
                        controller: 'operateGoodsCommentListCtrl',
                        templateUrl: 'views/goods/comment-list.html'
                    }
                }
            })
            //用户管理
            .state('index.user', {
                url: 'user',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/user/index.html'
                    }
                }
            })
            //用户列表
            .state('index.user.list', {
                url: '/list/:pageNo/:pageSize/:searchObj',
                views: {
                    'user': {
                        controller: 'userListCtrl',
                        templateUrl: 'views/user/list.html'
                    }
                }
            })
            //订单管理
            .state('index.order', {
                url: 'order',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/order/index.html'
                    }
                }
            })
            //未付款订单列表
            .state('index.order.unpay-list', {
                url: '/unpay-list/:pageNo/:pageSize/:type/:searchObj',
                views: {
                    'order': {
                        controller: 'orderListCtrl',
                        templateUrl: 'views/order/list.html'
                    }
                }
            })
            //未发货订单列表
            .state('index.order.untransport-list', {
                url: '/untransport-list/:pageNo/:pageSize/:type/:searchObj',
                views: {
                    'order': {
                        controller: 'orderListCtrl',
                        templateUrl: 'views/order/list.html'
                    }
                }
            })
            //待确认订单列表
            .state('index.order.unconfirm-list', {
                url: '/unconfirm-list/:pageNo/:pageSize/:type/:searchObj',
                views: {
                    'order': {
                        controller: 'orderListCtrl',
                        templateUrl: 'views/order/list.html'
                    }
                }
            })
            //已完成订单列表
            .state('index.order.finish-list', {
                url: '/finish-list/:pageNo/:pageSize/:type/:searchObj',
                views: {
                    'order': {
                        controller: 'orderListCtrl',
                        templateUrl: 'views/order/list.html'
                    }
                }
            })
            //商品属性列表
            .state('index.goods.attr-list', {
                url: '/attr-list',
                views: {
                    'goods': {
                        controller: 'attrListCtrl',
                        templateUrl: 'views/goods/attr-list.html'
                    }
                }
            })
            //活动管理
            .state('index.activity', {
                url: 'activity',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/activity/index.html'
                    }
                }
            })
            //活动列表
            .state('index.activity.list', {
                url: '/list/:pageNo/:pageSize/:searchObj',
                views: {
                    'activity': {
                        controller: 'activityListCtrl',
                        templateUrl: 'views/activity/list.html'
                    }
                }
            })
            //新增活动
            .state('index.activity.add', {
                url: '/add',
                views: {
                    'activity': {
                        controller: 'operateActivityCtrl',
                        templateUrl: 'views/activity/operate.html'
                    }
                }
            })
            //更新活动
            .state('index.activity.update', {
                url: '/update/:id',
                views: {
                    'activity': {
                        controller: 'operateActivityCtrl',
                        templateUrl: 'views/activity/operate.html'
                    }
                }
            })
            //资金管理
            .state('index.property', {
                url: 'property',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/property/index.html'
                    }
                }
            })
            //资金概况
            .state('index.property.income', {
                url: '/income',
                views: {
                    'property': {
                        controller:'incomeCtrl',
                        templateUrl: 'views/property/income.html'
                    }
                }
            })
            //交易记录
            .state('index.property.trade', {
                url: '/trade/:pageNo/:pageSize/:searchObj',
                views: {
                    'property': {
                        controller:'incomeCtrl',
                        templateUrl: 'views/property/trade-list.html'
                    }
                }
            })
            //对账单
            .state('index.property.bill', {
                url: '/bill/:pageNo/:pageSize/:searchObj',
                views: {
                    'property': {
                        controller:'billCtrl',
                        templateUrl: 'views/property/bill-list.html'
                    }
                }
            })
            //数据概况
            .state('index.data', {
                url: 'data',
                abstract: true,
                views: {
                    'layoutContent': {
                        templateUrl: 'views/data/index.html'
                    }
                }
            })
            //总概况
            .state('index.data.main', {
                url: '/main',
                views: {
                    'data': {
                        controller:'dataMainCtrl',
                        templateUrl: 'views/data/main.html'
                    }
                }
            })
            //流量概况
            .state('index.data.flux', {
                url: '/flux',
                views: {
                    'data': {
                        controller:'fluxCtrl',
                        templateUrl: 'views/data/flux.html'
                    }
                }
            })
            //来源分析
            .state('index.data.source', {
                url: '/source',
                views: {
                    'data': {
                        controller:'sourceCtrl',
                        templateUrl: 'views/data/source.html'
                    }
                }
            })
            //商品分析
            .state('index.data.goods', {
                url: '/goods',
                views: {
                    'data': {
                        controller:'goodsCtrl',
                        templateUrl: 'views/data/goods.html'
                    }
                }
            })
            //商品分析
            .state('index.data.trade', {
                url: '/trade',
                views: {
                    'data': {
                        controller:'tradeCtrl',
                        templateUrl: 'views/data/trade.html'
                    }
                }
            })
    }]);

