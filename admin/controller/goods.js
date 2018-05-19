/*
* 商品列表
*/
angular.module('app').controller('goodsListCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', '$mdToast', 'goodsService',
  function ($scope, $state, $stateParams, $mdSidenav, $mdDialog, $mdToast, goodsService) {

    //表头排序
    $scope.sortItem = 'jid';//默认显示的排序表头
    $scope.desc = true;

    //获取列表
    var currentPageNo = 1;
    $scope.type = $stateParams.type;
    $scope.stateName = $state.current.name;
    $scope.pno = $stateParams.pageNo;
    $scope.ps = $stateParams.pageSize;
    $scope.getGoodsList = function (currentPageNo, pageSize, type, searchObj) {
      goodsService.getGoodsList(currentPageNo, $scope.ps, $scope.type, searchObj).then(function (response) {
        //console.log(response);
        $scope.goodsList = response.data;
        //给指令传递参数
        $scope.cpn = parseInt(currentPageNo);
        $scope.totalNum = $scope.ps;

        //多选
        $scope.isEnableDelete = true;
        $scope.selected = [];
        $scope.toggleExisit($scope.selected, $scope.goodsList.list);

        //判断是否有选中
        $scope.isSelected = function () {
          if ($scope.goodsList.list.length !== 0) {
            return $scope.selected.length === $scope.goodsList.list.length;
          }

        };

        // //选择全部
        $scope.toggleAll = function () {
          if ($scope.selected.length === $scope.goodsList.list.length) {
            $scope.selected = [];
          } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = $scope.goodsList.list.slice(0);
          }
        };
        $scope.$broadcast('goodsList', response);
      }, function () {
        $scope.toast('获取列表失败', 'error');
      })
    };

    //跳转分页
    $scope.jumpPage = function (currentPageNo) {
      $state.go($scope.stateName, {
        pageNo: currentPageNo,
        pageSize: $scope.ps,
        type: $scope.type,
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
        type: $scope.type,
        searchObj: $stateParams.searchObj
      })
    };

    //搜索订单
    $scope.searchGoods = function (searchObj) {
      $state.go($scope.stateName, {
        pageNo: currentPageNo,
        pageSize: $scope.ps,
        type: $scope.type,
        searchObj: angular.toJson(searchObj)
      });
      $mdSidenav('searchSideNav').close();
    };

    //根据搜索条件是否为空加载数据
    $scope.loadList = function () {
      $stateParams.searchObj === '' ? $scope.getGoodsList($scope.pno, $scope.ps, $scope.type) : $scope.getGoodsList($scope.pno, $scope.ps, $scope.type, $stateParams.searchObj);
    };
    $scope.loadList();

    //上架商品
    $scope.groundingStock = function (ev, id) {
      $scope.showConfirm(ev, '上架商品', '是否确认上架商品', function () {
        goodsService.changeGoodsState(id, 1).then(function (response) {
          if (response.status === 200) {
            $scope.toast('上架成功', 'success');
            spliceGoodsFromList();
          }
        }, function () {
          $scope.toast('上架失败', 'error');
        })
      })
    };

    //下架商品
    $scope.outStock = function (ev, id) {
      $scope.showConfirm(ev, '下架商品', '是否确认下架商品？', function () {
        goodsService.changeGoodsState(id, 0).then(function () {
          $scope.toast('下架成功', 'success');
          spliceGoodsFromList();
        }, function () {
          $scope.toast('下架失败', 'error');
        })
      })
    };

    //上下架后从列表中移除商品
    function spliceGoodsFromList() {
      $scope.getGoodsList($scope.pno, $scope.ps, $scope.type, $state.searchObj);
      if ($scope.goodsList.list.length === 1) {
        if ($scope.pno > 1) {
          $state.go($scope.stateName, {
            pageNo: $scope.pno - 1,
            pageSize: $scope.ps,
            type: $scope.type,
            searchObj: $stateParams.searchObj
          })
        } else {
          $scope.spliceID($scope.goodsList.list, item.jid);
        }
      } else {
        $scope.spliceID($scope.goodsList.list, item.jid);
      }
    }

    //多选下架商品
    $scope.outStockSelected = function (selected, ev) {
      console.log(selected);
      $scope.showConfirm(ev, '确认下架所选的' + selected.length + '个商品？', '', function () {
        angular.forEach(selected, function (item) {
          goodsService.changeGoodsState(item.jid, 0).then(function () {
            spliceGoodsFromList();
          })
        })
      });
      $scope.toast('下架成功', 'success');
    };

    //多选上架商品
    $scope.groundingStockSelected = function (selected, ev) {
      $scope.showConfirm(ev, '确认上架所选的' + selected.length + '个商品？', '', function () {
        angular.forEach(selected, function (item) {
          goodsService.changeGoodsState(item.jid, 1).then(function () {
            spliceGoodsFromList();
          })
        })
      });
    };

  }]);


/*
* 商品所属评论
*/
angular.module('app').controller('operateGoodsCommentListCtrl', ['$scope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', '$mdToast', 'goodsService',
  function ($scope, $state, $stateParams, $mdSidenav, $mdDialog, $mdToast, goodsService) {

    //表头排序
    $scope.sortItem = 'id';//默认显示的排序表头
    $scope.desc = true;
    $scope.showDetails = false;

    //获取列表
    var currentPageNo = 1;
    var goodsID = $stateParams.goodsID;
    $scope.stateName = $state.current.name;
    $scope.pno = $stateParams.pageNo;
    $scope.ps = $stateParams.pageSize;
    $scope.getCommentList = function (goodsID, currentPageNo, pageSize, searchObj) {
      goodsService.getCommentList(goodsID, currentPageNo, $scope.ps, searchObj).then(function (response) {
        $scope.commentList = response.data;
        $scope.goodsName = response.data.productName;
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
          if ($scope.commentList.list.length !== 0) {
            return $scope.selected.length === $scope.commentList.list.length;
          }

        };

        //选择全部
        $scope.toggleAll = function () {
          if ($scope.selected.length === $scope.commentList.list.length) {
            $scope.selected = [];
          } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = $scope.commentList.list.slice(0);
          }
        };
        $scope.$broadcast('commentList', response);
      }, function () {
        $scope.toast('获取列表失败', 'error');
      })
    };

    //跳转分页
    $scope.jumpPage = function (currentPageNo) {
      $state.go($scope.stateName, {
        goodsID: goodsID,
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
        goodsID: goodsID,
        pageNo: currentPageNo,
        pageSize: $scope.ps,
        searchObj: $stateParams.searchObj
      })
    };

    //搜索评论
    $scope.searchComment = function (searchObj) {
      $state.go($scope.stateName, {
        goodsID: goodsID,
        pageNo: currentPageNo,
        pageSize: $scope.ps,
        searchObj: angular.toJson(searchObj)
      });
      $mdSidenav('searchSideNav').close();
    };

    //审核评论
    $scope.changeState = function (ev, id) {
      $scope.showConfirm(ev, '确认审核此评论？', '', function () {
        goodsService.changeGoodsCommentState(id, 1).then(function (response) {
          if (response.status === 200) {
            $scope.toast('评论审核成功', 'success');
            angular.forEach($scope.commentList.list, function (item) {
              if (item.id === id) {
                item.status = 1;
              }
            })
          }
        }, function () {
          $scope.toast('评论审核失败', 'error');
        })
      })
    };

    //删除评论
    $scope.deleteComment = function (ev, id) {
      $scope.showConfirm(ev, '确认删除此评论？', '', function () {
        goodsService.deleteComment(id).then(function (response) {
          if (response.status === 200) {
            $scope.toast('评论删除成功', 'success');
            if ($scope.commentList.list.length === 1) {
              if ($scope.pno > 1) {
                $state.go($scope.stateName, {
                  goodsID: goodsID,
                  pageNo: $scope.pno - 1,
                  pageSize: $scope.ps,
                  searchObj: $stateParams.searchObj
                })
              } else {
                angular.forEach($scope.commentList.list, function (item, index) {
                  if (item.id === id) {
                    $scope.commentList.list.splice(index, 1);
                  }
                })
              }
            } else {
              angular.forEach($scope.commentList.list, function (item, index) {
                if (item.id === id) {
                  $scope.commentList.list.splice(index, 1);
                }
              })
            }
          }
        }, function () {
          $scope.toast('评论删除失败', 'error');
        })
      })
    };

    //根据搜索条件是否为空加载数据
    $scope.loadList = function () {
      $stateParams.searchObj === '' ? $scope.getCommentList(goodsID, $scope.pno, $scope.ps) : $scope.getCommentList(goodsID, $scope.pno, $scope.ps, $stateParams.searchObj);
    };
    $scope.loadList();

  }]);

/*
* 新增或更新商品
*/
angular.module('app').controller('operateGoodsCtrl', ['$rootScope', '$scope', '$mdToast', '$state', '$stateParams', 'goodsService', 'categoryService', function ($rootScope, $scope, $mdToast, $state, $stateParams, goodsService, categoryService) {

  $scope.goodsObj = {};
  $scope.goodsObj.pictures = '';
  $scope.goodsObj.sku = '';
  $scope.skuTempTable = [];
  $scope.skuGroup = {};

  //获取商品分类
  categoryService.getCategoryList(1, 100, '', 1).then(function (response) {
    $scope.typeList = response.data;
  }, function () {
    $scope.toast('获取商品分类失败', 'error');
  });


  //获取商品用途分类
  categoryService.getCategoryList(1, 100, '', 2).then(function (response) {
    $scope.usesList = response.data;
  }, function () {
    $scope.toast('获取商品用途分类失败', 'error');
  });

  //将SKU的属性添加到数组中
  function insertSku(colorList, materialList, sizeList) {
    $scope.show = function () {
      for (i in colorList) {
        if (!colorList[i].checked) continue;
        for (j in materialList) {
          if (!materialList[j].checked) continue;
          for (k in sizeList) {
            if (!sizeList[k].checked) continue;
            $scope.skuGroup = {
              color: colorList[i].value,
              material: materialList[j].value,
              size: sizeList[k].value
            };
            $scope.skuTempTable.push($scope.skuGroup);
          }
        }
      }
    };

    $scope.toggle = function (item) {
      $scope.skuTempTable = [];
      item.subItem.checked = !item.subItem.checked;
      $scope.show();
    };
  }

  //获取商品属性
  if ($stateParams.id > 0) {
    goodsService.getGoodsDetailsAttr($stateParams.id).then(function (response) {
      console.log(response);
      $scope.attrList = response.data.itemReceiveList;
      var colorList = $scope.attrList[0].itemAttributes;
      var materialList = $scope.attrList[1].itemAttributes;
      var sizeList = $scope.attrList[2].itemAttributes;

      insertSku(colorList, materialList, sizeList);
    })
  } else {
    goodsService.getAttrList(1, 0, '').then(function (response) {
      $scope.attrList = response.data;
      var colorList = response.data[0].itemAttributes;
      var materialList = response.data[1].itemAttributes;
      var sizeList = response.data[2].itemAttributes;

      insertSku(colorList, materialList, sizeList);

      $scope.toggle = function (item) {
        $scope.skuTempTable = [];
        item.subItem.checked = !item.subItem.checked;
        $scope.show();
      };
    }, function () {
      $scope.toast('获取商品属性失败', 'error');
    });
  }

  //获取已上传的商品图片
  $scope.$on('uploaded', function (event, response) {
    $scope.goodsObj.pictures = response.join(',');
  });

  function getSku() {
    var temp = [];
    angular.forEach($scope.skuTempTable, function (item) {
      var t = item.color + ',' + item.material + ',' + item.size + ',' + item.price + ',' + item.stock + ',' + item.picture;
      temp.push(t);
    });
    $scope.goodsObj.sku = temp.join('//');
  }

  //保存商品
  if ($stateParams.id > 0) {
    goodsService.getGoodsDetails($stateParams.id).then(function (response) {
      $scope.goodsObj = response.data.product;
      $scope.goodsObj.uploadedImageList = response.data.product.pictures.split(',');
      $scope.skuTempTable = response.data.sku;

      $("#editor").html(response.data.product.content);
      $("#afterSalesEditor").html(response.data.product.custservice);
      $("#packageEditor").html(response.data.product.packinglist);

      $scope.saveGoods = function (ev) {
        var obj = ev.currentTarget;
        obj.disabled = true;
        obj.innerHTML = '正在保存...';

        getSku();
        delete $scope.goodsObj.uploadedImageList;
        //console.log($scope.goodsObj);
        goodsService.updateGoods($scope.goodsObj).then(function (response) {
          $scope.toast('商品编辑成功', 'success');
          $state.go($rootScope.fromState, $rootScope.fromParams);
        });
      }
    })
  } else {
    $scope.saveGoods = function (ev) {
      var obj = ev.currentTarget;
      obj.disabled = true;
      obj.innerHTML = '正在保存...';


      getSku();
      //console.log($scope.goodsObj);
      goodsService.addGoods($scope.goodsObj).then(function () {
        $scope.toast('新增成功', 'success');
        $state.go('index.goods.sales-list', {pageNo: 1, pageSize: 10, type: 1});
      }, function () {
        $scope.toast('新增失败', 'error');
      })
    }
  }
}]);

/*
* 属性列表
*/
angular.module('app').controller('attrListCtrl', ['$scope', '$state', 'goodsService', function ($scope, $state, goodsService) {

  //获取商品属性列表
  $scope.getAttrList = function () {
    goodsService.getAttrList(1, 0, '').then(function (response) {
      //console.log(response);
      $scope.colorList = response.data[0];
      $scope.materialList = response.data[1];
      $scope.sizeList = response.data[2];
    }, function () {
      $scope.toast('获取商品属性列表失败', 'error');
    });
  };

  $scope.getAttrList();

  //显示商品属性添加菜单
  $scope.addAttr = function ($mdOpenMenu) {
    $mdOpenMenu();
  };

  //保存商品属性
  $scope.saveAttr = function (type, name) {
    goodsService.addAttr(type, name).then(function (response) {
      if (response.status === 200) {
        $scope.toast('属性新增成功', 'success');
        $scope.getAttrList();
      } else if (response.status === 400) {
        $scope.toast('已存在同名属性', 'warning');
      }
    }, function () {
      $scope.toast('新增失败', 'error');
    })
  };

  //删除商品属性
  $scope.deleteAttr = function (ev, typeID, id) {
    var spliceID = function (array, attrID) {
      attrID = id;
      angular.forEach(array, function (item, id) {
        if (attrID === item.id) {
          array.splice(id, 1);
        }
      })
    };

    $scope.showConfirm(ev, '删除属性', '是否确认删除商品属性？', function () {
      goodsService.deleteAttr(id).then(function (response) {
        if (response.status === 200) {
          $scope.toast('属性删除成功', 'success');
          var idx = '';
          switch (typeID) {
            case 1:
              spliceID($scope.colorList.itemAttributes, id);
              break;
            case 2:
              spliceID($scope.materialList.itemAttributes, id);
              break;
            case 3:
              spliceID($scope.sizeList.itemAttributes, id);
              break;
          }
        } else if (response.status === 400) {
          $scope.toast('无法删除已绑定商品的属性', 'error');
        }
      })
    })
  }
}]);


angular.module('app').controller('operateGoodsTestCtrl', ['$scope', '$mdToast', '$state', '$stateParams', 'goodsService', 'categoryService', function ($scope, $mdToast, $state, $stateParams, goodsService, categoryService) {

  $scope.goodsObj = {};
  $scope.goodsObj.pictures = '';
  $scope.goodsObj.sku = '';
  $scope.skuTempTable = [];

  $scope.skuGroup = {};

  var sku = [];

  //获取商品属性
  goodsService.getAttrList(1, 0, '').then(function (response) {
    $scope.attrList = response.data;
    var colorList = response.data[0].itemAttributes;
    var materialList = response.data[1].itemAttributes;
    var sizeList = response.data[2].itemAttributes;

    $scope.show = function () {
      for (i in colorList) {
        if (!colorList[i].checked) continue;
        for (j in materialList) {
          if (!materialList[j].checked) continue;
          for (k in sizeList) {
            if (!sizeList[k].checked) continue;
            $scope.skuGroup = {
              color: colorList[i].value,
              material: materialList[j].value,
              size: sizeList[k].value
            };
            $scope.skuTempTable.push($scope.skuGroup);
          }
        }
      }
    };

    $scope.toggle = function (item) {
      //$scope.skuGroup = {};
      $scope.skuTempTable = [];
      item.subItem.checked = !item.subItem.checked;
      $scope.show();
    };
  }, function () {
    $scope.toast('获取商品属性失败', 'error');
  });

  // $scope.toggle = function (id, subItem) {
  //     subItem.checked=!subItem.checked;
  //     if(subItem.checked===false){
  //         var deleteArrItems = (arr, item) => arr.filter(v => v.indexOf(item)===-1);
  //         $scope.skuGroup = deleteArrItems($scope.skuGroup, subItem.value);
  //     }else{
  //         for (var i = 0; i < $scope.attrList.length; i++) {
  //             if ($scope.attrList[i].id === id) {
  //                 skuTempArray[i].push(subItem.value);
  //                 console.log(skuTempArray);
  //                 $scope.skuGroup = doExchange(skuTempArray);
  //                 console.log($scope.skuGroup);
  //                 $scope.skuGroup=ov4($scope.skuGroup);
  //             }
  //         }
  //     }
  // };


  //保存商品
  if ($stateParams.id > 0) {

  } else {
    $scope.saveGoods = function (ev) {
      // var obj = ev.currentTarget;
      // obj.disabled = true;
      // obj.innerHTML = '正在保存...';
      // $('.table-item-row').each(function () {
      //     var sku = $(this).data('sku');
      //     var skuImg = $(this).find('.sku-img').attr('src');
      //     sku = sku + ";" + skuImg;
      //     skuGroup.push(sku);
      // });

      // $('.table-item-row').each(function () {
      //     var skuImg = $(this).find('.sku-img').attr('src');
      //     angular.forEach($scope.skuTempTable,function (item,index) {
      //         if($(this).data('index')===index){
      //             item.picture=skuImg;
      //         }
      //     })
      // });

      var temp = [];
      angular.forEach($scope.skuTempTable, function (item) {
        var t = item.color + ',' + item.material + ',' + item.size + ',' + item.price + ',' + item.stock + ',' + item.picture;
        temp.push(t);
      });
      console.log(temp);

      //console.log(angular.fromJson($scope.skuTempTable.join(',')));
      $scope.goodsObj.sku = temp.join('//');

      console.log($scope.goodsObj);
    }
  }

    $scope.json=[{
        name:"项目名称一",
        complete:50,
        total:100,
        color:'#5A849C'
    },{
        name:"项目名称二",
        complete:20,
        total:100,
        color:'#63C4BF'
    },{
        name:"项目名称三",
        complete:10,
        total:100,
        color:'#E48431'
    },{
        name:"项目名称四",
        complete:40,
        total:100,
        color:'#39A142'
    }];

    $scope.$broadcast('testData',$scope.json);
}]);

angular.module('app').filter('getSku', function () {
  return function (items) {
    var index = items.lastIndexOf("/");
    var str = items.substring(index, 0);
    return str;
  }
});

angular.module('app').filter('getSkuID', function () {
  return function (items) {
    var index = items.indexOf("/");
    var str = items.substring(index + 1, items.length);
    return str;
  }

});