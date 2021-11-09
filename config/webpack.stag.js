const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

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
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public', 'index.html'),
        }),
        new Dotenv({
            path: '.env.stag',
        }),
    ]
};
