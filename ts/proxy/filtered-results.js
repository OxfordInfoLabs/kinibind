"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilteredResults = /** @class */ (function () {
    /**
     * Constructed as part of array proxy logic.
     *
     * @param results
     * @param totalCount
     */
    function FilteredResults(results, totalCount) {
        this._results = results;
        this._totalCount = totalCount;
    }
    Object.defineProperty(FilteredResults.prototype, "results", {
        /**
         * Get the results as an array
         */
        get: function () {
            return this._results;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FilteredResults.prototype, "totalCount", {
        /**
         * Get the total count for these results.
         */
        get: function () {
            return this._totalCount;
        },
        enumerable: false,
        configurable: true
    });
    return FilteredResults;
}());
exports.default = FilteredResults;
