import ArrayFormatters from "../../ts/formatters/array-formatters";

describe('Array formatter tests', function () {


    it('Should be able to get array item by index if valid array passed', () => {

        expect(ArrayFormatters.item("Hello", 0)).toBeUndefined();
        expect(ArrayFormatters.item([], 0)).toBeUndefined();
        expect(ArrayFormatters.item([22], "Hello")).toBeUndefined();
        expect(ArrayFormatters.item([22], 0)).toEqual(22);
        expect(ArrayFormatters.item([22, 44], 1)).toEqual(44);

    });


    it('Should be able to join valid array items together using glue', () => {

        expect(ArrayFormatters.join('Hello', ',')).toEqual("Hello");

        expect(ArrayFormatters.join([1, 2, 3], ",")).toEqual("1,2,3");
        expect(ArrayFormatters.join(["John", "Sarah", "Paul"], "-")).toEqual("John-Sarah-Paul");


    });


    it("Should be able to concatenate arrays two arrays together", () => {

        expect(ArrayFormatters.concat("Bing", "Bong")).toEqual([]);
        expect(ArrayFormatters.concat([0, 1, 2], [3, 4, 5])).toEqual([0, 1, 2, 3, 4, 5]);
        expect(ArrayFormatters.concat([0, 1, 2], ["my", "friend"])).toEqual([0, 1, 2, "my", "friend"]);

    });


    it("Should be able to slice arrays from a point and optionally with a length", () => {

        expect(ArrayFormatters.slice("Bing", 2)).toEqual([]);
        expect(ArrayFormatters.slice([0, 1, 2, 3, 4, 5, 6], 2)).toEqual([2, 3, 4, 5, 6]);
        expect(ArrayFormatters.slice([0, 1, 2, 3, 4, 5, 6], 2, 2)).toEqual([2, 3]);

    });

    it("Should be able to get member values for an object array", () => {

        let objects = [
            {
                name: "Mark",
                age: 22
            },
            {
                name: "James",
                age: 44
            },
            {
                name: "Paul",
                age: 30
            }];

        expect(ArrayFormatters.memberValues("Mark", "name")).toEqual([]);

        expect(ArrayFormatters.memberValues(objects, "name")).toEqual(["Mark", "James", "Paul"]);
        expect(ArrayFormatters.memberValues(objects, "age")).toEqual([22, 44, 30]);
        
    });
    
    
    
    


});
