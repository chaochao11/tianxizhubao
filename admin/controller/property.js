/*
* 资金概况
*/
angular.module('app').controller('incomeCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', '$mdToast', 'propertyService',
    function ($scope, $state, $stateParams, $mdSidenav, $mdDialog, $mdToast, propertyService) {

        //获取最近三年月份
        $scope.getYearList();
        //获取最近三年
        $scope.incomeDataMonthList=$scope.getLastYearMonth();

        propertyService.getPropertyData().then(function (response) {
            $scope.icomeObj=response.data;
        });

        //按最近7日、最近30日获取店铺收入数据
        $scope.incomeDateTypeChange = function (type) {
            if (type === 2 || type === 3) {
                return false;
            } else {
                propertyService.getPropertyChartData(type).then(function (response) {
                    $scope.$broadcast('incomeData', response.data.chartData);
                });
            }
        };

        //根据月份获取店铺收入数据
        $scope.incomeDataMonthChange=function(month){
            if(month===0){
                return false;
            }else{
                propertyService.getPropertyChartData(2,month).then(function(response){
                    console.log(response);
                    $scope.$broadcast('incomeData', response.data.chartData);
                });
            }
        };

        //根据年份获取店铺收入数据
        $scope.incomeDataYearChange=function(year){
            if(year===0){
                return false;
            }else{
                propertyService.getPropertyChartData(3,year).then(function(response){
                    $scope.$broadcast('incomeData', response.data.chartData);
                });
            }
        }
    }]);

/*
* 交易记录
*/
angular.module('app').controller('tradeCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', '$mdToast', 'propertyService',
    function ($scope, $state, $stateParams, $mdSidenav, $mdDialog, $mdToast, propertyService) {
        
        //表头排序
        $scope.sortItem = 'id';//默认显示的排序表头
        $scope.desc = true;

        //获取列表
        var currentPageNo = 1;
        $scope.stateName = $state.current.name;
        $scope.pno = $stateParams.pageNo;
        $scope.ps = $stateParams.pageSize;
        $scope.getTradeList = function (currentPageNo, pageSize, searchObj) {
            propertyService.getTradeList(currentPageNo, $scope.ps, searchObj).then(function (response) {
                
                $scope.tradeList = response.data;
                $scope.cpn = parseInt(currentPageNo);
                $scope.totalNum = $scope.ps;

                //多选
                $scope.isEnableDelete = true;
                $scope.selected = [];
                $scope.toggleExisit($scope.selected, $scope.tradeList.list);

                //判断是否有选中
                $scope.isSelected = function () {
                    if ($scope.tradeList.list.length !== 0) {
                        return $scope.selected.length === $scope.tradeList.list.length;
                    }

                };

                // //选择全部
                $scope.toggleAll = function () {
                    if ($scope.selected.length === $scope.tradeList.list.length) {
                        $scope.selected = [];
                    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                        $scope.selected = $scope.tradeList.list.slice(0);
                    }
                };
                $scope.$broadcast('tradeList', response);
            }, function () {
                $scope.toast('获取列表失败', 'warning');
            })
        };

        //跳转分页
        $scope.jumpPage = function (currentPageNo) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                searchObj: $stateParams.searchObj
            })
        };

        // 获取自定义每页显示记录数
        $scope.pageChange = function (pageNum) {
            $scope.ps = pageNum;//将页面的值存入路由
            var newPageToTal = Math.ceil($scope.itemCount / $scope.ps);//页数
            if (newPageToTal <= $scope.pageTotal) {
                $scope.pageTotal = newPageToTal;
                if (newPageToTal <= $scope.pno) {
                    $scope.pno = newPageToTal;
                }
            }
            $state.go($scope.stateName, {
                pageNo: $scope.pno,
                pageSize: $scope.ps,
                searchObj: $stateParams.searchObj
            })
        };

        //搜索订单
        $scope.searchTrade = function (searchObj) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                searchObj: angular.toJson(searchObj)
            });
            $mdSidenav('searchSideNav').close();
        };

        //根据搜索条件是否为空加载数据
        $scope.loadList = function () {
            $stateParams.searchObj === '' ? $scope.getTradeList($scope.pno, $scope.ps) : $scope.getTradeList($scope.pno, $scope.ps, $stateParams.searchObj);
        };
        $scope.loadList();
    }]);


/*
* 对账单
*/
angular.module('app').controller('billCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', '$mdToast', 'propertyService',
    function ($scope, $state, $stateParams, $mdSidenav, $mdDialog, $mdToast, propertyService) {
        //表头排序
        $scope.sortItem = 'id';//默认显示的排序表头
        $scope.desc = true;

        //获取列表
        var currentPageNo = 1;
        $scope.stateName = $state.current.name;
        $scope.pno = $stateParams.pageNo;
        $scope.ps = $stateParams.pageSize;
        $scope.getBillList = function (currentPageNo, pageSize, searchObj) {
            propertyService.getBillList(currentPageNo, $scope.ps, searchObj).then(function (response) {
                $scope.billList = response.data;
                //给指令传递参数
                $scope.cpn = parseInt(currentPageNo);
                $scope.totalNum = $scope.ps;

                //多选
                $scope.isEnableDelete = true;
                $scope.selected = [];
                $scope.toggleExisit($scope.selected, $scope.billList.list);

                //判断是否有选中
                $scope.isSelected = function () {
                    if ($scope.billList.list.length !== 0) {
                        return $scope.selected.length === $scope.billList.list.length;
                    }

                };

                // //选择全部
                $scope.toggleAll = function () {
                    if ($scope.selected.length === $scope.billList.list.length) {
                        $scope.selected = [];
                    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                        $scope.selected = $scope.billList.list.slice(0);
                    }
                };
                $scope.$broadcast('billList', response);
            }, function () {
                $scope.toast('获取列表失败', 'warning');
            })
        };

        //跳转分页
        $scope.jumpPage = function (currentPageNo) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                searchObj: $stateParams.searchObj
            })
        };

        // 获取自定义每页显示记录数
        $scope.pageChange = function (pageNum) {
            $scope.ps = pageNum;//将页面的值存入路由
            var newPageToTal = Math.ceil($scope.itemCount / $scope.ps);//页数
            if (newPageToTal <= $scope.pageTotal) {
                $scope.pageTotal = newPageToTal;
                if (newPageToTal <= $scope.pno) {
                    $scope.pno = newPageToTal;
                }
            }
            $state.go($scope.stateName, {
                pageNo: $scope.pno,
                pageSize: $scope.ps,
                searchObj: $stateParams.searchObj
            })
        };

        //搜索订单
        $scope.searchBill = function (searchObj) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                searchObj: angular.toJson(searchObj)
            });
            $mdSidenav('searchSideNav').close();
        };

        //根据搜索条件是否为空加载数据
        $scope.loadList = function () {
            $stateParams.searchObj === '' ? $scope.getBillList($scope.pno, $scope.ps) : $scope.getBillList($scope.pno, $scope.ps, $stateParams.searchObj);
        };
        $scope.loadList();

        //对账单按时间分类
        $scope.typeChange = function (type) {

        }
    }]);