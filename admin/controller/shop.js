/*
* 获取店铺概况
*/
angular.module('app').controller('shopCtrl', ['$scope', '$state', '$stateParams', '$mdToast', '$timeout', 'shopService',
    function ($scope, $state, $stateParams, $mdToast, $timeout, shopService) {

        shopService.getBasicDataInfo().then(function (response) {
            $scope.dataBasicObj = response.data;
            //把数据传递给directive中的highcharts
            $scope.$broadcast('fluxData', response.data.chartData);
        });
    }]);


/*
* 联系方式
*/
angular.module('app').controller('contactCtrl', ['$scope', '$state', '$stateParams', '$mdToast', '$timeout', 'shopService',
    function ($scope, $state, $stateParams, $mdToast, $timeout, shopService) {
        shopService.getContact().then(function (response) {
            $scope.contactObj = response.data;
        });

        shopService.getAfterSalesContact().then(function (response) {
            $scope.afterSalesObj = response.data;
        });

        $scope.saveContact = function (ev, contactObj) {
            var obj = ev.currentTarget;
            obj.disabled = true;
            obj.innerHTML = '正在保存...';


            shopService.updateContact(contactObj).then(function (response) {
                console.log(response);
                $scope.toast('联系方式修改成功', 'success');
                obj.disabled = false;
                obj.innerHTML = '立即保存';
            }, function () {
                $scope.toast('联系方式修改失败', 'error');
                obj.disabled = false;
                obj.innerHTML = '立即保存';
            })
        };

        $scope.saveAfterSales = function (ev, afterSalesObj) {
            var obj = ev.currentTarget;
            obj.disabled = true;
            obj.innerHTML = '正在保存...';

            shopService.updateAfterSales(afterSalesObj).then(function (response) {
                console.log(response);
                $scope.toast('售后联系方式修改成功', 'success');
                obj.disabled = false;
                obj.innerHTML = '立即保存';
            }, function () {
                $scope.toast('售后联系方式修改失败', 'error');
                obj.disabled = false;
                obj.innerHTML = '立即保存';
            })
        }
    }]);

/*
* 员工列表
*/
angular.module('app').controller('employeeListCtrl', ['$scope', '$state', '$stateParams', '$mdToast', '$timeout', 'shopService', function ($scope, $state, $stateParams, $mdToast, $timeout, shopService) {

    //表头排序
    $scope.sortItem = 'id';//默认显示的排序表头
    $scope.desc = true;

    //获取列表
    var currentPageNo = 1;
    $scope.stateName = $state.current.name;
    $scope.pno = $stateParams.pageNo;
    $scope.ps = $stateParams.pageSize;
    $scope.getEmployeeList = function (currentPageNo, pageSize, searchObj) {
        shopService.getEmployeeList(currentPageNo, $scope.ps, searchObj).then(function (response) {
            $scope.employeeList = response;

            //给指令传递参数
            $scope.cpn = parseInt(currentPageNo);
            $scope.totalNum = $scope.ps;

            //多选
            $scope.isEnableDelete = true;
            $scope.selected = [];
            $scope.toggleExisit($scope.selected, $scope.employeeList.list);

            //判断是否有选中
            $scope.isSelected = function () {
                if ($scope.employeeList.list.length !== 0) {
                    return $scope.selected.length === $scope.employeeList.list.length;
                }
            };

            //选择全部
            $scope.toggleAll = function () {
                if ($scope.selected.length === $scope.employeeList.list.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = $scope.employeeList.list.slice(0);
                }
            };
            $scope.$broadcast('employeeList', response);
        }, function () {
            $scope.toast('获取列表失败', 'error');
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
    $scope.searchEmployee = function (searchObj) {
        $state.go($scope.stateName, {
            pageNo: currentPageNo,
            pageSize: $scope.ps,
            searchObj: angular.toJson(searchObj)
        });
        $mdSidenav('searchSideNav').close();
    };

    //根据搜索条件是否为空加载数据
    $scope.loadList = function () {
        $stateParams.searchObj === '' ? $scope.getEmployeeList($scope.pno, $scope.ps) : $scope.getEmployeeList($scope.pno, $scope.ps, $stateParams.searchObj);
    };
    $scope.loadList();

    //从列表中移除员工
    function spliceEmployeeListFromList(id) {
        $scope.getEmployeeList($scope.pno, $scope.ps, $state.searchObj);
        if ($scope.employeeList.list.length === 1) {
            if ($scope.pno > 1) {
                $state.go($scope.stateName, {
                    pageNo: $scope.pno - 1,
                    pageSize: $scope.ps,
                    searchObj: $stateParams.searchObj
                })
            } else {
                $scope.spliceID($scope.employeeList.list, id);
            }
        } else {
            $scope.spliceID($scope.employeeList.list, id);
        }
    }

    //删除员工
    $scope.deleteEmployee = function (ev, id) {
        $scope.showConfirm(ev, '是否确认删除此员工？', '', function () {
            shopService.deleteEmployee(id).then(function () {
                $scope.toast('员工删除成功', 'success');
                spliceEmployeeListFromList(id);
            }, function () {
                $scope.toast('员工删除失败', 'error');
            })
        })
    };

    //跳转到添加页
    $scope.redirectAdd = function () {
        $state.go('index.shop.employee-add');
    };
}]);

/*
* 新增或更新员工
*/
angular.module('app').controller('operateEmployeeCtrl', ['$scope', '$state', '$stateParams', '$mdToast', '$timeout', 'shopService',
    function ($scope, $state, $stateParams, $mdToast, $timeout, shopService) {

        if ($stateParams.id > 0) {
            $scope.status = 'edit';
            shopService.getEmployeeDetails($stateParams.id).then(function (response) {
                $scope.employeeObj = response.data;
                $scope.employeeObj.password = '';
                $scope.passwordTips = '若无需修改密码留空即可';

                $scope.saveEmployee = function (employeeObj, ev) {
                    var obj = ev.currentTarget;
                    obj.disabled = true;
                    obj.innerHTML = '正在更新...';
                    var md5 = require('md5');
                    if ($scope.employeeObj.password === '') {
                        $scope.employeeObj.password = response.data.password;
                    } else {
                        $scope.employeeObj.password = md5($scope.employeeObj.password);
                    }
                    console.log(employeeObj);
                    shopService.updateEmployee(employeeObj).then(function () {
                        $scope.toast('员工更新成功', 'success');
                        $timeout(function () {
                            $state.go('index.shop.employee', {pageNo: 1, pageSize: 10});
                        }, 1000)

                    }, function () {
                        $scope.toast('员工更新失败', 'error')
                    })
                };
            })
        } else {
            $scope.passwordTips = '请输入1-16个字符的密码';
            $scope.saveEmployee = function (employeeObj, ev) {
                var obj = ev.currentTarget;
                obj.disabled = true;
                obj.innerHTML = '正在保存...';
                var md5 = require('md5');
                employeeObj.password = md5(employeeObj.password);
                shopService.createEmployee(employeeObj).then(function (response) {
                    if (response.statusCode === 200) {
                        $scope.toast('员工新增成功', 'success');
                        $timeout(function () {
                            $state.go('index.shop.employee', {pageNo: 1, pageSize: 10});
                        }, 1000);
                    } else if (response.statusCode === 500) {
                        $scope.toast('员工名重名，请重试', 'error');
                        obj.disabled = false;
                        obj.innerHTML = '立即保存';
                    }
                }, function () {
                    $scope.toast('新增员工失败', 'error')
                })
            }
        }
    }]);


/*
* 积分规则列表
*/
angular.module('app').controller('integralListCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdToast', '$timeout', 'shopService',
    function ($scope, $state, $stateParams, $mdSidenav, $mdToast, $timeout, shopService) {

        //表头排序
        $scope.sortItem = 'id';//默认显示的排序表头
        $scope.desc = true;

        //获取列表
        var currentPageNo = 1;
        $scope.stateName = $state.current.name;
        $scope.pno = $stateParams.pageNo;
        $scope.ps = $stateParams.pageSize;
        $scope.getIntegralList = function (currentPageNo, pageSize, searchObj) {
            shopService.getIntegralList(currentPageNo, $scope.ps, searchObj).then(function (response) {
                $scope.integralList = response;

                //给指令传递参数
                $scope.cpn = parseInt(currentPageNo);
                $scope.totalNum = $scope.ps;

                //多选
                $scope.isEnableDelete = true;
                $scope.selected = [];
                $scope.toggleExisit($scope.selected, $scope.integralList.list);

                //判断是否有选中
                $scope.isSelected = function () {
                    if ($scope.integralList.list.length !== 0) {
                        return $scope.selected.length === $scope.integralList.list.length;
                    }
                };

                //选择全部
                $scope.toggleAll = function () {
                    if ($scope.selected.length === $scope.integralList.list.length) {
                        $scope.selected = [];
                    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                        $scope.selected = $scope.integralList.list.slice(0);
                    }
                };
                $scope.$broadcast('integralList', response);
            }, function () {
                $scope.toast('获取列表失败', 'error');
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

        //搜索积分规则
        $scope.searchIntegral = function (searchObj) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                searchObj: angular.toJson(searchObj)
            });
            $mdSidenav('searchSideNav').close();
        };

        //根据搜索条件是否为空加载数据
        $scope.loadList = function () {
            $stateParams.searchObj === '' ? $scope.getIntegralList($scope.pno, $scope.ps) : $scope.getIntegralList($scope.pno, $scope.ps, $stateParams.searchObj);
        };
        $scope.loadList();

        //从列表中移除积分规则
        function spliceIntegralListFromList(id) {
            $scope.getIntegralList($scope.pno, $scope.ps, $state.searchObj);
            if ($scope.integralList.list.length === 1) {
                if ($scope.pno > 1) {
                    $state.go($scope.stateName, {
                        pageNo: $scope.pno - 1,
                        pageSize: $scope.ps,
                        searchObj: $stateParams.searchObj
                    })
                } else {
                    $scope.spliceID($scope.integralList.list, id);
                }
            } else {
                $scope.spliceID($scope.integralList.list, id);
            }
        }

        //删除积分规则
        $scope.deleteIntegral = function (ev, id) {
            $scope.showConfirm(ev, '是否确认删除此积分规则？', '', function () {
                shopService.deleteIntegral(id).then(function () {
                    $scope.toast('积分规则删除成功', 'success');
                    spliceIntegralListFromList(id);
                }, function () {
                    $scope.toast('积分规则删除失败', 'error');
                })
            })
        };

        //跳转到添加页
        $scope.redirectAdd = function () {
            $state.go('index.shop.integral-add');
        };
    }]);

/*
* 新增或更新积分规则
*/
angular.module('app').controller('operateIntegralCtrl', ['$scope', '$state', '$stateParams', '$mdToast', '$timeout', 'shopService',
    function ($scope, $state, $stateParams, $mdToast, $timeout, shopService) {

        $scope.integralObj = {};

        if ($stateParams.id > 0) {
            $scope.status = 'edit';
            shopService.getIntegralDetails($stateParams.id).then(function (response) {
                $scope.integralObj = response.data;

                $scope.saveIntegral = function (integralObj, ev) {
                    var obj = ev.currentTarget;
                    obj.disabled = true;
                    obj.innerHTML = '正在更新...';
                    shopService.updateIntegral(integralObj).then(function () {
                        $scope.toast('积分规则更新成功', 'success');
                        $timeout(function () {
                            $state.go('index.shop.integral', {pageNo: 1, pageSize: 10});
                        }, 1000)
                    }, function () {
                        $scope.toast('积分规则更新失败', 'error')
                    })
                };
            })
        } else {
            $scope.saveIntegral = function (integralObj, ev) {
                var obj = ev.currentTarget;
                obj.disabled = true;
                obj.innerHTML = '正在保存...';

                // console.log($scope.num);
                // $scope.integralObj.type===1?$scope.integralObj.orderNum=$scope.num:$scope.integralObj.payLine=$scope.money;

                console.log(integralObj);
                shopService.createIntegral(integralObj).then(function () {
                    $scope.toast('积分规则新增成功', 'success');
                    $timeout(function () {
                        $state.go('index.shop.integral', {pageNo: 1, pageSize: 10});
                    }, 1000);
                }, function () {
                    $scope.toast('新增积分规则失败', 'error')
                })
            }
        }
    }]);