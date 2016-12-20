
import "./styles/SEditorProperty.scss";

const TempPropertyClass = "temp-semantic-property";
const PropertyClass = "semantic-property";

function createPropertyExtension (MediumEditor, Rangy) {
    return MediumEditor.extensions.anchor.extend({
        name: 'property',
        tagNames: ['mark'],
        contentDefault: '<b>prop</b>',
        contentFA: '<i class="fa fa-paint-brush"></i>',
        aria: 'Property',
        action: 'property',

        hideForm: function () {
            this.getPropertyInput().value = "";
            this.getForm().style.display = "none";
            this.showToolbarDefaultActions();
        },

        showForm: function () {
            const propertyInput = this.getPropertyInput();

            this.base.saveSelection();
            this.hideToolbarDefaultActions();
            this.getForm().style.display = "block";
            this.setToolbarPosition();

            propertyInput.focus();
        },

        createForm: function () {
            var doc = this.base.options.ownerDocument,
            form = doc.createElement("span"),
            close = doc.createElement("a"),
            save = doc.createElement("a"),
            columnInput = doc.createElement("input"),
            rowInput = doc.createElement("input");

            form.className = "medium-editor-toolbar-form";
            form.id = "medium-editor-toolbar-form-table-" + this.base.id;

            // Handle clicks on the form itself
            this.base.on(form, "click", this.handleFormClick.bind(this));

            // Add columns textbox
            columnInput.setAttribute("type", "text");
            columnInput.className = "medium-editor-toolbar-input medium-editor-toolbar-input-property";
            columnInput.setAttribute("placeholder", "Property Name");
            form.appendChild(columnInput);

            // Handle typing in the textboxes
            this.base.on(columnInput, "keyup", this.handleTextboxKeyup.bind(this));

            // Add save buton
            save.setAttribute("href", "#");
            save.className = "medium-editor-toolbar-save";
            save.innerHTML = this.base.options.buttonLabels === "fontawesome" ?
                "<i class='fa fa-check'></i>" :
                "&#10003;";
            form.appendChild(save);

            // Handle save button clicks (capture)
            this.base.on(save, "click", (...a) => {
                let propertyName = this.getPropertyInput().value.trim();
                this.handleSaveClick(...a);
                this.hideForm();
                if (propertyName) {
                    let nodes = document.querySelectorAll("span." + TempPropertyClass);
                    if (nodes.length) {
                        for (let node of nodes) {
                            node.classList.remove(TempPropertyClass);
                            node.classList.add(PropertyClass);
                            node.title = propertyName;
                            // node.setAttribute("contenteditable", "false");
                            // // insert before
                            // let before = document.createElement("span");
                            // before.textContent = "";
                            // node.parentNode.insertBefore(before, node);
                            // // insert after
                            // let after = document.createElement("span");
                            // after.textContent = "";
                            // node.parentNode.insertBefore(after, node.nextSibling);
                        }
                        this.base.checkContentChanged();
                    }
                }
            }, true);

            // Add close button
            close.setAttribute("href", "#");
            close.className = "medium-editor-toolbar-close";
            close.innerHTML = this.base.options.buttonLabels === "fontawesome" ?
                "<i class='fa fa-times'></i>" :
                "&times;";
            form.appendChild(close);

            // Handle close button clicks
            this.base.on(close, "click", (...a) => {
                this.handleCloseClick(...a);
                this.hideForm();
                this.toggle();
            });

            return form;
        },

        toggle: function () {
            this.classApplier.toggleSelection();
            // Ensure the editor knows about an html change so watchers are notified
            // ie: <textarea> elements depend on the editableInput event to stay synchronized
            this.base.checkContentChanged();
        },

        init: function () {
            MediumEditor.extensions.button.prototype.init.call(this);
            this.classApplier = Rangy.createClassApplier(TempPropertyClass, {
                elementTagName: "span",
                normalize: true
            });
        },

        // Called when the button the toolbar is clicked
        // Overrides DefaultButton.handleClick
        handleClick: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this.toggle();

            if (!this.isDisplayed()) {
                this.showForm();
            }

            return false;
        },

        getPropertyInput: function () {
            return this.getForm().querySelector("input.medium-editor-toolbar-input-property");
        },
    });
}

module.exports = createPropertyExtension;
