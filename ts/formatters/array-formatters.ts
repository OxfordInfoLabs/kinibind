/**
 * Array formatting functions - operate solely on array objects.
 */
import ArrayFilterer from "../util/array-filterer";
import ArrayProxy from "../proxy/array-proxy";

let ArrayFormatters = {


    item: function (value, index) {

        if (ArrayFormatters.__ensureArray(value)) {

            if (value instanceof ArrayProxy)
                value = value.values;

            return value[index];
        } else {
            return undefined;
        }
    },

    join: function (value, joinString) {
        if (ArrayFormatters.__ensureArray(value)) {
            return value.join(joinString);
        } else {
            return value;
        }
    },

    concat: function (value, otherArray) {
        if (ArrayFormatters.__ensureArray(value) && ArrayFormatters.__ensureArray(otherArray)) {
            return value.concat(otherArray);
        }

        return [];
    },

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
        } else {
            return [];
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

            let callback = item => {
                return filterer.filterArray(item);
            };

            callback["filters"] = filterObject;

            return value.filter(callback);

        } else {
            return [];
        }

    },

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

    values: function (value) {
        if (value instanceof ArrayProxy) {
            return value.values;
        }
    },

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
