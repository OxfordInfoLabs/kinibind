"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dayjs = require("dayjs");
//dayjs.extend(<any>advancedFormat)
var DateFormatters = {
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
    dateSub: function (value, period, quantity) {
        var date = dayjs(value);
        return date.subtract(quantity, period);
    },
    // Add the number of periods to a date value
    dateAdd: function (value, period, quantity) {
        var date = dayjs(value);
        return date.add(quantity, period);
    },
    // Format a duration
    formattedDuration: function (value, sourceUnit, maxExpressions) {
        if (sourceUnit === void 0) { sourceUnit = "milliseconds"; }
        if (maxExpressions === void 0) { maxExpressions = 10; }
        // Firstly calculate the unit divisor
        var unitDivisor = null;
        DateFormatters.durations.forEach(function (duration) {
            if (duration.key == sourceUnit)
                unitDivisor = duration.multiplier;
        });
        // if we found a unit divisor, work through the expressions
        var expressions = [];
        if (unitDivisor) {
            for (var i = DateFormatters.durations.length - 1; i >= 0; i--) {
                var durationValue = Number(value) / DateFormatters.durations[i].multiplier * unitDivisor;
                if (durationValue >= 1) {
                    var duration = Math.floor(durationValue);
                    expressions.push(duration + " " + DateFormatters.durations[i].label + (duration > 1 ? "s" : ""));
                }
                if (expressions.length >= maxExpressions)
                    break;
            }
        }
        return expressions.join(" ");
    }
};
exports.default = DateFormatters;
