
import React from "react";
import ReactDOM from "react-dom";

import "./styles/SEditor.scss";

export default class SEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            content: "",
            converted: ""
        };
        this.marked = null;
    }

    componentDidMount () {
        const {editable} = this.refs;
        if (editable) {
            require.ensure(["marked"], () => {
                let marked = require("marked");
                let renderer = new marked.Renderer();
                this.properties = {};
                renderer.paragraph = (text) => {
                    text = text.replace(/\[\[([^:]+)::([^\]]+)\]\]/, (match, key, value) => {
                        this.properties[key] = value;
                        return `<span class="property" title="${key}">${value}</span>`;
                    });
                    // console.log(this.properties);
                    return `<p>${text}</p>`
                };
                const old_code = renderer.code.bind(renderer);
                renderer.code = (code, language) => {
                    console.log("code", code, language);
                    return old_code(code, language);
                };
                const old_codespan = renderer.codespan.bind(renderer);
                renderer.codespan = (code) => {
                    console.log("codespan", code);
                    return old_codespan(code);
                };
                marked.setOptions({
                    renderer,
                    gfm: true,
                    tables: true,
                    breaks: true,
                    pedantic: true,
                    sanitize: true,
                    smartLists: true,
                    smartypants: true
                });
                this.marked = marked;
                this.convert();
            });
        }
    }

    convert (content) {
        if (typeof content === "undefined") {
            content = this.state.content;
        }
        let converted = content;
        if (this.marked) {
            converted = this.marked(converted);
        }
        this.setState({converted});
    }

    editableChanged (event) {
        let content = event.target.value;
        this.setState({content});
        this.convert(content);
    }

    render () {
        const {converted} = this.state;
        return (
            <div className="SEditor">
                <h1>Semantic Editor</h1>
                <div className="container">
                    <textarea
                        ref="editable"
                        className="editable"
                        onKeyDown={(...a) => this.editableChanged(...a)}
                        onKeyUp={(...a) => this.editableChanged(...a)}
                    ></textarea>
                    <div
                        ref="preview"
                        className="preview"
                        dangerouslySetInnerHTML={{__html: converted}}
                    ></div>
                </div>
            </div>
        );
    }
}
