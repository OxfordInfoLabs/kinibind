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
     * Filter an input array using the passed filter object
     *
     * @param array
     */
    public filterArray(array) {

        let callback = item => {
            return this.filterArrayElement(item);
        };

        callback["filters"] = this.filterObject;

        return array.filter(callback);

    }


    /**
     * Filter an array using a filter object
     *
     * @param element any
     */
    public filterArrayElement(element) {

        let matches = true;

        // If no filter object
        if (this.filterObject == null) {
            return element;
        }

        /**
         * Loop through the keys
         */
        Object.keys(this.filterObject).forEach(filterKey => {

            let filterDef = this.filterObject[filterKey];

            if (!filterDef)
                return;

            let filterMemberKeys = (filterDef.member ? filterDef.member : filterKey).split(",");

            let filterMatch = false;

            // Loop through each key
            filterMemberKeys.forEach(filterMemberKey => {

                let splitMember = filterMemberKey.split(" SPLIT ");
                filterMemberKey = splitMember[0];

                filterMemberKey = filterMemberKey.split(".");

                let memberValue = element;

                filterMemberKey.forEach(segment => {

                    if (memberValue instanceof Array) {
                        let newValue = [];
                        memberValue.forEach(item => {
                            if (item)
                                newValue.push(item[segment]);
                        });
                        memberValue = newValue;
                    } else if (memberValue)
                        memberValue = memberValue[segment];
                });

                // If we have a delimiter split now
                if (memberValue && splitMember.length > 1) {
                    memberValue = memberValue.split(splitMember[1] || ",");
                }


                let filterValue = filterDef.value;

                let hasFilterValue = filterValue || (filterValue === 0) || (filterValue === false);

                let match;

                // Handle special set case
                if (filterDef.type == "set") {
                    match = hasFilterValue && (filterValue ? memberValue : !memberValue);
                } else {

                    match = !hasFilterValue || memberValue;

                    if (memberValue && hasFilterValue) {
                        match = this.filterMatch(filterDef, memberValue, filterValue);
                    }
                }

                // Or the filter matches together
                filterMatch = filterMatch || match;

            });

            // And the filter match to complete.
            matches = matches && filterMatch;

        });


        return matches;

    }


    private filterMatch(filterDef, memberValue, filterValue) {

        let match = false;

        let filterType = filterDef.type ? filterDef.type : "equals";

        // Handle special cases first and then allow for array member values for all of the others
        switch (filterType) {

            case "contains":
                match = (memberValue instanceof Array ? this.indexOf(memberValue, filterValue) >= 0 :
                    false);
                break;
            case "notContains":
                match = (memberValue instanceof Array ? this.indexOf(memberValue, filterValue) < 0 :
                    false);
                break;

            case "in":

                // Handle in case - this allows for the comparison to be an array in
                // which case an array intersection is performed.
                if (filterValue instanceof Array) {
                    if (memberValue instanceof Array) {

                        let matches = filterValue.filter((item) => {
                            return this.indexOf(memberValue, item) >= 0;
                        });

                        match = matches.length > 0;
                    } else {
                        match = this.indexOf(filterValue, memberValue) >= 0;
                    }
                } else {
                    match = false;
                }
                break;

            default:

                // Ensure we have an array of values to loop
                let memberValues = (memberValue instanceof Array) ? memberValue : [memberValue];

                for (var i = 0; i < memberValues.length && !match; i++) {

                    let memberValue = memberValues[i];

                    switch (filterType) {
                        case "equals":
                            match = (memberValue == filterValue);
                            break;
                        case "notequals":
                            match = (memberValue != filterValue);
                            break;
                        case "like":
                            match = memberValue.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
                            break;
                        case "startsWith":
                            match = memberValue.toLowerCase().startsWith(filterValue.toLowerCase());
                            break;
                        case "gte":
                            match = memberValue >= filterValue;
                            break;
                        case "gt":
                            match = memberValue > filterValue;
                            break;
                        case "lte":
                            match = memberValue <= filterValue;
                            break;
                        case "lt":
                            match = memberValue < filterValue;
                            break;

                    }
                }
        }
        return match;
    }


    // Index of which tolerates object value comparisons but still returns efficiently if not object
    private indexOf(sourceArray, targetValue) {
        if (typeof targetValue == "object") {
            let stringTarget = JSON.stringify(targetValue);
            for (let i = 0; i < sourceArray.length; i++) {
                if (stringTarget == JSON.stringify(sourceArray[i]))
                    return i;
            }
            return -1;
        } else {
            return sourceArray.indexOf(targetValue);
        }
    }


}




