angular.module('app').controller('userListCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', 'userService', function ($scope, $state, $stateParams, $mdSidenav, userService) {

    //表头排序
    $scope.sortItem = 'id';//默认显示的排序表头
    $scope.desc = true;

    //获取列表
    var currentPageNo = 1;
    $scope.type = $stateParams.type;
    $scope.stateName = $state.current.name;
    $scope.pno = $stateParams.pageNo;
    $scope.ps = $stateParams.pageSize;
    $scope.getUserList = function (currentPageNo, pageSize, searchObj) {
        userService.getUserList(currentPageNo, $scope.ps, searchObj).then(function (response) {
            $scope.userList = response.data;

            //给指令传递参数
            $scope.cpn = parseInt(currentPageNo);
            $scope.totalNum = $scope.ps;//将路由的值存入页面

            //多选
            $scope.isEnableDelete = true;
            $scope.selected = [];
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

            $scope.isSelected = function () {
                if ($scope.userList.list.length !== 0) {
                    return $scope.selected.length === $scope.userList.list.length;
                }

            };

            //选择全部
            $scope.toggleAll = function () {
                if ($scope.selected.length === $scope.userList.list.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = $scope.userList.list.slice(0);
                }
            };
            $scope.$broadcast('userList', response);
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

    //搜索用户
    $scope.searchUser = function (searchObj) {
        $state.go($scope.stateName, {
            pageNo: currentPageNo,
            pageSize: $scope.ps,
            searchObj: angular.toJson(searchObj)
        });
        $mdSidenav('searchSideNav').close();
    };

    //根据搜索条件是否为空加载数据
    $scope.loadList = function () {
        $stateParams.searchObj === '' ? $scope.getUserList($scope.pno, $scope.ps) : $scope.getUserList($scope.pno, $scope.ps, $stateParams.searchObj);
    };
    $scope.loadList();
}]);
