
import React from "react";
import ReactDOM from "react-dom";

import SEditor from "./components/SEditor.js";

// 把组件整体渲染到页面上
ReactDOM.render(
    <div>
        <SEditor />
    </div>,
    document.getElementById("root") // 渲染到html中指定的容器中
);

console.log("Client GREEN");
