import View from './view'
import {parseDynamicVariablesInString} from './parsers'
import _ from 'lodash';


const getString = (value) => {
    return value != null ? value.toString() : undefined
}

const times = (n, cb) => {
    for (let i = 0; i < n; i++) cb()
}

function createView(binding, data, anchorEl) {
    let template = binding.el.cloneNode(true)
    let view = new View(template, data, binding.view.options)
    view.bind()
    binding.marker.parentNode.insertBefore(template, anchorEl)
    return view
}

const binders = {
    // Binds an event handler on the element.
    'on-*': {
        function: true,
        priority: 1000,

        unbind: function (el) {
            if (this.handler) {
                el.removeEventListener(this.arg, this.handler)
            }
        },

        routine: function (el, value) {
            if (this.handler) {
                el.removeEventListener(this.arg, this.handler)
            }

            this.handler = this.eventHandler(value)
            el.addEventListener(this.arg, this.handler)
        }
    },

    // Appends bound instances of the element in place for each item in the array.
    'each-*': {
        block: true,

        priority: 4000,

        bind: function (el) {
            if (!this.marker) {
                this.marker = document.createComment(` kinibind: ${this.type} `)
                this.iterated = []

                el.parentNode.insertBefore(this.marker, el)
                el.parentNode.removeChild(el)
            } else {
                this.iterated.forEach(view => {
                    view.bind()
                })
            }
        },

        unbind: function (el) {
            if (this.iterated) {
                this.iterated.forEach(view => {
                    view.unbind()
                })
            }
        },

        routine: function (el, collection) {
            let modelName = this.arg
            collection = collection || []
            let indexProp = el.getAttribute('index-property') || '$index'

            if (!_.isArray(collection)) {
                Object.keys(collection).forEach((key) => {
                    processEach.call(this, collection[key], key, modelName, indexProp);
                });
            } else {
                collection.forEach((model, index) => {
                    processEach.call(this, model, index, modelName, indexProp);
                })
            }

            if (this.iterated.length > collection.length) {
                times(this.iterated.length - collection.length, () => {
                    let view = this.iterated.pop()
                    view.unbind()
                    this.marker.parentNode.removeChild(view.els[0])
                })
            }

            if (el.nodeName === 'OPTION') {
                this.view.bindings.forEach(binding => {
                    if (binding.el === this.marker.parentNode && binding.type === 'value') {
                        binding.sync()
                    }
                })
            }
        },

        update: function (models) {
            let data = {}

            //todo: add test and fix if necessary

            Object.keys(models).forEach(key => {
                if (key !== this.arg) {
                    data[key] = models[key]
                }
            })

            this.iterated.forEach(view => {
                view.update(data)
            })
        }
    },

    // Adds or removes the class from the element when value is true or false.
    'class-*': function (el, value) {
        let elClass = ` ${el.className} `

        if (!value === (elClass.indexOf(` ${this.arg} `) > -1)) {
            if (value) {
                el.className = `${el.className} ${this.arg}`
            } else {
                el.className = elClass.replace(` ${this.arg} `, ' ').trim()
            }
        }
    },

    // Sets the element's text value.
    text: (el, value) => {
        el.textContent = value != null ? value : ''
    },

    // Sets the element's HTML content.
    html: (el, value) => {
        el.innerHTML = value != null ? value : ''
    },

    // Shows the element when value is true.
    show: (el, value) => {
        el.style.display = value ? '' : 'none'
    },

    // Hides the element when value is true (negated version of `show` binder).
    hide: (el, value) => {
        el.style.display = value ? 'none' : ''
    },

    // Enables the element when value is true.
    enabled: (el, value) => {
        el.disabled = !value
    },

    // Disables the element when value is true (negated version of `enabled` binder).
    disabled: (el, value) => {
        el.disabled = !!value
    },

    // Checks a checkbox or radio input when the value is true. Also sets the model
    // property when the input is checked or unchecked (two-way binder).
    checked: {
        publishes: true,
        priority: 2000,

        bind: function (el) {
            var self = this;
            if (!this.callback) {
                this.callback = function () {
                    self.publish();
                }
            }
            el.addEventListener('change', this.callback)
        },

        unbind: function (el) {
            el.removeEventListener('change', this.callback)
        },

        routine: function (el, value) {
            if (el.type === 'radio') {
                el.checked = getString(el.value) === getString(value)
            } else {
                el.checked = !!value
            }
        }
    },

    // Sets the element's value. Also sets the model property when the input changes
    // (two-way binder).
    value: {
        publishes: true,
        priority: 3000,

        bind: function (el) {
            this.isRadio = el.tagName === 'INPUT' && el.type === 'radio';
            if (!this.isRadio) {

                var self = this;
                if (!this.callback) {
                    this.callback = function () {
                        self.publish();
                    }
                }

                if (el.getAttribute('action')) {
                    var action = el.getAttribute('action');
                    var element = document.getElementsByClassName(action.split(':')[0]).item(0);
                    element.addEventListener(action.split(':')[1], this.callback);
                } else {
                    this.event = el.getAttribute('event-name') || (el.tagName === 'SELECT' ? 'change' : 'input')
                    el.addEventListener(this.event, this.callback)
                }


            }
        },

        unbind: function (el) {
            if (!this.isRadio) {
                el.removeEventListener(this.event, this.callback)
            }
        },

        routine: function (el, value) {
            if (this.isRadio) {
                el.setAttribute('value', value)
            } else {
                if (el.type === 'select-multiple') {
                    if (value instanceof Array) {
                        for (let i = 0; i < el.length; i++) {
                            let option = el[i];
                            option.selected = value.indexOf(option.value) > -1
                        }
                    }
                } else if (getString(value) !== getString(el.value)) {
                    el.value = value != null ? value : ''
                }
            }
        }
    },

    // Inserts and binds the element and it's child nodes into the DOM when true.
    if: {
        block: true,
        priority: 4000,

        bind: function (el) {
            if (!this.marker) {
                this.marker = document.createComment(' kinibind: ' + this.type + ' ' + this.keypath + ' ');
                this.attached = false

                el.parentNode.insertBefore(this.marker, el)
                el.parentNode.removeChild(el)
            } else if (this.bound === false && this.nested) {
                this.nested.bind()
            }
            this.bound = true
        },

        unbind: function () {
            if (this.nested) {
                this.nested.unbind()
                this.bound = false
            }
        },

        routine: function (el, value) {
            if (!!value !== this.attached) {
                if (value) {

                    if (!this.nested) {
                        this.nested = new View(el, this.view.models, this.view.options)
                        this.nested.bind()
                    }

                    this.marker.parentNode.insertBefore(el, this.marker.nextSibling)
                    this.attached = true
                } else {
                    el.parentNode.removeChild(el)
                    this.attached = false
                }
            }
        },

        update: function (models) {
            if (this.nested) {
                this.nested.update(models)
            }
        }
    },

    bind: {
        bind: function (element) {
            this.value = element.getAttribute('source');
            if (!this.value) {
                console.error('You must supply a source string to this binding');
            }
            this.modelName = element.getAttribute('model') || 'sourceData';
            this.reloadTrigger = element.getAttribute('reload-trigger');
            this.triggers = [];
            this.payload = element.getAttribute('payload');
            this.method = element.getAttribute('method') || 'GET';
            this.load = element.getAttribute('load') !== 'false';

            this.loadingIndicator = element.getAttribute('loading-indicator');
            if (this.loadingIndicator) {
                this.loadingElement = document.getElementsByClassName(this.loadingIndicator).item(0);
            }

            if (this.reloadTrigger) {
                if (!this.callback) {
                    this.callback = () => {
                        fetchSourceData.call(this, element, this.value);
                    }
                }

                const triggers = this.reloadTrigger.split(',');
                triggers.forEach(trigger => {

                    const className = trigger.split(':')[0];
                    const eventName = trigger.split(':')[1];
                    const triggerElement = document.getElementsByClassName(className).item(0);

                    if (triggerElement) {
                        this.triggers.push({
                            element: triggerElement,
                            event: eventName
                        });
                        triggerElement.addEventListener(eventName, this.callback);
                    }
                });
            }
        },
        unbind: function (element) {
            if (this.triggers.length) {
                this.triggers.forEach(trigger => {
                    trigger.element.removeEventListener(trigger.event, this.callback);
                })
            }
        },
        routine: function (element, value) {
            if (this.load) {
                fetchSourceData.call(this, element, value);
            } else {
                if (this.loadingElement) this.loadingElement.style.display = 'none';
            }
        }
    },

    action: {
        bind: function (element) {
            this.value = element.getAttribute('source');
            if (!this.value) {
                console.error('You must supply a source string to this binding');
            }
            const actionURL = parseDynamicVariablesInString(this.value, this.view.models, {});
            const method = element.getAttribute('method') || 'GET';
            const modelName = element.getAttribute('model');

            this.actionEvent = element.getAttribute('event') || 'click';

            if (actionURL) {

                element.addEventListener(this.actionEvent, () => {
                    const started = new Event('actionStarted');
                    element.dispatchEvent(started);

                    if (modelName) {
                        this.view.models[modelName + 'Error'] = undefined;
                    }

                    const loadingIndicator = element.getAttribute('loading-indicator');
                    let loadingElement;

                    if (loadingIndicator) {
                        loadingElement = document.getElementsByClassName(loadingIndicator).item(0);
                    }

                    if (loadingElement) loadingElement.style.display = '';

                    const options = {
                        method: method
                    };

                    fetch(actionURL, options).then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error(response.statusText);
                        }

                    }).then((data) => {
                        if (loadingIndicator) loadingElement.style.display = 'none';

                        if (modelName) {
                            this.view.models[modelName] = data;
                        }

                        const completed = new Event('actionCompleted');
                        element.dispatchEvent(completed);
                    }).catch(error => {
                        if (modelName) {
                            this.view.models[modelName + 'Error'] = error;
                        }
                        const failed = new Event('actionFailed');
                        element.dispatchEvent(failed);
                    })
                });

            }
        },
        unbind: function (element) {
            element.removeEventListener(this.actionEvent);
        }
    },

    'multi-check': {
        bind: function (el) {
            var self = this;
            if (!this.callback) {
                this.callback = function(event) {
                    event.stopPropagation();
                    self.sync();
                }
            }

            this.modelName = el.getAttribute('model') || 'multi';

            this.inputs = _.values(el.getElementsByTagName('input'));
            this.inputs.forEach((input) => {
                input.addEventListener('change', this.callback)
            })
        },

        unbind: function (el) {
            this.inputs.forEach((input) => {
                input.removeEventListener('change', this.callback)
            })
        },

        routine: function (el, value) {
            const values = [];
            // first time round this will be undefined, which is what we want to catch,
            // so we don't trigger the change event later on.
            const trigger = this.view.models[this.modelName];

            this.inputs.forEach((input) => {
                if (input.checked) {
                    values.push(input.value)
                }
            })

            this.view.models[this.modelName] = values;

            if (trigger) {
                const change = new Event('change');
                el.dispatchEvent(change);
            }
        }
    }
}

function fetchSourceData(element, value) {
    const source = parseDynamicVariablesInString(value, this.view.models, {});

    this.view.models[this.modelName + 'Error'] = undefined;

    const options = {
        method: this.method
    };

    if (this.payload) {
        const payload = parsePayload.call(this, this.payload);

        options.method = this.method !== 'GET' ? this.method : 'POST';
        options.headers = {"Content-Type": "text/plain"};
        options.body = JSON.stringify(payload);
        options.mode = 'cors';
    }

    if (this.loadingElement) this.loadingElement.style.display = '';

    fetch(source, options).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    }).then((data) => {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        this.view.models[this.modelName] = undefined;
        this.view.models[this.modelName] = data;
        const loadedEvent = new Event('sourceLoaded');
        element.dispatchEvent(loadedEvent);
    }).catch(error => {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        this.view.models[this.modelName + 'Error'] = error;
        const errorEvent = new Event('sourceFailed');
        element.dispatchEvent(errorEvent);
    });
}

function parsePayload(payload) {
    const data = {};

    const dataItems = payload.split(',');
    dataItems.forEach(dataItem => {
        const splitItem = dataItem.split(':');
        data[splitItem[0]] = parseDynamicVariablesInString(splitItem[1], this.view.models, {});
    });

    return data;
}

function processEach(model, index, modelName, indexProp) {
    let data = {$parent: this.view.models}
    data[indexProp] = index
    data[modelName] = model
    let view = this.iterated[index]

    if (!view) {

        let previous = this.marker

        if (this.iterated.length) {
            previous = this.iterated[this.iterated.length - 1].els[0]
        }

        view = createView(this, data, previous.nextSibling)
        this.iterated.push(view)
    } else {
        if (view.models[modelName] !== model) {
            // search for a view that matches the model
            let matchIndex, nextView
            for (let nextIndex = index + 1; nextIndex < this.iterated.length; nextIndex++) {
                nextView = this.iterated[nextIndex]
                if (nextView.models[modelName] === model) {
                    matchIndex = nextIndex
                    break
                }
            }
            if (matchIndex !== undefined) {
                // model is in other position
                // todo: consider avoiding the splice here by setting a flag
                // profile performance before implementing such change
                this.iterated.splice(matchIndex, 1)
                this.marker.parentNode.insertBefore(nextView.els[0], view.els[0])
                nextView.models[indexProp] = index
            } else {
                //new model
                nextView = createView(this, data, view.els[0])
            }
            this.iterated.splice(index, 0, nextView)
        } else {
            view.models[indexProp] = index
        }
    }
}

export default binders
