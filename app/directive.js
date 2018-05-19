/*首页的广告滚动*/
angular.module('app').directive('bannerSlide', function () {
    return {
        restrict: 'AE',
        replace: true,
        link: function (scope, el) {
            var swiper = new Swiper(el, {
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: '.swiper-pagination',
                observer: true,
                observeParents: true
            });
        }
    }
});

/*点击按钮倒计时*/
angular.module('app').directive('countDown',['$interval','ucenterService', function ($interval,ucenterService) {
    return {
        restrict: 'AE',
        replace: true,
        link: function (scope, el) {
            var countDown=5;
            function setTime() {
                if (countDown === 0) {
                    countDown=5;
                    $(el).attr("disabled", false);
                    $(el).text("获取短信验证码");
                } else {
                    $(el).attr("disabled", true);
                    $(el).text(+ countDown + "s后重新获取");
                    countDown--;
                    setTimeout(function(){
                        setTime();
                    },1000)
                }
            }
            $(el).on('click', function () {
                var phoneNum=$('#phoneNum').val();
                ucenterService.getCode(phoneNum).then(function(){
                    setTime();
                    alert('验证码已发送到你的手机')
                },function () {
                    alert('验证码发送失败，请重新尝试！');
                });
            })
        }
    }
}]);

/*产品分类副类展现*/
angular.module('app').directive('accordionCategory', function () {
    return {
        restrict: 'AE',
        replace: true,
        link: function (scope, el) {
            $(el).find('.item').click(function () {
                if ($(this).find('.icon').hasClass('accordion-open')) {
                    $(this).find('.icon').removeClass('accordion-open');
                    $(this).siblings().slideUp();
                } else {
                    $(this).find('.icon').addClass('accordion-open');
                    $(this).siblings().slideDown();
                }
            });
        }
    }
});

/*购物车*/
angular.module('app').directive('itemSelect', function () {
    return {
        restrict: 'AE',
        replace: true,
        link: function (scope, el) {
            $(el).click(function () {
                $(this).toggleClass('item-selected');
            });
        }
    }
});

/*获得空状态下的窗口高度*/
angular.module('app').directive('getWindowHeight', ['$timeout', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            $timeout(function () {
                $(el).height($(document).height() - 88);
            })
        }
    }
}]);

/*产品详情页tab*/
angular.module('app').directive('productSubNav', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/template/product-sub-nav.html',
        controller: "productSubNavCtrl"
    }
});

/*星级评级*/
angular.module('app').directive('ratingLevel', function () {
    return {
        restrict: 'AE',
        replace: true,
        template: '<ul class="rating" ng-mouseleave="leave()"><li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">\u2605</li></ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            readonly: '@',
            onHover: '=',
            onLeave: '='
        },
        controller: function () {

        },
        link: function (scope, el) {

            scope.ratingValue = scope.ratingValue || 0;
            scope.max = scope.max || 5;
            scope.click = function (val) {
                if (scope.readonly && scope.readonly === 'true') {
                    return;
                }
                scope.ratingValue = val;
            };
            scope.over = function (val) {
                scope.onHover(val);
            };
            scope.leave = function () {
                scope.onLeave();
            };

            el.css("text-align", "center");
            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            updateStars();

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
            scope.$watch('max', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});

/*城市区域选择*/
angular.module('app').directive('selectCity', ['$http', '$timeout', '$stateParams', function ($http, $timeout, $stateParams) {
    return {
        restrict: 'AE',
        replace: true,
        link: function (scope, el) {
            var selectedIndex = [];
            var city = [];
            var Picker = require('better-picker');
            var nameEl = document.getElementById('picker');
            var first = [];//省，直辖市
            var second = [];//市
            var third = [];//镇、区
            //获取更新时的数据
            scope.$on('area', function (event, data) {
                selectedIndex = data;
                //nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;
            });

            $http.get('./app/js/city.json').success(function (data) {
                city = data;
            }).finally(function () {
                if ($stateParams.id > 0) {
                    $timeout(function () {
                        angular.forEach(city, function (item, index) {
                            if (parseInt(selectedIndex[0]) === index) {
                                nameEl.innerText = item.name;
                                angular.forEach(item.sub, function (item1, index1) {
                                    if (parseInt(selectedIndex[1]) === index1) {
                                        nameEl.innerText += ' ' + item1.name;
                                        angular.forEach(item1.sub, function (item2, index2) {
                                            if (parseInt(selectedIndex[2]) === index2) {
                                                nameEl.innerText += ' ' + item2.name;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }, 100);
                }

                //如果是新增，初始化省市区的值
                if ($stateParams.id === undefined) {
                    selectedIndex = [0, 0, 0];
                }

                var checked = [0, 0, 0];//已选选项

                function creatList(obj, list) {
                    angular.forEach(obj, function (item, index) {
                        var temp = new Object();
                        temp.text = item.name;
                        temp.value = index;
                        list.push(temp);
                    })
                }

                creatList(city, first);

                if (city[selectedIndex[0]].hasOwnProperty('sub')) {
                    creatList(city[selectedIndex[0]].sub, second);
                } else {
                    second = [{ text: '', value: 0 }];
                }

                if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
                    creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
                } else {
                    third = [{ text: '', value: 0 }];
                }

                var picker = new Picker({
                    data: [first, second, third],
                    selectedIndex: selectedIndex,
                    title: '地址选择'
                });

                picker.on('picker.select', function (selectedVal, selectedIndex) {
                    var text1 = first[selectedIndex[0]].text;
                    var text2 = second[selectedIndex[1]].text;
                    var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
                    nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;
                });

                picker.on('picker.change', function (index, selectedIndex) {
                    if (index === 0) {
                        firstChange();
                    } else if (index === 1) {
                        secondChange();
                    }

                    function firstChange() {
                        second = [];
                        third = [];
                        checked[0] = selectedIndex;
                        var firstCity = city[selectedIndex];
                        if (firstCity.hasOwnProperty('sub')) {
                            creatList(firstCity.sub, second);
                            var secondCity = city[selectedIndex].sub[0];
                            if (secondCity.hasOwnProperty('sub')) {
                                creatList(secondCity.sub, third);
                            } else {
                                third = [{ text: '', value: 0 }];
                                checked[2] = 0;
                            }
                        } else {
                            second = [{ text: '', value: 0 }];
                            third = [{ text: '', value: 0 }];
                            checked[1] = 0;
                            checked[2] = 0;
                        }

                        picker.refillColumn(1, second);
                        picker.refillColumn(2, third);
                        picker.scrollColumn(1, 0);
                        picker.scrollColumn(2, 0);
                    }

                    function secondChange() {
                        third = [];
                        var first_index;
                        checked[1] = selectedIndex;
                        //console.log(second[selectedIndex].text);
                        for (var i = 0; i < city.length; i++) {
                            for (var j = 0; j < city[i].sub.length; j++) {
                                if (second[selectedIndex].text === city[i].sub[j].name) {
                                    first_index = i;
                                }
                            }
                        }
                        //var first_index = checked[0];
                        if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
                            var secondCity = city[first_index].sub[selectedIndex];
                            creatList(secondCity.sub, third);
                            picker.refillColumn(2, third);
                            picker.scrollColumn(2, 0)
                        } else {
                            third = [{ text: '', value: 0 }];
                            checked[2] = 0;
                            picker.refillColumn(2, third);
                            picker.scrollColumn(2, 0)
                        }
                    }

                });

                picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
                    scope.$emit('selectedCity', selectedVal);
                });


                $(el).on('click', function () {
                    picker.show();
                })
            });
        }
    }
}]);

/*搜索商品*/
angular.module('app').directive('bindSearch', ['$state', function ($state) {
    return {
        restrict: 'AE',
        link: function (scope, el) {
            $(el).bind('search', function () {
                var keyword = $(el).val();
                $state.go('index.product-list', { type: 1, condition: keyword, sort: '', pageNo: 1, pageSize: 6 })
            })
        }
    }
}]);