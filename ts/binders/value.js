"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Value binder - overrides the default one to allow for one way binding
 *
 * @param valueBinder
 * @constructor
 */
function Value(valueBinder) {
    valueBinder.coreBind = valueBinder.bind;
    valueBinder.bind = function (el) {
        if (el.hasAttribute('one-way')) {
            return;
        }
        else {
            // Handle file input case as special case
            if (el.tagName === 'INPUT' && el.type === 'file') {
                var contentHandler_1 = el.dataset.contentHandler;
                var self = this;
                var values_1 = [];
                // Add getter for value
                Object.defineProperty(el, "value", {
                    get: function () {
                        return values_1;
                    },
                    set: function (value) {
                    }
                });
                // Ensure we have callback
                if (!this.callback) {
                    this.callback = function (event) {
                        if (event.target.files) {
                            // Loop through each file
                            var fileList = event.target.files;
                            values_1 = [];
                            // If inline base 64 or inline text, process separately
                            if (contentHandler_1 == "inlineBase64" || contentHandler_1 == "inlineText") {
                                var totalFiles_1 = fileList.length;
                                var completedFiles_1 = 0;
                                var _loop_1 = function () {
                                    var reader = new FileReader();
                                    var file = fileList[i];
                                    // Process uploads until we have processed them all
                                    reader.onload = function (loadedEvent) {
                                        values_1.push({
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            lastModified: file.lastModified,
                                            content: loadedEvent.target.result
                                        });
                                        completedFiles_1++;
                                        if (completedFiles_1 == totalFiles_1)
                                            self.publish();
                                    };
                                    // Call the appropriate function for inline content
                                    if (contentHandler_1 == "inlineBase64") {
                                        reader.readAsDataURL(file);
                                    }
                                    else {
                                        reader.readAsText(file);
                                    }
                                };
                                for (var i = 0; i < totalFiles_1; i++) {
                                    _loop_1();
                                }
                            }
                            else {
                                values_1 = fileList;
                                self.publish();
                            }
                        }
                    };
                }
                // Bind to change event
                el.addEventListener("change", this.callback);
            }
            else {
                valueBinder.coreBind.call(this, el);
            }
        }
    };
    return valueBinder;
}
exports.default = Value;
