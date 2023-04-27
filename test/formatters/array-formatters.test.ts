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


    it("Should be able to merge values into a single array", () => {

        let bigArray = [
            [1, 2, 3, 4, 5, 6],
            [7, 8, 9, 10]
        ];


        // Invalid values
        expect(ArrayFormatters.mergeValues("Mark")).toEqual([]);
        expect(ArrayFormatters.mergeValues([1, 2, 3, 4, 5, 6])).toEqual([]);

        // Valid merge
        expect(ArrayFormatters.mergeValues(bigArray)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);


    });


    it("Should be able to get distinct values for an array", () => {

        // Invalid value
        expect(ArrayFormatters.distinct("Hello")).toEqual([]);

        // Valid values
        expect(ArrayFormatters.distinct([0, 1, 1, 1, 2])).toEqual([0, 1, 2]);
        expect(ArrayFormatters.distinct(["The", "Big", "The", "Small"])).toEqual(["The", "Big", "Small"]);


    });


    it("Should be able to filter arrays of objects", () => {


        let data = [
            {
                "name": "Mark",
                "age": 33,
                "category": "HR",
                "tags": "General"
            }, {
                "name": "Bob",
                "age": 40,
                "category": "Development",
                "tags": "General,Director"
            }, {
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "tags": "Director,Long-server"
            },
            {
                "name": "Markus",
                "age": 45,
                "category": "Admin",
                "tags": "Secretariat"
            }
        ];


        // Invalid filter data yields blank array
        expect(ArrayFormatters.filter("Mark", "test")).toEqual([]);

        // Unexpected filter value returns data intact.
        expect(ArrayFormatters.filter(data, [])).toEqual(data);

        // Valid filters
        expect(ArrayFormatters.filter(data, "category", "HR")).toEqual([
            {
                "name": "Mark",
                "age": 33,
                "category": "HR",
                "tags": "General"
            }, {
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "tags": "Director,Long-server"
            }
        ]);


        expect(ArrayFormatters.filter(data, "age", 45, "gte")).toEqual([
            {
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "tags": "Director,Long-server"
            },
            {
                "name": "Markus",
                "age": 45,
                "category": "Admin",
                "tags": "Secretariat"
            }
        ]);


        // Try an example using SPLIT functionality
        let filterTags = ["Director"];
        expect(ArrayFormatters.filter(data, "tags SPLIT ,", filterTags, 'in')).toEqual([
            {
                "name": "Bob",
                "age": 40,
                "category": "Development",
                "tags": "General,Director"
            }, {
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "tags": "Director,Long-server"
            }
        ]);

        filterTags = ["Long-server", "Secretariat"];
        expect(ArrayFormatters.filter(data, "tags SPLIT ,", filterTags, 'in')).toEqual([
            {
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "tags": "Director,Long-server"
            },
            {
                "name": "Markus",
                "age": 45,
                "category": "Admin",
                "tags": "Secretariat"
            }
        ]);

    });

    it('Should be able to group array of objects', () => {

        let data = [
            {
                "name": "Mark",
                "age": 33,
                "category": "HR",
                "skills": "Typing,Management"
            }, {
                "name": "Bob",
                "age": 40,
                "category": "Development",
                "skills": "Typing"
            }, {
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "skills": "Management,Personnel,Retail"
            },
            {
                "name": "Markus",
                "age": 45,
                "category": "Admin",
                "skills": "Personnel,Filing"
            }
        ];


        expect(ArrayFormatters.group(data, "category")).toEqual({
            "Admin": [
                {
                    "name": "Markus",
                    "age": 45,
                    "category": "Admin",
                    "skills": "Personnel,Filing"
                }
            ],
            "Development": [
                {
                    "name": "Bob",
                    "age": 40,
                    "category": "Development",
                    "skills": "Typing"
                }
            ],
            "HR": [
                {
                    "name": "Mark",
                    "age": 33,
                    "category": "HR",
                    "skills": "Typing,Management"
                },
                {
                    "name": "Joff",
                    "age": 60,
                    "category": "HR",
                    "skills": "Management,Personnel,Retail"
                }
            ]

        });

        expect(ArrayFormatters.group(data, "skills SPLIT ,")).toEqual({

            "Filing": [{
                "name": "Markus",
                "age": 45,
                "category": "Admin",
                "skills": "Personnel,Filing"
            }],
            "Management": [{
                "name": "Mark",
                "age": 33,
                "category": "HR",
                "skills": "Typing,Management"
            },
                {
                    "name": "Joff",
                    "age": 60,
                    "category": "HR",
                    "skills": "Management,Personnel,Retail"
                }],
            "Personnel": [{
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "skills": "Management,Personnel,Retail"
            }, {
                "name": "Markus",
                "age": 45,
                "category": "Admin",
                "skills": "Personnel,Filing"
            }],
            "Retail": [{
                "name": "Joff",
                "age": 60,
                "category": "HR",
                "skills": "Management,Personnel,Retail"
            }],
            "Typing": [{
                "name": "Mark",
                "age": 33,
                "category": "HR",
                "skills": "Typing,Management"
            }, {
                "name": "Bob",
                "age": 40,
                "category": "Development",
                "skills": "Typing"
            }]


        });

    });


});
