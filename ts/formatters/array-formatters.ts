/**
 * Array formatting functions - operate solely on array objects.
 */
let ArrayFormatters = {


    item: function (value, index) {
        if (value instanceof Array) {
            return value[index];
        }
    },

    join: function (value, joinString) {
        if (value instanceof Array) {
            return value.join(joinString);
        }
    },

    memberValues: function (value, member) {
        let values = [];
        if (value instanceof Array) {
            value.forEach(value => {
                if (value instanceof Object) {
                    values.push(value[member]);
                }
            });
        }
        return values;
    },

    slice: function (value, from, length) {
        if (value instanceof Array) {
            if (length) {
                return value.slice(from, from + length);
            } else {
                return value.slice(from);
            }
        } else {
            return [];
        }
    }

}

export default ArrayFormatters;
