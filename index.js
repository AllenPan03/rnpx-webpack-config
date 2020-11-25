let base = require("./cfg/base.js");
let dev = require("./cfg/dev.js");
let fat = require("./cfg/fat.js");
let prd = require("./cfg/prd.js");
let settings = require("./cfg/settings.js");

let webpackCfg = (function () {
    let setOption = function (option) {
        settings.set(option);
    };

    let getConfig = function (option) {
        setOption(option);

        let options = settings.get();
        // webpack基础配置
        base.init(options);
        let baseConfig = base.getConfig();
        // webpack环境配置
        let envConfig = null;
        switch (options.env) {
            case "dev": {
                // webpack开发环境配置
                dev.init(options);
                envConfig = dev.getConfig();
                break;
            };
            case "fat": {
                envConfig = fat.getConfig();
                break;
            };
            case "uat": {
                envConfig = prd.getConfig();
                break;
            };
            case "prd": {
                envConfig = prd.getConfig();
                break;
            };
        }

        // 合并webpack插件
        envConfig.plugins = (envConfig.plugins || []).concat(baseConfig.plugins);

        // 去掉打印信息
        envConfig.stats = {
            entrypoints: false,
            children: false
        }

        // 环境配置覆盖base配置
        return Object.assign(baseConfig, envConfig);
    };

    return {
        setOption,
        getConfig
    }
}())

module.exports = webpackCfg;