import * as dayjs from "dayjs";

let DateFormatters = {

    date: function (value, format) {
        return dayjs(value).format(format);
    }

};


export default DateFormatters;

