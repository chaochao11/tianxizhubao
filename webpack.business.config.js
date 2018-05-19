/*打包所有业务代码*/
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var uglily=require("webpack/lib/optimize/UglifyJsPlugin");


module.exports = {
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
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new uglily({
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }

        }),
        new ExtractTextPlugin("./build/css/[name].css"),
        new webpack.HotModuleReplacementPlugin(),
        // new htmlPlugin({
        //     filename:'build/home/views/main.html',
        //     template:'home/views/main.html'
        // }),
        // new htmlPlugin({
        //     filename:'build/index.html',
        //     template:'index.html'
        // })
    ]
};