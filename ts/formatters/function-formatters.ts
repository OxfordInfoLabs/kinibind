let FunctionFormatters = {

    // Function argument formatter - allows for arbitrary args to
    // be passed to a custom function
    args: function (fn: any) {
        let args = Array.prototype.slice.call(arguments, 1);
        return (event: any) => fn.apply(null, args.concat([event]));
    }

}

export default FunctionFormatters;
