"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Array grouper for grouping array elements by members
 */
var ArrayGrouper = /** @class */ (function () {
    function ArrayGrouper() {
    }
    /**
     * Group an input array by the supplied grouping members
     *
     * @param array
     * @param groupingMembers
     */
    ArrayGrouper.prototype.groupArray = function (array, groupingMembers) {
        if (!(array instanceof Array))
            return {};
        // Loop through each grouping member
        var grouped = {};
        groupingMembers.forEach(function (groupingMember) {
            // Check to see if we need to split the data on a delimiter
            var splitMember = groupingMember.split(" SPLIT ");
            var delimiter = null;
            if (splitMember.length > 1) {
                groupingMember = splitMember[0];
                delimiter = splitMember[1];
            }
            // Loop through each item
            array.forEach(function (arrayItem) {
                // If we have a split situation, split the member into multiple
                var keys = [];
                if (delimiter) {
                    if (arrayItem[groupingMember])
                        keys = arrayItem[groupingMember].split(delimiter);
                }
                else {
                    var splitMember_1 = groupingMember.split(".");
                    keys = [arrayItem];
                    splitMember_1.forEach(function (memberPath) {
                        var newItems = [];
                        keys.forEach(function (currentItem, index) {
                            if (currentItem[memberPath]) {
                                var subItems = currentItem[memberPath];
                                if (subItems instanceof Array) {
                                    newItems = newItems.concat(subItems);
                                }
                                else {
                                    newItems.push(subItems);
                                }
                            }
                        });
                        keys = newItems;
                    });
                }
                // Loop through each key and process each one.
                keys.forEach(function (key) {
                    if (!grouped[key]) {
                        grouped[key] = [];
                    }
                    grouped[key].push(arrayItem);
                });
            });
        });
        return grouped;
    };
    return ArrayGrouper;
}());
exports.default = ArrayGrouper;
