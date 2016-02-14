Template.TinyMce.onCreated(function() {
    let templateData = Template.currentData();

    this.initTinyEditor = function() {
        let instance = this;

        let editorId = instance.editorId = Random.id();

        // add our default instance callbacks
        let initCallbacks = [saveOnBlurOption(instance), getSaveFunction(templateData.onSave, instance)];

        let initOptions = defaultInitOptions;
        if (templateData.init) {

            initOptions = _.defaults(templateData.init, defaultInitOptions);

            instance.$(initOptions.selector).attr('data-tiny-editorid', editorId);

            initOptions.selector = `*[data-tiny-editorid="${editorId}"]`;

            // add users init function to callbacks
            if (templateData.init.init_instance_callback) {
                initCallbacks.push(templateData.init.init_instance_callback);
            }

            templateData.init.init_instance_callback = function(editor) {
                instance.tinyEditor = editor;
                for (callback of initCallbacks) {
                    try {
                        callback(editor);	
                    }catch (e) {
                        console.error('[TinyMce Helper] Error in init instance callback', e);
                    }
                }
            }
        }

        instance.tinySelectedElem = instance.find(initOptions.selector);
        tinymce.init(initOptions);
    }
})

Template.TinyMce.onRendered(function() {
    this.initTinyEditor();
})

Template.TinyMce.onDestroyed(function() {
    if(this.tinyEditor) this.tinyEditor.destroy();
})

let defaultInitOptions = {
    selector: '.editable',
    inline: true
}

function saveOnBlurOption(instance) {
    return function(editor) {
        editor.on('blur', function(e) {
            editor.save();
        });
    }
}

function getSaveFunction(onSave, instance) {
    if (!onSave) console.warn('[TinyMce Helper] No onSave function passed to TinyMce Helper -'
    + 'please return a function in your helper and pass it to {{#TinyMce onSave=yourHelperThatReturnsAFunction}}');

    return function(editor) {
        editor.on('SaveContent', function(e) {
            if (onSave) {
                let content = editor.getContent();
                onSave(content)
                removeUnmangedNodes();
            }
        });
    }

    // This functions cleans the mess tinyMCE does to the Dom without telling Blaze about it:
    // as soon as an original node is removed for example you delete a title
    // tinyMCE will add a new node to the DOM. But Blaze doesnt know about that
    // node and will add it back again as soon as you update your data
    // you end up with doubled nodes
    function removeUnmangedNodes() {
        let nodesBeforeBlazeUpdate = [];
        let nodesAfterBlazeUpdate = [];
	
        for (let node of instance.tinySelectedElem.childNodes) {
            nodesBeforeBlazeUpdate.push(node);
        }

        // remove empty nodes as they dont make any sense and affect our check on length
        nodesBeforeBlazeUpdate = _.filter(nodesBeforeBlazeUpdate, (elem) => {
            if (!elem.hasChildNodes()) return elem.length;
            else return elem.innerHTML.length;
        });

        Tracker.afterFlush(function() {

            for (let node of instance.tinySelectedElem.childNodes) {
                nodesAfterBlazeUpdate.push(node);
            }

            if (nodesAfterBlazeUpdate.length !== nodesBeforeBlazeUpdate.length) {
                let redundantNodes = _.intersection(nodesAfterBlazeUpdate, nodesBeforeBlazeUpdate)
                for (node of redundantNodes) {
                    jQuery(node).remove();
                }
            }

        });
    }
}
