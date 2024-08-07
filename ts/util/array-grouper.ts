/**
 * Array grouper for grouping array elements by members
 */
export default class ArrayGrouper {

    /**
     * Group an input array by the supplied grouping members.  If single item inclusion is
     * set to true each item is only included in one group (defaults to false)
     *
     * @param array
     * @param groupingMembers
     */
    public groupArray(array: any[], groupingMembers: any[], singleItemInclusion = false): any {

        if (!(array instanceof Array))
            return {};

        // Loop through each grouping member
        let grouped: any = {};
        let allGroupedItemIds: any = {};



        groupingMembers.forEach((groupingMember: any) => {

           // Check to see if we need to split the data on a delimiter
            let splitMember = groupingMember.split(" SPLIT ");
            let delimiter: any = null;
            if (splitMember.length > 1) {
                groupingMember = splitMember[0];
                delimiter = splitMember[1];
            }


            // Loop through each item
            array.forEach(arrayItem => {

                // If we have a split situation, split the member into multiple
                let keys: any = [];
                if (delimiter) {
                    if (arrayItem[groupingMember])
                        keys = arrayItem[groupingMember].split(delimiter);

                } else {
                    let splitMember = groupingMember.split(".");
                    keys = [arrayItem];
                    splitMember.forEach((memberPath: any) => {
                        let newItems: any = [];

                        keys.forEach((currentItem: any, index: number) => {
                            if (currentItem[memberPath]) {
                                let subItems = currentItem[memberPath];
                                if (subItems instanceof Array) {
                                    newItems = newItems.concat(subItems);
                                } else {
                                    newItems.push(subItems);
                                }
                            }
                        });
                        keys = newItems;
                    });

                }

                // Loop through each key and process each one.
                keys.forEach((key: any) => {

                    // If we are only using single inclusion, skip items already grouped
                    if (singleItemInclusion && allGroupedItemIds[arrayItem.id])
                        return;

                    if (!grouped[key]) {
                        grouped[key] = [];
                    }
                    grouped[key].push(arrayItem);
                    allGroupedItemIds[arrayItem.id] = 1;

                });

            });
        });



        return grouped;
    }

}