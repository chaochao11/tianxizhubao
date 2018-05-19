var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');


module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app:'./app/app.js',
        admin:'./admin/app.js'
    },
    output: {
        path: './',
        publicPath: "/",
        filename: 'build/js/[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader:  ExtractTextPlugin.extract("style-loader","css-loader")
            },
            {
                test:  /\.scss$/,
                loader:  "style!css!sass"
            },
            {
                test: /\.(jpe?g|png|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=100&name=./build/images/[name].[ext]'
            },
            {
                test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                loader: 'file-loader?name=./build/fonts/[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            }
        ]
    },
    plugins:[
        //启动浏览器
        new OpenBrowserPlugin({ url: 'http://192.168.0.101:9292/admin/#/main' }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        // new uglily({
        //     output: {
        //         comments: false,
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        //new CommonsChunkPlugin('vendor', './build/js/vendor.bundle.js'),
        new ExtractTextPlugin("./build/css/[name].css"),
        new webpack.HotModuleReplacementPlugin()
    ]
};