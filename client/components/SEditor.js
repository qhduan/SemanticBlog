
import React from "react";
import ReactDOM from "react-dom";

import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./styles/SEditor.scss";

export default class SEditor extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        const {editable} = this.refs;
        if (editable) {
            let editableNode = ReactDOM.findDOMNode(editable);
            require.ensure(["medium-editor", "./SEditorTable.js"], () => {
                const MediumEditor = require("medium-editor");
                const createTableExtension = require("./SEditorTable.js");
                const TableExtension = createTableExtension(MediumEditor);
                this.mediumEditor = new MediumEditor(editableNode, {
                    toolbar: {
                        buttons: [
                            'bold', 'italic', 'underline',
                            'strikethrough', 'quote', 'anchor',
                            'image', 'justifyLeft', 'justifyCenter',
                            'justifyRight', 'justifyFull', 'superscript',
                            'subscript', 'orderedlist', 'unorderedlist',
                            'pre', 'outdent', 'indent',
                            'h2', 'h3', 'table'
                        ],
                        sticky: true,
                        static: true,
                        align: "left",
                        updateOnEmptySelection: true
                    },
                    extensions: {
                        'table': new TableExtension(),
                    }
                });
            });
        }
    }

    render () {
        return (
            <div id="SEditor">
                <h1>editor</h1>
                <div className="toolbar-padding"></div>
                <div ref="editable" className="editable">
                </div>
            </div>
        );
    }
}
