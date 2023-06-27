/**
 * Value binder - overrides the default one to allow for one way binding
 *
 * @param valueBinder
 * @constructor
 */
export default function Value(valueBinder) {

    valueBinder.coreBind = valueBinder.bind;


    valueBinder.bind = function (el) {

        if (el.hasAttribute('one-way')) {
            return;
        } else {

            // Handle file input case as special case
            if (el.tagName === 'INPUT' && el.type === 'file') {

                let contentHandler = el.dataset.contentHandler;

                var self = this;

                let values = [];

                // Add getter for value
                Object.defineProperty(el, "value", {
                    get: () => {
                        return values;
                    },
                    set: (value) => {
                    }
                });


                // Ensure we have callback
                if (!this.callback) {
                    this.callback = function (event: any) {
                        if (event.target.files) {
                            // Loop through each file
                            let fileList = event.target.files;

                            values = [];

                            // If inline base 64 or inline text, process separately
                            if (contentHandler == "inlineBase64" || contentHandler == "inlineText") {
                                let totalFiles = fileList.length;
                                let completedFiles = 0;
                                for (var i = 0; i < totalFiles; i++) {
                                    let reader = new FileReader();
                                    let file = fileList[i];

                                    // Process uploads until we have processed them all
                                    reader.onload = function (loadedEvent) {
                                        values.push({
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            lastModified: file.lastModified,
                                            content: loadedEvent.target.result
                                        });
                                        completedFiles++;
                                        if (completedFiles == totalFiles)
                                            self.publish();
                                    }

                                    // Call the appropriate function for inline content
                                    if (contentHandler == "inlineBase64") {
                                        reader.readAsDataURL(file);
                                    } else {
                                        reader.readAsText(file);
                                    }

                                }

                            } else {
                                values = fileList;
                                self.publish();
                            }
                        }
                    };
                }

                // Bind to change event
                el.addEventListener("change", this.callback);

            } else {
                valueBinder.coreBind.call(this, el);
            }
        }
    }


    return valueBinder;

}
