/**  
 * ! Class naming doesn't work correctly, I'll figure out what's wrong later
 * But the main functionality of css modules is working
 * */

exports.MODULE_STYLE_LOADERS = {
    test: /\.(sa|sc|c)ss$/,
    use: [
        "style-loader",
        {
            loader: "css-loader",
            options: {
                importLoaders: 1,
                modules: true,
                localIdentName: "[name]__[local]___[hash:base64:5]",
            },
        },
        "sass-loader",
    ],
    include: /\.module$/,
};

exports.DEFAULT_STYLE_LOADERS = {
    test: /\.(sa|sc|c)ss$/,
    use: ["style-loader", "css-loader", "sass-loader"],
    exclude: /\.module\.css$/,
};