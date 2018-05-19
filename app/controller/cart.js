angular.module('app').controller('cartListCtrl', ['$scope', '$state', '$rootScope', 'cartService', function ($scope, $state, $rootScope, cartService) {
    $scope.isDisabled = false;
    $scope.showEdit = false;
    $scope.cartList = [];
    $scope.selectAllStatus = false;
    $rootScope.confirmOrderObj = [];

    //获取购物车列表
    cartService.getCartList(localStorage.getItem('openID')).then(function (dataObj) {
        if (dataObj.status === 200) {
            $scope.cartList = dataObj.data;
            $scope.cartList === undefined ? $scope.noData = true : $scope.noData = false;
        } else if (dataObj.status === 500) {
            alert('获取购物车列表失败');
        }
    }, function () {
        alert('获取购物车列表失败');
    });


    //计算总价格
    $scope.getTotalPrice = function () {
        var totalPrice = 0;
        angular.forEach($scope.cartList, function (item) {
            if (item.checked) {
                totalPrice += item.price * item.num;
            }
        });
        return totalPrice;
    };

    //删除购物车中的项
    $scope.onItemDelete = function (itemID) {
        cartService.deleteCartItem(itemID).then(function (dataObj) {
            console.log(dataObj);
            if (dataObj.status === 200) {
                $state.go('index.cart', {}, {reload: true});
                $scope.$emit('cartQuantity', dataObj.data.count);
            }
        });
    };

    //增加数量
    $scope.plus = function (id) {
        angular.forEach($scope.cartList, function (item) {
            if (id === item.cid) {
                item.num++;
                cartService.operateQuantity(id, item.num).then(function (dataObj) {
                });
            }
        })
    };

    //减少数量
    $scope.reduce = function (id) {
        angular.forEach($scope.cartList, function (item) {
            if (id === item.cid) {
                item.num--;
                cartService.operateQuantity(id, item.num).then(function (dataObj) {
                });
            }
        });
    };

    //显示可编辑界面
    $scope.showEditCart = function () {
        $scope.showEdit = !$scope.showEdit;
    };


    //选择的产品总数量
    $scope.getProductTotal = function () {
        $scope.productTotal = 0;
        angular.forEach($scope.cartList, function (item) {
            if (item.checked === true) {
                $scope.productTotal += 1;
            }
        });
        return $scope.productTotal;
    };

    //创建订单
    $scope.createOrder = function () {
        angular.forEach($scope.cartList, function (item) {
            if (item.checked === true) {
                $scope.orderObj = {};
                $scope.orderObj.id = item.jid;
                $scope.orderObj.category = item.uses;
                $scope.orderObj.name = item.name;
                $scope.orderObj.pic = item.img;
                $scope.orderObj.property = item.attrValues;
                $scope.orderObj.quantity = item.num;
                $scope.orderObj.price = item.price;
                $scope.orderObj.skuID = item.skuid;
                $rootScope.confirmOrderObj.push($scope.orderObj);
            }
        });
        $state.go('index.cart-order-confirm');
    };


    //单选商品
    $scope.selectOne = function () {
        $scope.temp = [];
        angular.forEach($scope.cartList, function (item) {
            if (item.checked === true) {
                $scope.temp.push(item);
            }
        });
        $scope.temp.length === $scope.cartList.length ? $scope.selectAllStatus = true : $scope.selectAllStatus = false;
    };

    //全选反选
    $scope.selectAll = function (selectAllStatus) {
        if (selectAllStatus === true) {
            angular.forEach($scope.cartList, function (item) {
                item.checked = true;
            })
        } else {
            angular.forEach($scope.cartList, function (item) {
                item.checked = false;
            })
        }
    };

    //多选删除
    $scope.checkDelete = function () {
        angular.forEach($scope.cartList, function (item) {
            if (item.checked === true) {
                cartService.deleteCartItem(item.cid).then(function (dataObj) {
                    if (dataObj.status === 200) {
                        $state.go('index.cart', {}, {reload: true});
                        $scope.$emit('cartQuantity', dataObj.data.count);
                    }
                })
            }
        });
    }
}]);