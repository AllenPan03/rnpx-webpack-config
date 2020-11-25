let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 基本参数
let baseOption = {}

// 初始化
let init = function (options) {
    baseOption = options;
}

// 获取加载器
let getLoaders = () => {
    return [
        {
            test: /\.css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, 'css-loader', 'postcss-loader']
        },
        {
            test: /\.(ico|mp4|ogg|svg|eot|otf|ttf|woff|woff2)$/,
            loader: 'file-loader'
        },
        {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader?cacheDirectory',
            include: baseOption.srcPath,
            options: {
                plugins: [
                    [
                        'react-css-modules',
                        {
                            generateScopedName: '[local]-[hash:base64:10]',
                            filetypes: {
                                '.less': {
                                    syntax: 'postcss-less'
                                }
                            }
                        }
                    ]
                ]
            }
        },
        {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                name: '[name][hash:base64:5].[ext]',
                limit: 4096
            }
        },
        {
            test: /\.less$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    minimize: true,
                    sourceMap: false
                }
            },
                'postcss-loader',
                'less-loader'
            ],
            exclude: /node_modules/
        },
        {
            test: /\.less$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            },
                'css-loader',
                'postcss-loader',
            {
                loader: 'less-loader',
                options: {
                    "modifyVars": {
                        "@hd": "2px"
                    },
                    javascriptEnabled: true
                }
            }],
            include: /node_modules/,
            exclude: /src/
        }
    ]
}

// 获取插件
let getPlugins = () => {
    let plugins = [];
    plugins.push(
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name]-[hash].css",
            chunkFilename: "[name].css",
        }),
        new webpack.DefinePlugin({
            '__wd_define_env__': JSON.stringify(process.env.GULP_ENV),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(process.cwd(), 'src/index.html'),
            filename: baseOption.filename || 'index.html', // 输出至指定目录
            chunks: ['index', 'vendors'],
            chunksSortMode: 'dependency',
            hash: true,
            inject: true,
            alwaysWriteToDisk: true // 将内存文件写入磁盘
        })
    )
    return plugins;
}

// 基本配置项
let getConfig = () => {
    return {
        entry: {
            'index': [path.resolve(process.cwd(), 'src/index.jsx')],
        },
        output: {
            pathinfo: process.env.GULP_ENV == "prd" ? false : true,
            path: path.resolve(process.cwd(), 'dist'),
            filename: "[name]-[hash].js",
        },
        externals: baseOption.externals,
        resolve: baseOption.resolve,
        module: {
            rules: getLoaders().concat(baseOption.loaders)
        },
        plugins: getPlugins(),
        // 根据不同的策略来分割打包
        optimization: {
            splitChunks: {
                name: true,
                chunks: 'all',
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                    }
                }
            },
            // 清除到代码中无用的js代码
            usedExports: true
        },
    }
}

module.exports = {
    init,
    getConfig
}