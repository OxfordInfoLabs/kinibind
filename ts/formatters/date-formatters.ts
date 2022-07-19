import * as dayjs from "dayjs";
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat)

let DateFormatters = {

    date: function (value, format) {
        return dayjs(value).format(format);
    }

};


export default DateFormatters;

