"use strict";

const path =    require("path");
const webpack = require("webpack");

function makeEntry (file) {
    return [
        "babel-polyfill",
        file,
        "webpack-hot-middleware/client"
    ];
}

module.exports = {
    entry: {
        app: makeEntry(path.resolve(__dirname, "..", "client", "app.js")),
    },
    module: {
        loaders: [
            { // babel
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel"
            },
            { // CSS
                test: /\.css$/,
                loader: "style!css"
            },
            { // SASS
                test: /\.scss$/,
                loader: "style!css!sass"
            },
            {
                test: /\.(jpe?g|png|gif|bmp)$/,
                loader: "url?limit=10000"
            },
            {
                test: /\.json$/,
                loader: "json"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": "\"development\""
        }),
        new webpack.ProvidePlugin({
            "_": "lodash"
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    output: {
        path: path.resolve(__dirname, "..", "www"),
        publicPath: "/",
        filename: "[name].js"
    }
};
