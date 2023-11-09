"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Array formatting functions - operate solely on array objects.
 */
var array_filterer_1 = __importDefault(require("../util/array-filterer"));
var array_proxy_1 = __importDefault(require("../proxy/array-proxy"));
var array_grouper_1 = __importDefault(require("../util/array-grouper"));
var ArrayFormatters = {
    // Extract item from array at index
    item: function (value, index) {
        if (ArrayFormatters.__checkArray(value)) {
            if (value instanceof array_proxy_1.default)
                value = value.values;
            return value[index];
        }
        else {
            return undefined;
        }
    },
    // Join an array to produce a string using the join string argument
    join: function (value, joinString) {
        if (ArrayFormatters.__checkArray(value)) {
            return value.join(joinString);
        }
        else {
            return value;
        }
    },
    // Concatenate arrays together
    concat: function (value, otherArray) {
        if (ArrayFormatters.__checkArray(value) && ArrayFormatters.__checkArray(otherArray)) {
            return value.concat(otherArray);
        }
        return [];
    },
    // Get a slice of an array
    slice: function (value, from, length) {
        // Convert to numbers
        from = Number(from);
        length = length ? Number(length) : null;
        if (ArrayFormatters.__checkArray(value)) {
            if (length) {
                return value.slice(from, from + length);
            }
            else {
                return value.slice(from);
            }
        }
        else {
            return [];
        }
    },
    // Produce array of values from an array of objects
    memberValues: function (value, member) {
        var values = [];
        if (ArrayFormatters.__checkArray(value)) {
            value.forEach(function (value) {
                if (value instanceof Object) {
                    values.push(value[member]);
                }
            });
        }
        return values;
    },
    // Merge all values in an array (assumed to be arrays) into a single array
    mergeValues: function (value) {
        var values = [];
        if (ArrayFormatters.__checkArray(value)) {
            value.forEach(function (arrayItem) {
                if (arrayItem instanceof Array) {
                    values = values.concat(arrayItem);
                }
            });
        }
        return values;
    },
    // Get distinct items in an array
    distinct: function (value, compareMember) {
        if (compareMember === void 0) { compareMember = null; }
        if (ArrayFormatters.__checkArray(value)) {
            var compareValues_1 = [];
            if (compareMember) {
                compareValues_1 = ArrayFormatters.memberValues(value, compareMember);
            }
            return value.filter(function (value, index, self) {
                if (compareMember) {
                    return compareValues_1.indexOf(value[compareMember]) === index;
                }
                else
                    return self.indexOf(value) === index;
            });
        }
        else {
            return [];
        }
    },
    // Filter an array based upon a filter member / value and filter type
    filter: function (value, filter, filterValue, filterType) {
        if (filterValue === void 0) { filterValue = null; }
        if (filterType === void 0) { filterType = "equals"; }
        if (ArrayFormatters.__checkArray(value)) {
            var filterObject = {};
            if (typeof filter == "string") {
                filterObject[filter] = {
                    value: filterValue,
                    type: filterType
                };
            }
            else {
                filterObject = filter;
            }
            var filterer = new array_filterer_1.default(filterObject);
            return filterer.filterArray(value);
        }
        else {
            return [];
        }
    },
    // Sort an array by a member and ASC / DESC
    sort: function (value, sortBy) {
        if (ArrayFormatters.__checkArray(value)) {
            // Determine sort mode
            var sortData_1 = [];
            if (typeof sortBy == "string") {
                for (var i = 1; i < arguments.length; i += 2) {
                    var member = arguments[i];
                    var direction = 'asc';
                    var splitMember = member.split(" ");
                    if (splitMember.length == 2) {
                        member = splitMember[0];
                        direction = splitMember[1];
                    }
                    var newSort = { member: member };
                    newSort.direction = ((arguments.length > i + 1) ? arguments[i + 1] : direction).toLowerCase();
                    sortData_1.push(newSort);
                }
            }
            else {
                sortData_1 = sortBy;
            }
            var sortCallback = function (firstElement, secondElement) {
                for (var i = 0; i < sortData_1.length; i++) {
                    var item = sortData_1[i];
                    // Skip this check if the two match
                    if (firstElement[item.member] == secondElement[item.member])
                        continue;
                    if (item.direction == "asc") {
                        return !firstElement[item.member] || (firstElement[item.member] < secondElement[item.member]) ? -1 : 1;
                    }
                    else {
                        return !secondElement[item.member] || (firstElement[item.member] > secondElement[item.member]) ? -1 : 1;
                    }
                }
                return 0;
            };
            sortCallback["sortData"] = sortData_1;
            // Use sort data to sort first and second element
            return value.sort(sortCallback);
        }
        else {
            return value;
        }
    },
    // Group by one or more members
    group: function (value) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var grouper = new array_grouper_1.default();
        return grouper.groupArray(value, arg);
    },
    // Get all values of an array (designed for when a proxy)
    values: function (value) {
        if (value instanceof array_proxy_1.default) {
            return value.values;
        }
        else {
            return value;
        }
    },
    /**
     * Sum the values of an array
     *
     * @param value
     */
    sum: function (value) {
        var sum = 0;
        value.forEach(function (valueEntry) {
            sum += Number(valueEntry);
        });
        return sum;
    },
    /**
     * Total count of an array if a proxy
     *
     * @param value
     */
    totalCount: function (value) {
        if (value instanceof array_proxy_1.default) {
            return value.totalCount;
        }
    },
    // Wrap one or more items as an array
    wrapAsArray: function (value) {
        var otherValues = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherValues[_i - 1] = arguments[_i];
        }
        if (!(value instanceof Array)) {
            value = [value];
        }
        if (!otherValues)
            otherValues = [];
        return value.concat(otherValues);
    },
    /**
     * Ensure value is an array
     *
     * @param value
     */
    ensureArray: function (value) {
        return ArrayFormatters.__checkArray(value) ? value : [];
    },
    __checkArray: function (value) {
        return value instanceof Array || value instanceof array_proxy_1.default;
    }
};
exports.default = ArrayFormatters;
