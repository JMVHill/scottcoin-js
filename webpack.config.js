var path = require('path');

const PATHS = {
    BUILD: path.join(__dirname, '/build/'),
    PUBLIC: '/build/'
};

module.exports = {
    entry: './public/app.js',
    target: 'web',
    output: {
        path: PATHS.BUILD,
        publicPath: PATHS.PUBLIC,
        filename: '/bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['eslint']
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                },
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json']
    }
};