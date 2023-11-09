"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Array filterer worker - implements standard array filtering
 */
var ArrayFilterer = /** @class */ (function () {
    /**
     * Construct with filter object
     */
    function ArrayFilterer(filterObject) {
        this.filterObject = filterObject;
    }
    /**
     * Filter an input array using the passed filter object
     *
     * @param array
     */
    ArrayFilterer.prototype.filterArray = function (array) {
        var _this = this;
        var callback = function (item) {
            return _this.filterArrayElement(item);
        };
        callback["filters"] = this.filterObject;
        return array.filter(callback);
    };
    /**
     * Filter an array using a filter object
     *
     * @param element any
     */
    ArrayFilterer.prototype.filterArrayElement = function (element) {
        var _this = this;
        var matches = true;
        // If no filter object
        if (this.filterObject == null) {
            return element;
        }
        /**
         * Loop through the keys
         */
        Object.keys(this.filterObject).forEach(function (filterKey) {
            var filterDef = _this.filterObject[filterKey];
            if (!filterDef)
                return;
            var filterMemberKeys = (filterDef.member ? filterDef.member : filterKey).split(",");
            var filterMatch = false;
            // Loop through each key
            filterMemberKeys.forEach(function (filterMemberKey) {
                var splitMember = filterMemberKey.split(" SPLIT ");
                filterMemberKey = splitMember[0];
                filterMemberKey = filterMemberKey.split(".");
                var memberValue = element;
                filterMemberKey.forEach(function (segment) {
                    if (memberValue instanceof Array) {
                        var newValue_1 = [];
                        memberValue.forEach(function (item) {
                            if (item)
                                newValue_1.push(item[segment]);
                        });
                        memberValue = newValue_1;
                    }
                    else if (memberValue)
                        memberValue = memberValue[segment];
                });
                // If we have a delimiter split now
                if (memberValue && splitMember.length > 1) {
                    memberValue = memberValue.split(splitMember[1] || ",");
                }
                var filterValue = filterDef.value;
                var hasFilterValue = filterValue || (filterValue === 0) || (filterValue === false);
                var match;
                // Handle special set case
                if (filterDef.type == "set") {
                    match = hasFilterValue && (filterValue ? memberValue : !memberValue);
                }
                else {
                    match = !hasFilterValue || memberValue;
                    if (memberValue && hasFilterValue) {
                        match = _this.filterMatch(filterDef, memberValue, filterValue);
                    }
                }
                // Or the filter matches together
                filterMatch = filterMatch || match;
            });
            // And the filter match to complete.
            matches = matches && filterMatch;
        });
        return matches;
    };
    ArrayFilterer.prototype.filterMatch = function (filterDef, memberValue, filterValue) {
        var _this = this;
        var match = false;
        var filterType = filterDef.type ? filterDef.type : "equals";
        // Handle special cases first and then allow for array member values for all of the others
        switch (filterType) {
            case "contains":
                match = (memberValue instanceof Array ? this.indexOf(memberValue, filterValue) >= 0 :
                    false);
                break;
            case "notContains":
                match = (memberValue instanceof Array ? this.indexOf(memberValue, filterValue) < 0 :
                    false);
                break;
            case "in":
            case "notin":
                // Handle in case - this allows for the comparison to be an array in
                // which case an array intersection is performed.
                if (filterValue instanceof Array) {
                    if (memberValue instanceof Array) {
                        var matches = filterValue.filter(function (item) {
                            return _this.indexOf(memberValue, item) >= 0;
                        });
                        match = matches.length > 0;
                    }
                    else {
                        match = this.indexOf(filterValue, memberValue) >= 0;
                    }
                }
                else {
                    match = false;
                }
                // Not in is the inverse of in.
                if (filterType == "notin")
                    match = !match;
                break;
            default:
                // Ensure we have an array of values to loop
                var memberValues = (memberValue instanceof Array) ? memberValue : [memberValue];
                for (var i = 0; i < memberValues.length && !match; i++) {
                    var memberValue_1 = memberValues[i];
                    switch (filterType) {
                        case "equals":
                            match = (memberValue_1 == filterValue);
                            break;
                        case "notequals":
                            match = (memberValue_1 != filterValue);
                            break;
                        case "like":
                            match = memberValue_1 && memberValue_1.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
                            break;
                        case "startsWith":
                            match = memberValue_1 && memberValue_1.toLowerCase().startsWith(filterValue.toLowerCase());
                            break;
                        case "gte":
                            match = memberValue_1 >= filterValue;
                            break;
                        case "gt":
                            match = memberValue_1 > filterValue;
                            break;
                        case "lte":
                            match = memberValue_1 <= filterValue;
                            break;
                        case "lt":
                            match = memberValue_1 < filterValue;
                            break;
                    }
                }
        }
        return match;
    };
    // Index of which tolerates object value comparisons but still returns efficiently if not object
    ArrayFilterer.prototype.indexOf = function (sourceArray, targetValue) {
        if (typeof targetValue == "object") {
            var stringTarget = JSON.stringify(targetValue);
            for (var i = 0; i < sourceArray.length; i++) {
                if (stringTarget == JSON.stringify(sourceArray[i]))
                    return i;
            }
            return -1;
        }
        else {
            return sourceArray.indexOf(targetValue);
        }
    };
    return ArrayFilterer;
}());
exports.default = ArrayFilterer;
