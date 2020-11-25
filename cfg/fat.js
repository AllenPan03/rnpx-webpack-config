let webpack = require('webpack');
let settings = require('./settings.js');

// 项目页面路径
let publicPagePath = './';
// 项目资源路径
let publicAssetPath = null;
// 后端接口路径
let publicRpcPath = null;
// 页面列表
let pageListArray = null;

// 基本参数
let baseOption = {}

// 初始化
let init = function (options, pageList) {
    baseOption = options;
    pageListArray = pageList;
    publicRpcPath = baseOption.rpcPath;
    publicAssetPath = baseOption.prd.assetPath;
}

let getConfig = () => {
    return {
        mode: "development",
        performance: {
            hints: false
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]
    }
}

module.exports = {
    getConfig,
    init
};