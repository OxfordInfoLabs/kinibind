"use strict";
/**
 * Toggle class
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var kinibind_1 = __importDefault(require("../kinibind"));
var ComponentBind = {
    block: true,
    priority: 4000,
    // Call bind logic and
    bind: function (el) {
        // Create a clean model
        var model = { '$global': this.view.models['$global'] || this.view.models };
        window["tinybind"].bind(el, model);
        // Sort out parent and global models
        model['$parent'] = this.view.models;
        if (kinibind_1.default.components[this.arg] && el.ownerDocument) {
            var constructor = kinibind_1.default.components[this.arg];
            new constructor(el, model, this.view.models, el.ownerDocument);
        }
        el.dataset.kinibound = "1";
        el.boundModel = model;
    }
};
exports.default = ComponentBind;
