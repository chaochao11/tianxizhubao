angular.module('app').directive('tablescroll', function () {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            var bodyHeight = document.body.clientHeight;
            var elHeight = bodyHeight - 290;
            element.css('height', elHeight + 'px');
        }
    }
});

/*
* 显示评论详情
* */
angular.module('app').directive('showCommentDetails', function () {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            $(el).on('click', function () {
                $(el).text($(this).parent().parent().siblings('.comment-details').is(":visible") ? "查看" : "关闭");
                $(this).parent().parent().siblings('.comment-details').slideToggle(function () {
                });
            })
        }
    }
});

/*
 * 左侧导航菜单
 */
angular.module('app').directive('slideNav', ['$timeout', '$state', function ($timeout, $state) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            $timeout(function () {
                //获取子菜单的高度
                var subListHeight = $(el).siblings('.sub-nav-wrapper').find('.sub-nav-list').height();
                //设置子菜单的当前位置
                $(el).siblings('.sub-nav-wrapper').find('.sub-nav-list').css('margin-top', -subListHeight);
                $(el).on('click', function () {
                    if ($(this).hasClass('open')) {
                        $(this).removeClass('open').siblings('.sub-nav-wrapper').find('.sub-nav-list').css({
                            'margin-top': -subListHeight,
                            'transition': 'all .5s'
                        });
                        $(this).find('.material-icons').removeClass('open');
                    } else {
                        $(this).addClass('open').siblings('.sub-nav-wrapper').find('.sub-nav-list').css({
                            'margin-top': 0,
                            'transition': 'all .5s'
                        });
                        $(this).find('.material-icons').addClass('open');
                    }
                })
            })
        }
    }
}]);

/*
 * 加载页面时展开当前菜单
 */
angular.module('app').directive('slideCurrentMenu', ['$timeout', '$state', function ($timeout, $state) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            $timeout(function () {
                //获取当前路由状态
                var currentState = $state.current.name;
                setTimeout(function () {
                    $(el).find('.sub-nav-item').each(function (idex, item) {
                        var href = $(item).attr('href');
                        var otherState = $(item).data('other-state');
                        if (window.location.hash === href || $(item).attr('ui-sref').indexOf(currentState) === 0 || window.location.hash.indexOf(otherState) > 0) {
                            $(item).parent().parent().siblings('button').addClass('open');
                            $(item).parent().css({
                                'margin-top': 0,
                                'transition': 'all .5s'
                            });
                            $(item).parent().parent().siblings('button').find('.material-icons').addClass('open');
                        }
                    });
                });
            })
        }
    }
}]);

/**
 * 验证两次密码是否输入一致
 **/
angular.module('app').directive('useFormError', function () {
    return {
        restrict: 'A',
        require: ['?ngModel', '^form'],
        scope: {
            useFormError: '@',
            useErrorExpression: "=",
            useErrorInput: "=?"
        },
        link: function (scope, elem, attrs, ctrls) {
            var validityObject = scope.useErrorInput || ctrls[0] || ctrls[1];
            if (validityObject && angular.isFunction(validityObject.$setValidity)) {
                scope.$watch('useErrorExpression', function (newVal) {
                    $log.debug('Key: ' + attrs.useFormError + '. Expression: ' + attrs.useErrorExpression + ' is ' + newVal);
                    if (newVal) {
                        validityObject.$setValidity(scope.useFormError, false);
                    } else {
                        validityObject.$setValidity(scope.useFormError, true);
                    }
                });
            }
        }
    };
});

/*
 * 分页
 */
angular.module('app').directive('page', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: ' template/page.html',
        link: function ($scope, elem, attrs) {
            $scope.pageSize = $scope.ps; //从控制器获取每页显示记录数
            $scope.currentPageNo = 1; //设置当前页页码初始值
            $scope.$on(attrs.method, function () {
                $scope.pageData = $scope[attrs.method]; //从指令属性中获取数据
                $scope.pages = [];
                $scope.itemCount = $scope.pageData.itemCount; //获取总记录数
                $scope.pageTotal = Math.ceil($scope.pageData.itemCount / $scope.pageSize); //获取总页数
                $scope.cpn = parseInt($scope.cpn);
                $scope.getPage = function () {
                    if ($scope.pageTotal <= 7) {
                        for (var i = 1; i < $scope.pageTotal + 1; i++) {
                            $scope.pages.push(i);
                        }
                    } else if ($scope.cpn < 4) {
                        $scope.pages = [1, 2, 3, 4, 5, '...', $scope.pageTotal];
                    } else if (($scope.pageTotal - $scope.cpn) <= 3) {
                        $scope.pages = [
                            $scope.pageTotal - 6,
                            $scope.pageTotal - 5,
                            $scope.pageTotal - 4,
                            $scope.pageTotal - 3,
                            $scope.pageTotal - 2,
                            $scope.pageTotal - 1,
                            $scope.pageTotal
                        ]
                    } else {
                        $scope.pages = [
                            $scope.cpn - 2,
                            $scope.cpn - 1,
                            $scope.cpn,
                            $scope.cpn + 1,
                            $scope.cpn + 2,
                            '...',
                            $scope.pageTotal
                        ]
                    }
                }
                $scope.getPage();
            })
        }
    }
});

/*
 * 管理员名称是否重复
 */
angular.module('app').directive('adminNameIsExist', ['managerService', '$q', function (managerService, $q) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {
            ngModel.$asyncValidators.adminNameIsExist = function (modelValue) {
                var adminObj = {aId: scope.aId, adminId: modelValue};
                return managerService.checkAdminNameIsExist(adminObj).then(function (data) {
                    console.log(data);
                    if (data.message === 'exist') {
                        return $q.reject('exist');
                    } else {
                        return $q.resolve('notExist');
                    }
                })
            }
        }
    }
}]);

/**
 * 内容编辑器，适用于页面只有一个编辑器使用
 */
angular.module('app').directive('contentEditor', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var editor = new wangEditor('editor');
            editor.onchange = function () {
                scope.$apply(function () {
                    var html = editor.$txt.html();
                    ctrl.$setViewValue(html);
                    html === '<p><br></p>' ? scope.isHtmlNull = true : scope.isHtmlNull = false;
                });
            };
            editor.config.menus = [
                'source',
                '|',
                'bold',
                'underline',
                'italic',
                'strikethrough',
                'eraser',
                'forecolor',
                'bgcolor',
                '|',
                'quote',
                'fontfamily',
                'fontsize',
                'head',
                'unorderlist',
                'orderlist',
                'alignleft',
                'aligncenter',
                'alignright',
                '|',
                'link',
                'unlink',
                'table',
                'video',
                '|',
                'img',
                '|',
                'undo',
                'redo',
                'fullscreen'
            ];
            editor.config.printLog = false;
            editor.config.uploadImgUrl = $rootScope.baseURL + "api/admin/uploadFile";
            editor.config.uploadImgFileName = 'myFileName';
            editor.create();
        }
    };
}]);

/**
 * 售后服务内容编辑器
 */
angular.module('app').directive('afterSalesEditor', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var editor = new wangEditor('afterSalesEditor');
            editor.onchange = function () {
                scope.$apply(function () {
                    var html = editor.$txt.html();
                    ctrl.$setViewValue(html);
                    html === '<p><br></p>' ? scope.isHtmlNull = true : scope.isHtmlNull = false;
                });
            };
            editor.config.menus = [
                'source',
                '|',
                'bold',
                'underline',
                'italic',
                'strikethrough',
                'eraser',
                'forecolor',
                'bgcolor',
                '|',
                'quote',
                'fontfamily',
                'fontsize',
                'head',
                'unorderlist',
                'orderlist',
                'alignleft',
                'aligncenter',
                'alignright',
                '|',
                'link',
                'unlink',
                'table',
                'video',
                '|',
                '|',
                'undo',
                'redo',
                'fullscreen'
            ];
            editor.config.printLog = false;
            editor.create();
        }
    };
}]);

/**
 * 包装清单内容编辑器
 */
angular.module('app').directive('packageEditor', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var editor = new wangEditor('packageEditor');
            editor.onchange = function () {
                scope.$apply(function () {
                    var html = editor.$txt.html();
                    ctrl.$setViewValue(html);
                    html === '<p><br></p>' ? scope.isHtmlNull = true : scope.isHtmlNull = false;
                });
            };
            editor.config.menus = [
                'source',
                '|',
                'bold',
                'underline',
                'italic',
                'strikethrough',
                'eraser',
                'forecolor',
                'bgcolor',
                '|',
                'quote',
                'fontfamily',
                'fontsize',
                'head',
                'unorderlist',
                'orderlist',
                'alignleft',
                'aligncenter',
                'alignright',
                '|',
                'link',
                'unlink',
                'table',
                'video',
                '|',
                '|',
                'undo',
                'redo',
                'fullscreen'
            ];
            editor.config.printLog = false;
            editor.create();
        }
    };
}]);


/*
 * 生成SKU表格
 */
angular.module('app').directive('createSkuTable', ['$timeout','$rootScope','Upload', function ($timeout,$rootScope,Upload) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            //SKU信息
            $timeout(function () {
                var t = [];
                $(".chk").bind("click", function () {
                    step.Creat_Table();
                });

                // 执行组合排列的函数
                function buildSku(array) {
                    var len = array.length;
                    // 当数组大于等于2个的时候
                    if (len >= 2) {
                        // 第一个数组的长度
                        var len1 = array[0].length;
                        // 第二个数组的长度
                        var len2 = array[1].length;
                        // 2个数组产生的组合数
                        var lenBoth = len1 * len2;
                        //  申明一个新数组,做数据暂存
                        var items = new Array(lenBoth);
                        // 申明新数组的索引
                        var index = 0;
                        // 2层嵌套循环,将组合放到新数组中
                        for (var i = 0; i < len1; i++) {
                            for (var j = 0; j < len2; j++) {
                                items[index] = array[0][i] + "," + array[1][j];
                                index++;
                            }
                        }
                        // 将新组合的数组并到原数组中
                        var newArr = new Array(len - 1);
                        for (var i = 2; i < array.length; i++) {
                            newArr[i - 1] = array[i];
                        }
                        newArr[0] = items;
                        // 执行回调
                        return buildSku(newArr);
                    } else {
                        return array[0];
                    }
                }

                var step = {
                    //SKU信息组合
                    Creat_Table: function () {
                        step.hebingFunction();
                        var SKUObj = $(".title");

                        //var skuCount = SKUObj.length;//
                        var arrayTile = []; //标题组数
                        var arrayInfor = []; //盛放每组选中的CheckBox值的对象
                        var arrayColumn = []; //指定列，用来合并哪些列
                        var skuObj = [];
                        var bCheck = true; //是否全选
                        var columnIndex = 0;
                        $.each(SKUObj, function (i) {
                            arrayColumn.push(columnIndex);
                            columnIndex++;
                            arrayTile.push(SKUObj.eq(i).html());
                            var itemName = "item" + i;
                            //选中的CHeckBox取值
                            var order = [];
                            var skuTemp = [];
                            $('.' + itemName).each(function (index, item) {
                                $(item).find('md-checkbox').each(function (index, item) {
                                    if ($(item).hasClass('md-checked')) {
                                        order.push($(this).attr('aria-label'));
                                        skuTemp.push($(this).attr('ng-value'));
                                    }
                                });
                            });

                            arrayInfor.push(order);
                            skuObj.push(skuTemp);
                            t = skuObj;
                            if (order.join() === "") {
                                bCheck = false;
                            }
                        });
                        //开始创建Table表
                        if (bCheck === true) {
                            var RowsCount = 0;
                            $("#createTable").html("");
                            var table = $("<table id=\"process\" class=\"attr-table\" border=\'1\'></table>");
                            table.appendTo($("#createTable"));
                            var thead = $("<thead></thead>");
                            thead.appendTo(table);
                            var trHead = $("<tr></tr>");
                            trHead.appendTo(thead);
                            //创建表头
                            $.each(arrayTile, function (index, item) {
                                var td = $("<th style='width: 100px'>" + item + "</th>");
                                td.appendTo(trHead);
                            });
                            var itemColumHead = $("<th  style=\"width:50px;\">价格</th><th style=\"width:50px;\">库存</th><th>图片</th> ");
                            itemColumHead.appendTo(trHead);
                            //var itemColumHead2 = $("<td >商家编码</td><td >商品条形码</td>");
                            //itemColumHead2.appendTo(trHead);
                            var tbody = $("<tbody></tbody>");
                            tbody.appendTo(table);
                            ////生成组合
                            //console.log(arrayInfor)
                            var zuheDate = step.doExchange(arrayInfor);
                            //console.log(zuheDate);
                            if (zuheDate.length > 0) {
                                //创建行
                                $.each(zuheDate, function (index, item) {
                                    console.log();
                                    var colorSkuID = '';
                                    var materialSkuID = '';
                                    var sizeSkuID = '';
                                    // console.log(scope.colorList);
                                    angular.forEach(scope.colorList, function (item1) {
                                        if (item.split(',')[0] === item1.value) {
                                            colorSkuID = item1.id;
                                        }
                                    });

                                    angular.forEach(scope.materialList, function (item1) {
                                        if (item.split(',')[1] === item1.value) {
                                            materialSkuID = item1.id;
                                        }
                                    });

                                    angular.forEach(scope.sizeList, function (item1) {
                                        if (item.split(',')[2] === item1.value) {
                                            sizeSkuID = item1.id;
                                        }
                                    });


                                    var td_array = item.split(",");
                                    var tr = $("<tr data-info=" + colorSkuID + "," + materialSkuID + "," + sizeSkuID + "></tr>");
                                    tr.appendTo(tbody);
                                    $.each(td_array, function (i, values) {
                                        var td = $("<td>" + values + "</td>");
                                        td.appendTo(tr);
                                    });
                                    var td1 = $("<td ><input type=\"text\" value=\"\" class='price' placeholder='请输入价格'></td>");
                                    td1.appendTo(tr);
                                    var td2 = $("<td ><input type=\"text\" value=\"\" class='repertory' placeholder='请输入库存'></td>");
                                    td2.appendTo(tr);
                                    var td3 = $("<td class='upload'><input type=\"file\" value=\"\" class='img' ng-change='uploadImg()'><img class='show-img' src='' style='width: 50px;height:50px;'></td>");
                                    td3.appendTo(tr);
                                    //var td3 = $("<td ><input name=\"Txt_NumberSon\" class=\"l-text\" type=\"text\" value=\"\"></td>");
                                    //td3.appendTo(tr);
                                    //var td4 = $("<td ><input name=\"Txt_SnSon\" class=\"l-text\" type=\"text\" value=\"\"></td>");
                                    //td4.appendTo(tr);

                                    $('tr td').find('.img').on('change',function (ev) {
                                        console.log(1);
                                        var imgElement=$(this).siblings();
                                        scope.$apply(function(){
                                           var fileread = ev.target.files[0];
                                            Upload.upload({
                                                url: $rootScope.baseURL + 'api/admin/uploadImage',
                                                data: {'uploadPath': 'product'},
                                                file: fileread
                                            }).success(function (data) {
                                                if (data.status === 200) {
                                                    imgElement.attr('src','../'+data.finalFileName);
                                                }
                                            })
                                        })
                                    })
                                });
                            }
                            //结束创建Table表
                            arrayColumn.pop(); //删除数组中最后一项
                            //合并单元格
                            $(table).mergeCell({
                                // 目前只有cols这么一个配置项, 用数组表示列的索引,从0开始
                                cols: arrayColumn
                            });
                        } else {
                            //未全选中,清除表格
                            document.getElementById('createTable').innerHTML = "";
                        }


                    },
                    //合并行
                    hebingFunction: function () {
                        $.fn.mergeCell = function (options) {
                            return this.each(function () {
                                var cols = options.cols;
                                for (var i = cols.length - 1; cols[i] !== undefined; i--) {
                                    // fixbug console调试
                                    // console.debug(cols[i]);
                                    mergeCell($(this), cols[i]);
                                }
                                dispose($(this));
                            });
                        };

                        function mergeCell($table, colIndex) {
                            $table.data('col-content', ''); // 存放单元格内容
                            $table.data('col-rowspan', 1); // 存放计算的rowspan值 默认为1
                            $table.data('col-td', $()); // 存放发现的第一个与前一行比较结果不同td(jQuery封装过的), 默认一个"空"的jquery对象
                            $table.data('trNum', $('tbody tr', $table).length); // 要处理表格的总行数, 用于最后一行做特殊处理时进行判断之用
                            // 进行"扫面"处理 关键是定位col-td, 和其对应的rowspan
                            $('tbody tr', $table).each(function (index) {
                                // td:eq中的colIndex即列索引
                                var $td = $('td:eq(' + colIndex + ')', this);
                                // 取出单元格的当前内容
                                var currentContent = $td.html();
                                // 第一次时走此分支
                                if ($table.data('col-content') === '') {
                                    $table.data('col-content', currentContent);
                                    $table.data('col-td', $td);
                                } else {
                                    // 上一行与当前行内容相同
                                    if ($table.data('col-content') === currentContent) {
                                        // 上一行与当前行内容相同则col-rowspan累加, 保存新值
                                        var rowspan = $table.data('col-rowspan') + 1;
                                        $table.data('col-rowspan', rowspan);
                                        // 值得注意的是 如果用了$td.remove()就会对其他列的处理造成影响
                                        $td.hide();
                                        // 最后一行的情况比较特殊一点
                                        // 比如最后2行 td中的内容是一样的, 那么到最后一行就应该把此时的col-td里保存的td设置rowspan
                                        if (++index === $table.data('trNum'))
                                            $table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
                                    } else { // 上一行与当前行内容不同
                                        // col-rowspan默认为1, 如果统计出的col-rowspan没有变化, 不处理
                                        if ($table.data('col-rowspan') !== 1) {
                                            $table.data('col-td').attr('rowspan', $table.data('col-rowspan'));
                                        }
                                        // 保存第一次出现不同内容的td, 和其内容, 重置col-rowspan
                                        $table.data('col-td', $td);
                                        $table.data('col-content', $td.html());
                                        $table.data('col-rowspan', 1);
                                    }
                                }
                            });
                        }

                        // 同样是个private函数 清理内存之用
                        function dispose($table) {
                            $table.removeData();
                        }
                    },
                    //组合数组
                    doExchange: function (doubleArrays) {
                        var len = doubleArrays.length;
                        if (len >= 2) {
                            var arr1 = doubleArrays[0];
                            var arr2 = doubleArrays[1];
                            var len1 = doubleArrays[0].length;
                            var len2 = doubleArrays[1].length;
                            var newlen = len1 * len2;
                            var temp = new Array(newlen);
                            var index = 0;
                            for (var i = 0; i < len1; i++) {
                                for (var j = 0; j < len2; j++) {
                                    temp[index] = arr1[i] + "," + arr2[j];
                                    index++;
                                }
                            }
                            var newArray = new Array(len - 1);
                            newArray[0] = temp;
                            if (len > 2) {
                                var _count = 1;
                                for (var i = 2; i < len; i++) {
                                    newArray[_count] = doubleArrays[i];
                                    _count++;
                                }
                            }
                            // console.log(newArray);
                            return step.doExchange(newArray);
                        } else {
                            return doubleArrays[0];
                        }
                    }
                }
                return step;
            }, 200);
        }
    }
}]);

/*
* 多图上传
* */
angular.module('app').directive('multiUploadImages', ['$mdToast', '$stateParams', '$timeout', '$rootScope', 'Upload',
    function ($mdToast, $stateParams, $timeout, $rootScope, Upload) {
        return {
            restrict: 'AE',
            replace: true,
            require: 'ngModel',
            scope: {
                filesize: '=',
                uploadpath: '='
            },
            templateUrl: 'template/upload-multi-image.html',
            link: function (scope, elem, attrs,ngModel) {
                scope.uploadedImageList = [];
                var totalFiles = 0;

                if ($stateParams.id > 0) {
                    ngModel.$render = function () {
                        //如果未上传图片则显示默认图
                        if (ngModel.$viewValue === null) {
                            //scope.uploadedImageList = 'build/images/icon_upload.svg';
                        } else {
                            scope.uploadedImageList = ngModel.$viewValue;
                        }
                    };
                }
                elem.find('input').bind('change', function (ev) {
                    scope.$apply(function () {
                        var fileRead = ev.target.files;
                        var totalFileSize = 0;
                        var uploadPath = attrs.uploadpath;
                        var allowfileSize = attrs.filesize;
                        totalFiles += fileRead.length;
                        angular.forEach(fileRead, function (files) {
                            var imgRead = new FileReader();
                            totalFileSize += files.size / 102400 / 10;

                            imgRead.addEventListener('load', function (ev) {
                                var picFiles = ev.target;
                                var img = new Image();
                                img.src = picFiles.result;
                                img.onload = function () {
                                    //编辑时获取数据库的列表图


                                    if (totalFileSize > allowfileSize) {
                                        $mdToast.show(
                                            $mdToast.simple()
                                                .textContent('上传文件大小不能超过' + allowfileSize + 'M!')
                                                .position('top right')
                                                .hideDelay(2000)
                                        );
                                    }
                                    else {
                                        scope.uploadProgressLoading = true;
                                        scope.isUploadValid = true;
                                        scope.per = 0;
                                        Upload.upload({
                                            url: $rootScope.baseURL + 'api/admin/uploadImage',
                                            data: {
                                                'uploadPath': uploadPath
                                            },
                                            file: files
                                        }).progress(function (evt) {
                                            scope.per = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                        }).success(function (data) {
                                            if (data.status === 200) {
                                                scope.uploadedImageList.push(data.finalFileName);
                                                scope.uploadProgressLoading = false;
                                                scope.isUploadValid = false;
                                            }
                                            if (scope.uploadedImageList.length === fileRead.length) {
                                                $mdToast.show(
                                                    $mdToast.simple()
                                                        .textContent(fileRead.length + '张图片上传完成！')
                                                        .position('top right')
                                                        .hideDelay(2000)
                                                );
                                            }
                                            scope.$emit('uploaded', scope.uploadedImageList);
                                            scope.$emit('imgLength', totalFiles);
                                            console.log(scope.uploadedImageList.length + '/' + totalFiles);
                                        });
                                    }
                                }
                            });
                            imgRead.readAsDataURL(files);
                        });

                        //删除临时图片
                        scope.deleteTempImage = function (imgUrl) {
                            alert();
                            console.log('删除前:' + scope.uploadedImageList);
                            scope.uploadedImageList.splice($.inArray(imgUrl, scope.uploadedImageList), 1);
                            console.log('删除后:' + scope.uploadedImageList);
                            scope.$emit('uploaded', scope.uploadedImageList);
                        }
                    });
                });
            }
        }
    }]);

/*
 * 编辑商品属性
 */
angular.module('app').directive('editAttr', ['$timeout', '$state', 'goodsService', function ($timeout, $state, goodsService) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            //显示编辑
            $(el).find('.icon-edit').on('click', function () {
                $(this).parent().parent().find('.edit-container').show();
                $(this).parent().parent().find('.edit-container').find('input').val($(this).parent().siblings('.attr-name').html());
            });

            //取消编辑
            $(el).find('.btn-cancel').on('click', function () {
                $(this).parent().parent().hide();
            });

            //更新属性
            $(el).find('.btn-update').on('click', function () {
                var updateID = $(this).data('id');
                var updateVal = $(this).siblings('input').val();
                var hideObj = $(this).parent().parent();
                var modelVal = $(this).parent().parent().siblings('.attr-name');
                goodsService.updateAttr(updateID, updateVal).then(function (response) {
                    if (response.status === 200) {
                        scope.toast('属性修改成功', 'success');
                        hideObj.hide();
                        modelVal.html(updateVal);

                    } else if (response.status === 400) {
                        scope.toast('已存在同名属性', 'warning');
                    }
                }, function () {
                    scope.toast('属性修改是失败', 'error');
                })
            });
        }
    }
}]);


/*
* 首页订单分布图表
**/
angular.module('app').directive('orderDistributionChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            require('highcharts/modules/drilldown')(highCharts);
            scope.$on('orderData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('orderDistributionContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: null
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y:.1f}%'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
                        },
                        series: [{
                            name: '订单占比',
                            colorByPoint: true,
                            data: data.data
                        }],
                        drilldown: {
                            series:data.series
                        }
                    })
                })
            });
        }
    }
}]);

/*
* 实时收入图表
**/
angular.module('app').directive('liveIncomeChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('liveIncome', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('liveIncomeContainer', {
                        chart: {
                            type: 'spline',
                            height: 200
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        yAxis: {
                            title: {
                                text: null
                            },
                            min: 0,
                            minorGridLineWidth: 0,
                            gridLineWidth: 0,
                            alternateGridColor: null
                        },
                        tooltip: {
                            valueSuffix: '元'
                        },
                        plotOptions: {
                            spline: {
                                lineWidth: 4,
                                states: {
                                    hover: {
                                        lineWidth: 5
                                    }
                                },
                                marker: {
                                    enabled: false
                                },
                                pointInterval: 3600000,
                                pointStart: Date.UTC(2017,9,23)
                            }
                        },
                        series: [{
                            name: '今日实时收入',
                            data: data[0].data
                        },
                            {
                                name: '昨日实时收入',
                                data: data[1].data
                            }],
                        navigation: {
                            menuItemStyle: {
                                fontSize: '10px'
                            }
                        }
                    })
                })
            })

        }
    }
}]);

/*
* 7天收入图表
**/
angular.module('app').directive('propertyChart', function () {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('fluxData', function (ev, data) {
                highCharts.chart('propertyDataContainer', {
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '7天流量统计'
                    },
                    xAxis: {
                        categories: ['一月', '二月', '三月', '四月', '五月', '六月']
                    },
                    yAxis: {
                        title: {
                            text: '流量数'
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            }
                        }
                    },
                    series: data,
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 1920
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                })
            })
        }
    }
});

/*
* 7天店铺流量图表
**/
angular.module('app').directive('fluxChart', function () {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('fluxData', function (ev, data) {
                highCharts.chart('fluxDataContainer', {
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: ['一月', '二月', '三月', '四月', '五月', '六月']
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            }
                        }
                    },
                    series: data,
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 1920
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                })
            })
        }
    }
});

/*
* 数据概况----10天店铺流量图表
**/
angular.module('app').directive('tenDaysFluxChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('tenDaysUvData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('tenDaysFluxDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: '10天店铺流量统计'
                        },
                        xAxis: {
                            type:'category',
                            categories: data[0].time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: '店铺流量',
                            data: data[0].data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            })
        }
    }
}]);

/*
* 数据概况----7天店铺收入图表
**/
angular.module('app').directive('sevenDaysIncomeChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('sevanDaysIcomeData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('sevenDaysIncomeDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: '7天店铺收入统计'
                        },
                        xAxis: {
                            type:'category',
                            categories: data[0].time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: data[0].name,
                            data: data[0].data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            })
        }
    }
}]);


/*
* 资产概况----店铺收入图表
**/
angular.module('app').directive('incomeAllDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('incomeData', function (ev, data) {
                console.log(data);
                $timeout(function () {
                    highCharts.chart('incomeAllDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: data.name
                        },
                        xAxis: {
                            type:'category',
                            categories: data.time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: '店铺收入',
                            data: data.data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            });
        }
    }
}]);

/*
* 店铺订单图表
**/
angular.module('app').directive('orderAllDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            // scope.$on('fluxData', function (ev, data) {
            //
            // })
            $timeout(function () {
                highCharts.chart('incomeAllDataContainer', {
                    chart: {
                        height: 400
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: ['2017-09-10', '2017-09-11', '2017-09-12', '2017-09-13', '2017-09-14', '2017-09-15', '2017-09-16']
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                            marker: {
                                radius: 5,
                                symbol: 'diamond'
                            }
                        }
                    },
                    series: [{
                        name: '店铺流量',
                        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133]
                    }],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 1920
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                })
            })
        }
    }
}]);

/*
* 数据概况----7天店铺支付转化率
*/
angular.module('app').directive('sevenDaysPayTransformChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('sevenDaysSalesData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('sevenDaysPayTransformDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: data[1].name
                        },
                        xAxis: {
                            type:'category',
                            categories: data[1].time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: '支付转化率',
                            data: data[1].data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            });
        }
    }
}]);

/*
* 店铺流量
*/
angular.module('app').directive('fluxAllDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('uvChartData', function (ev, data) {
                console.log(data);
                $timeout(function () {
                    highCharts.chart('fluxAllDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: data[0].name
                        },
                        xAxis: {
                            type:'category',
                            categories: data[0].time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: data[0].name,
                            data: data[0].data
                        }, {
                            name: data[1].name,
                            data: data[1].data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            });
        }
    }
}]);

/*
* 来源分析----访客时段图表
**/
angular.module('app').directive('visitorDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('uvByTimeData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('visitorDataContainer', {

                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: data[0].name
                        },
                        xAxis: {
                            type:'category',
                            categories: data[0].time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: '访客率',
                            data: data[0].data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            });
        }
    }
}]);

/*
* 7天店铺订单图表
**/
angular.module('app').directive('sevenDaysOrderChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('sevenDaysSalesData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('sevenDaysOrderDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'column',
                            height: 400
                        },
                        title: {
                            text: '7天店铺订单统计'
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: null
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y} 笔</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: '订单量',
                            data: data[0].data
                        }],
                        xAxis: {
                            categories: data[0].time
                        }
                    })
                })
            });
        }
    }
}]);


/*
* 来源分析----访客地域分布图表
*/
angular.module('app').directive('areaDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts/highstock');
            require('highcharts/modules/map')(highCharts);
            require('highcharts/modules/data')(highCharts);

            highCharts.maps["cn/china"] = {
                "title": "中国",
                "version": "0.0.3",
                "type": "FeatureCollection",
                "copyright": "Copyright (c) 2017 Jianshu Technology Co.,LTD",
                "copyrightShort": "Jianshu Technology",
                "copyrightUrl": "https://jianshukeji.com",
                "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG:3415"}},
                "hc-transform": {
                    "default": {
                        "crs": "+proj=lcc +lat_1=18 +lat_2=24 +lat_0=21 +lon_0=114 +x_0=500000 +y_0=500000 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
                        "scale": 0.000129831107685,
                        "jsonres": 15.5,
                        "jsonmarginX": -999,
                        "jsonmarginY": 9851,
                        "xoffset": -3139937.49309,
                        "yoffset": 4358972.7486
                    }
                },
                "features": [{
                    "type": "Feature",
                    "properties": {
                        "adcode": 110000,
                        "name": "北京",
                        "center": [116.405285, 39.904989],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 0,
                        "fullname": "北京市",
                        "filename": "beijing",
                        "parent": "中国",
                        "areacode": 110000,
                        "longitude": 116.405285,
                        "latitude": 39.904989,
                        "cp": [6763, 6381],
                        "drilldown": "beijing"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6909, 6426], [6890, 6423], [6890, 6423], [6890, 6423], [6889, 6423], [6889, 6423], [6890, 6423], [6871, 6412], [6858, 6418], [6832, 6413], [6827, 6397], [6833, 6378], [6858, 6366], [6863, 6353], [6854, 6349], [6855, 6331], [6839, 6314], [6821, 6311], [6821, 6311], [6822, 6310], [6822, 6310], [6823, 6309], [6823, 6309], [6819, 6307], [6819, 6307], [6801, 6314], [6786, 6309], [6771, 6292], [6770, 6272], [6752, 6275], [6736, 6289], [6728, 6306], [6709, 6303], [6709, 6303], [6683, 6299], [6674, 6308], [6674, 6308], [6664, 6297], [6664, 6297], [6663, 6296], [6663, 6296], [6658, 6288], [6658, 6288], [6646, 6287], [6646, 6287], [6643, 6293], [6643, 6293], [6643, 6293], [6643, 6293], [6643, 6294], [6643, 6294], [6640, 6294], [6640, 6294], [6640, 6294], [6640, 6294], [6640, 6296], [6640, 6296], [6639, 6298], [6639, 6298], [6636, 6302], [6635, 6302], [6635, 6302], [6636, 6302], [6635, 6302], [6635, 6302], [6635, 6302], [6615, 6305], [6595, 6319], [6595, 6319], [6599, 6330], [6599, 6330], [6588, 6351], [6588, 6351], [6611, 6358], [6601, 6363], [6603, 6378], [6585, 6390], [6590, 6408], [6616, 6430], [6641, 6433], [6648, 6444], [6662, 6437], [6670, 6458], [6683, 6465], [6673, 6486], [6663, 6489], [6663, 6489], [6648, 6507], [6643, 6530], [6671, 6549], [6688, 6541], [6703, 6551], [6727, 6579], [6732, 6591], [6771, 6587], [6747, 6618], [6772, 6616], [6769, 6636], [6780, 6637], [6780, 6637], [6794, 6635], [6797, 6654], [6810, 6652], [6809, 6635], [6818, 6617], [6842, 6603], [6862, 6573], [6888, 6574], [6920, 6563], [6938, 6569], [6958, 6567], [6939, 6540], [6931, 6545], [6908, 6527], [6910, 6494], [6926, 6473], [6926, 6473], [6926, 6473], [6926, 6473], [6941, 6461], [6937, 6447], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6447], [6933, 6438], [6909, 6426]]]]
                    },
                    "id": "CN.110000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 120000,
                        "name": "天津",
                        "center": [117.190182, 39.125596],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 1,
                        "fullname": "天津市",
                        "filename": "tianjin",
                        "parent": "中国",
                        "areacode": 120000,
                        "longitude": 117.190182,
                        "latitude": 39.125596,
                        "cp": [6910, 6200],
                        "drilldown": "tianjin"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6909, 6426], [6933, 6438], [6937, 6447], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6447], [6941, 6461], [6952, 6467], [6974, 6459], [6989, 6437], [6989, 6437], [6989, 6437], [6989, 6437], [7001, 6428], [7001, 6428], [7009, 6426], [7009, 6426], [7014, 6401], [6983, 6401], [6978, 6407], [6965, 6386], [6965, 6386], [6970, 6368], [6970, 6368], [6970, 6365], [6970, 6365], [6978, 6343], [6990, 6337], [6994, 6322], [6986, 6314], [7007, 6304], [7007, 6304], [7009, 6311], [7031, 6313], [7044, 6308], [7033, 6280], [7029, 6250], [7052, 6247], [7052, 6247], [7054, 6244], [7054, 6244], [7061, 6241], [7061, 6241], [7062, 6242], [7062, 6242], [7062, 6242], [7062, 6242], [7065, 6226], [7035, 6202], [7029, 6186], [7033, 6163], [7041, 6161], [7032, 6139], [7019, 6142], [6995, 6132], [6995, 6122], [7013, 6115], [7011, 6097], [6995, 6084], [6965, 6081], [6950, 6071], [6924, 6066], [6916, 6086], [6916, 6086], [6910, 6080], [6910, 6080], [6895, 6073], [6885, 6101], [6868, 6096], [6867, 6096], [6867, 6096], [6868, 6096], [6868, 6096], [6868, 6096], [6854, 6094], [6851, 6108], [6834, 6108], [6828, 6118], [6822, 6153], [6836, 6181], [6836, 6181], [6841, 6181], [6841, 6181], [6859, 6195], [6859, 6195], [6859, 6195], [6859, 6195], [6850, 6206], [6850, 6206], [6855, 6222], [6850, 6253], [6836, 6274], [6839, 6314], [6855, 6331], [6857, 6335], [6857, 6335], [6870, 6320], [6870, 6320], [6896, 6315], [6905, 6322], [6903, 6339], [6903, 6339], [6910, 6350], [6900, 6363], [6914, 6371], [6899, 6377], [6899, 6393], [6907, 6404], [6909, 6426]]]]
                    },
                    "id": "CN.120000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 130000,
                        "name": "河北",
                        "center": [114.502461, 38.045474],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 2,
                        "fullname": "河北省",
                        "filename": "hebei",
                        "parent": "中国",
                        "areacode": 130000,
                        "longitude": 114.502461,
                        "latitude": 38.045474,
                        "cp": [6418, 5941],
                        "drilldown": "hebei"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6941, 6461], [6926, 6473], [6926, 6473], [6926, 6473], [6926, 6473], [6910, 6494], [6908, 6527], [6931, 6545], [6939, 6540], [6958, 6567], [6938, 6569], [6920, 6563], [6888, 6574], [6862, 6573], [6842, 6603], [6818, 6617], [6809, 6635], [6810, 6652], [6797, 6654], [6794, 6635], [6780, 6637], [6780, 6637], [6769, 6636], [6772, 6616], [6747, 6618], [6771, 6587], [6732, 6591], [6727, 6579], [6703, 6551], [6688, 6541], [6671, 6549], [6643, 6530], [6648, 6507], [6663, 6489], [6663, 6489], [6673, 6486], [6683, 6465], [6670, 6458], [6662, 6437], [6648, 6444], [6641, 6433], [6616, 6430], [6590, 6408], [6585, 6390], [6603, 6378], [6601, 6363], [6611, 6358], [6588, 6351], [6588, 6351], [6599, 6330], [6599, 6330], [6595, 6319], [6595, 6319], [6615, 6305], [6635, 6302], [6635, 6302], [6635, 6302], [6636, 6302], [6635, 6302], [6635, 6302], [6636, 6302], [6639, 6298], [6639, 6298], [6640, 6296], [6640, 6296], [6640, 6294], [6640, 6294], [6640, 6294], [6640, 6294], [6643, 6294], [6643, 6294], [6643, 6293], [6643, 6293], [6643, 6293], [6643, 6293], [6646, 6287], [6646, 6287], [6658, 6288], [6658, 6288], [6663, 6296], [6663, 6296], [6664, 6297], [6664, 6297], [6674, 6308], [6674, 6308], [6683, 6299], [6709, 6303], [6709, 6303], [6728, 6306], [6736, 6289], [6752, 6275], [6770, 6272], [6771, 6292], [6786, 6309], [6801, 6314], [6819, 6307], [6819, 6307], [6823, 6309], [6823, 6309], [6822, 6310], [6822, 6310], [6821, 6311], [6821, 6311], [6839, 6314], [6836, 6274], [6850, 6253], [6855, 6222], [6850, 6206], [6850, 6206], [6859, 6195], [6859, 6195], [6859, 6195], [6859, 6195], [6841, 6181], [6841, 6181], [6836, 6181], [6836, 6181], [6822, 6153], [6828, 6118], [6834, 6108], [6851, 6108], [6854, 6094], [6868, 6096], [6868, 6096], [6868, 6096], [6867, 6096], [6867, 6096], [6868, 6096], [6885, 6101], [6895, 6073], [6910, 6080], [6910, 6080], [6916, 6086], [6916, 6086], [6924, 6066], [6950, 6071], [6965, 6081], [6995, 6084], [6995, 6065], [7022, 6026], [7051, 6030], [7044, 6009], [7028, 5992], [7022, 5970], [7009, 5956], [6988, 5954], [6975, 5924], [6962, 5903], [6944, 5905], [6930, 5899], [6898, 5900], [6885, 5896], [6841, 5898], [6830, 5875], [6777, 5811], [6767, 5822], [6767, 5822], [6767, 5822], [6767, 5822], [6759, 5835], [6751, 5830], [6748, 5809], [6741, 5814], [6741, 5814], [6739, 5800], [6750, 5794], [6741, 5784], [6728, 5789], [6707, 5785], [6694, 5775], [6692, 5755], [6681, 5747], [6673, 5717], [6656, 5697], [6660, 5692], [6645, 5672], [6640, 5654], [6602, 5643], [6581, 5610], [6565, 5579], [6570, 5573], [6570, 5573], [6581, 5538], [6600, 5527], [6600, 5527], [6604, 5501], [6572, 5487], [6551, 5515], [6551, 5515], [6525, 5507], [6513, 5482], [6497, 5478], [6497, 5498], [6436, 5496], [6390, 5525], [6357, 5522], [6357, 5522], [6337, 5529], [6336, 5542], [6322, 5548], [6309, 5538], [6303, 5547], [6292, 5542], [6275, 5549], [6271, 5563], [6242, 5580], [6248, 5596], [6228, 5617], [6232, 5637], [6266, 5648], [6269, 5670], [6283, 5663], [6281, 5687], [6287, 5694], [6280, 5715], [6283, 5732], [6294, 5736], [6307, 5769], [6328, 5796], [6332, 5812], [6348, 5837], [6349, 5860], [6324, 5862], [6334, 5875], [6321, 5887], [6316, 5911], [6302, 5928], [6303, 5943], [6290, 5956], [6293, 5970], [6274, 5971], [6272, 5980], [6246, 5986], [6238, 6020], [6249, 6038], [6245, 6061], [6254, 6081], [6271, 6083], [6274, 6097], [6296, 6108], [6299, 6124], [6284, 6138], [6283, 6155], [6307, 6180], [6335, 6196], [6345, 6177], [6389, 6182], [6397, 6206], [6413, 6215], [6402, 6222], [6413, 6247], [6411, 6261], [6429, 6300], [6400, 6318], [6397, 6369], [6366, 6366], [6357, 6376], [6334, 6380], [6329, 6398], [6309, 6403], [6317, 6408], [6323, 6427], [6334, 6414], [6344, 6424], [6339, 6440], [6339, 6440], [6368, 6447], [6372, 6456], [6411, 6464], [6422, 6482], [6406, 6489], [6382, 6489], [6374, 6513], [6377, 6540], [6363, 6550], [6350, 6575], [6333, 6597], [6339, 6604], [6321, 6634], [6293, 6661], [6311, 6679], [6325, 6683], [6312, 6715], [6315, 6731], [6302, 6736], [6313, 6753], [6343, 6766], [6367, 6760], [6362, 6827], [6388, 6864], [6417, 6870], [6409, 6886], [6417, 6903], [6462, 6905], [6474, 6912], [6487, 6881], [6491, 6835], [6481, 6830], [6487, 6819], [6486, 6790], [6480, 6782], [6523, 6787], [6550, 6777], [6573, 6782], [6562, 6804], [6622, 6837], [6650, 6857], [6669, 6866], [6687, 6825], [6702, 6825], [6706, 6846], [6719, 6846], [6725, 6865], [6739, 6879], [6757, 6878], [6753, 6868], [6775, 6874], [6784, 6863], [6814, 6869], [6841, 6886], [6842, 6904], [6824, 6929], [6845, 6927], [6840, 6969], [6844, 6976], [6844, 6976], [6847, 6979], [6847, 6979], [6848, 6979], [6848, 6979], [6848, 6979], [6848, 6979], [6849, 6980], [6849, 6980], [6850, 6981], [6850, 6981], [6856, 6984], [6856, 6984], [6858, 6984], [6858, 6984], [6859, 6984], [6859, 6984], [6860, 6984], [6860, 6984], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6884, 6995], [6884, 6995], [6886, 6995], [6886, 6995], [6907, 6997], [6907, 6997], [6934, 6997], [6929, 7007], [6929, 7007], [6937, 7024], [6951, 7028], [6951, 7028], [6982, 7024], [6998, 7033], [7016, 7008], [7042, 6981], [7050, 6957], [7036, 6941], [7060, 6926], [7058, 6911], [7068, 6906], [7062, 6894], [7076, 6894], [7079, 6906], [7094, 6899], [7083, 6892], [7097, 6884], [7090, 6870], [7103, 6857], [7095, 6832], [7072, 6842], [7066, 6824], [7082, 6801], [7085, 6787], [7099, 6784], [7093, 6760], [7107, 6750], [7108, 6729], [7138, 6733], [7167, 6733], [7179, 6728], [7197, 6740], [7206, 6723], [7219, 6725], [7261, 6720], [7268, 6728], [7270, 6720], [7249, 6685], [7234, 6668], [7220, 6670], [7219, 6656], [7230, 6654], [7224, 6642], [7224, 6642], [7210, 6642], [7202, 6603], [7213, 6598], [7240, 6572], [7263, 6577], [7260, 6557], [7286, 6542], [7334, 6546], [7340, 6528], [7339, 6507], [7349, 6487], [7347, 6471], [7369, 6468], [7368, 6444], [7376, 6431], [7376, 6431], [7376, 6430], [7376, 6430], [7383, 6431], [7383, 6431], [7389, 6424], [7389, 6424], [7389, 6420], [7389, 6420], [7390, 6417], [7379, 6408], [7334, 6391], [7334, 6372], [7321, 6372], [7302, 6351], [7288, 6298], [7297, 6278], [7275, 6267], [7258, 6236], [7232, 6211], [7233, 6220], [7198, 6209], [7175, 6214], [7156, 6198], [7170, 6170], [7150, 6155], [7128, 6169], [7126, 6179], [7100, 6183], [7080, 6218], [7065, 6226], [7062, 6242], [7062, 6242], [7062, 6242], [7062, 6242], [7061, 6241], [7061, 6241], [7054, 6244], [7054, 6244], [7052, 6247], [7052, 6247], [7029, 6250], [7033, 6280], [7044, 6308], [7031, 6313], [7009, 6311], [7007, 6304], [7007, 6304], [6986, 6314], [6994, 6322], [6990, 6337], [6978, 6343], [6970, 6365], [6970, 6365], [6970, 6368], [6970, 6368], [6965, 6386], [6965, 6386], [6978, 6407], [6983, 6401], [7014, 6401], [7009, 6426], [7009, 6426], [7001, 6428], [7001, 6428], [6989, 6437], [6989, 6437], [6989, 6437], [6989, 6437], [6974, 6459], [6952, 6467], [6941, 6461]]], [[[6855, 6331], [6854, 6349], [6863, 6353], [6858, 6366], [6833, 6378], [6827, 6397], [6832, 6413], [6858, 6418], [6871, 6412], [6890, 6423], [6889, 6423], [6889, 6423], [6890, 6423], [6890, 6423], [6890, 6423], [6909, 6426], [6907, 6404], [6899, 6393], [6899, 6377], [6914, 6371], [6900, 6363], [6910, 6350], [6903, 6339], [6903, 6339], [6905, 6322], [6896, 6315], [6870, 6320], [6870, 6320], [6857, 6335], [6857, 6335], [6855, 6331]]]]
                    },
                    "id": "CN.130000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 140000,
                        "name": "山西",
                        "center": [112.549248, 37.857014],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 3,
                        "fullname": "山西省",
                        "filename": "shanxi",
                        "parent": "中国",
                        "areacode": 140000,
                        "longitude": 112.549248,
                        "latitude": 37.857014,
                        "cp": [6057, 5898],
                        "drilldown": "shanxi"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6275, 5549], [6272, 5526], [6260, 5505], [6268, 5472], [6257, 5463], [6261, 5428], [6251, 5419], [6246, 5381], [6228, 5355], [6196, 5346], [6193, 5333], [6173, 5339], [6160, 5312], [6136, 5319], [6135, 5304], [6120, 5292], [6102, 5295], [6092, 5283], [6066, 5297], [6068, 5288], [6045, 5286], [5959, 5301], [5962, 5287], [5959, 5250], [5928, 5256], [5884, 5235], [5865, 5202], [5823, 5200], [5801, 5191], [5785, 5195], [5779, 5184], [5750, 5173], [5743, 5179], [5734, 5158], [5709, 5161], [5701, 5151], [5667, 5146], [5656, 5154], [5638, 5151], [5625, 5153], [5612, 5170], [5612, 5198], [5617, 5228], [5630, 5246], [5645, 5305], [5655, 5318], [5661, 5337], [5670, 5344], [5687, 5387], [5681, 5403], [5677, 5444], [5670, 5445], [5659, 5511], [5665, 5530], [5662, 5549], [5671, 5585], [5671, 5607], [5652, 5630], [5662, 5644], [5657, 5656], [5659, 5695], [5652, 5710], [5663, 5706], [5681, 5736], [5710, 5770], [5711, 5785], [5699, 5790], [5702, 5805], [5721, 5808], [5731, 5835], [5732, 5857], [5715, 5868], [5725, 5876], [5708, 5891], [5695, 5918], [5682, 5926], [5679, 5945], [5681, 5982], [5692, 5987], [5694, 6006], [5710, 6009], [5726, 6022], [5732, 6039], [5750, 6042], [5759, 6072], [5751, 6080], [5776, 6134], [5771, 6163], [5801, 6184], [5806, 6205], [5822, 6240], [5800, 6255], [5808, 6269], [5839, 6267], [5854, 6286], [5862, 6316], [5870, 6324], [5896, 6319], [5921, 6306], [5932, 6313], [5948, 6311], [5956, 6354], [6014, 6449], [6019, 6463], [6045, 6473], [6077, 6457], [6094, 6441], [6116, 6449], [6125, 6478], [6190, 6498], [6201, 6476], [6246, 6483], [6288, 6523], [6299, 6508], [6316, 6522], [6337, 6526], [6333, 6544], [6339, 6572], [6350, 6575], [6363, 6550], [6377, 6540], [6374, 6513], [6382, 6489], [6406, 6489], [6422, 6482], [6411, 6464], [6372, 6456], [6368, 6447], [6339, 6440], [6339, 6440], [6344, 6424], [6334, 6414], [6323, 6427], [6317, 6408], [6309, 6403], [6329, 6398], [6334, 6380], [6357, 6376], [6366, 6366], [6397, 6369], [6400, 6318], [6429, 6300], [6411, 6261], [6413, 6247], [6402, 6222], [6413, 6215], [6397, 6206], [6389, 6182], [6345, 6177], [6335, 6196], [6307, 6180], [6283, 6155], [6284, 6138], [6299, 6124], [6296, 6108], [6274, 6097], [6271, 6083], [6254, 6081], [6245, 6061], [6249, 6038], [6238, 6020], [6246, 5986], [6272, 5980], [6274, 5971], [6293, 5970], [6290, 5956], [6303, 5943], [6302, 5928], [6316, 5911], [6321, 5887], [6334, 5875], [6324, 5862], [6349, 5860], [6348, 5837], [6332, 5812], [6328, 5796], [6307, 5769], [6294, 5736], [6283, 5732], [6280, 5715], [6287, 5694], [6281, 5687], [6283, 5663], [6269, 5670], [6266, 5648], [6232, 5637], [6228, 5617], [6248, 5596], [6242, 5580], [6271, 5563], [6275, 5549]]]]
                    },
                    "id": "CN.140000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 150000,
                        "name": "内蒙古",
                        "center": [111.670801, 40.818311],
                        "childrenNum": 12,
                        "level": "province",
                        "subFeatureIndex": 4,
                        "fullname": "内蒙古自治区",
                        "filename": "neimenggu",
                        "parent": "中国",
                        "areacode": 150000,
                        "longitude": 111.670801,
                        "latitude": 40.818311,
                        "cp": [5904, 6597],
                        "drilldown": "neimenggu"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[8041, 7259], [8035, 7233], [8037, 7213], [8023, 7169], [8013, 7174], [8013, 7174], [8005, 7177], [7968, 7163], [7955, 7146], [7954, 7130], [7964, 7124], [7935, 7107], [7905, 7106], [7895, 7094], [7887, 7101], [7887, 7101], [7877, 7108], [7858, 7104], [7847, 7116], [7824, 7119], [7809, 7115], [7814, 7102], [7828, 7103], [7818, 7080], [7809, 7076], [7784, 7090], [7785, 7079], [7761, 7084], [7738, 7077], [7733, 7048], [7692, 7014], [7680, 7028], [7642, 7021], [7627, 7011], [7627, 7011], [7624, 6999], [7587, 6965], [7563, 6971], [7538, 6955], [7530, 6956], [7509, 6938], [7502, 6941], [7481, 6925], [7480, 6904], [7466, 6898], [7434, 6862], [7419, 6825], [7408, 6827], [7410, 6843], [7398, 6872], [7369, 6928], [7370, 6947], [7351, 6946], [7315, 6964], [7319, 6980], [7307, 6987], [7292, 6967], [7269, 6956], [7261, 6940], [7276, 6921], [7288, 6914], [7278, 6885], [7281, 6861], [7274, 6839], [7278, 6810], [7298, 6795], [7288, 6789], [7297, 6775], [7292, 6754], [7279, 6749], [7284, 6732], [7268, 6728], [7261, 6720], [7219, 6725], [7206, 6723], [7197, 6740], [7179, 6728], [7167, 6733], [7138, 6733], [7108, 6729], [7107, 6750], [7093, 6760], [7099, 6784], [7085, 6787], [7082, 6801], [7066, 6824], [7072, 6842], [7095, 6832], [7103, 6857], [7090, 6870], [7097, 6884], [7083, 6892], [7094, 6899], [7079, 6906], [7076, 6894], [7062, 6894], [7068, 6906], [7058, 6911], [7060, 6926], [7036, 6941], [7050, 6957], [7042, 6981], [7016, 7008], [6998, 7033], [6982, 7024], [6951, 7028], [6951, 7028], [6937, 7024], [6929, 7007], [6929, 7007], [6934, 6997], [6907, 6997], [6907, 6997], [6886, 6995], [6886, 6995], [6884, 6995], [6884, 6995], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6860, 6984], [6860, 6984], [6859, 6984], [6859, 6984], [6858, 6984], [6858, 6984], [6856, 6984], [6856, 6984], [6850, 6981], [6850, 6981], [6849, 6980], [6849, 6980], [6848, 6979], [6848, 6979], [6848, 6979], [6848, 6979], [6847, 6979], [6847, 6979], [6844, 6976], [6844, 6976], [6840, 6969], [6845, 6927], [6824, 6929], [6842, 6904], [6841, 6886], [6814, 6869], [6784, 6863], [6775, 6874], [6753, 6868], [6757, 6878], [6739, 6879], [6725, 6865], [6719, 6846], [6706, 6846], [6702, 6825], [6687, 6825], [6669, 6866], [6650, 6857], [6622, 6837], [6562, 6804], [6573, 6782], [6550, 6777], [6523, 6787], [6480, 6782], [6486, 6790], [6487, 6819], [6481, 6830], [6491, 6835], [6487, 6881], [6474, 6912], [6462, 6905], [6417, 6903], [6409, 6886], [6417, 6870], [6388, 6864], [6362, 6827], [6367, 6760], [6343, 6766], [6313, 6753], [6302, 6736], [6315, 6731], [6312, 6715], [6325, 6683], [6311, 6679], [6293, 6661], [6321, 6634], [6339, 6604], [6333, 6597], [6350, 6575], [6339, 6572], [6333, 6544], [6337, 6526], [6316, 6522], [6299, 6508], [6288, 6523], [6246, 6483], [6201, 6476], [6190, 6498], [6125, 6478], [6116, 6449], [6094, 6441], [6077, 6457], [6045, 6473], [6019, 6463], [6014, 6449], [5956, 6354], [5948, 6311], [5932, 6313], [5921, 6306], [5896, 6319], [5870, 6324], [5862, 6316], [5854, 6286], [5839, 6267], [5808, 6269], [5800, 6255], [5789, 6264], [5805, 6294], [5802, 6307], [5758, 6290], [5729, 6253], [5722, 6235], [5704, 6236], [5691, 6261], [5674, 6261], [5665, 6245], [5639, 6272], [5621, 6280], [5633, 6239], [5586, 6219], [5530, 6171], [5533, 6160], [5522, 6141], [5508, 6130], [5501, 6137], [5481, 6111], [5469, 6107], [5473, 6089], [5457, 6089], [5438, 6065], [5414, 6045], [5391, 5993], [5396, 5981], [5415, 5965], [5404, 5937], [5389, 5926], [5378, 5952], [5364, 5957], [5369, 5943], [5363, 5930], [5363, 5895], [5358, 5872], [5327, 5866], [5312, 5875], [5295, 5867], [5270, 5865], [5254, 5870], [5238, 5862], [5218, 5869], [5211, 5901], [5150, 5922], [5122, 5942], [5109, 5941], [5113, 5953], [5093, 5976], [5068, 5993], [5036, 5986], [4991, 6001], [4951, 6025], [4940, 6037], [4962, 6053], [4972, 6071], [4976, 6102], [4986, 6129], [5033, 6179], [5037, 6206], [5017, 6219], [5007, 6245], [5010, 6269], [5000, 6284], [4988, 6279], [4973, 6284], [4954, 6260], [4936, 6266], [4914, 6262], [4912, 6233], [4887, 6236], [4877, 6220], [4869, 6193], [4852, 6180], [4858, 6172], [4837, 6153], [4838, 6139], [4827, 6118], [4831, 6107], [4818, 6054], [4826, 6038], [4808, 6013], [4807, 5989], [4818, 5969], [4809, 5955], [4809, 5937], [4800, 5923], [4775, 5919], [4769, 5901], [4717, 5904], [4678, 5890], [4661, 5879], [4632, 5877], [4619, 5871], [4548, 5869], [4546, 5859], [4523, 5851], [4503, 5848], [4462, 5887], [4415, 5941], [4365, 5963], [4361, 6004], [4363, 6016], [4394, 6030], [4391, 6059], [4376, 6089], [4461, 6140], [4499, 6197], [4522, 6206], [4532, 6239], [4527, 6255], [4505, 6291], [4515, 6319], [4493, 6329], [4470, 6332], [4424, 6317], [4378, 6307], [4312, 6257], [4239, 6279], [4214, 6301], [4181, 6288], [4097, 6271], [4113, 6248], [4138, 6221], [4112, 6203], [4080, 6171], [4062, 6179], [4047, 6172], [4041, 6186], [3996, 6211], [4002, 6221], [3985, 6225], [3979, 6245], [3986, 6263], [3965, 6254], [3937, 6249], [3937, 6263], [3914, 6270], [3921, 6288], [3919, 6311], [3923, 6359], [3882, 6358], [3860, 6363], [3862, 6382], [3831, 6391], [3831, 6414], [3820, 6434], [3799, 6440], [3784, 6454], [3760, 6463], [3746, 6482], [3720, 6491], [3686, 6491], [3770, 6528], [3786, 6558], [3818, 6574], [3823, 6637], [3838, 6654], [3839, 6677], [3819, 6717], [3811, 6725], [3742, 6737], [3721, 6719], [3651, 6728], [3648, 6702], [3634, 6686], [3623, 6691], [3615, 6713], [3578, 6698], [3578, 6675], [3560, 6697], [3558, 6716], [3539, 6712], [3548, 6695], [3495, 6674], [3501, 6757], [3486, 6763], [3440, 6806], [3387, 6893], [3385, 6902], [3431, 6941], [3358, 7168], [3340, 7225], [3517, 7173], [3579, 7163], [3747, 7130], [3831, 7142], [3885, 7134], [3895, 7147], [3984, 7136], [4056, 7111], [4115, 7089], [4154, 7081], [4197, 7012], [4263, 6986], [4279, 6989], [4310, 6984], [4363, 6951], [4431, 6911], [4511, 6887], [4548, 6885], [4630, 6897], [4626, 6846], [4655, 6840], [4697, 6840], [4712, 6822], [4754, 6860], [4764, 6859], [4848, 6903], [4897, 6920], [5008, 6966], [5038, 6976], [5086, 6980], [5125, 6989], [5132, 7001], [5161, 7011], [5180, 6999], [5245, 6994], [5260, 7001], [5299, 7006], [5309, 7000], [5351, 7000], [5406, 6987], [5439, 7001], [5486, 6994], [5531, 7001], [5557, 7021], [5597, 7039], [5633, 7040], [5639, 7047], [5692, 7072], [5698, 7086], [5727, 7108], [5747, 7145], [5753, 7147], [5798, 7202], [5827, 7218], [5858, 7227], [5876, 7241], [5895, 7239], [5936, 7283], [5964, 7288], [5966, 7319], [5951, 7348], [5934, 7365], [5914, 7378], [5897, 7405], [5888, 7435], [5872, 7451], [5884, 7483], [5900, 7504], [5899, 7522], [5910, 7554], [5935, 7600], [5957, 7619], [5977, 7629], [5997, 7625], [6053, 7624], [6071, 7606], [6081, 7589], [6125, 7566], [6140, 7566], [6171, 7556], [6239, 7550], [6261, 7542], [6309, 7584], [6337, 7588], [6359, 7614], [6386, 7634], [6416, 7675], [6421, 7701], [6455, 7713], [6495, 7698], [6526, 7703], [6563, 7703], [6621, 7720], [6661, 7763], [6678, 7776], [6702, 7777], [6721, 7799], [6722, 7815], [6714, 7824], [6718, 7846], [6742, 7888], [6747, 7889], [6771, 7928], [6799, 7937], [6812, 7951], [6859, 7946], [6906, 7947], [6909, 7973], [6918, 7990], [6913, 8003], [6926, 8008], [6948, 8007], [6963, 7988], [6991, 7997], [6998, 8011], [7021, 8018], [7034, 8030], [7046, 8031], [7066, 8046], [7089, 8038], [7113, 8036], [7122, 8043], [7148, 8035], [7157, 8057], [7169, 8058], [7169, 8047], [7186, 8051], [7206, 8026], [7230, 8028], [7249, 8017], [7259, 8027], [7297, 8025], [7301, 8015], [7319, 8026], [7324, 8036], [7341, 8037], [7344, 8048], [7342, 8096], [7330, 8099], [7318, 8122], [7319, 8133], [7303, 8168], [7277, 8180], [7275, 8194], [7262, 8200], [7239, 8225], [7240, 8236], [7203, 8251], [7199, 8282], [7137, 8307], [7101, 8362], [7076, 8367], [7055, 8364], [7043, 8373], [6998, 8364], [6973, 8364], [6920, 8298], [6902, 8268], [6851, 8313], [6815, 8330], [6779, 8329], [6742, 8315], [6710, 8324], [6684, 8307], [6656, 8275], [6594, 8334], [6585, 8393], [6634, 8420], [6629, 8485], [6634, 8496], [6675, 8564], [6670, 8577], [6779, 8828], [6782, 8828], [6838, 8790], [6873, 8776], [6908, 8776], [6963, 8748], [6972, 8767], [6991, 8774], [7008, 8774], [7014, 8787], [7028, 8792], [7031, 8805], [7058, 8819], [7058, 8827], [7075, 8834], [7073, 8840], [7088, 8857], [7115, 8862], [7146, 8874], [7173, 8874], [7185, 8885], [7189, 8900], [7198, 8898], [7216, 8929], [7209, 8936], [7214, 8972], [7198, 8967], [7176, 8978], [7196, 8994], [7200, 9035], [7213, 9043], [7216, 9056], [7227, 9060], [7235, 9078], [7232, 9108], [7254, 9143], [7269, 9154], [7278, 9184], [7273, 9196], [7302, 9238], [7310, 9262], [7307, 9274], [7318, 9287], [7315, 9296], [7322, 9320], [7336, 9321], [7366, 9352], [7372, 9363], [7385, 9370], [7384, 9378], [7413, 9390], [7422, 9413], [7416, 9419], [7426, 9430], [7431, 9452], [7424, 9464], [7425, 9478], [7403, 9495], [7402, 9505], [7412, 9523], [7411, 9546], [7417, 9550], [7374, 9579], [7364, 9571], [7345, 9572], [7331, 9560], [7307, 9564], [7304, 9577], [7309, 9593], [7303, 9612], [7332, 9630], [7352, 9648], [7368, 9677], [7383, 9695], [7397, 9703], [7411, 9730], [7428, 9743], [7434, 9756], [7474, 9753], [7499, 9758], [7508, 9768], [7533, 9771], [7552, 9752], [7563, 9747], [7561, 9728], [7576, 9722], [7587, 9700], [7583, 9688], [7572, 9682], [7564, 9659], [7556, 9653], [7554, 9635], [7536, 9620], [7520, 9596], [7490, 9572], [7514, 9566], [7530, 9547], [7547, 9536], [7567, 9534], [7580, 9501], [7601, 9493], [7618, 9498], [7640, 9533], [7651, 9557], [7658, 9545], [7675, 9548], [7681, 9532], [7705, 9514], [7705, 9502], [7723, 9495], [7751, 9496], [7754, 9473], [7731, 9461], [7743, 9418], [7750, 9420], [7748, 9396], [7760, 9368], [7757, 9359], [7776, 9323], [7778, 9289], [7787, 9273], [7797, 9266], [7800, 9252], [7814, 9250], [7853, 9235], [7881, 9245], [7930, 9166], [7948, 9125], [7993, 9063], [7979, 9048], [7983, 9028], [7970, 9011], [7949, 9032], [7947, 9003], [7964, 8984], [7966, 8968], [7979, 8964], [7987, 8973], [7997, 8968], [8003, 8979], [8017, 8974], [8032, 8978], [8041, 8965], [8046, 8986], [8044, 9013], [8056, 9021], [8066, 9024], [8068, 9010], [8081, 8998], [8089, 8982], [8082, 8968], [8071, 8963], [8089, 8941], [8102, 8931], [8098, 8922], [8102, 8889], [8114, 8877], [8117, 8862], [8129, 8886], [8154, 8884], [8147, 8892], [8154, 8901], [8175, 8875], [8188, 8885], [8196, 8878], [8198, 8844], [8184, 8844], [8202, 8825], [8203, 8798], [8209, 8791], [8212, 8755], [8207, 8721], [8191, 8704], [8155, 8716], [8139, 8696], [8141, 8673], [8126, 8647], [8125, 8627], [8119, 8610], [8110, 8563], [8100, 8552], [8108, 8530], [8100, 8524], [8103, 8507], [8115, 8489], [8115, 8476], [8098, 8435], [8098, 8456], [8089, 8456], [8086, 8477], [8070, 8497], [8067, 8537], [8057, 8544], [8057, 8544], [8028, 8517], [7996, 8475], [7975, 8453], [7943, 8406], [7904, 8387], [7893, 8358], [7883, 8343], [7832, 8313], [7817, 8296], [7789, 8278], [7782, 8264], [7777, 8240], [7762, 8227], [7788, 8183], [7810, 8165], [7839, 8155], [7828, 8143], [7832, 8127], [7849, 8133], [7853, 8095], [7875, 8074], [7898, 8081], [7906, 8109], [7921, 8113], [7933, 8108], [7936, 8132], [7957, 8136], [7951, 8111], [7965, 8107], [7967, 8123], [7976, 8113], [7978, 8083], [7974, 8073], [7934, 8068], [7918, 8063], [7911, 8044], [7903, 8050], [7880, 8049], [7873, 8038], [7876, 8004], [7908, 7959], [7896, 7939], [7898, 7929], [7887, 7921], [7844, 7912], [7852, 7872], [7840, 7852], [7848, 7836], [7840, 7820], [7828, 7818], [7821, 7836], [7806, 7847], [7798, 7838], [7795, 7856], [7786, 7870], [7771, 7869], [7774, 7854], [7755, 7838], [7744, 7853], [7725, 7858], [7715, 7877], [7680, 7891], [7667, 7884], [7675, 7875], [7678, 7854], [7668, 7834], [7649, 7822], [7662, 7810], [7679, 7807], [7688, 7816], [7702, 7815], [7713, 7793], [7707, 7786], [7718, 7761], [7743, 7750], [7742, 7714], [7758, 7710], [7757, 7693], [7743, 7686], [7737, 7676], [7740, 7658], [7733, 7642], [7735, 7619], [7730, 7619], [7743, 7586], [7752, 7575], [7742, 7561], [7748, 7538], [7760, 7534], [7766, 7514], [7776, 7514], [7780, 7474], [7777, 7460], [7785, 7455], [7814, 7458], [7847, 7471], [7861, 7493], [7877, 7500], [7906, 7525], [7923, 7530], [7925, 7495], [7938, 7491], [7962, 7452], [7974, 7448], [7964, 7428], [7966, 7415], [7979, 7404], [8005, 7336], [8004, 7311], [7991, 7307], [7991, 7307], [7968, 7299], [7971, 7285], [7983, 7280], [7990, 7266], [8001, 7275], [8024, 7257], [8041, 7259]]], [[[7993, 9063], [7948, 9125], [7930, 9166], [7881, 9245], [7913, 9255], [7919, 9276], [7941, 9270], [7956, 9253], [7980, 9260], [7989, 9267], [8007, 9268], [8013, 9258], [8036, 9250], [8039, 9272], [8047, 9280], [8064, 9276], [8071, 9267], [8082, 9270], [8095, 9286], [8109, 9284], [8120, 9302], [8117, 9316], [8136, 9325], [8142, 9359], [8148, 9354], [8184, 9353], [8222, 9312], [8222, 9312], [8228, 9302], [8228, 9302], [8228, 9301], [8228, 9301], [8229, 9301], [8229, 9301], [8233, 9295], [8233, 9295], [8236, 9291], [8236, 9291], [8241, 9285], [8241, 9285], [8242, 9284], [8242, 9284], [8255, 9267], [8255, 9267], [8258, 9254], [8272, 9253], [8279, 9238], [8311, 9210], [8308, 9201], [8315, 9189], [8288, 9146], [8267, 9129], [8279, 9119], [8274, 9111], [8283, 9082], [8269, 9071], [8252, 9049], [8245, 9051], [8236, 9014], [8228, 9009], [8226, 8988], [8208, 8973], [8197, 8956], [8204, 8938], [8195, 8919], [8198, 8890], [8188, 8885], [8175, 8875], [8154, 8901], [8147, 8892], [8154, 8884], [8129, 8886], [8117, 8862], [8114, 8877], [8102, 8889], [8098, 8922], [8102, 8931], [8089, 8941], [8071, 8963], [8082, 8968], [8089, 8982], [8081, 8998], [8068, 9010], [8066, 9024], [8056, 9021], [8054, 9060], [8034, 9057], [8028, 9062], [7993, 9063]]]]
                    },
                    "id": "CN.150000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 210000,
                        "name": "辽宁",
                        "center": [123.429096, 41.796767],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 5,
                        "fullname": "辽宁省",
                        "filename": "liaoning",
                        "parent": "中国",
                        "areacode": 210000,
                        "longitude": 123.429096,
                        "latitude": 41.796767,
                        "cp": [8015, 6878],
                        "drilldown": "liaoning"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7268, 6728], [7284, 6732], [7279, 6749], [7292, 6754], [7297, 6775], [7288, 6789], [7298, 6795], [7278, 6810], [7274, 6839], [7281, 6861], [7278, 6885], [7288, 6914], [7276, 6921], [7261, 6940], [7269, 6956], [7292, 6967], [7307, 6987], [7319, 6980], [7315, 6964], [7351, 6946], [7370, 6947], [7369, 6928], [7398, 6872], [7410, 6843], [7408, 6827], [7419, 6825], [7434, 6862], [7466, 6898], [7480, 6904], [7481, 6925], [7502, 6941], [7509, 6938], [7530, 6956], [7538, 6955], [7563, 6971], [7587, 6965], [7624, 6999], [7627, 7011], [7627, 7011], [7642, 7021], [7680, 7028], [7692, 7014], [7733, 7048], [7738, 7077], [7761, 7084], [7785, 7079], [7784, 7090], [7809, 7076], [7818, 7080], [7828, 7103], [7814, 7102], [7809, 7115], [7824, 7119], [7847, 7116], [7858, 7104], [7877, 7108], [7887, 7101], [7887, 7101], [7895, 7094], [7905, 7106], [7935, 7107], [7964, 7124], [7954, 7130], [7955, 7146], [7968, 7163], [8005, 7177], [8013, 7174], [8013, 7174], [8023, 7169], [8037, 7213], [8035, 7233], [8041, 7259], [8041, 7271], [8055, 7289], [8069, 7281], [8066, 7272], [8075, 7259], [8100, 7241], [8112, 7245], [8115, 7234], [8135, 7234], [8135, 7234], [8145, 7232], [8146, 7216], [8173, 7196], [8158, 7176], [8174, 7172], [8176, 7161], [8166, 7149], [8178, 7149], [8182, 7136], [8192, 7148], [8192, 7148], [8196, 7147], [8216, 7174], [8220, 7193], [8236, 7210], [8255, 7215], [8247, 7190], [8253, 7180], [8254, 7140], [8261, 7132], [8275, 7137], [8279, 7123], [8279, 7123], [8275, 7117], [8289, 7092], [8299, 7095], [8296, 7065], [8318, 7049], [8319, 7020], [8341, 7018], [8345, 6983], [8352, 6992], [8378, 6983], [8358, 6950], [8345, 6938], [8348, 6917], [8348, 6917], [8348, 6915], [8348, 6915], [8347, 6910], [8347, 6910], [8347, 6910], [8353, 6895], [8353, 6895], [8354, 6894], [8354, 6894], [8356, 6870], [8378, 6872], [8380, 6854], [8397, 6826], [8401, 6808], [8418, 6796], [8421, 6777], [8441, 6771], [8438, 6758], [8448, 6756], [8435, 6738], [8439, 6728], [8431, 6708], [8416, 6697], [8438, 6683], [8412, 6649], [8403, 6648], [8391, 6625], [8365, 6628], [8320, 6596], [8315, 6581], [8299, 6581], [8291, 6568], [8273, 6555], [8269, 6541], [8252, 6533], [8212, 6488], [8211, 6487], [8204, 6473], [8211, 6466], [8188, 6443], [8177, 6422], [8174, 6399], [8165, 6417], [8147, 6410], [8115, 6415], [8091, 6408], [8085, 6414], [8076, 6400], [8062, 6402], [8037, 6385], [8035, 6395], [8015, 6391], [8012, 6376], [7969, 6365], [7962, 6350], [7941, 6352], [7933, 6341], [7893, 6316], [7877, 6301], [7863, 6302], [7839, 6279], [7833, 6266], [7811, 6252], [7821, 6240], [7800, 6225], [7785, 6208], [7767, 6209], [7778, 6193], [7768, 6186], [7753, 6205], [7732, 6201], [7730, 6186], [7742, 6180], [7740, 6169], [7714, 6168], [7704, 6154], [7677, 6154], [7659, 6145], [7648, 6129], [7636, 6129], [7633, 6184], [7647, 6180], [7672, 6191], [7676, 6210], [7702, 6205], [7733, 6226], [7718, 6237], [7715, 6263], [7728, 6263], [7737, 6285], [7719, 6274], [7693, 6266], [7684, 6280], [7650, 6294], [7659, 6308], [7645, 6317], [7657, 6337], [7685, 6343], [7693, 6363], [7685, 6372], [7697, 6397], [7714, 6406], [7726, 6419], [7738, 6419], [7748, 6444], [7759, 6448], [7780, 6472], [7767, 6493], [7782, 6495], [7784, 6513], [7812, 6529], [7819, 6562], [7797, 6583], [7799, 6597], [7785, 6591], [7763, 6597], [7759, 6625], [7744, 6630], [7736, 6647], [7713, 6630], [7685, 6634], [7680, 6641], [7650, 6644], [7632, 6632], [7612, 6635], [7606, 6618], [7589, 6604], [7597, 6596], [7561, 6586], [7560, 6567], [7544, 6554], [7535, 6537], [7524, 6533], [7522, 6509], [7511, 6501], [7510, 6485], [7500, 6466], [7483, 6465], [7465, 6453], [7408, 6431], [7401, 6417], [7390, 6417], [7389, 6420], [7389, 6420], [7389, 6424], [7389, 6424], [7383, 6431], [7383, 6431], [7376, 6430], [7376, 6430], [7376, 6431], [7376, 6431], [7368, 6444], [7369, 6468], [7347, 6471], [7349, 6487], [7339, 6507], [7340, 6528], [7334, 6546], [7286, 6542], [7260, 6557], [7263, 6577], [7240, 6572], [7213, 6598], [7202, 6603], [7210, 6642], [7224, 6642], [7224, 6642], [7230, 6654], [7219, 6656], [7220, 6670], [7234, 6668], [7249, 6685], [7270, 6720], [7268, 6728]]], [[[7963, 6331], [7964, 6343], [7975, 6337], [7963, 6331]]]]
                    },
                    "id": "CN.210000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 220000,
                        "name": "吉林",
                        "center": [125.3245, 43.886841],
                        "childrenNum": 9,
                        "level": "province",
                        "subFeatureIndex": 6,
                        "fullname": "吉林省",
                        "filename": "jilin",
                        "parent": "中国",
                        "areacode": 220000,
                        "longitude": 125.3245,
                        "latitude": 43.886841,
                        "cp": [8318, 7403],
                        "drilldown": "jilin"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[8438, 6683], [8416, 6697], [8431, 6708], [8439, 6728], [8435, 6738], [8448, 6756], [8438, 6758], [8441, 6771], [8421, 6777], [8418, 6796], [8401, 6808], [8397, 6826], [8380, 6854], [8378, 6872], [8356, 6870], [8354, 6894], [8354, 6894], [8353, 6895], [8353, 6895], [8347, 6910], [8347, 6910], [8347, 6910], [8348, 6915], [8348, 6915], [8348, 6917], [8348, 6917], [8345, 6938], [8358, 6950], [8378, 6983], [8352, 6992], [8345, 6983], [8341, 7018], [8319, 7020], [8318, 7049], [8296, 7065], [8299, 7095], [8289, 7092], [8275, 7117], [8279, 7123], [8279, 7123], [8275, 7137], [8261, 7132], [8254, 7140], [8253, 7180], [8247, 7190], [8255, 7215], [8236, 7210], [8220, 7193], [8216, 7174], [8196, 7147], [8192, 7148], [8192, 7148], [8182, 7136], [8178, 7149], [8166, 7149], [8176, 7161], [8174, 7172], [8158, 7176], [8173, 7196], [8146, 7216], [8145, 7232], [8135, 7234], [8135, 7234], [8115, 7234], [8112, 7245], [8100, 7241], [8075, 7259], [8066, 7272], [8069, 7281], [8055, 7289], [8041, 7271], [8041, 7259], [8024, 7257], [8001, 7275], [7990, 7266], [7983, 7280], [7971, 7285], [7968, 7299], [7991, 7307], [7991, 7307], [8004, 7311], [8005, 7336], [7979, 7404], [7966, 7415], [7964, 7428], [7974, 7448], [7962, 7452], [7938, 7491], [7925, 7495], [7923, 7530], [7906, 7525], [7877, 7500], [7861, 7493], [7847, 7471], [7814, 7458], [7785, 7455], [7777, 7460], [7780, 7474], [7776, 7514], [7766, 7514], [7760, 7534], [7748, 7538], [7742, 7561], [7752, 7575], [7743, 7586], [7730, 7619], [7735, 7619], [7733, 7642], [7740, 7658], [7737, 7676], [7743, 7686], [7757, 7693], [7758, 7710], [7742, 7714], [7743, 7750], [7718, 7761], [7707, 7786], [7713, 7793], [7702, 7815], [7688, 7816], [7679, 7807], [7662, 7810], [7649, 7822], [7668, 7834], [7678, 7854], [7675, 7875], [7667, 7884], [7680, 7891], [7715, 7877], [7725, 7858], [7744, 7853], [7755, 7838], [7774, 7854], [7771, 7869], [7786, 7870], [7795, 7856], [7798, 7838], [7806, 7847], [7821, 7836], [7828, 7818], [7840, 7820], [7848, 7836], [7840, 7852], [7852, 7872], [7844, 7912], [7887, 7921], [7898, 7929], [7896, 7939], [7908, 7959], [7919, 7966], [7932, 7962], [7932, 7962], [7941, 7955], [7963, 7965], [7975, 7957], [7982, 7964], [8011, 7969], [8030, 7980], [8046, 7962], [8050, 7931], [8059, 7911], [8048, 7898], [8054, 7883], [8065, 7878], [8067, 7857], [8058, 7852], [8082, 7830], [8081, 7818], [8107, 7806], [8110, 7795], [8121, 7798], [8131, 7772], [8145, 7777], [8156, 7767], [8170, 7774], [8215, 7778], [8220, 7803], [8227, 7792], [8238, 7793], [8248, 7766], [8278, 7776], [8296, 7772], [8304, 7778], [8308, 7795], [8321, 7792], [8342, 7807], [8353, 7806], [8359, 7783], [8357, 7765], [8369, 7752], [8398, 7731], [8443, 7718], [8469, 7732], [8486, 7747], [8510, 7753], [8558, 7731], [8581, 7729], [8583, 7715], [8606, 7685], [8596, 7673], [8591, 7654], [8602, 7629], [8607, 7592], [8614, 7604], [8629, 7613], [8666, 7613], [8696, 7601], [8693, 7588], [8681, 7578], [8690, 7567], [8687, 7558], [8687, 7558], [8713, 7530], [8709, 7517], [8726, 7504], [8733, 7512], [8736, 7488], [8760, 7481], [8793, 7496], [8798, 7502], [8797, 7540], [8787, 7554], [8811, 7560], [8813, 7576], [8839, 7599], [8857, 7581], [8861, 7567], [8860, 7524], [8885, 7489], [8888, 7475], [8900, 7463], [8899, 7452], [8914, 7454], [8922, 7445], [8915, 7435], [8949, 7371], [8962, 7375], [8974, 7369], [9010, 7390], [9003, 7435], [9036, 7447], [9045, 7461], [9094, 7466], [9099, 7489], [9113, 7500], [9113, 7500], [9115, 7499], [9115, 7499], [9132, 7504], [9140, 7492], [9144, 7465], [9154, 7462], [9154, 7462], [9170, 7490], [9182, 7493], [9196, 7519], [9196, 7495], [9196, 7495], [9205, 7485], [9208, 7455], [9216, 7446], [9217, 7424], [9230, 7426], [9292, 7396], [9297, 7384], [9309, 7381], [9328, 7401], [9349, 7383], [9349, 7383], [9376, 7396], [9377, 7404], [9382, 7378], [9375, 7372], [9375, 7346], [9367, 7339], [9371, 7317], [9365, 7298], [9354, 7285], [9364, 7273], [9359, 7259], [9344, 7261], [9348, 7247], [9331, 7247], [9321, 7240], [9304, 7245], [9302, 7236], [9281, 7235], [9238, 7202], [9250, 7193], [9272, 7192], [9282, 7176], [9272, 7163], [9271, 7149], [9254, 7178], [9238, 7171], [9209, 7201], [9209, 7241], [9180, 7243], [9186, 7256], [9159, 7255], [9158, 7254], [9149, 7261], [9142, 7258], [9136, 7249], [9136, 7248], [9134, 7228], [9134, 7225], [9132, 7221], [9131, 7220], [9125, 7187], [9125, 7186], [9128, 7183], [9131, 7180], [9124, 7154], [9128, 7128], [9121, 7117], [9105, 7117], [9103, 7114], [9095, 7098], [9076, 7116], [9057, 7116], [9040, 7095], [9039, 7092], [9045, 7087], [9033, 7068], [9040, 7056], [9024, 7038], [8996, 7022], [8993, 7005], [8958, 7010], [8952, 7002], [8935, 7003], [8929, 6995], [8910, 6999], [8843, 6993], [8834, 6987], [8848, 6976], [8852, 6939], [8864, 6921], [8885, 6909], [8893, 6894], [8881, 6871], [8876, 6849], [8861, 6837], [8827, 6853], [8813, 6846], [8775, 6841], [8758, 6855], [8733, 6849], [8712, 6853], [8709, 6859], [8679, 6863], [8689, 6878], [8663, 6893], [8663, 6911], [8644, 6916], [8641, 6925], [8620, 6908], [8619, 6896], [8605, 6908], [8600, 6889], [8586, 6887], [8580, 6875], [8571, 6822], [8579, 6813], [8561, 6808], [8543, 6778], [8538, 6763], [8516, 6743], [8496, 6702], [8484, 6690], [8468, 6695], [8458, 6685], [8452, 6691], [8438, 6683]]]]
                    },
                    "id": "CN.220000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 230000,
                        "name": "黑龙江",
                        "center": [126.642464, 45.756967],
                        "childrenNum": 13,
                        "level": "province",
                        "subFeatureIndex": 7,
                        "fullname": "黑龙江省",
                        "filename": "heilongjiang",
                        "parent": "中国",
                        "areacode": 230000,
                        "longitude": 126.642464,
                        "latitude": 45.756967,
                        "cp": [8513, 7878],
                        "drilldown": "heilongjiang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7932, 7962], [7932, 7962], [7919, 7966], [7908, 7959], [7876, 8004], [7873, 8038], [7880, 8049], [7903, 8050], [7911, 8044], [7918, 8063], [7934, 8068], [7974, 8073], [7978, 8083], [7976, 8113], [7967, 8123], [7965, 8107], [7951, 8111], [7957, 8136], [7936, 8132], [7933, 8108], [7921, 8113], [7906, 8109], [7898, 8081], [7875, 8074], [7853, 8095], [7849, 8133], [7832, 8127], [7828, 8143], [7839, 8155], [7810, 8165], [7788, 8183], [7762, 8227], [7777, 8240], [7782, 8264], [7789, 8278], [7817, 8296], [7832, 8313], [7883, 8343], [7893, 8358], [7904, 8387], [7943, 8406], [7975, 8453], [7996, 8475], [8028, 8517], [8057, 8544], [8057, 8544], [8067, 8537], [8070, 8497], [8086, 8477], [8089, 8456], [8098, 8456], [8098, 8435], [8115, 8476], [8115, 8489], [8103, 8507], [8100, 8524], [8108, 8530], [8100, 8552], [8110, 8563], [8119, 8610], [8125, 8627], [8126, 8647], [8141, 8673], [8139, 8696], [8155, 8716], [8191, 8704], [8207, 8721], [8212, 8755], [8209, 8791], [8203, 8798], [8202, 8825], [8184, 8844], [8198, 8844], [8196, 8878], [8188, 8885], [8198, 8890], [8195, 8919], [8204, 8938], [8197, 8956], [8208, 8973], [8226, 8988], [8228, 9009], [8236, 9014], [8245, 9051], [8252, 9049], [8269, 9071], [8283, 9082], [8274, 9111], [8279, 9119], [8267, 9129], [8288, 9146], [8315, 9189], [8308, 9201], [8311, 9210], [8279, 9238], [8272, 9253], [8258, 9254], [8255, 9267], [8255, 9267], [8242, 9284], [8242, 9284], [8241, 9285], [8241, 9285], [8236, 9291], [8236, 9291], [8233, 9295], [8233, 9295], [8229, 9301], [8229, 9301], [8228, 9301], [8228, 9301], [8228, 9302], [8228, 9302], [8222, 9312], [8222, 9312], [8184, 9353], [8148, 9354], [8142, 9359], [8136, 9325], [8117, 9316], [8120, 9302], [8109, 9284], [8095, 9286], [8082, 9270], [8071, 9267], [8064, 9276], [8047, 9280], [8039, 9272], [8036, 9250], [8013, 9258], [8007, 9268], [7989, 9267], [7980, 9260], [7956, 9253], [7941, 9270], [7919, 9276], [7913, 9255], [7881, 9245], [7853, 9235], [7814, 9250], [7800, 9252], [7797, 9266], [7787, 9273], [7778, 9289], [7776, 9323], [7757, 9359], [7760, 9368], [7748, 9396], [7750, 9420], [7743, 9418], [7731, 9461], [7754, 9473], [7751, 9496], [7723, 9495], [7705, 9502], [7705, 9514], [7681, 9532], [7675, 9548], [7658, 9545], [7651, 9557], [7640, 9533], [7618, 9498], [7601, 9493], [7580, 9501], [7567, 9534], [7547, 9536], [7530, 9547], [7514, 9566], [7490, 9572], [7520, 9596], [7536, 9620], [7554, 9635], [7556, 9653], [7564, 9659], [7572, 9682], [7583, 9688], [7587, 9700], [7576, 9722], [7561, 9728], [7563, 9747], [7552, 9752], [7533, 9771], [7548, 9776], [7564, 9788], [7573, 9787], [7592, 9798], [7630, 9800], [7637, 9812], [7648, 9811], [7667, 9824], [7681, 9808], [7709, 9815], [7755, 9817], [7780, 9830], [7793, 9828], [7814, 9847], [7844, 9842], [7853, 9835], [7853, 9848], [7863, 9834], [7865, 9846], [7878, 9843], [7883, 9834], [7910, 9833], [7943, 9812], [7955, 9798], [7972, 9807], [7987, 9795], [7996, 9776], [8007, 9768], [8027, 9763], [8047, 9766], [8056, 9750], [8072, 9751], [8079, 9739], [8080, 9757], [8093, 9765], [8129, 9769], [8150, 9756], [8181, 9745], [8186, 9733], [8199, 9743], [8212, 9724], [8221, 9721], [8221, 9708], [8210, 9698], [8214, 9684], [8228, 9695], [8242, 9688], [8265, 9661], [8276, 9672], [8286, 9662], [8275, 9656], [8279, 9639], [8268, 9639], [8265, 9626], [8276, 9613], [8281, 9621], [8307, 9602], [8307, 9586], [8316, 9589], [8332, 9567], [8330, 9546], [8347, 9544], [8327, 9522], [8335, 9515], [8360, 9509], [8372, 9499], [8366, 9476], [8355, 9473], [8359, 9452], [8367, 9446], [8389, 9409], [8408, 9393], [8411, 9375], [8405, 9358], [8429, 9349], [8422, 9325], [8443, 9316], [8448, 9304], [8433, 9299], [8435, 9276], [8448, 9277], [8441, 9293], [8456, 9296], [8457, 9287], [8446, 9262], [8453, 9226], [8492, 9189], [8510, 9157], [8521, 9151], [8522, 9127], [8537, 9107], [8527, 9076], [8539, 9070], [8536, 9044], [8543, 9033], [8583, 9022], [8582, 8995], [8570, 8973], [8570, 8957], [8579, 8945], [8580, 8914], [8586, 8906], [8602, 8904], [8607, 8884], [8632, 8859], [8646, 8856], [8663, 8861], [8676, 8853], [8695, 8850], [8711, 8859], [8721, 8854], [8728, 8866], [8752, 8872], [8783, 8865], [8787, 8873], [8799, 8865], [8791, 8851], [8798, 8843], [8810, 8849], [8835, 8842], [8844, 8823], [8859, 8818], [8870, 8830], [8889, 8822], [8898, 8825], [8898, 8842], [8908, 8845], [8925, 8835], [8930, 8810], [8938, 8806], [8956, 8812], [8965, 8803], [8965, 8790], [8981, 8785], [8986, 8768], [8994, 8767], [8999, 8751], [9014, 8747], [9021, 8737], [9049, 8720], [9055, 8712], [9092, 8725], [9098, 8716], [9128, 8723], [9130, 8715], [9121, 8697], [9111, 8652], [9123, 8649], [9128, 8624], [9152, 8630], [9150, 8609], [9171, 8578], [9160, 8560], [9161, 8549], [9147, 8532], [9153, 8512], [9189, 8486], [9203, 8462], [9207, 8438], [9218, 8430], [9233, 8430], [9259, 8445], [9289, 8451], [9304, 8450], [9314, 8432], [9331, 8446], [9354, 8440], [9378, 8441], [9382, 8452], [9397, 8452], [9428, 8459], [9443, 8473], [9461, 8465], [9478, 8466], [9481, 8484], [9493, 8509], [9487, 8523], [9497, 8529], [9514, 8525], [9523, 8542], [9540, 8553], [9546, 8571], [9564, 8582], [9590, 8576], [9607, 8584], [9629, 8585], [9637, 8605], [9653, 8605], [9659, 8623], [9712, 8651], [9722, 8652], [9733, 8665], [9758, 8667], [9782, 8681], [9815, 8682], [9837, 8677], [9852, 8698], [9881, 8699], [9880, 8688], [9845, 8667], [9817, 8644], [9819, 8622], [9814, 8603], [9803, 8585], [9816, 8555], [9825, 8554], [9831, 8534], [9849, 8522], [9852, 8511], [9838, 8487], [9839, 8480], [9824, 8457], [9824, 8447], [9812, 8437], [9786, 8432], [9762, 8400], [9761, 8380], [9776, 8365], [9777, 8346], [9764, 8341], [9753, 8288], [9756, 8226], [9741, 8213], [9734, 8176], [9753, 8164], [9741, 8155], [9750, 8148], [9749, 8128], [9740, 8114], [9718, 8102], [9728, 8081], [9720, 8047], [9709, 8046], [9705, 8027], [9693, 8030], [9688, 8017], [9693, 7993], [9687, 7984], [9696, 7976], [9678, 7951], [9652, 7932], [9643, 7909], [9641, 7864], [9650, 7848], [9646, 7830], [9621, 7806], [9606, 7814], [9522, 7829], [9456, 7843], [9438, 7851], [9434, 7863], [9420, 7854], [9416, 7829], [9403, 7833], [9393, 7814], [9402, 7808], [9392, 7793], [9369, 7770], [9366, 7762], [9347, 7767], [9334, 7748], [9314, 7753], [9302, 7746], [9301, 7735], [9283, 7726], [9293, 7711], [9301, 7712], [9312, 7694], [9364, 7536], [9356, 7531], [9359, 7509], [9352, 7481], [9364, 7428], [9358, 7410], [9377, 7404], [9376, 7396], [9349, 7383], [9349, 7383], [9328, 7401], [9309, 7381], [9297, 7384], [9292, 7396], [9230, 7426], [9217, 7424], [9216, 7446], [9208, 7455], [9205, 7485], [9196, 7495], [9196, 7495], [9196, 7519], [9182, 7493], [9170, 7490], [9154, 7462], [9154, 7462], [9144, 7465], [9140, 7492], [9132, 7504], [9115, 7499], [9115, 7499], [9113, 7500], [9113, 7500], [9099, 7489], [9094, 7466], [9045, 7461], [9036, 7447], [9003, 7435], [9010, 7390], [8974, 7369], [8962, 7375], [8949, 7371], [8915, 7435], [8922, 7445], [8914, 7454], [8899, 7452], [8900, 7463], [8888, 7475], [8885, 7489], [8860, 7524], [8861, 7567], [8857, 7581], [8839, 7599], [8813, 7576], [8811, 7560], [8787, 7554], [8797, 7540], [8798, 7502], [8793, 7496], [8760, 7481], [8736, 7488], [8733, 7512], [8726, 7504], [8709, 7517], [8713, 7530], [8687, 7558], [8687, 7558], [8690, 7567], [8681, 7578], [8693, 7588], [8696, 7601], [8666, 7613], [8629, 7613], [8614, 7604], [8607, 7592], [8602, 7629], [8591, 7654], [8596, 7673], [8606, 7685], [8583, 7715], [8581, 7729], [8558, 7731], [8510, 7753], [8486, 7747], [8469, 7732], [8443, 7718], [8398, 7731], [8369, 7752], [8357, 7765], [8359, 7783], [8353, 7806], [8342, 7807], [8321, 7792], [8308, 7795], [8304, 7778], [8296, 7772], [8278, 7776], [8248, 7766], [8238, 7793], [8227, 7792], [8220, 7803], [8215, 7778], [8170, 7774], [8156, 7767], [8145, 7777], [8131, 7772], [8121, 7798], [8110, 7795], [8107, 7806], [8081, 7818], [8082, 7830], [8058, 7852], [8067, 7857], [8065, 7878], [8054, 7883], [8048, 7898], [8059, 7911], [8050, 7931], [8046, 7962], [8030, 7980], [8011, 7969], [7982, 7964], [7975, 7957], [7963, 7965], [7941, 7955], [7932, 7962]]], [[[8056, 9021], [8044, 9013], [8046, 8986], [8041, 8965], [8032, 8978], [8017, 8974], [8003, 8979], [7997, 8968], [7987, 8973], [7979, 8964], [7966, 8968], [7964, 8984], [7947, 9003], [7949, 9032], [7970, 9011], [7983, 9028], [7979, 9048], [7993, 9063], [8028, 9062], [8034, 9057], [8054, 9060], [8056, 9021]]]]
                    },
                    "id": "CN.230000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 310000,
                        "name": "上海",
                        "center": [121.472644, 31.231706],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 8,
                        "fullname": "上海市",
                        "filename": "shanghai",
                        "parent": "中国",
                        "areacode": 310000,
                        "longitude": 121.472644,
                        "latitude": 31.231706,
                        "cp": [7779, 4409],
                        "drilldown": "shanghai"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7881, 4314], [7876, 4311], [7868, 4319], [7809, 4314], [7775, 4295], [7763, 4283], [7746, 4282], [7734, 4306], [7716, 4304], [7710, 4321], [7689, 4315], [7688, 4354], [7670, 4356], [7665, 4382], [7703, 4389], [7699, 4414], [7716, 4416], [7707, 4436], [7719, 4456], [7735, 4463], [7735, 4463], [7743, 4468], [7743, 4468], [7751, 4472], [7787, 4447], [7825, 4429], [7873, 4376], [7883, 4355], [7881, 4314]]], [[[7756, 4481], [7710, 4524], [7720, 4543], [7743, 4552], [7766, 4530], [7821, 4512], [7872, 4501], [7878, 4473], [7858, 4458], [7844, 4459], [7790, 4478], [7768, 4490], [7756, 4481]]], [[[7830, 4437], [7784, 4466], [7830, 4451], [7830, 4437]]], [[[7851, 4427], [7840, 4445], [7864, 4439], [7851, 4427]]], [[[7871, 4410], [7883, 4412], [7882, 4398], [7871, 4410]]]]
                    },
                    "id": "CN.310000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 320000,
                        "name": "江苏",
                        "center": [118.767413, 32.041544],
                        "childrenNum": 13,
                        "level": "province",
                        "subFeatureIndex": 9,
                        "fullname": "江苏省",
                        "filename": "jiangsu",
                        "parent": "中国",
                        "areacode": 320000,
                        "longitude": 118.767413,
                        "latitude": 32.041544,
                        "cp": [7248, 4573],
                        "drilldown": "jiangsu"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7872, 4501], [7821, 4512], [7766, 4530], [7743, 4552], [7720, 4543], [7710, 4524], [7756, 4481], [7751, 4472], [7743, 4468], [7743, 4468], [7735, 4463], [7735, 4463], [7719, 4456], [7707, 4436], [7716, 4416], [7699, 4414], [7703, 4389], [7665, 4382], [7670, 4356], [7631, 4344], [7635, 4324], [7611, 4316], [7595, 4294], [7578, 4325], [7566, 4322], [7567, 4336], [7539, 4330], [7522, 4333], [7495, 4351], [7478, 4383], [7431, 4380], [7420, 4372], [7388, 4376], [7374, 4384], [7374, 4384], [7372, 4401], [7350, 4396], [7337, 4406], [7313, 4391], [7256, 4391], [7245, 4400], [7248, 4421], [7269, 4427], [7272, 4458], [7272, 4459], [7268, 4479], [7258, 4477], [7251, 4491], [7244, 4480], [7226, 4483], [7236, 4497], [7224, 4508], [7208, 4501], [7194, 4511], [7198, 4526], [7170, 4545], [7176, 4579], [7195, 4589], [7199, 4605], [7222, 4610], [7232, 4635], [7230, 4668], [7211, 4672], [7205, 4690], [7234, 4702], [7234, 4702], [7274, 4691], [7274, 4691], [7274, 4691], [7274, 4691], [7285, 4679], [7297, 4682], [7306, 4668], [7331, 4697], [7322, 4753], [7307, 4753], [7285, 4783], [7257, 4781], [7251, 4758], [7237, 4756], [7241, 4731], [7231, 4727], [7168, 4724], [7143, 4753], [7139, 4768], [7150, 4776], [7141, 4787], [7135, 4829], [7100, 4817], [7081, 4846], [7087, 4850], [7101, 4899], [7112, 4895], [7112, 4928], [7122, 4939], [7111, 4962], [7071, 4950], [7052, 4954], [7042, 4948], [7043, 4988], [7034, 4986], [7017, 5020], [7007, 5009], [6995, 5027], [6975, 5018], [6964, 5033], [6934, 5027], [6901, 5049], [6906, 5066], [6891, 5075], [6890, 5099], [6863, 5099], [6853, 5114], [6815, 5121], [6818, 5126], [6798, 5140], [6786, 5159], [6776, 5155], [6782, 5204], [6788, 5214], [6832, 5225], [6860, 5223], [6887, 5211], [6894, 5193], [6911, 5172], [6909, 5157], [6921, 5156], [6929, 5119], [6942, 5114], [6952, 5140], [6952, 5140], [6956, 5142], [6956, 5142], [6956, 5142], [6956, 5142], [6956, 5144], [6956, 5144], [6971, 5143], [6984, 5124], [7008, 5119], [7025, 5139], [7047, 5133], [7045, 5163], [7066, 5162], [7075, 5170], [7100, 5166], [7100, 5146], [7120, 5140], [7110, 5126], [7119, 5120], [7120, 5103], [7141, 5114], [7162, 5115], [7169, 5138], [7165, 5153], [7172, 5168], [7198, 5182], [7215, 5174], [7232, 5185], [7220, 5190], [7230, 5201], [7245, 5236], [7246, 5256], [7258, 5261], [7293, 5263], [7297, 5273], [7325, 5278], [7329, 5269], [7316, 5262], [7311, 5226], [7318, 5205], [7345, 5198], [7360, 5200], [7370, 5191], [7362, 5177], [7385, 5161], [7423, 5143], [7429, 5137], [7458, 5132], [7526, 5099], [7538, 5050], [7583, 4956], [7597, 4935], [7617, 4881], [7633, 4873], [7651, 4813], [7657, 4778], [7666, 4778], [7666, 4754], [7653, 4743], [7657, 4724], [7704, 4701], [7743, 4690], [7757, 4681], [7770, 4615], [7779, 4615], [7826, 4599], [7846, 4577], [7870, 4524], [7872, 4501]]]]
                    },
                    "id": "CN.320000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 330000,
                        "name": "浙江",
                        "center": [120.153576, 30.287459],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 10,
                        "fullname": "浙江省",
                        "filename": "zhejiang",
                        "parent": "中国",
                        "areacode": 330000,
                        "longitude": 120.153576,
                        "latitude": 30.287459,
                        "cp": [7531, 4185],
                        "drilldown": "zhejiang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7620, 3481], [7607, 3496], [7612, 3507], [7593, 3537], [7577, 3544], [7552, 3540], [7536, 3522], [7527, 3530], [7495, 3511], [7480, 3512], [7462, 3541], [7466, 3558], [7450, 3573], [7452, 3591], [7424, 3587], [7419, 3562], [7400, 3561], [7379, 3534], [7364, 3533], [7321, 3550], [7306, 3541], [7298, 3559], [7307, 3576], [7285, 3643], [7268, 3654], [7265, 3675], [7281, 3688], [7274, 3703], [7280, 3715], [7259, 3730], [7255, 3721], [7237, 3723], [7209, 3716], [7207, 3724], [7217, 3733], [7206, 3749], [7213, 3768], [7204, 3779], [7203, 3780], [7204, 3779], [7203, 3780], [7203, 3780], [7203, 3781], [7203, 3791], [7203, 3791], [7204, 3812], [7193, 3835], [7193, 3835], [7178, 3843], [7170, 3865], [7138, 3881], [7138, 3881], [7123, 3903], [7121, 3919], [7130, 3947], [7142, 3946], [7155, 3960], [7152, 3971], [7176, 3978], [7175, 3995], [7211, 4001], [7212, 4014], [7226, 4028], [7240, 4029], [7259, 4052], [7260, 4076], [7287, 4098], [7288, 4118], [7276, 4148], [7292, 4157], [7281, 4183], [7296, 4193], [7317, 4181], [7344, 4179], [7353, 4191], [7376, 4201], [7367, 4234], [7349, 4237], [7349, 4251], [7364, 4254], [7378, 4269], [7384, 4260], [7396, 4274], [7395, 4290], [7413, 4303], [7414, 4336], [7423, 4347], [7420, 4372], [7431, 4380], [7478, 4383], [7495, 4351], [7522, 4333], [7539, 4330], [7567, 4336], [7566, 4322], [7578, 4325], [7595, 4294], [7611, 4316], [7635, 4324], [7631, 4344], [7670, 4356], [7688, 4354], [7689, 4315], [7710, 4321], [7716, 4304], [7734, 4306], [7746, 4282], [7705, 4255], [7740, 4220], [7760, 4219], [7794, 4190], [7823, 4149], [7841, 4132], [7853, 4133], [7881, 4117], [7890, 4126], [7898, 4112], [7924, 4115], [7917, 4105], [7898, 4082], [7886, 4079], [7867, 4056], [7893, 4054], [7900, 4042], [7895, 4027], [7900, 4013], [7890, 3997], [7902, 3946], [7900, 3923], [7883, 3934], [7862, 3934], [7859, 3946], [7838, 3934], [7864, 3878], [7843, 3879], [7850, 3867], [7848, 3845], [7820, 3829], [7839, 3809], [7852, 3774], [7841, 3740], [7815, 3751], [7792, 3711], [7775, 3712], [7771, 3687], [7747, 3686], [7739, 3710], [7730, 3700], [7718, 3666], [7731, 3656], [7752, 3658], [7751, 3636], [7752, 3636], [7751, 3634], [7751, 3634], [7751, 3634], [7748, 3631], [7748, 3631], [7751, 3637], [7726, 3640], [7709, 3654], [7681, 3626], [7650, 3580], [7665, 3558], [7660, 3533], [7640, 3520], [7636, 3484], [7620, 3481]]], [[[7955, 4126], [7928, 4135], [7903, 4134], [7893, 4153], [7893, 4153], [7884, 4177], [7924, 4163], [7952, 4162], [7964, 4143], [7955, 4126]]], [[[7912, 4206], [7936, 4213], [7938, 4191], [7904, 4202], [7912, 4206]]], [[[7955, 4196], [7972, 4202], [7971, 4191], [7955, 4196]]], [[[7982, 4119], [7974, 4102], [7961, 4122], [7977, 4129], [7982, 4119]]], [[[7959, 4244], [7974, 4232], [7946, 4233], [7945, 4245], [7959, 4244]]], [[[7957, 4101], [7959, 4087], [7941, 4101], [7957, 4101]]], [[[7925, 4064], [7908, 4073], [7923, 4090], [7938, 4073], [7937, 4060], [7925, 4064]]], [[[7876, 4311], [7881, 4314], [7890, 4287], [7882, 4291], [7876, 4311]]], [[[7871, 4127], [7863, 4133], [7866, 4154], [7880, 4147], [7882, 4134], [7871, 4127]]], [[[7926, 4131], [7926, 4131], [7926, 4131], [7928, 4135], [7926, 4131]]], [[[7747, 3667], [7728, 3665], [7733, 3675], [7747, 3667]]], [[[7748, 3631], [7748, 3631], [7748, 3631], [7748, 3631]]], [[[7926, 4131], [7926, 4131], [7926, 4131], [7926, 4131]]]]
                    },
                    "id": "CN.330000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 340000,
                        "name": "安徽",
                        "center": [117.283042, 31.86119],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 11,
                        "fullname": "安徽省",
                        "filename": "anhui",
                        "parent": "中国",
                        "areacode": 340000,
                        "longitude": 117.283042,
                        "latitude": 31.86119,
                        "cp": [6961, 4524],
                        "drilldown": "anhui"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6616, 4657], [6597, 4675], [6577, 4676], [6557, 4685], [6553, 4702], [6556, 4745], [6544, 4754], [6507, 4763], [6495, 4775], [6503, 4781], [6499, 4807], [6511, 4811], [6526, 4797], [6550, 4798], [6575, 4810], [6587, 4855], [6577, 4864], [6583, 4893], [6597, 4905], [6639, 4912], [6624, 4955], [6634, 4956], [6636, 4978], [6621, 4978], [6632, 5014], [6656, 5025], [6683, 5008], [6699, 5009], [6707, 5000], [6705, 4985], [6718, 4976], [6722, 4958], [6737, 4942], [6758, 4947], [6768, 4956], [6791, 4964], [6791, 4974], [6830, 4986], [6830, 5003], [6816, 5025], [6816, 5025], [6808, 5034], [6814, 5049], [6804, 5077], [6784, 5072], [6784, 5072], [6756, 5095], [6746, 5096], [6736, 5113], [6744, 5125], [6742, 5140], [6751, 5135], [6758, 5148], [6776, 5155], [6786, 5159], [6798, 5140], [6818, 5126], [6815, 5121], [6853, 5114], [6863, 5099], [6890, 5099], [6891, 5075], [6906, 5066], [6901, 5049], [6934, 5027], [6964, 5033], [6975, 5018], [6995, 5027], [7007, 5009], [7017, 5020], [7034, 4986], [7043, 4988], [7042, 4948], [7052, 4954], [7071, 4950], [7111, 4962], [7122, 4939], [7112, 4928], [7112, 4895], [7101, 4899], [7087, 4850], [7081, 4846], [7100, 4817], [7135, 4829], [7141, 4787], [7150, 4776], [7139, 4768], [7143, 4753], [7168, 4724], [7231, 4727], [7241, 4731], [7237, 4756], [7251, 4758], [7257, 4781], [7285, 4783], [7307, 4753], [7322, 4753], [7331, 4697], [7306, 4668], [7297, 4682], [7285, 4679], [7274, 4691], [7274, 4691], [7274, 4691], [7274, 4691], [7234, 4702], [7234, 4702], [7205, 4690], [7211, 4672], [7230, 4668], [7232, 4635], [7222, 4610], [7199, 4605], [7195, 4589], [7176, 4579], [7170, 4545], [7198, 4526], [7194, 4511], [7208, 4501], [7224, 4508], [7236, 4497], [7226, 4483], [7244, 4480], [7251, 4491], [7258, 4477], [7268, 4479], [7272, 4459], [7270, 4456], [7271, 4456], [7272, 4458], [7269, 4427], [7248, 4421], [7245, 4400], [7256, 4391], [7313, 4391], [7337, 4406], [7350, 4396], [7372, 4401], [7374, 4384], [7374, 4384], [7388, 4376], [7420, 4372], [7423, 4347], [7414, 4336], [7413, 4303], [7395, 4290], [7396, 4274], [7384, 4260], [7378, 4269], [7364, 4254], [7349, 4251], [7349, 4237], [7367, 4234], [7376, 4201], [7353, 4191], [7344, 4179], [7317, 4181], [7296, 4193], [7281, 4183], [7292, 4157], [7276, 4148], [7288, 4118], [7287, 4098], [7260, 4076], [7259, 4052], [7240, 4029], [7226, 4028], [7212, 4014], [7211, 4001], [7175, 3995], [7176, 3978], [7152, 3971], [7141, 3976], [7140, 3997], [7115, 4012], [7088, 4004], [7075, 4010], [7056, 4004], [7044, 4018], [7024, 4013], [7021, 4026], [7005, 4034], [7005, 4048], [6991, 4069], [6973, 4063], [6963, 4084], [6950, 4085], [6930, 4065], [6942, 4052], [6938, 4038], [6873, 4005], [6847, 4019], [6852, 4027], [6856, 4027], [6856, 4027], [6860, 4032], [6859, 4033], [6859, 4033], [6858, 4033], [6856, 4035], [6853, 4040], [6874, 4055], [6892, 4078], [6895, 4091], [6882, 4092], [6865, 4114], [6849, 4118], [6833, 4111], [6827, 4080], [6811, 4077], [6770, 4051], [6759, 4061], [6745, 4059], [6743, 4077], [6733, 4093], [6736, 4108], [6730, 4146], [6714, 4165], [6698, 4170], [6702, 4193], [6692, 4230], [6681, 4234], [6670, 4254], [6674, 4269], [6687, 4270], [6689, 4294], [6711, 4310], [6729, 4316], [6727, 4328], [6703, 4336], [6689, 4358], [6669, 4351], [6656, 4370], [6646, 4372], [6629, 4360], [6620, 4384], [6609, 4388], [6606, 4402], [6592, 4403], [6592, 4416], [6592, 4436], [6616, 4477], [6647, 4497], [6668, 4503], [6677, 4497], [6696, 4504], [6692, 4514], [6699, 4550], [6701, 4590], [6695, 4603], [6692, 4640], [6681, 4666], [6670, 4658], [6654, 4663], [6647, 4644], [6628, 4647], [6616, 4657], [6617, 4657], [6617, 4657], [6617, 4657], [6616, 4657]]], [[[6860, 4032], [6856, 4027], [6856, 4027], [6852, 4027], [6853, 4040], [6856, 4035], [6858, 4033], [6859, 4033], [6859, 4033], [6859, 4033], [6860, 4032]]], [[[7272, 4459], [7272, 4458], [7271, 4456], [7270, 4456], [7272, 4459]]], [[[6617, 4657], [6617, 4657], [6617, 4657], [6616, 4657], [6616, 4657], [6617, 4657]]]]
                    },
                    "id": "CN.340000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 350000,
                        "name": "福建",
                        "center": [119.306239, 26.075302],
                        "childrenNum": 9,
                        "level": "province",
                        "subFeatureIndex": 12,
                        "fullname": "福建省",
                        "filename": "fujian",
                        "parent": "中国",
                        "areacode": 350000,
                        "longitude": 119.306239,
                        "latitude": 26.075302,
                        "cp": [7396, 3234],
                        "drilldown": "fujian"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7620, 3481], [7607, 3467], [7585, 3469], [7588, 3456], [7576, 3426], [7553, 3428], [7539, 3406], [7558, 3401], [7564, 3386], [7553, 3377], [7559, 3365], [7525, 3355], [7512, 3336], [7498, 3338], [7502, 3354], [7521, 3361], [7541, 3398], [7519, 3397], [7505, 3364], [7497, 3375], [7473, 3373], [7464, 3382], [7447, 3358], [7489, 3351], [7509, 3301], [7526, 3305], [7514, 3290], [7502, 3293], [7468, 3277], [7456, 3257], [7470, 3225], [7481, 3222], [7475, 3197], [7464, 3193], [7465, 3162], [7459, 3148], [7433, 3143], [7457, 3128], [7467, 3102], [7483, 3119], [7483, 3120], [7476, 3129], [7496, 3146], [7498, 3134], [7517, 3120], [7503, 3114], [7514, 3105], [7494, 3094], [7496, 3085], [7470, 3099], [7471, 3072], [7451, 3077], [7438, 3076], [7438, 3095], [7428, 3087], [7430, 3104], [7412, 3110], [7411, 3089], [7398, 3085], [7391, 3102], [7369, 3079], [7400, 3067], [7418, 3050], [7400, 3046], [7396, 3029], [7367, 3042], [7375, 3025], [7366, 2995], [7363, 3009], [7348, 3020], [7357, 3041], [7339, 3037], [7340, 3051], [7322, 3045], [7337, 3035], [7336, 3018], [7315, 3009], [7327, 2997], [7346, 3003], [7340, 2986], [7349, 2983], [7349, 2983], [7326, 2974], [7335, 2963], [7315, 2965], [7272, 2947], [7300, 2940], [7284, 2915], [7279, 2895], [7255, 2880], [7255, 2894], [7232, 2902], [7214, 2884], [7191, 2878], [7169, 2892], [7167, 2891], [7152, 2856], [7160, 2855], [7175, 2824], [7144, 2802], [7096, 2737], [7078, 2734], [7067, 2697], [7043, 2694], [7037, 2668], [7021, 2661], [6981, 2662], [6981, 2677], [6952, 2691], [6943, 2726], [6936, 2732], [6936, 2758], [6927, 2766], [6926, 2787], [6939, 2798], [6925, 2807], [6918, 2841], [6909, 2861], [6895, 2871], [6888, 2888], [6899, 2904], [6892, 2909], [6855, 2903], [6840, 2892], [6832, 2917], [6824, 2916], [6809, 2939], [6783, 2933], [6769, 2951], [6746, 2945], [6735, 2957], [6710, 2964], [6706, 2982], [6717, 2989], [6708, 2999], [6702, 3025], [6717, 3030], [6733, 3050], [6732, 3088], [6743, 3104], [6744, 3136], [6767, 3152], [6756, 3163], [6765, 3178], [6782, 3181], [6803, 3194], [6807, 3209], [6828, 3228], [6824, 3242], [6809, 3240], [6812, 3269], [6833, 3295], [6849, 3287], [6851, 3310], [6836, 3328], [6841, 3349], [6831, 3357], [6839, 3376], [6837, 3391], [6863, 3422], [6909, 3436], [6937, 3451], [6935, 3460], [6960, 3494], [6946, 3505], [6952, 3523], [6942, 3555], [6928, 3555], [6932, 3579], [6944, 3569], [6948, 3584], [6965, 3582], [6983, 3601], [6979, 3624], [6992, 3622], [7027, 3651], [7045, 3624], [7071, 3611], [7080, 3632], [7094, 3644], [7122, 3655], [7141, 3650], [7153, 3672], [7192, 3679], [7195, 3701], [7183, 3708], [7207, 3724], [7209, 3716], [7237, 3723], [7255, 3721], [7259, 3730], [7280, 3715], [7274, 3703], [7281, 3688], [7265, 3675], [7268, 3654], [7285, 3643], [7307, 3576], [7298, 3559], [7306, 3541], [7321, 3550], [7364, 3533], [7379, 3534], [7400, 3561], [7419, 3562], [7424, 3587], [7452, 3591], [7450, 3573], [7466, 3558], [7462, 3541], [7480, 3512], [7495, 3511], [7527, 3530], [7536, 3522], [7552, 3540], [7577, 3544], [7593, 3537], [7612, 3507], [7607, 3496], [7620, 3481]]], [[[7226, 2880], [7239, 2863], [7211, 2851], [7206, 2873], [7218, 2867], [7226, 2880]]], [[[7449, 3040], [7452, 3031], [7431, 3040], [7436, 3053], [7449, 3040]]], [[[7158, 2862], [7160, 2884], [7170, 2889], [7184, 2873], [7171, 2858], [7158, 2862]]], [[[7479, 3364], [7465, 3360], [7466, 3372], [7479, 3364]]]]
                    },
                    "id": "CN.350000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 360000,
                        "name": "江西",
                        "center": [115.892151, 28.676493],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 13,
                        "fullname": "江西省",
                        "filename": "jiangxi",
                        "parent": "中国",
                        "areacode": 360000,
                        "longitude": 115.892151,
                        "latitude": 28.676493,
                        "cp": [6700, 3801],
                        "drilldown": "jiangxi"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6314, 3882], [6316, 3892], [6338, 3917], [6375, 3924], [6377, 3949], [6428, 3945], [6456, 3960], [6475, 3954], [6509, 3967], [6495, 3979], [6511, 3983], [6522, 4001], [6553, 3987], [6550, 4019], [6593, 4018], [6615, 4040], [6622, 4062], [6653, 4065], [6687, 4042], [6712, 4037], [6745, 4059], [6759, 4061], [6770, 4051], [6811, 4077], [6827, 4080], [6833, 4111], [6849, 4118], [6865, 4114], [6882, 4092], [6895, 4091], [6892, 4078], [6874, 4055], [6853, 4040], [6852, 4027], [6847, 4019], [6873, 4005], [6938, 4038], [6942, 4052], [6930, 4065], [6950, 4085], [6963, 4084], [6973, 4063], [6991, 4069], [7005, 4048], [7005, 4034], [7021, 4026], [7024, 4013], [7044, 4018], [7056, 4004], [7075, 4010], [7088, 4004], [7115, 4012], [7140, 3997], [7141, 3976], [7152, 3971], [7155, 3960], [7142, 3946], [7130, 3947], [7121, 3919], [7123, 3903], [7138, 3881], [7138, 3881], [7170, 3865], [7178, 3843], [7193, 3835], [7193, 3835], [7204, 3812], [7203, 3791], [7203, 3791], [7203, 3781], [7203, 3780], [7203, 3780], [7204, 3779], [7203, 3780], [7204, 3779], [7213, 3768], [7206, 3749], [7217, 3733], [7207, 3724], [7183, 3708], [7195, 3701], [7192, 3679], [7153, 3672], [7141, 3650], [7122, 3655], [7094, 3644], [7080, 3632], [7071, 3611], [7045, 3624], [7027, 3651], [6992, 3622], [6979, 3624], [6983, 3601], [6965, 3582], [6948, 3584], [6944, 3569], [6932, 3579], [6928, 3555], [6942, 3555], [6952, 3523], [6946, 3505], [6960, 3494], [6935, 3460], [6937, 3451], [6909, 3436], [6863, 3422], [6837, 3391], [6839, 3376], [6831, 3357], [6841, 3349], [6836, 3328], [6851, 3310], [6849, 3287], [6833, 3295], [6812, 3269], [6809, 3240], [6824, 3242], [6828, 3228], [6807, 3209], [6803, 3194], [6782, 3181], [6765, 3178], [6756, 3163], [6767, 3152], [6744, 3136], [6743, 3104], [6732, 3088], [6733, 3050], [6717, 3030], [6702, 3025], [6708, 2999], [6717, 2989], [6706, 2982], [6710, 2964], [6714, 2951], [6696, 2957], [6683, 2922], [6702, 2880], [6670, 2876], [6666, 2889], [6646, 2892], [6643, 2907], [6613, 2931], [6602, 2918], [6592, 2923], [6549, 2904], [6541, 2910], [6511, 2901], [6503, 2879], [6474, 2889], [6469, 2870], [6461, 2883], [6446, 2873], [6434, 2877], [6413, 2861], [6405, 2878], [6388, 2881], [6378, 2896], [6360, 2906], [6381, 2909], [6394, 2919], [6407, 2948], [6406, 2965], [6428, 2976], [6440, 2993], [6456, 2992], [6475, 3003], [6463, 3019], [6476, 3037], [6455, 3048], [6434, 3069], [6403, 3046], [6389, 3051], [6379, 3041], [6352, 3045], [6333, 3032], [6336, 3054], [6314, 3074], [6322, 3110], [6308, 3132], [6320, 3162], [6331, 3175], [6327, 3201], [6334, 3216], [6373, 3233], [6362, 3247], [6343, 3237], [6314, 3236], [6331, 3259], [6332, 3283], [6343, 3290], [6340, 3307], [6347, 3328], [6308, 3336], [6297, 3348], [6292, 3379], [6311, 3411], [6290, 3431], [6281, 3453], [6295, 3473], [6300, 3509], [6249, 3500], [6252, 3514], [6242, 3540], [6247, 3563], [6278, 3602], [6272, 3622], [6276, 3632], [6298, 3648], [6308, 3645], [6335, 3660], [6324, 3683], [6347, 3688], [6376, 3720], [6376, 3736], [6360, 3744], [6369, 3756], [6342, 3772], [6357, 3818], [6356, 3834], [6341, 3834], [6327, 3861], [6319, 3859], [6314, 3882]]]]
                    },
                    "id": "CN.360000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 370000,
                        "name": "山东",
                        "center": [117.000923, 36.675807],
                        "childrenNum": 17,
                        "level": "province",
                        "subFeatureIndex": 14,
                        "fullname": "山东省",
                        "filename": "shandong",
                        "parent": "中国",
                        "areacode": 370000,
                        "longitude": 117.000923,
                        "latitude": 36.675807,
                        "cp": [6886, 5627],
                        "drilldown": "shandong"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7690, 5876], [7713, 5840], [7730, 5833], [7742, 5846], [7748, 5841], [7796, 5844], [7826, 5864], [7841, 5838], [7854, 5846], [7863, 5836], [7888, 5835], [7901, 5840], [7914, 5834], [7935, 5841], [7919, 5809], [7930, 5786], [7922, 5774], [7908, 5774], [7902, 5747], [7922, 5753], [7916, 5717], [7882, 5698], [7850, 5700], [7843, 5721], [7826, 5713], [7818, 5726], [7774, 5703], [7773, 5697], [7748, 5684], [7753, 5667], [7723, 5681], [7717, 5672], [7672, 5651], [7639, 5627], [7605, 5636], [7631, 5620], [7615, 5580], [7603, 5601], [7590, 5599], [7578, 5582], [7588, 5569], [7573, 5568], [7584, 5521], [7541, 5511], [7516, 5499], [7506, 5503], [7518, 5535], [7484, 5535], [7471, 5517], [7497, 5499], [7492, 5488], [7507, 5493], [7501, 5480], [7465, 5457], [7456, 5420], [7440, 5431], [7441, 5402], [7402, 5396], [7393, 5385], [7371, 5333], [7347, 5305], [7341, 5270], [7329, 5269], [7325, 5278], [7297, 5273], [7293, 5263], [7258, 5261], [7246, 5256], [7245, 5236], [7230, 5201], [7220, 5190], [7232, 5185], [7215, 5174], [7198, 5182], [7172, 5168], [7165, 5153], [7169, 5138], [7162, 5115], [7141, 5114], [7120, 5103], [7119, 5120], [7110, 5126], [7120, 5140], [7100, 5146], [7100, 5166], [7075, 5170], [7066, 5162], [7045, 5163], [7047, 5133], [7025, 5139], [7008, 5119], [6984, 5124], [6971, 5143], [6956, 5144], [6956, 5144], [6956, 5142], [6956, 5142], [6956, 5142], [6956, 5142], [6952, 5140], [6952, 5140], [6942, 5114], [6929, 5119], [6921, 5156], [6909, 5157], [6911, 5172], [6894, 5193], [6887, 5211], [6860, 5223], [6832, 5225], [6788, 5214], [6782, 5204], [6776, 5155], [6758, 5148], [6751, 5135], [6742, 5140], [6731, 5136], [6724, 5147], [6673, 5136], [6648, 5143], [6642, 5135], [6613, 5140], [6603, 5153], [6596, 5191], [6575, 5204], [6563, 5200], [6562, 5214], [6551, 5216], [6539, 5237], [6520, 5229], [6500, 5228], [6481, 5238], [6492, 5258], [6485, 5270], [6502, 5281], [6501, 5292], [6518, 5319], [6532, 5331], [6559, 5333], [6581, 5351], [6586, 5367], [6605, 5400], [6644, 5410], [6659, 5434], [6678, 5435], [6684, 5458], [6710, 5461], [6719, 5494], [6699, 5478], [6635, 5449], [6607, 5440], [6607, 5443], [6608, 5446], [6608, 5446], [6605, 5444], [6602, 5443], [6602, 5443], [6601, 5441], [6601, 5441], [6601, 5440], [6601, 5439], [6601, 5440], [6601, 5440], [6601, 5439], [6601, 5439], [6601, 5440], [6601, 5439], [6600, 5436], [6582, 5416], [6577, 5419], [6581, 5460], [6597, 5470], [6604, 5501], [6600, 5527], [6600, 5527], [6581, 5538], [6570, 5573], [6570, 5573], [6565, 5579], [6581, 5610], [6602, 5643], [6640, 5654], [6645, 5672], [6660, 5692], [6656, 5697], [6673, 5717], [6681, 5747], [6692, 5755], [6694, 5775], [6707, 5785], [6728, 5789], [6741, 5784], [6750, 5794], [6739, 5800], [6741, 5814], [6741, 5814], [6748, 5809], [6751, 5830], [6759, 5835], [6767, 5822], [6767, 5822], [6767, 5822], [6767, 5822], [6777, 5811], [6830, 5875], [6841, 5898], [6885, 5896], [6898, 5900], [6930, 5899], [6944, 5905], [6962, 5903], [6975, 5924], [6988, 5954], [7009, 5956], [7022, 5970], [7028, 5992], [7044, 6009], [7063, 5989], [7072, 5988], [7090, 6009], [7077, 5979], [7125, 5970], [7157, 5968], [7167, 5955], [7176, 5973], [7198, 5979], [7222, 5980], [7244, 5966], [7251, 5943], [7271, 5927], [7275, 5902], [7291, 5902], [7300, 5877], [7267, 5874], [7252, 5859], [7242, 5834], [7251, 5793], [7265, 5771], [7279, 5772], [7311, 5759], [7317, 5740], [7347, 5746], [7362, 5739], [7394, 5748], [7421, 5779], [7411, 5804], [7466, 5831], [7484, 5849], [7478, 5864], [7488, 5868], [7479, 5881], [7505, 5883], [7523, 5898], [7547, 5901], [7572, 5917], [7610, 5916], [7629, 5893], [7647, 5895], [7652, 5870], [7664, 5863], [7689, 5867], [7690, 5876]]], [[[6607, 5443], [6607, 5440], [6600, 5436], [6601, 5439], [6601, 5440], [6601, 5439], [6601, 5439], [6601, 5440], [6601, 5440], [6601, 5439], [6601, 5440], [6601, 5441], [6601, 5441], [6602, 5443], [6602, 5443], [6605, 5444], [6607, 5443]]], [[[7714, 5864], [7714, 5864], [7714, 5864], [7713, 5864], [7713, 5864], [7714, 5864]]], [[[7714, 5864], [7714, 5864], [7714, 5864], [7714, 5864], [7714, 5864], [7714, 5864]]]]
                    },
                    "id": "CN.370000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 410000,
                        "name": "河南",
                        "center": [113.665412, 34.757975],
                        "childrenNum": 18,
                        "level": "province",
                        "subFeatureIndex": 15,
                        "fullname": "河南省",
                        "filename": "henan",
                        "parent": "中国",
                        "areacode": 410000,
                        "longitude": 113.665412,
                        "latitude": 34.757975,
                        "cp": [6262, 5179],
                        "drilldown": "henan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6742, 5140], [6744, 5125], [6736, 5113], [6746, 5096], [6756, 5095], [6784, 5072], [6784, 5072], [6804, 5077], [6814, 5049], [6808, 5034], [6816, 5025], [6816, 5025], [6830, 5003], [6830, 4986], [6791, 4974], [6791, 4964], [6768, 4956], [6758, 4947], [6737, 4942], [6722, 4958], [6718, 4976], [6705, 4985], [6707, 5000], [6699, 5009], [6683, 5008], [6656, 5025], [6632, 5014], [6621, 4978], [6636, 4978], [6634, 4956], [6624, 4955], [6639, 4912], [6597, 4905], [6583, 4893], [6577, 4864], [6587, 4855], [6575, 4810], [6550, 4798], [6526, 4797], [6511, 4811], [6499, 4807], [6503, 4781], [6495, 4775], [6507, 4763], [6544, 4754], [6556, 4745], [6553, 4702], [6557, 4685], [6577, 4676], [6597, 4675], [6616, 4657], [6616, 4657], [6628, 4647], [6647, 4644], [6654, 4663], [6670, 4658], [6681, 4666], [6692, 4640], [6695, 4603], [6701, 4590], [6699, 4550], [6692, 4514], [6696, 4504], [6677, 4497], [6668, 4503], [6647, 4497], [6616, 4477], [6592, 4436], [6592, 4416], [6578, 4411], [6563, 4420], [6565, 4450], [6544, 4459], [6537, 4438], [6524, 4443], [6487, 4427], [6477, 4441], [6461, 4442], [6450, 4455], [6434, 4450], [6432, 4469], [6439, 4496], [6412, 4488], [6382, 4493], [6363, 4515], [6352, 4514], [6343, 4500], [6323, 4493], [6317, 4517], [6294, 4517], [6285, 4558], [6273, 4568], [6284, 4592], [6277, 4611], [6279, 4610], [6278, 4616], [6279, 4617], [6278, 4638], [6261, 4645], [6253, 4632], [6214, 4611], [6173, 4648], [6155, 4635], [6137, 4647], [6131, 4636], [6106, 4640], [6081, 4633], [6080, 4634], [6045, 4642], [6027, 4629], [6015, 4635], [6003, 4624], [5984, 4639], [5942, 4654], [5930, 4670], [5919, 4666], [5871, 4697], [5859, 4688], [5822, 4742], [5805, 4749], [5796, 4766], [5802, 4775], [5795, 4791], [5778, 4794], [5784, 4808], [5761, 4826], [5756, 4830], [5747, 4841], [5756, 4858], [5750, 4882], [5756, 4890], [5756, 4891], [5752, 4914], [5728, 4928], [5711, 4965], [5674, 4987], [5690, 4998], [5676, 5034], [5686, 5049], [5648, 5069], [5646, 5076], [5661, 5090], [5642, 5112], [5642, 5112], [5634, 5132], [5638, 5151], [5656, 5154], [5667, 5146], [5701, 5151], [5709, 5161], [5734, 5158], [5743, 5179], [5750, 5173], [5779, 5184], [5785, 5195], [5801, 5191], [5823, 5200], [5865, 5202], [5884, 5235], [5928, 5256], [5959, 5250], [5962, 5287], [5959, 5301], [6045, 5286], [6068, 5288], [6066, 5297], [6092, 5283], [6102, 5295], [6120, 5292], [6135, 5304], [6136, 5319], [6160, 5312], [6173, 5339], [6193, 5333], [6196, 5346], [6228, 5355], [6246, 5381], [6251, 5419], [6261, 5428], [6257, 5463], [6268, 5472], [6260, 5505], [6272, 5526], [6275, 5549], [6292, 5542], [6303, 5547], [6309, 5538], [6322, 5548], [6336, 5542], [6337, 5529], [6357, 5522], [6357, 5522], [6390, 5525], [6436, 5496], [6497, 5498], [6497, 5478], [6513, 5482], [6525, 5507], [6551, 5515], [6551, 5515], [6572, 5487], [6604, 5501], [6597, 5470], [6581, 5460], [6577, 5419], [6582, 5416], [6600, 5436], [6607, 5440], [6635, 5449], [6699, 5478], [6719, 5494], [6710, 5461], [6684, 5458], [6678, 5435], [6659, 5434], [6644, 5410], [6605, 5400], [6586, 5367], [6581, 5351], [6559, 5333], [6532, 5331], [6518, 5319], [6501, 5292], [6502, 5281], [6485, 5270], [6492, 5258], [6481, 5238], [6500, 5228], [6520, 5229], [6539, 5237], [6551, 5216], [6562, 5214], [6563, 5200], [6575, 5204], [6596, 5191], [6603, 5153], [6613, 5140], [6642, 5135], [6648, 5143], [6673, 5136], [6724, 5147], [6731, 5136], [6742, 5140]]], [[[6607, 5443], [6605, 5444], [6608, 5446], [6608, 5446], [6607, 5443]]], [[[6277, 4611], [6279, 4617], [6278, 4616], [6279, 4610], [6277, 4611]]]]
                    },
                    "id": "CN.410000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 420000,
                        "name": "湖北",
                        "center": [114.298572, 30.584355],
                        "childrenNum": 17,
                        "level": "province",
                        "subFeatureIndex": 16,
                        "fullname": "湖北省",
                        "filename": "hubei",
                        "parent": "中国",
                        "areacode": 420000,
                        "longitude": 114.298572,
                        "latitude": 30.584355,
                        "cp": [6384, 4229],
                        "drilldown": "hubei"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5383, 3912], [5360, 3935], [5361, 3967], [5323, 3961], [5326, 3985], [5316, 3987], [5323, 4016], [5311, 4036], [5299, 4031], [5281, 4044], [5277, 4079], [5265, 4084], [5244, 4050], [5231, 4057], [5229, 4074], [5219, 4081], [5248, 4089], [5254, 4115], [5249, 4128], [5260, 4150], [5264, 4173], [5241, 4197], [5229, 4201], [5235, 4227], [5263, 4221], [5287, 4247], [5297, 4225], [5310, 4224], [5343, 4254], [5371, 4257], [5366, 4242], [5368, 4239], [5376, 4229], [5407, 4253], [5418, 4234], [5417, 4220], [5433, 4244], [5464, 4265], [5502, 4299], [5524, 4310], [5547, 4306], [5561, 4287], [5579, 4327], [5572, 4329], [5570, 4352], [5583, 4361], [5575, 4420], [5559, 4425], [5538, 4447], [5520, 4458], [5494, 4460], [5503, 4470], [5498, 4492], [5470, 4499], [5480, 4518], [5470, 4539], [5480, 4552], [5472, 4564], [5479, 4585], [5474, 4611], [5456, 4630], [5458, 4650], [5472, 4676], [5485, 4684], [5484, 4697], [5502, 4699], [5519, 4691], [5538, 4694], [5558, 4683], [5571, 4698], [5584, 4693], [5595, 4702], [5585, 4714], [5586, 4733], [5577, 4747], [5554, 4761], [5511, 4767], [5518, 4803], [5498, 4815], [5476, 4814], [5450, 4824], [5470, 4845], [5486, 4851], [5507, 4841], [5530, 4844], [5564, 4830], [5590, 4834], [5600, 4823], [5648, 4826], [5662, 4842], [5672, 4822], [5692, 4806], [5701, 4817], [5716, 4819], [5747, 4841], [5756, 4830], [5757, 4825], [5756, 4823], [5761, 4826], [5784, 4808], [5778, 4794], [5795, 4791], [5802, 4775], [5796, 4766], [5805, 4749], [5822, 4742], [5859, 4688], [5871, 4697], [5919, 4666], [5930, 4670], [5942, 4654], [5984, 4639], [6003, 4624], [6015, 4635], [6027, 4629], [6045, 4642], [6080, 4634], [6080, 4633], [6081, 4633], [6081, 4633], [6106, 4640], [6131, 4636], [6137, 4647], [6155, 4635], [6173, 4648], [6214, 4611], [6253, 4632], [6261, 4645], [6278, 4638], [6279, 4617], [6277, 4611], [6284, 4592], [6273, 4568], [6285, 4558], [6294, 4517], [6317, 4517], [6323, 4493], [6343, 4500], [6352, 4514], [6363, 4515], [6382, 4493], [6412, 4488], [6439, 4496], [6432, 4469], [6434, 4450], [6450, 4455], [6461, 4442], [6477, 4441], [6487, 4427], [6524, 4443], [6537, 4438], [6544, 4459], [6565, 4450], [6563, 4420], [6578, 4411], [6592, 4416], [6592, 4403], [6606, 4402], [6609, 4388], [6620, 4384], [6629, 4360], [6646, 4372], [6656, 4370], [6669, 4351], [6689, 4358], [6703, 4336], [6727, 4328], [6729, 4316], [6711, 4310], [6689, 4294], [6687, 4270], [6674, 4269], [6670, 4254], [6681, 4234], [6692, 4230], [6702, 4193], [6698, 4170], [6714, 4165], [6730, 4146], [6736, 4108], [6733, 4093], [6743, 4077], [6745, 4059], [6712, 4037], [6687, 4042], [6653, 4065], [6622, 4062], [6615, 4040], [6593, 4018], [6550, 4019], [6553, 3987], [6522, 4001], [6511, 3983], [6495, 3979], [6509, 3967], [6475, 3954], [6456, 3960], [6428, 3945], [6377, 3949], [6375, 3924], [6338, 3917], [6316, 3892], [6314, 3882], [6301, 3879], [6289, 3895], [6276, 3885], [6259, 3910], [6264, 3924], [6248, 3929], [6264, 3960], [6277, 3971], [6253, 3989], [6274, 4001], [6259, 4026], [6236, 4024], [6240, 4062], [6203, 4030], [6157, 3973], [6144, 3971], [6140, 3990], [6118, 3979], [6111, 4009], [6129, 4028], [6133, 4046], [6117, 4049], [6117, 4045], [6114, 4044], [6102, 4049], [6088, 4038], [6087, 4026], [6067, 4006], [6018, 4016], [6004, 3995], [5987, 3994], [5991, 4005], [5954, 4022], [5947, 4040], [5923, 4054], [5925, 4063], [5905, 4067], [5895, 4078], [5878, 4080], [5878, 4080], [5875, 4077], [5875, 4077], [5813, 4082], [5784, 4110], [5723, 4117], [5722, 4128], [5687, 4129], [5680, 4111], [5668, 4121], [5638, 4117], [5649, 4101], [5637, 4084], [5657, 4068], [5665, 4054], [5638, 4035], [5609, 4023], [5582, 4048], [5561, 4059], [5543, 4055], [5513, 4056], [5495, 4053], [5482, 4034], [5482, 4021], [5443, 4025], [5431, 4000], [5407, 3968], [5408, 3949], [5389, 3935], [5392, 3913], [5383, 3912]]], [[[6133, 4046], [6114, 4028], [6114, 4044], [6117, 4045], [6117, 4049], [6133, 4046]]], [[[5756, 4830], [5761, 4826], [5756, 4823], [5757, 4825], [5756, 4830]]], [[[5369, 4240], [5367, 4242], [5368, 4243], [5369, 4241], [5369, 4240]]], [[[6081, 4633], [6080, 4633], [6080, 4634], [6081, 4633], [6081, 4633]]]]
                    },
                    "id": "CN.420000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 430000,
                        "name": "湖南",
                        "center": [112.982279, 28.19409],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 17,
                        "fullname": "湖南省",
                        "filename": "hunan",
                        "parent": "中国",
                        "areacode": 430000,
                        "longitude": 112.982279,
                        "latitude": 28.19409,
                        "cp": [6123, 3691],
                        "drilldown": "hunan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5512, 3253], [5523, 3286], [5507, 3316], [5491, 3314], [5499, 3327], [5486, 3345], [5511, 3363], [5489, 3373], [5486, 3385], [5452, 3381], [5453, 3370], [5439, 3365], [5427, 3377], [5431, 3376], [5431, 3376], [5427, 3378], [5426, 3379], [5423, 3392], [5422, 3397], [5420, 3412], [5434, 3423], [5427, 3448], [5414, 3451], [5418, 3466], [5407, 3470], [5377, 3466], [5356, 3452], [5339, 3464], [5298, 3439], [5282, 3459], [5299, 3463], [5306, 3485], [5333, 3500], [5354, 3531], [5366, 3538], [5386, 3532], [5387, 3543], [5419, 3563], [5421, 3588], [5395, 3612], [5398, 3625], [5390, 3651], [5405, 3668], [5389, 3669], [5399, 3703], [5409, 3720], [5386, 3730], [5388, 3772], [5397, 3791], [5394, 3801], [5374, 3795], [5394, 3828], [5383, 3835], [5383, 3859], [5400, 3895], [5383, 3912], [5392, 3913], [5389, 3935], [5408, 3949], [5407, 3968], [5431, 4000], [5443, 4025], [5482, 4021], [5482, 4034], [5495, 4053], [5513, 4056], [5543, 4055], [5561, 4059], [5582, 4048], [5609, 4023], [5638, 4035], [5665, 4054], [5657, 4068], [5637, 4084], [5649, 4101], [5638, 4117], [5668, 4121], [5680, 4111], [5687, 4129], [5722, 4128], [5723, 4117], [5784, 4110], [5813, 4082], [5875, 4077], [5875, 4077], [5878, 4080], [5878, 4080], [5895, 4078], [5905, 4067], [5925, 4063], [5923, 4054], [5947, 4040], [5954, 4022], [5991, 4005], [5987, 3994], [6004, 3995], [6018, 4016], [6067, 4006], [6087, 4026], [6088, 4038], [6102, 4049], [6114, 4044], [6114, 4028], [6133, 4046], [6129, 4028], [6111, 4009], [6118, 3979], [6140, 3990], [6144, 3971], [6157, 3973], [6203, 4030], [6240, 4062], [6236, 4024], [6259, 4026], [6274, 4001], [6253, 3989], [6277, 3971], [6264, 3960], [6248, 3929], [6264, 3924], [6259, 3910], [6276, 3885], [6289, 3895], [6301, 3879], [6314, 3882], [6319, 3859], [6327, 3861], [6341, 3834], [6356, 3834], [6357, 3818], [6342, 3772], [6369, 3756], [6360, 3744], [6376, 3736], [6376, 3720], [6347, 3688], [6324, 3683], [6335, 3660], [6308, 3645], [6298, 3648], [6276, 3632], [6272, 3622], [6278, 3602], [6247, 3563], [6242, 3540], [6252, 3514], [6249, 3500], [6300, 3509], [6295, 3473], [6281, 3453], [6290, 3431], [6311, 3411], [6292, 3379], [6297, 3348], [6308, 3336], [6347, 3328], [6340, 3307], [6343, 3290], [6332, 3283], [6331, 3259], [6314, 3236], [6343, 3237], [6362, 3247], [6373, 3233], [6334, 3216], [6327, 3201], [6331, 3175], [6320, 3162], [6308, 3132], [6322, 3110], [6314, 3074], [6302, 3073], [6289, 3050], [6275, 3057], [6247, 3049], [6247, 3049], [6231, 3058], [6214, 3056], [6198, 3066], [6186, 3085], [6173, 3091], [6147, 3076], [6139, 3062], [6102, 3046], [6095, 3032], [6121, 3031], [6129, 3021], [6116, 3008], [6126, 2995], [6118, 2984], [6124, 2964], [6096, 2953], [6077, 2954], [6064, 2995], [6053, 3006], [6003, 3009], [5994, 3020], [5981, 3013], [5957, 3019], [5950, 2984], [5943, 2970], [5954, 2962], [5953, 2947], [5938, 2939], [5923, 2920], [5908, 2927], [5855, 2930], [5830, 2900], [5802, 2910], [5812, 2935], [5811, 2964], [5803, 2975], [5804, 3001], [5781, 3004], [5772, 3014], [5756, 2997], [5736, 2989], [5736, 2969], [5713, 2965], [5706, 2991], [5716, 3017], [5739, 3029], [5738, 3045], [5778, 3081], [5787, 3115], [5781, 3141], [5808, 3152], [5806, 3169], [5818, 3174], [5789, 3183], [5770, 3174], [5758, 3194], [5774, 3217], [5777, 3264], [5762, 3273], [5739, 3273], [5710, 3288], [5708, 3268], [5672, 3261], [5643, 3281], [5631, 3271], [5623, 3248], [5593, 3227], [5583, 3202], [5569, 3199], [5559, 3223], [5551, 3214], [5531, 3220], [5539, 3247], [5512, 3253]]], [[[5413, 3219], [5407, 3235], [5415, 3245], [5415, 3245], [5406, 3266], [5412, 3282], [5386, 3272], [5375, 3279], [5384, 3308], [5401, 3331], [5392, 3368], [5412, 3382], [5426, 3379], [5427, 3378], [5427, 3377], [5439, 3365], [5453, 3370], [5452, 3381], [5486, 3385], [5489, 3373], [5511, 3363], [5486, 3345], [5499, 3327], [5491, 3314], [5507, 3316], [5523, 3286], [5512, 3253], [5500, 3242], [5490, 3216], [5474, 3208], [5478, 3182], [5453, 3184], [5463, 3208], [5444, 3222], [5419, 3211], [5413, 3219]]]]
                    },
                    "id": "CN.430000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 440000,
                        "name": "广东",
                        "center": [113.280637, 23.125178],
                        "childrenNum": 22,
                        "level": "province",
                        "subFeatureIndex": 18,
                        "fullname": "广东省",
                        "filename": "guangdong",
                        "parent": "中国",
                        "areacode": 440000,
                        "longitude": 113.280637,
                        "latitude": 23.125178,
                        "cp": [6177, 2558],
                        "drilldown": "guangdong"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5448, 2198], [5440, 2234], [5472, 2240], [5481, 2259], [5483, 2283], [5505, 2286], [5520, 2295], [5536, 2294], [5536, 2294], [5575, 2291], [5569, 2330], [5569, 2330], [5568, 2332], [5568, 2332], [5582, 2362], [5597, 2348], [5612, 2359], [5627, 2348], [5630, 2364], [5647, 2380], [5660, 2380], [5645, 2397], [5659, 2444], [5717, 2457], [5718, 2475], [5748, 2477], [5780, 2510], [5782, 2527], [5796, 2542], [5785, 2553], [5788, 2581], [5781, 2599], [5791, 2639], [5808, 2653], [5810, 2674], [5836, 2676], [5847, 2693], [5837, 2695], [5847, 2719], [5877, 2713], [5877, 2731], [5904, 2753], [5891, 2780], [5892, 2807], [5904, 2807], [5923, 2822], [5929, 2841], [5914, 2860], [5919, 2874], [5905, 2888], [5910, 2916], [5923, 2920], [5938, 2939], [5953, 2947], [5954, 2962], [5943, 2970], [5950, 2984], [5957, 3019], [5981, 3013], [5994, 3020], [6003, 3009], [6053, 3006], [6064, 2995], [6077, 2954], [6096, 2953], [6124, 2964], [6118, 2984], [6126, 2995], [6116, 3008], [6129, 3021], [6121, 3031], [6095, 3032], [6102, 3046], [6139, 3062], [6147, 3076], [6173, 3091], [6186, 3085], [6198, 3066], [6214, 3056], [6231, 3058], [6247, 3049], [6247, 3049], [6275, 3057], [6289, 3050], [6302, 3073], [6314, 3074], [6336, 3054], [6333, 3032], [6352, 3045], [6379, 3041], [6389, 3051], [6403, 3046], [6434, 3069], [6455, 3048], [6476, 3037], [6463, 3019], [6475, 3003], [6456, 2992], [6440, 2993], [6428, 2976], [6406, 2965], [6407, 2948], [6394, 2919], [6381, 2909], [6360, 2906], [6378, 2896], [6388, 2881], [6405, 2878], [6413, 2861], [6434, 2877], [6446, 2873], [6461, 2883], [6469, 2870], [6474, 2889], [6503, 2879], [6511, 2901], [6541, 2910], [6549, 2904], [6592, 2923], [6602, 2918], [6613, 2931], [6643, 2907], [6646, 2892], [6666, 2889], [6670, 2876], [6702, 2880], [6683, 2922], [6696, 2957], [6714, 2951], [6710, 2964], [6735, 2957], [6746, 2945], [6769, 2951], [6783, 2933], [6809, 2939], [6824, 2916], [6832, 2917], [6840, 2892], [6855, 2903], [6892, 2909], [6899, 2904], [6888, 2888], [6895, 2871], [6909, 2861], [6918, 2841], [6925, 2807], [6939, 2798], [6926, 2787], [6927, 2766], [6936, 2758], [6936, 2732], [6943, 2726], [6952, 2691], [6981, 2677], [6981, 2662], [6953, 2657], [6944, 2648], [6926, 2654], [6916, 2635], [6916, 2635], [6916, 2628], [6916, 2628], [6898, 2605], [6903, 2580], [6890, 2583], [6851, 2559], [6857, 2537], [6842, 2519], [6817, 2516], [6803, 2523], [6785, 2514], [6760, 2492], [6753, 2498], [6714, 2484], [6696, 2474], [6695, 2490], [6667, 2502], [6644, 2478], [6657, 2477], [6651, 2454], [6629, 2464], [6611, 2461], [6602, 2481], [6579, 2481], [6581, 2492], [6543, 2481], [6540, 2467], [6507, 2439], [6480, 2437], [6476, 2453], [6480, 2478], [6472, 2483], [6431, 2453], [6450, 2450], [6441, 2437], [6453, 2428], [6452, 2415], [6426, 2407], [6422, 2426], [6410, 2441], [6373, 2428], [6364, 2430], [6364, 2430], [6335, 2419], [6335, 2419], [6332, 2419], [6317, 2420], [6303, 2406], [6270, 2471], [6259, 2469], [6272, 2426], [6249, 2413], [6257, 2400], [6234, 2355], [6233, 2331], [6210, 2310], [6186, 2299], [6169, 2281], [6137, 2322], [6125, 2324], [6126, 2293], [6106, 2273], [6075, 2291], [6045, 2255], [6018, 2255], [6001, 2265], [5996, 2250], [5959, 2243], [5950, 2263], [5917, 2257], [5899, 2237], [5915, 2228], [5870, 2212], [5870, 2222], [5845, 2220], [5842, 2206], [5780, 2199], [5754, 2182], [5760, 2198], [5713, 2190], [5685, 2175], [5658, 2175], [5622, 2140], [5579, 2136], [5571, 2121], [5552, 2115], [5527, 2090], [5531, 2065], [5570, 2053], [5570, 2023], [5586, 2022], [5602, 1976], [5601, 1965], [5581, 1940], [5559, 1929], [5510, 1921], [5503, 1930], [5467, 1923], [5468, 1944], [5457, 1957], [5463, 1979], [5453, 1983], [5444, 2011], [5434, 2012], [5432, 2034], [5417, 2076], [5423, 2127], [5442, 2147], [5441, 2174], [5464, 2177], [5470, 2194], [5448, 2198]]], [[[6963, 2626], [6931, 2629], [6968, 2644], [6963, 2626]]], [[[6087, 2250], [6077, 2238], [6079, 2217], [6061, 2222], [6072, 2234], [6056, 2237], [6082, 2258], [6087, 2250]]], [[[6039, 2223], [6021, 2226], [6048, 2245], [6039, 2223]]], [[[5593, 2110], [5607, 2106], [5601, 2076], [5588, 2089], [5562, 2090], [5531, 2080], [5534, 2091], [5554, 2113], [5593, 2110]]], [[[5595, 2125], [5581, 2133], [5623, 2139], [5612, 2113], [5595, 2125]]], [[[6905, 2039], [6929, 2040], [6940, 2018], [6925, 1999], [6901, 2001], [6922, 2007], [6927, 2032], [6905, 2039]]], [[[5614, 2061], [5604, 2072], [5612, 2081], [5624, 2074], [5614, 2061]]], [[[6731, 2109], [6752, 2112], [6757, 2097], [6741, 2095], [6731, 2109]]]]
                    },
                    "id": "CN.440000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 450000,
                        "name": "广西",
                        "center": [108.320004, 22.82402],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 19,
                        "fullname": "广西壮族自治区",
                        "filename": "guangxi",
                        "parent": "中国",
                        "areacode": 450000,
                        "longitude": 108.320004,
                        "latitude": 22.82402,
                        "cp": [5153, 2512],
                        "drilldown": "guangxi"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5923, 2920], [5910, 2916], [5905, 2888], [5919, 2874], [5914, 2860], [5929, 2841], [5923, 2822], [5904, 2807], [5892, 2807], [5891, 2780], [5904, 2753], [5877, 2731], [5877, 2713], [5847, 2719], [5837, 2695], [5847, 2693], [5836, 2676], [5810, 2674], [5808, 2653], [5791, 2639], [5781, 2599], [5788, 2581], [5785, 2553], [5796, 2542], [5782, 2527], [5780, 2510], [5748, 2477], [5718, 2475], [5717, 2457], [5659, 2444], [5645, 2397], [5660, 2380], [5647, 2380], [5630, 2364], [5627, 2348], [5612, 2359], [5597, 2348], [5582, 2362], [5568, 2332], [5568, 2332], [5569, 2330], [5569, 2330], [5575, 2291], [5536, 2294], [5536, 2294], [5520, 2295], [5505, 2286], [5483, 2283], [5481, 2259], [5472, 2240], [5440, 2234], [5448, 2198], [5431, 2200], [5412, 2221], [5397, 2201], [5335, 2194], [5312, 2187], [5293, 2204], [5316, 2217], [5314, 2226], [5272, 2233], [5261, 2241], [5232, 2236], [5225, 2247], [5201, 2255], [5176, 2226], [5147, 2226], [5124, 2216], [5126, 2241], [5098, 2221], [5083, 2230], [5068, 2228], [5048, 2254], [4983, 2242], [4967, 2259], [4950, 2245], [4935, 2277], [4921, 2271], [4889, 2295], [4874, 2300], [4885, 2320], [4872, 2327], [4819, 2343], [4807, 2341], [4815, 2358], [4807, 2383], [4813, 2388], [4807, 2416], [4786, 2420], [4787, 2446], [4799, 2477], [4819, 2470], [4832, 2506], [4848, 2518], [4801, 2549], [4751, 2536], [4734, 2539], [4719, 2564], [4681, 2569], [4675, 2557], [4654, 2558], [4621, 2588], [4590, 2590], [4585, 2617], [4583, 2631], [4618, 2655], [4620, 2664], [4645, 2686], [4661, 2689], [4682, 2671], [4712, 2696], [4708, 2705], [4717, 2731], [4714, 2747], [4725, 2753], [4699, 2813], [4676, 2822], [4666, 2804], [4628, 2812], [4617, 2805], [4613, 2826], [4593, 2827], [4582, 2803], [4550, 2827], [4537, 2815], [4526, 2826], [4532, 2839], [4521, 2867], [4526, 2880], [4502, 2899], [4502, 2899], [4485, 2897], [4456, 2906], [4434, 2907], [4428, 2880], [4409, 2893], [4388, 2957], [4397, 2973], [4417, 2956], [4439, 2946], [4460, 2957], [4472, 2973], [4500, 2980], [4511, 3008], [4512, 3008], [4515, 3010], [4515, 3010], [4536, 3024], [4549, 3009], [4570, 3011], [4586, 3004], [4595, 2979], [4637, 2968], [4661, 2952], [4684, 2956], [4700, 2934], [4705, 2945], [4732, 2961], [4739, 2981], [4728, 3003], [4743, 3010], [4761, 3008], [4820, 3030], [4840, 3050], [4850, 3046], [4884, 3051], [4887, 3062], [4908, 3068], [4908, 3086], [4899, 3105], [4921, 3120], [4921, 3131], [4954, 3140], [4975, 3107], [4971, 3094], [4991, 3091], [4993, 3068], [5003, 3070], [5000, 3051], [5026, 3058], [5039, 3072], [5046, 3044], [5055, 3054], [5074, 3026], [5107, 3042], [5131, 3045], [5139, 3070], [5138, 3085], [5181, 3116], [5194, 3094], [5205, 3098], [5235, 3063], [5233, 3104], [5250, 3133], [5265, 3135], [5268, 3117], [5302, 3116], [5317, 3106], [5330, 3114], [5319, 3132], [5330, 3152], [5314, 3156], [5304, 3145], [5304, 3145], [5293, 3152], [5312, 3166], [5343, 3168], [5344, 3156], [5383, 3153], [5383, 3176], [5403, 3197], [5398, 3205], [5413, 3219], [5419, 3211], [5444, 3222], [5463, 3208], [5453, 3184], [5478, 3182], [5474, 3208], [5490, 3216], [5500, 3242], [5512, 3253], [5539, 3247], [5531, 3220], [5551, 3214], [5559, 3223], [5569, 3199], [5583, 3202], [5593, 3227], [5623, 3248], [5631, 3271], [5643, 3281], [5672, 3261], [5708, 3268], [5710, 3288], [5739, 3273], [5762, 3273], [5777, 3264], [5774, 3217], [5758, 3194], [5770, 3174], [5789, 3183], [5818, 3174], [5806, 3169], [5808, 3152], [5781, 3141], [5787, 3115], [5778, 3081], [5738, 3045], [5739, 3029], [5716, 3017], [5706, 2991], [5713, 2965], [5736, 2969], [5736, 2989], [5756, 2997], [5772, 3014], [5781, 3004], [5804, 3001], [5803, 2975], [5811, 2964], [5812, 2935], [5802, 2910], [5830, 2900], [5855, 2930], [5908, 2927], [5923, 2920]]], [[[4512, 3008], [4511, 3008], [4515, 3010], [4515, 3010], [4512, 3008]]]]
                    },
                    "id": "CN.450000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 460000,
                        "name": "海南",
                        "center": [110.33119, 20.031971],
                        "childrenNum": 19,
                        "level": "province",
                        "subFeatureIndex": 20,
                        "fullname": "海南省",
                        "filename": "hainan",
                        "parent": "中国",
                        "areacode": 460000,
                        "longitude": 110.33119,
                        "latitude": 20.031971,
                        "cp": [5554, 1878],
                        "drilldown": "hainan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5322, 1847], [5337, 1859], [5378, 1847], [5397, 1872], [5424, 1878], [5434, 1870], [5477, 1872], [5507, 1878], [5515, 1889], [5546, 1884], [5552, 1895], [5595, 1887], [5603, 1894], [5636, 1902], [5641, 1886], [5667, 1871], [5688, 1871], [5708, 1785], [5676, 1769], [5659, 1747], [5635, 1731], [5610, 1681], [5600, 1600], [5583, 1593], [5582, 1570], [5546, 1569], [5529, 1562], [5501, 1540], [5494, 1516], [5480, 1508], [5458, 1512], [5429, 1505], [5421, 1472], [5385, 1462], [5337, 1479], [5323, 1491], [5291, 1493], [5287, 1505], [5250, 1504], [5239, 1526], [5197, 1535], [5188, 1545], [5193, 1586], [5179, 1617], [5190, 1641], [5182, 1691], [5186, 1720], [5199, 1742], [5220, 1747], [5282, 1794], [5308, 1819], [5306, 1831], [5322, 1847]]]]
                    },
                    "id": "CN.460000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 500000,
                        "name": "重庆",
                        "center": [106.504962, 29.533155],
                        "childrenNum": 38,
                        "level": "province",
                        "subFeatureIndex": 21,
                        "fullname": "重庆市",
                        "filename": "chongqing",
                        "parent": "中国",
                        "areacode": 500000,
                        "longitude": 106.504962,
                        "latitude": 29.533155,
                        "cp": [4849, 4026],
                        "drilldown": "chongqing"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5366, 4242], [5371, 4257], [5343, 4254], [5310, 4224], [5297, 4225], [5287, 4247], [5263, 4221], [5235, 4227], [5229, 4201], [5241, 4197], [5264, 4173], [5260, 4150], [5249, 4128], [5254, 4115], [5248, 4089], [5219, 4081], [5229, 4074], [5231, 4057], [5244, 4050], [5265, 4084], [5277, 4079], [5281, 4044], [5299, 4031], [5311, 4036], [5323, 4016], [5316, 3987], [5326, 3985], [5323, 3961], [5361, 3967], [5360, 3935], [5383, 3912], [5400, 3895], [5383, 3859], [5383, 3835], [5394, 3828], [5374, 3795], [5394, 3801], [5397, 3791], [5388, 3772], [5371, 3767], [5362, 3740], [5348, 3718], [5348, 3703], [5337, 3712], [5332, 3699], [5316, 3712], [5286, 3712], [5277, 3728], [5285, 3733], [5289, 3759], [5276, 3777], [5262, 3767], [5271, 3759], [5266, 3740], [5255, 3738], [5250, 3785], [5262, 3804], [5248, 3814], [5229, 3807], [5202, 3819], [5213, 3840], [5207, 3850], [5208, 3876], [5193, 3912], [5190, 3901], [5153, 3913], [5144, 3902], [5126, 3902], [5113, 3886], [5097, 3906], [5103, 3926], [5092, 3941], [5081, 3928], [5059, 3931], [5056, 3946], [5039, 3937], [5023, 3941], [5024, 3920], [5014, 3901], [5028, 3886], [5016, 3865], [4983, 3849], [4978, 3875], [4952, 3878], [4937, 3869], [4937, 3856], [4937, 3856], [4925, 3860], [4904, 3849], [4915, 3834], [4911, 3819], [4885, 3804], [4886, 3784], [4864, 3794], [4850, 3790], [4866, 3820], [4853, 3850], [4832, 3866], [4840, 3830], [4835, 3801], [4818, 3811], [4813, 3801], [4800, 3830], [4791, 3870], [4777, 3892], [4753, 3890], [4752, 3900], [4738, 3904], [4721, 3892], [4697, 3912], [4687, 3974], [4652, 3975], [4635, 3988], [4636, 4011], [4627, 4020], [4627, 4020], [4616, 4019], [4610, 4043], [4630, 4068], [4649, 4068], [4669, 4083], [4679, 4105], [4696, 4103], [4696, 4122], [4707, 4143], [4694, 4148], [4675, 4168], [4675, 4169], [4675, 4170], [4673, 4170], [4671, 4182], [4673, 4181], [4687, 4182], [4685, 4202], [4703, 4196], [4703, 4196], [4703, 4212], [4719, 4234], [4736, 4225], [4766, 4220], [4779, 4205], [4792, 4204], [4793, 4187], [4808, 4178], [4809, 4181], [4842, 4189], [4847, 4201], [4847, 4201], [4878, 4196], [4878, 4196], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4890, 4165], [4898, 4137], [4918, 4135], [4918, 4135], [4935, 4133], [4947, 4146], [4948, 4146], [4948, 4146], [4949, 4146], [4962, 4136], [4962, 4136], [4963, 4136], [4963, 4136], [4997, 4173], [5026, 4227], [5059, 4268], [5042, 4291], [5060, 4316], [5085, 4307], [5104, 4320], [5108, 4305], [5126, 4299], [5154, 4324], [5145, 4343], [5167, 4354], [5159, 4369], [5174, 4386], [5177, 4405], [5195, 4420], [5189, 4428], [5202, 4436], [5197, 4455], [5227, 4458], [5237, 4476], [5262, 4492], [5266, 4513], [5230, 4537], [5214, 4562], [5237, 4586], [5252, 4584], [5237, 4608], [5265, 4613], [5295, 4590], [5307, 4590], [5339, 4562], [5356, 4560], [5389, 4536], [5395, 4522], [5410, 4518], [5411, 4499], [5470, 4499], [5498, 4492], [5503, 4470], [5494, 4460], [5520, 4458], [5538, 4447], [5559, 4425], [5575, 4420], [5583, 4361], [5570, 4352], [5572, 4329], [5579, 4327], [5561, 4287], [5547, 4306], [5524, 4310], [5502, 4299], [5464, 4265], [5433, 4244], [5417, 4220], [5418, 4234], [5407, 4253], [5376, 4229], [5368, 4239], [5369, 4240], [5369, 4241], [5369, 4242], [5368, 4243], [5368, 4243], [5367, 4242], [5366, 4242]]], [[[4673, 4170], [4675, 4170], [4675, 4169], [4675, 4168], [4673, 4170]]], [[[5366, 4242], [5367, 4242], [5369, 4240], [5368, 4239], [5366, 4242]]], [[[5368, 4243], [5369, 4242], [5369, 4241], [5368, 4243], [5368, 4243]]], [[[4962, 4136], [4963, 4136], [4963, 4136], [4962, 4136], [4962, 4136]]]]
                    },
                    "id": "CN.500000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 510000,
                        "name": "四川",
                        "center": [104.065735, 30.659462],
                        "childrenNum": 21,
                        "level": "province",
                        "subFeatureIndex": 22,
                        "fullname": "四川省",
                        "filename": "sichuan",
                        "parent": "中国",
                        "areacode": 510000,
                        "longitude": 104.065735,
                        "latitude": 30.659462,
                        "cp": [4385, 4306],
                        "drilldown": "sichuan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4703, 4196], [4703, 4196], [4685, 4202], [4687, 4182], [4673, 4181], [4671, 4183], [4671, 4182], [4671, 4182], [4673, 4170], [4675, 4168], [4694, 4148], [4707, 4143], [4696, 4122], [4696, 4103], [4679, 4105], [4669, 4083], [4649, 4068], [4630, 4068], [4610, 4043], [4616, 4019], [4627, 4020], [4627, 4020], [4636, 4011], [4635, 3988], [4652, 3975], [4687, 3974], [4697, 3912], [4721, 3892], [4738, 3904], [4752, 3900], [4753, 3890], [4777, 3892], [4791, 3870], [4800, 3830], [4813, 3801], [4804, 3792], [4797, 3804], [4760, 3828], [4735, 3858], [4719, 3839], [4717, 3821], [4690, 3827], [4676, 3810], [4664, 3807], [4665, 3763], [4682, 3750], [4702, 3757], [4713, 3741], [4707, 3725], [4729, 3711], [4760, 3723], [4775, 3715], [4798, 3673], [4792, 3661], [4799, 3643], [4768, 3630], [4754, 3636], [4735, 3630], [4687, 3626], [4654, 3616], [4651, 3627], [4632, 3640], [4601, 3637], [4592, 3628], [4586, 3648], [4593, 3651], [4593, 3651], [4580, 3655], [4579, 3671], [4590, 3680], [4588, 3694], [4571, 3694], [4572, 3707], [4547, 3719], [4507, 3678], [4482, 3678], [4447, 3667], [4414, 3694], [4406, 3709], [4425, 3729], [4428, 3764], [4416, 3778], [4402, 3774], [4391, 3798], [4394, 3826], [4406, 3826], [4428, 3844], [4406, 3843], [4369, 3851], [4332, 3846], [4314, 3859], [4311, 3843], [4299, 3830], [4315, 3781], [4283, 3758], [4267, 3772], [4254, 3766], [4232, 3744], [4223, 3726], [4234, 3723], [4238, 3708], [4230, 3670], [4189, 3636], [4189, 3622], [4174, 3622], [4149, 3587], [4125, 3581], [4115, 3590], [4102, 3566], [4106, 3530], [4095, 3506], [4099, 3480], [4116, 3449], [4118, 3408], [4125, 3392], [4111, 3383], [4111, 3358], [4057, 3339], [4043, 3326], [4029, 3337], [4038, 3349], [4024, 3363], [3988, 3350], [3978, 3339], [3957, 3334], [3927, 3304], [3907, 3310], [3907, 3310], [3889, 3315], [3877, 3304], [3865, 3317], [3868, 3328], [3846, 3349], [3833, 3346], [3826, 3359], [3842, 3373], [3838, 3384], [3813, 3409], [3804, 3409], [3794, 3434], [3804, 3432], [3806, 3453], [3819, 3466], [3794, 3461], [3788, 3472], [3798, 3487], [3773, 3503], [3773, 3515], [3749, 3532], [3758, 3570], [3736, 3573], [3731, 3603], [3717, 3634], [3703, 3681], [3690, 3687], [3677, 3712], [3674, 3740], [3665, 3739], [3645, 3717], [3626, 3731], [3600, 3701], [3597, 3735], [3580, 3738], [3578, 3751], [3558, 3774], [3551, 3810], [3576, 3813], [3582, 3838], [3559, 3852], [3564, 3863], [3548, 3876], [3548, 3886], [3514, 3929], [3502, 3935], [3502, 3963], [3483, 3958], [3479, 3942], [3462, 3930], [3445, 3901], [3433, 3902], [3437, 3868], [3420, 3821], [3408, 3832], [3404, 3848], [3385, 3874], [3391, 3915], [3382, 3941], [3380, 3973], [3388, 3997], [3390, 4058], [3385, 4080], [3385, 4136], [3376, 4158], [3386, 4200], [3396, 4218], [3395, 4252], [3386, 4269], [3381, 4394], [3392, 4408], [3382, 4413], [3360, 4443], [3368, 4462], [3356, 4476], [3352, 4492], [3333, 4511], [3343, 4543], [3353, 4541], [3367, 4520], [3392, 4547], [3384, 4561], [3361, 4580], [3333, 4616], [3333, 4630], [3310, 4659], [3318, 4698], [3295, 4726], [3282, 4753], [3284, 4778], [3233, 4815], [3195, 4829], [3161, 4854], [3140, 4875], [3134, 4893], [3136, 4933], [3166, 4937], [3170, 4948], [3162, 4965], [3163, 4979], [3181, 4989], [3192, 5014], [3203, 5014], [3219, 5029], [3196, 5043], [3182, 5045], [3180, 5071], [3160, 5080], [3165, 5096], [3161, 5144], [3174, 5143], [3214, 5155], [3224, 5172], [3219, 5193], [3253, 5209], [3272, 5204], [3272, 5204], [3292, 5183], [3322, 5172], [3358, 5170], [3363, 5145], [3354, 5120], [3364, 5115], [3377, 5090], [3397, 5065], [3389, 5064], [3393, 5043], [3409, 5025], [3406, 5010], [3414, 5001], [3408, 4979], [3424, 4949], [3450, 4931], [3483, 4919], [3493, 4904], [3497, 4880], [3520, 4883], [3552, 4866], [3560, 4852], [3590, 4848], [3598, 4888], [3610, 4885], [3617, 4907], [3630, 4884], [3645, 4878], [3660, 4856], [3661, 4830], [3650, 4818], [3672, 4802], [3684, 4832], [3699, 4825], [3711, 4833], [3731, 4802], [3736, 4788], [3754, 4777], [3766, 4810], [3810, 4789], [3840, 4805], [3855, 4799], [3869, 4813], [3873, 4835], [3853, 4856], [3855, 4874], [3866, 4872], [3865, 4899], [3857, 4921], [3871, 4937], [3893, 4934], [3909, 4908], [3913, 4924], [3928, 4923], [3952, 4892], [3977, 4928], [3961, 4942], [3972, 4967], [3986, 4969], [3988, 4989], [4003, 5003], [4014, 4988], [4019, 4964], [4007, 4952], [4005, 4937], [3983, 4928], [3995, 4908], [3998, 4889], [4013, 4907], [4043, 4909], [4049, 4927], [4068, 4917], [4064, 4936], [4080, 4955], [4105, 4950], [4118, 4959], [4116, 4988], [4097, 4999], [4100, 5024], [4093, 5037], [4082, 5040], [4082, 5058], [4065, 5081], [4084, 5080], [4100, 5085], [4114, 5079], [4124, 5105], [4130, 5101], [4166, 5108], [4156, 5116], [4196, 5143], [4218, 5150], [4230, 5135], [4228, 5125], [4256, 5113], [4265, 5093], [4253, 5084], [4253, 5069], [4263, 5053], [4256, 5033], [4280, 5030], [4292, 5014], [4327, 5025], [4324, 4998], [4345, 5007], [4373, 4990], [4391, 4994], [4424, 4993], [4447, 4974], [4443, 4959], [4454, 4927], [4466, 4910], [4493, 4906], [4468, 4903], [4480, 4857], [4471, 4842], [4488, 4834], [4478, 4822], [4460, 4821], [4460, 4796], [4473, 4792], [4490, 4774], [4514, 4767], [4524, 4753], [4543, 4746], [4563, 4749], [4570, 4736], [4598, 4746], [4614, 4732], [4660, 4750], [4682, 4761], [4670, 4784], [4676, 4803], [4692, 4800], [4702, 4757], [4708, 4751], [4733, 4763], [4753, 4765], [4754, 4777], [4793, 4783], [4805, 4774], [4801, 4761], [4801, 4759], [4819, 4745], [4852, 4737], [4866, 4724], [4898, 4739], [4913, 4739], [4927, 4749], [4944, 4741], [4991, 4740], [4998, 4715], [4992, 4702], [5000, 4688], [5026, 4668], [5037, 4688], [5050, 4699], [5060, 4696], [5063, 4670], [5078, 4662], [5106, 4664], [5111, 4649], [5120, 4650], [5130, 4629], [5162, 4605], [5180, 4624], [5201, 4620], [5215, 4631], [5227, 4622], [5257, 4629], [5265, 4613], [5237, 4608], [5252, 4584], [5237, 4586], [5214, 4562], [5230, 4537], [5266, 4513], [5262, 4492], [5237, 4476], [5227, 4458], [5197, 4455], [5202, 4436], [5189, 4428], [5195, 4420], [5177, 4405], [5174, 4386], [5159, 4369], [5167, 4354], [5145, 4343], [5154, 4324], [5126, 4299], [5108, 4305], [5104, 4320], [5085, 4307], [5060, 4316], [5042, 4291], [5059, 4268], [5026, 4227], [4997, 4173], [4963, 4136], [4962, 4136], [4949, 4146], [4948, 4147], [4948, 4147], [4948, 4146], [4948, 4147], [4948, 4147], [4948, 4147], [4948, 4147], [4948, 4147], [4948, 4146], [4948, 4147], [4948, 4147], [4947, 4146], [4935, 4133], [4918, 4135], [4918, 4135], [4898, 4137], [4890, 4165], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4196], [4878, 4196], [4847, 4201], [4847, 4201], [4842, 4189], [4809, 4181], [4809, 4180], [4809, 4180], [4808, 4178], [4793, 4187], [4792, 4204], [4779, 4205], [4766, 4220], [4736, 4225], [4719, 4234], [4703, 4212], [4703, 4196]]], [[[4809, 4181], [4808, 4178], [4809, 4180], [4809, 4180], [4809, 4181]]], [[[4673, 4181], [4671, 4182], [4671, 4182], [4671, 4183], [4673, 4181]]], [[[4949, 4146], [4948, 4146], [4948, 4147], [4949, 4146]]], [[[4948, 4146], [4948, 4146], [4948, 4147], [4948, 4146]]], [[[4948, 4146], [4947, 4146], [4948, 4147], [4948, 4146]]]]
                    },
                    "id": "CN.510000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 520000,
                        "name": "贵州",
                        "center": [106.713478, 26.578343],
                        "childrenNum": 9,
                        "level": "province",
                        "subFeatureIndex": 23,
                        "fullname": "贵州省",
                        "filename": "guizhou",
                        "parent": "中国",
                        "areacode": 520000,
                        "longitude": 106.713478,
                        "latitude": 26.578343,
                        "cp": [4860, 3362],
                        "drilldown": "guizhou"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5426, 3379], [5412, 3382], [5392, 3368], [5401, 3331], [5384, 3308], [5375, 3279], [5386, 3272], [5412, 3282], [5406, 3266], [5415, 3245], [5415, 3245], [5407, 3235], [5413, 3219], [5398, 3205], [5403, 3197], [5383, 3176], [5383, 3153], [5344, 3156], [5343, 3168], [5312, 3166], [5293, 3152], [5304, 3145], [5304, 3145], [5314, 3156], [5330, 3152], [5319, 3132], [5330, 3114], [5317, 3106], [5302, 3116], [5268, 3117], [5265, 3135], [5250, 3133], [5233, 3104], [5235, 3063], [5205, 3098], [5194, 3094], [5181, 3116], [5138, 3085], [5139, 3070], [5131, 3045], [5107, 3042], [5074, 3026], [5055, 3054], [5046, 3044], [5039, 3072], [5026, 3058], [5000, 3051], [5003, 3070], [4993, 3068], [4991, 3091], [4971, 3094], [4975, 3107], [4954, 3140], [4921, 3131], [4921, 3120], [4899, 3105], [4908, 3086], [4908, 3068], [4887, 3062], [4884, 3051], [4850, 3046], [4840, 3050], [4820, 3030], [4761, 3008], [4743, 3010], [4728, 3003], [4739, 2981], [4732, 2961], [4705, 2945], [4700, 2934], [4684, 2956], [4661, 2952], [4637, 2968], [4595, 2979], [4586, 3004], [4570, 3011], [4549, 3009], [4536, 3024], [4515, 3010], [4511, 3008], [4500, 2980], [4472, 2973], [4460, 2957], [4439, 2946], [4417, 2956], [4397, 2973], [4400, 2991], [4438, 3030], [4429, 3044], [4448, 3078], [4462, 3067], [4462, 3088], [4427, 3098], [4429, 3111], [4409, 3122], [4413, 3149], [4388, 3139], [4386, 3165], [4369, 3169], [4365, 3180], [4370, 3205], [4379, 3198], [4394, 3228], [4389, 3237], [4409, 3272], [4431, 3326], [4450, 3338], [4427, 3387], [4413, 3386], [4401, 3416], [4387, 3396], [4340, 3403], [4325, 3375], [4287, 3378], [4268, 3396], [4272, 3425], [4259, 3443], [4275, 3460], [4275, 3478], [4257, 3501], [4249, 3493], [4247, 3515], [4265, 3521], [4307, 3564], [4314, 3586], [4330, 3581], [4330, 3571], [4348, 3560], [4360, 3542], [4400, 3586], [4426, 3571], [4435, 3553], [4447, 3547], [4487, 3555], [4499, 3540], [4540, 3566], [4563, 3559], [4580, 3586], [4574, 3593], [4590, 3607], [4592, 3628], [4601, 3637], [4632, 3640], [4651, 3627], [4654, 3616], [4687, 3626], [4735, 3630], [4754, 3636], [4768, 3630], [4799, 3643], [4792, 3661], [4798, 3673], [4775, 3715], [4760, 3723], [4729, 3711], [4707, 3725], [4713, 3741], [4702, 3757], [4682, 3750], [4665, 3763], [4664, 3807], [4676, 3810], [4690, 3827], [4717, 3821], [4719, 3839], [4735, 3858], [4760, 3828], [4797, 3804], [4804, 3792], [4813, 3801], [4818, 3811], [4835, 3801], [4840, 3830], [4832, 3866], [4853, 3850], [4866, 3820], [4850, 3790], [4864, 3794], [4886, 3784], [4885, 3804], [4911, 3819], [4915, 3834], [4904, 3849], [4925, 3860], [4937, 3856], [4937, 3856], [4937, 3869], [4952, 3878], [4978, 3875], [4983, 3849], [5016, 3865], [5028, 3886], [5014, 3901], [5024, 3920], [5023, 3941], [5039, 3937], [5056, 3946], [5059, 3931], [5081, 3928], [5092, 3941], [5103, 3926], [5097, 3906], [5113, 3886], [5126, 3902], [5144, 3902], [5153, 3913], [5190, 3901], [5193, 3912], [5208, 3876], [5207, 3850], [5213, 3840], [5202, 3819], [5229, 3807], [5248, 3814], [5262, 3804], [5250, 3785], [5255, 3738], [5266, 3740], [5271, 3759], [5262, 3767], [5276, 3777], [5289, 3759], [5285, 3733], [5277, 3728], [5286, 3712], [5316, 3712], [5332, 3699], [5337, 3712], [5348, 3703], [5348, 3718], [5362, 3740], [5371, 3767], [5388, 3772], [5386, 3730], [5409, 3720], [5399, 3703], [5389, 3669], [5405, 3668], [5390, 3651], [5398, 3625], [5395, 3612], [5421, 3588], [5419, 3563], [5387, 3543], [5386, 3532], [5366, 3538], [5354, 3531], [5333, 3500], [5306, 3485], [5299, 3463], [5282, 3459], [5298, 3439], [5339, 3464], [5356, 3452], [5377, 3466], [5407, 3470], [5418, 3466], [5414, 3451], [5427, 3448], [5434, 3423], [5420, 3412], [5422, 3397], [5418, 3399], [5416, 3397], [5423, 3392], [5426, 3379]]], [[[5427, 3377], [5427, 3378], [5431, 3376], [5431, 3376], [5427, 3377]]], [[[5422, 3397], [5423, 3392], [5416, 3397], [5418, 3399], [5422, 3397]]]]
                    },
                    "id": "CN.520000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 530000,
                        "name": "云南",
                        "center": [102.712251, 25.040609],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 24,
                        "fullname": "云南省",
                        "filename": "yunnan",
                        "parent": "中国",
                        "areacode": 530000,
                        "longitude": 102.712251,
                        "latitude": 25.040609,
                        "cp": [4032, 3066],
                        "drilldown": "yunnan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4585, 2617], [4566, 2642], [4552, 2649], [4543, 2665], [4523, 2638], [4493, 2639], [4450, 2621], [4432, 2609], [4442, 2577], [4415, 2547], [4382, 2553], [4338, 2521], [4318, 2533], [4319, 2553], [4287, 2550], [4271, 2533], [4260, 2487], [4251, 2484], [4224, 2511], [4189, 2554], [4172, 2533], [4164, 2510], [4145, 2535], [4147, 2547], [4123, 2561], [4113, 2533], [4094, 2527], [4091, 2507], [4069, 2497], [4067, 2484], [4037, 2494], [4028, 2518], [3991, 2546], [3974, 2554], [3966, 2548], [3955, 2565], [3928, 2546], [3934, 2536], [3913, 2519], [3898, 2498], [3900, 2490], [3854, 2502], [3825, 2499], [3815, 2489], [3797, 2517], [3777, 2511], [3765, 2469], [3748, 2461], [3756, 2443], [3751, 2433], [3760, 2408], [3755, 2400], [3774, 2392], [3788, 2366], [3780, 2345], [3786, 2325], [3779, 2313], [3773, 2249], [3790, 2238], [3774, 2215], [3756, 2227], [3741, 2223], [3742, 2236], [3727, 2242], [3697, 2239], [3676, 2230], [3663, 2243], [3668, 2258], [3649, 2284], [3660, 2286], [3666, 2315], [3649, 2346], [3652, 2364], [3628, 2352], [3597, 2347], [3566, 2315], [3529, 2303], [3513, 2306], [3505, 2323], [3487, 2324], [3464, 2311], [3455, 2323], [3440, 2323], [3438, 2341], [3452, 2357], [3437, 2367], [3416, 2369], [3408, 2396], [3423, 2428], [3419, 2447], [3398, 2452], [3397, 2443], [3320, 2473], [3301, 2468], [3265, 2474], [3252, 2486], [3271, 2504], [3283, 2537], [3306, 2558], [3308, 2572], [3297, 2611], [3312, 2615], [3328, 2632], [3330, 2651], [3352, 2648], [3344, 2667], [3347, 2679], [3312, 2697], [3292, 2687], [3261, 2692], [3219, 2723], [3231, 2745], [3222, 2785], [3212, 2783], [3210, 2800], [3225, 2809], [3210, 2852], [3187, 2859], [3194, 2866], [3196, 2891], [3240, 2923], [3236, 2932], [3203, 2931], [3181, 2923], [3170, 2933], [3130, 2931], [3103, 2937], [3079, 2935], [3035, 2922], [3033, 2913], [3006, 2906], [2993, 2892], [2957, 2910], [2981, 2935], [3002, 2947], [3005, 2972], [3013, 2979], [2993, 2996], [3005, 3002], [2998, 3024], [2969, 3022], [2981, 3059], [2985, 3096], [3013, 3110], [3025, 3104], [3031, 3115], [3019, 3139], [3051, 3202], [3064, 3187], [3087, 3206], [3098, 3206], [3119, 3237], [3115, 3249], [3128, 3261], [3125, 3273], [3140, 3269], [3153, 3253], [3171, 3262], [3184, 3281], [3190, 3302], [3207, 3315], [3224, 3303], [3238, 3314], [3236, 3331], [3222, 3342], [3217, 3376], [3230, 3381], [3234, 3367], [3251, 3387], [3240, 3401], [3254, 3424], [3263, 3470], [3270, 3483], [3264, 3501], [3270, 3541], [3268, 3569], [3276, 3580], [3265, 3586], [3265, 3617], [3276, 3647], [3270, 3650], [3269, 3700], [3250, 3699], [3225, 3723], [3219, 3697], [3196, 3693], [3192, 3725], [3184, 3733], [3184, 3760], [3174, 3770], [3182, 3778], [3170, 3802], [3178, 3826], [3175, 3835], [3182, 3849], [3202, 3855], [3193, 3882], [3212, 3886], [3224, 3854], [3224, 3824], [3231, 3821], [3259, 3836], [3272, 3831], [3290, 3844], [3300, 3866], [3288, 3897], [3279, 3903], [3282, 3917], [3276, 3944], [3295, 3958], [3291, 3976], [3294, 4001], [3317, 4016], [3326, 4003], [3326, 3974], [3342, 3968], [3354, 3974], [3345, 3987], [3348, 4007], [3366, 4017], [3360, 4040], [3363, 4057], [3390, 4058], [3388, 3997], [3380, 3973], [3382, 3941], [3391, 3915], [3385, 3874], [3404, 3848], [3408, 3832], [3420, 3821], [3437, 3868], [3433, 3902], [3445, 3901], [3462, 3930], [3479, 3942], [3483, 3958], [3502, 3963], [3502, 3935], [3514, 3929], [3548, 3886], [3548, 3876], [3564, 3863], [3559, 3852], [3582, 3838], [3576, 3813], [3551, 3810], [3558, 3774], [3578, 3751], [3580, 3738], [3597, 3735], [3600, 3701], [3626, 3731], [3645, 3717], [3665, 3739], [3674, 3740], [3677, 3712], [3690, 3687], [3703, 3681], [3717, 3634], [3731, 3603], [3736, 3573], [3758, 3570], [3749, 3532], [3773, 3515], [3773, 3503], [3798, 3487], [3788, 3472], [3794, 3461], [3819, 3466], [3806, 3453], [3804, 3432], [3794, 3434], [3804, 3409], [3813, 3409], [3838, 3384], [3842, 3373], [3826, 3359], [3833, 3346], [3846, 3349], [3868, 3328], [3865, 3317], [3877, 3304], [3889, 3315], [3907, 3310], [3907, 3310], [3927, 3304], [3957, 3334], [3978, 3339], [3988, 3350], [4024, 3363], [4038, 3349], [4029, 3337], [4043, 3326], [4057, 3339], [4111, 3358], [4111, 3383], [4125, 3392], [4118, 3408], [4116, 3449], [4099, 3480], [4095, 3506], [4106, 3530], [4102, 3566], [4115, 3590], [4125, 3581], [4149, 3587], [4174, 3622], [4189, 3622], [4189, 3636], [4230, 3670], [4238, 3708], [4234, 3723], [4223, 3726], [4232, 3744], [4254, 3766], [4267, 3772], [4283, 3758], [4315, 3781], [4299, 3830], [4311, 3843], [4314, 3859], [4332, 3846], [4369, 3851], [4406, 3843], [4428, 3844], [4406, 3826], [4394, 3826], [4391, 3798], [4402, 3774], [4416, 3778], [4428, 3764], [4425, 3729], [4406, 3709], [4414, 3694], [4447, 3667], [4482, 3678], [4507, 3678], [4547, 3719], [4572, 3707], [4571, 3694], [4588, 3694], [4590, 3680], [4579, 3671], [4580, 3655], [4593, 3651], [4593, 3651], [4586, 3648], [4592, 3628], [4590, 3607], [4574, 3593], [4580, 3586], [4563, 3559], [4540, 3566], [4499, 3540], [4487, 3555], [4447, 3547], [4435, 3553], [4426, 3571], [4400, 3586], [4360, 3542], [4348, 3560], [4330, 3571], [4330, 3581], [4314, 3586], [4307, 3564], [4265, 3521], [4247, 3515], [4249, 3493], [4257, 3501], [4275, 3478], [4275, 3460], [4259, 3443], [4272, 3425], [4268, 3396], [4287, 3378], [4325, 3375], [4340, 3403], [4387, 3396], [4401, 3416], [4413, 3386], [4427, 3387], [4450, 3338], [4431, 3326], [4409, 3272], [4389, 3237], [4394, 3228], [4379, 3198], [4370, 3205], [4365, 3180], [4369, 3169], [4386, 3165], [4388, 3139], [4413, 3149], [4409, 3122], [4429, 3111], [4427, 3098], [4462, 3088], [4462, 3067], [4448, 3078], [4429, 3044], [4438, 3030], [4400, 2991], [4397, 2973], [4388, 2957], [4409, 2893], [4428, 2880], [4434, 2907], [4456, 2906], [4485, 2897], [4502, 2899], [4502, 2899], [4526, 2880], [4521, 2867], [4532, 2839], [4526, 2826], [4537, 2815], [4550, 2827], [4582, 2803], [4593, 2827], [4613, 2826], [4617, 2805], [4628, 2812], [4666, 2804], [4676, 2822], [4699, 2813], [4725, 2753], [4714, 2747], [4717, 2731], [4708, 2705], [4712, 2696], [4682, 2671], [4661, 2689], [4645, 2686], [4620, 2664], [4618, 2655], [4583, 2631], [4585, 2617]]]]
                    },
                    "id": "CN.530000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 540000,
                        "name": "西藏",
                        "center": [91.132212, 29.660361],
                        "childrenNum": 7,
                        "level": "province",
                        "subFeatureIndex": 25,
                        "fullname": "西藏自治区",
                        "filename": "xizang",
                        "parent": "中国",
                        "areacode": 540000,
                        "longitude": 91.132212,
                        "latitude": 29.660361,
                        "cp": [1840, 4342],
                        "drilldown": "xizang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[-270, 5806], [-272, 5822], [-242, 5825], [-231, 5816], [-177, 5814], [-146, 5807], [-121, 5808], [-92, 5849], [-77, 5879], [-57, 5893], [-52, 5923], [-34, 5927], [-9, 5941], [-2, 5952], [17, 5949], [4, 5972], [18, 5991], [37, 5998], [54, 5985], [80, 5979], [84, 5966], [113, 5961], [145, 5947], [149, 5962], [163, 5965], [181, 5941], [209, 5943], [230, 5924], [231, 5911], [261, 5904], [274, 5908], [309, 5903], [336, 5916], [337, 5939], [397, 5953], [402, 5974], [421, 5984], [458, 5972], [475, 5956], [487, 5965], [519, 5955], [517, 5912], [529, 5904], [537, 5887], [559, 5888], [596, 5872], [626, 5855], [638, 5859], [676, 5853], [701, 5861], [715, 5845], [727, 5842], [762, 5848], [786, 5857], [789, 5875], [843, 5880], [909, 5900], [928, 5895], [951, 5901], [966, 5878], [1009, 5859], [1019, 5875], [1050, 5881], [1076, 5876], [1099, 5888], [1118, 5916], [1132, 5926], [1134, 5949], [1175, 5959], [1198, 5955], [1234, 5958], [1244, 5967], [1265, 5965], [1269, 5956], [1291, 5963], [1318, 5956], [1329, 5966], [1350, 5966], [1362, 5977], [1380, 5972], [1380, 5959], [1398, 5953], [1429, 5958], [1470, 5955], [1478, 5962], [1505, 5955], [1527, 5961], [1549, 5955], [1569, 5958], [1588, 5950], [1594, 5932], [1620, 5905], [1626, 5915], [1649, 5917], [1655, 5906], [1679, 5893], [1682, 5885], [1703, 5893], [1712, 5877], [1728, 5873], [1746, 5852], [1785, 5833], [1770, 5825], [1739, 5823], [1729, 5830], [1727, 5800], [1747, 5784], [1793, 5774], [1780, 5754], [1778, 5718], [1764, 5706], [1770, 5692], [1757, 5679], [1720, 5672], [1723, 5653], [1706, 5643], [1715, 5621], [1728, 5611], [1717, 5574], [1732, 5559], [1743, 5565], [1764, 5558], [1770, 5536], [1755, 5523], [1742, 5522], [1738, 5506], [1750, 5497], [1749, 5457], [1743, 5443], [1754, 5428], [1744, 5420], [1738, 5393], [1705, 5380], [1699, 5370], [1707, 5348], [1723, 5324], [1731, 5323], [1747, 5304], [1740, 5293], [1757, 5278], [1750, 5261], [1753, 5247], [1766, 5240], [1766, 5226], [1794, 5211], [1806, 5183], [1818, 5170], [1834, 5169], [1871, 5133], [1889, 5126], [1927, 5121], [1927, 5121], [1950, 5107], [1977, 5119], [2007, 5097], [2021, 5105], [2034, 5087], [2070, 5060], [2090, 5049], [2099, 5028], [2137, 5038], [2150, 5021], [2143, 5007], [2153, 4998], [2173, 5005], [2225, 4988], [2236, 4997], [2271, 4976], [2299, 4982], [2305, 4955], [2339, 4959], [2362, 4925], [2378, 4930], [2386, 4910], [2407, 4918], [2415, 4929], [2446, 4920], [2452, 4900], [2471, 4902], [2503, 4886], [2517, 4903], [2551, 4901], [2557, 4916], [2585, 4914], [2602, 4929], [2629, 4898], [2633, 4882], [2649, 4877], [2652, 4864], [2666, 4863], [2683, 4853], [2710, 4852], [2717, 4840], [2684, 4838], [2684, 4824], [2712, 4835], [2714, 4806], [2721, 4794], [2740, 4800], [2746, 4771], [2725, 4750], [2737, 4720], [2755, 4697], [2770, 4705], [2801, 4694], [2808, 4678], [2825, 4706], [2841, 4704], [2851, 4685], [2868, 4675], [2870, 4652], [2879, 4651], [2890, 4671], [2878, 4691], [2896, 4724], [2922, 4719], [2934, 4683], [2953, 4668], [2961, 4673], [2991, 4655], [3004, 4665], [2992, 4697], [3003, 4704], [2989, 4733], [3022, 4730], [3045, 4739], [3068, 4731], [3103, 4735], [3097, 4760], [3106, 4785], [3120, 4778], [3131, 4789], [3126, 4813], [3118, 4817], [3128, 4830], [3118, 4834], [3142, 4848], [3145, 4838], [3183, 4828], [3195, 4829], [3233, 4815], [3284, 4778], [3282, 4753], [3295, 4726], [3318, 4698], [3310, 4659], [3333, 4630], [3333, 4616], [3361, 4580], [3384, 4561], [3392, 4547], [3367, 4520], [3353, 4541], [3343, 4543], [3333, 4511], [3352, 4492], [3356, 4476], [3368, 4462], [3360, 4443], [3382, 4413], [3392, 4408], [3381, 4394], [3386, 4269], [3395, 4252], [3396, 4218], [3386, 4200], [3376, 4158], [3385, 4136], [3385, 4080], [3390, 4058], [3363, 4057], [3360, 4040], [3366, 4017], [3348, 4007], [3345, 3987], [3354, 3974], [3342, 3968], [3326, 3974], [3326, 4003], [3317, 4016], [3294, 4001], [3291, 3976], [3295, 3958], [3276, 3944], [3282, 3917], [3279, 3903], [3288, 3897], [3300, 3866], [3290, 3844], [3272, 3831], [3259, 3836], [3231, 3821], [3224, 3824], [3224, 3854], [3212, 3886], [3193, 3882], [3202, 3855], [3182, 3849], [3175, 3835], [3166, 3848], [3155, 3847], [3154, 3862], [3134, 3889], [3112, 3883], [3101, 3900], [3103, 3916], [3094, 3929], [3071, 3936], [3057, 3922], [3051, 3903], [3056, 3889], [3043, 3877], [3037, 3884], [3021, 3872], [3011, 3832], [3028, 3821], [3020, 3793], [3004, 3801], [2952, 3768], [2951, 3784], [2937, 3796], [2913, 3802], [2902, 3816], [2883, 3822], [2863, 3849], [2849, 3853], [2843, 3870], [2830, 3866], [2810, 3873], [2808, 3893], [2751, 3893], [2731, 3918], [2690, 3913], [2627, 3887], [2605, 3851], [2549, 3833], [2521, 3817], [2445, 3793], [2396, 3796], [2327, 3742], [2299, 3715], [2294, 3688], [2237, 3671], [2169, 3672], [2144, 3670], [2105, 3682], [2083, 3681], [2061, 3696], [2039, 3699], [2004, 3693], [1944, 3691], [1950, 3714], [1937, 3736], [1938, 3762], [1960, 3783], [1943, 3831], [1910, 3839], [1892, 3835], [1861, 3857], [1862, 3882], [1880, 3906], [1878, 3935], [1854, 3948], [1852, 3963], [1823, 3980], [1809, 3962], [1791, 3964], [1778, 3939], [1750, 3955], [1751, 3967], [1738, 3967], [1723, 3991], [1704, 4001], [1681, 3992], [1667, 4004], [1641, 4007], [1627, 4031], [1614, 4030], [1594, 4044], [1575, 4035], [1565, 4048], [1551, 4048], [1530, 4065], [1514, 4051], [1491, 4053], [1458, 4028], [1436, 3996], [1406, 3983], [1392, 3958], [1380, 3950], [1384, 3936], [1367, 3916], [1381, 3891], [1357, 3875], [1351, 3864], [1334, 3863], [1324, 3878], [1327, 3889], [1308, 3910], [1306, 3947], [1326, 3967], [1339, 4005], [1336, 4042], [1322, 4058], [1305, 4061], [1301, 4071], [1284, 4068], [1280, 4056], [1265, 4059], [1248, 4049], [1218, 4046], [1199, 4053], [1187, 4034], [1133, 4057], [1109, 4032], [1084, 4047], [1057, 4045], [1051, 4055], [1038, 4049], [1023, 4057], [1011, 4051], [991, 4061], [978, 4087], [959, 4092], [948, 4110], [927, 4116], [918, 4133], [907, 4127], [893, 4137], [876, 4106], [862, 4099], [822, 4120], [821, 4164], [794, 4135], [799, 4113], [784, 4110], [765, 4122], [773, 4131], [760, 4149], [755, 4177], [738, 4193], [737, 4226], [730, 4228], [720, 4209], [697, 4222], [675, 4226], [646, 4222], [636, 4237], [617, 4242], [621, 4268], [640, 4283], [645, 4300], [633, 4314], [620, 4316], [601, 4300], [576, 4300], [548, 4320], [542, 4340], [510, 4351], [501, 4380], [468, 4394], [477, 4424], [467, 4430], [473, 4445], [462, 4486], [440, 4491], [425, 4502], [385, 4491], [368, 4476], [348, 4488], [310, 4580], [285, 4597], [277, 4595], [254, 4622], [230, 4623], [213, 4663], [197, 4663], [190, 4692], [178, 4693], [164, 4710], [135, 4730], [121, 4732], [130, 4747], [116, 4770], [120, 4796], [97, 4796], [76, 4811], [55, 4818], [33, 4837], [20, 4836], [15, 4823], [-11, 4836], [-11, 4814], [-22, 4792], [-36, 4783], [-48, 4787], [-47, 4773], [-64, 4756], [-81, 4762], [-89, 4817], [-127, 4842], [-142, 4866], [-156, 4880], [-173, 4881], [-211, 4916], [-230, 4925], [-249, 4922], [-262, 4936], [-272, 4957], [-270, 4976], [-279, 4998], [-290, 4999], [-301, 5021], [-316, 5035], [-332, 5025], [-344, 5052], [-360, 5053], [-359, 5064], [-381, 5058], [-380, 5046], [-401, 5046], [-407, 5063], [-424, 5061], [-438, 5076], [-435, 5102], [-452, 5142], [-458, 5137], [-471, 5156], [-460, 5172], [-470, 5184], [-465, 5196], [-441, 5208], [-454, 5225], [-459, 5252], [-467, 5263], [-448, 5274], [-440, 5286], [-467, 5311], [-477, 5336], [-486, 5339], [-490, 5359], [-470, 5377], [-476, 5395], [-470, 5407], [-480, 5431], [-453, 5443], [-432, 5444], [-407, 5455], [-404, 5432], [-410, 5423], [-407, 5393], [-382, 5363], [-373, 5371], [-355, 5366], [-344, 5387], [-320, 5392], [-305, 5408], [-308, 5427], [-300, 5437], [-312, 5453], [-298, 5487], [-312, 5506], [-311, 5531], [-305, 5541], [-319, 5558], [-323, 5581], [-351, 5611], [-364, 5644], [-358, 5659], [-367, 5674], [-348, 5683], [-349, 5697], [-342, 5740], [-356, 5754], [-352, 5767], [-336, 5764], [-326, 5771], [-300, 5771], [-281, 5805], [-270, 5806]]]]
                    },
                    "id": "CN.540000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 610000,
                        "name": "陕西",
                        "center": [108.948024, 34.263161],
                        "childrenNum": 10,
                        "level": "province",
                        "subFeatureIndex": 26,
                        "fullname": "陕西省",
                        "filename": "shanxi2",
                        "parent": "中国",
                        "areacode": 610000,
                        "longitude": 108.948024,
                        "latitude": 34.263161,
                        "cp": [5364, 5081],
                        "drilldown": "shanxi2"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5075, 5725], [5075, 5725], [5072, 5747], [5086, 5761], [5073, 5802], [5079, 5835], [5090, 5843], [5092, 5864], [5118, 5886], [5122, 5900], [5144, 5901], [5150, 5922], [5211, 5901], [5218, 5869], [5238, 5862], [5254, 5870], [5270, 5865], [5295, 5867], [5312, 5875], [5327, 5866], [5358, 5872], [5363, 5895], [5363, 5930], [5369, 5943], [5364, 5957], [5378, 5952], [5389, 5926], [5404, 5937], [5415, 5965], [5396, 5981], [5391, 5993], [5414, 6045], [5438, 6065], [5457, 6089], [5473, 6089], [5469, 6107], [5481, 6111], [5501, 6137], [5508, 6130], [5522, 6141], [5533, 6160], [5530, 6171], [5586, 6219], [5633, 6239], [5621, 6280], [5639, 6272], [5665, 6245], [5674, 6261], [5691, 6261], [5704, 6236], [5722, 6235], [5729, 6253], [5758, 6290], [5802, 6307], [5805, 6294], [5789, 6264], [5800, 6255], [5822, 6240], [5806, 6205], [5801, 6184], [5771, 6163], [5776, 6134], [5751, 6080], [5759, 6072], [5750, 6042], [5732, 6039], [5726, 6022], [5710, 6009], [5694, 6006], [5692, 5987], [5681, 5982], [5679, 5945], [5682, 5926], [5695, 5918], [5708, 5891], [5725, 5876], [5715, 5868], [5732, 5857], [5731, 5835], [5721, 5808], [5702, 5805], [5699, 5790], [5711, 5785], [5710, 5770], [5681, 5736], [5663, 5706], [5652, 5710], [5659, 5695], [5657, 5656], [5662, 5644], [5652, 5630], [5671, 5607], [5671, 5585], [5662, 5549], [5665, 5530], [5659, 5511], [5670, 5445], [5677, 5444], [5681, 5403], [5687, 5387], [5670, 5344], [5661, 5337], [5655, 5318], [5645, 5305], [5630, 5246], [5617, 5228], [5612, 5198], [5612, 5170], [5625, 5153], [5638, 5151], [5634, 5132], [5642, 5112], [5642, 5112], [5661, 5090], [5646, 5076], [5648, 5069], [5686, 5049], [5676, 5034], [5690, 4998], [5674, 4987], [5711, 4965], [5728, 4928], [5752, 4914], [5756, 4891], [5756, 4891], [5756, 4891], [5756, 4890], [5750, 4882], [5756, 4858], [5747, 4841], [5716, 4819], [5701, 4817], [5692, 4806], [5672, 4822], [5662, 4842], [5648, 4826], [5600, 4823], [5590, 4834], [5564, 4830], [5530, 4844], [5507, 4841], [5486, 4851], [5470, 4845], [5450, 4824], [5476, 4814], [5498, 4815], [5518, 4803], [5511, 4767], [5554, 4761], [5577, 4747], [5586, 4733], [5585, 4714], [5595, 4702], [5584, 4693], [5571, 4698], [5558, 4683], [5538, 4694], [5519, 4691], [5502, 4699], [5484, 4697], [5485, 4684], [5472, 4676], [5458, 4650], [5456, 4630], [5474, 4611], [5479, 4585], [5472, 4564], [5480, 4552], [5470, 4539], [5480, 4518], [5470, 4499], [5411, 4499], [5410, 4518], [5395, 4522], [5389, 4536], [5356, 4560], [5339, 4562], [5307, 4590], [5295, 4590], [5265, 4613], [5257, 4629], [5227, 4622], [5215, 4631], [5201, 4620], [5180, 4624], [5162, 4605], [5130, 4629], [5120, 4650], [5111, 4649], [5106, 4664], [5078, 4662], [5063, 4670], [5060, 4696], [5050, 4699], [5037, 4688], [5026, 4668], [5000, 4688], [4992, 4702], [4998, 4715], [4991, 4740], [4944, 4741], [4927, 4749], [4913, 4739], [4898, 4739], [4866, 4724], [4852, 4737], [4819, 4745], [4801, 4759], [4801, 4760], [4801, 4761], [4801, 4761], [4805, 4774], [4793, 4783], [4754, 4777], [4753, 4765], [4733, 4763], [4708, 4751], [4702, 4757], [4692, 4800], [4709, 4791], [4737, 4796], [4773, 4815], [4778, 4857], [4785, 4862], [4766, 4870], [4744, 4886], [4741, 4907], [4761, 4904], [4765, 4929], [4788, 4956], [4821, 4952], [4831, 4938], [4854, 4950], [4882, 4951], [4883, 4933], [4899, 4927], [4907, 4941], [4900, 4968], [4889, 4974], [4886, 4991], [4893, 5004], [4878, 5018], [4891, 5033], [4897, 5063], [4914, 5072], [4904, 5105], [4930, 5093], [4941, 5122], [4924, 5132], [4922, 5142], [4893, 5161], [4870, 5159], [4867, 5173], [4888, 5187], [4905, 5210], [4918, 5215], [4905, 5255], [4906, 5270], [4906, 5270], [4922, 5288], [4948, 5289], [4971, 5284], [4984, 5286], [5017, 5269], [5018, 5258], [5036, 5238], [5048, 5234], [5055, 5246], [5099, 5239], [5107, 5252], [5121, 5247], [5153, 5248], [5164, 5256], [5145, 5275], [5133, 5309], [5127, 5314], [5145, 5330], [5167, 5316], [5202, 5314], [5226, 5325], [5238, 5313], [5259, 5319], [5285, 5316], [5309, 5328], [5313, 5348], [5312, 5380], [5297, 5392], [5294, 5417], [5296, 5446], [5291, 5455], [5309, 5471], [5322, 5471], [5334, 5514], [5322, 5541], [5324, 5571], [5318, 5583], [5299, 5593], [5295, 5581], [5279, 5590], [5267, 5613], [5253, 5612], [5241, 5630], [5234, 5616], [5206, 5629], [5206, 5644], [5193, 5639], [5188, 5661], [5154, 5674], [5120, 5682], [5110, 5701], [5078, 5703], [5075, 5725]]], [[[4801, 4759], [4801, 4761], [4801, 4761], [4801, 4760], [4801, 4759]]], [[[5756, 4891], [5756, 4891], [5756, 4891], [5756, 4890], [5756, 4891]]]]
                    },
                    "id": "CN.610000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 620000,
                        "name": "甘肃",
                        "center": [103.823557, 36.058039],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 27,
                        "fullname": "甘肃省",
                        "filename": "gansu",
                        "parent": "中国",
                        "areacode": 620000,
                        "longitude": 103.823557,
                        "latitude": 36.058039,
                        "cp": [4417, 5540],
                        "drilldown": "gansu"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4906, 5270], [4906, 5270], [4905, 5255], [4918, 5215], [4905, 5210], [4888, 5187], [4867, 5173], [4870, 5159], [4893, 5161], [4922, 5142], [4924, 5132], [4941, 5122], [4930, 5093], [4904, 5105], [4914, 5072], [4897, 5063], [4891, 5033], [4878, 5018], [4893, 5004], [4886, 4991], [4889, 4974], [4900, 4968], [4907, 4941], [4899, 4927], [4883, 4933], [4882, 4951], [4854, 4950], [4831, 4938], [4821, 4952], [4788, 4956], [4765, 4929], [4761, 4904], [4741, 4907], [4744, 4886], [4766, 4870], [4785, 4862], [4778, 4857], [4773, 4815], [4737, 4796], [4709, 4791], [4692, 4800], [4676, 4803], [4670, 4784], [4682, 4761], [4660, 4750], [4614, 4732], [4598, 4746], [4570, 4736], [4563, 4749], [4543, 4746], [4524, 4753], [4514, 4767], [4490, 4774], [4473, 4792], [4460, 4796], [4460, 4821], [4478, 4822], [4488, 4834], [4471, 4842], [4480, 4857], [4468, 4903], [4493, 4906], [4466, 4910], [4454, 4927], [4443, 4959], [4447, 4974], [4424, 4993], [4391, 4994], [4373, 4990], [4345, 5007], [4324, 4998], [4327, 5025], [4292, 5014], [4280, 5030], [4256, 5033], [4263, 5053], [4253, 5069], [4253, 5084], [4265, 5093], [4256, 5113], [4228, 5125], [4230, 5135], [4218, 5150], [4196, 5143], [4156, 5116], [4166, 5108], [4130, 5101], [4124, 5105], [4114, 5079], [4100, 5085], [4084, 5080], [4065, 5081], [4082, 5058], [4082, 5040], [4093, 5037], [4100, 5024], [4097, 4999], [4116, 4988], [4118, 4959], [4105, 4950], [4080, 4955], [4064, 4936], [4068, 4917], [4049, 4927], [4043, 4909], [4013, 4907], [3998, 4889], [3995, 4908], [3983, 4928], [4005, 4937], [4007, 4952], [4019, 4964], [4014, 4988], [4003, 5003], [3988, 4989], [3980, 4980], [3959, 4983], [3954, 5023], [3940, 5031], [3916, 5019], [3889, 5031], [3875, 5026], [3882, 5054], [3876, 5068], [3847, 5081], [3816, 5145], [3808, 5151], [3822, 5181], [3837, 5193], [3854, 5192], [3866, 5179], [3900, 5177], [3917, 5157], [3954, 5146], [3971, 5138], [3991, 5113], [4013, 5128], [4033, 5117], [4036, 5130], [4055, 5142], [4057, 5157], [4073, 5151], [4082, 5170], [4090, 5166], [4091, 5166], [4090, 5166], [4091, 5166], [4086, 5180], [4086, 5180], [4078, 5205], [4050, 5214], [4035, 5235], [4039, 5293], [4064, 5299], [4074, 5316], [4099, 5330], [4114, 5332], [4118, 5345], [4136, 5358], [4131, 5375], [4115, 5386], [4124, 5415], [4140, 5408], [4149, 5414], [4162, 5447], [4205, 5424], [4218, 5438], [4199, 5488], [4219, 5508], [4251, 5505], [4256, 5536], [4241, 5557], [4252, 5561], [4262, 5581], [4277, 5583], [4270, 5595], [4235, 5621], [4236, 5621], [4236, 5622], [4235, 5622], [4226, 5648], [4226, 5671], [4199, 5699], [4219, 5723], [4198, 5743], [4194, 5755], [4175, 5767], [4186, 5778], [4184, 5793], [4212, 5795], [4206, 5813], [4181, 5832], [4176, 5847], [4135, 5876], [4119, 5892], [4125, 5906], [4109, 5926], [4110, 5939], [4094, 5951], [4069, 5935], [4065, 5945], [4041, 5956], [4032, 5979], [4007, 5990], [3988, 5974], [3950, 5997], [3905, 6041], [3916, 6066], [3895, 6067], [3883, 6087], [3860, 6095], [3846, 6092], [3834, 6103], [3806, 6115], [3796, 6125], [3794, 6142], [3763, 6163], [3750, 6152], [3766, 6137], [3776, 6113], [3779, 6092], [3768, 6095], [3736, 6124], [3716, 6132], [3687, 6154], [3670, 6172], [3663, 6193], [3652, 6193], [3638, 6221], [3614, 6240], [3589, 6268], [3597, 6279], [3569, 6291], [3547, 6317], [3533, 6318], [3501, 6284], [3478, 6292], [3466, 6311], [3448, 6312], [3439, 6281], [3408, 6259], [3394, 6278], [3363, 6298], [3340, 6308], [3337, 6320], [3284, 6356], [3258, 6371], [3211, 6377], [3219, 6363], [3210, 6354], [3200, 6310], [3207, 6300], [3207, 6260], [3216, 6253], [3213, 6234], [3198, 6228], [3166, 6243], [3161, 6219], [3139, 6216], [3144, 6201], [3129, 6187], [3133, 6157], [3097, 6172], [3073, 6168], [3066, 6148], [3049, 6147], [3030, 6158], [3021, 6156], [2986, 6186], [2984, 6201], [2961, 6217], [2924, 6196], [2888, 6206], [2877, 6203], [2855, 6233], [2828, 6239], [2797, 6232], [2773, 6236], [2745, 6234], [2744, 6253], [2727, 6330], [2638, 6331], [2623, 6340], [2619, 6357], [2641, 6356], [2615, 6382], [2565, 6387], [2531, 6386], [2515, 6395], [2522, 6423], [2512, 6439], [2516, 6451], [2485, 6451], [2479, 6458], [2465, 6453], [2395, 6453], [2379, 6440], [2372, 6446], [2372, 6488], [2410, 6515], [2435, 6546], [2466, 6626], [2484, 6692], [2509, 6726], [2521, 6787], [2627, 6791], [2673, 6789], [2688, 6818], [2688, 6839], [2731, 6890], [2767, 6922], [2836, 6971], [2876, 6974], [2899, 7003], [2951, 7022], [2974, 6970], [2995, 6997], [3029, 7018], [3049, 7024], [3081, 7025], [3116, 7039], [3131, 7052], [3137, 7068], [3129, 7092], [3148, 7106], [3127, 7135], [3134, 7155], [3119, 7163], [3130, 7187], [3146, 7200], [3199, 7224], [3263, 7224], [3303, 7220], [3340, 7225], [3358, 7168], [3431, 6941], [3385, 6902], [3387, 6893], [3440, 6806], [3486, 6763], [3501, 6757], [3495, 6674], [3548, 6695], [3539, 6712], [3558, 6716], [3560, 6697], [3578, 6675], [3578, 6698], [3615, 6713], [3623, 6691], [3634, 6686], [3648, 6702], [3651, 6728], [3721, 6719], [3742, 6737], [3811, 6725], [3819, 6717], [3839, 6677], [3838, 6654], [3823, 6637], [3818, 6574], [3786, 6558], [3770, 6528], [3686, 6491], [3720, 6491], [3746, 6482], [3760, 6463], [3784, 6454], [3799, 6440], [3820, 6434], [3831, 6414], [3831, 6391], [3862, 6382], [3860, 6363], [3882, 6358], [3923, 6359], [3919, 6311], [3921, 6288], [3914, 6270], [3937, 6263], [3937, 6249], [3965, 6254], [3986, 6263], [3979, 6245], [3985, 6225], [4002, 6221], [3996, 6211], [4041, 6186], [4047, 6172], [4062, 6179], [4080, 6171], [4112, 6203], [4138, 6221], [4113, 6248], [4097, 6271], [4181, 6288], [4214, 6301], [4239, 6279], [4312, 6257], [4378, 6307], [4424, 6317], [4470, 6332], [4493, 6329], [4515, 6319], [4505, 6291], [4527, 6255], [4532, 6239], [4522, 6206], [4499, 6197], [4461, 6140], [4376, 6089], [4391, 6059], [4394, 6030], [4363, 6016], [4361, 6004], [4365, 5963], [4415, 5941], [4462, 5887], [4503, 5848], [4523, 5851], [4551, 5854], [4595, 5842], [4600, 5824], [4585, 5818], [4578, 5805], [4585, 5795], [4611, 5804], [4625, 5795], [4641, 5754], [4680, 5741], [4683, 5716], [4693, 5717], [4709, 5695], [4706, 5681], [4686, 5680], [4685, 5657], [4696, 5631], [4703, 5633], [4716, 5608], [4716, 5594], [4729, 5577], [4725, 5560], [4734, 5542], [4701, 5517], [4697, 5484], [4708, 5478], [4723, 5445], [4740, 5442], [4759, 5448], [4775, 5443], [4762, 5436], [4789, 5387], [4794, 5398], [4821, 5393], [4831, 5385], [4829, 5384], [4798, 5378], [4797, 5369], [4828, 5376], [4829, 5377], [4829, 5371], [4831, 5369], [4832, 5370], [4837, 5356], [4850, 5372], [4876, 5331], [4905, 5340], [4912, 5364], [4901, 5390], [4909, 5402], [4902, 5427], [4915, 5438], [4915, 5437], [4915, 5438], [4915, 5438], [4959, 5425], [4983, 5435], [4995, 5449], [4982, 5469], [5002, 5496], [5004, 5516], [4987, 5543], [4987, 5543], [4939, 5561], [4939, 5561], [4921, 5560], [4920, 5591], [4927, 5609], [4905, 5626], [4919, 5633], [4929, 5662], [4929, 5662], [4942, 5671], [4950, 5665], [4956, 5685], [4946, 5715], [4960, 5732], [4949, 5759], [4976, 5751], [4982, 5764], [4982, 5764], [5002, 5749], [5029, 5758], [5040, 5752], [5057, 5758], [5072, 5747], [5075, 5725], [5075, 5725], [5078, 5703], [5110, 5701], [5120, 5682], [5154, 5674], [5188, 5661], [5193, 5639], [5206, 5644], [5206, 5629], [5234, 5616], [5241, 5630], [5253, 5612], [5267, 5613], [5279, 5590], [5295, 5581], [5299, 5593], [5318, 5583], [5324, 5571], [5322, 5541], [5334, 5514], [5322, 5471], [5309, 5471], [5291, 5455], [5296, 5446], [5294, 5417], [5297, 5392], [5312, 5380], [5313, 5348], [5309, 5328], [5285, 5316], [5259, 5319], [5238, 5313], [5226, 5325], [5202, 5314], [5167, 5316], [5145, 5330], [5127, 5314], [5133, 5309], [5145, 5275], [5164, 5256], [5153, 5248], [5121, 5247], [5107, 5252], [5099, 5239], [5055, 5246], [5048, 5234], [5036, 5238], [5018, 5258], [5017, 5269], [4984, 5286], [4971, 5284], [4948, 5289], [4922, 5288], [4906, 5270]]], [[[4831, 5385], [4833, 5385], [4833, 5385], [4831, 5379], [4829, 5377], [4828, 5376], [4829, 5384], [4831, 5385]]], [[[4831, 5369], [4829, 5371], [4829, 5377], [4831, 5379], [4831, 5377], [4831, 5375], [4832, 5370], [4831, 5369]]], [[[4236, 5622], [4236, 5621], [4235, 5621], [4235, 5622], [4236, 5622]]], [[[4915, 5438], [4915, 5437], [4915, 5438], [4915, 5438], [4915, 5438]]]]
                    },
                    "id": "CN.620000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 630000,
                        "name": "青海",
                        "center": [101.778916, 36.623178],
                        "childrenNum": 8,
                        "level": "province",
                        "subFeatureIndex": 28,
                        "fullname": "青海省",
                        "filename": "qinghai",
                        "parent": "中国",
                        "areacode": 630000,
                        "longitude": 101.778916,
                        "latitude": 36.623178,
                        "cp": [4044, 5697],
                        "drilldown": "qinghai"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[1927, 5121], [1927, 5121], [1889, 5126], [1871, 5133], [1834, 5169], [1818, 5170], [1806, 5183], [1794, 5211], [1766, 5226], [1766, 5240], [1753, 5247], [1750, 5261], [1757, 5278], [1740, 5293], [1747, 5304], [1731, 5323], [1723, 5324], [1707, 5348], [1699, 5370], [1705, 5380], [1738, 5393], [1744, 5420], [1754, 5428], [1743, 5443], [1749, 5457], [1750, 5497], [1738, 5506], [1742, 5522], [1755, 5523], [1770, 5536], [1764, 5558], [1743, 5565], [1732, 5559], [1717, 5574], [1728, 5611], [1715, 5621], [1706, 5643], [1723, 5653], [1720, 5672], [1757, 5679], [1770, 5692], [1764, 5706], [1778, 5718], [1780, 5754], [1793, 5774], [1747, 5784], [1727, 5800], [1729, 5830], [1739, 5823], [1770, 5825], [1785, 5833], [1827, 5820], [1828, 5835], [1841, 5842], [1850, 5861], [1871, 5854], [1866, 5847], [1885, 5834], [1920, 5822], [1938, 5822], [1963, 5815], [1982, 5801], [1992, 5784], [2008, 5784], [2021, 5801], [2041, 5793], [2048, 5799], [2045, 5842], [2037, 5849], [2045, 5873], [2045, 5896], [1992, 5917], [1993, 5946], [2000, 5973], [2025, 5989], [2049, 5985], [2089, 6006], [2111, 6000], [2111, 6035], [2096, 6047], [2099, 6064], [2090, 6076], [2088, 6105], [2081, 6115], [2063, 6116], [2047, 6132], [2052, 6141], [2035, 6161], [1991, 6186], [2006, 6296], [2013, 6322], [1981, 6322], [1977, 6307], [1964, 6310], [1942, 6338], [1942, 6370], [1980, 6370], [1999, 6365], [2009, 6379], [2037, 6384], [2041, 6400], [2080, 6395], [2169, 6402], [2196, 6412], [2277, 6418], [2295, 6426], [2333, 6428], [2351, 6436], [2373, 6432], [2379, 6440], [2395, 6453], [2465, 6453], [2479, 6458], [2485, 6451], [2516, 6451], [2512, 6439], [2522, 6423], [2515, 6395], [2531, 6386], [2565, 6387], [2615, 6382], [2641, 6356], [2619, 6357], [2623, 6340], [2638, 6331], [2727, 6330], [2744, 6253], [2745, 6234], [2773, 6236], [2797, 6232], [2828, 6239], [2855, 6233], [2877, 6203], [2888, 6206], [2924, 6196], [2961, 6217], [2984, 6201], [2986, 6186], [3021, 6156], [3030, 6158], [3049, 6147], [3066, 6148], [3073, 6168], [3097, 6172], [3133, 6157], [3129, 6187], [3144, 6201], [3139, 6216], [3161, 6219], [3166, 6243], [3198, 6228], [3213, 6234], [3216, 6253], [3207, 6260], [3207, 6300], [3200, 6310], [3210, 6354], [3219, 6363], [3211, 6377], [3258, 6371], [3284, 6356], [3337, 6320], [3340, 6308], [3363, 6298], [3394, 6278], [3408, 6259], [3439, 6281], [3448, 6312], [3466, 6311], [3478, 6292], [3501, 6284], [3533, 6318], [3547, 6317], [3569, 6291], [3597, 6279], [3589, 6268], [3614, 6240], [3638, 6221], [3652, 6193], [3663, 6193], [3670, 6172], [3687, 6154], [3716, 6132], [3736, 6124], [3768, 6095], [3779, 6092], [3776, 6113], [3766, 6137], [3750, 6152], [3763, 6163], [3794, 6142], [3796, 6125], [3806, 6115], [3834, 6103], [3846, 6092], [3860, 6095], [3883, 6087], [3895, 6067], [3916, 6066], [3905, 6041], [3950, 5997], [3988, 5974], [4007, 5990], [4032, 5979], [4041, 5956], [4065, 5945], [4069, 5935], [4094, 5951], [4110, 5939], [4109, 5926], [4125, 5906], [4119, 5892], [4135, 5876], [4176, 5847], [4181, 5832], [4206, 5813], [4212, 5795], [4184, 5793], [4186, 5778], [4175, 5767], [4194, 5755], [4198, 5743], [4219, 5723], [4199, 5699], [4226, 5671], [4226, 5648], [4235, 5622], [4235, 5621], [4270, 5595], [4277, 5583], [4262, 5581], [4252, 5561], [4241, 5557], [4256, 5536], [4251, 5505], [4219, 5508], [4199, 5488], [4218, 5438], [4205, 5424], [4162, 5447], [4149, 5414], [4140, 5408], [4124, 5415], [4115, 5386], [4131, 5375], [4136, 5358], [4118, 5345], [4114, 5332], [4099, 5330], [4074, 5316], [4064, 5299], [4039, 5293], [4035, 5235], [4050, 5214], [4078, 5205], [4086, 5180], [4086, 5180], [4091, 5166], [4090, 5166], [4091, 5166], [4090, 5166], [4082, 5170], [4073, 5151], [4057, 5157], [4055, 5142], [4036, 5130], [4033, 5117], [4013, 5128], [3991, 5113], [3971, 5138], [3954, 5146], [3917, 5157], [3900, 5177], [3866, 5179], [3854, 5192], [3837, 5193], [3822, 5181], [3808, 5151], [3816, 5145], [3847, 5081], [3876, 5068], [3882, 5054], [3875, 5026], [3889, 5031], [3916, 5019], [3940, 5031], [3954, 5023], [3959, 4983], [3980, 4980], [3988, 4989], [3986, 4969], [3972, 4967], [3961, 4942], [3977, 4928], [3952, 4892], [3928, 4923], [3913, 4924], [3909, 4908], [3893, 4934], [3871, 4937], [3857, 4921], [3865, 4899], [3866, 4872], [3855, 4874], [3853, 4856], [3873, 4835], [3869, 4813], [3855, 4799], [3840, 4805], [3810, 4789], [3766, 4810], [3754, 4777], [3736, 4788], [3731, 4802], [3711, 4833], [3699, 4825], [3684, 4832], [3672, 4802], [3650, 4818], [3661, 4830], [3660, 4856], [3645, 4878], [3630, 4884], [3617, 4907], [3610, 4885], [3598, 4888], [3590, 4848], [3560, 4852], [3552, 4866], [3520, 4883], [3497, 4880], [3493, 4904], [3483, 4919], [3450, 4931], [3424, 4949], [3408, 4979], [3414, 5001], [3406, 5010], [3409, 5025], [3393, 5043], [3389, 5064], [3397, 5065], [3377, 5090], [3364, 5115], [3354, 5120], [3363, 5145], [3358, 5170], [3322, 5172], [3292, 5183], [3272, 5204], [3272, 5204], [3253, 5209], [3219, 5193], [3224, 5172], [3214, 5155], [3174, 5143], [3161, 5144], [3165, 5096], [3160, 5080], [3180, 5071], [3182, 5045], [3196, 5043], [3219, 5029], [3203, 5014], [3192, 5014], [3181, 4989], [3163, 4979], [3162, 4965], [3170, 4948], [3166, 4937], [3136, 4933], [3134, 4893], [3140, 4875], [3161, 4854], [3195, 4829], [3183, 4828], [3145, 4838], [3142, 4848], [3118, 4834], [3128, 4830], [3118, 4817], [3126, 4813], [3131, 4789], [3120, 4778], [3106, 4785], [3097, 4760], [3103, 4735], [3068, 4731], [3045, 4739], [3022, 4730], [2989, 4733], [3003, 4704], [2992, 4697], [3004, 4665], [2991, 4655], [2961, 4673], [2953, 4668], [2934, 4683], [2922, 4719], [2896, 4724], [2878, 4691], [2890, 4671], [2879, 4651], [2870, 4652], [2868, 4675], [2851, 4685], [2841, 4704], [2825, 4706], [2808, 4678], [2801, 4694], [2770, 4705], [2755, 4697], [2737, 4720], [2725, 4750], [2746, 4771], [2740, 4800], [2721, 4794], [2714, 4806], [2712, 4835], [2684, 4824], [2684, 4838], [2717, 4840], [2710, 4852], [2683, 4853], [2666, 4863], [2652, 4864], [2649, 4877], [2633, 4882], [2629, 4898], [2602, 4929], [2585, 4914], [2557, 4916], [2551, 4901], [2517, 4903], [2503, 4886], [2471, 4902], [2452, 4900], [2446, 4920], [2415, 4929], [2407, 4918], [2386, 4910], [2378, 4930], [2362, 4925], [2339, 4959], [2305, 4955], [2299, 4982], [2271, 4976], [2236, 4997], [2225, 4988], [2173, 5005], [2153, 4998], [2143, 5007], [2150, 5021], [2137, 5038], [2099, 5028], [2090, 5049], [2070, 5060], [2034, 5087], [2021, 5105], [2007, 5097], [1977, 5119], [1950, 5107], [1927, 5121]]]]
                    },
                    "id": "CN.630000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 640000,
                        "name": "宁夏",
                        "center": [106.278179, 38.46637],
                        "childrenNum": 5,
                        "level": "province",
                        "subFeatureIndex": 29,
                        "fullname": "宁夏回族自治区",
                        "filename": "ningxia",
                        "parent": "中国",
                        "areacode": 640000,
                        "longitude": 106.278179,
                        "latitude": 38.46637,
                        "cp": [4904, 6074],
                        "drilldown": "ningxia"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4831, 5377], [4831, 5379], [4833, 5385], [4833, 5385], [4831, 5385], [4821, 5393], [4794, 5398], [4789, 5387], [4762, 5436], [4775, 5443], [4759, 5448], [4740, 5442], [4723, 5445], [4708, 5478], [4697, 5484], [4701, 5517], [4734, 5542], [4725, 5560], [4729, 5577], [4716, 5594], [4716, 5608], [4703, 5633], [4696, 5631], [4685, 5657], [4686, 5680], [4706, 5681], [4709, 5695], [4693, 5717], [4683, 5716], [4680, 5741], [4641, 5754], [4625, 5795], [4611, 5804], [4585, 5795], [4578, 5805], [4585, 5818], [4600, 5824], [4595, 5842], [4551, 5854], [4523, 5851], [4546, 5859], [4548, 5869], [4619, 5871], [4632, 5877], [4661, 5879], [4678, 5890], [4717, 5904], [4769, 5901], [4775, 5919], [4800, 5923], [4809, 5937], [4809, 5955], [4818, 5969], [4807, 5989], [4808, 6013], [4826, 6038], [4818, 6054], [4831, 6107], [4827, 6118], [4838, 6139], [4837, 6153], [4858, 6172], [4852, 6180], [4869, 6193], [4877, 6220], [4887, 6236], [4912, 6233], [4914, 6262], [4936, 6266], [4954, 6260], [4973, 6284], [4988, 6279], [5000, 6284], [5010, 6269], [5007, 6245], [5017, 6219], [5037, 6206], [5033, 6179], [4986, 6129], [4976, 6102], [4972, 6071], [4962, 6053], [4940, 6037], [4951, 6025], [4991, 6001], [5036, 5986], [5068, 5993], [5093, 5976], [5113, 5953], [5109, 5941], [5122, 5942], [5150, 5922], [5144, 5901], [5122, 5900], [5118, 5886], [5092, 5864], [5090, 5843], [5079, 5835], [5073, 5802], [5086, 5761], [5072, 5747], [5057, 5758], [5040, 5752], [5029, 5758], [5002, 5749], [4982, 5764], [4982, 5764], [4976, 5751], [4949, 5759], [4960, 5732], [4946, 5715], [4956, 5685], [4950, 5665], [4942, 5671], [4929, 5662], [4929, 5662], [4919, 5633], [4905, 5626], [4927, 5609], [4920, 5591], [4921, 5560], [4939, 5561], [4939, 5561], [4987, 5543], [4987, 5543], [5004, 5516], [5002, 5496], [4982, 5469], [4995, 5449], [4983, 5435], [4959, 5425], [4915, 5438], [4915, 5438], [4902, 5427], [4909, 5402], [4901, 5390], [4912, 5364], [4905, 5340], [4876, 5331], [4850, 5372], [4837, 5356], [4832, 5370], [4831, 5375], [4831, 5376], [4831, 5377], [4831, 5377]]], [[[4829, 5384], [4828, 5376], [4797, 5369], [4798, 5378], [4829, 5384]]], [[[4831, 5375], [4831, 5377], [4831, 5377], [4831, 5376], [4831, 5375]]]]
                    },
                    "id": "CN.640000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 650000,
                        "name": "新疆",
                        "center": [87.617733, 43.792818],
                        "childrenNum": 23,
                        "level": "province",
                        "subFeatureIndex": 30,
                        "fullname": "新疆维吾尔自治区",
                        "filename": "xinjiang",
                        "parent": "中国",
                        "areacode": 650000,
                        "longitude": 87.617733,
                        "latitude": 43.792818,
                        "cp": [1697, 7693],
                        "drilldown": "xinjiang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[-270, 5806], [-282, 5821], [-297, 5826], [-319, 5846], [-322, 5862], [-335, 5869], [-346, 5864], [-350, 5881], [-371, 5878], [-370, 5890], [-396, 5903], [-394, 5922], [-404, 5927], [-391, 5963], [-398, 5977], [-392, 5985], [-404, 6002], [-400, 6018], [-411, 6022], [-414, 6049], [-407, 6080], [-378, 6104], [-401, 6109], [-420, 6107], [-436, 6123], [-462, 6113], [-492, 6127], [-515, 6130], [-528, 6150], [-549, 6150], [-568, 6171], [-588, 6176], [-608, 6197], [-622, 6199], [-629, 6223], [-646, 6233], [-649, 6244], [-639, 6260], [-647, 6268], [-685, 6254], [-697, 6261], [-725, 6266], [-717, 6282], [-722, 6309], [-747, 6323], [-745, 6343], [-730, 6346], [-728, 6361], [-719, 6358], [-726, 6387], [-714, 6400], [-720, 6445], [-729, 6465], [-752, 6491], [-784, 6504], [-787, 6495], [-801, 6496], [-804, 6511], [-797, 6551], [-827, 6560], [-845, 6576], [-862, 6582], [-891, 6571], [-893, 6599], [-914, 6598], [-917, 6612], [-945, 6606], [-955, 6619], [-957, 6637], [-944, 6656], [-916, 6648], [-902, 6656], [-890, 6637], [-872, 6636], [-866, 6645], [-828, 6647], [-818, 6666], [-828, 6692], [-834, 6691], [-848, 6708], [-851, 6735], [-824, 6753], [-836, 6774], [-830, 6802], [-839, 6837], [-832, 6889], [-813, 6903], [-810, 6922], [-819, 6937], [-832, 6941], [-843, 6958], [-865, 6972], [-913, 6989], [-926, 6998], [-946, 6980], [-944, 6970], [-974, 6976], [-976, 6987], [-992, 6998], [-993, 7025], [-988, 7037], [-996, 7059], [-978, 7075], [-970, 7067], [-963, 7095], [-978, 7096], [-977, 7115], [-985, 7144], [-999, 7160], [-992, 7178], [-1000, 7188], [-982, 7190], [-976, 7202], [-952, 7195], [-929, 7194], [-907, 7217], [-907, 7251], [-918, 7258], [-913, 7275], [-899, 7282], [-895, 7295], [-879, 7308], [-884, 7312], [-866, 7325], [-822, 7323], [-807, 7311], [-789, 7318], [-759, 7340], [-741, 7340], [-732, 7354], [-696, 7344], [-710, 7373], [-702, 7386], [-689, 7383], [-677, 7369], [-656, 7358], [-649, 7362], [-631, 7354], [-606, 7370], [-591, 7373], [-565, 7387], [-551, 7378], [-556, 7352], [-543, 7339], [-560, 7316], [-558, 7295], [-534, 7301], [-520, 7289], [-503, 7307], [-470, 7299], [-449, 7308], [-444, 7283], [-422, 7290], [-401, 7302], [-394, 7320], [-372, 7333], [-364, 7350], [-366, 7366], [-348, 7376], [-335, 7406], [-318, 7408], [-309, 7418], [-286, 7424], [-271, 7418], [-261, 7402], [-239, 7396], [-225, 7402], [-207, 7387], [-187, 7381], [-142, 7387], [-141, 7405], [-122, 7413], [-111, 7407], [-80, 7414], [-66, 7449], [-38, 7443], [-13, 7444], [11, 7455], [23, 7449], [43, 7466], [58, 7464], [87, 7480], [98, 7479], [122, 7490], [136, 7487], [159, 7503], [164, 7498], [185, 7506], [200, 7500], [218, 7508], [242, 7505], [262, 7531], [275, 7534], [313, 7524], [325, 7533], [319, 7552], [326, 7562], [348, 7565], [352, 7586], [345, 7597], [344, 7614], [358, 7629], [347, 7663], [362, 7676], [374, 7706], [402, 7703], [418, 7710], [437, 7709], [419, 7727], [405, 7750], [447, 7766], [482, 7760], [488, 7801], [474, 7807], [492, 7834], [493, 7846], [469, 7931], [472, 7953], [466, 7975], [470, 7996], [463, 8010], [473, 8042], [474, 8097], [490, 8124], [479, 8151], [462, 8167], [461, 8190], [430, 8184], [429, 8205], [417, 8216], [468, 8242], [484, 8232], [500, 8238], [512, 8230], [531, 8246], [548, 8237], [573, 8244], [600, 8231], [608, 8238], [623, 8235], [641, 8246], [651, 8242], [701, 8245], [725, 8251], [737, 8261], [764, 8262], [780, 8221], [803, 8222], [811, 8209], [844, 8211], [874, 8189], [893, 8196], [901, 8225], [896, 8246], [856, 8282], [858, 8302], [866, 8325], [878, 8337], [886, 8376], [908, 8383], [926, 8424], [978, 8500], [1009, 8564], [1019, 8575], [1039, 8620], [1051, 8631], [1063, 8667], [1086, 8667], [1100, 8649], [1119, 8646], [1125, 8630], [1133, 8632], [1148, 8610], [1179, 8596], [1204, 8577], [1217, 8580], [1230, 8571], [1250, 8577], [1279, 8569], [1289, 8571], [1301, 8559], [1343, 8561], [1358, 8545], [1368, 8519], [1379, 8531], [1396, 8533], [1435, 8559], [1442, 8552], [1480, 8548], [1490, 8568], [1510, 8585], [1513, 8608], [1520, 8624], [1511, 8655], [1514, 8668], [1522, 8783], [1520, 8789], [1537, 8828], [1556, 8844], [1562, 8861], [1581, 8879], [1603, 8880], [1654, 8869], [1670, 8882], [1688, 8876], [1718, 8886], [1732, 8906], [1760, 8928], [1757, 8942], [1771, 8957], [1763, 8970], [1763, 8996], [1783, 9007], [1795, 9026], [1828, 9021], [1833, 9026], [1852, 9012], [1876, 9003], [1883, 8996], [1897, 9001], [1896, 9011], [1951, 9010], [1956, 8993], [1948, 8979], [1958, 8959], [1951, 8952], [1931, 8950], [1926, 8939], [1953, 8902], [1968, 8898], [1976, 8882], [1962, 8867], [1950, 8862], [1962, 8847], [1973, 8844], [1985, 8829], [2012, 8816], [2022, 8797], [2033, 8800], [2047, 8779], [2040, 8765], [2050, 8736], [2071, 8723], [2074, 8715], [2094, 8714], [2112, 8679], [2138, 8673], [2165, 8685], [2197, 8678], [2206, 8645], [2219, 8639], [2221, 8623], [2254, 8620], [2256, 8630], [2277, 8622], [2272, 8600], [2280, 8585], [2311, 8570], [2317, 8535], [2327, 8521], [2324, 8498], [2333, 8490], [2324, 8475], [2332, 8446], [2359, 8388], [2381, 8377], [2388, 8355], [2383, 8342], [2398, 8313], [2387, 8280], [2397, 8273], [2374, 8230], [2358, 8217], [2371, 8167], [2369, 8142], [2334, 8114], [2305, 8078], [2293, 8043], [2289, 8020], [2304, 8004], [2305, 7970], [2317, 7965], [2314, 7943], [2337, 7946], [2358, 7942], [2375, 7921], [2397, 7911], [2411, 7920], [2428, 7898], [2450, 7892], [2470, 7893], [2521, 7886], [2543, 7867], [2556, 7868], [2587, 7857], [2637, 7863], [2655, 7859], [2662, 7851], [2704, 7845], [2747, 7824], [2761, 7826], [2794, 7803], [2795, 7796], [2874, 7737], [2891, 7714], [2894, 7697], [2913, 7693], [2935, 7676], [2952, 7647], [2990, 7631], [2998, 7620], [3069, 7622], [3049, 7559], [3083, 7550], [3095, 7511], [3108, 7446], [3124, 7400], [3125, 7367], [3130, 7354], [3200, 7266], [3199, 7224], [3146, 7200], [3130, 7187], [3119, 7163], [3134, 7155], [3127, 7135], [3148, 7106], [3129, 7092], [3137, 7068], [3131, 7052], [3116, 7039], [3081, 7025], [3049, 7024], [3029, 7018], [2995, 6997], [2974, 6970], [2951, 7022], [2899, 7003], [2876, 6974], [2836, 6971], [2767, 6922], [2731, 6890], [2688, 6839], [2688, 6818], [2673, 6789], [2627, 6791], [2521, 6787], [2509, 6726], [2484, 6692], [2466, 6626], [2435, 6546], [2410, 6515], [2372, 6488], [2372, 6446], [2379, 6440], [2373, 6432], [2351, 6436], [2333, 6428], [2295, 6426], [2277, 6418], [2196, 6412], [2169, 6402], [2080, 6395], [2041, 6400], [2037, 6384], [2009, 6379], [1999, 6365], [1980, 6370], [1942, 6370], [1942, 6338], [1964, 6310], [1977, 6307], [1981, 6322], [2013, 6322], [2006, 6296], [1991, 6186], [2035, 6161], [2052, 6141], [2047, 6132], [2063, 6116], [2081, 6115], [2088, 6105], [2090, 6076], [2099, 6064], [2096, 6047], [2111, 6035], [2111, 6000], [2089, 6006], [2049, 5985], [2025, 5989], [2000, 5973], [1993, 5946], [1992, 5917], [2045, 5896], [2045, 5873], [2037, 5849], [2045, 5842], [2048, 5799], [2041, 5793], [2021, 5801], [2008, 5784], [1992, 5784], [1982, 5801], [1963, 5815], [1938, 5822], [1920, 5822], [1885, 5834], [1866, 5847], [1871, 5854], [1850, 5861], [1841, 5842], [1828, 5835], [1827, 5820], [1785, 5833], [1746, 5852], [1728, 5873], [1712, 5877], [1703, 5893], [1682, 5885], [1679, 5893], [1655, 5906], [1649, 5917], [1626, 5915], [1620, 5905], [1594, 5932], [1588, 5950], [1569, 5958], [1549, 5955], [1527, 5961], [1505, 5955], [1478, 5962], [1470, 5955], [1429, 5958], [1398, 5953], [1380, 5959], [1380, 5972], [1362, 5977], [1350, 5966], [1329, 5966], [1318, 5956], [1291, 5963], [1269, 5956], [1265, 5965], [1244, 5967], [1234, 5958], [1198, 5955], [1175, 5959], [1134, 5949], [1132, 5926], [1118, 5916], [1099, 5888], [1076, 5876], [1050, 5881], [1019, 5875], [1009, 5859], [966, 5878], [951, 5901], [928, 5895], [909, 5900], [843, 5880], [789, 5875], [786, 5857], [762, 5848], [727, 5842], [715, 5845], [701, 5861], [676, 5853], [638, 5859], [626, 5855], [596, 5872], [559, 5888], [537, 5887], [529, 5904], [517, 5912], [519, 5955], [487, 5965], [475, 5956], [458, 5972], [421, 5984], [402, 5974], [397, 5953], [337, 5939], [336, 5916], [309, 5903], [274, 5908], [261, 5904], [231, 5911], [230, 5924], [209, 5943], [181, 5941], [163, 5965], [149, 5962], [145, 5947], [113, 5961], [84, 5966], [80, 5979], [54, 5985], [37, 5998], [18, 5991], [4, 5972], [17, 5949], [-2, 5952], [-9, 5941], [-34, 5927], [-52, 5923], [-57, 5893], [-77, 5879], [-92, 5849], [-121, 5808], [-146, 5807], [-177, 5814], [-231, 5816], [-242, 5825], [-272, 5822], [-270, 5806]]]]
                    },
                    "id": "CN.650000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 710000,
                        "name": "台湾",
                        "center": [121.509062, 25.044332],
                        "childrenNum": 0,
                        "level": "province",
                        "subFeatureIndex": 31,
                        "fullname": "台湾省",
                        "filename": "taiwan",
                        "parent": "中国",
                        "areacode": 710000,
                        "longitude": 121.509062,
                        "latitude": 25.044332,
                        "cp": [7851, 3021]
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7658, 2432], [7627, 2451], [7606, 2493], [7589, 2555], [7565, 2570], [7581, 2630], [7583, 2666], [7577, 2685], [7577, 2710], [7591, 2734], [7605, 2742], [7611, 2762], [7689, 2915], [7716, 2936], [7729, 2954], [7733, 2976], [7753, 3016], [7790, 3037], [7822, 3046], [7836, 3071], [7854, 3080], [7872, 3078], [7898, 3050], [7933, 3046], [7941, 3023], [7954, 3017], [7922, 2978], [7922, 2956], [7934, 2930], [7934, 2910], [7920, 2867], [7889, 2812], [7893, 2792], [7886, 2772], [7870, 2686], [7863, 2638], [7851, 2609], [7855, 2596], [7844, 2584], [7835, 2552], [7806, 2502], [7778, 2484], [7757, 2406], [7758, 2346], [7750, 2334], [7752, 2315], [7717, 2320], [7705, 2343], [7701, 2390], [7685, 2416], [7658, 2432]]], [[[7485, 2673], [7478, 2662], [7468, 2680], [7491, 2684], [7485, 2673]]], [[[8245, 3200], [8246, 3198], [8245, 3198], [8245, 3198], [8245, 3197], [8243, 3197], [8242, 3197], [8240, 3196], [8240, 3196], [8245, 3200]]], [[[8257, 3195], [8257, 3195], [8256, 3196], [8256, 3196], [8257, 3195]]], [[[8282, 3241], [8283, 3241], [8283, 3240], [8283, 3240], [8282, 3241]]], [[[8259, 3194], [8259, 3194], [8257, 3194], [8257, 3194], [8259, 3194]]], [[[7883, 2363], [7896, 2364], [7901, 2344], [7883, 2363]]], [[[8259, 3194], [8259, 3194], [8259, 3194], [8259, 3194], [8259, 3194]]]]
                    },
                    "id": "CN.710000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 810000,
                        "name": "香港",
                        "center": [114.173355, 22.320048],
                        "childrenNum": 18,
                        "level": "province",
                        "subFeatureIndex": 32,
                        "fullname": "香港特别行政区",
                        "filename": "xianggang",
                        "parent": "中国",
                        "areacode": 810000,
                        "longitude": 114.173355,
                        "latitude": 22.320048,
                        "cp": [6361, 2379],
                        "drilldown": "xianggang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6332, 2419], [6335, 2419], [6335, 2419], [6364, 2430], [6364, 2430], [6373, 2428], [6373, 2425], [6380, 2428], [6380, 2428], [6382, 2426], [6385, 2424], [6399, 2404], [6409, 2404], [6409, 2404], [6399, 2383], [6392, 2393], [6391, 2374], [6391, 2374], [6377, 2368], [6380, 2352], [6366, 2359], [6350, 2368], [6350, 2379], [6333, 2374], [6331, 2358], [6294, 2350], [6304, 2376], [6329, 2381], [6309, 2389], [6309, 2400], [6332, 2419]]], [[[6398, 2365], [6399, 2367], [6399, 2367], [6398, 2365]]], [[[6392, 2392], [6392, 2392], [6392, 2392], [6392, 2393], [6392, 2392]]], [[[6403, 2379], [6403, 2379], [6403, 2379], [6403, 2379]]]]
                    },
                    "id": "CN.810000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 820000,
                        "name": "澳门",
                        "center": [113.54909, 22.198951],
                        "childrenNum": 8,
                        "level": "province",
                        "subFeatureIndex": 33,
                        "fullname": "澳门特别行政区",
                        "filename": "aomen",
                        "parent": "中国",
                        "areacode": 820000,
                        "longitude": 113.54909,
                        "latitude": 22.198951,
                        "cp": [6232, 2352],
                        "drilldown": "aomen"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6234, 2355], [6243, 2337], [6233, 2331], [6234, 2355]]]]
                    },
                    "id": "CN.820000"
                }, {
                    "type": "Feature",
                    "id": "CN.000000",
                    "properties": {
                        "name": "南海诸岛",
                        "fullname": "南海诸岛",
                        "filename": "nanhai",
                        "areacode": "710000",
                        "hc-key": "000000",
                        "hasc": "CN",
                        "parent": "中国",
                        "country": "中国"
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[8400, 2943.3333333333335], [8533.333333333334, 2818.6666666666665], [8685.714285714286, 2807.3333333333335], [8971.42857142857, 2886.6666666666665], [9200, 2988.6666666666665], [9390.47619047619, 2988.6666666666665], [9466.666666666666, 2875.3333333333335], [9523.809523809523, 2988.6666666666665], [9619.047619047618, 2988.6666666666665], [9619.047619047618, 3000], [8495.238095238095, 3000], [8400, 2943.3333333333335]], [[8647.619047619048, 2739.3333333333335], [8761.904761904761, 2762], [8704.761904761905, 2648.6666666666665], [8609.52380952381, 2626], [8647.619047619048, 2739.3333333333335]], [[8628.57142857143, 2478.6666666666665], [8666.666666666666, 2376.6666666666665], [8685.714285714286, 2376.6666666666665], [8647.619047619048, 2478.6666666666665], [8628.57142857143, 2478.6666666666665]], [[8704.761904761905, 2229.333333333333], [8628.57142857143, 2138.6666666666665], [8647.619047619048, 2138.6666666666665], [8742.857142857143, 2229.333333333333], [8704.761904761905, 2229.333333333333]], [[8514.285714285714, 1957.3333333333333], [8552.380952380952, 1866.6666666666667], [8571.42857142857, 1866.6666666666667], [8552.380952380952, 1957.3333333333333], [8514.285714285714, 1957.3333333333333]], [[8838.095238095239, 1662.666666666667], [8952.380952380952, 1708.0000000000002], [8971.42857142857, 1708.0000000000002], [8876.190476190477, 1662.666666666667], [8838.095238095239, 1662.666666666667]], [[9104.761904761905, 1855.3333333333333], [9219.047619047618, 1991.3333333333335], [9238.095238095239, 1991.3333333333335], [9142.857142857143, 1855.3333333333333], [9104.761904761905, 1855.3333333333333]], [[9314.285714285714, 2172.6666666666665], [9371.42857142857, 2263.3333333333335], [9409.52380952381, 2263.3333333333335], [9352.380952380952, 2172.6666666666665], [9314.285714285714, 2172.6666666666665]], [[9371.42857142857, 2433.3333333333335], [9371.42857142857, 2535.3333333333335], [9409.52380952381, 2535.3333333333335], [9409.52380952381, 2433.3333333333335], [9371.42857142857, 2433.3333333333335]], [[9390.47619047619, 2637.3333333333335], [9447.619047619048, 2716.6666666666665], [9466.666666666666, 2716.6666666666665], [9409.52380952381, 2637.3333333333335], [9390.47619047619, 2637.3333333333335]], [[9504.761904761905, 2796], [9580.952380952382, 2886.6666666666665], [9600, 2886.6666666666665], [9542.857142857143, 2796], [9504.761904761905, 2796]], [[8400, 2943.3333333333335], [8400, 1492.6666666666667], [9619.047619047618, 1492.6666666666667], [9619.047619047618, 3000], [9614.285714285714, 3000], [9614.285714285714, 1496.7142857142858], [8404.761904761905, 1496.7142857142858], [8404.761904761905, 2943.3333333333335], [8400, 2943.3333333333335]]]
                    }
                }, {
                    "type": "Feature",
                    "id": "CN.000000",
                    "properties": {
                        "name": "南海诸岛",
                        "fullname": "南海诸岛",
                        "filename": "nanhai",
                        "areacode": "710000",
                        "hc-key": "000000",
                        "hasc": "CN",
                        "parent": "中国",
                        "country": "中国"
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[8400, 2943.3333333333335], [8533.333333333334, 2818.6666666666665], [8685.714285714286, 2807.3333333333335], [8971.42857142857, 2886.6666666666665], [9200, 2988.6666666666665], [9390.47619047619, 2988.6666666666665], [9466.666666666666, 2875.3333333333335], [9523.809523809523, 2988.6666666666665], [9619.047619047618, 2988.6666666666665], [9619.047619047618, 3000], [8495.238095238095, 3000], [8400, 2943.3333333333335]], [[8647.619047619048, 2739.3333333333335], [8761.904761904761, 2762], [8704.761904761905, 2648.6666666666665], [8609.52380952381, 2626], [8647.619047619048, 2739.3333333333335]], [[8628.57142857143, 2478.6666666666665], [8666.666666666666, 2376.6666666666665], [8685.714285714286, 2376.6666666666665], [8647.619047619048, 2478.6666666666665], [8628.57142857143, 2478.6666666666665]], [[8704.761904761905, 2229.333333333333], [8628.57142857143, 2138.6666666666665], [8647.619047619048, 2138.6666666666665], [8742.857142857143, 2229.333333333333], [8704.761904761905, 2229.333333333333]], [[8514.285714285714, 1957.3333333333333], [8552.380952380952, 1866.6666666666667], [8571.42857142857, 1866.6666666666667], [8552.380952380952, 1957.3333333333333], [8514.285714285714, 1957.3333333333333]], [[8838.095238095239, 1662.666666666667], [8952.380952380952, 1708.0000000000002], [8971.42857142857, 1708.0000000000002], [8876.190476190477, 1662.666666666667], [8838.095238095239, 1662.666666666667]], [[9104.761904761905, 1855.3333333333333], [9219.047619047618, 1991.3333333333335], [9238.095238095239, 1991.3333333333335], [9142.857142857143, 1855.3333333333333], [9104.761904761905, 1855.3333333333333]], [[9314.285714285714, 2172.6666666666665], [9371.42857142857, 2263.3333333333335], [9409.52380952381, 2263.3333333333335], [9352.380952380952, 2172.6666666666665], [9314.285714285714, 2172.6666666666665]], [[9371.42857142857, 2433.3333333333335], [9371.42857142857, 2535.3333333333335], [9409.52380952381, 2535.3333333333335], [9409.52380952381, 2433.3333333333335], [9371.42857142857, 2433.3333333333335]], [[9390.47619047619, 2637.3333333333335], [9447.619047619048, 2716.6666666666665], [9466.666666666666, 2716.6666666666665], [9409.52380952381, 2637.3333333333335], [9390.47619047619, 2637.3333333333335]], [[9504.761904761905, 2796], [9580.952380952382, 2886.6666666666665], [9600, 2886.6666666666665], [9542.857142857143, 2796], [9504.761904761905, 2796]], [[8400, 2943.3333333333335], [8400, 1492.6666666666667], [9619.047619047618, 1492.6666666666667], [9619.047619047618, 3000], [9614.285714285714, 3000], [9614.285714285714, 1496.7142857142858], [8404.761904761905, 1496.7142857142858], [8404.761904761905, 2943.3333333333335], [8400, 2943.3333333333335]]]
                    }
                }],
                "filename": "china",
                "shortName": "中国"
            };


            var mapArray = highCharts.maps['cn/china'];
            //var mappoint = highCharts.geojson(mapArray);


            scope.$on('areaUvData',function(ev,data){
               //console.log(data);

                $timeout(function () {
                    highCharts.Map('areaDataContainer', {
                        chart: {
                            height: 500
                        },
                        title: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        },
                        colorAxis: {
                            min: 1,
                            type: 'logarithmic',
                            minColor: '#000000',
                            maxColor: '#333333',
                            stops: [
                                [0, '#2062e6'],
                                [0.67, '#2062e6'],
                                [1, '#2062e6']
                            ]
                        },
                        legend: {
                            align: 'left',
                            //backgroundColor: (highCharts.theme && highCharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                            floating: true,
                            layout: 'vertical',
                            verticalAlign: 'bottom'
                        },
                        series: [{
                            name: '访客数',
                            states: {
                                hover: {
                                    color: '#ffffff'
                                }
                            }
                        }, {
                            data: data,
                            mapData: mapArray,
                            joinBy: ['name', 'name'],
                            name: '访客数',
                            showInLegend: false,
                            tooltip: {
                                pointFormat: '{point.name}：{point.value}'
                            },
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}',
                                style: {
                                    fontSize: '8px'
                                }
                            }
                        }]
                    });
                })
            });
        }
    }
}]);

/*
* 来源分析----下单地域分布图表
*/
angular.module('app').directive('orderAreaDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts/highstock');
            require('highcharts/modules/map')(highCharts);
            require('highcharts/modules/data')(highCharts);

            highCharts.maps["cn/china"] = {
                "title": "中国",
                "version": "0.0.3",
                "type": "FeatureCollection",
                "copyright": "Copyright (c) 2017 Jianshu Technology Co.,LTD",
                "copyrightShort": "Jianshu Technology",
                "copyrightUrl": "https://jianshukeji.com",
                "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG:3415"}},
                "hc-transform": {
                    "default": {
                        "crs": "+proj=lcc +lat_1=18 +lat_2=24 +lat_0=21 +lon_0=114 +x_0=500000 +y_0=500000 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
                        "scale": 0.000129831107685,
                        "jsonres": 15.5,
                        "jsonmarginX": -999,
                        "jsonmarginY": 9851,
                        "xoffset": -3139937.49309,
                        "yoffset": 4358972.7486
                    }
                },
                "features": [{
                    "type": "Feature",
                    "properties": {
                        "adcode": 110000,
                        "name": "北京",
                        "center": [116.405285, 39.904989],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 0,
                        "fullname": "北京市",
                        "filename": "beijing",
                        "parent": "中国",
                        "areacode": 110000,
                        "longitude": 116.405285,
                        "latitude": 39.904989,
                        "cp": [6763, 6381],
                        "drilldown": "beijing"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6909, 6426], [6890, 6423], [6890, 6423], [6890, 6423], [6889, 6423], [6889, 6423], [6890, 6423], [6871, 6412], [6858, 6418], [6832, 6413], [6827, 6397], [6833, 6378], [6858, 6366], [6863, 6353], [6854, 6349], [6855, 6331], [6839, 6314], [6821, 6311], [6821, 6311], [6822, 6310], [6822, 6310], [6823, 6309], [6823, 6309], [6819, 6307], [6819, 6307], [6801, 6314], [6786, 6309], [6771, 6292], [6770, 6272], [6752, 6275], [6736, 6289], [6728, 6306], [6709, 6303], [6709, 6303], [6683, 6299], [6674, 6308], [6674, 6308], [6664, 6297], [6664, 6297], [6663, 6296], [6663, 6296], [6658, 6288], [6658, 6288], [6646, 6287], [6646, 6287], [6643, 6293], [6643, 6293], [6643, 6293], [6643, 6293], [6643, 6294], [6643, 6294], [6640, 6294], [6640, 6294], [6640, 6294], [6640, 6294], [6640, 6296], [6640, 6296], [6639, 6298], [6639, 6298], [6636, 6302], [6635, 6302], [6635, 6302], [6636, 6302], [6635, 6302], [6635, 6302], [6635, 6302], [6615, 6305], [6595, 6319], [6595, 6319], [6599, 6330], [6599, 6330], [6588, 6351], [6588, 6351], [6611, 6358], [6601, 6363], [6603, 6378], [6585, 6390], [6590, 6408], [6616, 6430], [6641, 6433], [6648, 6444], [6662, 6437], [6670, 6458], [6683, 6465], [6673, 6486], [6663, 6489], [6663, 6489], [6648, 6507], [6643, 6530], [6671, 6549], [6688, 6541], [6703, 6551], [6727, 6579], [6732, 6591], [6771, 6587], [6747, 6618], [6772, 6616], [6769, 6636], [6780, 6637], [6780, 6637], [6794, 6635], [6797, 6654], [6810, 6652], [6809, 6635], [6818, 6617], [6842, 6603], [6862, 6573], [6888, 6574], [6920, 6563], [6938, 6569], [6958, 6567], [6939, 6540], [6931, 6545], [6908, 6527], [6910, 6494], [6926, 6473], [6926, 6473], [6926, 6473], [6926, 6473], [6941, 6461], [6937, 6447], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6447], [6933, 6438], [6909, 6426]]]]
                    },
                    "id": "CN.110000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 120000,
                        "name": "天津",
                        "center": [117.190182, 39.125596],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 1,
                        "fullname": "天津市",
                        "filename": "tianjin",
                        "parent": "中国",
                        "areacode": 120000,
                        "longitude": 117.190182,
                        "latitude": 39.125596,
                        "cp": [6910, 6200],
                        "drilldown": "tianjin"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6909, 6426], [6933, 6438], [6937, 6447], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6448], [6937, 6447], [6941, 6461], [6952, 6467], [6974, 6459], [6989, 6437], [6989, 6437], [6989, 6437], [6989, 6437], [7001, 6428], [7001, 6428], [7009, 6426], [7009, 6426], [7014, 6401], [6983, 6401], [6978, 6407], [6965, 6386], [6965, 6386], [6970, 6368], [6970, 6368], [6970, 6365], [6970, 6365], [6978, 6343], [6990, 6337], [6994, 6322], [6986, 6314], [7007, 6304], [7007, 6304], [7009, 6311], [7031, 6313], [7044, 6308], [7033, 6280], [7029, 6250], [7052, 6247], [7052, 6247], [7054, 6244], [7054, 6244], [7061, 6241], [7061, 6241], [7062, 6242], [7062, 6242], [7062, 6242], [7062, 6242], [7065, 6226], [7035, 6202], [7029, 6186], [7033, 6163], [7041, 6161], [7032, 6139], [7019, 6142], [6995, 6132], [6995, 6122], [7013, 6115], [7011, 6097], [6995, 6084], [6965, 6081], [6950, 6071], [6924, 6066], [6916, 6086], [6916, 6086], [6910, 6080], [6910, 6080], [6895, 6073], [6885, 6101], [6868, 6096], [6867, 6096], [6867, 6096], [6868, 6096], [6868, 6096], [6868, 6096], [6854, 6094], [6851, 6108], [6834, 6108], [6828, 6118], [6822, 6153], [6836, 6181], [6836, 6181], [6841, 6181], [6841, 6181], [6859, 6195], [6859, 6195], [6859, 6195], [6859, 6195], [6850, 6206], [6850, 6206], [6855, 6222], [6850, 6253], [6836, 6274], [6839, 6314], [6855, 6331], [6857, 6335], [6857, 6335], [6870, 6320], [6870, 6320], [6896, 6315], [6905, 6322], [6903, 6339], [6903, 6339], [6910, 6350], [6900, 6363], [6914, 6371], [6899, 6377], [6899, 6393], [6907, 6404], [6909, 6426]]]]
                    },
                    "id": "CN.120000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 130000,
                        "name": "河北",
                        "center": [114.502461, 38.045474],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 2,
                        "fullname": "河北省",
                        "filename": "hebei",
                        "parent": "中国",
                        "areacode": 130000,
                        "longitude": 114.502461,
                        "latitude": 38.045474,
                        "cp": [6418, 5941],
                        "drilldown": "hebei"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6941, 6461], [6926, 6473], [6926, 6473], [6926, 6473], [6926, 6473], [6910, 6494], [6908, 6527], [6931, 6545], [6939, 6540], [6958, 6567], [6938, 6569], [6920, 6563], [6888, 6574], [6862, 6573], [6842, 6603], [6818, 6617], [6809, 6635], [6810, 6652], [6797, 6654], [6794, 6635], [6780, 6637], [6780, 6637], [6769, 6636], [6772, 6616], [6747, 6618], [6771, 6587], [6732, 6591], [6727, 6579], [6703, 6551], [6688, 6541], [6671, 6549], [6643, 6530], [6648, 6507], [6663, 6489], [6663, 6489], [6673, 6486], [6683, 6465], [6670, 6458], [6662, 6437], [6648, 6444], [6641, 6433], [6616, 6430], [6590, 6408], [6585, 6390], [6603, 6378], [6601, 6363], [6611, 6358], [6588, 6351], [6588, 6351], [6599, 6330], [6599, 6330], [6595, 6319], [6595, 6319], [6615, 6305], [6635, 6302], [6635, 6302], [6635, 6302], [6636, 6302], [6635, 6302], [6635, 6302], [6636, 6302], [6639, 6298], [6639, 6298], [6640, 6296], [6640, 6296], [6640, 6294], [6640, 6294], [6640, 6294], [6640, 6294], [6643, 6294], [6643, 6294], [6643, 6293], [6643, 6293], [6643, 6293], [6643, 6293], [6646, 6287], [6646, 6287], [6658, 6288], [6658, 6288], [6663, 6296], [6663, 6296], [6664, 6297], [6664, 6297], [6674, 6308], [6674, 6308], [6683, 6299], [6709, 6303], [6709, 6303], [6728, 6306], [6736, 6289], [6752, 6275], [6770, 6272], [6771, 6292], [6786, 6309], [6801, 6314], [6819, 6307], [6819, 6307], [6823, 6309], [6823, 6309], [6822, 6310], [6822, 6310], [6821, 6311], [6821, 6311], [6839, 6314], [6836, 6274], [6850, 6253], [6855, 6222], [6850, 6206], [6850, 6206], [6859, 6195], [6859, 6195], [6859, 6195], [6859, 6195], [6841, 6181], [6841, 6181], [6836, 6181], [6836, 6181], [6822, 6153], [6828, 6118], [6834, 6108], [6851, 6108], [6854, 6094], [6868, 6096], [6868, 6096], [6868, 6096], [6867, 6096], [6867, 6096], [6868, 6096], [6885, 6101], [6895, 6073], [6910, 6080], [6910, 6080], [6916, 6086], [6916, 6086], [6924, 6066], [6950, 6071], [6965, 6081], [6995, 6084], [6995, 6065], [7022, 6026], [7051, 6030], [7044, 6009], [7028, 5992], [7022, 5970], [7009, 5956], [6988, 5954], [6975, 5924], [6962, 5903], [6944, 5905], [6930, 5899], [6898, 5900], [6885, 5896], [6841, 5898], [6830, 5875], [6777, 5811], [6767, 5822], [6767, 5822], [6767, 5822], [6767, 5822], [6759, 5835], [6751, 5830], [6748, 5809], [6741, 5814], [6741, 5814], [6739, 5800], [6750, 5794], [6741, 5784], [6728, 5789], [6707, 5785], [6694, 5775], [6692, 5755], [6681, 5747], [6673, 5717], [6656, 5697], [6660, 5692], [6645, 5672], [6640, 5654], [6602, 5643], [6581, 5610], [6565, 5579], [6570, 5573], [6570, 5573], [6581, 5538], [6600, 5527], [6600, 5527], [6604, 5501], [6572, 5487], [6551, 5515], [6551, 5515], [6525, 5507], [6513, 5482], [6497, 5478], [6497, 5498], [6436, 5496], [6390, 5525], [6357, 5522], [6357, 5522], [6337, 5529], [6336, 5542], [6322, 5548], [6309, 5538], [6303, 5547], [6292, 5542], [6275, 5549], [6271, 5563], [6242, 5580], [6248, 5596], [6228, 5617], [6232, 5637], [6266, 5648], [6269, 5670], [6283, 5663], [6281, 5687], [6287, 5694], [6280, 5715], [6283, 5732], [6294, 5736], [6307, 5769], [6328, 5796], [6332, 5812], [6348, 5837], [6349, 5860], [6324, 5862], [6334, 5875], [6321, 5887], [6316, 5911], [6302, 5928], [6303, 5943], [6290, 5956], [6293, 5970], [6274, 5971], [6272, 5980], [6246, 5986], [6238, 6020], [6249, 6038], [6245, 6061], [6254, 6081], [6271, 6083], [6274, 6097], [6296, 6108], [6299, 6124], [6284, 6138], [6283, 6155], [6307, 6180], [6335, 6196], [6345, 6177], [6389, 6182], [6397, 6206], [6413, 6215], [6402, 6222], [6413, 6247], [6411, 6261], [6429, 6300], [6400, 6318], [6397, 6369], [6366, 6366], [6357, 6376], [6334, 6380], [6329, 6398], [6309, 6403], [6317, 6408], [6323, 6427], [6334, 6414], [6344, 6424], [6339, 6440], [6339, 6440], [6368, 6447], [6372, 6456], [6411, 6464], [6422, 6482], [6406, 6489], [6382, 6489], [6374, 6513], [6377, 6540], [6363, 6550], [6350, 6575], [6333, 6597], [6339, 6604], [6321, 6634], [6293, 6661], [6311, 6679], [6325, 6683], [6312, 6715], [6315, 6731], [6302, 6736], [6313, 6753], [6343, 6766], [6367, 6760], [6362, 6827], [6388, 6864], [6417, 6870], [6409, 6886], [6417, 6903], [6462, 6905], [6474, 6912], [6487, 6881], [6491, 6835], [6481, 6830], [6487, 6819], [6486, 6790], [6480, 6782], [6523, 6787], [6550, 6777], [6573, 6782], [6562, 6804], [6622, 6837], [6650, 6857], [6669, 6866], [6687, 6825], [6702, 6825], [6706, 6846], [6719, 6846], [6725, 6865], [6739, 6879], [6757, 6878], [6753, 6868], [6775, 6874], [6784, 6863], [6814, 6869], [6841, 6886], [6842, 6904], [6824, 6929], [6845, 6927], [6840, 6969], [6844, 6976], [6844, 6976], [6847, 6979], [6847, 6979], [6848, 6979], [6848, 6979], [6848, 6979], [6848, 6979], [6849, 6980], [6849, 6980], [6850, 6981], [6850, 6981], [6856, 6984], [6856, 6984], [6858, 6984], [6858, 6984], [6859, 6984], [6859, 6984], [6860, 6984], [6860, 6984], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6884, 6995], [6884, 6995], [6886, 6995], [6886, 6995], [6907, 6997], [6907, 6997], [6934, 6997], [6929, 7007], [6929, 7007], [6937, 7024], [6951, 7028], [6951, 7028], [6982, 7024], [6998, 7033], [7016, 7008], [7042, 6981], [7050, 6957], [7036, 6941], [7060, 6926], [7058, 6911], [7068, 6906], [7062, 6894], [7076, 6894], [7079, 6906], [7094, 6899], [7083, 6892], [7097, 6884], [7090, 6870], [7103, 6857], [7095, 6832], [7072, 6842], [7066, 6824], [7082, 6801], [7085, 6787], [7099, 6784], [7093, 6760], [7107, 6750], [7108, 6729], [7138, 6733], [7167, 6733], [7179, 6728], [7197, 6740], [7206, 6723], [7219, 6725], [7261, 6720], [7268, 6728], [7270, 6720], [7249, 6685], [7234, 6668], [7220, 6670], [7219, 6656], [7230, 6654], [7224, 6642], [7224, 6642], [7210, 6642], [7202, 6603], [7213, 6598], [7240, 6572], [7263, 6577], [7260, 6557], [7286, 6542], [7334, 6546], [7340, 6528], [7339, 6507], [7349, 6487], [7347, 6471], [7369, 6468], [7368, 6444], [7376, 6431], [7376, 6431], [7376, 6430], [7376, 6430], [7383, 6431], [7383, 6431], [7389, 6424], [7389, 6424], [7389, 6420], [7389, 6420], [7390, 6417], [7379, 6408], [7334, 6391], [7334, 6372], [7321, 6372], [7302, 6351], [7288, 6298], [7297, 6278], [7275, 6267], [7258, 6236], [7232, 6211], [7233, 6220], [7198, 6209], [7175, 6214], [7156, 6198], [7170, 6170], [7150, 6155], [7128, 6169], [7126, 6179], [7100, 6183], [7080, 6218], [7065, 6226], [7062, 6242], [7062, 6242], [7062, 6242], [7062, 6242], [7061, 6241], [7061, 6241], [7054, 6244], [7054, 6244], [7052, 6247], [7052, 6247], [7029, 6250], [7033, 6280], [7044, 6308], [7031, 6313], [7009, 6311], [7007, 6304], [7007, 6304], [6986, 6314], [6994, 6322], [6990, 6337], [6978, 6343], [6970, 6365], [6970, 6365], [6970, 6368], [6970, 6368], [6965, 6386], [6965, 6386], [6978, 6407], [6983, 6401], [7014, 6401], [7009, 6426], [7009, 6426], [7001, 6428], [7001, 6428], [6989, 6437], [6989, 6437], [6989, 6437], [6989, 6437], [6974, 6459], [6952, 6467], [6941, 6461]]], [[[6855, 6331], [6854, 6349], [6863, 6353], [6858, 6366], [6833, 6378], [6827, 6397], [6832, 6413], [6858, 6418], [6871, 6412], [6890, 6423], [6889, 6423], [6889, 6423], [6890, 6423], [6890, 6423], [6890, 6423], [6909, 6426], [6907, 6404], [6899, 6393], [6899, 6377], [6914, 6371], [6900, 6363], [6910, 6350], [6903, 6339], [6903, 6339], [6905, 6322], [6896, 6315], [6870, 6320], [6870, 6320], [6857, 6335], [6857, 6335], [6855, 6331]]]]
                    },
                    "id": "CN.130000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 140000,
                        "name": "山西",
                        "center": [112.549248, 37.857014],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 3,
                        "fullname": "山西省",
                        "filename": "shanxi",
                        "parent": "中国",
                        "areacode": 140000,
                        "longitude": 112.549248,
                        "latitude": 37.857014,
                        "cp": [6057, 5898],
                        "drilldown": "shanxi"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6275, 5549], [6272, 5526], [6260, 5505], [6268, 5472], [6257, 5463], [6261, 5428], [6251, 5419], [6246, 5381], [6228, 5355], [6196, 5346], [6193, 5333], [6173, 5339], [6160, 5312], [6136, 5319], [6135, 5304], [6120, 5292], [6102, 5295], [6092, 5283], [6066, 5297], [6068, 5288], [6045, 5286], [5959, 5301], [5962, 5287], [5959, 5250], [5928, 5256], [5884, 5235], [5865, 5202], [5823, 5200], [5801, 5191], [5785, 5195], [5779, 5184], [5750, 5173], [5743, 5179], [5734, 5158], [5709, 5161], [5701, 5151], [5667, 5146], [5656, 5154], [5638, 5151], [5625, 5153], [5612, 5170], [5612, 5198], [5617, 5228], [5630, 5246], [5645, 5305], [5655, 5318], [5661, 5337], [5670, 5344], [5687, 5387], [5681, 5403], [5677, 5444], [5670, 5445], [5659, 5511], [5665, 5530], [5662, 5549], [5671, 5585], [5671, 5607], [5652, 5630], [5662, 5644], [5657, 5656], [5659, 5695], [5652, 5710], [5663, 5706], [5681, 5736], [5710, 5770], [5711, 5785], [5699, 5790], [5702, 5805], [5721, 5808], [5731, 5835], [5732, 5857], [5715, 5868], [5725, 5876], [5708, 5891], [5695, 5918], [5682, 5926], [5679, 5945], [5681, 5982], [5692, 5987], [5694, 6006], [5710, 6009], [5726, 6022], [5732, 6039], [5750, 6042], [5759, 6072], [5751, 6080], [5776, 6134], [5771, 6163], [5801, 6184], [5806, 6205], [5822, 6240], [5800, 6255], [5808, 6269], [5839, 6267], [5854, 6286], [5862, 6316], [5870, 6324], [5896, 6319], [5921, 6306], [5932, 6313], [5948, 6311], [5956, 6354], [6014, 6449], [6019, 6463], [6045, 6473], [6077, 6457], [6094, 6441], [6116, 6449], [6125, 6478], [6190, 6498], [6201, 6476], [6246, 6483], [6288, 6523], [6299, 6508], [6316, 6522], [6337, 6526], [6333, 6544], [6339, 6572], [6350, 6575], [6363, 6550], [6377, 6540], [6374, 6513], [6382, 6489], [6406, 6489], [6422, 6482], [6411, 6464], [6372, 6456], [6368, 6447], [6339, 6440], [6339, 6440], [6344, 6424], [6334, 6414], [6323, 6427], [6317, 6408], [6309, 6403], [6329, 6398], [6334, 6380], [6357, 6376], [6366, 6366], [6397, 6369], [6400, 6318], [6429, 6300], [6411, 6261], [6413, 6247], [6402, 6222], [6413, 6215], [6397, 6206], [6389, 6182], [6345, 6177], [6335, 6196], [6307, 6180], [6283, 6155], [6284, 6138], [6299, 6124], [6296, 6108], [6274, 6097], [6271, 6083], [6254, 6081], [6245, 6061], [6249, 6038], [6238, 6020], [6246, 5986], [6272, 5980], [6274, 5971], [6293, 5970], [6290, 5956], [6303, 5943], [6302, 5928], [6316, 5911], [6321, 5887], [6334, 5875], [6324, 5862], [6349, 5860], [6348, 5837], [6332, 5812], [6328, 5796], [6307, 5769], [6294, 5736], [6283, 5732], [6280, 5715], [6287, 5694], [6281, 5687], [6283, 5663], [6269, 5670], [6266, 5648], [6232, 5637], [6228, 5617], [6248, 5596], [6242, 5580], [6271, 5563], [6275, 5549]]]]
                    },
                    "id": "CN.140000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 150000,
                        "name": "内蒙古",
                        "center": [111.670801, 40.818311],
                        "childrenNum": 12,
                        "level": "province",
                        "subFeatureIndex": 4,
                        "fullname": "内蒙古自治区",
                        "filename": "neimenggu",
                        "parent": "中国",
                        "areacode": 150000,
                        "longitude": 111.670801,
                        "latitude": 40.818311,
                        "cp": [5904, 6597],
                        "drilldown": "neimenggu"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[8041, 7259], [8035, 7233], [8037, 7213], [8023, 7169], [8013, 7174], [8013, 7174], [8005, 7177], [7968, 7163], [7955, 7146], [7954, 7130], [7964, 7124], [7935, 7107], [7905, 7106], [7895, 7094], [7887, 7101], [7887, 7101], [7877, 7108], [7858, 7104], [7847, 7116], [7824, 7119], [7809, 7115], [7814, 7102], [7828, 7103], [7818, 7080], [7809, 7076], [7784, 7090], [7785, 7079], [7761, 7084], [7738, 7077], [7733, 7048], [7692, 7014], [7680, 7028], [7642, 7021], [7627, 7011], [7627, 7011], [7624, 6999], [7587, 6965], [7563, 6971], [7538, 6955], [7530, 6956], [7509, 6938], [7502, 6941], [7481, 6925], [7480, 6904], [7466, 6898], [7434, 6862], [7419, 6825], [7408, 6827], [7410, 6843], [7398, 6872], [7369, 6928], [7370, 6947], [7351, 6946], [7315, 6964], [7319, 6980], [7307, 6987], [7292, 6967], [7269, 6956], [7261, 6940], [7276, 6921], [7288, 6914], [7278, 6885], [7281, 6861], [7274, 6839], [7278, 6810], [7298, 6795], [7288, 6789], [7297, 6775], [7292, 6754], [7279, 6749], [7284, 6732], [7268, 6728], [7261, 6720], [7219, 6725], [7206, 6723], [7197, 6740], [7179, 6728], [7167, 6733], [7138, 6733], [7108, 6729], [7107, 6750], [7093, 6760], [7099, 6784], [7085, 6787], [7082, 6801], [7066, 6824], [7072, 6842], [7095, 6832], [7103, 6857], [7090, 6870], [7097, 6884], [7083, 6892], [7094, 6899], [7079, 6906], [7076, 6894], [7062, 6894], [7068, 6906], [7058, 6911], [7060, 6926], [7036, 6941], [7050, 6957], [7042, 6981], [7016, 7008], [6998, 7033], [6982, 7024], [6951, 7028], [6951, 7028], [6937, 7024], [6929, 7007], [6929, 7007], [6934, 6997], [6907, 6997], [6907, 6997], [6886, 6995], [6886, 6995], [6884, 6995], [6884, 6995], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6861, 6986], [6860, 6984], [6860, 6984], [6859, 6984], [6859, 6984], [6858, 6984], [6858, 6984], [6856, 6984], [6856, 6984], [6850, 6981], [6850, 6981], [6849, 6980], [6849, 6980], [6848, 6979], [6848, 6979], [6848, 6979], [6848, 6979], [6847, 6979], [6847, 6979], [6844, 6976], [6844, 6976], [6840, 6969], [6845, 6927], [6824, 6929], [6842, 6904], [6841, 6886], [6814, 6869], [6784, 6863], [6775, 6874], [6753, 6868], [6757, 6878], [6739, 6879], [6725, 6865], [6719, 6846], [6706, 6846], [6702, 6825], [6687, 6825], [6669, 6866], [6650, 6857], [6622, 6837], [6562, 6804], [6573, 6782], [6550, 6777], [6523, 6787], [6480, 6782], [6486, 6790], [6487, 6819], [6481, 6830], [6491, 6835], [6487, 6881], [6474, 6912], [6462, 6905], [6417, 6903], [6409, 6886], [6417, 6870], [6388, 6864], [6362, 6827], [6367, 6760], [6343, 6766], [6313, 6753], [6302, 6736], [6315, 6731], [6312, 6715], [6325, 6683], [6311, 6679], [6293, 6661], [6321, 6634], [6339, 6604], [6333, 6597], [6350, 6575], [6339, 6572], [6333, 6544], [6337, 6526], [6316, 6522], [6299, 6508], [6288, 6523], [6246, 6483], [6201, 6476], [6190, 6498], [6125, 6478], [6116, 6449], [6094, 6441], [6077, 6457], [6045, 6473], [6019, 6463], [6014, 6449], [5956, 6354], [5948, 6311], [5932, 6313], [5921, 6306], [5896, 6319], [5870, 6324], [5862, 6316], [5854, 6286], [5839, 6267], [5808, 6269], [5800, 6255], [5789, 6264], [5805, 6294], [5802, 6307], [5758, 6290], [5729, 6253], [5722, 6235], [5704, 6236], [5691, 6261], [5674, 6261], [5665, 6245], [5639, 6272], [5621, 6280], [5633, 6239], [5586, 6219], [5530, 6171], [5533, 6160], [5522, 6141], [5508, 6130], [5501, 6137], [5481, 6111], [5469, 6107], [5473, 6089], [5457, 6089], [5438, 6065], [5414, 6045], [5391, 5993], [5396, 5981], [5415, 5965], [5404, 5937], [5389, 5926], [5378, 5952], [5364, 5957], [5369, 5943], [5363, 5930], [5363, 5895], [5358, 5872], [5327, 5866], [5312, 5875], [5295, 5867], [5270, 5865], [5254, 5870], [5238, 5862], [5218, 5869], [5211, 5901], [5150, 5922], [5122, 5942], [5109, 5941], [5113, 5953], [5093, 5976], [5068, 5993], [5036, 5986], [4991, 6001], [4951, 6025], [4940, 6037], [4962, 6053], [4972, 6071], [4976, 6102], [4986, 6129], [5033, 6179], [5037, 6206], [5017, 6219], [5007, 6245], [5010, 6269], [5000, 6284], [4988, 6279], [4973, 6284], [4954, 6260], [4936, 6266], [4914, 6262], [4912, 6233], [4887, 6236], [4877, 6220], [4869, 6193], [4852, 6180], [4858, 6172], [4837, 6153], [4838, 6139], [4827, 6118], [4831, 6107], [4818, 6054], [4826, 6038], [4808, 6013], [4807, 5989], [4818, 5969], [4809, 5955], [4809, 5937], [4800, 5923], [4775, 5919], [4769, 5901], [4717, 5904], [4678, 5890], [4661, 5879], [4632, 5877], [4619, 5871], [4548, 5869], [4546, 5859], [4523, 5851], [4503, 5848], [4462, 5887], [4415, 5941], [4365, 5963], [4361, 6004], [4363, 6016], [4394, 6030], [4391, 6059], [4376, 6089], [4461, 6140], [4499, 6197], [4522, 6206], [4532, 6239], [4527, 6255], [4505, 6291], [4515, 6319], [4493, 6329], [4470, 6332], [4424, 6317], [4378, 6307], [4312, 6257], [4239, 6279], [4214, 6301], [4181, 6288], [4097, 6271], [4113, 6248], [4138, 6221], [4112, 6203], [4080, 6171], [4062, 6179], [4047, 6172], [4041, 6186], [3996, 6211], [4002, 6221], [3985, 6225], [3979, 6245], [3986, 6263], [3965, 6254], [3937, 6249], [3937, 6263], [3914, 6270], [3921, 6288], [3919, 6311], [3923, 6359], [3882, 6358], [3860, 6363], [3862, 6382], [3831, 6391], [3831, 6414], [3820, 6434], [3799, 6440], [3784, 6454], [3760, 6463], [3746, 6482], [3720, 6491], [3686, 6491], [3770, 6528], [3786, 6558], [3818, 6574], [3823, 6637], [3838, 6654], [3839, 6677], [3819, 6717], [3811, 6725], [3742, 6737], [3721, 6719], [3651, 6728], [3648, 6702], [3634, 6686], [3623, 6691], [3615, 6713], [3578, 6698], [3578, 6675], [3560, 6697], [3558, 6716], [3539, 6712], [3548, 6695], [3495, 6674], [3501, 6757], [3486, 6763], [3440, 6806], [3387, 6893], [3385, 6902], [3431, 6941], [3358, 7168], [3340, 7225], [3517, 7173], [3579, 7163], [3747, 7130], [3831, 7142], [3885, 7134], [3895, 7147], [3984, 7136], [4056, 7111], [4115, 7089], [4154, 7081], [4197, 7012], [4263, 6986], [4279, 6989], [4310, 6984], [4363, 6951], [4431, 6911], [4511, 6887], [4548, 6885], [4630, 6897], [4626, 6846], [4655, 6840], [4697, 6840], [4712, 6822], [4754, 6860], [4764, 6859], [4848, 6903], [4897, 6920], [5008, 6966], [5038, 6976], [5086, 6980], [5125, 6989], [5132, 7001], [5161, 7011], [5180, 6999], [5245, 6994], [5260, 7001], [5299, 7006], [5309, 7000], [5351, 7000], [5406, 6987], [5439, 7001], [5486, 6994], [5531, 7001], [5557, 7021], [5597, 7039], [5633, 7040], [5639, 7047], [5692, 7072], [5698, 7086], [5727, 7108], [5747, 7145], [5753, 7147], [5798, 7202], [5827, 7218], [5858, 7227], [5876, 7241], [5895, 7239], [5936, 7283], [5964, 7288], [5966, 7319], [5951, 7348], [5934, 7365], [5914, 7378], [5897, 7405], [5888, 7435], [5872, 7451], [5884, 7483], [5900, 7504], [5899, 7522], [5910, 7554], [5935, 7600], [5957, 7619], [5977, 7629], [5997, 7625], [6053, 7624], [6071, 7606], [6081, 7589], [6125, 7566], [6140, 7566], [6171, 7556], [6239, 7550], [6261, 7542], [6309, 7584], [6337, 7588], [6359, 7614], [6386, 7634], [6416, 7675], [6421, 7701], [6455, 7713], [6495, 7698], [6526, 7703], [6563, 7703], [6621, 7720], [6661, 7763], [6678, 7776], [6702, 7777], [6721, 7799], [6722, 7815], [6714, 7824], [6718, 7846], [6742, 7888], [6747, 7889], [6771, 7928], [6799, 7937], [6812, 7951], [6859, 7946], [6906, 7947], [6909, 7973], [6918, 7990], [6913, 8003], [6926, 8008], [6948, 8007], [6963, 7988], [6991, 7997], [6998, 8011], [7021, 8018], [7034, 8030], [7046, 8031], [7066, 8046], [7089, 8038], [7113, 8036], [7122, 8043], [7148, 8035], [7157, 8057], [7169, 8058], [7169, 8047], [7186, 8051], [7206, 8026], [7230, 8028], [7249, 8017], [7259, 8027], [7297, 8025], [7301, 8015], [7319, 8026], [7324, 8036], [7341, 8037], [7344, 8048], [7342, 8096], [7330, 8099], [7318, 8122], [7319, 8133], [7303, 8168], [7277, 8180], [7275, 8194], [7262, 8200], [7239, 8225], [7240, 8236], [7203, 8251], [7199, 8282], [7137, 8307], [7101, 8362], [7076, 8367], [7055, 8364], [7043, 8373], [6998, 8364], [6973, 8364], [6920, 8298], [6902, 8268], [6851, 8313], [6815, 8330], [6779, 8329], [6742, 8315], [6710, 8324], [6684, 8307], [6656, 8275], [6594, 8334], [6585, 8393], [6634, 8420], [6629, 8485], [6634, 8496], [6675, 8564], [6670, 8577], [6779, 8828], [6782, 8828], [6838, 8790], [6873, 8776], [6908, 8776], [6963, 8748], [6972, 8767], [6991, 8774], [7008, 8774], [7014, 8787], [7028, 8792], [7031, 8805], [7058, 8819], [7058, 8827], [7075, 8834], [7073, 8840], [7088, 8857], [7115, 8862], [7146, 8874], [7173, 8874], [7185, 8885], [7189, 8900], [7198, 8898], [7216, 8929], [7209, 8936], [7214, 8972], [7198, 8967], [7176, 8978], [7196, 8994], [7200, 9035], [7213, 9043], [7216, 9056], [7227, 9060], [7235, 9078], [7232, 9108], [7254, 9143], [7269, 9154], [7278, 9184], [7273, 9196], [7302, 9238], [7310, 9262], [7307, 9274], [7318, 9287], [7315, 9296], [7322, 9320], [7336, 9321], [7366, 9352], [7372, 9363], [7385, 9370], [7384, 9378], [7413, 9390], [7422, 9413], [7416, 9419], [7426, 9430], [7431, 9452], [7424, 9464], [7425, 9478], [7403, 9495], [7402, 9505], [7412, 9523], [7411, 9546], [7417, 9550], [7374, 9579], [7364, 9571], [7345, 9572], [7331, 9560], [7307, 9564], [7304, 9577], [7309, 9593], [7303, 9612], [7332, 9630], [7352, 9648], [7368, 9677], [7383, 9695], [7397, 9703], [7411, 9730], [7428, 9743], [7434, 9756], [7474, 9753], [7499, 9758], [7508, 9768], [7533, 9771], [7552, 9752], [7563, 9747], [7561, 9728], [7576, 9722], [7587, 9700], [7583, 9688], [7572, 9682], [7564, 9659], [7556, 9653], [7554, 9635], [7536, 9620], [7520, 9596], [7490, 9572], [7514, 9566], [7530, 9547], [7547, 9536], [7567, 9534], [7580, 9501], [7601, 9493], [7618, 9498], [7640, 9533], [7651, 9557], [7658, 9545], [7675, 9548], [7681, 9532], [7705, 9514], [7705, 9502], [7723, 9495], [7751, 9496], [7754, 9473], [7731, 9461], [7743, 9418], [7750, 9420], [7748, 9396], [7760, 9368], [7757, 9359], [7776, 9323], [7778, 9289], [7787, 9273], [7797, 9266], [7800, 9252], [7814, 9250], [7853, 9235], [7881, 9245], [7930, 9166], [7948, 9125], [7993, 9063], [7979, 9048], [7983, 9028], [7970, 9011], [7949, 9032], [7947, 9003], [7964, 8984], [7966, 8968], [7979, 8964], [7987, 8973], [7997, 8968], [8003, 8979], [8017, 8974], [8032, 8978], [8041, 8965], [8046, 8986], [8044, 9013], [8056, 9021], [8066, 9024], [8068, 9010], [8081, 8998], [8089, 8982], [8082, 8968], [8071, 8963], [8089, 8941], [8102, 8931], [8098, 8922], [8102, 8889], [8114, 8877], [8117, 8862], [8129, 8886], [8154, 8884], [8147, 8892], [8154, 8901], [8175, 8875], [8188, 8885], [8196, 8878], [8198, 8844], [8184, 8844], [8202, 8825], [8203, 8798], [8209, 8791], [8212, 8755], [8207, 8721], [8191, 8704], [8155, 8716], [8139, 8696], [8141, 8673], [8126, 8647], [8125, 8627], [8119, 8610], [8110, 8563], [8100, 8552], [8108, 8530], [8100, 8524], [8103, 8507], [8115, 8489], [8115, 8476], [8098, 8435], [8098, 8456], [8089, 8456], [8086, 8477], [8070, 8497], [8067, 8537], [8057, 8544], [8057, 8544], [8028, 8517], [7996, 8475], [7975, 8453], [7943, 8406], [7904, 8387], [7893, 8358], [7883, 8343], [7832, 8313], [7817, 8296], [7789, 8278], [7782, 8264], [7777, 8240], [7762, 8227], [7788, 8183], [7810, 8165], [7839, 8155], [7828, 8143], [7832, 8127], [7849, 8133], [7853, 8095], [7875, 8074], [7898, 8081], [7906, 8109], [7921, 8113], [7933, 8108], [7936, 8132], [7957, 8136], [7951, 8111], [7965, 8107], [7967, 8123], [7976, 8113], [7978, 8083], [7974, 8073], [7934, 8068], [7918, 8063], [7911, 8044], [7903, 8050], [7880, 8049], [7873, 8038], [7876, 8004], [7908, 7959], [7896, 7939], [7898, 7929], [7887, 7921], [7844, 7912], [7852, 7872], [7840, 7852], [7848, 7836], [7840, 7820], [7828, 7818], [7821, 7836], [7806, 7847], [7798, 7838], [7795, 7856], [7786, 7870], [7771, 7869], [7774, 7854], [7755, 7838], [7744, 7853], [7725, 7858], [7715, 7877], [7680, 7891], [7667, 7884], [7675, 7875], [7678, 7854], [7668, 7834], [7649, 7822], [7662, 7810], [7679, 7807], [7688, 7816], [7702, 7815], [7713, 7793], [7707, 7786], [7718, 7761], [7743, 7750], [7742, 7714], [7758, 7710], [7757, 7693], [7743, 7686], [7737, 7676], [7740, 7658], [7733, 7642], [7735, 7619], [7730, 7619], [7743, 7586], [7752, 7575], [7742, 7561], [7748, 7538], [7760, 7534], [7766, 7514], [7776, 7514], [7780, 7474], [7777, 7460], [7785, 7455], [7814, 7458], [7847, 7471], [7861, 7493], [7877, 7500], [7906, 7525], [7923, 7530], [7925, 7495], [7938, 7491], [7962, 7452], [7974, 7448], [7964, 7428], [7966, 7415], [7979, 7404], [8005, 7336], [8004, 7311], [7991, 7307], [7991, 7307], [7968, 7299], [7971, 7285], [7983, 7280], [7990, 7266], [8001, 7275], [8024, 7257], [8041, 7259]]], [[[7993, 9063], [7948, 9125], [7930, 9166], [7881, 9245], [7913, 9255], [7919, 9276], [7941, 9270], [7956, 9253], [7980, 9260], [7989, 9267], [8007, 9268], [8013, 9258], [8036, 9250], [8039, 9272], [8047, 9280], [8064, 9276], [8071, 9267], [8082, 9270], [8095, 9286], [8109, 9284], [8120, 9302], [8117, 9316], [8136, 9325], [8142, 9359], [8148, 9354], [8184, 9353], [8222, 9312], [8222, 9312], [8228, 9302], [8228, 9302], [8228, 9301], [8228, 9301], [8229, 9301], [8229, 9301], [8233, 9295], [8233, 9295], [8236, 9291], [8236, 9291], [8241, 9285], [8241, 9285], [8242, 9284], [8242, 9284], [8255, 9267], [8255, 9267], [8258, 9254], [8272, 9253], [8279, 9238], [8311, 9210], [8308, 9201], [8315, 9189], [8288, 9146], [8267, 9129], [8279, 9119], [8274, 9111], [8283, 9082], [8269, 9071], [8252, 9049], [8245, 9051], [8236, 9014], [8228, 9009], [8226, 8988], [8208, 8973], [8197, 8956], [8204, 8938], [8195, 8919], [8198, 8890], [8188, 8885], [8175, 8875], [8154, 8901], [8147, 8892], [8154, 8884], [8129, 8886], [8117, 8862], [8114, 8877], [8102, 8889], [8098, 8922], [8102, 8931], [8089, 8941], [8071, 8963], [8082, 8968], [8089, 8982], [8081, 8998], [8068, 9010], [8066, 9024], [8056, 9021], [8054, 9060], [8034, 9057], [8028, 9062], [7993, 9063]]]]
                    },
                    "id": "CN.150000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 210000,
                        "name": "辽宁",
                        "center": [123.429096, 41.796767],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 5,
                        "fullname": "辽宁省",
                        "filename": "liaoning",
                        "parent": "中国",
                        "areacode": 210000,
                        "longitude": 123.429096,
                        "latitude": 41.796767,
                        "cp": [8015, 6878],
                        "drilldown": "liaoning"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7268, 6728], [7284, 6732], [7279, 6749], [7292, 6754], [7297, 6775], [7288, 6789], [7298, 6795], [7278, 6810], [7274, 6839], [7281, 6861], [7278, 6885], [7288, 6914], [7276, 6921], [7261, 6940], [7269, 6956], [7292, 6967], [7307, 6987], [7319, 6980], [7315, 6964], [7351, 6946], [7370, 6947], [7369, 6928], [7398, 6872], [7410, 6843], [7408, 6827], [7419, 6825], [7434, 6862], [7466, 6898], [7480, 6904], [7481, 6925], [7502, 6941], [7509, 6938], [7530, 6956], [7538, 6955], [7563, 6971], [7587, 6965], [7624, 6999], [7627, 7011], [7627, 7011], [7642, 7021], [7680, 7028], [7692, 7014], [7733, 7048], [7738, 7077], [7761, 7084], [7785, 7079], [7784, 7090], [7809, 7076], [7818, 7080], [7828, 7103], [7814, 7102], [7809, 7115], [7824, 7119], [7847, 7116], [7858, 7104], [7877, 7108], [7887, 7101], [7887, 7101], [7895, 7094], [7905, 7106], [7935, 7107], [7964, 7124], [7954, 7130], [7955, 7146], [7968, 7163], [8005, 7177], [8013, 7174], [8013, 7174], [8023, 7169], [8037, 7213], [8035, 7233], [8041, 7259], [8041, 7271], [8055, 7289], [8069, 7281], [8066, 7272], [8075, 7259], [8100, 7241], [8112, 7245], [8115, 7234], [8135, 7234], [8135, 7234], [8145, 7232], [8146, 7216], [8173, 7196], [8158, 7176], [8174, 7172], [8176, 7161], [8166, 7149], [8178, 7149], [8182, 7136], [8192, 7148], [8192, 7148], [8196, 7147], [8216, 7174], [8220, 7193], [8236, 7210], [8255, 7215], [8247, 7190], [8253, 7180], [8254, 7140], [8261, 7132], [8275, 7137], [8279, 7123], [8279, 7123], [8275, 7117], [8289, 7092], [8299, 7095], [8296, 7065], [8318, 7049], [8319, 7020], [8341, 7018], [8345, 6983], [8352, 6992], [8378, 6983], [8358, 6950], [8345, 6938], [8348, 6917], [8348, 6917], [8348, 6915], [8348, 6915], [8347, 6910], [8347, 6910], [8347, 6910], [8353, 6895], [8353, 6895], [8354, 6894], [8354, 6894], [8356, 6870], [8378, 6872], [8380, 6854], [8397, 6826], [8401, 6808], [8418, 6796], [8421, 6777], [8441, 6771], [8438, 6758], [8448, 6756], [8435, 6738], [8439, 6728], [8431, 6708], [8416, 6697], [8438, 6683], [8412, 6649], [8403, 6648], [8391, 6625], [8365, 6628], [8320, 6596], [8315, 6581], [8299, 6581], [8291, 6568], [8273, 6555], [8269, 6541], [8252, 6533], [8212, 6488], [8211, 6487], [8204, 6473], [8211, 6466], [8188, 6443], [8177, 6422], [8174, 6399], [8165, 6417], [8147, 6410], [8115, 6415], [8091, 6408], [8085, 6414], [8076, 6400], [8062, 6402], [8037, 6385], [8035, 6395], [8015, 6391], [8012, 6376], [7969, 6365], [7962, 6350], [7941, 6352], [7933, 6341], [7893, 6316], [7877, 6301], [7863, 6302], [7839, 6279], [7833, 6266], [7811, 6252], [7821, 6240], [7800, 6225], [7785, 6208], [7767, 6209], [7778, 6193], [7768, 6186], [7753, 6205], [7732, 6201], [7730, 6186], [7742, 6180], [7740, 6169], [7714, 6168], [7704, 6154], [7677, 6154], [7659, 6145], [7648, 6129], [7636, 6129], [7633, 6184], [7647, 6180], [7672, 6191], [7676, 6210], [7702, 6205], [7733, 6226], [7718, 6237], [7715, 6263], [7728, 6263], [7737, 6285], [7719, 6274], [7693, 6266], [7684, 6280], [7650, 6294], [7659, 6308], [7645, 6317], [7657, 6337], [7685, 6343], [7693, 6363], [7685, 6372], [7697, 6397], [7714, 6406], [7726, 6419], [7738, 6419], [7748, 6444], [7759, 6448], [7780, 6472], [7767, 6493], [7782, 6495], [7784, 6513], [7812, 6529], [7819, 6562], [7797, 6583], [7799, 6597], [7785, 6591], [7763, 6597], [7759, 6625], [7744, 6630], [7736, 6647], [7713, 6630], [7685, 6634], [7680, 6641], [7650, 6644], [7632, 6632], [7612, 6635], [7606, 6618], [7589, 6604], [7597, 6596], [7561, 6586], [7560, 6567], [7544, 6554], [7535, 6537], [7524, 6533], [7522, 6509], [7511, 6501], [7510, 6485], [7500, 6466], [7483, 6465], [7465, 6453], [7408, 6431], [7401, 6417], [7390, 6417], [7389, 6420], [7389, 6420], [7389, 6424], [7389, 6424], [7383, 6431], [7383, 6431], [7376, 6430], [7376, 6430], [7376, 6431], [7376, 6431], [7368, 6444], [7369, 6468], [7347, 6471], [7349, 6487], [7339, 6507], [7340, 6528], [7334, 6546], [7286, 6542], [7260, 6557], [7263, 6577], [7240, 6572], [7213, 6598], [7202, 6603], [7210, 6642], [7224, 6642], [7224, 6642], [7230, 6654], [7219, 6656], [7220, 6670], [7234, 6668], [7249, 6685], [7270, 6720], [7268, 6728]]], [[[7963, 6331], [7964, 6343], [7975, 6337], [7963, 6331]]]]
                    },
                    "id": "CN.210000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 220000,
                        "name": "吉林",
                        "center": [125.3245, 43.886841],
                        "childrenNum": 9,
                        "level": "province",
                        "subFeatureIndex": 6,
                        "fullname": "吉林省",
                        "filename": "jilin",
                        "parent": "中国",
                        "areacode": 220000,
                        "longitude": 125.3245,
                        "latitude": 43.886841,
                        "cp": [8318, 7403],
                        "drilldown": "jilin"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[8438, 6683], [8416, 6697], [8431, 6708], [8439, 6728], [8435, 6738], [8448, 6756], [8438, 6758], [8441, 6771], [8421, 6777], [8418, 6796], [8401, 6808], [8397, 6826], [8380, 6854], [8378, 6872], [8356, 6870], [8354, 6894], [8354, 6894], [8353, 6895], [8353, 6895], [8347, 6910], [8347, 6910], [8347, 6910], [8348, 6915], [8348, 6915], [8348, 6917], [8348, 6917], [8345, 6938], [8358, 6950], [8378, 6983], [8352, 6992], [8345, 6983], [8341, 7018], [8319, 7020], [8318, 7049], [8296, 7065], [8299, 7095], [8289, 7092], [8275, 7117], [8279, 7123], [8279, 7123], [8275, 7137], [8261, 7132], [8254, 7140], [8253, 7180], [8247, 7190], [8255, 7215], [8236, 7210], [8220, 7193], [8216, 7174], [8196, 7147], [8192, 7148], [8192, 7148], [8182, 7136], [8178, 7149], [8166, 7149], [8176, 7161], [8174, 7172], [8158, 7176], [8173, 7196], [8146, 7216], [8145, 7232], [8135, 7234], [8135, 7234], [8115, 7234], [8112, 7245], [8100, 7241], [8075, 7259], [8066, 7272], [8069, 7281], [8055, 7289], [8041, 7271], [8041, 7259], [8024, 7257], [8001, 7275], [7990, 7266], [7983, 7280], [7971, 7285], [7968, 7299], [7991, 7307], [7991, 7307], [8004, 7311], [8005, 7336], [7979, 7404], [7966, 7415], [7964, 7428], [7974, 7448], [7962, 7452], [7938, 7491], [7925, 7495], [7923, 7530], [7906, 7525], [7877, 7500], [7861, 7493], [7847, 7471], [7814, 7458], [7785, 7455], [7777, 7460], [7780, 7474], [7776, 7514], [7766, 7514], [7760, 7534], [7748, 7538], [7742, 7561], [7752, 7575], [7743, 7586], [7730, 7619], [7735, 7619], [7733, 7642], [7740, 7658], [7737, 7676], [7743, 7686], [7757, 7693], [7758, 7710], [7742, 7714], [7743, 7750], [7718, 7761], [7707, 7786], [7713, 7793], [7702, 7815], [7688, 7816], [7679, 7807], [7662, 7810], [7649, 7822], [7668, 7834], [7678, 7854], [7675, 7875], [7667, 7884], [7680, 7891], [7715, 7877], [7725, 7858], [7744, 7853], [7755, 7838], [7774, 7854], [7771, 7869], [7786, 7870], [7795, 7856], [7798, 7838], [7806, 7847], [7821, 7836], [7828, 7818], [7840, 7820], [7848, 7836], [7840, 7852], [7852, 7872], [7844, 7912], [7887, 7921], [7898, 7929], [7896, 7939], [7908, 7959], [7919, 7966], [7932, 7962], [7932, 7962], [7941, 7955], [7963, 7965], [7975, 7957], [7982, 7964], [8011, 7969], [8030, 7980], [8046, 7962], [8050, 7931], [8059, 7911], [8048, 7898], [8054, 7883], [8065, 7878], [8067, 7857], [8058, 7852], [8082, 7830], [8081, 7818], [8107, 7806], [8110, 7795], [8121, 7798], [8131, 7772], [8145, 7777], [8156, 7767], [8170, 7774], [8215, 7778], [8220, 7803], [8227, 7792], [8238, 7793], [8248, 7766], [8278, 7776], [8296, 7772], [8304, 7778], [8308, 7795], [8321, 7792], [8342, 7807], [8353, 7806], [8359, 7783], [8357, 7765], [8369, 7752], [8398, 7731], [8443, 7718], [8469, 7732], [8486, 7747], [8510, 7753], [8558, 7731], [8581, 7729], [8583, 7715], [8606, 7685], [8596, 7673], [8591, 7654], [8602, 7629], [8607, 7592], [8614, 7604], [8629, 7613], [8666, 7613], [8696, 7601], [8693, 7588], [8681, 7578], [8690, 7567], [8687, 7558], [8687, 7558], [8713, 7530], [8709, 7517], [8726, 7504], [8733, 7512], [8736, 7488], [8760, 7481], [8793, 7496], [8798, 7502], [8797, 7540], [8787, 7554], [8811, 7560], [8813, 7576], [8839, 7599], [8857, 7581], [8861, 7567], [8860, 7524], [8885, 7489], [8888, 7475], [8900, 7463], [8899, 7452], [8914, 7454], [8922, 7445], [8915, 7435], [8949, 7371], [8962, 7375], [8974, 7369], [9010, 7390], [9003, 7435], [9036, 7447], [9045, 7461], [9094, 7466], [9099, 7489], [9113, 7500], [9113, 7500], [9115, 7499], [9115, 7499], [9132, 7504], [9140, 7492], [9144, 7465], [9154, 7462], [9154, 7462], [9170, 7490], [9182, 7493], [9196, 7519], [9196, 7495], [9196, 7495], [9205, 7485], [9208, 7455], [9216, 7446], [9217, 7424], [9230, 7426], [9292, 7396], [9297, 7384], [9309, 7381], [9328, 7401], [9349, 7383], [9349, 7383], [9376, 7396], [9377, 7404], [9382, 7378], [9375, 7372], [9375, 7346], [9367, 7339], [9371, 7317], [9365, 7298], [9354, 7285], [9364, 7273], [9359, 7259], [9344, 7261], [9348, 7247], [9331, 7247], [9321, 7240], [9304, 7245], [9302, 7236], [9281, 7235], [9238, 7202], [9250, 7193], [9272, 7192], [9282, 7176], [9272, 7163], [9271, 7149], [9254, 7178], [9238, 7171], [9209, 7201], [9209, 7241], [9180, 7243], [9186, 7256], [9159, 7255], [9158, 7254], [9149, 7261], [9142, 7258], [9136, 7249], [9136, 7248], [9134, 7228], [9134, 7225], [9132, 7221], [9131, 7220], [9125, 7187], [9125, 7186], [9128, 7183], [9131, 7180], [9124, 7154], [9128, 7128], [9121, 7117], [9105, 7117], [9103, 7114], [9095, 7098], [9076, 7116], [9057, 7116], [9040, 7095], [9039, 7092], [9045, 7087], [9033, 7068], [9040, 7056], [9024, 7038], [8996, 7022], [8993, 7005], [8958, 7010], [8952, 7002], [8935, 7003], [8929, 6995], [8910, 6999], [8843, 6993], [8834, 6987], [8848, 6976], [8852, 6939], [8864, 6921], [8885, 6909], [8893, 6894], [8881, 6871], [8876, 6849], [8861, 6837], [8827, 6853], [8813, 6846], [8775, 6841], [8758, 6855], [8733, 6849], [8712, 6853], [8709, 6859], [8679, 6863], [8689, 6878], [8663, 6893], [8663, 6911], [8644, 6916], [8641, 6925], [8620, 6908], [8619, 6896], [8605, 6908], [8600, 6889], [8586, 6887], [8580, 6875], [8571, 6822], [8579, 6813], [8561, 6808], [8543, 6778], [8538, 6763], [8516, 6743], [8496, 6702], [8484, 6690], [8468, 6695], [8458, 6685], [8452, 6691], [8438, 6683]]]]
                    },
                    "id": "CN.220000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 230000,
                        "name": "黑龙江",
                        "center": [126.642464, 45.756967],
                        "childrenNum": 13,
                        "level": "province",
                        "subFeatureIndex": 7,
                        "fullname": "黑龙江省",
                        "filename": "heilongjiang",
                        "parent": "中国",
                        "areacode": 230000,
                        "longitude": 126.642464,
                        "latitude": 45.756967,
                        "cp": [8513, 7878],
                        "drilldown": "heilongjiang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7932, 7962], [7932, 7962], [7919, 7966], [7908, 7959], [7876, 8004], [7873, 8038], [7880, 8049], [7903, 8050], [7911, 8044], [7918, 8063], [7934, 8068], [7974, 8073], [7978, 8083], [7976, 8113], [7967, 8123], [7965, 8107], [7951, 8111], [7957, 8136], [7936, 8132], [7933, 8108], [7921, 8113], [7906, 8109], [7898, 8081], [7875, 8074], [7853, 8095], [7849, 8133], [7832, 8127], [7828, 8143], [7839, 8155], [7810, 8165], [7788, 8183], [7762, 8227], [7777, 8240], [7782, 8264], [7789, 8278], [7817, 8296], [7832, 8313], [7883, 8343], [7893, 8358], [7904, 8387], [7943, 8406], [7975, 8453], [7996, 8475], [8028, 8517], [8057, 8544], [8057, 8544], [8067, 8537], [8070, 8497], [8086, 8477], [8089, 8456], [8098, 8456], [8098, 8435], [8115, 8476], [8115, 8489], [8103, 8507], [8100, 8524], [8108, 8530], [8100, 8552], [8110, 8563], [8119, 8610], [8125, 8627], [8126, 8647], [8141, 8673], [8139, 8696], [8155, 8716], [8191, 8704], [8207, 8721], [8212, 8755], [8209, 8791], [8203, 8798], [8202, 8825], [8184, 8844], [8198, 8844], [8196, 8878], [8188, 8885], [8198, 8890], [8195, 8919], [8204, 8938], [8197, 8956], [8208, 8973], [8226, 8988], [8228, 9009], [8236, 9014], [8245, 9051], [8252, 9049], [8269, 9071], [8283, 9082], [8274, 9111], [8279, 9119], [8267, 9129], [8288, 9146], [8315, 9189], [8308, 9201], [8311, 9210], [8279, 9238], [8272, 9253], [8258, 9254], [8255, 9267], [8255, 9267], [8242, 9284], [8242, 9284], [8241, 9285], [8241, 9285], [8236, 9291], [8236, 9291], [8233, 9295], [8233, 9295], [8229, 9301], [8229, 9301], [8228, 9301], [8228, 9301], [8228, 9302], [8228, 9302], [8222, 9312], [8222, 9312], [8184, 9353], [8148, 9354], [8142, 9359], [8136, 9325], [8117, 9316], [8120, 9302], [8109, 9284], [8095, 9286], [8082, 9270], [8071, 9267], [8064, 9276], [8047, 9280], [8039, 9272], [8036, 9250], [8013, 9258], [8007, 9268], [7989, 9267], [7980, 9260], [7956, 9253], [7941, 9270], [7919, 9276], [7913, 9255], [7881, 9245], [7853, 9235], [7814, 9250], [7800, 9252], [7797, 9266], [7787, 9273], [7778, 9289], [7776, 9323], [7757, 9359], [7760, 9368], [7748, 9396], [7750, 9420], [7743, 9418], [7731, 9461], [7754, 9473], [7751, 9496], [7723, 9495], [7705, 9502], [7705, 9514], [7681, 9532], [7675, 9548], [7658, 9545], [7651, 9557], [7640, 9533], [7618, 9498], [7601, 9493], [7580, 9501], [7567, 9534], [7547, 9536], [7530, 9547], [7514, 9566], [7490, 9572], [7520, 9596], [7536, 9620], [7554, 9635], [7556, 9653], [7564, 9659], [7572, 9682], [7583, 9688], [7587, 9700], [7576, 9722], [7561, 9728], [7563, 9747], [7552, 9752], [7533, 9771], [7548, 9776], [7564, 9788], [7573, 9787], [7592, 9798], [7630, 9800], [7637, 9812], [7648, 9811], [7667, 9824], [7681, 9808], [7709, 9815], [7755, 9817], [7780, 9830], [7793, 9828], [7814, 9847], [7844, 9842], [7853, 9835], [7853, 9848], [7863, 9834], [7865, 9846], [7878, 9843], [7883, 9834], [7910, 9833], [7943, 9812], [7955, 9798], [7972, 9807], [7987, 9795], [7996, 9776], [8007, 9768], [8027, 9763], [8047, 9766], [8056, 9750], [8072, 9751], [8079, 9739], [8080, 9757], [8093, 9765], [8129, 9769], [8150, 9756], [8181, 9745], [8186, 9733], [8199, 9743], [8212, 9724], [8221, 9721], [8221, 9708], [8210, 9698], [8214, 9684], [8228, 9695], [8242, 9688], [8265, 9661], [8276, 9672], [8286, 9662], [8275, 9656], [8279, 9639], [8268, 9639], [8265, 9626], [8276, 9613], [8281, 9621], [8307, 9602], [8307, 9586], [8316, 9589], [8332, 9567], [8330, 9546], [8347, 9544], [8327, 9522], [8335, 9515], [8360, 9509], [8372, 9499], [8366, 9476], [8355, 9473], [8359, 9452], [8367, 9446], [8389, 9409], [8408, 9393], [8411, 9375], [8405, 9358], [8429, 9349], [8422, 9325], [8443, 9316], [8448, 9304], [8433, 9299], [8435, 9276], [8448, 9277], [8441, 9293], [8456, 9296], [8457, 9287], [8446, 9262], [8453, 9226], [8492, 9189], [8510, 9157], [8521, 9151], [8522, 9127], [8537, 9107], [8527, 9076], [8539, 9070], [8536, 9044], [8543, 9033], [8583, 9022], [8582, 8995], [8570, 8973], [8570, 8957], [8579, 8945], [8580, 8914], [8586, 8906], [8602, 8904], [8607, 8884], [8632, 8859], [8646, 8856], [8663, 8861], [8676, 8853], [8695, 8850], [8711, 8859], [8721, 8854], [8728, 8866], [8752, 8872], [8783, 8865], [8787, 8873], [8799, 8865], [8791, 8851], [8798, 8843], [8810, 8849], [8835, 8842], [8844, 8823], [8859, 8818], [8870, 8830], [8889, 8822], [8898, 8825], [8898, 8842], [8908, 8845], [8925, 8835], [8930, 8810], [8938, 8806], [8956, 8812], [8965, 8803], [8965, 8790], [8981, 8785], [8986, 8768], [8994, 8767], [8999, 8751], [9014, 8747], [9021, 8737], [9049, 8720], [9055, 8712], [9092, 8725], [9098, 8716], [9128, 8723], [9130, 8715], [9121, 8697], [9111, 8652], [9123, 8649], [9128, 8624], [9152, 8630], [9150, 8609], [9171, 8578], [9160, 8560], [9161, 8549], [9147, 8532], [9153, 8512], [9189, 8486], [9203, 8462], [9207, 8438], [9218, 8430], [9233, 8430], [9259, 8445], [9289, 8451], [9304, 8450], [9314, 8432], [9331, 8446], [9354, 8440], [9378, 8441], [9382, 8452], [9397, 8452], [9428, 8459], [9443, 8473], [9461, 8465], [9478, 8466], [9481, 8484], [9493, 8509], [9487, 8523], [9497, 8529], [9514, 8525], [9523, 8542], [9540, 8553], [9546, 8571], [9564, 8582], [9590, 8576], [9607, 8584], [9629, 8585], [9637, 8605], [9653, 8605], [9659, 8623], [9712, 8651], [9722, 8652], [9733, 8665], [9758, 8667], [9782, 8681], [9815, 8682], [9837, 8677], [9852, 8698], [9881, 8699], [9880, 8688], [9845, 8667], [9817, 8644], [9819, 8622], [9814, 8603], [9803, 8585], [9816, 8555], [9825, 8554], [9831, 8534], [9849, 8522], [9852, 8511], [9838, 8487], [9839, 8480], [9824, 8457], [9824, 8447], [9812, 8437], [9786, 8432], [9762, 8400], [9761, 8380], [9776, 8365], [9777, 8346], [9764, 8341], [9753, 8288], [9756, 8226], [9741, 8213], [9734, 8176], [9753, 8164], [9741, 8155], [9750, 8148], [9749, 8128], [9740, 8114], [9718, 8102], [9728, 8081], [9720, 8047], [9709, 8046], [9705, 8027], [9693, 8030], [9688, 8017], [9693, 7993], [9687, 7984], [9696, 7976], [9678, 7951], [9652, 7932], [9643, 7909], [9641, 7864], [9650, 7848], [9646, 7830], [9621, 7806], [9606, 7814], [9522, 7829], [9456, 7843], [9438, 7851], [9434, 7863], [9420, 7854], [9416, 7829], [9403, 7833], [9393, 7814], [9402, 7808], [9392, 7793], [9369, 7770], [9366, 7762], [9347, 7767], [9334, 7748], [9314, 7753], [9302, 7746], [9301, 7735], [9283, 7726], [9293, 7711], [9301, 7712], [9312, 7694], [9364, 7536], [9356, 7531], [9359, 7509], [9352, 7481], [9364, 7428], [9358, 7410], [9377, 7404], [9376, 7396], [9349, 7383], [9349, 7383], [9328, 7401], [9309, 7381], [9297, 7384], [9292, 7396], [9230, 7426], [9217, 7424], [9216, 7446], [9208, 7455], [9205, 7485], [9196, 7495], [9196, 7495], [9196, 7519], [9182, 7493], [9170, 7490], [9154, 7462], [9154, 7462], [9144, 7465], [9140, 7492], [9132, 7504], [9115, 7499], [9115, 7499], [9113, 7500], [9113, 7500], [9099, 7489], [9094, 7466], [9045, 7461], [9036, 7447], [9003, 7435], [9010, 7390], [8974, 7369], [8962, 7375], [8949, 7371], [8915, 7435], [8922, 7445], [8914, 7454], [8899, 7452], [8900, 7463], [8888, 7475], [8885, 7489], [8860, 7524], [8861, 7567], [8857, 7581], [8839, 7599], [8813, 7576], [8811, 7560], [8787, 7554], [8797, 7540], [8798, 7502], [8793, 7496], [8760, 7481], [8736, 7488], [8733, 7512], [8726, 7504], [8709, 7517], [8713, 7530], [8687, 7558], [8687, 7558], [8690, 7567], [8681, 7578], [8693, 7588], [8696, 7601], [8666, 7613], [8629, 7613], [8614, 7604], [8607, 7592], [8602, 7629], [8591, 7654], [8596, 7673], [8606, 7685], [8583, 7715], [8581, 7729], [8558, 7731], [8510, 7753], [8486, 7747], [8469, 7732], [8443, 7718], [8398, 7731], [8369, 7752], [8357, 7765], [8359, 7783], [8353, 7806], [8342, 7807], [8321, 7792], [8308, 7795], [8304, 7778], [8296, 7772], [8278, 7776], [8248, 7766], [8238, 7793], [8227, 7792], [8220, 7803], [8215, 7778], [8170, 7774], [8156, 7767], [8145, 7777], [8131, 7772], [8121, 7798], [8110, 7795], [8107, 7806], [8081, 7818], [8082, 7830], [8058, 7852], [8067, 7857], [8065, 7878], [8054, 7883], [8048, 7898], [8059, 7911], [8050, 7931], [8046, 7962], [8030, 7980], [8011, 7969], [7982, 7964], [7975, 7957], [7963, 7965], [7941, 7955], [7932, 7962]]], [[[8056, 9021], [8044, 9013], [8046, 8986], [8041, 8965], [8032, 8978], [8017, 8974], [8003, 8979], [7997, 8968], [7987, 8973], [7979, 8964], [7966, 8968], [7964, 8984], [7947, 9003], [7949, 9032], [7970, 9011], [7983, 9028], [7979, 9048], [7993, 9063], [8028, 9062], [8034, 9057], [8054, 9060], [8056, 9021]]]]
                    },
                    "id": "CN.230000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 310000,
                        "name": "上海",
                        "center": [121.472644, 31.231706],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 8,
                        "fullname": "上海市",
                        "filename": "shanghai",
                        "parent": "中国",
                        "areacode": 310000,
                        "longitude": 121.472644,
                        "latitude": 31.231706,
                        "cp": [7779, 4409],
                        "drilldown": "shanghai"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7881, 4314], [7876, 4311], [7868, 4319], [7809, 4314], [7775, 4295], [7763, 4283], [7746, 4282], [7734, 4306], [7716, 4304], [7710, 4321], [7689, 4315], [7688, 4354], [7670, 4356], [7665, 4382], [7703, 4389], [7699, 4414], [7716, 4416], [7707, 4436], [7719, 4456], [7735, 4463], [7735, 4463], [7743, 4468], [7743, 4468], [7751, 4472], [7787, 4447], [7825, 4429], [7873, 4376], [7883, 4355], [7881, 4314]]], [[[7756, 4481], [7710, 4524], [7720, 4543], [7743, 4552], [7766, 4530], [7821, 4512], [7872, 4501], [7878, 4473], [7858, 4458], [7844, 4459], [7790, 4478], [7768, 4490], [7756, 4481]]], [[[7830, 4437], [7784, 4466], [7830, 4451], [7830, 4437]]], [[[7851, 4427], [7840, 4445], [7864, 4439], [7851, 4427]]], [[[7871, 4410], [7883, 4412], [7882, 4398], [7871, 4410]]]]
                    },
                    "id": "CN.310000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 320000,
                        "name": "江苏",
                        "center": [118.767413, 32.041544],
                        "childrenNum": 13,
                        "level": "province",
                        "subFeatureIndex": 9,
                        "fullname": "江苏省",
                        "filename": "jiangsu",
                        "parent": "中国",
                        "areacode": 320000,
                        "longitude": 118.767413,
                        "latitude": 32.041544,
                        "cp": [7248, 4573],
                        "drilldown": "jiangsu"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7872, 4501], [7821, 4512], [7766, 4530], [7743, 4552], [7720, 4543], [7710, 4524], [7756, 4481], [7751, 4472], [7743, 4468], [7743, 4468], [7735, 4463], [7735, 4463], [7719, 4456], [7707, 4436], [7716, 4416], [7699, 4414], [7703, 4389], [7665, 4382], [7670, 4356], [7631, 4344], [7635, 4324], [7611, 4316], [7595, 4294], [7578, 4325], [7566, 4322], [7567, 4336], [7539, 4330], [7522, 4333], [7495, 4351], [7478, 4383], [7431, 4380], [7420, 4372], [7388, 4376], [7374, 4384], [7374, 4384], [7372, 4401], [7350, 4396], [7337, 4406], [7313, 4391], [7256, 4391], [7245, 4400], [7248, 4421], [7269, 4427], [7272, 4458], [7272, 4459], [7268, 4479], [7258, 4477], [7251, 4491], [7244, 4480], [7226, 4483], [7236, 4497], [7224, 4508], [7208, 4501], [7194, 4511], [7198, 4526], [7170, 4545], [7176, 4579], [7195, 4589], [7199, 4605], [7222, 4610], [7232, 4635], [7230, 4668], [7211, 4672], [7205, 4690], [7234, 4702], [7234, 4702], [7274, 4691], [7274, 4691], [7274, 4691], [7274, 4691], [7285, 4679], [7297, 4682], [7306, 4668], [7331, 4697], [7322, 4753], [7307, 4753], [7285, 4783], [7257, 4781], [7251, 4758], [7237, 4756], [7241, 4731], [7231, 4727], [7168, 4724], [7143, 4753], [7139, 4768], [7150, 4776], [7141, 4787], [7135, 4829], [7100, 4817], [7081, 4846], [7087, 4850], [7101, 4899], [7112, 4895], [7112, 4928], [7122, 4939], [7111, 4962], [7071, 4950], [7052, 4954], [7042, 4948], [7043, 4988], [7034, 4986], [7017, 5020], [7007, 5009], [6995, 5027], [6975, 5018], [6964, 5033], [6934, 5027], [6901, 5049], [6906, 5066], [6891, 5075], [6890, 5099], [6863, 5099], [6853, 5114], [6815, 5121], [6818, 5126], [6798, 5140], [6786, 5159], [6776, 5155], [6782, 5204], [6788, 5214], [6832, 5225], [6860, 5223], [6887, 5211], [6894, 5193], [6911, 5172], [6909, 5157], [6921, 5156], [6929, 5119], [6942, 5114], [6952, 5140], [6952, 5140], [6956, 5142], [6956, 5142], [6956, 5142], [6956, 5142], [6956, 5144], [6956, 5144], [6971, 5143], [6984, 5124], [7008, 5119], [7025, 5139], [7047, 5133], [7045, 5163], [7066, 5162], [7075, 5170], [7100, 5166], [7100, 5146], [7120, 5140], [7110, 5126], [7119, 5120], [7120, 5103], [7141, 5114], [7162, 5115], [7169, 5138], [7165, 5153], [7172, 5168], [7198, 5182], [7215, 5174], [7232, 5185], [7220, 5190], [7230, 5201], [7245, 5236], [7246, 5256], [7258, 5261], [7293, 5263], [7297, 5273], [7325, 5278], [7329, 5269], [7316, 5262], [7311, 5226], [7318, 5205], [7345, 5198], [7360, 5200], [7370, 5191], [7362, 5177], [7385, 5161], [7423, 5143], [7429, 5137], [7458, 5132], [7526, 5099], [7538, 5050], [7583, 4956], [7597, 4935], [7617, 4881], [7633, 4873], [7651, 4813], [7657, 4778], [7666, 4778], [7666, 4754], [7653, 4743], [7657, 4724], [7704, 4701], [7743, 4690], [7757, 4681], [7770, 4615], [7779, 4615], [7826, 4599], [7846, 4577], [7870, 4524], [7872, 4501]]]]
                    },
                    "id": "CN.320000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 330000,
                        "name": "浙江",
                        "center": [120.153576, 30.287459],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 10,
                        "fullname": "浙江省",
                        "filename": "zhejiang",
                        "parent": "中国",
                        "areacode": 330000,
                        "longitude": 120.153576,
                        "latitude": 30.287459,
                        "cp": [7531, 4185],
                        "drilldown": "zhejiang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7620, 3481], [7607, 3496], [7612, 3507], [7593, 3537], [7577, 3544], [7552, 3540], [7536, 3522], [7527, 3530], [7495, 3511], [7480, 3512], [7462, 3541], [7466, 3558], [7450, 3573], [7452, 3591], [7424, 3587], [7419, 3562], [7400, 3561], [7379, 3534], [7364, 3533], [7321, 3550], [7306, 3541], [7298, 3559], [7307, 3576], [7285, 3643], [7268, 3654], [7265, 3675], [7281, 3688], [7274, 3703], [7280, 3715], [7259, 3730], [7255, 3721], [7237, 3723], [7209, 3716], [7207, 3724], [7217, 3733], [7206, 3749], [7213, 3768], [7204, 3779], [7203, 3780], [7204, 3779], [7203, 3780], [7203, 3780], [7203, 3781], [7203, 3791], [7203, 3791], [7204, 3812], [7193, 3835], [7193, 3835], [7178, 3843], [7170, 3865], [7138, 3881], [7138, 3881], [7123, 3903], [7121, 3919], [7130, 3947], [7142, 3946], [7155, 3960], [7152, 3971], [7176, 3978], [7175, 3995], [7211, 4001], [7212, 4014], [7226, 4028], [7240, 4029], [7259, 4052], [7260, 4076], [7287, 4098], [7288, 4118], [7276, 4148], [7292, 4157], [7281, 4183], [7296, 4193], [7317, 4181], [7344, 4179], [7353, 4191], [7376, 4201], [7367, 4234], [7349, 4237], [7349, 4251], [7364, 4254], [7378, 4269], [7384, 4260], [7396, 4274], [7395, 4290], [7413, 4303], [7414, 4336], [7423, 4347], [7420, 4372], [7431, 4380], [7478, 4383], [7495, 4351], [7522, 4333], [7539, 4330], [7567, 4336], [7566, 4322], [7578, 4325], [7595, 4294], [7611, 4316], [7635, 4324], [7631, 4344], [7670, 4356], [7688, 4354], [7689, 4315], [7710, 4321], [7716, 4304], [7734, 4306], [7746, 4282], [7705, 4255], [7740, 4220], [7760, 4219], [7794, 4190], [7823, 4149], [7841, 4132], [7853, 4133], [7881, 4117], [7890, 4126], [7898, 4112], [7924, 4115], [7917, 4105], [7898, 4082], [7886, 4079], [7867, 4056], [7893, 4054], [7900, 4042], [7895, 4027], [7900, 4013], [7890, 3997], [7902, 3946], [7900, 3923], [7883, 3934], [7862, 3934], [7859, 3946], [7838, 3934], [7864, 3878], [7843, 3879], [7850, 3867], [7848, 3845], [7820, 3829], [7839, 3809], [7852, 3774], [7841, 3740], [7815, 3751], [7792, 3711], [7775, 3712], [7771, 3687], [7747, 3686], [7739, 3710], [7730, 3700], [7718, 3666], [7731, 3656], [7752, 3658], [7751, 3636], [7752, 3636], [7751, 3634], [7751, 3634], [7751, 3634], [7748, 3631], [7748, 3631], [7751, 3637], [7726, 3640], [7709, 3654], [7681, 3626], [7650, 3580], [7665, 3558], [7660, 3533], [7640, 3520], [7636, 3484], [7620, 3481]]], [[[7955, 4126], [7928, 4135], [7903, 4134], [7893, 4153], [7893, 4153], [7884, 4177], [7924, 4163], [7952, 4162], [7964, 4143], [7955, 4126]]], [[[7912, 4206], [7936, 4213], [7938, 4191], [7904, 4202], [7912, 4206]]], [[[7955, 4196], [7972, 4202], [7971, 4191], [7955, 4196]]], [[[7982, 4119], [7974, 4102], [7961, 4122], [7977, 4129], [7982, 4119]]], [[[7959, 4244], [7974, 4232], [7946, 4233], [7945, 4245], [7959, 4244]]], [[[7957, 4101], [7959, 4087], [7941, 4101], [7957, 4101]]], [[[7925, 4064], [7908, 4073], [7923, 4090], [7938, 4073], [7937, 4060], [7925, 4064]]], [[[7876, 4311], [7881, 4314], [7890, 4287], [7882, 4291], [7876, 4311]]], [[[7871, 4127], [7863, 4133], [7866, 4154], [7880, 4147], [7882, 4134], [7871, 4127]]], [[[7926, 4131], [7926, 4131], [7926, 4131], [7928, 4135], [7926, 4131]]], [[[7747, 3667], [7728, 3665], [7733, 3675], [7747, 3667]]], [[[7748, 3631], [7748, 3631], [7748, 3631], [7748, 3631]]], [[[7926, 4131], [7926, 4131], [7926, 4131], [7926, 4131]]]]
                    },
                    "id": "CN.330000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 340000,
                        "name": "安徽",
                        "center": [117.283042, 31.86119],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 11,
                        "fullname": "安徽省",
                        "filename": "anhui",
                        "parent": "中国",
                        "areacode": 340000,
                        "longitude": 117.283042,
                        "latitude": 31.86119,
                        "cp": [6961, 4524],
                        "drilldown": "anhui"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6616, 4657], [6597, 4675], [6577, 4676], [6557, 4685], [6553, 4702], [6556, 4745], [6544, 4754], [6507, 4763], [6495, 4775], [6503, 4781], [6499, 4807], [6511, 4811], [6526, 4797], [6550, 4798], [6575, 4810], [6587, 4855], [6577, 4864], [6583, 4893], [6597, 4905], [6639, 4912], [6624, 4955], [6634, 4956], [6636, 4978], [6621, 4978], [6632, 5014], [6656, 5025], [6683, 5008], [6699, 5009], [6707, 5000], [6705, 4985], [6718, 4976], [6722, 4958], [6737, 4942], [6758, 4947], [6768, 4956], [6791, 4964], [6791, 4974], [6830, 4986], [6830, 5003], [6816, 5025], [6816, 5025], [6808, 5034], [6814, 5049], [6804, 5077], [6784, 5072], [6784, 5072], [6756, 5095], [6746, 5096], [6736, 5113], [6744, 5125], [6742, 5140], [6751, 5135], [6758, 5148], [6776, 5155], [6786, 5159], [6798, 5140], [6818, 5126], [6815, 5121], [6853, 5114], [6863, 5099], [6890, 5099], [6891, 5075], [6906, 5066], [6901, 5049], [6934, 5027], [6964, 5033], [6975, 5018], [6995, 5027], [7007, 5009], [7017, 5020], [7034, 4986], [7043, 4988], [7042, 4948], [7052, 4954], [7071, 4950], [7111, 4962], [7122, 4939], [7112, 4928], [7112, 4895], [7101, 4899], [7087, 4850], [7081, 4846], [7100, 4817], [7135, 4829], [7141, 4787], [7150, 4776], [7139, 4768], [7143, 4753], [7168, 4724], [7231, 4727], [7241, 4731], [7237, 4756], [7251, 4758], [7257, 4781], [7285, 4783], [7307, 4753], [7322, 4753], [7331, 4697], [7306, 4668], [7297, 4682], [7285, 4679], [7274, 4691], [7274, 4691], [7274, 4691], [7274, 4691], [7234, 4702], [7234, 4702], [7205, 4690], [7211, 4672], [7230, 4668], [7232, 4635], [7222, 4610], [7199, 4605], [7195, 4589], [7176, 4579], [7170, 4545], [7198, 4526], [7194, 4511], [7208, 4501], [7224, 4508], [7236, 4497], [7226, 4483], [7244, 4480], [7251, 4491], [7258, 4477], [7268, 4479], [7272, 4459], [7270, 4456], [7271, 4456], [7272, 4458], [7269, 4427], [7248, 4421], [7245, 4400], [7256, 4391], [7313, 4391], [7337, 4406], [7350, 4396], [7372, 4401], [7374, 4384], [7374, 4384], [7388, 4376], [7420, 4372], [7423, 4347], [7414, 4336], [7413, 4303], [7395, 4290], [7396, 4274], [7384, 4260], [7378, 4269], [7364, 4254], [7349, 4251], [7349, 4237], [7367, 4234], [7376, 4201], [7353, 4191], [7344, 4179], [7317, 4181], [7296, 4193], [7281, 4183], [7292, 4157], [7276, 4148], [7288, 4118], [7287, 4098], [7260, 4076], [7259, 4052], [7240, 4029], [7226, 4028], [7212, 4014], [7211, 4001], [7175, 3995], [7176, 3978], [7152, 3971], [7141, 3976], [7140, 3997], [7115, 4012], [7088, 4004], [7075, 4010], [7056, 4004], [7044, 4018], [7024, 4013], [7021, 4026], [7005, 4034], [7005, 4048], [6991, 4069], [6973, 4063], [6963, 4084], [6950, 4085], [6930, 4065], [6942, 4052], [6938, 4038], [6873, 4005], [6847, 4019], [6852, 4027], [6856, 4027], [6856, 4027], [6860, 4032], [6859, 4033], [6859, 4033], [6858, 4033], [6856, 4035], [6853, 4040], [6874, 4055], [6892, 4078], [6895, 4091], [6882, 4092], [6865, 4114], [6849, 4118], [6833, 4111], [6827, 4080], [6811, 4077], [6770, 4051], [6759, 4061], [6745, 4059], [6743, 4077], [6733, 4093], [6736, 4108], [6730, 4146], [6714, 4165], [6698, 4170], [6702, 4193], [6692, 4230], [6681, 4234], [6670, 4254], [6674, 4269], [6687, 4270], [6689, 4294], [6711, 4310], [6729, 4316], [6727, 4328], [6703, 4336], [6689, 4358], [6669, 4351], [6656, 4370], [6646, 4372], [6629, 4360], [6620, 4384], [6609, 4388], [6606, 4402], [6592, 4403], [6592, 4416], [6592, 4436], [6616, 4477], [6647, 4497], [6668, 4503], [6677, 4497], [6696, 4504], [6692, 4514], [6699, 4550], [6701, 4590], [6695, 4603], [6692, 4640], [6681, 4666], [6670, 4658], [6654, 4663], [6647, 4644], [6628, 4647], [6616, 4657], [6617, 4657], [6617, 4657], [6617, 4657], [6616, 4657]]], [[[6860, 4032], [6856, 4027], [6856, 4027], [6852, 4027], [6853, 4040], [6856, 4035], [6858, 4033], [6859, 4033], [6859, 4033], [6859, 4033], [6860, 4032]]], [[[7272, 4459], [7272, 4458], [7271, 4456], [7270, 4456], [7272, 4459]]], [[[6617, 4657], [6617, 4657], [6617, 4657], [6616, 4657], [6616, 4657], [6617, 4657]]]]
                    },
                    "id": "CN.340000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 350000,
                        "name": "福建",
                        "center": [119.306239, 26.075302],
                        "childrenNum": 9,
                        "level": "province",
                        "subFeatureIndex": 12,
                        "fullname": "福建省",
                        "filename": "fujian",
                        "parent": "中国",
                        "areacode": 350000,
                        "longitude": 119.306239,
                        "latitude": 26.075302,
                        "cp": [7396, 3234],
                        "drilldown": "fujian"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7620, 3481], [7607, 3467], [7585, 3469], [7588, 3456], [7576, 3426], [7553, 3428], [7539, 3406], [7558, 3401], [7564, 3386], [7553, 3377], [7559, 3365], [7525, 3355], [7512, 3336], [7498, 3338], [7502, 3354], [7521, 3361], [7541, 3398], [7519, 3397], [7505, 3364], [7497, 3375], [7473, 3373], [7464, 3382], [7447, 3358], [7489, 3351], [7509, 3301], [7526, 3305], [7514, 3290], [7502, 3293], [7468, 3277], [7456, 3257], [7470, 3225], [7481, 3222], [7475, 3197], [7464, 3193], [7465, 3162], [7459, 3148], [7433, 3143], [7457, 3128], [7467, 3102], [7483, 3119], [7483, 3120], [7476, 3129], [7496, 3146], [7498, 3134], [7517, 3120], [7503, 3114], [7514, 3105], [7494, 3094], [7496, 3085], [7470, 3099], [7471, 3072], [7451, 3077], [7438, 3076], [7438, 3095], [7428, 3087], [7430, 3104], [7412, 3110], [7411, 3089], [7398, 3085], [7391, 3102], [7369, 3079], [7400, 3067], [7418, 3050], [7400, 3046], [7396, 3029], [7367, 3042], [7375, 3025], [7366, 2995], [7363, 3009], [7348, 3020], [7357, 3041], [7339, 3037], [7340, 3051], [7322, 3045], [7337, 3035], [7336, 3018], [7315, 3009], [7327, 2997], [7346, 3003], [7340, 2986], [7349, 2983], [7349, 2983], [7326, 2974], [7335, 2963], [7315, 2965], [7272, 2947], [7300, 2940], [7284, 2915], [7279, 2895], [7255, 2880], [7255, 2894], [7232, 2902], [7214, 2884], [7191, 2878], [7169, 2892], [7167, 2891], [7152, 2856], [7160, 2855], [7175, 2824], [7144, 2802], [7096, 2737], [7078, 2734], [7067, 2697], [7043, 2694], [7037, 2668], [7021, 2661], [6981, 2662], [6981, 2677], [6952, 2691], [6943, 2726], [6936, 2732], [6936, 2758], [6927, 2766], [6926, 2787], [6939, 2798], [6925, 2807], [6918, 2841], [6909, 2861], [6895, 2871], [6888, 2888], [6899, 2904], [6892, 2909], [6855, 2903], [6840, 2892], [6832, 2917], [6824, 2916], [6809, 2939], [6783, 2933], [6769, 2951], [6746, 2945], [6735, 2957], [6710, 2964], [6706, 2982], [6717, 2989], [6708, 2999], [6702, 3025], [6717, 3030], [6733, 3050], [6732, 3088], [6743, 3104], [6744, 3136], [6767, 3152], [6756, 3163], [6765, 3178], [6782, 3181], [6803, 3194], [6807, 3209], [6828, 3228], [6824, 3242], [6809, 3240], [6812, 3269], [6833, 3295], [6849, 3287], [6851, 3310], [6836, 3328], [6841, 3349], [6831, 3357], [6839, 3376], [6837, 3391], [6863, 3422], [6909, 3436], [6937, 3451], [6935, 3460], [6960, 3494], [6946, 3505], [6952, 3523], [6942, 3555], [6928, 3555], [6932, 3579], [6944, 3569], [6948, 3584], [6965, 3582], [6983, 3601], [6979, 3624], [6992, 3622], [7027, 3651], [7045, 3624], [7071, 3611], [7080, 3632], [7094, 3644], [7122, 3655], [7141, 3650], [7153, 3672], [7192, 3679], [7195, 3701], [7183, 3708], [7207, 3724], [7209, 3716], [7237, 3723], [7255, 3721], [7259, 3730], [7280, 3715], [7274, 3703], [7281, 3688], [7265, 3675], [7268, 3654], [7285, 3643], [7307, 3576], [7298, 3559], [7306, 3541], [7321, 3550], [7364, 3533], [7379, 3534], [7400, 3561], [7419, 3562], [7424, 3587], [7452, 3591], [7450, 3573], [7466, 3558], [7462, 3541], [7480, 3512], [7495, 3511], [7527, 3530], [7536, 3522], [7552, 3540], [7577, 3544], [7593, 3537], [7612, 3507], [7607, 3496], [7620, 3481]]], [[[7226, 2880], [7239, 2863], [7211, 2851], [7206, 2873], [7218, 2867], [7226, 2880]]], [[[7449, 3040], [7452, 3031], [7431, 3040], [7436, 3053], [7449, 3040]]], [[[7158, 2862], [7160, 2884], [7170, 2889], [7184, 2873], [7171, 2858], [7158, 2862]]], [[[7479, 3364], [7465, 3360], [7466, 3372], [7479, 3364]]]]
                    },
                    "id": "CN.350000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 360000,
                        "name": "江西",
                        "center": [115.892151, 28.676493],
                        "childrenNum": 11,
                        "level": "province",
                        "subFeatureIndex": 13,
                        "fullname": "江西省",
                        "filename": "jiangxi",
                        "parent": "中国",
                        "areacode": 360000,
                        "longitude": 115.892151,
                        "latitude": 28.676493,
                        "cp": [6700, 3801],
                        "drilldown": "jiangxi"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6314, 3882], [6316, 3892], [6338, 3917], [6375, 3924], [6377, 3949], [6428, 3945], [6456, 3960], [6475, 3954], [6509, 3967], [6495, 3979], [6511, 3983], [6522, 4001], [6553, 3987], [6550, 4019], [6593, 4018], [6615, 4040], [6622, 4062], [6653, 4065], [6687, 4042], [6712, 4037], [6745, 4059], [6759, 4061], [6770, 4051], [6811, 4077], [6827, 4080], [6833, 4111], [6849, 4118], [6865, 4114], [6882, 4092], [6895, 4091], [6892, 4078], [6874, 4055], [6853, 4040], [6852, 4027], [6847, 4019], [6873, 4005], [6938, 4038], [6942, 4052], [6930, 4065], [6950, 4085], [6963, 4084], [6973, 4063], [6991, 4069], [7005, 4048], [7005, 4034], [7021, 4026], [7024, 4013], [7044, 4018], [7056, 4004], [7075, 4010], [7088, 4004], [7115, 4012], [7140, 3997], [7141, 3976], [7152, 3971], [7155, 3960], [7142, 3946], [7130, 3947], [7121, 3919], [7123, 3903], [7138, 3881], [7138, 3881], [7170, 3865], [7178, 3843], [7193, 3835], [7193, 3835], [7204, 3812], [7203, 3791], [7203, 3791], [7203, 3781], [7203, 3780], [7203, 3780], [7204, 3779], [7203, 3780], [7204, 3779], [7213, 3768], [7206, 3749], [7217, 3733], [7207, 3724], [7183, 3708], [7195, 3701], [7192, 3679], [7153, 3672], [7141, 3650], [7122, 3655], [7094, 3644], [7080, 3632], [7071, 3611], [7045, 3624], [7027, 3651], [6992, 3622], [6979, 3624], [6983, 3601], [6965, 3582], [6948, 3584], [6944, 3569], [6932, 3579], [6928, 3555], [6942, 3555], [6952, 3523], [6946, 3505], [6960, 3494], [6935, 3460], [6937, 3451], [6909, 3436], [6863, 3422], [6837, 3391], [6839, 3376], [6831, 3357], [6841, 3349], [6836, 3328], [6851, 3310], [6849, 3287], [6833, 3295], [6812, 3269], [6809, 3240], [6824, 3242], [6828, 3228], [6807, 3209], [6803, 3194], [6782, 3181], [6765, 3178], [6756, 3163], [6767, 3152], [6744, 3136], [6743, 3104], [6732, 3088], [6733, 3050], [6717, 3030], [6702, 3025], [6708, 2999], [6717, 2989], [6706, 2982], [6710, 2964], [6714, 2951], [6696, 2957], [6683, 2922], [6702, 2880], [6670, 2876], [6666, 2889], [6646, 2892], [6643, 2907], [6613, 2931], [6602, 2918], [6592, 2923], [6549, 2904], [6541, 2910], [6511, 2901], [6503, 2879], [6474, 2889], [6469, 2870], [6461, 2883], [6446, 2873], [6434, 2877], [6413, 2861], [6405, 2878], [6388, 2881], [6378, 2896], [6360, 2906], [6381, 2909], [6394, 2919], [6407, 2948], [6406, 2965], [6428, 2976], [6440, 2993], [6456, 2992], [6475, 3003], [6463, 3019], [6476, 3037], [6455, 3048], [6434, 3069], [6403, 3046], [6389, 3051], [6379, 3041], [6352, 3045], [6333, 3032], [6336, 3054], [6314, 3074], [6322, 3110], [6308, 3132], [6320, 3162], [6331, 3175], [6327, 3201], [6334, 3216], [6373, 3233], [6362, 3247], [6343, 3237], [6314, 3236], [6331, 3259], [6332, 3283], [6343, 3290], [6340, 3307], [6347, 3328], [6308, 3336], [6297, 3348], [6292, 3379], [6311, 3411], [6290, 3431], [6281, 3453], [6295, 3473], [6300, 3509], [6249, 3500], [6252, 3514], [6242, 3540], [6247, 3563], [6278, 3602], [6272, 3622], [6276, 3632], [6298, 3648], [6308, 3645], [6335, 3660], [6324, 3683], [6347, 3688], [6376, 3720], [6376, 3736], [6360, 3744], [6369, 3756], [6342, 3772], [6357, 3818], [6356, 3834], [6341, 3834], [6327, 3861], [6319, 3859], [6314, 3882]]]]
                    },
                    "id": "CN.360000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 370000,
                        "name": "山东",
                        "center": [117.000923, 36.675807],
                        "childrenNum": 17,
                        "level": "province",
                        "subFeatureIndex": 14,
                        "fullname": "山东省",
                        "filename": "shandong",
                        "parent": "中国",
                        "areacode": 370000,
                        "longitude": 117.000923,
                        "latitude": 36.675807,
                        "cp": [6886, 5627],
                        "drilldown": "shandong"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7690, 5876], [7713, 5840], [7730, 5833], [7742, 5846], [7748, 5841], [7796, 5844], [7826, 5864], [7841, 5838], [7854, 5846], [7863, 5836], [7888, 5835], [7901, 5840], [7914, 5834], [7935, 5841], [7919, 5809], [7930, 5786], [7922, 5774], [7908, 5774], [7902, 5747], [7922, 5753], [7916, 5717], [7882, 5698], [7850, 5700], [7843, 5721], [7826, 5713], [7818, 5726], [7774, 5703], [7773, 5697], [7748, 5684], [7753, 5667], [7723, 5681], [7717, 5672], [7672, 5651], [7639, 5627], [7605, 5636], [7631, 5620], [7615, 5580], [7603, 5601], [7590, 5599], [7578, 5582], [7588, 5569], [7573, 5568], [7584, 5521], [7541, 5511], [7516, 5499], [7506, 5503], [7518, 5535], [7484, 5535], [7471, 5517], [7497, 5499], [7492, 5488], [7507, 5493], [7501, 5480], [7465, 5457], [7456, 5420], [7440, 5431], [7441, 5402], [7402, 5396], [7393, 5385], [7371, 5333], [7347, 5305], [7341, 5270], [7329, 5269], [7325, 5278], [7297, 5273], [7293, 5263], [7258, 5261], [7246, 5256], [7245, 5236], [7230, 5201], [7220, 5190], [7232, 5185], [7215, 5174], [7198, 5182], [7172, 5168], [7165, 5153], [7169, 5138], [7162, 5115], [7141, 5114], [7120, 5103], [7119, 5120], [7110, 5126], [7120, 5140], [7100, 5146], [7100, 5166], [7075, 5170], [7066, 5162], [7045, 5163], [7047, 5133], [7025, 5139], [7008, 5119], [6984, 5124], [6971, 5143], [6956, 5144], [6956, 5144], [6956, 5142], [6956, 5142], [6956, 5142], [6956, 5142], [6952, 5140], [6952, 5140], [6942, 5114], [6929, 5119], [6921, 5156], [6909, 5157], [6911, 5172], [6894, 5193], [6887, 5211], [6860, 5223], [6832, 5225], [6788, 5214], [6782, 5204], [6776, 5155], [6758, 5148], [6751, 5135], [6742, 5140], [6731, 5136], [6724, 5147], [6673, 5136], [6648, 5143], [6642, 5135], [6613, 5140], [6603, 5153], [6596, 5191], [6575, 5204], [6563, 5200], [6562, 5214], [6551, 5216], [6539, 5237], [6520, 5229], [6500, 5228], [6481, 5238], [6492, 5258], [6485, 5270], [6502, 5281], [6501, 5292], [6518, 5319], [6532, 5331], [6559, 5333], [6581, 5351], [6586, 5367], [6605, 5400], [6644, 5410], [6659, 5434], [6678, 5435], [6684, 5458], [6710, 5461], [6719, 5494], [6699, 5478], [6635, 5449], [6607, 5440], [6607, 5443], [6608, 5446], [6608, 5446], [6605, 5444], [6602, 5443], [6602, 5443], [6601, 5441], [6601, 5441], [6601, 5440], [6601, 5439], [6601, 5440], [6601, 5440], [6601, 5439], [6601, 5439], [6601, 5440], [6601, 5439], [6600, 5436], [6582, 5416], [6577, 5419], [6581, 5460], [6597, 5470], [6604, 5501], [6600, 5527], [6600, 5527], [6581, 5538], [6570, 5573], [6570, 5573], [6565, 5579], [6581, 5610], [6602, 5643], [6640, 5654], [6645, 5672], [6660, 5692], [6656, 5697], [6673, 5717], [6681, 5747], [6692, 5755], [6694, 5775], [6707, 5785], [6728, 5789], [6741, 5784], [6750, 5794], [6739, 5800], [6741, 5814], [6741, 5814], [6748, 5809], [6751, 5830], [6759, 5835], [6767, 5822], [6767, 5822], [6767, 5822], [6767, 5822], [6777, 5811], [6830, 5875], [6841, 5898], [6885, 5896], [6898, 5900], [6930, 5899], [6944, 5905], [6962, 5903], [6975, 5924], [6988, 5954], [7009, 5956], [7022, 5970], [7028, 5992], [7044, 6009], [7063, 5989], [7072, 5988], [7090, 6009], [7077, 5979], [7125, 5970], [7157, 5968], [7167, 5955], [7176, 5973], [7198, 5979], [7222, 5980], [7244, 5966], [7251, 5943], [7271, 5927], [7275, 5902], [7291, 5902], [7300, 5877], [7267, 5874], [7252, 5859], [7242, 5834], [7251, 5793], [7265, 5771], [7279, 5772], [7311, 5759], [7317, 5740], [7347, 5746], [7362, 5739], [7394, 5748], [7421, 5779], [7411, 5804], [7466, 5831], [7484, 5849], [7478, 5864], [7488, 5868], [7479, 5881], [7505, 5883], [7523, 5898], [7547, 5901], [7572, 5917], [7610, 5916], [7629, 5893], [7647, 5895], [7652, 5870], [7664, 5863], [7689, 5867], [7690, 5876]]], [[[6607, 5443], [6607, 5440], [6600, 5436], [6601, 5439], [6601, 5440], [6601, 5439], [6601, 5439], [6601, 5440], [6601, 5440], [6601, 5439], [6601, 5440], [6601, 5441], [6601, 5441], [6602, 5443], [6602, 5443], [6605, 5444], [6607, 5443]]], [[[7714, 5864], [7714, 5864], [7714, 5864], [7713, 5864], [7713, 5864], [7714, 5864]]], [[[7714, 5864], [7714, 5864], [7714, 5864], [7714, 5864], [7714, 5864], [7714, 5864]]]]
                    },
                    "id": "CN.370000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 410000,
                        "name": "河南",
                        "center": [113.665412, 34.757975],
                        "childrenNum": 18,
                        "level": "province",
                        "subFeatureIndex": 15,
                        "fullname": "河南省",
                        "filename": "henan",
                        "parent": "中国",
                        "areacode": 410000,
                        "longitude": 113.665412,
                        "latitude": 34.757975,
                        "cp": [6262, 5179],
                        "drilldown": "henan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6742, 5140], [6744, 5125], [6736, 5113], [6746, 5096], [6756, 5095], [6784, 5072], [6784, 5072], [6804, 5077], [6814, 5049], [6808, 5034], [6816, 5025], [6816, 5025], [6830, 5003], [6830, 4986], [6791, 4974], [6791, 4964], [6768, 4956], [6758, 4947], [6737, 4942], [6722, 4958], [6718, 4976], [6705, 4985], [6707, 5000], [6699, 5009], [6683, 5008], [6656, 5025], [6632, 5014], [6621, 4978], [6636, 4978], [6634, 4956], [6624, 4955], [6639, 4912], [6597, 4905], [6583, 4893], [6577, 4864], [6587, 4855], [6575, 4810], [6550, 4798], [6526, 4797], [6511, 4811], [6499, 4807], [6503, 4781], [6495, 4775], [6507, 4763], [6544, 4754], [6556, 4745], [6553, 4702], [6557, 4685], [6577, 4676], [6597, 4675], [6616, 4657], [6616, 4657], [6628, 4647], [6647, 4644], [6654, 4663], [6670, 4658], [6681, 4666], [6692, 4640], [6695, 4603], [6701, 4590], [6699, 4550], [6692, 4514], [6696, 4504], [6677, 4497], [6668, 4503], [6647, 4497], [6616, 4477], [6592, 4436], [6592, 4416], [6578, 4411], [6563, 4420], [6565, 4450], [6544, 4459], [6537, 4438], [6524, 4443], [6487, 4427], [6477, 4441], [6461, 4442], [6450, 4455], [6434, 4450], [6432, 4469], [6439, 4496], [6412, 4488], [6382, 4493], [6363, 4515], [6352, 4514], [6343, 4500], [6323, 4493], [6317, 4517], [6294, 4517], [6285, 4558], [6273, 4568], [6284, 4592], [6277, 4611], [6279, 4610], [6278, 4616], [6279, 4617], [6278, 4638], [6261, 4645], [6253, 4632], [6214, 4611], [6173, 4648], [6155, 4635], [6137, 4647], [6131, 4636], [6106, 4640], [6081, 4633], [6080, 4634], [6045, 4642], [6027, 4629], [6015, 4635], [6003, 4624], [5984, 4639], [5942, 4654], [5930, 4670], [5919, 4666], [5871, 4697], [5859, 4688], [5822, 4742], [5805, 4749], [5796, 4766], [5802, 4775], [5795, 4791], [5778, 4794], [5784, 4808], [5761, 4826], [5756, 4830], [5747, 4841], [5756, 4858], [5750, 4882], [5756, 4890], [5756, 4891], [5752, 4914], [5728, 4928], [5711, 4965], [5674, 4987], [5690, 4998], [5676, 5034], [5686, 5049], [5648, 5069], [5646, 5076], [5661, 5090], [5642, 5112], [5642, 5112], [5634, 5132], [5638, 5151], [5656, 5154], [5667, 5146], [5701, 5151], [5709, 5161], [5734, 5158], [5743, 5179], [5750, 5173], [5779, 5184], [5785, 5195], [5801, 5191], [5823, 5200], [5865, 5202], [5884, 5235], [5928, 5256], [5959, 5250], [5962, 5287], [5959, 5301], [6045, 5286], [6068, 5288], [6066, 5297], [6092, 5283], [6102, 5295], [6120, 5292], [6135, 5304], [6136, 5319], [6160, 5312], [6173, 5339], [6193, 5333], [6196, 5346], [6228, 5355], [6246, 5381], [6251, 5419], [6261, 5428], [6257, 5463], [6268, 5472], [6260, 5505], [6272, 5526], [6275, 5549], [6292, 5542], [6303, 5547], [6309, 5538], [6322, 5548], [6336, 5542], [6337, 5529], [6357, 5522], [6357, 5522], [6390, 5525], [6436, 5496], [6497, 5498], [6497, 5478], [6513, 5482], [6525, 5507], [6551, 5515], [6551, 5515], [6572, 5487], [6604, 5501], [6597, 5470], [6581, 5460], [6577, 5419], [6582, 5416], [6600, 5436], [6607, 5440], [6635, 5449], [6699, 5478], [6719, 5494], [6710, 5461], [6684, 5458], [6678, 5435], [6659, 5434], [6644, 5410], [6605, 5400], [6586, 5367], [6581, 5351], [6559, 5333], [6532, 5331], [6518, 5319], [6501, 5292], [6502, 5281], [6485, 5270], [6492, 5258], [6481, 5238], [6500, 5228], [6520, 5229], [6539, 5237], [6551, 5216], [6562, 5214], [6563, 5200], [6575, 5204], [6596, 5191], [6603, 5153], [6613, 5140], [6642, 5135], [6648, 5143], [6673, 5136], [6724, 5147], [6731, 5136], [6742, 5140]]], [[[6607, 5443], [6605, 5444], [6608, 5446], [6608, 5446], [6607, 5443]]], [[[6277, 4611], [6279, 4617], [6278, 4616], [6279, 4610], [6277, 4611]]]]
                    },
                    "id": "CN.410000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 420000,
                        "name": "湖北",
                        "center": [114.298572, 30.584355],
                        "childrenNum": 17,
                        "level": "province",
                        "subFeatureIndex": 16,
                        "fullname": "湖北省",
                        "filename": "hubei",
                        "parent": "中国",
                        "areacode": 420000,
                        "longitude": 114.298572,
                        "latitude": 30.584355,
                        "cp": [6384, 4229],
                        "drilldown": "hubei"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5383, 3912], [5360, 3935], [5361, 3967], [5323, 3961], [5326, 3985], [5316, 3987], [5323, 4016], [5311, 4036], [5299, 4031], [5281, 4044], [5277, 4079], [5265, 4084], [5244, 4050], [5231, 4057], [5229, 4074], [5219, 4081], [5248, 4089], [5254, 4115], [5249, 4128], [5260, 4150], [5264, 4173], [5241, 4197], [5229, 4201], [5235, 4227], [5263, 4221], [5287, 4247], [5297, 4225], [5310, 4224], [5343, 4254], [5371, 4257], [5366, 4242], [5368, 4239], [5376, 4229], [5407, 4253], [5418, 4234], [5417, 4220], [5433, 4244], [5464, 4265], [5502, 4299], [5524, 4310], [5547, 4306], [5561, 4287], [5579, 4327], [5572, 4329], [5570, 4352], [5583, 4361], [5575, 4420], [5559, 4425], [5538, 4447], [5520, 4458], [5494, 4460], [5503, 4470], [5498, 4492], [5470, 4499], [5480, 4518], [5470, 4539], [5480, 4552], [5472, 4564], [5479, 4585], [5474, 4611], [5456, 4630], [5458, 4650], [5472, 4676], [5485, 4684], [5484, 4697], [5502, 4699], [5519, 4691], [5538, 4694], [5558, 4683], [5571, 4698], [5584, 4693], [5595, 4702], [5585, 4714], [5586, 4733], [5577, 4747], [5554, 4761], [5511, 4767], [5518, 4803], [5498, 4815], [5476, 4814], [5450, 4824], [5470, 4845], [5486, 4851], [5507, 4841], [5530, 4844], [5564, 4830], [5590, 4834], [5600, 4823], [5648, 4826], [5662, 4842], [5672, 4822], [5692, 4806], [5701, 4817], [5716, 4819], [5747, 4841], [5756, 4830], [5757, 4825], [5756, 4823], [5761, 4826], [5784, 4808], [5778, 4794], [5795, 4791], [5802, 4775], [5796, 4766], [5805, 4749], [5822, 4742], [5859, 4688], [5871, 4697], [5919, 4666], [5930, 4670], [5942, 4654], [5984, 4639], [6003, 4624], [6015, 4635], [6027, 4629], [6045, 4642], [6080, 4634], [6080, 4633], [6081, 4633], [6081, 4633], [6106, 4640], [6131, 4636], [6137, 4647], [6155, 4635], [6173, 4648], [6214, 4611], [6253, 4632], [6261, 4645], [6278, 4638], [6279, 4617], [6277, 4611], [6284, 4592], [6273, 4568], [6285, 4558], [6294, 4517], [6317, 4517], [6323, 4493], [6343, 4500], [6352, 4514], [6363, 4515], [6382, 4493], [6412, 4488], [6439, 4496], [6432, 4469], [6434, 4450], [6450, 4455], [6461, 4442], [6477, 4441], [6487, 4427], [6524, 4443], [6537, 4438], [6544, 4459], [6565, 4450], [6563, 4420], [6578, 4411], [6592, 4416], [6592, 4403], [6606, 4402], [6609, 4388], [6620, 4384], [6629, 4360], [6646, 4372], [6656, 4370], [6669, 4351], [6689, 4358], [6703, 4336], [6727, 4328], [6729, 4316], [6711, 4310], [6689, 4294], [6687, 4270], [6674, 4269], [6670, 4254], [6681, 4234], [6692, 4230], [6702, 4193], [6698, 4170], [6714, 4165], [6730, 4146], [6736, 4108], [6733, 4093], [6743, 4077], [6745, 4059], [6712, 4037], [6687, 4042], [6653, 4065], [6622, 4062], [6615, 4040], [6593, 4018], [6550, 4019], [6553, 3987], [6522, 4001], [6511, 3983], [6495, 3979], [6509, 3967], [6475, 3954], [6456, 3960], [6428, 3945], [6377, 3949], [6375, 3924], [6338, 3917], [6316, 3892], [6314, 3882], [6301, 3879], [6289, 3895], [6276, 3885], [6259, 3910], [6264, 3924], [6248, 3929], [6264, 3960], [6277, 3971], [6253, 3989], [6274, 4001], [6259, 4026], [6236, 4024], [6240, 4062], [6203, 4030], [6157, 3973], [6144, 3971], [6140, 3990], [6118, 3979], [6111, 4009], [6129, 4028], [6133, 4046], [6117, 4049], [6117, 4045], [6114, 4044], [6102, 4049], [6088, 4038], [6087, 4026], [6067, 4006], [6018, 4016], [6004, 3995], [5987, 3994], [5991, 4005], [5954, 4022], [5947, 4040], [5923, 4054], [5925, 4063], [5905, 4067], [5895, 4078], [5878, 4080], [5878, 4080], [5875, 4077], [5875, 4077], [5813, 4082], [5784, 4110], [5723, 4117], [5722, 4128], [5687, 4129], [5680, 4111], [5668, 4121], [5638, 4117], [5649, 4101], [5637, 4084], [5657, 4068], [5665, 4054], [5638, 4035], [5609, 4023], [5582, 4048], [5561, 4059], [5543, 4055], [5513, 4056], [5495, 4053], [5482, 4034], [5482, 4021], [5443, 4025], [5431, 4000], [5407, 3968], [5408, 3949], [5389, 3935], [5392, 3913], [5383, 3912]]], [[[6133, 4046], [6114, 4028], [6114, 4044], [6117, 4045], [6117, 4049], [6133, 4046]]], [[[5756, 4830], [5761, 4826], [5756, 4823], [5757, 4825], [5756, 4830]]], [[[5369, 4240], [5367, 4242], [5368, 4243], [5369, 4241], [5369, 4240]]], [[[6081, 4633], [6080, 4633], [6080, 4634], [6081, 4633], [6081, 4633]]]]
                    },
                    "id": "CN.420000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 430000,
                        "name": "湖南",
                        "center": [112.982279, 28.19409],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 17,
                        "fullname": "湖南省",
                        "filename": "hunan",
                        "parent": "中国",
                        "areacode": 430000,
                        "longitude": 112.982279,
                        "latitude": 28.19409,
                        "cp": [6123, 3691],
                        "drilldown": "hunan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5512, 3253], [5523, 3286], [5507, 3316], [5491, 3314], [5499, 3327], [5486, 3345], [5511, 3363], [5489, 3373], [5486, 3385], [5452, 3381], [5453, 3370], [5439, 3365], [5427, 3377], [5431, 3376], [5431, 3376], [5427, 3378], [5426, 3379], [5423, 3392], [5422, 3397], [5420, 3412], [5434, 3423], [5427, 3448], [5414, 3451], [5418, 3466], [5407, 3470], [5377, 3466], [5356, 3452], [5339, 3464], [5298, 3439], [5282, 3459], [5299, 3463], [5306, 3485], [5333, 3500], [5354, 3531], [5366, 3538], [5386, 3532], [5387, 3543], [5419, 3563], [5421, 3588], [5395, 3612], [5398, 3625], [5390, 3651], [5405, 3668], [5389, 3669], [5399, 3703], [5409, 3720], [5386, 3730], [5388, 3772], [5397, 3791], [5394, 3801], [5374, 3795], [5394, 3828], [5383, 3835], [5383, 3859], [5400, 3895], [5383, 3912], [5392, 3913], [5389, 3935], [5408, 3949], [5407, 3968], [5431, 4000], [5443, 4025], [5482, 4021], [5482, 4034], [5495, 4053], [5513, 4056], [5543, 4055], [5561, 4059], [5582, 4048], [5609, 4023], [5638, 4035], [5665, 4054], [5657, 4068], [5637, 4084], [5649, 4101], [5638, 4117], [5668, 4121], [5680, 4111], [5687, 4129], [5722, 4128], [5723, 4117], [5784, 4110], [5813, 4082], [5875, 4077], [5875, 4077], [5878, 4080], [5878, 4080], [5895, 4078], [5905, 4067], [5925, 4063], [5923, 4054], [5947, 4040], [5954, 4022], [5991, 4005], [5987, 3994], [6004, 3995], [6018, 4016], [6067, 4006], [6087, 4026], [6088, 4038], [6102, 4049], [6114, 4044], [6114, 4028], [6133, 4046], [6129, 4028], [6111, 4009], [6118, 3979], [6140, 3990], [6144, 3971], [6157, 3973], [6203, 4030], [6240, 4062], [6236, 4024], [6259, 4026], [6274, 4001], [6253, 3989], [6277, 3971], [6264, 3960], [6248, 3929], [6264, 3924], [6259, 3910], [6276, 3885], [6289, 3895], [6301, 3879], [6314, 3882], [6319, 3859], [6327, 3861], [6341, 3834], [6356, 3834], [6357, 3818], [6342, 3772], [6369, 3756], [6360, 3744], [6376, 3736], [6376, 3720], [6347, 3688], [6324, 3683], [6335, 3660], [6308, 3645], [6298, 3648], [6276, 3632], [6272, 3622], [6278, 3602], [6247, 3563], [6242, 3540], [6252, 3514], [6249, 3500], [6300, 3509], [6295, 3473], [6281, 3453], [6290, 3431], [6311, 3411], [6292, 3379], [6297, 3348], [6308, 3336], [6347, 3328], [6340, 3307], [6343, 3290], [6332, 3283], [6331, 3259], [6314, 3236], [6343, 3237], [6362, 3247], [6373, 3233], [6334, 3216], [6327, 3201], [6331, 3175], [6320, 3162], [6308, 3132], [6322, 3110], [6314, 3074], [6302, 3073], [6289, 3050], [6275, 3057], [6247, 3049], [6247, 3049], [6231, 3058], [6214, 3056], [6198, 3066], [6186, 3085], [6173, 3091], [6147, 3076], [6139, 3062], [6102, 3046], [6095, 3032], [6121, 3031], [6129, 3021], [6116, 3008], [6126, 2995], [6118, 2984], [6124, 2964], [6096, 2953], [6077, 2954], [6064, 2995], [6053, 3006], [6003, 3009], [5994, 3020], [5981, 3013], [5957, 3019], [5950, 2984], [5943, 2970], [5954, 2962], [5953, 2947], [5938, 2939], [5923, 2920], [5908, 2927], [5855, 2930], [5830, 2900], [5802, 2910], [5812, 2935], [5811, 2964], [5803, 2975], [5804, 3001], [5781, 3004], [5772, 3014], [5756, 2997], [5736, 2989], [5736, 2969], [5713, 2965], [5706, 2991], [5716, 3017], [5739, 3029], [5738, 3045], [5778, 3081], [5787, 3115], [5781, 3141], [5808, 3152], [5806, 3169], [5818, 3174], [5789, 3183], [5770, 3174], [5758, 3194], [5774, 3217], [5777, 3264], [5762, 3273], [5739, 3273], [5710, 3288], [5708, 3268], [5672, 3261], [5643, 3281], [5631, 3271], [5623, 3248], [5593, 3227], [5583, 3202], [5569, 3199], [5559, 3223], [5551, 3214], [5531, 3220], [5539, 3247], [5512, 3253]]], [[[5413, 3219], [5407, 3235], [5415, 3245], [5415, 3245], [5406, 3266], [5412, 3282], [5386, 3272], [5375, 3279], [5384, 3308], [5401, 3331], [5392, 3368], [5412, 3382], [5426, 3379], [5427, 3378], [5427, 3377], [5439, 3365], [5453, 3370], [5452, 3381], [5486, 3385], [5489, 3373], [5511, 3363], [5486, 3345], [5499, 3327], [5491, 3314], [5507, 3316], [5523, 3286], [5512, 3253], [5500, 3242], [5490, 3216], [5474, 3208], [5478, 3182], [5453, 3184], [5463, 3208], [5444, 3222], [5419, 3211], [5413, 3219]]]]
                    },
                    "id": "CN.430000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 440000,
                        "name": "广东",
                        "center": [113.280637, 23.125178],
                        "childrenNum": 22,
                        "level": "province",
                        "subFeatureIndex": 18,
                        "fullname": "广东省",
                        "filename": "guangdong",
                        "parent": "中国",
                        "areacode": 440000,
                        "longitude": 113.280637,
                        "latitude": 23.125178,
                        "cp": [6177, 2558],
                        "drilldown": "guangdong"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5448, 2198], [5440, 2234], [5472, 2240], [5481, 2259], [5483, 2283], [5505, 2286], [5520, 2295], [5536, 2294], [5536, 2294], [5575, 2291], [5569, 2330], [5569, 2330], [5568, 2332], [5568, 2332], [5582, 2362], [5597, 2348], [5612, 2359], [5627, 2348], [5630, 2364], [5647, 2380], [5660, 2380], [5645, 2397], [5659, 2444], [5717, 2457], [5718, 2475], [5748, 2477], [5780, 2510], [5782, 2527], [5796, 2542], [5785, 2553], [5788, 2581], [5781, 2599], [5791, 2639], [5808, 2653], [5810, 2674], [5836, 2676], [5847, 2693], [5837, 2695], [5847, 2719], [5877, 2713], [5877, 2731], [5904, 2753], [5891, 2780], [5892, 2807], [5904, 2807], [5923, 2822], [5929, 2841], [5914, 2860], [5919, 2874], [5905, 2888], [5910, 2916], [5923, 2920], [5938, 2939], [5953, 2947], [5954, 2962], [5943, 2970], [5950, 2984], [5957, 3019], [5981, 3013], [5994, 3020], [6003, 3009], [6053, 3006], [6064, 2995], [6077, 2954], [6096, 2953], [6124, 2964], [6118, 2984], [6126, 2995], [6116, 3008], [6129, 3021], [6121, 3031], [6095, 3032], [6102, 3046], [6139, 3062], [6147, 3076], [6173, 3091], [6186, 3085], [6198, 3066], [6214, 3056], [6231, 3058], [6247, 3049], [6247, 3049], [6275, 3057], [6289, 3050], [6302, 3073], [6314, 3074], [6336, 3054], [6333, 3032], [6352, 3045], [6379, 3041], [6389, 3051], [6403, 3046], [6434, 3069], [6455, 3048], [6476, 3037], [6463, 3019], [6475, 3003], [6456, 2992], [6440, 2993], [6428, 2976], [6406, 2965], [6407, 2948], [6394, 2919], [6381, 2909], [6360, 2906], [6378, 2896], [6388, 2881], [6405, 2878], [6413, 2861], [6434, 2877], [6446, 2873], [6461, 2883], [6469, 2870], [6474, 2889], [6503, 2879], [6511, 2901], [6541, 2910], [6549, 2904], [6592, 2923], [6602, 2918], [6613, 2931], [6643, 2907], [6646, 2892], [6666, 2889], [6670, 2876], [6702, 2880], [6683, 2922], [6696, 2957], [6714, 2951], [6710, 2964], [6735, 2957], [6746, 2945], [6769, 2951], [6783, 2933], [6809, 2939], [6824, 2916], [6832, 2917], [6840, 2892], [6855, 2903], [6892, 2909], [6899, 2904], [6888, 2888], [6895, 2871], [6909, 2861], [6918, 2841], [6925, 2807], [6939, 2798], [6926, 2787], [6927, 2766], [6936, 2758], [6936, 2732], [6943, 2726], [6952, 2691], [6981, 2677], [6981, 2662], [6953, 2657], [6944, 2648], [6926, 2654], [6916, 2635], [6916, 2635], [6916, 2628], [6916, 2628], [6898, 2605], [6903, 2580], [6890, 2583], [6851, 2559], [6857, 2537], [6842, 2519], [6817, 2516], [6803, 2523], [6785, 2514], [6760, 2492], [6753, 2498], [6714, 2484], [6696, 2474], [6695, 2490], [6667, 2502], [6644, 2478], [6657, 2477], [6651, 2454], [6629, 2464], [6611, 2461], [6602, 2481], [6579, 2481], [6581, 2492], [6543, 2481], [6540, 2467], [6507, 2439], [6480, 2437], [6476, 2453], [6480, 2478], [6472, 2483], [6431, 2453], [6450, 2450], [6441, 2437], [6453, 2428], [6452, 2415], [6426, 2407], [6422, 2426], [6410, 2441], [6373, 2428], [6364, 2430], [6364, 2430], [6335, 2419], [6335, 2419], [6332, 2419], [6317, 2420], [6303, 2406], [6270, 2471], [6259, 2469], [6272, 2426], [6249, 2413], [6257, 2400], [6234, 2355], [6233, 2331], [6210, 2310], [6186, 2299], [6169, 2281], [6137, 2322], [6125, 2324], [6126, 2293], [6106, 2273], [6075, 2291], [6045, 2255], [6018, 2255], [6001, 2265], [5996, 2250], [5959, 2243], [5950, 2263], [5917, 2257], [5899, 2237], [5915, 2228], [5870, 2212], [5870, 2222], [5845, 2220], [5842, 2206], [5780, 2199], [5754, 2182], [5760, 2198], [5713, 2190], [5685, 2175], [5658, 2175], [5622, 2140], [5579, 2136], [5571, 2121], [5552, 2115], [5527, 2090], [5531, 2065], [5570, 2053], [5570, 2023], [5586, 2022], [5602, 1976], [5601, 1965], [5581, 1940], [5559, 1929], [5510, 1921], [5503, 1930], [5467, 1923], [5468, 1944], [5457, 1957], [5463, 1979], [5453, 1983], [5444, 2011], [5434, 2012], [5432, 2034], [5417, 2076], [5423, 2127], [5442, 2147], [5441, 2174], [5464, 2177], [5470, 2194], [5448, 2198]]], [[[6963, 2626], [6931, 2629], [6968, 2644], [6963, 2626]]], [[[6087, 2250], [6077, 2238], [6079, 2217], [6061, 2222], [6072, 2234], [6056, 2237], [6082, 2258], [6087, 2250]]], [[[6039, 2223], [6021, 2226], [6048, 2245], [6039, 2223]]], [[[5593, 2110], [5607, 2106], [5601, 2076], [5588, 2089], [5562, 2090], [5531, 2080], [5534, 2091], [5554, 2113], [5593, 2110]]], [[[5595, 2125], [5581, 2133], [5623, 2139], [5612, 2113], [5595, 2125]]], [[[6905, 2039], [6929, 2040], [6940, 2018], [6925, 1999], [6901, 2001], [6922, 2007], [6927, 2032], [6905, 2039]]], [[[5614, 2061], [5604, 2072], [5612, 2081], [5624, 2074], [5614, 2061]]], [[[6731, 2109], [6752, 2112], [6757, 2097], [6741, 2095], [6731, 2109]]]]
                    },
                    "id": "CN.440000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 450000,
                        "name": "广西",
                        "center": [108.320004, 22.82402],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 19,
                        "fullname": "广西壮族自治区",
                        "filename": "guangxi",
                        "parent": "中国",
                        "areacode": 450000,
                        "longitude": 108.320004,
                        "latitude": 22.82402,
                        "cp": [5153, 2512],
                        "drilldown": "guangxi"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5923, 2920], [5910, 2916], [5905, 2888], [5919, 2874], [5914, 2860], [5929, 2841], [5923, 2822], [5904, 2807], [5892, 2807], [5891, 2780], [5904, 2753], [5877, 2731], [5877, 2713], [5847, 2719], [5837, 2695], [5847, 2693], [5836, 2676], [5810, 2674], [5808, 2653], [5791, 2639], [5781, 2599], [5788, 2581], [5785, 2553], [5796, 2542], [5782, 2527], [5780, 2510], [5748, 2477], [5718, 2475], [5717, 2457], [5659, 2444], [5645, 2397], [5660, 2380], [5647, 2380], [5630, 2364], [5627, 2348], [5612, 2359], [5597, 2348], [5582, 2362], [5568, 2332], [5568, 2332], [5569, 2330], [5569, 2330], [5575, 2291], [5536, 2294], [5536, 2294], [5520, 2295], [5505, 2286], [5483, 2283], [5481, 2259], [5472, 2240], [5440, 2234], [5448, 2198], [5431, 2200], [5412, 2221], [5397, 2201], [5335, 2194], [5312, 2187], [5293, 2204], [5316, 2217], [5314, 2226], [5272, 2233], [5261, 2241], [5232, 2236], [5225, 2247], [5201, 2255], [5176, 2226], [5147, 2226], [5124, 2216], [5126, 2241], [5098, 2221], [5083, 2230], [5068, 2228], [5048, 2254], [4983, 2242], [4967, 2259], [4950, 2245], [4935, 2277], [4921, 2271], [4889, 2295], [4874, 2300], [4885, 2320], [4872, 2327], [4819, 2343], [4807, 2341], [4815, 2358], [4807, 2383], [4813, 2388], [4807, 2416], [4786, 2420], [4787, 2446], [4799, 2477], [4819, 2470], [4832, 2506], [4848, 2518], [4801, 2549], [4751, 2536], [4734, 2539], [4719, 2564], [4681, 2569], [4675, 2557], [4654, 2558], [4621, 2588], [4590, 2590], [4585, 2617], [4583, 2631], [4618, 2655], [4620, 2664], [4645, 2686], [4661, 2689], [4682, 2671], [4712, 2696], [4708, 2705], [4717, 2731], [4714, 2747], [4725, 2753], [4699, 2813], [4676, 2822], [4666, 2804], [4628, 2812], [4617, 2805], [4613, 2826], [4593, 2827], [4582, 2803], [4550, 2827], [4537, 2815], [4526, 2826], [4532, 2839], [4521, 2867], [4526, 2880], [4502, 2899], [4502, 2899], [4485, 2897], [4456, 2906], [4434, 2907], [4428, 2880], [4409, 2893], [4388, 2957], [4397, 2973], [4417, 2956], [4439, 2946], [4460, 2957], [4472, 2973], [4500, 2980], [4511, 3008], [4512, 3008], [4515, 3010], [4515, 3010], [4536, 3024], [4549, 3009], [4570, 3011], [4586, 3004], [4595, 2979], [4637, 2968], [4661, 2952], [4684, 2956], [4700, 2934], [4705, 2945], [4732, 2961], [4739, 2981], [4728, 3003], [4743, 3010], [4761, 3008], [4820, 3030], [4840, 3050], [4850, 3046], [4884, 3051], [4887, 3062], [4908, 3068], [4908, 3086], [4899, 3105], [4921, 3120], [4921, 3131], [4954, 3140], [4975, 3107], [4971, 3094], [4991, 3091], [4993, 3068], [5003, 3070], [5000, 3051], [5026, 3058], [5039, 3072], [5046, 3044], [5055, 3054], [5074, 3026], [5107, 3042], [5131, 3045], [5139, 3070], [5138, 3085], [5181, 3116], [5194, 3094], [5205, 3098], [5235, 3063], [5233, 3104], [5250, 3133], [5265, 3135], [5268, 3117], [5302, 3116], [5317, 3106], [5330, 3114], [5319, 3132], [5330, 3152], [5314, 3156], [5304, 3145], [5304, 3145], [5293, 3152], [5312, 3166], [5343, 3168], [5344, 3156], [5383, 3153], [5383, 3176], [5403, 3197], [5398, 3205], [5413, 3219], [5419, 3211], [5444, 3222], [5463, 3208], [5453, 3184], [5478, 3182], [5474, 3208], [5490, 3216], [5500, 3242], [5512, 3253], [5539, 3247], [5531, 3220], [5551, 3214], [5559, 3223], [5569, 3199], [5583, 3202], [5593, 3227], [5623, 3248], [5631, 3271], [5643, 3281], [5672, 3261], [5708, 3268], [5710, 3288], [5739, 3273], [5762, 3273], [5777, 3264], [5774, 3217], [5758, 3194], [5770, 3174], [5789, 3183], [5818, 3174], [5806, 3169], [5808, 3152], [5781, 3141], [5787, 3115], [5778, 3081], [5738, 3045], [5739, 3029], [5716, 3017], [5706, 2991], [5713, 2965], [5736, 2969], [5736, 2989], [5756, 2997], [5772, 3014], [5781, 3004], [5804, 3001], [5803, 2975], [5811, 2964], [5812, 2935], [5802, 2910], [5830, 2900], [5855, 2930], [5908, 2927], [5923, 2920]]], [[[4512, 3008], [4511, 3008], [4515, 3010], [4515, 3010], [4512, 3008]]]]
                    },
                    "id": "CN.450000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 460000,
                        "name": "海南",
                        "center": [110.33119, 20.031971],
                        "childrenNum": 19,
                        "level": "province",
                        "subFeatureIndex": 20,
                        "fullname": "海南省",
                        "filename": "hainan",
                        "parent": "中国",
                        "areacode": 460000,
                        "longitude": 110.33119,
                        "latitude": 20.031971,
                        "cp": [5554, 1878],
                        "drilldown": "hainan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5322, 1847], [5337, 1859], [5378, 1847], [5397, 1872], [5424, 1878], [5434, 1870], [5477, 1872], [5507, 1878], [5515, 1889], [5546, 1884], [5552, 1895], [5595, 1887], [5603, 1894], [5636, 1902], [5641, 1886], [5667, 1871], [5688, 1871], [5708, 1785], [5676, 1769], [5659, 1747], [5635, 1731], [5610, 1681], [5600, 1600], [5583, 1593], [5582, 1570], [5546, 1569], [5529, 1562], [5501, 1540], [5494, 1516], [5480, 1508], [5458, 1512], [5429, 1505], [5421, 1472], [5385, 1462], [5337, 1479], [5323, 1491], [5291, 1493], [5287, 1505], [5250, 1504], [5239, 1526], [5197, 1535], [5188, 1545], [5193, 1586], [5179, 1617], [5190, 1641], [5182, 1691], [5186, 1720], [5199, 1742], [5220, 1747], [5282, 1794], [5308, 1819], [5306, 1831], [5322, 1847]]]]
                    },
                    "id": "CN.460000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 500000,
                        "name": "重庆",
                        "center": [106.504962, 29.533155],
                        "childrenNum": 38,
                        "level": "province",
                        "subFeatureIndex": 21,
                        "fullname": "重庆市",
                        "filename": "chongqing",
                        "parent": "中国",
                        "areacode": 500000,
                        "longitude": 106.504962,
                        "latitude": 29.533155,
                        "cp": [4849, 4026],
                        "drilldown": "chongqing"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5366, 4242], [5371, 4257], [5343, 4254], [5310, 4224], [5297, 4225], [5287, 4247], [5263, 4221], [5235, 4227], [5229, 4201], [5241, 4197], [5264, 4173], [5260, 4150], [5249, 4128], [5254, 4115], [5248, 4089], [5219, 4081], [5229, 4074], [5231, 4057], [5244, 4050], [5265, 4084], [5277, 4079], [5281, 4044], [5299, 4031], [5311, 4036], [5323, 4016], [5316, 3987], [5326, 3985], [5323, 3961], [5361, 3967], [5360, 3935], [5383, 3912], [5400, 3895], [5383, 3859], [5383, 3835], [5394, 3828], [5374, 3795], [5394, 3801], [5397, 3791], [5388, 3772], [5371, 3767], [5362, 3740], [5348, 3718], [5348, 3703], [5337, 3712], [5332, 3699], [5316, 3712], [5286, 3712], [5277, 3728], [5285, 3733], [5289, 3759], [5276, 3777], [5262, 3767], [5271, 3759], [5266, 3740], [5255, 3738], [5250, 3785], [5262, 3804], [5248, 3814], [5229, 3807], [5202, 3819], [5213, 3840], [5207, 3850], [5208, 3876], [5193, 3912], [5190, 3901], [5153, 3913], [5144, 3902], [5126, 3902], [5113, 3886], [5097, 3906], [5103, 3926], [5092, 3941], [5081, 3928], [5059, 3931], [5056, 3946], [5039, 3937], [5023, 3941], [5024, 3920], [5014, 3901], [5028, 3886], [5016, 3865], [4983, 3849], [4978, 3875], [4952, 3878], [4937, 3869], [4937, 3856], [4937, 3856], [4925, 3860], [4904, 3849], [4915, 3834], [4911, 3819], [4885, 3804], [4886, 3784], [4864, 3794], [4850, 3790], [4866, 3820], [4853, 3850], [4832, 3866], [4840, 3830], [4835, 3801], [4818, 3811], [4813, 3801], [4800, 3830], [4791, 3870], [4777, 3892], [4753, 3890], [4752, 3900], [4738, 3904], [4721, 3892], [4697, 3912], [4687, 3974], [4652, 3975], [4635, 3988], [4636, 4011], [4627, 4020], [4627, 4020], [4616, 4019], [4610, 4043], [4630, 4068], [4649, 4068], [4669, 4083], [4679, 4105], [4696, 4103], [4696, 4122], [4707, 4143], [4694, 4148], [4675, 4168], [4675, 4169], [4675, 4170], [4673, 4170], [4671, 4182], [4673, 4181], [4687, 4182], [4685, 4202], [4703, 4196], [4703, 4196], [4703, 4212], [4719, 4234], [4736, 4225], [4766, 4220], [4779, 4205], [4792, 4204], [4793, 4187], [4808, 4178], [4809, 4181], [4842, 4189], [4847, 4201], [4847, 4201], [4878, 4196], [4878, 4196], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4890, 4165], [4898, 4137], [4918, 4135], [4918, 4135], [4935, 4133], [4947, 4146], [4948, 4146], [4948, 4146], [4949, 4146], [4962, 4136], [4962, 4136], [4963, 4136], [4963, 4136], [4997, 4173], [5026, 4227], [5059, 4268], [5042, 4291], [5060, 4316], [5085, 4307], [5104, 4320], [5108, 4305], [5126, 4299], [5154, 4324], [5145, 4343], [5167, 4354], [5159, 4369], [5174, 4386], [5177, 4405], [5195, 4420], [5189, 4428], [5202, 4436], [5197, 4455], [5227, 4458], [5237, 4476], [5262, 4492], [5266, 4513], [5230, 4537], [5214, 4562], [5237, 4586], [5252, 4584], [5237, 4608], [5265, 4613], [5295, 4590], [5307, 4590], [5339, 4562], [5356, 4560], [5389, 4536], [5395, 4522], [5410, 4518], [5411, 4499], [5470, 4499], [5498, 4492], [5503, 4470], [5494, 4460], [5520, 4458], [5538, 4447], [5559, 4425], [5575, 4420], [5583, 4361], [5570, 4352], [5572, 4329], [5579, 4327], [5561, 4287], [5547, 4306], [5524, 4310], [5502, 4299], [5464, 4265], [5433, 4244], [5417, 4220], [5418, 4234], [5407, 4253], [5376, 4229], [5368, 4239], [5369, 4240], [5369, 4241], [5369, 4242], [5368, 4243], [5368, 4243], [5367, 4242], [5366, 4242]]], [[[4673, 4170], [4675, 4170], [4675, 4169], [4675, 4168], [4673, 4170]]], [[[5366, 4242], [5367, 4242], [5369, 4240], [5368, 4239], [5366, 4242]]], [[[5368, 4243], [5369, 4242], [5369, 4241], [5368, 4243], [5368, 4243]]], [[[4962, 4136], [4963, 4136], [4963, 4136], [4962, 4136], [4962, 4136]]]]
                    },
                    "id": "CN.500000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 510000,
                        "name": "四川",
                        "center": [104.065735, 30.659462],
                        "childrenNum": 21,
                        "level": "province",
                        "subFeatureIndex": 22,
                        "fullname": "四川省",
                        "filename": "sichuan",
                        "parent": "中国",
                        "areacode": 510000,
                        "longitude": 104.065735,
                        "latitude": 30.659462,
                        "cp": [4385, 4306],
                        "drilldown": "sichuan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4703, 4196], [4703, 4196], [4685, 4202], [4687, 4182], [4673, 4181], [4671, 4183], [4671, 4182], [4671, 4182], [4673, 4170], [4675, 4168], [4694, 4148], [4707, 4143], [4696, 4122], [4696, 4103], [4679, 4105], [4669, 4083], [4649, 4068], [4630, 4068], [4610, 4043], [4616, 4019], [4627, 4020], [4627, 4020], [4636, 4011], [4635, 3988], [4652, 3975], [4687, 3974], [4697, 3912], [4721, 3892], [4738, 3904], [4752, 3900], [4753, 3890], [4777, 3892], [4791, 3870], [4800, 3830], [4813, 3801], [4804, 3792], [4797, 3804], [4760, 3828], [4735, 3858], [4719, 3839], [4717, 3821], [4690, 3827], [4676, 3810], [4664, 3807], [4665, 3763], [4682, 3750], [4702, 3757], [4713, 3741], [4707, 3725], [4729, 3711], [4760, 3723], [4775, 3715], [4798, 3673], [4792, 3661], [4799, 3643], [4768, 3630], [4754, 3636], [4735, 3630], [4687, 3626], [4654, 3616], [4651, 3627], [4632, 3640], [4601, 3637], [4592, 3628], [4586, 3648], [4593, 3651], [4593, 3651], [4580, 3655], [4579, 3671], [4590, 3680], [4588, 3694], [4571, 3694], [4572, 3707], [4547, 3719], [4507, 3678], [4482, 3678], [4447, 3667], [4414, 3694], [4406, 3709], [4425, 3729], [4428, 3764], [4416, 3778], [4402, 3774], [4391, 3798], [4394, 3826], [4406, 3826], [4428, 3844], [4406, 3843], [4369, 3851], [4332, 3846], [4314, 3859], [4311, 3843], [4299, 3830], [4315, 3781], [4283, 3758], [4267, 3772], [4254, 3766], [4232, 3744], [4223, 3726], [4234, 3723], [4238, 3708], [4230, 3670], [4189, 3636], [4189, 3622], [4174, 3622], [4149, 3587], [4125, 3581], [4115, 3590], [4102, 3566], [4106, 3530], [4095, 3506], [4099, 3480], [4116, 3449], [4118, 3408], [4125, 3392], [4111, 3383], [4111, 3358], [4057, 3339], [4043, 3326], [4029, 3337], [4038, 3349], [4024, 3363], [3988, 3350], [3978, 3339], [3957, 3334], [3927, 3304], [3907, 3310], [3907, 3310], [3889, 3315], [3877, 3304], [3865, 3317], [3868, 3328], [3846, 3349], [3833, 3346], [3826, 3359], [3842, 3373], [3838, 3384], [3813, 3409], [3804, 3409], [3794, 3434], [3804, 3432], [3806, 3453], [3819, 3466], [3794, 3461], [3788, 3472], [3798, 3487], [3773, 3503], [3773, 3515], [3749, 3532], [3758, 3570], [3736, 3573], [3731, 3603], [3717, 3634], [3703, 3681], [3690, 3687], [3677, 3712], [3674, 3740], [3665, 3739], [3645, 3717], [3626, 3731], [3600, 3701], [3597, 3735], [3580, 3738], [3578, 3751], [3558, 3774], [3551, 3810], [3576, 3813], [3582, 3838], [3559, 3852], [3564, 3863], [3548, 3876], [3548, 3886], [3514, 3929], [3502, 3935], [3502, 3963], [3483, 3958], [3479, 3942], [3462, 3930], [3445, 3901], [3433, 3902], [3437, 3868], [3420, 3821], [3408, 3832], [3404, 3848], [3385, 3874], [3391, 3915], [3382, 3941], [3380, 3973], [3388, 3997], [3390, 4058], [3385, 4080], [3385, 4136], [3376, 4158], [3386, 4200], [3396, 4218], [3395, 4252], [3386, 4269], [3381, 4394], [3392, 4408], [3382, 4413], [3360, 4443], [3368, 4462], [3356, 4476], [3352, 4492], [3333, 4511], [3343, 4543], [3353, 4541], [3367, 4520], [3392, 4547], [3384, 4561], [3361, 4580], [3333, 4616], [3333, 4630], [3310, 4659], [3318, 4698], [3295, 4726], [3282, 4753], [3284, 4778], [3233, 4815], [3195, 4829], [3161, 4854], [3140, 4875], [3134, 4893], [3136, 4933], [3166, 4937], [3170, 4948], [3162, 4965], [3163, 4979], [3181, 4989], [3192, 5014], [3203, 5014], [3219, 5029], [3196, 5043], [3182, 5045], [3180, 5071], [3160, 5080], [3165, 5096], [3161, 5144], [3174, 5143], [3214, 5155], [3224, 5172], [3219, 5193], [3253, 5209], [3272, 5204], [3272, 5204], [3292, 5183], [3322, 5172], [3358, 5170], [3363, 5145], [3354, 5120], [3364, 5115], [3377, 5090], [3397, 5065], [3389, 5064], [3393, 5043], [3409, 5025], [3406, 5010], [3414, 5001], [3408, 4979], [3424, 4949], [3450, 4931], [3483, 4919], [3493, 4904], [3497, 4880], [3520, 4883], [3552, 4866], [3560, 4852], [3590, 4848], [3598, 4888], [3610, 4885], [3617, 4907], [3630, 4884], [3645, 4878], [3660, 4856], [3661, 4830], [3650, 4818], [3672, 4802], [3684, 4832], [3699, 4825], [3711, 4833], [3731, 4802], [3736, 4788], [3754, 4777], [3766, 4810], [3810, 4789], [3840, 4805], [3855, 4799], [3869, 4813], [3873, 4835], [3853, 4856], [3855, 4874], [3866, 4872], [3865, 4899], [3857, 4921], [3871, 4937], [3893, 4934], [3909, 4908], [3913, 4924], [3928, 4923], [3952, 4892], [3977, 4928], [3961, 4942], [3972, 4967], [3986, 4969], [3988, 4989], [4003, 5003], [4014, 4988], [4019, 4964], [4007, 4952], [4005, 4937], [3983, 4928], [3995, 4908], [3998, 4889], [4013, 4907], [4043, 4909], [4049, 4927], [4068, 4917], [4064, 4936], [4080, 4955], [4105, 4950], [4118, 4959], [4116, 4988], [4097, 4999], [4100, 5024], [4093, 5037], [4082, 5040], [4082, 5058], [4065, 5081], [4084, 5080], [4100, 5085], [4114, 5079], [4124, 5105], [4130, 5101], [4166, 5108], [4156, 5116], [4196, 5143], [4218, 5150], [4230, 5135], [4228, 5125], [4256, 5113], [4265, 5093], [4253, 5084], [4253, 5069], [4263, 5053], [4256, 5033], [4280, 5030], [4292, 5014], [4327, 5025], [4324, 4998], [4345, 5007], [4373, 4990], [4391, 4994], [4424, 4993], [4447, 4974], [4443, 4959], [4454, 4927], [4466, 4910], [4493, 4906], [4468, 4903], [4480, 4857], [4471, 4842], [4488, 4834], [4478, 4822], [4460, 4821], [4460, 4796], [4473, 4792], [4490, 4774], [4514, 4767], [4524, 4753], [4543, 4746], [4563, 4749], [4570, 4736], [4598, 4746], [4614, 4732], [4660, 4750], [4682, 4761], [4670, 4784], [4676, 4803], [4692, 4800], [4702, 4757], [4708, 4751], [4733, 4763], [4753, 4765], [4754, 4777], [4793, 4783], [4805, 4774], [4801, 4761], [4801, 4759], [4819, 4745], [4852, 4737], [4866, 4724], [4898, 4739], [4913, 4739], [4927, 4749], [4944, 4741], [4991, 4740], [4998, 4715], [4992, 4702], [5000, 4688], [5026, 4668], [5037, 4688], [5050, 4699], [5060, 4696], [5063, 4670], [5078, 4662], [5106, 4664], [5111, 4649], [5120, 4650], [5130, 4629], [5162, 4605], [5180, 4624], [5201, 4620], [5215, 4631], [5227, 4622], [5257, 4629], [5265, 4613], [5237, 4608], [5252, 4584], [5237, 4586], [5214, 4562], [5230, 4537], [5266, 4513], [5262, 4492], [5237, 4476], [5227, 4458], [5197, 4455], [5202, 4436], [5189, 4428], [5195, 4420], [5177, 4405], [5174, 4386], [5159, 4369], [5167, 4354], [5145, 4343], [5154, 4324], [5126, 4299], [5108, 4305], [5104, 4320], [5085, 4307], [5060, 4316], [5042, 4291], [5059, 4268], [5026, 4227], [4997, 4173], [4963, 4136], [4962, 4136], [4949, 4146], [4948, 4147], [4948, 4147], [4948, 4146], [4948, 4147], [4948, 4147], [4948, 4147], [4948, 4147], [4948, 4147], [4948, 4146], [4948, 4147], [4948, 4147], [4947, 4146], [4935, 4133], [4918, 4135], [4918, 4135], [4898, 4137], [4890, 4165], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4183], [4878, 4196], [4878, 4196], [4847, 4201], [4847, 4201], [4842, 4189], [4809, 4181], [4809, 4180], [4809, 4180], [4808, 4178], [4793, 4187], [4792, 4204], [4779, 4205], [4766, 4220], [4736, 4225], [4719, 4234], [4703, 4212], [4703, 4196]]], [[[4809, 4181], [4808, 4178], [4809, 4180], [4809, 4180], [4809, 4181]]], [[[4673, 4181], [4671, 4182], [4671, 4182], [4671, 4183], [4673, 4181]]], [[[4949, 4146], [4948, 4146], [4948, 4147], [4949, 4146]]], [[[4948, 4146], [4948, 4146], [4948, 4147], [4948, 4146]]], [[[4948, 4146], [4947, 4146], [4948, 4147], [4948, 4146]]]]
                    },
                    "id": "CN.510000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 520000,
                        "name": "贵州",
                        "center": [106.713478, 26.578343],
                        "childrenNum": 9,
                        "level": "province",
                        "subFeatureIndex": 23,
                        "fullname": "贵州省",
                        "filename": "guizhou",
                        "parent": "中国",
                        "areacode": 520000,
                        "longitude": 106.713478,
                        "latitude": 26.578343,
                        "cp": [4860, 3362],
                        "drilldown": "guizhou"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5426, 3379], [5412, 3382], [5392, 3368], [5401, 3331], [5384, 3308], [5375, 3279], [5386, 3272], [5412, 3282], [5406, 3266], [5415, 3245], [5415, 3245], [5407, 3235], [5413, 3219], [5398, 3205], [5403, 3197], [5383, 3176], [5383, 3153], [5344, 3156], [5343, 3168], [5312, 3166], [5293, 3152], [5304, 3145], [5304, 3145], [5314, 3156], [5330, 3152], [5319, 3132], [5330, 3114], [5317, 3106], [5302, 3116], [5268, 3117], [5265, 3135], [5250, 3133], [5233, 3104], [5235, 3063], [5205, 3098], [5194, 3094], [5181, 3116], [5138, 3085], [5139, 3070], [5131, 3045], [5107, 3042], [5074, 3026], [5055, 3054], [5046, 3044], [5039, 3072], [5026, 3058], [5000, 3051], [5003, 3070], [4993, 3068], [4991, 3091], [4971, 3094], [4975, 3107], [4954, 3140], [4921, 3131], [4921, 3120], [4899, 3105], [4908, 3086], [4908, 3068], [4887, 3062], [4884, 3051], [4850, 3046], [4840, 3050], [4820, 3030], [4761, 3008], [4743, 3010], [4728, 3003], [4739, 2981], [4732, 2961], [4705, 2945], [4700, 2934], [4684, 2956], [4661, 2952], [4637, 2968], [4595, 2979], [4586, 3004], [4570, 3011], [4549, 3009], [4536, 3024], [4515, 3010], [4511, 3008], [4500, 2980], [4472, 2973], [4460, 2957], [4439, 2946], [4417, 2956], [4397, 2973], [4400, 2991], [4438, 3030], [4429, 3044], [4448, 3078], [4462, 3067], [4462, 3088], [4427, 3098], [4429, 3111], [4409, 3122], [4413, 3149], [4388, 3139], [4386, 3165], [4369, 3169], [4365, 3180], [4370, 3205], [4379, 3198], [4394, 3228], [4389, 3237], [4409, 3272], [4431, 3326], [4450, 3338], [4427, 3387], [4413, 3386], [4401, 3416], [4387, 3396], [4340, 3403], [4325, 3375], [4287, 3378], [4268, 3396], [4272, 3425], [4259, 3443], [4275, 3460], [4275, 3478], [4257, 3501], [4249, 3493], [4247, 3515], [4265, 3521], [4307, 3564], [4314, 3586], [4330, 3581], [4330, 3571], [4348, 3560], [4360, 3542], [4400, 3586], [4426, 3571], [4435, 3553], [4447, 3547], [4487, 3555], [4499, 3540], [4540, 3566], [4563, 3559], [4580, 3586], [4574, 3593], [4590, 3607], [4592, 3628], [4601, 3637], [4632, 3640], [4651, 3627], [4654, 3616], [4687, 3626], [4735, 3630], [4754, 3636], [4768, 3630], [4799, 3643], [4792, 3661], [4798, 3673], [4775, 3715], [4760, 3723], [4729, 3711], [4707, 3725], [4713, 3741], [4702, 3757], [4682, 3750], [4665, 3763], [4664, 3807], [4676, 3810], [4690, 3827], [4717, 3821], [4719, 3839], [4735, 3858], [4760, 3828], [4797, 3804], [4804, 3792], [4813, 3801], [4818, 3811], [4835, 3801], [4840, 3830], [4832, 3866], [4853, 3850], [4866, 3820], [4850, 3790], [4864, 3794], [4886, 3784], [4885, 3804], [4911, 3819], [4915, 3834], [4904, 3849], [4925, 3860], [4937, 3856], [4937, 3856], [4937, 3869], [4952, 3878], [4978, 3875], [4983, 3849], [5016, 3865], [5028, 3886], [5014, 3901], [5024, 3920], [5023, 3941], [5039, 3937], [5056, 3946], [5059, 3931], [5081, 3928], [5092, 3941], [5103, 3926], [5097, 3906], [5113, 3886], [5126, 3902], [5144, 3902], [5153, 3913], [5190, 3901], [5193, 3912], [5208, 3876], [5207, 3850], [5213, 3840], [5202, 3819], [5229, 3807], [5248, 3814], [5262, 3804], [5250, 3785], [5255, 3738], [5266, 3740], [5271, 3759], [5262, 3767], [5276, 3777], [5289, 3759], [5285, 3733], [5277, 3728], [5286, 3712], [5316, 3712], [5332, 3699], [5337, 3712], [5348, 3703], [5348, 3718], [5362, 3740], [5371, 3767], [5388, 3772], [5386, 3730], [5409, 3720], [5399, 3703], [5389, 3669], [5405, 3668], [5390, 3651], [5398, 3625], [5395, 3612], [5421, 3588], [5419, 3563], [5387, 3543], [5386, 3532], [5366, 3538], [5354, 3531], [5333, 3500], [5306, 3485], [5299, 3463], [5282, 3459], [5298, 3439], [5339, 3464], [5356, 3452], [5377, 3466], [5407, 3470], [5418, 3466], [5414, 3451], [5427, 3448], [5434, 3423], [5420, 3412], [5422, 3397], [5418, 3399], [5416, 3397], [5423, 3392], [5426, 3379]]], [[[5427, 3377], [5427, 3378], [5431, 3376], [5431, 3376], [5427, 3377]]], [[[5422, 3397], [5423, 3392], [5416, 3397], [5418, 3399], [5422, 3397]]]]
                    },
                    "id": "CN.520000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 530000,
                        "name": "云南",
                        "center": [102.712251, 25.040609],
                        "childrenNum": 16,
                        "level": "province",
                        "subFeatureIndex": 24,
                        "fullname": "云南省",
                        "filename": "yunnan",
                        "parent": "中国",
                        "areacode": 530000,
                        "longitude": 102.712251,
                        "latitude": 25.040609,
                        "cp": [4032, 3066],
                        "drilldown": "yunnan"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4585, 2617], [4566, 2642], [4552, 2649], [4543, 2665], [4523, 2638], [4493, 2639], [4450, 2621], [4432, 2609], [4442, 2577], [4415, 2547], [4382, 2553], [4338, 2521], [4318, 2533], [4319, 2553], [4287, 2550], [4271, 2533], [4260, 2487], [4251, 2484], [4224, 2511], [4189, 2554], [4172, 2533], [4164, 2510], [4145, 2535], [4147, 2547], [4123, 2561], [4113, 2533], [4094, 2527], [4091, 2507], [4069, 2497], [4067, 2484], [4037, 2494], [4028, 2518], [3991, 2546], [3974, 2554], [3966, 2548], [3955, 2565], [3928, 2546], [3934, 2536], [3913, 2519], [3898, 2498], [3900, 2490], [3854, 2502], [3825, 2499], [3815, 2489], [3797, 2517], [3777, 2511], [3765, 2469], [3748, 2461], [3756, 2443], [3751, 2433], [3760, 2408], [3755, 2400], [3774, 2392], [3788, 2366], [3780, 2345], [3786, 2325], [3779, 2313], [3773, 2249], [3790, 2238], [3774, 2215], [3756, 2227], [3741, 2223], [3742, 2236], [3727, 2242], [3697, 2239], [3676, 2230], [3663, 2243], [3668, 2258], [3649, 2284], [3660, 2286], [3666, 2315], [3649, 2346], [3652, 2364], [3628, 2352], [3597, 2347], [3566, 2315], [3529, 2303], [3513, 2306], [3505, 2323], [3487, 2324], [3464, 2311], [3455, 2323], [3440, 2323], [3438, 2341], [3452, 2357], [3437, 2367], [3416, 2369], [3408, 2396], [3423, 2428], [3419, 2447], [3398, 2452], [3397, 2443], [3320, 2473], [3301, 2468], [3265, 2474], [3252, 2486], [3271, 2504], [3283, 2537], [3306, 2558], [3308, 2572], [3297, 2611], [3312, 2615], [3328, 2632], [3330, 2651], [3352, 2648], [3344, 2667], [3347, 2679], [3312, 2697], [3292, 2687], [3261, 2692], [3219, 2723], [3231, 2745], [3222, 2785], [3212, 2783], [3210, 2800], [3225, 2809], [3210, 2852], [3187, 2859], [3194, 2866], [3196, 2891], [3240, 2923], [3236, 2932], [3203, 2931], [3181, 2923], [3170, 2933], [3130, 2931], [3103, 2937], [3079, 2935], [3035, 2922], [3033, 2913], [3006, 2906], [2993, 2892], [2957, 2910], [2981, 2935], [3002, 2947], [3005, 2972], [3013, 2979], [2993, 2996], [3005, 3002], [2998, 3024], [2969, 3022], [2981, 3059], [2985, 3096], [3013, 3110], [3025, 3104], [3031, 3115], [3019, 3139], [3051, 3202], [3064, 3187], [3087, 3206], [3098, 3206], [3119, 3237], [3115, 3249], [3128, 3261], [3125, 3273], [3140, 3269], [3153, 3253], [3171, 3262], [3184, 3281], [3190, 3302], [3207, 3315], [3224, 3303], [3238, 3314], [3236, 3331], [3222, 3342], [3217, 3376], [3230, 3381], [3234, 3367], [3251, 3387], [3240, 3401], [3254, 3424], [3263, 3470], [3270, 3483], [3264, 3501], [3270, 3541], [3268, 3569], [3276, 3580], [3265, 3586], [3265, 3617], [3276, 3647], [3270, 3650], [3269, 3700], [3250, 3699], [3225, 3723], [3219, 3697], [3196, 3693], [3192, 3725], [3184, 3733], [3184, 3760], [3174, 3770], [3182, 3778], [3170, 3802], [3178, 3826], [3175, 3835], [3182, 3849], [3202, 3855], [3193, 3882], [3212, 3886], [3224, 3854], [3224, 3824], [3231, 3821], [3259, 3836], [3272, 3831], [3290, 3844], [3300, 3866], [3288, 3897], [3279, 3903], [3282, 3917], [3276, 3944], [3295, 3958], [3291, 3976], [3294, 4001], [3317, 4016], [3326, 4003], [3326, 3974], [3342, 3968], [3354, 3974], [3345, 3987], [3348, 4007], [3366, 4017], [3360, 4040], [3363, 4057], [3390, 4058], [3388, 3997], [3380, 3973], [3382, 3941], [3391, 3915], [3385, 3874], [3404, 3848], [3408, 3832], [3420, 3821], [3437, 3868], [3433, 3902], [3445, 3901], [3462, 3930], [3479, 3942], [3483, 3958], [3502, 3963], [3502, 3935], [3514, 3929], [3548, 3886], [3548, 3876], [3564, 3863], [3559, 3852], [3582, 3838], [3576, 3813], [3551, 3810], [3558, 3774], [3578, 3751], [3580, 3738], [3597, 3735], [3600, 3701], [3626, 3731], [3645, 3717], [3665, 3739], [3674, 3740], [3677, 3712], [3690, 3687], [3703, 3681], [3717, 3634], [3731, 3603], [3736, 3573], [3758, 3570], [3749, 3532], [3773, 3515], [3773, 3503], [3798, 3487], [3788, 3472], [3794, 3461], [3819, 3466], [3806, 3453], [3804, 3432], [3794, 3434], [3804, 3409], [3813, 3409], [3838, 3384], [3842, 3373], [3826, 3359], [3833, 3346], [3846, 3349], [3868, 3328], [3865, 3317], [3877, 3304], [3889, 3315], [3907, 3310], [3907, 3310], [3927, 3304], [3957, 3334], [3978, 3339], [3988, 3350], [4024, 3363], [4038, 3349], [4029, 3337], [4043, 3326], [4057, 3339], [4111, 3358], [4111, 3383], [4125, 3392], [4118, 3408], [4116, 3449], [4099, 3480], [4095, 3506], [4106, 3530], [4102, 3566], [4115, 3590], [4125, 3581], [4149, 3587], [4174, 3622], [4189, 3622], [4189, 3636], [4230, 3670], [4238, 3708], [4234, 3723], [4223, 3726], [4232, 3744], [4254, 3766], [4267, 3772], [4283, 3758], [4315, 3781], [4299, 3830], [4311, 3843], [4314, 3859], [4332, 3846], [4369, 3851], [4406, 3843], [4428, 3844], [4406, 3826], [4394, 3826], [4391, 3798], [4402, 3774], [4416, 3778], [4428, 3764], [4425, 3729], [4406, 3709], [4414, 3694], [4447, 3667], [4482, 3678], [4507, 3678], [4547, 3719], [4572, 3707], [4571, 3694], [4588, 3694], [4590, 3680], [4579, 3671], [4580, 3655], [4593, 3651], [4593, 3651], [4586, 3648], [4592, 3628], [4590, 3607], [4574, 3593], [4580, 3586], [4563, 3559], [4540, 3566], [4499, 3540], [4487, 3555], [4447, 3547], [4435, 3553], [4426, 3571], [4400, 3586], [4360, 3542], [4348, 3560], [4330, 3571], [4330, 3581], [4314, 3586], [4307, 3564], [4265, 3521], [4247, 3515], [4249, 3493], [4257, 3501], [4275, 3478], [4275, 3460], [4259, 3443], [4272, 3425], [4268, 3396], [4287, 3378], [4325, 3375], [4340, 3403], [4387, 3396], [4401, 3416], [4413, 3386], [4427, 3387], [4450, 3338], [4431, 3326], [4409, 3272], [4389, 3237], [4394, 3228], [4379, 3198], [4370, 3205], [4365, 3180], [4369, 3169], [4386, 3165], [4388, 3139], [4413, 3149], [4409, 3122], [4429, 3111], [4427, 3098], [4462, 3088], [4462, 3067], [4448, 3078], [4429, 3044], [4438, 3030], [4400, 2991], [4397, 2973], [4388, 2957], [4409, 2893], [4428, 2880], [4434, 2907], [4456, 2906], [4485, 2897], [4502, 2899], [4502, 2899], [4526, 2880], [4521, 2867], [4532, 2839], [4526, 2826], [4537, 2815], [4550, 2827], [4582, 2803], [4593, 2827], [4613, 2826], [4617, 2805], [4628, 2812], [4666, 2804], [4676, 2822], [4699, 2813], [4725, 2753], [4714, 2747], [4717, 2731], [4708, 2705], [4712, 2696], [4682, 2671], [4661, 2689], [4645, 2686], [4620, 2664], [4618, 2655], [4583, 2631], [4585, 2617]]]]
                    },
                    "id": "CN.530000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 540000,
                        "name": "西藏",
                        "center": [91.132212, 29.660361],
                        "childrenNum": 7,
                        "level": "province",
                        "subFeatureIndex": 25,
                        "fullname": "西藏自治区",
                        "filename": "xizang",
                        "parent": "中国",
                        "areacode": 540000,
                        "longitude": 91.132212,
                        "latitude": 29.660361,
                        "cp": [1840, 4342],
                        "drilldown": "xizang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[-270, 5806], [-272, 5822], [-242, 5825], [-231, 5816], [-177, 5814], [-146, 5807], [-121, 5808], [-92, 5849], [-77, 5879], [-57, 5893], [-52, 5923], [-34, 5927], [-9, 5941], [-2, 5952], [17, 5949], [4, 5972], [18, 5991], [37, 5998], [54, 5985], [80, 5979], [84, 5966], [113, 5961], [145, 5947], [149, 5962], [163, 5965], [181, 5941], [209, 5943], [230, 5924], [231, 5911], [261, 5904], [274, 5908], [309, 5903], [336, 5916], [337, 5939], [397, 5953], [402, 5974], [421, 5984], [458, 5972], [475, 5956], [487, 5965], [519, 5955], [517, 5912], [529, 5904], [537, 5887], [559, 5888], [596, 5872], [626, 5855], [638, 5859], [676, 5853], [701, 5861], [715, 5845], [727, 5842], [762, 5848], [786, 5857], [789, 5875], [843, 5880], [909, 5900], [928, 5895], [951, 5901], [966, 5878], [1009, 5859], [1019, 5875], [1050, 5881], [1076, 5876], [1099, 5888], [1118, 5916], [1132, 5926], [1134, 5949], [1175, 5959], [1198, 5955], [1234, 5958], [1244, 5967], [1265, 5965], [1269, 5956], [1291, 5963], [1318, 5956], [1329, 5966], [1350, 5966], [1362, 5977], [1380, 5972], [1380, 5959], [1398, 5953], [1429, 5958], [1470, 5955], [1478, 5962], [1505, 5955], [1527, 5961], [1549, 5955], [1569, 5958], [1588, 5950], [1594, 5932], [1620, 5905], [1626, 5915], [1649, 5917], [1655, 5906], [1679, 5893], [1682, 5885], [1703, 5893], [1712, 5877], [1728, 5873], [1746, 5852], [1785, 5833], [1770, 5825], [1739, 5823], [1729, 5830], [1727, 5800], [1747, 5784], [1793, 5774], [1780, 5754], [1778, 5718], [1764, 5706], [1770, 5692], [1757, 5679], [1720, 5672], [1723, 5653], [1706, 5643], [1715, 5621], [1728, 5611], [1717, 5574], [1732, 5559], [1743, 5565], [1764, 5558], [1770, 5536], [1755, 5523], [1742, 5522], [1738, 5506], [1750, 5497], [1749, 5457], [1743, 5443], [1754, 5428], [1744, 5420], [1738, 5393], [1705, 5380], [1699, 5370], [1707, 5348], [1723, 5324], [1731, 5323], [1747, 5304], [1740, 5293], [1757, 5278], [1750, 5261], [1753, 5247], [1766, 5240], [1766, 5226], [1794, 5211], [1806, 5183], [1818, 5170], [1834, 5169], [1871, 5133], [1889, 5126], [1927, 5121], [1927, 5121], [1950, 5107], [1977, 5119], [2007, 5097], [2021, 5105], [2034, 5087], [2070, 5060], [2090, 5049], [2099, 5028], [2137, 5038], [2150, 5021], [2143, 5007], [2153, 4998], [2173, 5005], [2225, 4988], [2236, 4997], [2271, 4976], [2299, 4982], [2305, 4955], [2339, 4959], [2362, 4925], [2378, 4930], [2386, 4910], [2407, 4918], [2415, 4929], [2446, 4920], [2452, 4900], [2471, 4902], [2503, 4886], [2517, 4903], [2551, 4901], [2557, 4916], [2585, 4914], [2602, 4929], [2629, 4898], [2633, 4882], [2649, 4877], [2652, 4864], [2666, 4863], [2683, 4853], [2710, 4852], [2717, 4840], [2684, 4838], [2684, 4824], [2712, 4835], [2714, 4806], [2721, 4794], [2740, 4800], [2746, 4771], [2725, 4750], [2737, 4720], [2755, 4697], [2770, 4705], [2801, 4694], [2808, 4678], [2825, 4706], [2841, 4704], [2851, 4685], [2868, 4675], [2870, 4652], [2879, 4651], [2890, 4671], [2878, 4691], [2896, 4724], [2922, 4719], [2934, 4683], [2953, 4668], [2961, 4673], [2991, 4655], [3004, 4665], [2992, 4697], [3003, 4704], [2989, 4733], [3022, 4730], [3045, 4739], [3068, 4731], [3103, 4735], [3097, 4760], [3106, 4785], [3120, 4778], [3131, 4789], [3126, 4813], [3118, 4817], [3128, 4830], [3118, 4834], [3142, 4848], [3145, 4838], [3183, 4828], [3195, 4829], [3233, 4815], [3284, 4778], [3282, 4753], [3295, 4726], [3318, 4698], [3310, 4659], [3333, 4630], [3333, 4616], [3361, 4580], [3384, 4561], [3392, 4547], [3367, 4520], [3353, 4541], [3343, 4543], [3333, 4511], [3352, 4492], [3356, 4476], [3368, 4462], [3360, 4443], [3382, 4413], [3392, 4408], [3381, 4394], [3386, 4269], [3395, 4252], [3396, 4218], [3386, 4200], [3376, 4158], [3385, 4136], [3385, 4080], [3390, 4058], [3363, 4057], [3360, 4040], [3366, 4017], [3348, 4007], [3345, 3987], [3354, 3974], [3342, 3968], [3326, 3974], [3326, 4003], [3317, 4016], [3294, 4001], [3291, 3976], [3295, 3958], [3276, 3944], [3282, 3917], [3279, 3903], [3288, 3897], [3300, 3866], [3290, 3844], [3272, 3831], [3259, 3836], [3231, 3821], [3224, 3824], [3224, 3854], [3212, 3886], [3193, 3882], [3202, 3855], [3182, 3849], [3175, 3835], [3166, 3848], [3155, 3847], [3154, 3862], [3134, 3889], [3112, 3883], [3101, 3900], [3103, 3916], [3094, 3929], [3071, 3936], [3057, 3922], [3051, 3903], [3056, 3889], [3043, 3877], [3037, 3884], [3021, 3872], [3011, 3832], [3028, 3821], [3020, 3793], [3004, 3801], [2952, 3768], [2951, 3784], [2937, 3796], [2913, 3802], [2902, 3816], [2883, 3822], [2863, 3849], [2849, 3853], [2843, 3870], [2830, 3866], [2810, 3873], [2808, 3893], [2751, 3893], [2731, 3918], [2690, 3913], [2627, 3887], [2605, 3851], [2549, 3833], [2521, 3817], [2445, 3793], [2396, 3796], [2327, 3742], [2299, 3715], [2294, 3688], [2237, 3671], [2169, 3672], [2144, 3670], [2105, 3682], [2083, 3681], [2061, 3696], [2039, 3699], [2004, 3693], [1944, 3691], [1950, 3714], [1937, 3736], [1938, 3762], [1960, 3783], [1943, 3831], [1910, 3839], [1892, 3835], [1861, 3857], [1862, 3882], [1880, 3906], [1878, 3935], [1854, 3948], [1852, 3963], [1823, 3980], [1809, 3962], [1791, 3964], [1778, 3939], [1750, 3955], [1751, 3967], [1738, 3967], [1723, 3991], [1704, 4001], [1681, 3992], [1667, 4004], [1641, 4007], [1627, 4031], [1614, 4030], [1594, 4044], [1575, 4035], [1565, 4048], [1551, 4048], [1530, 4065], [1514, 4051], [1491, 4053], [1458, 4028], [1436, 3996], [1406, 3983], [1392, 3958], [1380, 3950], [1384, 3936], [1367, 3916], [1381, 3891], [1357, 3875], [1351, 3864], [1334, 3863], [1324, 3878], [1327, 3889], [1308, 3910], [1306, 3947], [1326, 3967], [1339, 4005], [1336, 4042], [1322, 4058], [1305, 4061], [1301, 4071], [1284, 4068], [1280, 4056], [1265, 4059], [1248, 4049], [1218, 4046], [1199, 4053], [1187, 4034], [1133, 4057], [1109, 4032], [1084, 4047], [1057, 4045], [1051, 4055], [1038, 4049], [1023, 4057], [1011, 4051], [991, 4061], [978, 4087], [959, 4092], [948, 4110], [927, 4116], [918, 4133], [907, 4127], [893, 4137], [876, 4106], [862, 4099], [822, 4120], [821, 4164], [794, 4135], [799, 4113], [784, 4110], [765, 4122], [773, 4131], [760, 4149], [755, 4177], [738, 4193], [737, 4226], [730, 4228], [720, 4209], [697, 4222], [675, 4226], [646, 4222], [636, 4237], [617, 4242], [621, 4268], [640, 4283], [645, 4300], [633, 4314], [620, 4316], [601, 4300], [576, 4300], [548, 4320], [542, 4340], [510, 4351], [501, 4380], [468, 4394], [477, 4424], [467, 4430], [473, 4445], [462, 4486], [440, 4491], [425, 4502], [385, 4491], [368, 4476], [348, 4488], [310, 4580], [285, 4597], [277, 4595], [254, 4622], [230, 4623], [213, 4663], [197, 4663], [190, 4692], [178, 4693], [164, 4710], [135, 4730], [121, 4732], [130, 4747], [116, 4770], [120, 4796], [97, 4796], [76, 4811], [55, 4818], [33, 4837], [20, 4836], [15, 4823], [-11, 4836], [-11, 4814], [-22, 4792], [-36, 4783], [-48, 4787], [-47, 4773], [-64, 4756], [-81, 4762], [-89, 4817], [-127, 4842], [-142, 4866], [-156, 4880], [-173, 4881], [-211, 4916], [-230, 4925], [-249, 4922], [-262, 4936], [-272, 4957], [-270, 4976], [-279, 4998], [-290, 4999], [-301, 5021], [-316, 5035], [-332, 5025], [-344, 5052], [-360, 5053], [-359, 5064], [-381, 5058], [-380, 5046], [-401, 5046], [-407, 5063], [-424, 5061], [-438, 5076], [-435, 5102], [-452, 5142], [-458, 5137], [-471, 5156], [-460, 5172], [-470, 5184], [-465, 5196], [-441, 5208], [-454, 5225], [-459, 5252], [-467, 5263], [-448, 5274], [-440, 5286], [-467, 5311], [-477, 5336], [-486, 5339], [-490, 5359], [-470, 5377], [-476, 5395], [-470, 5407], [-480, 5431], [-453, 5443], [-432, 5444], [-407, 5455], [-404, 5432], [-410, 5423], [-407, 5393], [-382, 5363], [-373, 5371], [-355, 5366], [-344, 5387], [-320, 5392], [-305, 5408], [-308, 5427], [-300, 5437], [-312, 5453], [-298, 5487], [-312, 5506], [-311, 5531], [-305, 5541], [-319, 5558], [-323, 5581], [-351, 5611], [-364, 5644], [-358, 5659], [-367, 5674], [-348, 5683], [-349, 5697], [-342, 5740], [-356, 5754], [-352, 5767], [-336, 5764], [-326, 5771], [-300, 5771], [-281, 5805], [-270, 5806]]]]
                    },
                    "id": "CN.540000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 610000,
                        "name": "陕西",
                        "center": [108.948024, 34.263161],
                        "childrenNum": 10,
                        "level": "province",
                        "subFeatureIndex": 26,
                        "fullname": "陕西省",
                        "filename": "shanxi2",
                        "parent": "中国",
                        "areacode": 610000,
                        "longitude": 108.948024,
                        "latitude": 34.263161,
                        "cp": [5364, 5081],
                        "drilldown": "shanxi2"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[5075, 5725], [5075, 5725], [5072, 5747], [5086, 5761], [5073, 5802], [5079, 5835], [5090, 5843], [5092, 5864], [5118, 5886], [5122, 5900], [5144, 5901], [5150, 5922], [5211, 5901], [5218, 5869], [5238, 5862], [5254, 5870], [5270, 5865], [5295, 5867], [5312, 5875], [5327, 5866], [5358, 5872], [5363, 5895], [5363, 5930], [5369, 5943], [5364, 5957], [5378, 5952], [5389, 5926], [5404, 5937], [5415, 5965], [5396, 5981], [5391, 5993], [5414, 6045], [5438, 6065], [5457, 6089], [5473, 6089], [5469, 6107], [5481, 6111], [5501, 6137], [5508, 6130], [5522, 6141], [5533, 6160], [5530, 6171], [5586, 6219], [5633, 6239], [5621, 6280], [5639, 6272], [5665, 6245], [5674, 6261], [5691, 6261], [5704, 6236], [5722, 6235], [5729, 6253], [5758, 6290], [5802, 6307], [5805, 6294], [5789, 6264], [5800, 6255], [5822, 6240], [5806, 6205], [5801, 6184], [5771, 6163], [5776, 6134], [5751, 6080], [5759, 6072], [5750, 6042], [5732, 6039], [5726, 6022], [5710, 6009], [5694, 6006], [5692, 5987], [5681, 5982], [5679, 5945], [5682, 5926], [5695, 5918], [5708, 5891], [5725, 5876], [5715, 5868], [5732, 5857], [5731, 5835], [5721, 5808], [5702, 5805], [5699, 5790], [5711, 5785], [5710, 5770], [5681, 5736], [5663, 5706], [5652, 5710], [5659, 5695], [5657, 5656], [5662, 5644], [5652, 5630], [5671, 5607], [5671, 5585], [5662, 5549], [5665, 5530], [5659, 5511], [5670, 5445], [5677, 5444], [5681, 5403], [5687, 5387], [5670, 5344], [5661, 5337], [5655, 5318], [5645, 5305], [5630, 5246], [5617, 5228], [5612, 5198], [5612, 5170], [5625, 5153], [5638, 5151], [5634, 5132], [5642, 5112], [5642, 5112], [5661, 5090], [5646, 5076], [5648, 5069], [5686, 5049], [5676, 5034], [5690, 4998], [5674, 4987], [5711, 4965], [5728, 4928], [5752, 4914], [5756, 4891], [5756, 4891], [5756, 4891], [5756, 4890], [5750, 4882], [5756, 4858], [5747, 4841], [5716, 4819], [5701, 4817], [5692, 4806], [5672, 4822], [5662, 4842], [5648, 4826], [5600, 4823], [5590, 4834], [5564, 4830], [5530, 4844], [5507, 4841], [5486, 4851], [5470, 4845], [5450, 4824], [5476, 4814], [5498, 4815], [5518, 4803], [5511, 4767], [5554, 4761], [5577, 4747], [5586, 4733], [5585, 4714], [5595, 4702], [5584, 4693], [5571, 4698], [5558, 4683], [5538, 4694], [5519, 4691], [5502, 4699], [5484, 4697], [5485, 4684], [5472, 4676], [5458, 4650], [5456, 4630], [5474, 4611], [5479, 4585], [5472, 4564], [5480, 4552], [5470, 4539], [5480, 4518], [5470, 4499], [5411, 4499], [5410, 4518], [5395, 4522], [5389, 4536], [5356, 4560], [5339, 4562], [5307, 4590], [5295, 4590], [5265, 4613], [5257, 4629], [5227, 4622], [5215, 4631], [5201, 4620], [5180, 4624], [5162, 4605], [5130, 4629], [5120, 4650], [5111, 4649], [5106, 4664], [5078, 4662], [5063, 4670], [5060, 4696], [5050, 4699], [5037, 4688], [5026, 4668], [5000, 4688], [4992, 4702], [4998, 4715], [4991, 4740], [4944, 4741], [4927, 4749], [4913, 4739], [4898, 4739], [4866, 4724], [4852, 4737], [4819, 4745], [4801, 4759], [4801, 4760], [4801, 4761], [4801, 4761], [4805, 4774], [4793, 4783], [4754, 4777], [4753, 4765], [4733, 4763], [4708, 4751], [4702, 4757], [4692, 4800], [4709, 4791], [4737, 4796], [4773, 4815], [4778, 4857], [4785, 4862], [4766, 4870], [4744, 4886], [4741, 4907], [4761, 4904], [4765, 4929], [4788, 4956], [4821, 4952], [4831, 4938], [4854, 4950], [4882, 4951], [4883, 4933], [4899, 4927], [4907, 4941], [4900, 4968], [4889, 4974], [4886, 4991], [4893, 5004], [4878, 5018], [4891, 5033], [4897, 5063], [4914, 5072], [4904, 5105], [4930, 5093], [4941, 5122], [4924, 5132], [4922, 5142], [4893, 5161], [4870, 5159], [4867, 5173], [4888, 5187], [4905, 5210], [4918, 5215], [4905, 5255], [4906, 5270], [4906, 5270], [4922, 5288], [4948, 5289], [4971, 5284], [4984, 5286], [5017, 5269], [5018, 5258], [5036, 5238], [5048, 5234], [5055, 5246], [5099, 5239], [5107, 5252], [5121, 5247], [5153, 5248], [5164, 5256], [5145, 5275], [5133, 5309], [5127, 5314], [5145, 5330], [5167, 5316], [5202, 5314], [5226, 5325], [5238, 5313], [5259, 5319], [5285, 5316], [5309, 5328], [5313, 5348], [5312, 5380], [5297, 5392], [5294, 5417], [5296, 5446], [5291, 5455], [5309, 5471], [5322, 5471], [5334, 5514], [5322, 5541], [5324, 5571], [5318, 5583], [5299, 5593], [5295, 5581], [5279, 5590], [5267, 5613], [5253, 5612], [5241, 5630], [5234, 5616], [5206, 5629], [5206, 5644], [5193, 5639], [5188, 5661], [5154, 5674], [5120, 5682], [5110, 5701], [5078, 5703], [5075, 5725]]], [[[4801, 4759], [4801, 4761], [4801, 4761], [4801, 4760], [4801, 4759]]], [[[5756, 4891], [5756, 4891], [5756, 4891], [5756, 4890], [5756, 4891]]]]
                    },
                    "id": "CN.610000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 620000,
                        "name": "甘肃",
                        "center": [103.823557, 36.058039],
                        "childrenNum": 14,
                        "level": "province",
                        "subFeatureIndex": 27,
                        "fullname": "甘肃省",
                        "filename": "gansu",
                        "parent": "中国",
                        "areacode": 620000,
                        "longitude": 103.823557,
                        "latitude": 36.058039,
                        "cp": [4417, 5540],
                        "drilldown": "gansu"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4906, 5270], [4906, 5270], [4905, 5255], [4918, 5215], [4905, 5210], [4888, 5187], [4867, 5173], [4870, 5159], [4893, 5161], [4922, 5142], [4924, 5132], [4941, 5122], [4930, 5093], [4904, 5105], [4914, 5072], [4897, 5063], [4891, 5033], [4878, 5018], [4893, 5004], [4886, 4991], [4889, 4974], [4900, 4968], [4907, 4941], [4899, 4927], [4883, 4933], [4882, 4951], [4854, 4950], [4831, 4938], [4821, 4952], [4788, 4956], [4765, 4929], [4761, 4904], [4741, 4907], [4744, 4886], [4766, 4870], [4785, 4862], [4778, 4857], [4773, 4815], [4737, 4796], [4709, 4791], [4692, 4800], [4676, 4803], [4670, 4784], [4682, 4761], [4660, 4750], [4614, 4732], [4598, 4746], [4570, 4736], [4563, 4749], [4543, 4746], [4524, 4753], [4514, 4767], [4490, 4774], [4473, 4792], [4460, 4796], [4460, 4821], [4478, 4822], [4488, 4834], [4471, 4842], [4480, 4857], [4468, 4903], [4493, 4906], [4466, 4910], [4454, 4927], [4443, 4959], [4447, 4974], [4424, 4993], [4391, 4994], [4373, 4990], [4345, 5007], [4324, 4998], [4327, 5025], [4292, 5014], [4280, 5030], [4256, 5033], [4263, 5053], [4253, 5069], [4253, 5084], [4265, 5093], [4256, 5113], [4228, 5125], [4230, 5135], [4218, 5150], [4196, 5143], [4156, 5116], [4166, 5108], [4130, 5101], [4124, 5105], [4114, 5079], [4100, 5085], [4084, 5080], [4065, 5081], [4082, 5058], [4082, 5040], [4093, 5037], [4100, 5024], [4097, 4999], [4116, 4988], [4118, 4959], [4105, 4950], [4080, 4955], [4064, 4936], [4068, 4917], [4049, 4927], [4043, 4909], [4013, 4907], [3998, 4889], [3995, 4908], [3983, 4928], [4005, 4937], [4007, 4952], [4019, 4964], [4014, 4988], [4003, 5003], [3988, 4989], [3980, 4980], [3959, 4983], [3954, 5023], [3940, 5031], [3916, 5019], [3889, 5031], [3875, 5026], [3882, 5054], [3876, 5068], [3847, 5081], [3816, 5145], [3808, 5151], [3822, 5181], [3837, 5193], [3854, 5192], [3866, 5179], [3900, 5177], [3917, 5157], [3954, 5146], [3971, 5138], [3991, 5113], [4013, 5128], [4033, 5117], [4036, 5130], [4055, 5142], [4057, 5157], [4073, 5151], [4082, 5170], [4090, 5166], [4091, 5166], [4090, 5166], [4091, 5166], [4086, 5180], [4086, 5180], [4078, 5205], [4050, 5214], [4035, 5235], [4039, 5293], [4064, 5299], [4074, 5316], [4099, 5330], [4114, 5332], [4118, 5345], [4136, 5358], [4131, 5375], [4115, 5386], [4124, 5415], [4140, 5408], [4149, 5414], [4162, 5447], [4205, 5424], [4218, 5438], [4199, 5488], [4219, 5508], [4251, 5505], [4256, 5536], [4241, 5557], [4252, 5561], [4262, 5581], [4277, 5583], [4270, 5595], [4235, 5621], [4236, 5621], [4236, 5622], [4235, 5622], [4226, 5648], [4226, 5671], [4199, 5699], [4219, 5723], [4198, 5743], [4194, 5755], [4175, 5767], [4186, 5778], [4184, 5793], [4212, 5795], [4206, 5813], [4181, 5832], [4176, 5847], [4135, 5876], [4119, 5892], [4125, 5906], [4109, 5926], [4110, 5939], [4094, 5951], [4069, 5935], [4065, 5945], [4041, 5956], [4032, 5979], [4007, 5990], [3988, 5974], [3950, 5997], [3905, 6041], [3916, 6066], [3895, 6067], [3883, 6087], [3860, 6095], [3846, 6092], [3834, 6103], [3806, 6115], [3796, 6125], [3794, 6142], [3763, 6163], [3750, 6152], [3766, 6137], [3776, 6113], [3779, 6092], [3768, 6095], [3736, 6124], [3716, 6132], [3687, 6154], [3670, 6172], [3663, 6193], [3652, 6193], [3638, 6221], [3614, 6240], [3589, 6268], [3597, 6279], [3569, 6291], [3547, 6317], [3533, 6318], [3501, 6284], [3478, 6292], [3466, 6311], [3448, 6312], [3439, 6281], [3408, 6259], [3394, 6278], [3363, 6298], [3340, 6308], [3337, 6320], [3284, 6356], [3258, 6371], [3211, 6377], [3219, 6363], [3210, 6354], [3200, 6310], [3207, 6300], [3207, 6260], [3216, 6253], [3213, 6234], [3198, 6228], [3166, 6243], [3161, 6219], [3139, 6216], [3144, 6201], [3129, 6187], [3133, 6157], [3097, 6172], [3073, 6168], [3066, 6148], [3049, 6147], [3030, 6158], [3021, 6156], [2986, 6186], [2984, 6201], [2961, 6217], [2924, 6196], [2888, 6206], [2877, 6203], [2855, 6233], [2828, 6239], [2797, 6232], [2773, 6236], [2745, 6234], [2744, 6253], [2727, 6330], [2638, 6331], [2623, 6340], [2619, 6357], [2641, 6356], [2615, 6382], [2565, 6387], [2531, 6386], [2515, 6395], [2522, 6423], [2512, 6439], [2516, 6451], [2485, 6451], [2479, 6458], [2465, 6453], [2395, 6453], [2379, 6440], [2372, 6446], [2372, 6488], [2410, 6515], [2435, 6546], [2466, 6626], [2484, 6692], [2509, 6726], [2521, 6787], [2627, 6791], [2673, 6789], [2688, 6818], [2688, 6839], [2731, 6890], [2767, 6922], [2836, 6971], [2876, 6974], [2899, 7003], [2951, 7022], [2974, 6970], [2995, 6997], [3029, 7018], [3049, 7024], [3081, 7025], [3116, 7039], [3131, 7052], [3137, 7068], [3129, 7092], [3148, 7106], [3127, 7135], [3134, 7155], [3119, 7163], [3130, 7187], [3146, 7200], [3199, 7224], [3263, 7224], [3303, 7220], [3340, 7225], [3358, 7168], [3431, 6941], [3385, 6902], [3387, 6893], [3440, 6806], [3486, 6763], [3501, 6757], [3495, 6674], [3548, 6695], [3539, 6712], [3558, 6716], [3560, 6697], [3578, 6675], [3578, 6698], [3615, 6713], [3623, 6691], [3634, 6686], [3648, 6702], [3651, 6728], [3721, 6719], [3742, 6737], [3811, 6725], [3819, 6717], [3839, 6677], [3838, 6654], [3823, 6637], [3818, 6574], [3786, 6558], [3770, 6528], [3686, 6491], [3720, 6491], [3746, 6482], [3760, 6463], [3784, 6454], [3799, 6440], [3820, 6434], [3831, 6414], [3831, 6391], [3862, 6382], [3860, 6363], [3882, 6358], [3923, 6359], [3919, 6311], [3921, 6288], [3914, 6270], [3937, 6263], [3937, 6249], [3965, 6254], [3986, 6263], [3979, 6245], [3985, 6225], [4002, 6221], [3996, 6211], [4041, 6186], [4047, 6172], [4062, 6179], [4080, 6171], [4112, 6203], [4138, 6221], [4113, 6248], [4097, 6271], [4181, 6288], [4214, 6301], [4239, 6279], [4312, 6257], [4378, 6307], [4424, 6317], [4470, 6332], [4493, 6329], [4515, 6319], [4505, 6291], [4527, 6255], [4532, 6239], [4522, 6206], [4499, 6197], [4461, 6140], [4376, 6089], [4391, 6059], [4394, 6030], [4363, 6016], [4361, 6004], [4365, 5963], [4415, 5941], [4462, 5887], [4503, 5848], [4523, 5851], [4551, 5854], [4595, 5842], [4600, 5824], [4585, 5818], [4578, 5805], [4585, 5795], [4611, 5804], [4625, 5795], [4641, 5754], [4680, 5741], [4683, 5716], [4693, 5717], [4709, 5695], [4706, 5681], [4686, 5680], [4685, 5657], [4696, 5631], [4703, 5633], [4716, 5608], [4716, 5594], [4729, 5577], [4725, 5560], [4734, 5542], [4701, 5517], [4697, 5484], [4708, 5478], [4723, 5445], [4740, 5442], [4759, 5448], [4775, 5443], [4762, 5436], [4789, 5387], [4794, 5398], [4821, 5393], [4831, 5385], [4829, 5384], [4798, 5378], [4797, 5369], [4828, 5376], [4829, 5377], [4829, 5371], [4831, 5369], [4832, 5370], [4837, 5356], [4850, 5372], [4876, 5331], [4905, 5340], [4912, 5364], [4901, 5390], [4909, 5402], [4902, 5427], [4915, 5438], [4915, 5437], [4915, 5438], [4915, 5438], [4959, 5425], [4983, 5435], [4995, 5449], [4982, 5469], [5002, 5496], [5004, 5516], [4987, 5543], [4987, 5543], [4939, 5561], [4939, 5561], [4921, 5560], [4920, 5591], [4927, 5609], [4905, 5626], [4919, 5633], [4929, 5662], [4929, 5662], [4942, 5671], [4950, 5665], [4956, 5685], [4946, 5715], [4960, 5732], [4949, 5759], [4976, 5751], [4982, 5764], [4982, 5764], [5002, 5749], [5029, 5758], [5040, 5752], [5057, 5758], [5072, 5747], [5075, 5725], [5075, 5725], [5078, 5703], [5110, 5701], [5120, 5682], [5154, 5674], [5188, 5661], [5193, 5639], [5206, 5644], [5206, 5629], [5234, 5616], [5241, 5630], [5253, 5612], [5267, 5613], [5279, 5590], [5295, 5581], [5299, 5593], [5318, 5583], [5324, 5571], [5322, 5541], [5334, 5514], [5322, 5471], [5309, 5471], [5291, 5455], [5296, 5446], [5294, 5417], [5297, 5392], [5312, 5380], [5313, 5348], [5309, 5328], [5285, 5316], [5259, 5319], [5238, 5313], [5226, 5325], [5202, 5314], [5167, 5316], [5145, 5330], [5127, 5314], [5133, 5309], [5145, 5275], [5164, 5256], [5153, 5248], [5121, 5247], [5107, 5252], [5099, 5239], [5055, 5246], [5048, 5234], [5036, 5238], [5018, 5258], [5017, 5269], [4984, 5286], [4971, 5284], [4948, 5289], [4922, 5288], [4906, 5270]]], [[[4831, 5385], [4833, 5385], [4833, 5385], [4831, 5379], [4829, 5377], [4828, 5376], [4829, 5384], [4831, 5385]]], [[[4831, 5369], [4829, 5371], [4829, 5377], [4831, 5379], [4831, 5377], [4831, 5375], [4832, 5370], [4831, 5369]]], [[[4236, 5622], [4236, 5621], [4235, 5621], [4235, 5622], [4236, 5622]]], [[[4915, 5438], [4915, 5437], [4915, 5438], [4915, 5438], [4915, 5438]]]]
                    },
                    "id": "CN.620000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 630000,
                        "name": "青海",
                        "center": [101.778916, 36.623178],
                        "childrenNum": 8,
                        "level": "province",
                        "subFeatureIndex": 28,
                        "fullname": "青海省",
                        "filename": "qinghai",
                        "parent": "中国",
                        "areacode": 630000,
                        "longitude": 101.778916,
                        "latitude": 36.623178,
                        "cp": [4044, 5697],
                        "drilldown": "qinghai"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[1927, 5121], [1927, 5121], [1889, 5126], [1871, 5133], [1834, 5169], [1818, 5170], [1806, 5183], [1794, 5211], [1766, 5226], [1766, 5240], [1753, 5247], [1750, 5261], [1757, 5278], [1740, 5293], [1747, 5304], [1731, 5323], [1723, 5324], [1707, 5348], [1699, 5370], [1705, 5380], [1738, 5393], [1744, 5420], [1754, 5428], [1743, 5443], [1749, 5457], [1750, 5497], [1738, 5506], [1742, 5522], [1755, 5523], [1770, 5536], [1764, 5558], [1743, 5565], [1732, 5559], [1717, 5574], [1728, 5611], [1715, 5621], [1706, 5643], [1723, 5653], [1720, 5672], [1757, 5679], [1770, 5692], [1764, 5706], [1778, 5718], [1780, 5754], [1793, 5774], [1747, 5784], [1727, 5800], [1729, 5830], [1739, 5823], [1770, 5825], [1785, 5833], [1827, 5820], [1828, 5835], [1841, 5842], [1850, 5861], [1871, 5854], [1866, 5847], [1885, 5834], [1920, 5822], [1938, 5822], [1963, 5815], [1982, 5801], [1992, 5784], [2008, 5784], [2021, 5801], [2041, 5793], [2048, 5799], [2045, 5842], [2037, 5849], [2045, 5873], [2045, 5896], [1992, 5917], [1993, 5946], [2000, 5973], [2025, 5989], [2049, 5985], [2089, 6006], [2111, 6000], [2111, 6035], [2096, 6047], [2099, 6064], [2090, 6076], [2088, 6105], [2081, 6115], [2063, 6116], [2047, 6132], [2052, 6141], [2035, 6161], [1991, 6186], [2006, 6296], [2013, 6322], [1981, 6322], [1977, 6307], [1964, 6310], [1942, 6338], [1942, 6370], [1980, 6370], [1999, 6365], [2009, 6379], [2037, 6384], [2041, 6400], [2080, 6395], [2169, 6402], [2196, 6412], [2277, 6418], [2295, 6426], [2333, 6428], [2351, 6436], [2373, 6432], [2379, 6440], [2395, 6453], [2465, 6453], [2479, 6458], [2485, 6451], [2516, 6451], [2512, 6439], [2522, 6423], [2515, 6395], [2531, 6386], [2565, 6387], [2615, 6382], [2641, 6356], [2619, 6357], [2623, 6340], [2638, 6331], [2727, 6330], [2744, 6253], [2745, 6234], [2773, 6236], [2797, 6232], [2828, 6239], [2855, 6233], [2877, 6203], [2888, 6206], [2924, 6196], [2961, 6217], [2984, 6201], [2986, 6186], [3021, 6156], [3030, 6158], [3049, 6147], [3066, 6148], [3073, 6168], [3097, 6172], [3133, 6157], [3129, 6187], [3144, 6201], [3139, 6216], [3161, 6219], [3166, 6243], [3198, 6228], [3213, 6234], [3216, 6253], [3207, 6260], [3207, 6300], [3200, 6310], [3210, 6354], [3219, 6363], [3211, 6377], [3258, 6371], [3284, 6356], [3337, 6320], [3340, 6308], [3363, 6298], [3394, 6278], [3408, 6259], [3439, 6281], [3448, 6312], [3466, 6311], [3478, 6292], [3501, 6284], [3533, 6318], [3547, 6317], [3569, 6291], [3597, 6279], [3589, 6268], [3614, 6240], [3638, 6221], [3652, 6193], [3663, 6193], [3670, 6172], [3687, 6154], [3716, 6132], [3736, 6124], [3768, 6095], [3779, 6092], [3776, 6113], [3766, 6137], [3750, 6152], [3763, 6163], [3794, 6142], [3796, 6125], [3806, 6115], [3834, 6103], [3846, 6092], [3860, 6095], [3883, 6087], [3895, 6067], [3916, 6066], [3905, 6041], [3950, 5997], [3988, 5974], [4007, 5990], [4032, 5979], [4041, 5956], [4065, 5945], [4069, 5935], [4094, 5951], [4110, 5939], [4109, 5926], [4125, 5906], [4119, 5892], [4135, 5876], [4176, 5847], [4181, 5832], [4206, 5813], [4212, 5795], [4184, 5793], [4186, 5778], [4175, 5767], [4194, 5755], [4198, 5743], [4219, 5723], [4199, 5699], [4226, 5671], [4226, 5648], [4235, 5622], [4235, 5621], [4270, 5595], [4277, 5583], [4262, 5581], [4252, 5561], [4241, 5557], [4256, 5536], [4251, 5505], [4219, 5508], [4199, 5488], [4218, 5438], [4205, 5424], [4162, 5447], [4149, 5414], [4140, 5408], [4124, 5415], [4115, 5386], [4131, 5375], [4136, 5358], [4118, 5345], [4114, 5332], [4099, 5330], [4074, 5316], [4064, 5299], [4039, 5293], [4035, 5235], [4050, 5214], [4078, 5205], [4086, 5180], [4086, 5180], [4091, 5166], [4090, 5166], [4091, 5166], [4090, 5166], [4082, 5170], [4073, 5151], [4057, 5157], [4055, 5142], [4036, 5130], [4033, 5117], [4013, 5128], [3991, 5113], [3971, 5138], [3954, 5146], [3917, 5157], [3900, 5177], [3866, 5179], [3854, 5192], [3837, 5193], [3822, 5181], [3808, 5151], [3816, 5145], [3847, 5081], [3876, 5068], [3882, 5054], [3875, 5026], [3889, 5031], [3916, 5019], [3940, 5031], [3954, 5023], [3959, 4983], [3980, 4980], [3988, 4989], [3986, 4969], [3972, 4967], [3961, 4942], [3977, 4928], [3952, 4892], [3928, 4923], [3913, 4924], [3909, 4908], [3893, 4934], [3871, 4937], [3857, 4921], [3865, 4899], [3866, 4872], [3855, 4874], [3853, 4856], [3873, 4835], [3869, 4813], [3855, 4799], [3840, 4805], [3810, 4789], [3766, 4810], [3754, 4777], [3736, 4788], [3731, 4802], [3711, 4833], [3699, 4825], [3684, 4832], [3672, 4802], [3650, 4818], [3661, 4830], [3660, 4856], [3645, 4878], [3630, 4884], [3617, 4907], [3610, 4885], [3598, 4888], [3590, 4848], [3560, 4852], [3552, 4866], [3520, 4883], [3497, 4880], [3493, 4904], [3483, 4919], [3450, 4931], [3424, 4949], [3408, 4979], [3414, 5001], [3406, 5010], [3409, 5025], [3393, 5043], [3389, 5064], [3397, 5065], [3377, 5090], [3364, 5115], [3354, 5120], [3363, 5145], [3358, 5170], [3322, 5172], [3292, 5183], [3272, 5204], [3272, 5204], [3253, 5209], [3219, 5193], [3224, 5172], [3214, 5155], [3174, 5143], [3161, 5144], [3165, 5096], [3160, 5080], [3180, 5071], [3182, 5045], [3196, 5043], [3219, 5029], [3203, 5014], [3192, 5014], [3181, 4989], [3163, 4979], [3162, 4965], [3170, 4948], [3166, 4937], [3136, 4933], [3134, 4893], [3140, 4875], [3161, 4854], [3195, 4829], [3183, 4828], [3145, 4838], [3142, 4848], [3118, 4834], [3128, 4830], [3118, 4817], [3126, 4813], [3131, 4789], [3120, 4778], [3106, 4785], [3097, 4760], [3103, 4735], [3068, 4731], [3045, 4739], [3022, 4730], [2989, 4733], [3003, 4704], [2992, 4697], [3004, 4665], [2991, 4655], [2961, 4673], [2953, 4668], [2934, 4683], [2922, 4719], [2896, 4724], [2878, 4691], [2890, 4671], [2879, 4651], [2870, 4652], [2868, 4675], [2851, 4685], [2841, 4704], [2825, 4706], [2808, 4678], [2801, 4694], [2770, 4705], [2755, 4697], [2737, 4720], [2725, 4750], [2746, 4771], [2740, 4800], [2721, 4794], [2714, 4806], [2712, 4835], [2684, 4824], [2684, 4838], [2717, 4840], [2710, 4852], [2683, 4853], [2666, 4863], [2652, 4864], [2649, 4877], [2633, 4882], [2629, 4898], [2602, 4929], [2585, 4914], [2557, 4916], [2551, 4901], [2517, 4903], [2503, 4886], [2471, 4902], [2452, 4900], [2446, 4920], [2415, 4929], [2407, 4918], [2386, 4910], [2378, 4930], [2362, 4925], [2339, 4959], [2305, 4955], [2299, 4982], [2271, 4976], [2236, 4997], [2225, 4988], [2173, 5005], [2153, 4998], [2143, 5007], [2150, 5021], [2137, 5038], [2099, 5028], [2090, 5049], [2070, 5060], [2034, 5087], [2021, 5105], [2007, 5097], [1977, 5119], [1950, 5107], [1927, 5121]]]]
                    },
                    "id": "CN.630000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 640000,
                        "name": "宁夏",
                        "center": [106.278179, 38.46637],
                        "childrenNum": 5,
                        "level": "province",
                        "subFeatureIndex": 29,
                        "fullname": "宁夏回族自治区",
                        "filename": "ningxia",
                        "parent": "中国",
                        "areacode": 640000,
                        "longitude": 106.278179,
                        "latitude": 38.46637,
                        "cp": [4904, 6074],
                        "drilldown": "ningxia"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4831, 5377], [4831, 5379], [4833, 5385], [4833, 5385], [4831, 5385], [4821, 5393], [4794, 5398], [4789, 5387], [4762, 5436], [4775, 5443], [4759, 5448], [4740, 5442], [4723, 5445], [4708, 5478], [4697, 5484], [4701, 5517], [4734, 5542], [4725, 5560], [4729, 5577], [4716, 5594], [4716, 5608], [4703, 5633], [4696, 5631], [4685, 5657], [4686, 5680], [4706, 5681], [4709, 5695], [4693, 5717], [4683, 5716], [4680, 5741], [4641, 5754], [4625, 5795], [4611, 5804], [4585, 5795], [4578, 5805], [4585, 5818], [4600, 5824], [4595, 5842], [4551, 5854], [4523, 5851], [4546, 5859], [4548, 5869], [4619, 5871], [4632, 5877], [4661, 5879], [4678, 5890], [4717, 5904], [4769, 5901], [4775, 5919], [4800, 5923], [4809, 5937], [4809, 5955], [4818, 5969], [4807, 5989], [4808, 6013], [4826, 6038], [4818, 6054], [4831, 6107], [4827, 6118], [4838, 6139], [4837, 6153], [4858, 6172], [4852, 6180], [4869, 6193], [4877, 6220], [4887, 6236], [4912, 6233], [4914, 6262], [4936, 6266], [4954, 6260], [4973, 6284], [4988, 6279], [5000, 6284], [5010, 6269], [5007, 6245], [5017, 6219], [5037, 6206], [5033, 6179], [4986, 6129], [4976, 6102], [4972, 6071], [4962, 6053], [4940, 6037], [4951, 6025], [4991, 6001], [5036, 5986], [5068, 5993], [5093, 5976], [5113, 5953], [5109, 5941], [5122, 5942], [5150, 5922], [5144, 5901], [5122, 5900], [5118, 5886], [5092, 5864], [5090, 5843], [5079, 5835], [5073, 5802], [5086, 5761], [5072, 5747], [5057, 5758], [5040, 5752], [5029, 5758], [5002, 5749], [4982, 5764], [4982, 5764], [4976, 5751], [4949, 5759], [4960, 5732], [4946, 5715], [4956, 5685], [4950, 5665], [4942, 5671], [4929, 5662], [4929, 5662], [4919, 5633], [4905, 5626], [4927, 5609], [4920, 5591], [4921, 5560], [4939, 5561], [4939, 5561], [4987, 5543], [4987, 5543], [5004, 5516], [5002, 5496], [4982, 5469], [4995, 5449], [4983, 5435], [4959, 5425], [4915, 5438], [4915, 5438], [4902, 5427], [4909, 5402], [4901, 5390], [4912, 5364], [4905, 5340], [4876, 5331], [4850, 5372], [4837, 5356], [4832, 5370], [4831, 5375], [4831, 5376], [4831, 5377], [4831, 5377]]], [[[4829, 5384], [4828, 5376], [4797, 5369], [4798, 5378], [4829, 5384]]], [[[4831, 5375], [4831, 5377], [4831, 5377], [4831, 5376], [4831, 5375]]]]
                    },
                    "id": "CN.640000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 650000,
                        "name": "新疆",
                        "center": [87.617733, 43.792818],
                        "childrenNum": 23,
                        "level": "province",
                        "subFeatureIndex": 30,
                        "fullname": "新疆维吾尔自治区",
                        "filename": "xinjiang",
                        "parent": "中国",
                        "areacode": 650000,
                        "longitude": 87.617733,
                        "latitude": 43.792818,
                        "cp": [1697, 7693],
                        "drilldown": "xinjiang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[-270, 5806], [-282, 5821], [-297, 5826], [-319, 5846], [-322, 5862], [-335, 5869], [-346, 5864], [-350, 5881], [-371, 5878], [-370, 5890], [-396, 5903], [-394, 5922], [-404, 5927], [-391, 5963], [-398, 5977], [-392, 5985], [-404, 6002], [-400, 6018], [-411, 6022], [-414, 6049], [-407, 6080], [-378, 6104], [-401, 6109], [-420, 6107], [-436, 6123], [-462, 6113], [-492, 6127], [-515, 6130], [-528, 6150], [-549, 6150], [-568, 6171], [-588, 6176], [-608, 6197], [-622, 6199], [-629, 6223], [-646, 6233], [-649, 6244], [-639, 6260], [-647, 6268], [-685, 6254], [-697, 6261], [-725, 6266], [-717, 6282], [-722, 6309], [-747, 6323], [-745, 6343], [-730, 6346], [-728, 6361], [-719, 6358], [-726, 6387], [-714, 6400], [-720, 6445], [-729, 6465], [-752, 6491], [-784, 6504], [-787, 6495], [-801, 6496], [-804, 6511], [-797, 6551], [-827, 6560], [-845, 6576], [-862, 6582], [-891, 6571], [-893, 6599], [-914, 6598], [-917, 6612], [-945, 6606], [-955, 6619], [-957, 6637], [-944, 6656], [-916, 6648], [-902, 6656], [-890, 6637], [-872, 6636], [-866, 6645], [-828, 6647], [-818, 6666], [-828, 6692], [-834, 6691], [-848, 6708], [-851, 6735], [-824, 6753], [-836, 6774], [-830, 6802], [-839, 6837], [-832, 6889], [-813, 6903], [-810, 6922], [-819, 6937], [-832, 6941], [-843, 6958], [-865, 6972], [-913, 6989], [-926, 6998], [-946, 6980], [-944, 6970], [-974, 6976], [-976, 6987], [-992, 6998], [-993, 7025], [-988, 7037], [-996, 7059], [-978, 7075], [-970, 7067], [-963, 7095], [-978, 7096], [-977, 7115], [-985, 7144], [-999, 7160], [-992, 7178], [-1000, 7188], [-982, 7190], [-976, 7202], [-952, 7195], [-929, 7194], [-907, 7217], [-907, 7251], [-918, 7258], [-913, 7275], [-899, 7282], [-895, 7295], [-879, 7308], [-884, 7312], [-866, 7325], [-822, 7323], [-807, 7311], [-789, 7318], [-759, 7340], [-741, 7340], [-732, 7354], [-696, 7344], [-710, 7373], [-702, 7386], [-689, 7383], [-677, 7369], [-656, 7358], [-649, 7362], [-631, 7354], [-606, 7370], [-591, 7373], [-565, 7387], [-551, 7378], [-556, 7352], [-543, 7339], [-560, 7316], [-558, 7295], [-534, 7301], [-520, 7289], [-503, 7307], [-470, 7299], [-449, 7308], [-444, 7283], [-422, 7290], [-401, 7302], [-394, 7320], [-372, 7333], [-364, 7350], [-366, 7366], [-348, 7376], [-335, 7406], [-318, 7408], [-309, 7418], [-286, 7424], [-271, 7418], [-261, 7402], [-239, 7396], [-225, 7402], [-207, 7387], [-187, 7381], [-142, 7387], [-141, 7405], [-122, 7413], [-111, 7407], [-80, 7414], [-66, 7449], [-38, 7443], [-13, 7444], [11, 7455], [23, 7449], [43, 7466], [58, 7464], [87, 7480], [98, 7479], [122, 7490], [136, 7487], [159, 7503], [164, 7498], [185, 7506], [200, 7500], [218, 7508], [242, 7505], [262, 7531], [275, 7534], [313, 7524], [325, 7533], [319, 7552], [326, 7562], [348, 7565], [352, 7586], [345, 7597], [344, 7614], [358, 7629], [347, 7663], [362, 7676], [374, 7706], [402, 7703], [418, 7710], [437, 7709], [419, 7727], [405, 7750], [447, 7766], [482, 7760], [488, 7801], [474, 7807], [492, 7834], [493, 7846], [469, 7931], [472, 7953], [466, 7975], [470, 7996], [463, 8010], [473, 8042], [474, 8097], [490, 8124], [479, 8151], [462, 8167], [461, 8190], [430, 8184], [429, 8205], [417, 8216], [468, 8242], [484, 8232], [500, 8238], [512, 8230], [531, 8246], [548, 8237], [573, 8244], [600, 8231], [608, 8238], [623, 8235], [641, 8246], [651, 8242], [701, 8245], [725, 8251], [737, 8261], [764, 8262], [780, 8221], [803, 8222], [811, 8209], [844, 8211], [874, 8189], [893, 8196], [901, 8225], [896, 8246], [856, 8282], [858, 8302], [866, 8325], [878, 8337], [886, 8376], [908, 8383], [926, 8424], [978, 8500], [1009, 8564], [1019, 8575], [1039, 8620], [1051, 8631], [1063, 8667], [1086, 8667], [1100, 8649], [1119, 8646], [1125, 8630], [1133, 8632], [1148, 8610], [1179, 8596], [1204, 8577], [1217, 8580], [1230, 8571], [1250, 8577], [1279, 8569], [1289, 8571], [1301, 8559], [1343, 8561], [1358, 8545], [1368, 8519], [1379, 8531], [1396, 8533], [1435, 8559], [1442, 8552], [1480, 8548], [1490, 8568], [1510, 8585], [1513, 8608], [1520, 8624], [1511, 8655], [1514, 8668], [1522, 8783], [1520, 8789], [1537, 8828], [1556, 8844], [1562, 8861], [1581, 8879], [1603, 8880], [1654, 8869], [1670, 8882], [1688, 8876], [1718, 8886], [1732, 8906], [1760, 8928], [1757, 8942], [1771, 8957], [1763, 8970], [1763, 8996], [1783, 9007], [1795, 9026], [1828, 9021], [1833, 9026], [1852, 9012], [1876, 9003], [1883, 8996], [1897, 9001], [1896, 9011], [1951, 9010], [1956, 8993], [1948, 8979], [1958, 8959], [1951, 8952], [1931, 8950], [1926, 8939], [1953, 8902], [1968, 8898], [1976, 8882], [1962, 8867], [1950, 8862], [1962, 8847], [1973, 8844], [1985, 8829], [2012, 8816], [2022, 8797], [2033, 8800], [2047, 8779], [2040, 8765], [2050, 8736], [2071, 8723], [2074, 8715], [2094, 8714], [2112, 8679], [2138, 8673], [2165, 8685], [2197, 8678], [2206, 8645], [2219, 8639], [2221, 8623], [2254, 8620], [2256, 8630], [2277, 8622], [2272, 8600], [2280, 8585], [2311, 8570], [2317, 8535], [2327, 8521], [2324, 8498], [2333, 8490], [2324, 8475], [2332, 8446], [2359, 8388], [2381, 8377], [2388, 8355], [2383, 8342], [2398, 8313], [2387, 8280], [2397, 8273], [2374, 8230], [2358, 8217], [2371, 8167], [2369, 8142], [2334, 8114], [2305, 8078], [2293, 8043], [2289, 8020], [2304, 8004], [2305, 7970], [2317, 7965], [2314, 7943], [2337, 7946], [2358, 7942], [2375, 7921], [2397, 7911], [2411, 7920], [2428, 7898], [2450, 7892], [2470, 7893], [2521, 7886], [2543, 7867], [2556, 7868], [2587, 7857], [2637, 7863], [2655, 7859], [2662, 7851], [2704, 7845], [2747, 7824], [2761, 7826], [2794, 7803], [2795, 7796], [2874, 7737], [2891, 7714], [2894, 7697], [2913, 7693], [2935, 7676], [2952, 7647], [2990, 7631], [2998, 7620], [3069, 7622], [3049, 7559], [3083, 7550], [3095, 7511], [3108, 7446], [3124, 7400], [3125, 7367], [3130, 7354], [3200, 7266], [3199, 7224], [3146, 7200], [3130, 7187], [3119, 7163], [3134, 7155], [3127, 7135], [3148, 7106], [3129, 7092], [3137, 7068], [3131, 7052], [3116, 7039], [3081, 7025], [3049, 7024], [3029, 7018], [2995, 6997], [2974, 6970], [2951, 7022], [2899, 7003], [2876, 6974], [2836, 6971], [2767, 6922], [2731, 6890], [2688, 6839], [2688, 6818], [2673, 6789], [2627, 6791], [2521, 6787], [2509, 6726], [2484, 6692], [2466, 6626], [2435, 6546], [2410, 6515], [2372, 6488], [2372, 6446], [2379, 6440], [2373, 6432], [2351, 6436], [2333, 6428], [2295, 6426], [2277, 6418], [2196, 6412], [2169, 6402], [2080, 6395], [2041, 6400], [2037, 6384], [2009, 6379], [1999, 6365], [1980, 6370], [1942, 6370], [1942, 6338], [1964, 6310], [1977, 6307], [1981, 6322], [2013, 6322], [2006, 6296], [1991, 6186], [2035, 6161], [2052, 6141], [2047, 6132], [2063, 6116], [2081, 6115], [2088, 6105], [2090, 6076], [2099, 6064], [2096, 6047], [2111, 6035], [2111, 6000], [2089, 6006], [2049, 5985], [2025, 5989], [2000, 5973], [1993, 5946], [1992, 5917], [2045, 5896], [2045, 5873], [2037, 5849], [2045, 5842], [2048, 5799], [2041, 5793], [2021, 5801], [2008, 5784], [1992, 5784], [1982, 5801], [1963, 5815], [1938, 5822], [1920, 5822], [1885, 5834], [1866, 5847], [1871, 5854], [1850, 5861], [1841, 5842], [1828, 5835], [1827, 5820], [1785, 5833], [1746, 5852], [1728, 5873], [1712, 5877], [1703, 5893], [1682, 5885], [1679, 5893], [1655, 5906], [1649, 5917], [1626, 5915], [1620, 5905], [1594, 5932], [1588, 5950], [1569, 5958], [1549, 5955], [1527, 5961], [1505, 5955], [1478, 5962], [1470, 5955], [1429, 5958], [1398, 5953], [1380, 5959], [1380, 5972], [1362, 5977], [1350, 5966], [1329, 5966], [1318, 5956], [1291, 5963], [1269, 5956], [1265, 5965], [1244, 5967], [1234, 5958], [1198, 5955], [1175, 5959], [1134, 5949], [1132, 5926], [1118, 5916], [1099, 5888], [1076, 5876], [1050, 5881], [1019, 5875], [1009, 5859], [966, 5878], [951, 5901], [928, 5895], [909, 5900], [843, 5880], [789, 5875], [786, 5857], [762, 5848], [727, 5842], [715, 5845], [701, 5861], [676, 5853], [638, 5859], [626, 5855], [596, 5872], [559, 5888], [537, 5887], [529, 5904], [517, 5912], [519, 5955], [487, 5965], [475, 5956], [458, 5972], [421, 5984], [402, 5974], [397, 5953], [337, 5939], [336, 5916], [309, 5903], [274, 5908], [261, 5904], [231, 5911], [230, 5924], [209, 5943], [181, 5941], [163, 5965], [149, 5962], [145, 5947], [113, 5961], [84, 5966], [80, 5979], [54, 5985], [37, 5998], [18, 5991], [4, 5972], [17, 5949], [-2, 5952], [-9, 5941], [-34, 5927], [-52, 5923], [-57, 5893], [-77, 5879], [-92, 5849], [-121, 5808], [-146, 5807], [-177, 5814], [-231, 5816], [-242, 5825], [-272, 5822], [-270, 5806]]]]
                    },
                    "id": "CN.650000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 710000,
                        "name": "台湾",
                        "center": [121.509062, 25.044332],
                        "childrenNum": 0,
                        "level": "province",
                        "subFeatureIndex": 31,
                        "fullname": "台湾省",
                        "filename": "taiwan",
                        "parent": "中国",
                        "areacode": 710000,
                        "longitude": 121.509062,
                        "latitude": 25.044332,
                        "cp": [7851, 3021]
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[7658, 2432], [7627, 2451], [7606, 2493], [7589, 2555], [7565, 2570], [7581, 2630], [7583, 2666], [7577, 2685], [7577, 2710], [7591, 2734], [7605, 2742], [7611, 2762], [7689, 2915], [7716, 2936], [7729, 2954], [7733, 2976], [7753, 3016], [7790, 3037], [7822, 3046], [7836, 3071], [7854, 3080], [7872, 3078], [7898, 3050], [7933, 3046], [7941, 3023], [7954, 3017], [7922, 2978], [7922, 2956], [7934, 2930], [7934, 2910], [7920, 2867], [7889, 2812], [7893, 2792], [7886, 2772], [7870, 2686], [7863, 2638], [7851, 2609], [7855, 2596], [7844, 2584], [7835, 2552], [7806, 2502], [7778, 2484], [7757, 2406], [7758, 2346], [7750, 2334], [7752, 2315], [7717, 2320], [7705, 2343], [7701, 2390], [7685, 2416], [7658, 2432]]], [[[7485, 2673], [7478, 2662], [7468, 2680], [7491, 2684], [7485, 2673]]], [[[8245, 3200], [8246, 3198], [8245, 3198], [8245, 3198], [8245, 3197], [8243, 3197], [8242, 3197], [8240, 3196], [8240, 3196], [8245, 3200]]], [[[8257, 3195], [8257, 3195], [8256, 3196], [8256, 3196], [8257, 3195]]], [[[8282, 3241], [8283, 3241], [8283, 3240], [8283, 3240], [8282, 3241]]], [[[8259, 3194], [8259, 3194], [8257, 3194], [8257, 3194], [8259, 3194]]], [[[7883, 2363], [7896, 2364], [7901, 2344], [7883, 2363]]], [[[8259, 3194], [8259, 3194], [8259, 3194], [8259, 3194], [8259, 3194]]]]
                    },
                    "id": "CN.710000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 810000,
                        "name": "香港",
                        "center": [114.173355, 22.320048],
                        "childrenNum": 18,
                        "level": "province",
                        "subFeatureIndex": 32,
                        "fullname": "香港特别行政区",
                        "filename": "xianggang",
                        "parent": "中国",
                        "areacode": 810000,
                        "longitude": 114.173355,
                        "latitude": 22.320048,
                        "cp": [6361, 2379],
                        "drilldown": "xianggang"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6332, 2419], [6335, 2419], [6335, 2419], [6364, 2430], [6364, 2430], [6373, 2428], [6373, 2425], [6380, 2428], [6380, 2428], [6382, 2426], [6385, 2424], [6399, 2404], [6409, 2404], [6409, 2404], [6399, 2383], [6392, 2393], [6391, 2374], [6391, 2374], [6377, 2368], [6380, 2352], [6366, 2359], [6350, 2368], [6350, 2379], [6333, 2374], [6331, 2358], [6294, 2350], [6304, 2376], [6329, 2381], [6309, 2389], [6309, 2400], [6332, 2419]]], [[[6398, 2365], [6399, 2367], [6399, 2367], [6398, 2365]]], [[[6392, 2392], [6392, 2392], [6392, 2392], [6392, 2393], [6392, 2392]]], [[[6403, 2379], [6403, 2379], [6403, 2379], [6403, 2379]]]]
                    },
                    "id": "CN.810000"
                }, {
                    "type": "Feature",
                    "properties": {
                        "adcode": 820000,
                        "name": "澳门",
                        "center": [113.54909, 22.198951],
                        "childrenNum": 8,
                        "level": "province",
                        "subFeatureIndex": 33,
                        "fullname": "澳门特别行政区",
                        "filename": "aomen",
                        "parent": "中国",
                        "areacode": 820000,
                        "longitude": 113.54909,
                        "latitude": 22.198951,
                        "cp": [6232, 2352],
                        "drilldown": "aomen"
                    },
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[6234, 2355], [6243, 2337], [6233, 2331], [6234, 2355]]]]
                    },
                    "id": "CN.820000"
                }, {
                    "type": "Feature",
                    "id": "CN.000000",
                    "properties": {
                        "name": "南海诸岛",
                        "fullname": "南海诸岛",
                        "filename": "nanhai",
                        "areacode": "710000",
                        "hc-key": "000000",
                        "hasc": "CN",
                        "parent": "中国",
                        "country": "中国"
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[8400, 2943.3333333333335], [8533.333333333334, 2818.6666666666665], [8685.714285714286, 2807.3333333333335], [8971.42857142857, 2886.6666666666665], [9200, 2988.6666666666665], [9390.47619047619, 2988.6666666666665], [9466.666666666666, 2875.3333333333335], [9523.809523809523, 2988.6666666666665], [9619.047619047618, 2988.6666666666665], [9619.047619047618, 3000], [8495.238095238095, 3000], [8400, 2943.3333333333335]], [[8647.619047619048, 2739.3333333333335], [8761.904761904761, 2762], [8704.761904761905, 2648.6666666666665], [8609.52380952381, 2626], [8647.619047619048, 2739.3333333333335]], [[8628.57142857143, 2478.6666666666665], [8666.666666666666, 2376.6666666666665], [8685.714285714286, 2376.6666666666665], [8647.619047619048, 2478.6666666666665], [8628.57142857143, 2478.6666666666665]], [[8704.761904761905, 2229.333333333333], [8628.57142857143, 2138.6666666666665], [8647.619047619048, 2138.6666666666665], [8742.857142857143, 2229.333333333333], [8704.761904761905, 2229.333333333333]], [[8514.285714285714, 1957.3333333333333], [8552.380952380952, 1866.6666666666667], [8571.42857142857, 1866.6666666666667], [8552.380952380952, 1957.3333333333333], [8514.285714285714, 1957.3333333333333]], [[8838.095238095239, 1662.666666666667], [8952.380952380952, 1708.0000000000002], [8971.42857142857, 1708.0000000000002], [8876.190476190477, 1662.666666666667], [8838.095238095239, 1662.666666666667]], [[9104.761904761905, 1855.3333333333333], [9219.047619047618, 1991.3333333333335], [9238.095238095239, 1991.3333333333335], [9142.857142857143, 1855.3333333333333], [9104.761904761905, 1855.3333333333333]], [[9314.285714285714, 2172.6666666666665], [9371.42857142857, 2263.3333333333335], [9409.52380952381, 2263.3333333333335], [9352.380952380952, 2172.6666666666665], [9314.285714285714, 2172.6666666666665]], [[9371.42857142857, 2433.3333333333335], [9371.42857142857, 2535.3333333333335], [9409.52380952381, 2535.3333333333335], [9409.52380952381, 2433.3333333333335], [9371.42857142857, 2433.3333333333335]], [[9390.47619047619, 2637.3333333333335], [9447.619047619048, 2716.6666666666665], [9466.666666666666, 2716.6666666666665], [9409.52380952381, 2637.3333333333335], [9390.47619047619, 2637.3333333333335]], [[9504.761904761905, 2796], [9580.952380952382, 2886.6666666666665], [9600, 2886.6666666666665], [9542.857142857143, 2796], [9504.761904761905, 2796]], [[8400, 2943.3333333333335], [8400, 1492.6666666666667], [9619.047619047618, 1492.6666666666667], [9619.047619047618, 3000], [9614.285714285714, 3000], [9614.285714285714, 1496.7142857142858], [8404.761904761905, 1496.7142857142858], [8404.761904761905, 2943.3333333333335], [8400, 2943.3333333333335]]]
                    }
                }, {
                    "type": "Feature",
                    "id": "CN.000000",
                    "properties": {
                        "name": "南海诸岛",
                        "fullname": "南海诸岛",
                        "filename": "nanhai",
                        "areacode": "710000",
                        "hc-key": "000000",
                        "hasc": "CN",
                        "parent": "中国",
                        "country": "中国"
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[[8400, 2943.3333333333335], [8533.333333333334, 2818.6666666666665], [8685.714285714286, 2807.3333333333335], [8971.42857142857, 2886.6666666666665], [9200, 2988.6666666666665], [9390.47619047619, 2988.6666666666665], [9466.666666666666, 2875.3333333333335], [9523.809523809523, 2988.6666666666665], [9619.047619047618, 2988.6666666666665], [9619.047619047618, 3000], [8495.238095238095, 3000], [8400, 2943.3333333333335]], [[8647.619047619048, 2739.3333333333335], [8761.904761904761, 2762], [8704.761904761905, 2648.6666666666665], [8609.52380952381, 2626], [8647.619047619048, 2739.3333333333335]], [[8628.57142857143, 2478.6666666666665], [8666.666666666666, 2376.6666666666665], [8685.714285714286, 2376.6666666666665], [8647.619047619048, 2478.6666666666665], [8628.57142857143, 2478.6666666666665]], [[8704.761904761905, 2229.333333333333], [8628.57142857143, 2138.6666666666665], [8647.619047619048, 2138.6666666666665], [8742.857142857143, 2229.333333333333], [8704.761904761905, 2229.333333333333]], [[8514.285714285714, 1957.3333333333333], [8552.380952380952, 1866.6666666666667], [8571.42857142857, 1866.6666666666667], [8552.380952380952, 1957.3333333333333], [8514.285714285714, 1957.3333333333333]], [[8838.095238095239, 1662.666666666667], [8952.380952380952, 1708.0000000000002], [8971.42857142857, 1708.0000000000002], [8876.190476190477, 1662.666666666667], [8838.095238095239, 1662.666666666667]], [[9104.761904761905, 1855.3333333333333], [9219.047619047618, 1991.3333333333335], [9238.095238095239, 1991.3333333333335], [9142.857142857143, 1855.3333333333333], [9104.761904761905, 1855.3333333333333]], [[9314.285714285714, 2172.6666666666665], [9371.42857142857, 2263.3333333333335], [9409.52380952381, 2263.3333333333335], [9352.380952380952, 2172.6666666666665], [9314.285714285714, 2172.6666666666665]], [[9371.42857142857, 2433.3333333333335], [9371.42857142857, 2535.3333333333335], [9409.52380952381, 2535.3333333333335], [9409.52380952381, 2433.3333333333335], [9371.42857142857, 2433.3333333333335]], [[9390.47619047619, 2637.3333333333335], [9447.619047619048, 2716.6666666666665], [9466.666666666666, 2716.6666666666665], [9409.52380952381, 2637.3333333333335], [9390.47619047619, 2637.3333333333335]], [[9504.761904761905, 2796], [9580.952380952382, 2886.6666666666665], [9600, 2886.6666666666665], [9542.857142857143, 2796], [9504.761904761905, 2796]], [[8400, 2943.3333333333335], [8400, 1492.6666666666667], [9619.047619047618, 1492.6666666666667], [9619.047619047618, 3000], [9614.285714285714, 3000], [9614.285714285714, 1496.7142857142858], [8404.761904761905, 1496.7142857142858], [8404.761904761905, 2943.3333333333335], [8400, 2943.3333333333335]]]
                    }
                }],
                "filename": "china",
                "shortName": "中国"
            };


            var mapArray = highCharts.maps['cn/china'];
            //var mappoint = highCharts.geojson(mapArray);


            scope.$on('areaUvData',function(ev,data){
                //console.log(data);

                $timeout(function () {
                    highCharts.Map('orderAreaDataContainer', {
                        chart: {
                            height: 500
                        },
                        title: {
                            text: null
                        },
                        credits: {
                            enabled: false
                        },
                        colorAxis: {
                            min: 1,
                            type: 'logarithmic',
                            minColor: '#000000',
                            maxColor: '#333333',
                            stops: [
                                [0, '#2062e6'],
                                [0.67, '#2062e6'],
                                [1, '#2062e6']
                            ]
                        },
                        legend: {
                            align: 'left',
                            //backgroundColor: (highCharts.theme && highCharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                            floating: true,
                            layout: 'vertical',
                            verticalAlign: 'bottom'
                        },
                        series: [{
                            name: '下单用户数',
                            states: {
                                hover: {
                                    color: '#ffffff'
                                }
                            }
                        }, {
                            data: data,
                            mapData: mapArray,
                            joinBy: ['name', 'name'],
                            name: '下单用户数',
                            showInLegend: false,
                            tooltip: {
                                pointFormat: '{point.name}：{point.value}'
                            },
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}',
                                style: {
                                    fontSize: '8px'
                                }
                            }
                        }]
                    });
                })
            });
        }
    }
}]);

/*
* 来源分析----终端设备分布图表
**/
angular.module('app').directive('devicesDistributeChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('deviceData', function (ev, data) {
                console.log(data[0].iosUv);
                $timeout(function () {
                    highCharts.chart('devicesDistributeContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: null
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (highCharts.theme && highCharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '终端设备访客数占比',
                            data: [
                                ['iOS设备', data[0].iosUv],
                                ['Android设备', data[0].androidUv]
                            ]
                        }]
                    })
                })
            });

        }
    }
}]);

/*
* 来源分析----新老访客分布图表
**/
angular.module('app').directive('customerDistributeChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('deviceOldNewData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('customerDistributeContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            height: 200
                        },
                        title: {
                            text: null
                        },
                        tooltip: {
                            headerFormat: '{series.name}<br>',
                            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '新老访客访问量占比',
                            data: [
                                ['新访客', data[0].newUv],
                                ['老访客', data[0].oldUv]
                            ]
                        }]
                    })
                })
            })
        }
    }
}]);


/*
* 商品分析----商品销售图表
**/
angular.module('app').directive('goodsSalesDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('goodsSalesData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('goodsSalesDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: data.name
                        },
                        xAxis: {
                            type:'category',
                            categories: data.time
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },
                        series: [{
                            name: '商品销售量',
                            data: data.data
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 1920
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    })
                })
            });
        }
    }
}]);

/*
* 交易分析----店铺交易趋势图表
**/
angular.module('app').directive('tradeDataChart', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            scope.$on('tradeData', function (ev, data) {
                $timeout(function () {
                    highCharts.chart('tradeAllDataContainer', {
                        credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: data.name
                        },
                        xAxis: {
                            categories: data.time,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: null
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: '成交订单数(笔)',
                            data: data.data
                        }, {
                            name: '交易额（元）',
                            data: data.trade
                        }]
                    })
                })
            });
        }
    }
}]);

/*
* 上传商品SKU对应图片
* */
angular.module('app').directive('uploadSkuImg', ['$rootScope','Upload', function ( $rootScope,Upload) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            var imgElement=$(el).siblings('.sku-img');
            $(el).find('input[type=file]').on('change',function(ev){
                var skuIndex=$(this).data('index');
                scope.$apply(function(){
                    var fileread = ev.target.files[0];
                    Upload.upload({
                        url: $rootScope.baseURL + 'api/admin/uploadImage',
                        data: {'uploadPath': 'product'},
                        file: fileread
                    }).success(function (data) {
                        if (data.status === 200) {
                            angular.forEach(scope.skuTempTable,function (item,index) {
                                if(skuIndex===index){
                                    console.log(item);
                                    item.picture=data.finalFileName;
                                }
                            });

                            imgElement.attr('src','../'+data.finalFileName);
                        }
                    })
                })
            })
        }
    }
}]);


angular.module('app').directive('testChart', ['$timeout', function ( $timeout) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            var highCharts = require('highcharts');
            $timeout(function () {
                angular.forEach(scope.json,function(item,index){
                    highCharts.chart('testContainer'+index+'', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            spacing : [100, 0 , 40, 0]
                        },
                        title: {
                            floating:true,
                            text: null
                        },
                        credits: {
                            enabled: false   //去掉版权信息，就是右下角显示的highchars的网站链接 也可以显示成
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (highCharts.theme && highCharts.theme.contrastTextColor) || 'black'
                                    }
                                },
                            }
                        },
                        series: [{
                            type: 'pie',
                            innerSize: '80%',
                            name: '市场份额',
                            data: [
                                {name:'Firefox',   y: item.complete},
                                ['IE',       item.total-item.complete],
                            ]
                        }]
                    })
                })
            });
        }
    }
}]);