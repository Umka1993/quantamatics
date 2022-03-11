const getCSSModuleLocalIdent = require("./getCSSModuleLocalIdent.js");
const path = require('path');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

exports.MODULE_STYLE_LOADERS = {
    test: /\.module.(sa|sc|c)ss$/,
    use: [
        "style-loader",
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 3,
                sourceMap: isDev,
                modules: {
                    mode: 'local',
                    getLocalIdent: getCSSModuleLocalIdent,
                },
            },
        },
        "sass-loader",
    ],
};

exports.DEFAULT_STYLE_LOADERS = {
    test: /\.(sa|sc|c)ss$/,
    use: ["style-loader", "css-loader", "sass-loader"],
    exclude: /\.module/,
};

exports.output = {
    // `filename` provides a template for naming your bundles (remember to use `[name]`)
    filename: '[name].bundle.js',
    publicPath: '/',
    // `chunkFilename` provides a template for naming code-split bundles (optional)
    chunkFilename: isProd
    ? '[name].[contenthash:8].chunk.js'
    : '[name].chunk.js',
    
    pathinfo: isDev,
    // `path` is the folder where Webpack will place your bundles
    path: path.resolve(__dirname, '../publish'),
    // `publicPath` is where Webpack will load your bundles from (optional)
    clean: true,
}