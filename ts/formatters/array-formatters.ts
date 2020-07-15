/**
 * Array formatting functions - operate solely on array objects.
 */
import ArrayFilterer from "../util/array-filterer";
import ArrayProxy from "../proxy/array-proxy";

let ArrayFormatters = {


    item: function (value, index) {
        if (ArrayFormatters.__ensureArray(value)) {
            return value[index];
        }
    },

    join: function (value, joinString) {
        if (ArrayFormatters.__ensureArray(value)) {
            return value.join(joinString);
        }
    },

    concat: function (value, otherArray) {
        if (ArrayFormatters.__ensureArray(value) && ArrayFormatters.__ensureArray(otherArray)) {
            return value.concat(otherArray);
        }

        return value;
    },

    slice: function (value, from, length) {
        if (ArrayFormatters.__ensureArray(value)) {
            if (length) {
                return value.slice(from, from + length);
            } else {
                return value.slice(from);
            }
        } else {
            return [];
        }
    },

    memberValues: function (value, member) {
        let values = [];
        if (ArrayFormatters.__ensureArray(value)) {
            value.forEach(value => {
                if (value instanceof Object) {
                    values.push(value[member]);
                }
            });
        }
        return values;
    },


    // Merge all values in an array (assumed to be arrays) into a single array
    mergeValues: function (value) {
        let values = [];
        if (ArrayFormatters.__ensureArray(value)) {
            value.forEach(arrayItem => {
                if (arrayItem instanceof Array) {
                    values = values.concat(arrayItem);
                }
            });
        }

        return values;
    },

    distinct: function (value) {
        if (ArrayFormatters.__ensureArray(value)) {
            return value.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        }
    },

    filter: function (value, filter, filterValue = null, filterType = "equals") {

        if (ArrayFormatters.__ensureArray(value)) {


            let filterObject = {};
            if (typeof filter == "string") {
                filterObject[filter] = {
                    value: filterValue,
                    type: filterType
                };
            } else {
                filterObject = filter;
            }

            let filterer = new ArrayFilterer(filterObject);

            return value.filter(item => {
                return filterer.filterArray(item);
            });

        } else {
            return value;
        }

    },

    sort: function (value) {
        return value;
    },

    __ensureArray: function (value) {
        return value instanceof Array || value instanceof Proxy
    }

}

export default ArrayFormatters;
