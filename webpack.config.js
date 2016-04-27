var path = require('path');
var fs = require('fs');

const PATHS = {
    BUILD: path.join(__dirname, '/public/build/'),
    PUBLIC: '/public/build/'
};

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
       nodeModules[mod] = 'commonjs ' + mod;
    });

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
    // externals: nodeModules,
    // externals: [
    //     nodeExternals()
    // ],
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