
function createPropertyExtension (MediumEditor, Rangy) {
    return MediumEditor.extensions.button.extend({
        name: 'property',
        tagNames: ['mark'],
        contentDefault: '<b>Prop</b>',
        contentFA: '<i class="fa fa-paint-brush"></i>',
        aria: 'Property',
        action: 'property',
        init: function () {
            MediumEditor.extensions.button.prototype.init.call(this);
            this.classApplier = Rangy.createClassApplier("property", {
                elementTagName: "mark",
                normalize: true,
                elementAttributes: {
                    title: "property"
                }
            });
        },
        handleClick: function (event) {
            this.classApplier.toggleSelection();
            // Ensure the editor knows about an html change so watchers are notified
            // ie: <textarea> elements depend on the editableInput event to stay synchronized
            this.base.checkContentChanged();
        }
    });
}

module.exports = createPropertyExtension;
