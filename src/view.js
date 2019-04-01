import kinibind from './kinibind'
import {Binding} from './bindings'
import {parseTemplate} from './parsers'
import {getDynamicStringModelExpressions} from './parsers'
import Subject from 'rxjs/internal/Subject';
import {isObject} from 'lodash-es';

const textBinder = {
    routine: (node, value) => {
        node.data = (value != null) ? value : ''
    }
}

const DECLARATION_SPLIT = /((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g

const parseNode = (view, node) => {
    let block = false

    if (node.nodeType === 3) {
        let tokens = parseTemplate(node.data, kinibind.templateDelimiters)

        if (tokens) {
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i]
                let text = document.createTextNode(token.value)
                node.parentNode.insertBefore(text, node)

                if (token.type === 1) {
                    view.buildBinding(text, null, token.value, textBinder, null)
                }
            }

            node.parentNode.removeChild(node)
        }
        block = true
    } else if (node.nodeType === 1) {
        block = view.traverse(node)
    }

    if (!block) {
        for (let i = 0; i < node.childNodes.length; i++) {
            parseNode(view, node.childNodes[i]);
        }
    }
}

const bindingComparator = (a, b) => {
    let aPriority = a.binder ? (a.binder.priority || 0) : 0
    let bPriority = b.binder ? (b.binder.priority || 0) : 0
    return bPriority - aPriority
}

const trimStr = (str) => {
    return str.trim()
}

const updateDynamicStringVariablesForView = (bindings, viewChange) => {
    if (viewChange && isObject(viewChange)) {
        if (Array.isArray(bindings)) {
            bindings.forEach(binding => {
                const modelExpressions = getDynamicStringModelExpressions(binding.keypath);
                if (modelExpressions && modelExpressions.includes(viewChange.keyPath)) {
                    binding.sync();
                }
            });
        }
    }
}

// A collection of bindings built from a set of parent nodes.
export default class View {
    // The DOM elements and the model objects for binding are passed into the
    // constructor along with any local options that should be used throughout the
    // context of the view and it's bindings.
    constructor(els, models, options) {
        if (els.jquery || els instanceof Array) {
            this.els = els
        } else {
            this.els = [els]
        }

        this.models = models
        this.options = options
        this.subject = new Subject();
        this.build()
    }


    buildBinding(node, type, declaration, binder, arg) {
        let pipes = declaration.match(DECLARATION_SPLIT).map(trimStr)

        let keypath = pipes.shift()

        this.bindings.push(new Binding(this, node, type, keypath, binder, arg, pipes, this.subject))
    }

    // Parses the DOM tree and builds `Binding` instances for every matched
    // binding declaration.
    build() {
        this.bindings = []

        let elements = this.els, i, len;
        for (i = 0, len = elements.length; i < len; i++) {
            parseNode(this, elements[i])
        }

        this.bindings.sort(bindingComparator)
    }

    traverse(node) {
        let bindingPrefix = kinibind._fullPrefix
        let block = node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE'
        let attributes = node.attributes
        let bindInfos = []
        let starBinders = this.options.starBinders
        var type, binder, identifier, arg


        for (let i = 0, len = attributes.length; i < len; i++) {
            let attribute = attributes[i]
            if (attribute.name.indexOf(bindingPrefix) === 0) {
                type = attribute.name.slice(bindingPrefix.length)
                binder = this.options.binders[type]
                arg = undefined

                if (!binder) {
                    for (let k = 0; k < starBinders.length; k++) {
                        identifier = starBinders[k]
                        if (type.slice(0, identifier.length - 1) === identifier.slice(0, -1)) {
                            binder = this.options.binders[identifier]
                            arg = type.slice(identifier.length - 1)
                            break
                        }
                    }
                }

                if (!binder) {
                    binder = kinibind.fallbackBinder
                }

                if (binder.block) {
                    this.buildBinding(node, type, attribute.value, binder, arg)
                    node.removeAttribute(attribute.name)
                    return true;
                }

                bindInfos.push({attr: attribute, binder: binder, type: type, arg: arg})
            }
        }

        for (let i = 0; i < bindInfos.length; i++) {
            let bindInfo = bindInfos[i]
            this.buildBinding(node, bindInfo.type, bindInfo.attr.value, bindInfo.binder, bindInfo.arg)
            node.removeAttribute(bindInfo.attr.name)
        }

        return block
    }

    // Binds all of the current bindings for this view.
    bind() {
        this.subject.subscribe(viewChange => {
            updateDynamicStringVariablesForView(this.bindings, viewChange, this.models);
        });
        this.bindings.forEach(binding => {
            binding.bind()
        })
    }

    // Unbinds all of the current bindings for this view.
    unbind() {
        this.subject.unsubscribe();
        this.bindings.forEach(binding => {
            binding.unbind()
        })
    }

    // Syncs up the view with the model by running the routines on all bindings.
    sync() {
        this.bindings.forEach(binding => {
            binding.sync()
        })
    }

    // Publishes the input values from the view back to the model (reverse sync).
    publish() {
        this.bindings.forEach(binding => {
            if (binding.binder && binding.binder.publishes) {
                binding.publish()
            }
        })
    }

    // Updates the view's models along with any affected bindings.
    update(models = {}) {
        Object.keys(models).forEach(key => {
            this.models[key] = models[key]
        })

        this.bindings.forEach(binding => {
            if (binding.update) {
                binding.update(models)
            }
        })
    }
}
