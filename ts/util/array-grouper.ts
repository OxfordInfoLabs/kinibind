/**
 * Array grouper for grouping array elements by members
 */
export default class ArrayGrouper {

    /**
     * Group an input array by the supplied grouping members
     *
     * @param array
     * @param groupingMembers
     */
    public groupArray(array: any[], groupingMembers: any[]): any {

        if (!(array instanceof Array))
            return {};

        // Loop through each grouping member
        let grouped = {};
        groupingMembers.forEach(groupingMember => {

            // Check to see if we need to split the data on a delimiter
            let splitMember = groupingMember.split(" SPLIT ");
            let delimiter = null;
            if (splitMember.length > 1) {
                groupingMember = splitMember[0];
                delimiter = splitMember[1];
            }

            // Loop through each item
            array.forEach(arrayItem => {
                if (arrayItem[groupingMember]) {

                    // If we have a split situation, split the member into multiple
                    let keys = [];
                    if (delimiter) {
                        keys = arrayItem[groupingMember].split(delimiter);
                    } else {
                        keys = [arrayItem[groupingMember]];
                    }

                    // Loop through each key and process each one.
                    keys.forEach(key => {
                        if (!grouped[key]) {
                            grouped[key] = [];
                        }
                        grouped[key].push(arrayItem);
                    });
                }
            });
        });


        return grouped;
    }

}