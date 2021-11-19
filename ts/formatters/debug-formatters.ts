/**
 * Debug formatters useful in development
 */
let DebugFormatters = {

    dump: function (value) {
        try {
            return JSON.stringify(value);
        } catch (e){
            return "NON-JSON value - see console logs";
        }
    }

};


export default DebugFormatters;