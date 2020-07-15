/**
 * Filtered proxy object
 */
import FilteredResults from "./filtered-results";

export default abstract class ArrayProxy {

    // Filters
    private filters: any = {};

    // Sort orders
    private sortOrders: any = {};

    // Offset
    private offset: number = 0;

    // Limit
    private limit: number = 1000000000;

    // Current Filter Hash
    private currentFilterHash = null;


    // Latest filtered results
    private results: FilteredResults = new FilteredResults([], 0);


    /**
     * Create an instance of this Array Proxy
     */
    public static create(sourceUrl) {

        // @ts-ignore
        let instance = new this();
        let object = [];

        return new Proxy(object, instance);

    }


    public get(target, property) {

        // Handle special internal property from framework
        if (property == "__rv") {
            return target["__rv"];
        }

        // Pass through everything else.
        return this.results.results[property];


    }


    /**
     * Worker method to be implemented by sub classes.  This should obtain the results and return the data
     * as a FilteredResults object.  This is modelled as a Promise to allow for asynchronous calls such as
     * server side AJAX.
     *
     * @param filters
     * @param sortOrders
     * @param offset
     * @param limit
     */
    protected abstract filterResults(filters, sortOrders, offset, limit): Promise<FilteredResults>;

}
