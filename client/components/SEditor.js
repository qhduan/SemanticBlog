
import React from "react";
import ReactDOM from "react-dom";

import "./styles/SEditor.scss";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

export default class SEditor extends React.Component {

    constructor (props) {
        super(props);
        this.editor = null;
        this.state = {
            editorMode: true,
            source: "",
            property: []
        };
    }

    switchMode () {
        const {editorMode, source} = this.state;
        if (editorMode) {
            let s = this.htmlBeautify(editor.getContent());
            if (!s.match(/\n$/)) {
                s += "\n";
            }
            this.setState({
                editorMode: false,
                source: s
            });
        } else {
            let s = source;
            if (!s.match(/<br>[\n\s]+$/)) {
                s += "<br>";
            }
            this.editor.setContent(s);
            this.setState({
                editorMode: true
            });
        }
    }

    componentDidMount () {
        const {editable, toolbar} = this.refs;
        if (editable && toolbar) {
            require.ensure([
                "medium-editor",
                "js-beautify",
                "rangy/lib/rangy-core.js",
                "rangy/lib/rangy-classapplier.js",
                "./SEditorTable.js"
            ], () => {
                const JSBeautify = require("js-beautify");
                this.htmlBeautify = JSBeautify.html_beautify;
                window.htmlBeautify = this.htmlBeautify;
                const MediumEditor = require("medium-editor");
                const Rangy = require("rangy/lib/rangy-core.js");
                const RangyClassapplier = require("rangy/lib/rangy-classapplier.js");
                Rangy.init();
                const createTableExtension =  require("./SEditorTable.js");
                const createPropertyExtension = require("./SEditorProperty.js");
                const TableExtension = createTableExtension(MediumEditor);
                const propertyExtension = createPropertyExtension(MediumEditor, Rangy);
                let toolbarNode = ReactDOM.findDOMNode(toolbar);
                this.editor = new MediumEditor(editable, {
                    spellcheck: false,
                    toolbar: {
                        allowMultiParagraphSelection: true,
                        buttons: [
                            "bold", "italic", "underline",
                            "strikethrough", "quote", "anchor",
                            {
                                name: "image",
                                contentDefault: "<b>img</b>"
                            }, {
                                name: "table"
                            }, {
                                name: "property"
                            }
                        ],
                        relativeContainer: toolbar
                    },
                    extensions: {
                        "table": new TableExtension(),
                        "property": new propertyExtension()
                    }
                });
                this.editor.subscribe("editableInput", () => {
                    const nodes = document.querySelectorAll(".semantic-property");
                    if (nodes) {
                        let property = [];
                        for (const node of nodes) {
                            const name = node.title;
                            const value = node.textContent;
                            const html = node.outerHTML;
                            property.push({name, value, html});
                        }
                        if (property && JSON.stringify(property) !== JSON.stringify(this.state.property)) {
                            this.setState({property});
                        }
                    }
                });
                window.editor = this.editor;
            });
        }
    }

    render () {
        const {editorMode, source, property} = this.state;
        const hide = {display: "none"};
        return (
            <div className="SEditor">
                <h1>Semantic Editor</h1>
                <div>
                    <div
                        style={editorMode ? undefined : hide}
                    >
                        <div ref="toolbar" className="toolbar"></div>
                        <div ref="editable" className="editable"></div>
                    </div>
                    <div
                        style={editorMode ? hide : undefined}
                    >
                        <textarea
                            value={source}
                            onChange={event => this.setState({
                                source: event.target.value
                            })}
                            rows={10}
                        ></textarea>
                    </div>
                </div>
                <div className="footer">
                    <button
                        onClick={() => this.switchMode()}
                    >
                        {editorMode ? "Source Mode" : "Editor Mode"}
                    </button>
                    {property && (
                        property.map((p, i) => (
                            <button key={i}>
                                {p.name}
                                ::
                                {p.value.substr(0, 10)}
                            </button>
                        ))
                    )}
                </div>
            </div>
        );
    }

}
