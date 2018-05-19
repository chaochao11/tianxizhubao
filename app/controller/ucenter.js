/*
* 个人中心
*/
angular.module('app').controller('ucenterCtrl', ['$scope','ucenterService', function ($scope,ucenterService) {
    $scope.userInfoObj={};
    $scope.userInfoObj.avatar=localStorage.getItem('avatar');
    $scope.userInfoObj.nickName=localStorage.getItem('nickName');
    $scope.userInfoObj.integral=localStorage.getItem('integral');

    ucenterService.getUserInfo(localStorage.getItem('openID')).then(function (response) {
        $scope.orderInfoObj=response.orderCount;
    })
}]);

/*
* 我的积分
*/
angular.module('app').controller('intergralDetailsCtrl', ['$scope','ucenterService', function ($scope,ucenterService) {

    $scope.userInfoObj={};
    $scope.userInfoObj.avatar=localStorage.getItem('avatar');
    $scope.userInfoObj.nickName=localStorage.getItem('nickName');

    var currentPageNo = 0;
    var pageSize = 6;
    $scope.hasMore = true;
    $scope.inteGralList=[];

    //获取积分列表
    $scope.loadMore = function () {
        var pageCount = 0;
        currentPageNo++;
        ucenterService.getUserIntegralList(localStorage.getItem('openID'), currentPageNo, pageSize).then(function (response) {
            $scope.totalIntegral=response.totalIntegral;
            pageCount = Math.ceil(response.itemCount / pageSize);
            currentPageNo < pageCount ? $scope.hasMore = true : $scope.hasMore = false;
            $scope.inteGralList = $scope.inteGralList.concat(response.list);
        }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (e) {
            alert(e);
        });
    };
}]);

/*地址管理*/
angular.module('app').controller('addressListCtrl', ['$scope', '$state', '$rootScope', '$timeout', '$ionicHistory', 'addressService',
    function ($scope, $state, $rootScope, $timeout, $ionicHistory, addressService) {

        switch($state.current.name){
            case 'index.main-confirm-address':
                $scope.jumpUrl = 'index.main-add-address';
                $scope.updateAddressUrl = 'index.main-update-address';
                break;
            case 'index.product-confirm-address':
                $scope.jumpUrl = 'index.product-add-address';
                $scope.updateAddressUrl = 'index.product-update-address';
                break;
            case 'index.cart-confirm-address':
                $scope.jumpUrl = 'index.cart-add-address';
                $scope.updateAddressUrl = 'index.cart-update-address';
                break;
            default:
                $scope.jumpUrl = 'index.add-address';
                $scope.updateAddressUrl = 'index.update-address';
        }
        // if ($state.current.name === 'index.main-confirm-address') {
        //     $scope.jumpUrl = 'index.main-add-address';
        //     $scope.updateAddressUrl = 'index.main-update-address';
        // } else if ($state.current.name === 'index.product-confirm-address') {
        //     $scope.jumpUrl = 'index.product-add-address';
        //     $scope.updateAddressUrl = 'index.product-update-address';
        // } else if ($state.current.name === 'index.cart-confirm-address') {
        //     $scope.jumpUrl = 'index.cart-add-address';
        //     $scope.updateAddressUrl = 'index.cart-update-address';
        // } else {
        //     $scope.jumpUrl = 'index.add-address';
        //     $scope.updateAddressUrl = 'index.update-address';
        // }

        //获取所有收货地址
        addressService.getAddressList(localStorage.getItem('openID')).then(function (dataObj) {
            $scope.addressList = dataObj.data;
        }, function () {
            alert('获取地址失败');
        });

        //设置默认地址
        $scope.setDefault = function (id) {
            if ($state.current.name === 'index.main-confirm-address' || $state.current.name === 'index.product-confirm-address' || $state.current.name === 'index.cart-confirm-address') {
                addressService.setDefaultAddress(id).then(function () {
                    angular.forEach($scope.addressList, function (item) {
                        if (item.status === 0 && id === item.id) {
                            item.status = 1;
                        } else {
                            item.status = 0;
                        }
                    });
                    $ionicHistory.goBack();
                }, function () {
                    alert('设置默认地址失败')
                })
            } else {
                addressService.setDefaultAddress(id).then(function () {
                    angular.forEach($scope.addressList, function (item) {
                        if (item.status === 0 && id === item.id) {
                            item.status = 1;
                        } else {
                            item.status = 0;
                        }
                    });
                }, function () {
                    alert('设置默认地址失败')
                })
            }
        };

        //删除收货地址
        $scope.deleteAddress = function (id) {
            addressService.deleteAddress(id).then(function (dataObj) {
                if (dataObj.status === 200) {
                    alert('删除成功');
                    $state.go($state.current.name, {}, {reload: true});
                }
            }, function () {
                alert('删除失败');
            })
        }
    }]);

/*新增或更新管理地址*/
angular.module('app').controller('operateAddressCtrl', ['$scope','$rootScope', '$state', '$stateParams', '$timeout', '$ionicHistory', 'addressService','$ngConfirm',
    function ($scope,$rootScope, $state, $stateParams, $timeout, $ionicHistory, addressService,$ngConfirm) {

        $scope.addressObj = {};
        $scope.addressObj.status = false;
        $scope.hasArea = true;

        //获取选择的城市列表ID
        $scope.$on('selectedCity', function (event, data) {
            $scope.addressObj.area = data.join(',');
            if (data.length === 3) {
                $scope.$apply(function () {
                    $scope.hasArea = false;
                })
            }
        });


        //保存地址
        if ($stateParams.id > 0) {
            addressService.getAddressDetails($stateParams.id).then(function (dataObj) {
                $scope.addressObj = dataObj.data;
                if ($scope.addressObj.area !== '') {
                    $scope.hasArea = false;
                }
                $scope.$broadcast('area', $scope.addressObj.area.split(','));
            });

            $scope.saveAddress = function (addressObj) {
                //console.log(addressObj);
                addressService.updateAddress(addressObj).then(function () {
                  $ngConfirm({
                      boxWidth: '80%',
                      useBootstrap: false,
                      title: '地址修改成功',
                      content: '',
                      type: 'black',
                      typeAnimated: true,
                      buttons: {
                          tryAgain: {
                              text: '确定',
                              action: function () {
                                $ionicHistory.goBack();
                              }
                          }
                      }
                  });
                }, function () {
                  $ngConfirm({
                    boxWidth: '80%',
                    useBootstrap: false,
                    title: '地址修改失败',
                    content: '',
                    type: 'black',
                    typeAnimated: true,
                    buttons: {
                      tryAgain: {
                        text: '确定'
                      }
                    }
                  });
                })
            };
        } else {
            $scope.saveAddress = function (addressObj) {

                addressObj.openid = localStorage.getItem('openID');
                //转换默认值
                addressObj.status === true ? addressObj.status = 1 : addressObj.status = 0;
                addressService.operateAddress(addressObj).then(function () {
                  $ngConfirm({
                    boxWidth: '80%',
                    useBootstrap: false,
                    title: '地址添加成功',
                    content: '',
                    type: 'black',
                    typeAnimated: true,
                    buttons: {
                      tryAgain: {
                        text: '确定',
                        action: function () {
                          $ionicHistory.goBack();
                        }
                      }
                    }
                  });
                }, function () {
                  $ngConfirm({
                    boxWidth: '80%',
                    useBootstrap: false,
                    title: '地址添加失败',
                    content: '',
                    type: 'black',
                    typeAnimated: true,
                    buttons: {
                      tryAgain: {
                        text: '确定'
                      }
                    }
                  });
                })
            }
        }
    }]);

/*绑定手机*/
angular.module('app').controller('bindPhoneCtrl', ['$scope','$state','ucenterService', function ($scope,$state,ucenterService) {

    $scope.data={};
    //获取用户已绑定的手机号
    ucenterService.getBindPhone(localStorage.getItem('openID')).then(function (response) {
        $scope.data.phoneNum=response.data;
    });

    //保存手机号
    $scope.savePhone = function (data) {
        ucenterService.savePhone(localStorage.getItem('openID'),data.phoneNum,data.smsCode).then(function (response) {
            if(response.status===500){
                alert('验证码错误');
            }else{
                alert('手机号绑定成功');
                $scope.data.smsCode='';
                $state.go('index.ucenter');
            }
        },function () {
            alert('绑定手机失败，请重新尝试！')
        })
    }
}]);