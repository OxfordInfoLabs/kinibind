"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component class
 */
var kinibind_1 = __importDefault(require("../kinibind"));
var Component = /** @class */ (function () {
    /**
     * Construct with an element and a componentModel
     *
     * @param element
     * @param componentModel
     */
    function Component(element, componentModel, parentModel, document) {
        if (parentModel === void 0) { parentModel = null; }
        this._element = element;
        this._componentModel = componentModel;
        this._parentModel = parentModel;
        this._document = document;
        this.initialise(element, this._componentModel, this._parentModel, document);
    }
    Object.defineProperty(Component.prototype, "element", {
        /**
         * Convenience getter for element
         */
        get: function () {
            return this._element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "componentModel", {
        /**
         * Convenience getter for component model
         */
        get: function () {
            return this._componentModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "parentModel", {
        /**
         * Getter for parent model
         */
        get: function () {
            return this._parentModel;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add a component model property for convenience
     *
     * @param propertyName
     * @param propertyValue
     * @protected
     */
    Component.prototype.addComponentModelProperty = function (propertyName, propertyValue, parentObject) {
        if (parentObject === void 0) { parentObject = null; }
        kinibind_1.default.addNewProperty(parentObject ? parentObject : this.componentModel, propertyName, propertyValue);
    };
    return Component;
}());
exports.default = Component;
