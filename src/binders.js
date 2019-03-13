import View from './view'
import {parseDynamicVariablesInString} from './parsers'
import _ from 'lodash';
import $ from 'zepto-webpack';

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

            const key = el.getAttribute('key');

            this.handler = this.eventHandler(value, key)
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

    radioset: {
        bind: function (el) {
            var self = this;
            if (!this.callback) {
                this.callback = function (event) {
                    event.stopPropagation();
                    self.sync();
                }
            }

            this.modelName = el.getAttribute('model') || 'radioData';

            this.inputs = _.values(el.getElementsByTagName('input'));
            this.inputs.forEach((input) => {
                if (input.type === 'radio') {
                    const initialValue = _.get(this.view.models, this.modelName);
                    if (input.value === initialValue) {
                        input.checked = true;
                    }
                    input.addEventListener('change', this.callback)
                }
            });
        },

        unbind: function (el) {
            this.inputs = _.values(el.getElementsByTagName('input'));
            this.inputs.forEach((input) => {
                if (input.type === 'radio') {
                    input.removeEventListener('change', this.callback)
                }
            });
        },

        routine: function (el, value) {
            this.inputs = _.values(el.getElementsByTagName('input'));
            this.inputs.forEach((input) => {
                if (input.type === 'radio') {
                    if (input.checked) {
                        _.set(this.view.models, this.modelName, input.value);
                    }
                }
            });
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
                this.reloadTrigger.split(',').forEach(trigger => {
                    const className = trigger.split(':')[0];
                    const eventName = trigger.split(':')[1];
                    this.triggers.push({
                        className: className,
                        event: eventName,
                        bound: false
                    });
                    const $class = $('.' + className);
                    $class.on(eventName === 'enter' ? 'keyup' : eventName, event => {
                        if (eventName === 'enter') {
                            if (event.key === 'Enter') {
                                fetchSourceData.call(this, element, this.value);
                            }
                        } else {
                            fetchSourceData.call(this, element, this.value);
                        }
                    });
                });
            }

        },
        unbind: function (element) {
            this.triggers.forEach(trigger => {
                const className = trigger.className;
                $('.' + className).off();
            });
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
                console.error('You must supply a source string to this binding -> ', element);
            }
            const method = element.getAttribute('method') || 'GET';
            const modelName = element.getAttribute('model');

            this.actionEvent = element.getAttribute('event') || 'click';

            if (this.value) {

                if (!this.callback) {
                    this.callback = () => {
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
                            method: method,
                            credentials: 'include',
                            headers: {"Content-Type": "text/plain"},
                            mode: 'cors'
                        };

                        const actionURL = parseDynamicVariablesInString(this.value, this.view.models, {});

                        fetch(actionURL, options).then((response) => {

                            if (response.ok) {
                                return response.text().then(function (text) {
                                    return text ? JSON.parse(text) : {}
                                })
                            } else {
                                return response.text().then(function (text) {
                                    throw new Error(text);
                                })
                            }

                        }).then((data) => {
                            if (loadingIndicator) loadingElement.style.display = 'none';

                            if (modelName) {
                                this.view.models[modelName] = data;
                            }

                            const eventSuccess = {actionSuccess: data};
                            const completed = new CustomEvent('actionCompleted', {detail: eventSuccess});
                            element.dispatchEvent(completed);
                        }).catch(err => {
                            const error = JSON.parse(err.message);
                            if (modelName) {
                                this.view.models[modelName + 'Error'] = error;
                            }

                            const eventError = {actionError: error};
                            const failed = new CustomEvent('actionFailed', {detail: eventError});
                            element.dispatchEvent(failed);
                        })
                    };
                }


                element.addEventListener(this.actionEvent, this.callback);

            }
        },
        unbind: function (element) {
            element.removeEventListener(this.actionEvent, this.callback);
        }
    },

    'multi-check': {
        bind: function (el) {
            const self = this;
            if (!this.callback) {
                this.callback = function (event) {
                    event.stopPropagation();
                    self.sync();
                }
            }

            this.performMultiCheck = () => {
                this.inputs = _.values(el.getElementsByTagName('input'));
                this.inputs.forEach((input) => {
                    input.addEventListener('change', this.callback)
                })
            };

            this.modelName = el.getAttribute('model') || 'multi';
            this.output = el.getAttribute('output');
            this.onEvent = el.getAttribute('on-event');

            if (this.onEvent) {
                this.loadElement = document.getElementsByClassName(this.onEvent.split(':')[0]).item(0);
                this.loadEvent = this.onEvent.split(':')[1];
                this.loadElement.addEventListener(this.loadEvent, this.performMultiCheck);
            } else {
                this.performMultiCheck();
            }
        },

        unbind: function (el) {
            this.inputs.forEach((input) => {
                input.removeEventListener('change', this.callback)
            })
            if (this.onEvent) {
                this.loadElement.removeEventListener(this.loadEvent, this.performMultiCheck);
                this.loadElement.removeEventListener(this.loadEvent, this.doRoutine);
            }
        },

        routine: function (el, value) {

            this.doRoutine = () => {
                // first time round this will be undefined, which is what we want to catch,
                // so we don't trigger the change event later on.
                // const trigger = this.view.models[this.modelName];
                if (this.output === 'object') {
                    const values = {};
                    this.inputs.forEach((input) => {
                        const inputValue = input.getAttribute('mcvalue') || input.value;
                        values[inputValue] = input.checked;
                    })

                    values.all = _.some(values);

                    this.view.models[this.modelName] = values;
                } else {
                    const values = [];

                    this.inputs.forEach((input) => {
                        if (input.checked) {
                            values.push(input.getAttribute('mcvalue') || input.value)
                        }
                    })

                    this.view.models[this.modelName] = values;

                }
                const change = new Event('change');
                el.dispatchEvent(change);

                if (this.onEvent) {
                    this.onEvent = null;
                }
            }

            if (this.onEvent) {
                this.loadElement.addEventListener(this.loadEvent, this.doRoutine);
            }

            if (!this.onEvent) {
                this.doRoutine();
            }

        }
    }
}

function fetchSourceData(element, value) {
    if (this.loadingElement) this.loadingElement.style.display = '';

    const loadingEvent = new Event('sourceLoading');
    element.dispatchEvent(loadingEvent);

    const source = parseDynamicVariablesInString(value, this.view.models, {});

    // If we end up with non evaluated string here, dont even bother to proceed.
    if (source.includes('{')) {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        const loadedEvent = new Event('sourceLoaded');
        element.dispatchEvent(loadedEvent);
        return Promise.resolve();
    }

    this.view.models[this.modelName + 'Error'] = undefined;

    const options = {
        method: this.method,
        credentials: 'include'
    };

    if (this.payload) {
        const payload = parsePayload.call(this, this.payload);

        options.method = this.method !== 'GET' ? this.method : 'POST';
        options.headers = {"Content-Type": "text/plain"};
        options.body = JSON.stringify(payload);
        options.mode = 'cors';
    }

    return fetch(source, options)
        .then((response) => {
            if (response.ok) {
                return response.text().then(function (text) {
                    return text ? JSON.parse(text) : {}
                })
            } else {
                throw new Error(response.statusText);
            }
        })
        .then((data) => {
            if (data === undefined || data === null) data = {};
            if (this.loadingElement) this.loadingElement.style.display = 'none';

            // model requires a reset in order for the gui to be updated, prior to the new data coming in
            this.view.models[this.modelName] = undefined;
            this.view.models[this.modelName] = data;

            // Add a function to allow the model to be reset
            if (_.isObject(this.view.models[this.modelName])) {
                this.view.models[this.modelName].reset = () => {
                    this.view.models[this.modelName] = undefined;
                };
            }

            const sourceSuccess = {sourceSuccess: data};
            const loadedEvent = new CustomEvent('sourceLoaded', {detail: sourceSuccess});
            element.dispatchEvent(loadedEvent);
            return true;
        })
        .then(() => {
            this.triggers.forEach(trigger => {
                const className = trigger.className;
                const eventName = trigger.event;
                const $class = $('.' + className);
                $class.off();
                $class.on(eventName === 'enter' ? 'keyup' : eventName, event => {
                    if (eventName === 'enter') {
                        if (event.key === 'Enter') {
                            fetchSourceData.call(this, element, this.value);
                        }
                    } else {
                        fetchSourceData.call(this, element, this.value);
                    }
                });
            });
        })
        .catch(error => {

            if (this.loadingElement) this.loadingElement.style.display = 'none';
            this.view.models[this.modelName + 'Error'] = error;
            const sourceError = {sourceError: error};

            const errorEvent = new CustomEvent('sourceFailed', {detail: sourceError});
            element.dispatchEvent(errorEvent);
            return true;
        });
}

function parsePayload(payload) {
    payload = payload.replace(/{(.*?)}/g, "this.view.models.$1");

    eval("payload = {" + payload + "};");

    return payload;
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
