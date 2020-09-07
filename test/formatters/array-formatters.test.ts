import ArrayFormatters from "../../ts/formatters/array-formatters";

describe('Array formatter tests', function () {


    it('Should be able to get array item by index if valid array passed', () => {

        expect(ArrayFormatters.item("Hello", 0)).toBeUndefined();
        expect(ArrayFormatters.item([],  0)).toBeUndefined();
        expect(ArrayFormatters.item([22], "Hello")).toBeUndefined();
        expect(ArrayFormatters.item([22], 0)).toEqual(22);
        expect(ArrayFormatters.item([22, 44], 1)).toEqual(44);

    });








});
