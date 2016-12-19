/**
 * 后台服务器的总入口
 * @author qhduan@memect.co
 */

"use strict";

import path from "path";
import fs from "fs";

const SERVER_CONFIG_PATH = path.join(__dirname, "..", "config", "server.json");
const SERVER_CONFIG_EXAMPLE_PATH = path.join(__dirname, "..", "config", "server_example.json");

const SERVER_CONFIG = (() => {
    try {
        console.log("Load server config from: ", SERVER_CONFIG_PATH);
        const content = fs.readFileSync(SERVER_CONFIG_PATH);
        return JSON.parse(content);
    } catch (e) {
        try {
            console.log("Server config not exists, try sample config: ", SERVER_CONFIG_EXAMPLE_PATH);
            const content = fs.readFileSync(SERVER_CONFIG_EXAMPLE_PATH);
            return JSON.parse(content);
        } catch (e) {
            console.error("Sample config not exists too, program exit");
            process.exit(1);
        }
    }
})();

console.log("Server config loaded");

import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

let app = express();

// 调试环境，加载webpack的调试中间件，须在express.static之前
if (process.env.NODE_ENV === "development") {
    console.log("DEVELOPMENT");

    const webpack              = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const webpackConfig        = require("../config/webpack.config.dev");

    let compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true, // display no info to console (only warnings and errors)
        quiet: false, // display nothing to the console
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
}

// 配置express
app.use(express.static(path.join(__dirname, "..", "www")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: "2mb"}));
app.use(compression());

// function loadAPI (root) {
//     const list = fs.readdirSync(root);
//     list.forEach(name => {
//         if (name.match(/\.js$/)) {
//             const modulePath = path.join(root, name);
//             console.log("load", modulePath);
//             require(modulePath);
//         } else {
//             loadAPI(path.join(root, name));
//         }
//     });
// }
//
// loadAPI(path.resolve("server", "api"));
//
// import router from "./router.js";
// app.use("/api", APILogger, router);
//
// [
//     "/company",
//     "/person",
//     "/search",
//     "/placement",
//     "/fund",
//     "/user",
//     "/market"
// ].forEach(element => {
//     app.get(element, (req, res) => {
//         res.sendFile(path.join(__dirname, "..", "public", "index.html"));
//     });
// });

// 404 服务
app.use((req, res) => {
    res.status(404);
    res.json({
        error: "Page Not Found"
    });
});

// 500 服务
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
      error: "Server Runtime Error"
  });
});

const PORT = SERVER_CONFIG.port;
const ADDRESS = SERVER_CONFIG.address;
app.listen(PORT, ADDRESS, () => {
    console.log(`Server listenning on ${PORT}`);
    console.log("Server GREEN");
});
