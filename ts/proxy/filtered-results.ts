export default class FilteredResults {

    private _results:  any[];
    private _totalCount;

    /**
     * Constructed as part of array proxy logic.
     *
     * @param results
     * @param totalCount
     */
    constructor(results: any[], totalCount: any) {
        this._results = results;
        this._totalCount = totalCount;
    }

    /**
     * Get the results as an array
     */
    get results():  any[] {
        return this._results;
    }

    /**
     * Get the total count for these results.
     */
    get totalCount() {
        return this._totalCount;
    }
}
