"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_sha256_1 = require("js-sha256");
/**
 * Filter query data class
 */
var FilterQuery = /** @class */ (function () {
    // Constructor
    function FilterQuery(data) {
        // Filters
        this.filters = {};
        // Sort orders
        this.sortOrders = [];
        // Offset
        this.offset = 0;
        // Limit
        this.limit = 1000000000;
        if (data) {
            this.filters = data.filters;
            this.sortOrders = data.sortOrders;
            this.offset = data.offset;
            this.limit = data.limit;
        }
    }
    Object.defineProperty(FilterQuery.prototype, "hash", {
        get: function () {
            // @ts-ignore
            var filterString = JSON.stringify(this.filters);
            var sortString = "";
            this.sortOrders.forEach(function (sort) {
                sortString += sort.member + sort.direction + "|";
            });
            // @ts-ignore
            return (0, js_sha256_1.sha256)(filterString + sortString + String(this.offset) + String(this.limit));
        },
        enumerable: false,
        configurable: true
    });
    return FilterQuery;
}());
exports.default = FilterQuery;
