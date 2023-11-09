/**
 * Array formatting functions - operate solely on array objects.
 */
import ArrayFilterer from "../util/array-filterer";
import ArrayProxy from "../proxy/array-proxy";
import ArrayGrouper from "../util/array-grouper";

let ArrayFormatters = {

    // Extract item from array at index
    item: function (value: any, index: any) {

        if (ArrayFormatters.__checkArray(value)) {

            if (value instanceof ArrayProxy)
                value = value.values;

            return value[index];
        } else {
            return undefined;
        }
    },

    // Join an array to produce a string using the join string argument
    join: function (value: any, joinString: any) {
        if (ArrayFormatters.__checkArray(value)) {
            return value.join(joinString);
        } else {
            return value;
        }
    },

    // Concatenate arrays together
    concat: function (value: any, otherArray: any) {
        if (ArrayFormatters.__checkArray(value) && ArrayFormatters.__checkArray(otherArray)) {
            return value.concat(otherArray);
        }

        return [];
    },

    // Get a slice of an array
    slice: function (value: any, from: any, length?: any) {

        // Convert to numbers
        from = Number(from);
        length = length ? Number(length) : null;

        if (ArrayFormatters.__checkArray(value)) {
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
    memberValues: function (value: any, member: any) {
        let values: any = [];
        if (ArrayFormatters.__checkArray(value)) {
            value.forEach((value: any) => {
                if (value instanceof Object) {
                    values.push(value[member]);
                }
            });
        }
        return values;
    },


    // Merge all values in an array (assumed to be arrays) into a single array
    mergeValues: function (value: any) {
        let values: any = [];
        if (ArrayFormatters.__checkArray(value)) {
            value.forEach((arrayItem: any) => {
                if (arrayItem instanceof Array) {
                    values = values.concat(arrayItem);
                }
            });
        }

        return values;
    },

    // Get distinct items in an array
    distinct: function (value: any, compareMember = null) {
        if (ArrayFormatters.__checkArray(value)) {

            let compareValues: any = [];
            if (compareMember) {
                compareValues = ArrayFormatters.memberValues(value, compareMember);
            }

            return value.filter((value: any, index: any, self: any) => {
                if (compareMember) {
                    return compareValues.indexOf(value[compareMember]) === index;
                } else
                    return self.indexOf(value) === index;
            });
        } else {
            return [];
        }
    },

    // Filter an array based upon a filter member / value and filter type
    filter: function (value: any, filter: any, filterValue = null, filterType = "equals") {

        if (ArrayFormatters.__checkArray(value)) {

            let filterObject: any = {};
            if (typeof filter == "string") {
                filterObject[filter] = {
                    value: filterValue,
                    type: filterType
                };
            } else {
                filterObject = filter;
            }


            let filterer = new ArrayFilterer(filterObject);
            return filterer.filterArray(value);


        } else {
            return [];
        }

    },

    // Sort an array by a member and ASC / DESC
    sort: function (value: any, sortBy: any) {

        if (ArrayFormatters.__checkArray(value)) {

            // Determine sort mode
            let sortData: any = [];
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


            let sortCallback: any = (firstElement: any, secondElement: any) => {
                for (var i = 0; i < sortData.length; i++) {
                    let item: any = sortData[i];

                    // Skip this check if the two match
                    if (firstElement[item.member] == secondElement[item.member])
                        continue;

                    if (item.direction == "asc") {
                        return !firstElement[item.member] || (firstElement[item.member] < secondElement[item.member]) ? -1 : 1;
                    } else {
                        return !secondElement[item.member] || (firstElement[item.member] > secondElement[item.member]) ? -1 : 1;
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

    // Group by one or more members
    group: function (value: any, ...arg: any) {
        let grouper = new ArrayGrouper();
        return grouper.groupArray(value, arg);
    },

    // Get all values of an array (designed for when a proxy)
    values: function (value: any) {
        if (value instanceof ArrayProxy) {
            return value.values;
        } else {
            return value;
        }
    },

    /**
     * Sum the values of an array
     *
     * @param value
     */
    sum: function (value: any) {
        let sum = 0;
        value.forEach((valueEntry: any) => {
            sum += Number(valueEntry);
        });
        return sum;
    },

    /**
     * Total count of an array if a proxy
     *
     * @param value
     */
    totalCount: function (value: any) {
        if (value instanceof ArrayProxy) {
            return value.totalCount;
        }
    },

    // Wrap one or more items as an array
    wrapAsArray: function (value: any, ...otherValues: any) {
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
    ensureArray: function (value: any) {
        return ArrayFormatters.__checkArray(value) ? value : [];
    },

    __checkArray: function (value: any) {
        return value instanceof Array || value instanceof ArrayProxy
    }

}

export default ArrayFormatters;
