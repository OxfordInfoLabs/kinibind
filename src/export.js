import kinibind from './kinibind'
import View from './view'
import {OPTIONS, EXTENSIONS} from './constants'
import adapter from './adapter'
import binders from './binders'
import Observer from './observer'

// Returns the public interface.

kinibind.binders = binders
kinibind.adapters['.'] = adapter

// Binds some data to a template / element. Returns a kinibind.View instance.
kinibind.bind = (el, models, options) => {
    let viewOptions = {}
    models = models || {}
    options = options || {}

    EXTENSIONS.forEach(extensionType => {
        viewOptions[extensionType] = Object.create(null)

        if (options[extensionType]) {
            Object.keys(options[extensionType]).forEach(key => {
                viewOptions[extensionType][key] = options[extensionType][key]
            })
        }

        Object.keys(kinibind[extensionType]).forEach(key => {
            if (!viewOptions[extensionType][key]) {
                viewOptions[extensionType][key] = kinibind[extensionType][key]
            }
        })
    })

    OPTIONS.forEach(option => {
        let value = options[option]
        viewOptions[option] = value != null ? value : kinibind[option]
    })

    viewOptions.starBinders = Object.keys(viewOptions.binders).filter(function (key) {
        return key.indexOf('*') > 0
    })

    Observer.updateOptions(viewOptions)

    let view = new View(el, models, viewOptions)
    view.bind()
    return view
}

kinibind.formatters.negate = kinibind.formatters.not = function (value) {
    return !value;
};

export default kinibind
