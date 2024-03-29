import {sha256} from 'js-sha256';

/**
 * Filter query data class
 */
export default class FilterQuery {

    // Filters
    public filters: any = {};

    // Sort orders
    public sortOrders: any = [];

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

        // @ts-ignore
        let filterString =  JSON.stringify(this.filters);

        let sortString = "";
        this.sortOrders.forEach((sort: any) => {
            sortString += sort.member + sort.direction + "|";
        });


        // @ts-ignore
        return sha256(filterString + sortString + String(this.offset) + String(this.limit));
    }
}
