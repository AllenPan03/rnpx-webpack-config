let path = require('path');
let webpack = require('webpack');

let devServerProxy = {
  '/proxy/': {
    target: 'https://www.jinlins.com/',
    pathRewrite: {
      '^/proxy/': '/'
    },
    logLevel: 'debug', // 修改 webpack-dev-server 的日志等级
    secure: false, // 忽略检查代理目标的 SSL 证书
    changeOrigin: true, // 修改代理目标请求头中的 host 为目标源
    onProxyReq: (proxyReq, req /*, res*/) => { // 代理目标请求发出前触发
      /**
       * 当代理 POST 请求时 http-proxy-middleware 与 body-parser 有冲突。
       * [Modify Post Parameters](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md)
       * [Edit proxy request/response POST parameters](https://github.com/chimurai/http-proxy-middleware/issues/61)
       * [socket hang up error with nodejs](http://stackoverflow.com/questions/25207333/socket-hang-up-error-with-nodejs)
       */
      let body = req.body;
      let method = req.method.toLowerCase();

      if (body && method == 'post') {
        let contentType = req.get('Content-Type');
        contentType = contentType ? contentType.toLowerCase() : '';

        if (contentType.includes('application/json')) {
          // 使用 application/json 类型提交表单
          let bodyData = JSON.stringify(body);

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          // 使用 application/x-www-form-urlencoded 类型提交表单
          let bodyData = Object.keys(body).map((key) => {
            let val = body[key];
            val = val ? val : '';
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
          }).join('&');

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        } else if (contentType.includes('multipart/form-data')) {
          // 使用 multipart/form-data 类型提交表单
        }
      }
    },
    onProxyRes: ( /*proxyRes, req, res*/) => { // 代理目标响应接收后触发
    },
    onError: ( /*err, req, res*/) => { // 代理目标出现错误后触发
    }
  }
};

// 基本参数
let baseOption = {}

// 初始化
let init = function (options) {
  baseOption = options
}

let getConfig = () => {
  return {
    mode: "development",
    devServer: Object.assign({
      hot: true,
      noInfo: false,
      contentBase: [baseOption.distPath, path.resolve(process.cwd(), 'mocks')],
      disableHostCheck: true,
      port: baseOption.port,
      host: "0.0.0.0",
      compress: true, //gzip压缩
      historyApiFallback: true,
      proxy: devServerProxy
    }, baseOption.dev.devServer || {}),
    performance: {
      hints: false
    },
    devtool: 'cheap-module-source-map'
  }
}

module.exports = {
  getConfig,
  init
};


