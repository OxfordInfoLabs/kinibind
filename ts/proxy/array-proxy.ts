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
     * Override forEach function
     *
     * @param callback
     */
    public forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any): void {
        this.loadData();
        Array.prototype.forEach.call(this.results.results, callbackfn, thisArg);
    }


    /**
     * Get length for array
     */
    public get length() {
        this.loadData();
        return this.results.results.length;
    }

    // Load data
    private loadData() {
        this.filterResults(this.filters, this.sortOrders, this.offset, this.limit).then(results => {
            this.results = results;
            this.currentFilterHash = Math.random();
        });
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
