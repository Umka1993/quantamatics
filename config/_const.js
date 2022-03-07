const getCSSModuleLocalIdent = require("./getCSSModuleLocalIdent.js");

exports.MODULE_STYLE_LOADERS = {
    test: /\.module.(sa|sc|c)ss$/,
    use: [
        "style-loader",
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 3,
                sourceMap: process.env.NODE_ENV === 'development',
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