/**
 * Object operation formatters
 */
let ObjectFormatters = {

    member: function (value, member) {
        return value ? value[member] : null;
    },

    keys: function (value) {
        return value ? Object.keys(value) : [];
    },

    values: function (value) {
        if (value) {
            let values = [];
            Object.keys(value).forEach(key => {
                values.push(value[key]);
            })
            return values;
        } else {
            return [];
        }
    }


}

export default ObjectFormatters;