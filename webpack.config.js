var path = require('path');

const PATHS = {
    BUILD: path.join(__dirname, '/public/build/'),
    PUBLIC: '/public/build/'
};

module.exports = {
    entry: './public/entrypoint.js',
    output: {
        path: PATHS.BUILD,
        publicPath: PATHS.PUBLIC,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.json']
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
                test: /socket\.io-client\.js/,
                loader: 'expose?socket.io'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }, {
                test: /\.html$/,
                loader: "html-loader"
            }, {
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /socket\.io-client\.js/
                ],
                query: {
                    presets: ['es2015']
                },
                loader: 'babel'
            }
        ]
    }
};