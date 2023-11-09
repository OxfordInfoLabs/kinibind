"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filtered proxy object
 */
var filtered_results_1 = __importDefault(require("./filtered-results"));
var filter_query_1 = __importDefault(require("./filter-query"));
var ArrayProxy = /** @class */ (function () {
    function ArrayProxy() {
        // Blank query object
        this.filterQuery = new filter_query_1.default();
        // Parent proxy
        this.__parentProxy = null;
        /**
         * Array of forward proxies for this proxy
         */
        this.proxies = {};
        // Loaded filter results for this proxy
        this.results = new filtered_results_1.default([], 0);
        // Loaded
        this.status = "PENDING";
        // Version field for triggering
        this.version = 0;
        // Identification field
        this.__arrayProxy = 1;
    }
    /**
     * Implement slicing
     *
     * @param from
     * @param to
     */
    ArrayProxy.prototype.slice = function (from, to) {
        var newFilterData = { offset: from };
        if (to) {
            newFilterData.limit = to - from;
        }
        // Return a new forwarding array proxy
        return this.getProxy(newFilterData);
    };
    /**
     * Implement filtering
     *
     * @param callback
     */
    ArrayProxy.prototype.filter = function (callback) {
        var newFilterData = { filters: __assign(__assign({}, this.filterQuery.filters), callback.filters) };
        return this.getProxy(newFilterData);
    };
    /**
     * Implement sorting
     *
     * @param callback
     */
    ArrayProxy.prototype.sort = function (callback) {
        var newFilterData = {
            sortOrders: this.filterQuery.sortOrders.concat(callback.sortData)
        };
        return this.getProxy(newFilterData);
    };
    /**
     * Implement join
     *
     * @param joinString
     */
    ArrayProxy.prototype.join = function (joinString) {
        return this.values.join(joinString);
    };
    /**
     * Implement concat
     *
     * @param otherArray
     */
    ArrayProxy.prototype.concat = function (otherArray) {
        if (otherArray instanceof ArrayProxy) {
            return this.values.concat(otherArray.values);
        }
        else {
            return this.values.concat(otherArray);
        }
    };
    /**
     * Implement forEach for looping
     *
     * @param callback
     */
    ArrayProxy.prototype.forEach = function (callbackfn, thisArg) {
        Array.prototype.forEach.call(this.values, callbackfn, thisArg);
    };
    Object.defineProperty(ArrayProxy.prototype, "length", {
        /**
         * Get length for array
         */
        get: function () {
            return this.values.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrayProxy.prototype, "values", {
        /**
         * Get values for array
         */
        get: function () {
            this.loadData();
            return this.results.results;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrayProxy.prototype, "totalCount", {
        /**
         * Get total count if available
         */
        get: function () {
            this.loadData();
            return this.results.totalCount;
        },
        enumerable: false,
        configurable: true
    });
    // Get a proxy / create one for a given filter query
    ArrayProxy.prototype.getProxy = function (newFilterData) {
        // Construct a new filter query using the new data
        var filterQueryData = __assign(__assign({}, this.filterQuery), newFilterData);
        var newFilterQuery = new filter_query_1.default(filterQueryData);
        var hash = newFilterQuery.hash;
        if (!this.proxies[hash]) {
            this.proxies[hash] = new ForwardingArrayProxy(this.__parentProxy ? this.__parentProxy : this, newFilterQuery);
        }
        return this.proxies[hash];
    };
    // Load data
    ArrayProxy.prototype.loadData = function () {
        var _this = this;
        if (this.status == "PENDING") {
            this.status = "LOADING";
            var parentProxy_1 = this.__parentProxy ? this.__parentProxy : this;
            parentProxy_1.filterResults(this.filterQuery).then((function (filteredResults) {
                _this.status = "LOADED";
                _this.results = filteredResults;
                parentProxy_1.version = parentProxy_1.version + 1;
            }));
        }
    };
    return ArrayProxy;
}());
exports.default = ArrayProxy;
// Internal forwarding array proxy
var ForwardingArrayProxy = /** @class */ (function (_super) {
    __extends(ForwardingArrayProxy, _super);
    /**
     * Constructed with a processing proxy and a filter query
     *
     * @param processingProxy
     * @param filterQuery
     */
    function ForwardingArrayProxy(parentProxy, filterQuery) {
        var _this = _super.call(this) || this;
        _this.__parentProxy = parentProxy;
        _this.filterQuery = filterQuery;
        return _this;
    }
    // This will call the parent proxy at all times
    ForwardingArrayProxy.prototype.filterResults = function (filterQuery) {
        return this.__parentProxy.filterResults(filterQuery);
    };
    return ForwardingArrayProxy;
}(ArrayProxy));
