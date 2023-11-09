/**
 * Object operation formatters
 */

let ObjectFormatters = {

    member: {
        read: function (value: any, member: any) {
            return value ? value[member] : null;
        }
    },

    keys: function (value: any) {
        return value ? Object.keys(value) : [];
    },

    values: function (value:any) {
        if (value) {
            let values: any = [];
            Object.keys(value).forEach(key => {
                values.push(value[key]);
            })
            return values;
        } else {
            return [];
        }
    },

    // Combine multiple objects using their members via the spread operator
    combine: function (value:any) {
        let object = {...value};
        for (var arg = 1; arg < arguments.length; arg++) {
            if (typeof arguments[arg] == "object")
                object = {...object, ...arguments[arg]};
        }
        return object;
    },


    // Create a blank object from any input
    blankObject: function (value:any) {
        return {};
    }


}

export default ObjectFormatters;
