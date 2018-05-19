var app = angular.module('app', ['ionic','ui.angularSku','cp.ngConfirm']);

//js
require('./js/js-sdk');
require('./js/city.json');
require('./js/angular-sku');
require('./directive');
require('./router');

//css
require('./css/ionic.css');
require('./css/app.css');
require('./css/cart.css');
require('./css/product.css');
require('./css/user.css');
require('./css/animation.css');
require('../node_modules/swiper/dist/css/swiper.min.css');
require('../node_modules/angular-confirm1/dist/angular-confirm.min.css');
require('../node_modules/minirefresh/dist/minirefresh.min.css');

//controller
require('./controller/base');
require('./controller/main');
require('./controller/cart');
require('./controller/ucenter');
require('./controller/order');
// require('./controller/product');
require('./controller/goods');


//service
require('./service/base');
require('./service/order');
require('./service/main');
require('./service/goods');
require('./service/cart');
require('./service/address');
require('./service/ucenter');

//html
require('../index.html');
require('../app/views/tabs/tabs.html');
require('../app/views/tabs/main.html');
require('../app/views/tabs/category.html');
require('../app/views/tabs/ucenter.html');
require('../app/views/tabs/cart.html');
// require('../app/views/product/list.html');
// require('../app/views/product/details.html');
require('../app/views/intergral/index.html');
require('../app/views/order/tabs.html');
require('../app/views/order/list.html');
require('../app/views/order/details.html');
require('../app/views/order/comment.html');
require('../app/views/goods/list.html');
require('../app/views/goods/details.html');
require('../app/views/goods/order-confirm.html');
require('../app/views/address/index.html');
require('../app/views/address/operate.html');
require('../app/views/phone/bind-phone.html');


//template
require('../app/template/product-sub-nav.html');
require('../app/template/page-loading.html');

//images
require('./images/banner/banner_ad_main@2x.jpg');
require('./images/img/img_product_1@2x.jpg');
require('./images/icon/icon_user_avatar@2x.png');
require('./images/img/img_big_good@2x.jpg');