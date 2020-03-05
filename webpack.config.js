const path = require('path');
const hwp = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
  
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist'
    },

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        }]
    },

    devServer: {
        overlay: true
    },

    plugins: [
        new hwp({template: './src/index.html'})
    ]
}