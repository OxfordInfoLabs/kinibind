/**
 * Filtered proxy object
 */
import FilteredResults from "./filtered-results";
import FilterQuery from "./filter-query";
import {filter} from "minimatch";

export default abstract class ArrayProxy {

    // Blank query object
    protected filterQuery: FilterQuery = new FilterQuery();

    // Parent proxy
    protected __parentProxy: ArrayProxy = null;

    /**
     * Array of forward proxies for this proxy
     */
    public proxies: any = {};

    // Loaded filter results for this proxy
    private results: FilteredResults = new FilteredResults([], 0);

    // Loaded
    public status: string = "PENDING";

    // Version field for triggering
    public version = 0;

    // Identification field
    public __arrayProxy = 1;

    /**
     * Implement slicing
     *
     * @param from
     * @param to
     */
    public slice(from: number, to?: number) {


        let newFilterData: any = {offset: from};
        if (to) {
            newFilterData.limit = to - from;
        }

        // Return a new forwarding array proxy
        return this.getProxy(newFilterData);
    }


    /**
     * Implement filtering
     *
     * @param callback
     */
    public filter(callback) {

        let newFilterData = {filters: {...this.filterQuery.filters, ...callback.filters}};
        return this.getProxy(newFilterData);

    }


    /**
     * Implement sorting
     *
     * @param callback
     */
    public sort(callback) {
        let newFilterData: any = {
            sortOrders: this.filterQuery.sortOrders.concat(callback.sortData)
        };

        return this.getProxy(newFilterData);

    }


    /**
     * Implement join
     *
     * @param joinString
     */
    public join(joinString: string) {
        return this.values.join(joinString);
    }


    /**
     * Implement concat
     *
     * @param otherArray
     */
    public concat(otherArray) {
        return this.values.concat(otherArray);
    }

    /**
     * Implement forEach for looping
     *
     * @param callback
     */
    public forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any): void {
        Array.prototype.forEach.call(this.values, callbackfn, thisArg);
    }


    /**
     * Get length for array
     */
    public get length() {
        return this.values.length;
    }


    /**
     * Get values for array
     */
    public get values() {
        this.loadData();
        return this.results.results;
    }

    /**
     * Get total count if available
     */
    public get totalCount() {
        this.loadData();
        return this.results.totalCount;
    }


    // Get a proxy / create one for a given filter query
    private getProxy(newFilterData: any) {

        // Construct a new filter query using the new data
        let filterQueryData = {...this.filterQuery, ...newFilterData};
        let newFilterQuery = new FilterQuery(filterQueryData);

        let hash = newFilterQuery.hash;

        if (!this.proxies[hash]) {
            this.proxies[hash] = new ForwardingArrayProxy(this.__parentProxy ? this.__parentProxy : this,
                newFilterQuery);
        }

        return this.proxies[hash];

    }


    // Load data
    private loadData() {

        if (this.status == "PENDING") {
            this.status = "LOADING";

            let parentProxy = this.__parentProxy ? this.__parentProxy : this;

            parentProxy.filterResults(this.filterQuery).then((filteredResults => {
                this.status = "LOADED";
                this.results = filteredResults;
                parentProxy.version = parentProxy.version + 1;
            }));

        }

    }

    /**
     * Worker method to be implemented by sub classes from a filter query.  This should obtain the results and return the data
     * as a FilteredResults object.  This is modelled as a Promise to allow for asynchronous calls such as
     * server side AJAX.
     *
     * @param filterQuery
     * @return Promise<FilteredResults>
     */
    public abstract filterResults(filterQuery: FilterQuery): Promise<FilteredResults>;

}

// Internal forwarding array proxy
class ForwardingArrayProxy extends ArrayProxy {

    /**
     * Constructed with a processing proxy and a filter query
     *
     * @param processingProxy
     * @param filterQuery
     */
    constructor(parentProxy: any, filterQuery: FilterQuery) {
        super();

        this.__parentProxy = parentProxy;
        this.filterQuery = filterQuery;
    }


    // This will call the parent proxy at all times
    public filterResults(filterQuery: FilterQuery): Promise<FilteredResults> {
        return this.__parentProxy.filterResults(filterQuery);
    }

}
