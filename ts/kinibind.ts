import tinybind from "tinybind";
import Checked from "./binders/checked";
import Toggle from "./binders/toggle";
import ArrayAdapter from "./adapters/array-adapter";
import DateFormatters from "./formatters/date-formatters";
import StringFormatters from "./formatters/string-formatters";
import ArrayFormatters from "./formatters/array-formatters";
import SharedFormatters from "./formatters/shared-formatters";
import MathsFormatters from "./formatters/maths-formatters";
import LogicFormatters from "./formatters/logic-formatters";
import ObjectFormatters from "./formatters/object-formatters";
import Each from "./binders/each";
import DefaultAdapter from "./adapters/default-adapter";
import Value from "./binders/value";
import Set from "./binders/set";

/**
 * Kinibind base class
 */
export default class Kinibind {

    // Ensure we initialise tinybind once
    private static initialised = false;
    private static configured = false;

    // Bound context from tinybind
    private boundContext = null;

    // Keep tabs on existing bound elements to resolve sub tree issues.
    private static boundContexts: any[] = [];


    /**
     * Constructor for a new bound element with an optional array of bound params.
     *
     * @param element
     * @param params
     */
    constructor(element, model = {}) {

        // Check whether the new element is contained within an existing bind.
        // If so, converge with the parent and merge the model.
        Kinibind.boundContexts.forEach(boundContext => {
            if (boundContext.element.contains(element)) {
                this.boundContext = boundContext.context;

                // Only assign keys which are not present in parent
                Object.keys(model).forEach(key => {
                    if (!boundContext.context.models[key]) {
                        boundContext.context.models[key] = model[key];
                    }
                });

                model["_kinibindInherit"] = true;

            }
        });

        // Bind the params if a new context
        if (!this.boundContext)
            this.boundContext = Kinibind.binder.bind(element, model);

        // Add bound contexts to the static array for later parentage.
        Kinibind.boundContexts.push({
            element: element,
            context: this.boundContext
        });
    }


    /**
     * Return the model for manipulation in code
     *
     * @return Object
     */
    public get model() {
        return this.boundContext.models;
    }


    /**
     * Add a new property to a model object - required to make it reactive
     *
     * @param modelObject
     * @param propertyName
     * @param propertyValue
     */
    public addNewProperty(modelObject, propertyName, propertyValue) {

        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(modelObject, propertyName, {
            sync: () => {
            }
        });

        // Set the value
        modelObject[propertyName] = propertyValue;
    }


    /**
     * Set static config on global instance
     *
     * @param config
     */
    static set config(config) {

        let defaultConfig = {
            "prefix": "kb"
        };

        config = {...config, ...defaultConfig};

        tinybind.configure(config);

        // Set configured flag
        this.configured = true;
    }

    /**
     * Get singleton instance of binder
     */
    static get binder() {

        if (!this.initialised)
            this.initialise();

        return tinybind;
    }


    // Initialise binder with extra stuff
    private static initialise() {

        if (!this.configured) {
            this.config = {};
        }

        // Initialise formatters
        this.initialiseFormatters();

        // Initialise adapters
        this.initialiseAdapters();

        // Initialise binders
        this.initialiseBinders();

        this.initialised = true;
    }


    /**
     * Initialise the built in formatters we need.
     */
    private static initialiseFormatters() {

        // Add all formatters
        tinybind.formatters = {
            ...tinybind.formatters,
            ...DateFormatters,
            ...StringFormatters,
            ...ArrayFormatters,
            ...SharedFormatters,
            ...ObjectFormatters,
            ...MathsFormatters,
            ...LogicFormatters
        };


        // Function argument formatter - allows for arbitrary args to
        // be passed to a custom function
        tinybind.formatters.args = function (fn) {
            let args = Array.prototype.slice.call(arguments, 1);
            return (event) => fn.apply(null, args.concat([event]));
        }
    }


    /**
     * Initialise the built in adapters we need.
     */
    private static initialiseAdapters() {

        // Extend default adapter with our extra logic.
        tinybind.adapters[tinybind.rootInterface] = {
            ...tinybind.adapters[tinybind.rootInterface],
            ...DefaultAdapter
        };

        tinybind.adapters['['] = ArrayAdapter;
    }


    /**
     * Initialise the built in binders we need
     */
    private static initialiseBinders() {

        // Extends checked binder to allow for one way binding
        tinybind.binders["checked"] = Checked(tinybind.binders["checked"]);

        // Extends value binder to allow for one way binding
        tinybind.binders["value"] = Value(tinybind.binders["value"]);


        // Set binding sets interim values
        tinybind.binders["set-*"] = Set;

        // Toggle binding allows for elements to set model on click.
        tinybind.binders["toggle"] = Toggle;


        // Override the each binder to gracefully handle non-arrays as input
        tinybind.binders["each-*"] = Each(tinybind.binders["each-*"]);


    }


}
