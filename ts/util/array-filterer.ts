/**
 * Array filterer worker - implements standard array filtering
 */
export default class ArrayFilterer {

    // Filter object
    private filterObject;

    /**
     * Construct with filter object
     */
    constructor(filterObject) {
        this.filterObject = filterObject;
    }


    /**
     * Filter an array using a filter object
     *
     * @param filterObject
     */
    public filterArray(element) {

        let matches = true;

        /**
         * Loop through the keys
         */
        Object.keys(this.filterObject).forEach(filterKey => {

            let filterDef = this.filterObject[filterKey];

            let filterMemberKeys = (filterDef.member ? filterDef.member : filterKey).split(",");

            let filterMatch = false;

            // Loop through each key
            filterMemberKeys.forEach(filterMemberKey => {

                filterMemberKey = filterMemberKey.split(".");

                let memberValue = element;
                filterMemberKey.forEach(segment => {
                    if (memberValue)
                        memberValue = memberValue[segment];
                });

                let filterValue = filterDef.value;

                let hasFilterValue = filterValue || (filterValue === 0) || (filterValue === false);

                let match = !hasFilterValue || memberValue;

                if (memberValue && hasFilterValue) {
                    match = this.filterMatch(filterDef, memberValue, filterValue);
                }

                // Or the filter matches together
                filterMatch = filterMatch || match;

            });

            // And the filter match to complete.
            matches = matches && filterMatch;

        });


        return matches;

    }


    private filterMatch(filterDef,  memberValue, filterValue) {

        let match = false;

        let filterType = filterDef.type ? filterDef.type : "equals";

        switch (filterType) {
            case "equals":
                match = (memberValue instanceof Array ? memberValue.indexOf(filterValue) >= 0 :
                    memberValue == filterValue);
                break;
            case "like":
                match = memberValue.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
                break;
            case "startsWith":
                match = memberValue.toLowerCase().startsWith(filterValue.toLowerCase());
                break;
            case "gte":
                match =memberValue >= filterValue;
                break;
            case "gt":
                match = memberValue > filterValue;
                break;
            case "lte":
                match =  memberValue <= filterValue;
                break;
            case "lt":
                match = memberValue < filterValue;
                break;
            case "in":
                match = (filterValue instanceof Array) ? filterValue.indexOf(memberValue) >= 0 : false;
                break;

        }
        return match;
    }
}




