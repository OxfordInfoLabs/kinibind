/**
 * Debug formatters useful in development
 */
let DebugFormatters = {

    dump: function (value: any) {
        try {
            return JSON.stringify(value);
        } catch (e){
            console.log(value);
            return "NON-JSON value - see console logs";
        }
    }

};


export default DebugFormatters;