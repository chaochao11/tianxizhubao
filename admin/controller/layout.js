angular.module('app').controller('layoutCtrl', ['$scope', '$state', '$rootScope', '$mdSidenav', '$cookies', '$cookieStore', '$interval', '$mdToast', '$mdDialog',
    function ($scope, $state, $rootScope, $mdSidenav, $cookies, $cookieStore, $interval, $mdToast, $mdDialog) {
        this.openMenu = function ($mdOpenMenu) {
            $mdOpenMenu();
        };

        //接口路径
        $rootScope.baseURL = 'http://tianxi.loforce.cn/';

        $scope.loginAdminName = $cookies.getObject('admin');

        $scope.tempSubNav = [];//临时子菜单数组

        //生成指定年份
        $scope.getYearList = function () {
            $scope.year = new Date();
            $scope.currentYear = $scope.year.getFullYear();
            $scope.yearList = [$scope.currentYear, $scope.currentYear - 1, $scope.currentYear-2];
        };

        //获得最近一年的12个月
        $scope.getLastYearMonth = function() {
            var d = new Date();
            var result = [];
            for(var i = 0; i < 12; i++) {
                d.setMonth(d.getMonth() - 1);
                var m = d.getMonth()+2;
                m = m < 10 ? "0" + m : m;
                //在这里可以自定义输出的日期格式
                result.push(d.getFullYear() + "-" + m);
            }
            return result;
        };

        //定义Toast
        $scope.toast = function (content, typeClass) {
            switch (typeClass) {
                case 'success':
                    typeClass = 'toast-success';
                    break;
                case 'error':
                    typeClass = 'toast-error';
                    break;
                case 'warning':
                    typeClass = 'toast-warning';
                    break;
            }
            $mdToast.show(
                $mdToast.simple()
                    .textContent(content)
                    .position('top right')
                    .hideDelay(2000)
                    .toastClass(typeClass)
            );
        };

        //定义confirm
        $scope.showConfirm = function (ev, title, content, fun) {
            var confirm = $mdDialog.confirm()
                .title(title)
                .textContent(content)
                .targetEvent(ev)
                .ok('确定')
                .cancel('取消');

            $mdDialog.show(confirm).then(function () {
                fun();
            });
        };

        //定义全选
        $scope.toggleExisit = function (tempArray, array) {
            $scope.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };

            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };
        };

        //删除数组中指定ID
        $scope.spliceID = function (array, id) {
            angular.forEach(array, function (item, idx) {
                if (id === item.jid) {
                    array.splice(idx, 1);
                }
            })
        };

        //跳转到指定页面
        $scope.redirectPage=function (page) {
            $state.go(page);
        };


        $interval(function() {
            if($cookies.get('admin') === undefined) {
                $state.go('login')
            }
        }, 100);

        // var websocket;
        // if ('WebSocket' in window) {
        //     //console.log(path);
        //     websocket = new WebSocket("ws://tianxi.loforce.cn/ws");
        // }
        // websocket.onopen = function(event) {
        //     console.log("WebSocket:已连接");
        //     console.log(event);
        // };
        // websocket.onmessage = function(event) {
        //     var data=JSON.parse(event.data);
        //     console.log("WebSocket:收到一条消息",data);
        //     console.log(data);
        // };
        // websocket.onerror = function(event) {
        //     console.log("WebSocket:发生错误 ");
        //     console.log(event);
        // };
        // websocket.onclose = function(event) {
        //     console.log("WebSocket:已关闭");
        //     console.log(event);
        // };


        //跳转到账户设置页
        $scope.goAccountList = function () {
            $state.go('index.account.account-list', {pageNo: 1, pageSize: 10});
        };

        //退出后台
        $scope.logout = function () {
            $cookies.remove('admin');
            $state.go('login');
        };

        //侧边栏展现与隐藏
        $scope.isSideNavOpen = true;
        $scope.sideNavVisible = false;
        $scope.sideNavTooltip = "关闭左侧菜单";

        $scope.toggleSideNav = function () {
            $scope.sideNavVisible = !$scope.sideNavVisible;
            !$scope.sideNavVisible ? $scope.sideNavTooltip = "关闭左侧菜单" : $scope.sideNavTooltip = "打开左侧菜单";
        };

        //搜索侧边栏展现与隐藏
        $rootScope.isSearchSideNavOpen = false;
        $rootScope.toggleSearchSideNav = function () {
            $mdSidenav('searchSideNav').toggle();
        };


        //左侧导航菜单定义
        $scope.navList = [
            {
                navName: '店铺',
                defaultUrl: 'index.shop.main',
                navIcon: 'icon-shop',
                currentState: 'shop',
                subNav:
                    {
                        parentState: 'shop',
                        parentTitle: '店铺管理',
                        navList: [
                            {
                                navName: '店铺概况',
                                subNavUrl: 'index.shop.main',
                                subState: 'index.shop.main'
                            },
                            {
                                navName: '联系我们',
                                subNavUrl: 'index.shop.contact',
                                subState: 'index.shop.contact',
                                otherState: 'goods.sales-list'
                            },
                            {
                                navName: '员工管理',
                                subNavUrl: 'index.shop.employee({pageNo:1,pageSize:10})',
                                subState: 'index.shop.employee'
                            },
                            {
                                navName: '积分管理',
                                subNavUrl: 'index.shop.integral({pageNo:1,pageSize:10})',
                                subState: 'index.shop.integral'
                            }
                        ]
                    }

            },
            {
                navName: '商品',
                defaultUrl: 'index.goods.sales-list({pageNo:1,pageSize:10,type:1})',
                navIcon: 'icon-goods',
                currentState: 'goods',
                subNav:
                    {
                        parentState: 'goods',
                        parentTitle: '商品管理',
                        navList: [
                            {
                                navName: '新增商品',
                                subNavUrl: 'index.goods.add',
                                subState: 'index.goods.add'
                            },
                            {
                                navName: '在售商品',
                                subNavUrl: 'index.goods.sales-list({pageNo:1,pageSize:10,type:1})',
                                subState: 'index.goods.sales-list',
                                otherState: 'goods.sales-list'
                            },
                            {
                                navName: '已下架商品',
                                subNavUrl: 'index.goods.unsales-list({pageNo:1,pageSize:10,type:0})',
                                subState: 'index.goods.unsales-list'
                                //otherState:'goods'
                            },
                            {
                                navName: '属性列表',
                                subNavUrl: 'index.goods.attr-list',
                                subState: 'index.goods.attr-list'
                            }
                        ]
                    }

            },
            {
                navName: '订单',
                defaultUrl: 'index.order.unpay-list({pageNo:1,pageSize:10,type:0})',
                navIcon: 'icon-order',
                currentState: 'order',
                subNav:
                    {
                        parentState: 'order',
                        parentTitle: '订单管理',
                        navList: [
                            {
                                navName: '未付款',
                                subNavUrl: 'index.order.unpay-list({pageNo:1,pageSize:10,type:0})',
                                subState: 'index.order.unpay-list'
                            },
                            {
                                navName: '待发货',
                                subNavUrl: 'index.order.untransport-list({pageNo:1,pageSize:10,type:1})',
                                subState: 'index.order.untransport-list'
                            },
                            {
                                navName: '待收货',
                                subNavUrl: 'index.order.unconfirm-list({pageNo:1,pageSize:10,type:2})',
                                subState: 'index.order.unconfirm-list'
                            },
                            {
                                navName: '已完成',
                                subNavUrl: 'index.order.finish-list({pageNo:1,pageSize:10,type:7})',
                                subState: 'index.order.finish-list'
                            },
                            {
                                navName: '退款管理',
                                subNavUrl: 'index.refund.list({pageNo:1,pageSize:10})',
                                subState: 'index.refund.list'
                            }
                        ]
                    }

            },
            {
                navName: '用户',
                defaultUrl: 'index.user.list({pageNo:1,pageSize:10})',
                navIcon: 'icon-member',
                currentState: 'user',
                subNav: {
                    parentState: 'user',
                    parentTitle: '用户管理',
                    navList: [
                        {
                            navName: '用户列表',
                            subNavUrl: 'index.user.list({pageNo:1,pageSize:10})',
                            subState: 'index.user.list'
                        }
                    ]
                }
            },
            {
                navName: '活动',
                defaultUrl: 'index.activity.list({pageNo:1,pageSize:10})',
                navIcon: 'icon-activity',
                currentState: 'activity',
                subNav: {
                    parentState: 'activity',
                    parentTitle: '活动管理',
                    navList: [
                        {
                            navName: '新增活动',
                            subNavUrl: 'index.activity.add',
                            subState: 'index.activity.add'
                        },
                        {
                            navName: '活动列表',
                            subNavUrl: 'index.activity.list({pageNo:1,pageSize:10})',
                            subState: 'index.activity.list',
                            otherState: 'update'

                        }
                    ]
                }
            },
            {
                navName: '数据',
                defaultUrl: 'index.data.main',
                navIcon: 'icon-data-center',
                currentState: 'data',
                subNav: {
                    parentState: 'data',
                    parentTitle: '数据管理',
                    navList: [
                        {
                            navName: '数据概况',
                            subNavUrl: 'index.data.main',
                            subState: 'index.data.main'
                        },
                        {
                            navName: '页面流量',
                            subNavUrl: 'index.data.flux',
                            subState: 'index.data.flux'
                        },
                        {
                            navName: '来源分析',
                            subNavUrl: 'index.data.source',
                            subState: 'index.data.source'
                        },
                        {
                            navName: '商品分析',
                            subNavUrl: 'index.data.goods',
                            subState: 'index.data.goods'
                        },
                        {
                            navName: '交易分析',
                            subNavUrl: 'index.data.trade',
                            subState: 'index.data.trade'
                        }
                    ]
                }
            },
            {
                navName: '资金',
                defaultUrl: 'index.property.income',
                navIcon: 'icon-property',
                currentState: 'property',
                subNav: {
                    parentState: 'property',
                    parentTitle: '资金管理',
                    navList: [
                        {
                            navName: '资产概况',
                            subNavUrl: 'index.property.income',
                            subState: 'index.property.income'
                        },
                        {
                            navName: '交易记录',
                            subNavUrl: 'index.property.trade({pageNo:1,pageSize:10})',
                            subState: 'index.property.trade'
                        },
                        {
                            navName: '对账单',
                            subNavUrl: 'index.property.bill({pageNo:1,pageSize:10})',
                            subState: 'index.property.bill'
                        }
                    ]
                }
            }
        ];

        //取出当前父菜单下的子菜单组成新数组
        for (var i = 0; i < $scope.navList.length; i++) {
            $scope.tempSubNav.push($scope.navList[i].subNav);
            console.log($scope.tempSubNav);
        }
    }]);
