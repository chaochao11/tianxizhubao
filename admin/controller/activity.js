/*
* 获取活动列表
*/
angular.module('app').controller('activityListCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', '$mdToast', 'activityService',
    function ($scope, $state, $stateParams, $mdSidenav, $mdDialog, $mdToast, activityService) {

        //表头排序
        $scope.sortItem = 'id';//默认显示的排序表头
        $scope.desc = true;

        //获取列表
        var currentPageNo = 1;
        $scope.stateName = $state.current.name;
        $scope.pno = $stateParams.pageNo;
        $scope.ps = $stateParams.pageSize;
        $scope.getActivityList = function (currentPageNo, pageSize, searchObj) {
            activityService.getActivitysList(currentPageNo, $scope.ps, searchObj).then(function (response) {
                console.log(response);
                $scope.activityList = response.data;

                //给指令传递参数
                $scope.cpn = parseInt(currentPageNo);
                $scope.totalNum = $scope.ps;

                //多选
                $scope.isEnableDelete = true;
                $scope.selected = [];
                $scope.toggleExisit($scope.selected, $scope.activityList.list);

                //判断是否有选中
                $scope.isSelected = function () {
                    if ($scope.activityList.list.length !== 0) {
                        return $scope.selected.length === $scope.activityList.list.length;
                    }

                };

                //选择全部
                $scope.toggleAll = function () {
                    if ($scope.selected.length === $scope.activityList.list.length) {
                        $scope.selected = [];
                    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                        $scope.selected = $scope.activityList.list.slice(0);
                    }
                };
                $scope.$broadcast('activityList', response);
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
        $scope.searchActivity = function (searchObj) {
            $state.go($scope.stateName, {
                pageNo: currentPageNo,
                pageSize: $scope.ps,
                searchObj: angular.toJson(searchObj)
            });
            $mdSidenav('searchSideNav').close();
        };

        //根据搜索条件是否为空加载数据
        $scope.loadList = function () {
            $stateParams.searchObj === '' ? $scope.getActivityList($scope.pno, $scope.ps) : $scope.getActivityList($scope.pno, $scope.ps, $stateParams.searchObj);
        };
        $scope.loadList();

        //从列表中移除活动
        function spliceActivityFromList(id) {
            $scope.getActivityList($scope.pno, $scope.ps, $state.searchObj);
            if ($scope.activityList.list.length === 1) {
                if ($scope.pno > 1) {
                    $state.go($scope.stateName, {
                        pageNo: $scope.pno - 1,
                        pageSize: $scope.ps,
                        searchObj: $stateParams.searchObj
                    })
                } else {
                    $scope.spliceID($scope.activityList.list, id);
                }
            } else {
                $scope.spliceID($scope.activityList.list, id);
            }
        }

        //删除活动
        $scope.deleteActvity=function (ev,id) {
            $scope.showConfirm(ev,'是否确认删除此活动？','',function () {
                activityService.deleteActivity(id).then(function (reseponse) {
                    $scope.toast('活动删除成功','success');
                    spliceActivityFromList(id);
                },function () {
                    $scope.toast('活动删除失败','error');
                })
            })
        }

        //跳转到新增活动页
        $scope.redirectAdd=function () {
            $state.go('index.activity.add');
        }
    }]);

/*
* 新增或更新活动
*/
angular.module('app').controller('operateActivityCtrl', ['$scope', '$state', '$stateParams','$timeout', 'activityService', 'goodsService',
    function ($scope, $state, $stateParams,$timeout, activityService, goodsService) {

    $scope.activityObj = {};
    $scope.isSingleGoodsCoupon=false;

    //获得当前日期的后一天
    function getNextDate(date) {
        var days = +1;
        var d = new Date(date);
        d.setDate(d.getDate() + days);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return d.getFullYear() + "-" + month + "-" + day;
    }

    //获取活动类型
    activityService.getActivitysTypeList(1, 0, '').then(function (response) {
        $scope.activityTypeList = response.data.list;
    },function () {
        $scope.toast('获取活动类型失败','error')
    });

    //获得选择的日期的后一天
    $scope.getStartDate = function () {
        $scope.nextDate = new Date(getNextDate($scope.activityObj.startTime));
    };

    //获得商品数量
    $scope.getGoodsList = function (val) {
        var searchObj = {name: val};
        return goodsService.getGoodsList(1, 0, 1, searchObj).then(function (response) {
            return response.data.list;
        });
    };

    //添加商品到临时数组中
    $scope.selectedGoodsList = [];
    $scope.selectedItemChange = function (val) {
        if (typeof(val) !== 'undefined') {
            for(var i=0;i<$scope.selectedGoodsList.length;i++){
                if($scope.selectedGoodsList[i].jid===val.jid){
                    $('#autoComplete').val('');
                    $scope.toast('请不要添加重复的商品','warning');
                    return;
                }
            }
            $scope.selectedGoodsList.push(val);
            console.log($scope.selectedGoodsList);
            if($scope.activityObj.activityTag===2){
                if($scope.selectedGoodsList.length===1){
                    $scope.isSingleGoodsCoupon=true;
                }
            }
            $('#autoComplete').val('');
        }
    };

    //从临时数组中移除商品
    $scope.removeGoods=function (index) {
        $scope.selectedGoodsList.splice(index,1);
        if($scope.selectedGoodsList.length===0) {
            $scope.isSingleGoodsCoupon = false;
        }
    };

    //当活动类型变更时更改选择的商品
    $scope.changeTag=function () {
        if($scope.selectedGoodsList.length>0){
            $scope.selectedGoodsList.length=0;
            $scope.isSingleGoodsCoupon = false;
        }
        if($scope.activityObj.activityTag===2){
            $scope.activityObj.condition=1;
        }
    };

    function getGoodsIDFromList() {
        $scope.tempProductList=[];
        angular.forEach($scope.selectedGoodsList,function (item) {
            $scope.tempProductList.push(item.jid);
            return $scope.activityObj.productList=$scope.tempProductList.join(',');
        });
    }

    //保存活动
    if ($stateParams.id > 0) {
        $scope.status = 'edit';
        activityService.getActivityDetails($stateParams.id).then(function (response) {
            console.log(response);
            $scope.activityObj=response.data;
            $scope.activityObj.startTime=new Date($scope.activityObj.startTime);
            $scope.activityObj.endTime=new Date($scope.activityObj.endTime);
            $scope.selectedGoodsList=$scope.activityObj.list;
            if($scope.activityObj.activityTag===2){
                $scope.isSingleGoodsCoupon=true;
            }
        });

        $scope.operateActivity = function (ev, activityObj) {
            var obj=ev.currentTarget;
            obj.disabled=true;
            obj.innerHTML='正在保存...';
            getGoodsIDFromList();
            activityService.updateActivity($stateParams.id,activityObj).then(function () {
                $scope.toast('活动更新成功','success');
                $timeout(function () {
                    $state.go('index.activity.list',{pageNo:1,pageSize:10});
                },500)
            },function () {
                $scope.toast('活动更新失败','error');
            })
        }
    } else {
        $scope.operateActivity = function (ev, activityObj) {
            var obj=ev.currentTarget;
            obj.disabled=true;
            obj.innerHTML='正在保存...';
            // $scope.activityObj.startTime=new Date($scope.activityObj.startTime);
            // $scope.activityObj.endTime=new Date($scope.activityObj.endTime);
            getGoodsIDFromList();
            activityService.addActivity(activityObj).then(function (response) {
                $scope.toast('活动新增成功','success');
                $timeout(function () {
                    $state.go('index.activity.list',{pageNo:1,pageSize:10});
                },500)
            },function () {
                $scope.toast('活动新增失败','error');
            })
        }
    }
}]);
