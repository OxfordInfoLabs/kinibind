import './util/polyfills';
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
import FunctionFormatters from "./formatters/function-formatters";
import DebugFormatters from "./formatters/debug-formatters";
import Bind from "./binders/bind";
import Component from "./component/component";
import ComponentBind from "./binders/component-bind";
import MultiCheck from "./binders/multicheck";


/**
 * Kinibind base class
 */
export default class Kinibind {

    // Ensure we initialise tinybind once
    private static initialised = false;
    private static _config = {};

    /**
     * Component mapping classes
     *
     * @private
     */
    private static _components = {};

    // Bound context from tinybind
    private _boundContext = null;


    /**
     * Expose the component class statically
     */
    public static Component = Component;


    /**
     * Constructor for a new bound element with an optional array of bound params.
     *
     * @param element
     * @param params
     */
    constructor(element, model = {}) {
        this._boundContext = Kinibind.binder.bind(element, model);
    }


    /**
     * Get the bound context (native tinybind view)
     */
    get boundContext(): any {
        return this._boundContext;
    }

    /**
     * Return the model for manipulation in code
     *
     * @return Object
     */
    public get model() {
        return this._boundContext.models;
    }


    /**
     * Add a new property to a model object - required to make it reactive
     *
     * @param modelObject
     * @param propertyName
     * @param propertyValue
     */
    public addNewProperty(modelObject, propertyName, propertyValue) {

        // Set the value
        modelObject[propertyName] = propertyValue;

        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(modelObject, propertyName, {
            sync: () => {
            }
        });


    }


    /**
     * Set static config on global instance
     *
     * @param config
     */
    static set config(config: any) {

        let defaultConfig = {
            "prefix": "kb"
        };

        // If components set, stash these
        if (config.components) {
            Kinibind._components = config.components;
        }

        config = {...defaultConfig, ...config};

        tinybind.configure(config);

        // Set configured flag
        this._config = config;
    }

    /**
     * Get static config
     *
     */
    static get config() {
        return this._config;
    }


    /**
     * Get singleton instance of binder
     */
    static get binder() {

        if (!this.initialised)
            this.initialise();

        return tinybind;
    }


    /**
     * Get any configured components
     */
    static get components(): {} {
        return this._components;
    }


    // Initialise binder with extra stuff
    private static initialise() {


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
            ...LogicFormatters,
            ...FunctionFormatters,
            ...DebugFormatters
        };


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
        tinybind.binders["set-*"] = tinybind.binders["set-*"] ? tinybind.binders["set-*"] : Set;

        // Toggle binding allows for elements to set model on click.
        tinybind.binders["toggle"] = Toggle;

        // Multicheck binding to allow for multiple checkboxes to be bound to an array
        tinybind.binders["multicheck"] = MultiCheck;

        // Override the each binder to gracefully handle non-arrays as input
        tinybind.binders["each-*"] = Each(tinybind.binders["each-*"]);

        // Add bind element
        tinybind.binders["bind"] = Bind;

        // Add component element
        tinybind.binders["component-*"] = ComponentBind;

    }


}
