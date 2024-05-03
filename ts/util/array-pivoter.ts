/**
 * Generic class to pivot an array.  It uses an array of grouping columns to identify sets of rows for pivot
 * and then uses a pivot column and values column to generate the new columns based upon values in the grouped set.
 *
 */
export default class ArrayPivoter {

    /**
     * Pivot an array, using the grouping columns to generate new rows and generating columns based upon the
     * pivot column with corresponding values from the values column.
     *
     * @param array
     * @param groupingColumns
     * @param pivotColumn
     * @param valuesColumn
     */
    public pivotArray(array: any[], groupingColumns: string[], pivotColumn: string, valuesColumn: string): any {

        let pivotItems: any = {};

        let groupingValuesCounts = {};
        array.forEach(item => {

            // Create a grouping hash and grab
            let groupingValues = {};
            let groupingValuesString = "";
            groupingColumns.forEach(groupingColumn => {
                groupingValues[groupingColumn] = item[groupingColumn];
                groupingValuesString += item[groupingColumn];
            });

            // If no item, create it.
            if (!pivotItems[groupingValuesString]) {
                pivotItems[groupingValuesString] = groupingValues;
                groupingValuesCounts[groupingValuesString] = {};
            }

            // If a pivot value exists, add the pivot values, handling the case when we need to create array wrappers for multiple items.
            if (item[pivotColumn]) {
                if (!groupingValuesCounts[groupingValuesString][item[pivotColumn]]) {
                    groupingValuesCounts[groupingValuesString][item[pivotColumn]] = 1;
                    pivotItems[groupingValuesString][item[pivotColumn]] = item[valuesColumn];
                } else {

                    // If moving up to 2 items, create array wrapper
                    if (groupingValuesCounts[groupingValuesString][item[pivotColumn]] == 1) {
                        pivotItems[groupingValuesString][item[pivotColumn]] = [pivotItems[groupingValuesString][item[pivotColumn]]];
                    }

                    groupingValuesCounts[groupingValuesString][item[pivotColumn]]++;
                    pivotItems[groupingValuesString][item[pivotColumn]].push(item[valuesColumn]);

                }

            }


        });


        return Object.values(pivotItems);


    }


}