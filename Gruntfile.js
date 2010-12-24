var path = require('path');

const PATHS = {
    ROOT_SERVER: path.join(__dirname, '/server/'),
    ROOT_CLIENT: path.join(__dirname, '/public/'),
    WEBPACK_BUILD: path.join(__dirname, '/public/build/'),
    WEBPACK_PUBLIC: '/public/build/'
};

module.exports = function(grunt) {

    // Import NPM task
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Initialise configuration
    grunt.initConfig({
        watch: {
            client: {
                files: [ PATHS.ROOT_CLIENT + '**.js' ]
            },
            server: {
                files: [ PATHS.ROOT_SERVER + '/**.js' ]
            }
        },
        nodemon: {
            default: {
                script: './server.js',
                options: {
                    watch: [ PATHS.ROOT_SERVER, PATHS.WEBPACK_PUBLIC ]
                }
            }
        },
        webpack: {
            default: {
                entry: './public/entrypoint.js',
                output: {
                    path: PATHS.WEBPACK_BUILD,
                    publicPath: PATHS.WEBPACK_PUBLIC,
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
            },
            watcher: {}
        }
    });

    // Register tasks
    grunt.registerTask('build', [ 'webpack:default' ]);
    grunt.registerTask('start', [ 'nodemon:default' ]);
    grunt.registerTask('dev', [ 'nodemon:default' ]);
};
