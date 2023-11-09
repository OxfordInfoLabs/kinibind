"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./util/polyfills");
var tinybind = require("tinybind");
var checked_1 = __importDefault(require("./binders/checked"));
var toggle_1 = __importDefault(require("./binders/toggle"));
var array_adapter_1 = __importDefault(require("./adapters/array-adapter"));
var date_formatters_1 = __importDefault(require("./formatters/date-formatters"));
var string_formatters_1 = __importDefault(require("./formatters/string-formatters"));
var array_formatters_1 = __importDefault(require("./formatters/array-formatters"));
var shared_formatters_1 = __importDefault(require("./formatters/shared-formatters"));
var maths_formatters_1 = __importDefault(require("./formatters/maths-formatters"));
var logic_formatters_1 = __importDefault(require("./formatters/logic-formatters"));
var object_formatters_1 = __importDefault(require("./formatters/object-formatters"));
var each_1 = __importDefault(require("./binders/each"));
var default_adapter_1 = __importDefault(require("./adapters/default-adapter"));
var value_1 = __importDefault(require("./binders/value"));
var set_1 = __importDefault(require("./binders/set"));
var function_formatters_1 = __importDefault(require("./formatters/function-formatters"));
var debug_formatters_1 = __importDefault(require("./formatters/debug-formatters"));
var bind_1 = __importDefault(require("./binders/bind"));
var component_1 = __importDefault(require("./component/component"));
var component_bind_1 = __importDefault(require("./binders/component-bind"));
var multicheck_1 = __importDefault(require("./binders/multicheck"));
var has_1 = __importDefault(require("./binders/has"));
var set_context_1 = __importDefault(require("./binders/set-context"));
/**
 * Kinibind base class
 */
var Kinibind = /** @class */ (function () {
    /**
     * Constructor for a new bound element with an optional array of bound params.
     *
     * @param element
     * @param params
     */
    function Kinibind(element, model, config) {
        if (model === void 0) { model = {}; }
        if (config === void 0) { config = {}; }
        // Bound context from tinybind
        this._boundContext = null;
        this._boundContext = Kinibind.binder.bind(element, model, config);
    }
    Object.defineProperty(Kinibind.prototype, "boundContext", {
        /**
         * Get the bound context (native tinybind view)
         */
        get: function () {
            return this._boundContext;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Kinibind.prototype, "model", {
        /**
         * Return the model for manipulation in code
         *
         * @return Object
         */
        get: function () {
            return this._boundContext.models;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add a new property to a model object - required to make it reactive
     *
     * @param modelObject
     * @param propertyName
     * @param propertyValue
     */
    Kinibind.addNewProperty = function (modelObject, propertyName, propertyValue) {
        // Set the value
        modelObject[propertyName] = propertyValue;
        // Observe the new property
        Kinibind.observeObjectPropertyChanges(modelObject, propertyName);
    };
    /**
     * Observe property changes to a model object property
     *
     * @param object
     * @param propertyName
     */
    Kinibind.observeObjectPropertyChanges = function (object, propertyName, callbackFunction) {
        if (callbackFunction === void 0) { callbackFunction = null; }
        // Observe the new property
        tinybind.adapters[tinybind.rootInterface].observe(object, propertyName, {
            sync: function () {
                if (callbackFunction)
                    callbackFunction(object[propertyName]);
            }
        });
    };
    /**
     * Synchronously wait for an object property to become available.  Very useful when
     * asynchronous calls are being made in e.g. components.
     *
     * @param object
     * @param propertyName
     * @param maxTimeoutSeconds
     */
    Kinibind.awaitObjectProperty = function (object, propertyName, maxTimeoutSeconds) {
        if (maxTimeoutSeconds === void 0) { maxTimeoutSeconds = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var attempts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempts = 0;
                        _a.label = 1;
                    case 1:
                        if (!((attempts < maxTimeoutSeconds * 20) && object[propertyName] === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve(50);
                                }, 50);
                            })];
                    case 2:
                        _a.sent();
                        attempts++;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, object[propertyName]];
                }
            });
        });
    };
    ;
    Object.defineProperty(Kinibind, "config", {
        /**
         * Get static config
         *
         */
        get: function () {
            return this._config;
        },
        /**
         * Set static config on global instance
         *
         * @param config
         */
        set: function (config) {
            var defaultConfig = {
                "prefix": "kb"
            };
            // If components set, stash these
            if (config.components) {
                this._components = config.components;
            }
            config = __assign(__assign({}, defaultConfig), config);
            tinybind.configure(config);
            // Set configured flag
            this._config = config;
            // Attach the tinybind object to the window for interoperability purposes
            window["tinybind"] = tinybind;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Kinibind, "binder", {
        /**
         * Get singleton instance of binder
         */
        get: function () {
            // if not configured pass through
            if (!this._config)
                this.config = {};
            if (!this.initialised)
                this.initialise();
            return tinybind;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Kinibind, "components", {
        /**
         * Get any configured components
         */
        get: function () {
            return this._components;
        },
        enumerable: false,
        configurable: true
    });
    // Initialise binder with extra stuff
    Kinibind.initialise = function () {
        // Initialise formatters
        this.initialiseFormatters();
        // Initialise adapters
        this.initialiseAdapters();
        // Initialise binders
        this.initialiseBinders();
        this.initialised = true;
    };
    /**
     * Initialise the built in formatters we need.
     */
    Kinibind.initialiseFormatters = function () {
        // Add all formatters
        tinybind.formatters = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, tinybind.formatters), date_formatters_1.default), string_formatters_1.default), array_formatters_1.default), shared_formatters_1.default), object_formatters_1.default), maths_formatters_1.default), logic_formatters_1.default), function_formatters_1.default), debug_formatters_1.default);
    };
    /**
     * Initialise the built in adapters we need.
     */
    Kinibind.initialiseAdapters = function () {
        // Extend default adapter with our extra logic.
        tinybind.adapters[tinybind.rootInterface] = __assign(__assign({}, tinybind.adapters[tinybind.rootInterface]), default_adapter_1.default);
        // Add in an array adapter
        tinybind.adapters['['] = array_adapter_1.default;
    };
    /**
     * Initialise the built in binders we need
     */
    Kinibind.initialiseBinders = function () {
        // Extends checked binder to allow for one way binding
        tinybind.binders["checked"] = (0, checked_1.default)(tinybind.binders["checked"]);
        // Extends value binder to allow for one way binding
        tinybind.binders["value"] = (0, value_1.default)(tinybind.binders["value"]);
        // Has binder
        tinybind.binders["has-*"] = has_1.default;
        // Set binding sets interim values
        tinybind.binders["set-*"] = tinybind.binders["set-*"] ? tinybind.binders["set-*"] : set_1.default;
        // Context for a set binding - this is used if set by the set operation
        tinybind.binders["setcontext-*"] = tinybind.binders["setcontext-*"] ? tinybind.binders["setcontext-*"] : set_context_1.default;
        // Toggle binding allows for elements to set model on click.
        tinybind.binders["toggle"] = toggle_1.default;
        // Multicheck binding to allow for multiple checkboxes to be bound to an array
        tinybind.binders["multicheck"] = multicheck_1.default;
        // Override the each binder to gracefully handle non-arrays as input
        tinybind.binders["each-*"] = (0, each_1.default)(tinybind.binders["each-*"]);
        // Add bind element
        tinybind.binders["bind"] = bind_1.default;
        // Add component element
        tinybind.binders["component-*"] = component_bind_1.default;
    };
    // Ensure we initialise tinybind once
    Kinibind.initialised = false;
    Kinibind._config = {};
    /**
     * Component mapping classes
     *
     * @private
     */
    Kinibind._components = {};
    /**
     * Expose the component class statically
     */
    Kinibind.Component = component_1.default;
    return Kinibind;
}());
exports.default = Kinibind;
