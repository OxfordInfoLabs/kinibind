/**
 * Array formatting functions - operate solely on array objects.
 */
import ArrayFilterer from "../util/array-filterer";

let ArrayFormatters = {


    item: function (value, index) {
        if (value instanceof Array) {
            return value[index];
        }
    },

    join: function (value, joinString) {
        if (value instanceof Array) {
            return value.join(joinString);
        }
    },

    memberValues: function (value, member) {
        let values = [];
        if (value instanceof Array) {
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
        if (value instanceof Array) {
            value.forEach(arrayItem => {
                if (arrayItem instanceof Array) {
                    values = values.concat(arrayItem);
                }
            });
        }

        return values;
    },

    distinct: function (value) {
        if (value instanceof Array) {
            return value.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        }
    },

    filter: function (value, filter, filterValue = null, filterType = "equals") {

        if (value instanceof Array) {


            let filterObject = {};
            if (filterValue) {

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

    slice: function (value, from, length) {
        if (value instanceof Array) {
            if (length) {
                return value.slice(from, from + length);
            } else {
                return value.slice(from);
            }
        } else {
            return [];
        }
    }

}

export default ArrayFormatters;
