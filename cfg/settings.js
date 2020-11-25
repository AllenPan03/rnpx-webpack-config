let path = require('path');

var settings = {
    // 环境变量：dev,uat,prd。默认uat
    env: 'uat',
    // src路径，默认从当前执行node命令时候的文件夹地址里找
    srcPath: path.join(process.cwd(), './src'),
    // 构建路径，默认从项目根目录里找
    distPath: path.join(process.cwd(), './dist'),
    // 构建资源路径，默认从distPath目录里找
    assetsPath: path.join(process.cwd(), `./dist`),
    // 后端接口路径
    rpcPath: {},
    // 模块索引规则
    resolve: {
        extensions: ['.web.js', '.js', '.jsx', '.less'],
        alias: {
            api: path.join(path.join(process.cwd(), './src'), 'api'),
            commons: path.join(path.join(process.cwd(), './src'), 'commons'),
            components: path.join(path.join(process.cwd(), './src'), 'components'),
            entries: path.join(path.join(process.cwd(), './src'), 'entries'),
            images: path.join(path.join(process.cwd(), './src'), 'images'),
            sources: path.join(path.join(process.cwd(), './src'), 'sources'),
            styles: path.join(path.join(process.cwd(), './src'), 'styles'),
            views: path.join(path.join(process.cwd(), './src'), 'views')
        }
    },
    // 忽略索引模块
    externals: {},
    // 开发环境配置
    dev: {
        // 开发服务器配置
        devServer: {},
    },
    // 测试生产环境配置
    prd: {
        // 替换资源路径
        assetPath: ""
    },
    // loaders
    loaders: []
}

const get = () => {
    return settings;
}

const set = (options) => {
    if (!options.assetsPath) {
        settings["assetsPath"] = path.join(process.cwd(), `./dist`)
    }
    for (let key in options) {
        if (options[key] instanceof Object && !(options[key] instanceof Array)) {
            settings[key] = Object.assign(settings[key], options[key] || {})
        } else {
            settings[key] = options[key];
        }
    }
}

module.exports = {
    get,
    set
};