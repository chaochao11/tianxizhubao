var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglily = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    entry: {
        vendor: [
            'jquery/dist/jquery.min',
            'jquery-mousewheel',
            'angular/angular.min',
            'angular-ui-router/release/angular-ui-router.min',
            'angular-material/angular-material.min',
            'angular-aria/angular-aria.min',
            'angular-animate/angular-animate.min',
            'angular-cookies/angular-cookies.min',
            'angular-messages/angular-messages.min',
            'angular-perfect-scrollbar/src/angular-perfect-scrollbar',
            'ng-file-upload/dist/ng-file-upload.min',
            'wangeditor',
            'js-md5',
            'highcharts-ng'

        ]
    },
    output: {
        path: './',
        publicPath: "/",
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader:  ExtractTextPlugin.extract("style-loader","css-loader")
            },
            {
                test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                loader: 'file-loader?name=./build/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            md5:'js-md5'
        }),
        new uglily({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new CommonsChunkPlugin('vendor', './build/js/admin.vendor.js'),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("./build/css/wangeditor.css")
    ]
};