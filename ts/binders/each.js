"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var array_proxy_1 = __importDefault(require("../proxy/array-proxy"));
function Each(eachBinder) {
    eachBinder.coreRoutine = eachBinder.routine;
    // Overload the existing logic to be tolerant about non array input.
    eachBinder.routine = function (el, collection) {
        if (!Array.isArray(collection) && !(collection instanceof array_proxy_1.default)) {
            collection = [];
        }
        return eachBinder.coreRoutine.call(this, el, collection);
    };
    return eachBinder;
}
exports.default = Each;
