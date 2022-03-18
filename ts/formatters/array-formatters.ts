/**
 * Array formatting functions - operate solely on array objects.
 */
import ArrayFilterer from "../util/array-filterer";
import ArrayProxy from "../proxy/array-proxy";

let ArrayFormatters = {

    // Extract item from array at index
    item: function (value, index) {

        if (ArrayFormatters.__ensureArray(value)) {

            if (value instanceof ArrayProxy)
                value = value.values;

            return value[index];
        } else {
            return undefined;
        }
    },

    // Join an array to produce a string using the join string argument
    join: function (value, joinString) {
        if (ArrayFormatters.__ensureArray(value)) {
            return value.join(joinString);
        } else {
            return value;
        }
    },

    // Concatenate arrays together
    concat: function (value, otherArray) {
        if (ArrayFormatters.__ensureArray(value) && ArrayFormatters.__ensureArray(otherArray)) {
            return value.concat(otherArray);
        }

        return [];
    },

    // Get a slice of an array
    slice: function (value, from, length?) {

        // Convert to numbers
        from = Number(from);
        length = length ? Number(length) : null;

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

    // Produce array of values from an array of objects
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

    // Get distinct items in an array
    distinct: function (value) {
        if (ArrayFormatters.__ensureArray(value)) {
            return value.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
        } else {
            return [];
        }
    },

    // Filter an array based upon a filter member / value and filter type
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

            let callback = item => {
                return filterer.filterArray(item);
            };

            callback["filters"] = filterObject;

            return value.filter(callback);

        } else {
            return [];
        }

    },

    // Sort an array by a member and ASC / DESC
    sort: function (value, sortBy) {

        if (ArrayFormatters.__ensureArray(value)) {

            // Determine sort mode
            let sortData = [];
            if (typeof sortBy == "string") {

                for (var i = 1; i < arguments.length; i += 2) {

                    let member = arguments[i];
                    let direction = 'asc';

                    let splitMember = member.split(" ");
                    if (splitMember.length == 2) {
                        member = splitMember[0];
                        direction = splitMember[1];
                    }

                    let newSort: any = {member: member};
                    newSort.direction = ((arguments.length > i + 1) ? arguments[i + 1] : direction).toLowerCase();
                    sortData.push(newSort);
                }
            } else {
                sortData = sortBy;
            }


            let sortCallback = (firstElement, secondElement) => {
                for (var i = 0; i < sortData.length; i++) {
                    let item = sortData[i];

                    // Skip this check if the two match
                    if (firstElement[item.member] == secondElement[item.member])
                        continue;

                    if (item.direction == "asc") {
                        return firstElement[item.member] < secondElement[item.member] ? -1 : 1;
                    } else {
                        return firstElement[item.member] > secondElement[item.member] ? -1 : 1;
                    }
                }

                return 0;

            };

            sortCallback["sortData"] = sortData;

            // Use sort data to sort first and second element
            return value.sort(sortCallback);

        } else {
            return value;
        }
    },

    // Get all values of an array (designed for when a proxy)
    values: function (value) {
        if (value instanceof ArrayProxy) {
            return value.values;
        } else {
            return value;
        }
    },

    /**
     * Total count of an array if a proxy
     *
     * @param value
     */
    totalCount: function (value) {
        if (value instanceof ArrayProxy) {
            return value.totalCount;
        }
    },

    __ensureArray: function (value) {
        return value instanceof Array || value instanceof ArrayProxy
    }

}

export default ArrayFormatters;
