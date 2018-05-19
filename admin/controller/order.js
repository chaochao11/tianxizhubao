angular.module('app').controller('orderListCtrl', ['$scope', '$state', '$stateParams','$mdSidenav', '$mdDialog', '$mdToast', 'orderService','transportService',
    function ($scope, $state, $stateParams,$mdSidenav, $mdDialog, $mdToast, orderService,transportService) {

        //表头排序
        $scope.sortItem = 'oid';//默认显示的排序表头
        $scope.desc = true;
        //获取列表
        var currentPageNo = 1;
        $scope.type=$stateParams.type;
        $scope.stateName=$state.current.name;
        $scope.pno = $stateParams.pageNo;
        $scope.ps = $stateParams.pageSize;
        $scope.getOrderList = function (currentPageNo, pageSize, type,searchObj) {
            orderService.getOrderList(currentPageNo, $scope.ps,$scope.type, searchObj).then(function (dataObj) {
                $scope.orderList = dataObj.data;

                //给指令传递参数
                $scope.cpn = parseInt(currentPageNo);
                $scope.totalNum = $scope.ps;

                //多选
                $scope.isEnableDelete = true;
                $scope.selected = [];
                $scope.toggleExisit($scope.selected,$scope.orderList.list);

                $scope.isSelected = function () {
                    if ($scope.orderList.list.length !== 0) {
                        return $scope.selected.length === $scope.orderList.list.length;
                    }
                };

                //选择全部
                $scope.toggleAll = function () {
                    if ($scope.selected.length === $scope.orderList.list.length) {
                        $scope.selected = [];
                    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                        $scope.selected = $scope.orderList.list.slice(0);
                    }
                };
                $scope.$broadcast('orderList', dataObj);
            }, function () {
                $scope.toast('获取订单列表失败','error')
            })
        };

        //跳转分页
        $scope.jumpPage = function (currentPageNo) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                type:$scope.type,
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
                type:$scope.type,
                searchObj: $stateParams.searchObj
            })
        };

        //搜索订单
        $scope.searchOrder = function (searchObj) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                type:$scope.type,
                searchObj: angular.toJson(searchObj)
            });
            $mdSidenav('searchSideNav').close();
        };

        //根据搜索条件是否为空加载数据
        $scope.loadList = function () {
            if ($stateParams.searchObj === '') {
                $scope.getOrderList($scope.pno, $scope.ps,$scope.type);
            } else {
                $scope.getOrderList($scope.pno, $scope.ps,$scope.type, $stateParams.searchObj);
            }
        };
        $scope.loadList();

        //取消订单
        $scope.closeOrder = function (id, ev) {
            $scope.showConfirm(ev,'确认关闭此订单？','该操作不可恢复',function () {
                orderService.changeOrderState(id, 5).then(function () {
                    $scope.toast('订单关闭成功','success');
                    $scope.loadList();
                    if ($scope.orderList.list.length === 1) {
                        if ($scope.pno > 1) {
                            $state.go($scope.stateName, {
                                pageNo: $scope.pno - 1,
                                pageSize: $scope.ps,
                                type:$scope.type,
                                searchObj: $stateParams.searchObj
                            })
                        } else {
                            angular.forEach($scope.orderList.list,function (item,index) {
                                if(id===item.oid){
                                    $scope.orderList.list.splice(index,1);
                                }
                            })
                        }
                    } else {
                        angular.forEach($scope.orderList.list,function (item,index) {
                            if(id===item.oid){
                                $scope.orderList.list.splice(index,1);
                            }
                        })
                    }
                }, function () {
                    $scope.toast('订单关闭失败','error');
                })
            });
        };

        //查看详情
        $scope.checkOrderDetails = function (ev, id) {
            $scope.orderID = id;
            $mdDialog.show({
                controller: orderDetailsCtrl,
                templateUrl: 'views/order/details.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    id: $scope.orderID
                }
            }).then(function () {
                $scope.getOrderList($scope.cpn, $scope.pageSize, $scope.searchObj);
                if ($scope.orderList.list.length === 1) {
                    if ($scope.pno > 1) {
                        $state.go($scope.stateName, {
                            pageNo: $scope.pno - 1,
                            pageSize: $scope.ps,
                            type:$scope.type,
                            searchObj: $stateParams.searchObj
                        })
                    } else {
                        angular.forEach($scope.orderList.list,function (item,index) {
                            if(id===item.oid){
                                $scope.orderList.list.splice(index,1);
                            }
                        })
                    }
                } else {
                    angular.forEach($scope.orderList.list,function (item,index) {
                        if(id===item.oid){
                            $scope.orderList.list.splice(index,1);
                        }
                    })
                }
            })
        };

        function orderDetailsCtrl($scope, id, $mdDialog) {

            //获取订单详情
            orderService.getOrderDetails(id).then(function (dataObj) {
                $scope.orderObj = dataObj.data;
            }, function () {
                $scope.toast('获取订单详情失败','error');
            });

            //获取物流公司信息
            transportService.getTransportCompanyList(1,0,'').then(function (response) {
               $scope.transportCompanyList=response.data;
            });

            //发货操作
            $scope.saveTransport=function (ev,transportCompany,transportNum) {
                var obj = ev.currentTarget;
                obj.disabled = true;
                obj.innerHTML = '正在保存...';
                orderService.transportOrder(id,transportCompany,transportNum).then(function () {
                    //$scope.toast('发货成功','success');
                    $scope.coloseDialog();
                })

            };

            //取消对话框
            $scope.cancelDialog = function () {
                $mdDialog.cancel();
            };
            //关闭对话框
            $scope.coloseDialog = function () {
                $mdDialog.hide();
            };
        }

        orderDetailsCtrl.$inject = ['$scope', 'id', '$mdDialog'];
    }]);