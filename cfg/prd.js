let webpack = require('webpack');

let getConfig = () => {
    return {
        mode: process.env.NODE_ENV,
        performance: {
            hints: false
        },
        devtool: 'none',
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]
    }
}

module.exports = {
    getConfig
};