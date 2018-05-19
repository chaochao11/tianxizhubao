/*
* 数据概况
*/
angular.module('app').controller('dataMainCtrl', ['$scope', '$state', '$stateParams', '$mdDialog', '$mdToast', 'dataService', '$timeout',
    function ($scope, $state, $stateParams, $mdDialog, $mdToast, dataService, $timeout) {
        //获取实时概况    
        dataService.getDataMain().then(function (response) {
            $scope.liveData = response.data;
            $scope.$broadcast('liveIncome', response.data.chartData);
        });

        //获取商品实时浏览排行
        dataService.getGoodsLivePv().then(function (response) {
            $scope.liveGoodsPvList = response.data;
        });

        //获取销售概况
        dataService.getSalesData().then(function (response) {
            $scope.salesData = response.data;
            $scope.$broadcast('sevenDaysSalesData', response.data.chartData);
        });

        //获取10天店铺流量统计
        dataService.getTendDaysUv().then(function (response) {
            $scope.salesData = response.data;
            $scope.$broadcast('tenDaysUvData', response.data.chartData);
        });

        //7天店铺收入统计
        dataService.getSevenDaysIcome().then(function (response) {
            $scope.$broadcast('sevanDaysIcomeData', response.data.chartData);
        });

        //获取商品销售排行
        dataService.getGoodsSalesRank().then(function (response) {
            $scope.goodsSalesRankList = response.data;
        });
    }]);

/*
* 流量概况
*/
angular.module('app').controller('fluxCtrl', ['$scope','$rootScope', '$state', '$stateParams', '$mdDialog', '$mdToast', 'fluxService', '$timeout',
    function ($scope, $rootScope,$state, $stateParams, $mdDialog, $mdToast, fluxService, $timeout) {

        $scope.currentDate = new Date();//获取当前时间
        $scope.tabID = 1;//Tab默认显示
        $scope.fluxChartID = 1;


        var getUvChartData = function (type, fluxChartID,date) {
            fluxService.getUvByTime(type,date).then(function (response) {
                $scope.uvData = response.shop.data;
                $scope.uvGoods=response.goods.data;
                $scope.conversionData=response.change.data;
                console.log(response.goods.data.chartData);
                switch (fluxChartID) {
                    case 1:
                        $scope.data=[response.shop.data.chartData[0],response.shop.data.chartData[5]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 2:
                        $scope.data=[response.shop.data.chartData[1],response.shop.data.chartData[6]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 3:
                        $scope.data=[response.shop.data.chartData[2],response.shop.data.chartData[7]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 4:
                        $scope.data=[response.shop.data.chartData[3],response.shop.data.chartData[8]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 5:
                        $scope.data=[response.shop.data.chartData[4],response.shop.data.chartData[9]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 6:
                        $scope.data=[response.goods.data.chartData[2],response.goods.data.chartData[5]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 7:
                        $scope.data=[response.goods.data.chartData[1],response.goods.data.chartData[3]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 8:
                        $scope.data=[response.goods.data.chartData[4],response.goods.data.chartData[5]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 9:
                        $scope.data=[response.change.data.chartData[0],response.change.data.chartData[6]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 10:
                        $scope.data=[response.change.data.chartData[1],response.change.data.chartData[7]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 11:
                        $scope.data=[response.change.data.chartData[3],response.change.data.chartData[9]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 12:
                        $scope.data=[response.change.data.chartData[4],response.change.data.chartData[10]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 13:
                        $scope.data=[response.change.data.chartData[5],response.change.data.chartData[11]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                    case 14:
                        $scope.data=[response.change.data.chartData[2],response.change.data.chartData[8]];
                        $scope.$broadcast('uvChartData',$scope.data);
                        break;
                }
            });
        };

        //Tab切换显示
        $scope.switchFluxTab = function (type,value) {
            $scope.tabID = value;
            if ($scope.tabID === 1) {
                $scope.fluxChartID = 1;
                if(type===3){
                    getUvChartData(type, $scope.fluxChartID,$rootScope.d);
                }else{
                    getUvChartData(type, $scope.fluxChartID);
                }
            }
            else if ($scope.tabID === 2) {
                $scope.fluxChartID = 6;
                if(type===3){
                    getUvChartData(type, $scope.fluxChartID,$rootScope.d);
                }else{
                    getUvChartData(type, $scope.fluxChartID);
                }
            } else if ($scope.tabID === 3) {
                $scope.fluxChartID = 9;
                if(type===3){
                    getUvChartData(type, $scope.fluxChartID,$rootScope.d);
                }else{
                    getUvChartData(type, $scope.fluxChartID);
                }
            }
        };

        //流量类型Tab切换显示
        $scope.switchFluxDataChart = function (value, type) {
            $scope.fluxChartID = value;
           if(type===3){
               getUvChartData(type, value,$rootScope.d);
           }else{
               getUvChartData(type, value);
           }
        };

        //获取访问店铺数据按当日、最近一日、最近7日查询
        $scope.fluxeDataChange = function (type) {
            switch(type){
                case 0:
                    $scope.txt='较前日同时段';
                    break;
                case 1:
                    $scope.txt='较前1日';
                    break;
                case 2:
                    $scope.txt='较前7日';
                    break;
                case 3:
                    $scope.txt='较前1日';
                    break;
                case 4:
                    $scope.txt='较前30日';
                    break;
            }
            if(type===3){
                return false;
            }else{
                getUvChartData(type, $scope.fluxChartID);
            }
        };

        $scope.fluxDataTimeChange=function (date) {
            $rootScope.d=date;
            getUvChartData(3,$scope.fluxChartID, date);
        };
    }]);


/*
* 来源分析
*/
angular.module('app').controller('sourceCtrl', ['$scope', '$state', '$stateParams', '$mdDialog', '$mdToast', 'sourceService', '$timeout',
    function ($scope, $state, $stateParams, $mdDialog, $mdToast, sourceService, $timeout) {
        $scope.currentDate = new Date();//获取当前时间

        //获取访客按最近1日、最近7日、最近30日查询
        $scope.uvDataChange = function (type) {
            if (type === 3) {
                return false;
            } else {
                sourceService.getUvByTime(type).then(function (response) {
                    $scope.$broadcast('uvByTimeData', response.data.chartData);
                })
            }
        };
        //获取访客按日期查询
        $scope.uvDataTimeChange = function (date) {
            $scope.dateObj = {};
            $scope.dateObj.day = angular.toJson(date);
            sourceService.getUvByTime(3, $scope.dateObj).then(function (response) {
                $scope.$broadcast('uvByTimeData', response.data.chartData);
            })
        };

        //获取地域分布按最近1日、最近7日、最近30日查询
        $scope.areaDataChange = function (type) {
            if (type === 3) {
                return false;
            } else {
                sourceService.getAreaData(type).then(function (response) {
                    $scope.uvRankList = response.data.visitRank;
                    $scope.orderRankList = response.data.createOrderRank;
                    $scope.$broadcast('areaUvData', response.data.visitMap);
                    $scope.$broadcast('orderAreaUvData', response.data.createOrderMap);
                })
            }
        };

        //获取地域分布按日期查询
        $scope.areaDataTimeChange = function (date) {
            $scope.dateObj = {};
            $scope.dateObj.day = angular.toJson(date);
            sourceService.getAreaData(3, $scope.dateObj).then(function (response) {
                $scope.uvRankList = response.data.visitRank;
                $scope.orderRankList = response.data.createOrderRank;
                $scope.$broadcast('areaUvData', response.data.visitMap);
                $scope.$broadcast('orderAreaUvData', response.data.createOrderMap);
            })
        };

        //获取终端分布按最近1日、最近7日、最近30日查询
        $scope.deviceDataChange = function (type) {
            if (type === 3) {
                return false;
            } else {
                sourceService.getDeviceData(type).then(function (response) {
                    $scope.visitSexyDataList = response.data.visitSex;
                    $scope.visitOldNewDataList = response.data.VisitNewAndOld;
                    $scope.$broadcast('deviceData', response.data.visitTool);
                    $scope.$broadcast('deviceOldNewData', response.data.visitType);
                })
            }
        };

        //获取终端分布按日期查询
        $scope.deivceDataTimeChange = function (date) {
            $scope.dateObj = {};
            $scope.dateObj.day = angular.toJson(date);
            sourceService.getDeviceData(3, $scope.dateObj).then(function (response) {
                $scope.visitSexyDataList = response.data.visitSex;
                $scope.visitOldNewDataList = response.data.VisitNewAndOld;
                $scope.$broadcast('deviceData', response.data.visitTool);
                $scope.$broadcast('deviceOldNewData', response.data.visitType);
            })
        }

    }]);

/*
* 商品分析
*/
angular.module('app').controller('goodsCtrl', ['$scope', '$state', '$stateParams', '$mdDialog', '$mdToast', 'dataService', '$timeout',
    function ($scope, $state, $stateParams, $mdDialog, $mdToast, dataService, $timeout) {
        $scope.currentDate = new Date();//获取当前时间

        //获取按最近1日、最近7日、最近30日商品数据概况
        $scope.goodsTypeChange=function (type) {
            switch(type){
                case 0:
                    $scope.txt='较前日';
                    break;
                case 1:
                    $scope.txt='较前7日';
                    break;
                case 2:
                    $scope.txt='较前30日';
                    break;
                case 3:
                    $scope.txt='较前1日';
                    break;
            }
            if(type===3){
                return false;
            }else{
                dataService.getGoodsData(type).then(function (response) {
                    $scope.goodsDataObj=response.data;
                })
            }
        };

        //获取根据日期返回商品数据概况
        $scope.goodsDateChange=function (date) {
            $scope.dateObj = {};
            $scope.dateObj.day = angular.toJson(date);
            dataService.getGoodsData(3,$scope.dateObj).then(function (response) {
                console.log(response);
                $scope.goodsDataObj=response.data;
            })
        };

        //获取按最近1日、最近7日、最近30日商品销售数量
        $scope.goodsSalesDateTypeChange=function (type) {
            if(type===2){
                return false;
            }else{
                dataService.getGoodsSalesData(type).then(function (response) {
                    $scope.$broadcast('goodsSalesData',response.data.chartData);
                })
            }
        };

        //获取最近三年月份
        $scope.getYearList();

        //根据年份获取商品销售量
        $scope.goodsDataMonthChange=function (year) {
            if(year===0){
                return false;
            }else{
                $scope.dateObj={};
                $scope.dateObj.year=angular.toJson(year);
                dataService.getGoodsSalesData(2,$scope.dateObj).then(function (response) {
                    $scope.$broadcast('goodsSalesData',response.data.chartData);
                })
            }
        };

        //根据最近7日、最近30日获取商品支付金额排行榜
        $scope.goodsPayRankChange=function (type) {
            if(type===2){
                return false;
            }else{
                dataService.getGoodsSalesTopRank(type).then(function (response) {
                    $scope.goodsSalesRankList=response.data.list;
                })
            }
        };

        //生成最近一年和前一年的月份
        $scope.rankMonthList=$scope.getLastYearMonth();

        //根据月份来查询商品支付排行榜
        $scope.goodsRankMonthChange=function (month) {
            $scope.dateObj={};
            $scope.dateObj.month=angular.toJson(month);
            if(month===0){
                return false;
            }else{
                dataService.getGoodsSalesTopRank(2,$scope.dateObj).then(function (response) {
                    $scope.goodsSalesRankList=response.data.list;
                })
            }
        }
    }]);

/*
* 交易分析
*/
angular.module('app').controller('tradeCtrl', ['$scope', '$state', '$stateParams', '$mdDialog', '$mdToast', 'tradeService', '$timeout',
    function ($scope, $state, $stateParams, $mdDialog, $mdToast, tradeService, $timeout) {

        $scope.currentDate = new Date();//获取当前时间
        $scope.getYearList();//获取最近三年月份
        $scope.dateObj={};//日期查询对象

        //根据最近1日、最近7日、最近30日获取交易概况数据
        $scope.tradeDataSelectChange=function (type) {
            if(type===3){
                return false;
            }else{
                tradeService.getTradeData(type).then(function (response) {
                    $scope.tradeObj=response.data;
                })
            }
        };

        //根据具体日期获取交易概况数据
        $scope.tradeDateChange=function (date) {
            $scope.dateObj={};
            $scope.dateObj.day=angular.toJson(date);
            tradeService.getTradeData(3,$scope.dateObj).then(function (response) {
                console.log(response);
                $scope.tradeObj=response.data;
            })
        };

        //生成最近一年和前一年的月份
        $scope.tradeOrderMonthList=$scope.getLastYearMonth();

        //根据最近7日、最近30日获取交易数据
        $scope.tradeOrderChange=function (type) {
            if(type===2||type===3){
                return false;
            }else{
                tradeService.getTradeChartData(type).then(function (response) {
                    console.log(response);
                    $scope.$broadcast('tradeData',response.data.chartData);
                })
            }
        };


        //根据月份获取交易数据
        $scope.tradeOrderMonthChange=function (month) {
            if(month===0){
                return false;
            }else{
                $scope.dateObj.month=angular.toJson(month);
                tradeService.getTradeChartData(2,$scope.dateObj).then(function (response) {
                    console.log(response);
                    $scope.$broadcast('tradeData',response.data.chartData);
                })
            }
        };

        //根据年份获取交易数据
        $scope.tradeOrderYearChange=function (year) {
            if(year===0){
                return false;
            }else{
                $scope.dateObj.year=angular.toJson(year);
                tradeService.getTradeChartData(3,$scope.dateObj).then(function (response) {
                    console.log(response);
                    $scope.$broadcast('tradeData',response.data.chartData);
                })
            }
        }
    }]);
