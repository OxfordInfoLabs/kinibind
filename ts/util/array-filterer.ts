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
            let filterMemberKey = (filterDef.member ? filterDef.member : filterKey).split(".");

            let memberValue = element;
            filterMemberKey.forEach(segment => {
                if (memberValue)
                    memberValue = memberValue[segment];
            });


            let filterValue = filterDef.value;

            if (filterValue || (filterValue === 0) || (filterValue === false)) {

                let filterType = filterDef.type ? filterDef.type : "equals";

                switch (filterType) {
                    case "equals":
                        matches = matches && (memberValue instanceof Array ? memberValue.indexOf(filterValue) >= 0 :
                            memberValue == filterValue);

                        break;
                    case "like":
                        matches = matches && memberValue.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
                        break;
                    case "gte":
                        matches = matches && memberValue >= filterValue;
                        break;
                    case "gt":
                        matches = matches && memberValue > filterValue;
                        break;
                    case "lte":
                        matches = matches && memberValue <= filterValue;
                        break;
                    case "lt":
                        matches = matches && memberValue < filterValue;
                        break;

                }

            }

        });


        return matches;

    }


}




