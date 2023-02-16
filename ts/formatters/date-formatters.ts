import * as dayjs from "dayjs";
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat)

let DateFormatters = {

    durations: [
        {
            "key": "milliseconds",
            "label": "Millisecond",
            "multiplier": 1
        },
        {
            "key": "seconds",
            "label": "Second",
            "multiplier": 1000
        },
        {
            "key": "minutes",
            "label": "Minute",
            "multiplier": 60000
        },
        {
            "key": "hours",
            "label": "Hour",
            "multiplier": 3600000
        },
        {
            "key": "days",
            "label": "Day",
            "multiplier": 86400000
        }
    ],


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
    },

    // Format a duration
    formattedDuration(value, sourceUnit = "milliseconds", maxExpressions = 10) {

        // Firstly calculate the unit divisor
        let unitDivisor = null;
        DateFormatters.durations.forEach((duration: any) => {
            if (duration.key == sourceUnit)
                unitDivisor = duration.multiplier;
        });


        // if we found a unit divisor, work through the expressions
        let expressions = [];
        if (unitDivisor) {
            for (let i = DateFormatters.durations.length - 1; i >= 0; i--) {
                let durationValue = Number(value) / DateFormatters.durations[i].multiplier * unitDivisor;
                if (durationValue >= 1) {
                    let duration = Math.floor(durationValue);
                    expressions.push(duration + " " + DateFormatters.durations[i].label + (duration > 1 ? "s" : ""));
                }
                if (expressions.length >= maxExpressions)
                    break;
            }
        }

        return expressions.join(" ");

    }


};


export default DateFormatters;

