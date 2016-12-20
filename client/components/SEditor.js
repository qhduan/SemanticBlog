
import React from "react";
import ReactDOM from "react-dom";

import "./styles/SEditor.scss";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

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
        const {editable, toolbar} = this.refs;
        if (editable && toolbar) {
            require.ensure([
                "medium-editor",
                "rangy/lib/rangy-core.js",
                "rangy/lib/rangy-classapplier.js",
                "./SEditorTable.js"
            ], () => {
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
                    toolbar: {
                        buttons: [
                            'bold', 'italic', 'underline',
                            'strikethrough', 'quote', 'anchor',
                            'image', "table", "property"
                        ],
                        relativeContainer: toolbar
                    },
                    extensions: {
                        "table": new TableExtension(),
                        "property": new propertyExtension()
                    }
                });
                window.editor = this.editor;
            });
        }
    }

    render () {
        const {converted} = this.state;
        return (
            <div className="SEditor">
                <h1>Semantic Editor</h1>
                <div ref="toolbar" className="toolbar"></div>
                <div ref="editable" className="editable"></div>
            </div>
        );
    }
}
