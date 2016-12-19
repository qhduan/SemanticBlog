"use strict";

const path =    require("path");
const webpack = require("webpack");

function makeEntry (file) {
    return [
        "babel-polyfill",
        file
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
                test: /\.(jpe?g|png|gif)$/,
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
            "process.env.NODE_ENV": "\"production\""
        }),
        new webpack.ProvidePlugin({
            "_": "lodash"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, "..", "www"),
        publicPath: "/",
        filename: "[name].js"
    }
};
