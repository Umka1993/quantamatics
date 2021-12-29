const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");
const { MODULE_STYLE_LOADERS, DEFAULT_STYLE_LOADERS } = require('./_const.js');

module.exports = {
    devServer: {
        static: path.resolve(__dirname, '../publish'),
        historyApiFallback: true,
        port: 8888
    },
    entry: path.resolve(__dirname, '../src', 'index.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../publish'),
        publicPath: '/'
    },
    mode: "production",
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(png|jp(e*)g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                use: ['ts-loader']
            },
            MODULE_STYLE_LOADERS, DEFAULT_STYLE_LOADERS,
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/assets", to: "./" },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public', 'index.html'),
        }),
        new Dotenv({
            path: '.env.prod-beta',
        }),
    ]
};
