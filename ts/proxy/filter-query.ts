import {sha256} from 'js-sha256';

/**
 * Filter query data class
 */
export default class FilterQuery {

    // Filters
    public filters: any = {};

    // Sort orders
    public sortOrders: any = {};

    // Offset
    public offset: number = 0;

    // Limit
    public limit: number = 1000000000;


    // Constructor
    constructor(data?: any) {
        if (data) {
            this.filters = data.filters;
            this.sortOrders = data.sortOrders;
            this.offset = data.offset;
            this.limit = data.limit;
        }
    }

    get hash(): string {

        let filterString = "";

        // @ts-ignore
        Object.values(this.filters).forEach((value:any) => {
            filterString += value.value + "|";
        });

        // @ts-ignore
        return sha256(filterString + Object.values(this.sortOrders).join("|") + String(this.offset) + String(this.limit));
    }
}
