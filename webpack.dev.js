const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path');

const localProxy = {
    target: 'http://localhost:8081',
    // ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        allowedHosts: 'auto',
        static: [path.join(__dirname, 'public'), __dirname],
        hot: true,
        proxy: {
            '/api': {...localProxy},
            '/images/': {...localProxy},
            '/node-dev/': {...localProxy},
            '/node-sage/': {...localProxy},
            '/sage/': {...localProxy},
            '/version': {...localProxy},
        },
        historyApiFallback: {
            rewrites: [
                {from: /^apps\/direct-labor/, to: '/'}
            ]
        },
        watchFiles: 'src/**/*',
    },
    devtool: 'source-map',
});
