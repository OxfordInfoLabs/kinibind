import * as dayjs from "dayjs";
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat)

let DateFormatters = {

    date: function (value, format) {
        return dayjs(value).format(format);
    },

    // Subtract the number of periods from a date value
    dateSub(value, period, quantity) {
        let date = dayjs(value);
        return date.subtract(quantity, period);
    },

    // Add the number of periods to a date value
    dateAdd(value, period, quantity) {
        let date = dayjs(value);
        return date.add(quantity, period);
    }

};


export default DateFormatters;

