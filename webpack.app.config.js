/*打包微信端第三方框架*/
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglily = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    entry: {
        vendor: [
            // 'jquery/dist/jquery.min',
            'ionic-sdk/release/js/ionic.bundle',
            'angular-ui-router',
            'smartphoto',
            'swiper',
            'dynamics.js',
            'better-picker',
            'angular-confirm1'
            //'vconsole'
        ]
    },
    output: {
        path: './',
        publicPath: "/",
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new uglily({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new CommonsChunkPlugin('vendor', './build/js/app.vendor.js')
    ]
};