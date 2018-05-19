var app = angular.module('app', [
    'ui.router',
    'ngMessages',
    'ngMaterial',
    'ngAnimate',
    'perfect_scrollbar',
    'ngFileUpload',
    'ngCookies',
    'highcharts-ng'
    // 'angular-flatpickr'
]);

//日期控件本地化
angular.module('app').config(['$mdIconProvider', '$mdDateLocaleProvider', function ($mdIconProvider, $mdDateLocaleProvider) {

    $mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    $mdDateLocaleProvider.shortMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    $mdDateLocaleProvider.days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    $mdDateLocaleProvider.shortDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('YYYY-MM-DD');
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
        var m = moment(dateString, 'YYYY-MM-DD', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };

    //图标全局配置
    $mdIconProvider
        .icon('account', '../build/images/icon_account.svg', 24)
        .icon('logout', '../build/images/icon_logout.svg', 24)
        .icon('password', '../build/images/icon_password.svg', 24)
        .icon('attention', '../build/images/icon_attention.svg', 24)
        .icon('enable', '../build/images/icon_enable.svg', 24)
        .icon('outStock', '../build/images/icon_out_stock.svg', 24)
        .icon('groundingStock', '../build/images/icon_grounding_stock.svg', 24)
        .icon('exportExcel', '../build/images/icon_export_excel.svg', 24)
        .icon('delete', '../build/images/icon_delete.svg', 24)
        .icon('search', '../build/images/icon_search.svg', 24)
        .icon('importGoods', '../build/images/icon_import_goods.svg', 24)
        .icon('refresh', '../build/images/icon_refresh.svg', 24)
        .icon('add', '../build/images/icon_add.svg', 24)
    ;
    $mdIconProvider.fontSet('md', 'material-icons');
}]);

//全局配置highChart配色
var hightCharts = require('highcharts');
hightCharts.setOptions({
    colors: ['#2062e6', '#f4635b', '#f4a947', '#2ea6f0', '#40c897']
});


angular.module('app').factory('adminIntercepter', ["$rootScope", '$cookies', function ($rootScope, $cookies) {
    console.log($cookies.getObject("admin"));
    var adminIntercepter = {
        request: function (config) {
            if ($cookies.getObject("admin") !== undefined) {
                var today = new Date();
                var expireDate = new Date(today);
                expireDate.setMinutes(expireDate.getMinutes() + 30);
                $cookies.putObject("admin", $cookies.getObject("admin"), {'expires': expireDate});
            }
            return config;
        },
        response: function (response) {
            return response;
        }
    };
    return adminIntercepter;
}]);


// angular.module('app').factory('crsf', ["$rootScope", '$cookies','$q', function ($rootScope, $cookies,$q) {
//     var crsf = {
//         request: function (config) {
//             if (config.method.toLocaleLowerCase() === 'get') {
//                 config.headers['X-XSRF-TOKEN'] = $cookies.get('XSRF-TOKEN');
//             }
//                 //config.headers['X-XSRF-TOKEN'] = $cookies.get('XSRF-TOKEN');
//
//             return config;
//         }
//     };
//     return crsf;
// }]);

//css
require('./css/common.css');
require('./css/angular-material.css');
require('./css/reset-material.css');
require('./css/perfect-scrollbar.min.css');
require('./css/material-icons.css');
require('./css/admin.css');
require('./css/wangEditor.css');
require('../node_modules/highcharts-ng/dist/highcharts-ng.css');

//js
require('./router');
require('./directive');

//controller
require('./controller/layout');
require('./controller/auth');
require('./controller/main');
require('./controller/order');
require('./controller/goods');
require('./controller/user');
require('./controller/activity');
require('./controller/shop');
require('./controller/property');
require('./controller/data');

//service
require('./service/auth');
require('./service/base');
require('./service/main');
require('./service/order');
require('./service/goods');
require('./service/category');
require('./service/transport');
require('./service/user');
require('./service/activity');
require('./service/shop');
require('./service/property');
require('./service/data');
require('./service/source');
require('./service/flux');
require('./service/trade');

//template
require('./template/upload-multi-image.html');
require('./template/layout-content.html');


//views
require('./views/auth/login.html');
require('./views/main.html');

require('./views/shop/index.html');
require('./views/shop/main.html');
require('./views/shop/contact.html');
require('./views/shop/employee.html');
require('./views/shop/operate-employee.html');
require('./views/shop/integral.html');
require('./views/shop/operate-integral.html');

require('./views/goods/index.html');
require('./views/goods/list.html');
require('./views/goods/operate.html');
require('./views/goods/attr-list.html');
require('./views/goods/comment-list.html');
require('./views/goods/operate-test.html');

require('./views/user/index.html');
require('./views/user/list.html');

require('./views/order/index.html');
require('./views/order/list.html');
require('./views/order/details.html');

require('./views/activity/index.html');
require('./views/activity/list.html');
require('./views/activity/operate.html');

require('./views/property/index.html');
require('./views/property/income.html');
require('./views/property/trade-list.html');
require('./views/property/bill-list.html');

require('./views/data/index.html');
require('./views/data/main.html');
require('./views/data/flux.html');
require('./views/data/source.html');
require('./views/data/goods.html');
require('./views/data/trade.html');

//picture
require('./images/icon/icon_account.svg');
require('./images/icon/icon_logout.svg');
require('./images/icon/icon_password.svg');
require('./images/icon/icon_upload.svg');
require('./images/icon/icon_attention.svg');
require('./images/logo.png');
require('./images/icon/icon_enable.svg');
require('./images/icon/icon_out_stock.svg');
require('./images/icon/icon_grounding_stock.svg');
require('./images/icon/icon_export_excel.svg');
require('./images/icon/icon_delete.svg');
require('./images/icon/icon_search.svg');
require('./images/icon/icon_import_goods.svg');
require('./images/icon/icon_refresh.svg');
require('./images/icon/icon_add.svg');
