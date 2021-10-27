/**
 * Debug formatters useful in development
 */
let DebugFormatters = {

    dump: function (value) {
        try {
            return JSON.stringify(value);
        } catch (e){
            return "";
        }
    }

};


export default DebugFormatters;