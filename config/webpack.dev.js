const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");

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
    mode: "development",
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
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: "[name]__[local]___[hash:base64:5]"
                        },
                    },
                    'sass-loader'
                ],
                include: /\.module$/
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                exclude: /\.module\.css$/
            },
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
            path: '.env.dev',
        }),
    ]
};
