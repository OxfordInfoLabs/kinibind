/**
 * Object operation formatters
 */
import Kinibind from "../kinibind";

let ObjectFormatters = {

    member: {
        read: function (value, member) {
            return value ? value[member] : null;
        }
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
