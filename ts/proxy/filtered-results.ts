export default class FilteredResults {

    private _results: [];
    private _totalCount;

    /**
     * Constructed as part of array proxy logic.
     *
     * @param results
     * @param totalCount
     */
    constructor(results: [], totalCount) {
        this._results = results;
        this._totalCount = totalCount;
    }

    /**
     * Get the results as an array
     */
    get results(): [] {
        return this._results;
    }

    /**
     * Get the total count for these results.
     */
    get totalCount() {
        return this._totalCount;
    }
}
