/**
 * Filtered proxy object
 */
import FilteredResults from "./filtered-results";
import FilterQuery from "./filter-query";

export default abstract class ArrayProxy {

    // Blank query object
    protected filterQuery: FilterQuery = new FilterQuery();

    // Update timestamp
    private _timestamp = null;

    // Static result cache for results by hash.
    private static resultCache = {};
    private static fetchedResults = {};

    // Parent proxy
    protected parentProxy: ArrayProxy = null;


    // Ripple timestamp value up to top.
    public set timestamp(newValue) {
        if (this.parentProxy) {
            this.parentProxy.timestamp = newValue;
        } else {
            this._timestamp = newValue;
        }
    }


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
        return new ForwardingArrayProxy(this, newFilterData);
    }


    /**
     * Implement filtering
     *
     * @param callback
     */
    public filter(callback) {

        let newFilterData = {filters: {...this.filterQuery.filters, ...callback.filters}};
        return new ForwardingArrayProxy(this, newFilterData);

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

        return new ForwardingArrayProxy(this, newFilterData);

    }


    /**
     * Implement join
     *
     * @param joinString
     */
    public join(joinString: string) {
        this.loadData();
        return this.loadedResults.join(joinString);
    }


    /**
     * Implement concat
     *
     * @param otherArray
     */
    public concat(otherArray) {
        this.loadData();
        return this.loadedResults.concat(otherArray);
    }

    /**
     * Implement forEach for looping
     *
     * @param callback
     */
    public forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any): void {
        this.loadData();
        Array.prototype.forEach.call(this.loadedResults, callbackfn, thisArg);
    }


    /**
     * Get length for array
     */
    public get length() {
        this.loadData();
        return this.loadedResults.length;
    }


    /**
     * Get total count if available
     */
    public get totalCount() {
        this.loadData();
        if (ArrayProxy.resultCache[this.filterQuery.hash]) {
            return ArrayProxy.resultCache[this.filterQuery.hash].totalCount;
        } else {
            return "";
        }
    }

    // Get loaded results
    private get loadedResults() {
        if (ArrayProxy.resultCache[this.filterQuery.hash]) {
            return ArrayProxy.resultCache[this.filterQuery.hash].results;
        } else {
            return [];
        }
    }


    // Load data
    private loadData() {
        let hash = this.filterQuery.hash;
        if (!ArrayProxy.fetchedResults[hash]) {
            ArrayProxy.fetchedResults[hash] = 1;
            this.filterResults(this.filterQuery).then(results => {
                ArrayProxy.resultCache[hash] = results;
                this.timestamp = new Date().toUTCString();
            });
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
    constructor(parentProxy: any, newFilterData: any) {
        super();

        this.parentProxy = parentProxy;
        let filterQueryData = {...parentProxy.filterQuery, ...newFilterData};
        this.filterQuery = new FilterQuery(filterQueryData);
    }


    // This will call the parent proxy at all times
    public filterResults(filterQuery: FilterQuery): Promise<FilteredResults> {
        return this.parentProxy.filterResults(filterQuery);
    }

}
