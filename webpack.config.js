const HtmlWebpackPlugin = require('html-webpack-plugin');
const { dirname } = require('path');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',

    devtool: 'inline-source-map',
    devServer: {
        contentBase: '/dist',
        watchContentBase: true
    },

    /// aggiunto per risolvere i path
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        extensions: ['.js', '.jsx', '.json', '.css'],
    },
    
    plugins:
        [
            new HtmlWebpackPlugin({
                title: 'Custom template',
                template: './src/index.html',
                inject: 'body',
            }),
            new CleanWebpackPlugin()
        ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',

                        // /// aggiunto per path realtivi
                        // options: {
                        //     name(file) {
                        //         /*if (env === 'development') {
                        //           return '[path][name].[ext]'
                        //       }*/
                        //         return '[name]_[hash].[ext]'
                        //     },
                        //     publicPath: '/assets/images/',
                        //     outputPath: '../images/'
                        // }
                    },
                ],
            },
        ]
    }
}