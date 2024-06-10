import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import path from 'node:path';

export default merge(common, {
    mode: 'development',
    devServer: {
        allowedHosts: 'auto',
        static: [
            {directory: path.join(process.cwd(), 'public'), watch: false},
            {directory: process.cwd(), watch: false}
        ],
        hot: true,
        proxy: [
            {
                context: ['/api'], target: 'http://localhost:8081'
            }
        ],
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: []
});
