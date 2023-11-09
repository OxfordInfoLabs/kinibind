"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var array_formatters_1 = __importDefault(require("../../ts/formatters/array-formatters"));
describe('Array formatter tests', function () {
    it('Should be able to get array item by index if valid array passed', function () {
        expect(array_formatters_1.default.item("Hello", 0)).toBeUndefined();
        expect(array_formatters_1.default.item([], 0)).toBeUndefined();
        expect(array_formatters_1.default.item([22], "Hello")).toBeUndefined();
        expect(array_formatters_1.default.item([22], 0)).toEqual(22);
        expect(array_formatters_1.default.item([22, 44], 1)).toEqual(44);
    });
    it('Should be able to join valid array items together using glue', function () {
        expect(array_formatters_1.default.join('Hello', ',')).toEqual("Hello");
        expect(array_formatters_1.default.join([1, 2, 3], ",")).toEqual("1,2,3");
        expect(array_formatters_1.default.join(["John", "Sarah", "Paul"], "-")).toEqual("John-Sarah-Paul");
    });
    it("Should be able to concatenate arrays two arrays together", function () {
        expect(array_formatters_1.default.concat("Bing", "Bong")).toEqual([]);
        expect(array_formatters_1.default.concat([0, 1, 2], [3, 4, 5])).toEqual([0, 1, 2, 3, 4, 5]);
        expect(array_formatters_1.default.concat([0, 1, 2], ["my", "friend"])).toEqual([0, 1, 2, "my", "friend"]);
    });
    it("Should be able to slice arrays from a point and optionally with a length", function () {
        expect(array_formatters_1.default.slice("Bing", 2)).toEqual([]);
        expect(array_formatters_1.default.slice([0, 1, 2, 3, 4, 5, 6], 2)).toEqual([2, 3, 4, 5, 6]);
        expect(array_formatters_1.default.slice([0, 1, 2, 3, 4, 5, 6], 2, 2)).toEqual([2, 3]);
    });
    it("Should be able to get member values for an object array", function () {
        var objects = [
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
            }
        ];
        expect(array_formatters_1.default.memberValues("Mark", "name")).toEqual([]);
        expect(array_formatters_1.default.memberValues(objects, "name")).toEqual(["Mark", "James", "Paul"]);
        expect(array_formatters_1.default.memberValues(objects, "age")).toEqual([22, 44, 30]);
    });
    it("Should be able to merge values into a single array", function () {
        var bigArray = [
            [1, 2, 3, 4, 5, 6],
            [7, 8, 9, 10]
        ];
        // Invalid values
        expect(array_formatters_1.default.mergeValues("Mark")).toEqual([]);
        expect(array_formatters_1.default.mergeValues([1, 2, 3, 4, 5, 6])).toEqual([]);
        // Valid merge
        expect(array_formatters_1.default.mergeValues(bigArray)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    it("Should be able to get distinct values for an array", function () {
        // Invalid value
        expect(array_formatters_1.default.distinct("Hello")).toEqual([]);
        // Valid values
        expect(array_formatters_1.default.distinct([0, 1, 1, 1, 2])).toEqual([0, 1, 2]);
        expect(array_formatters_1.default.distinct(["The", "Big", "The", "Small"])).toEqual(["The", "Big", "Small"]);
    });
    it("Should be able to filter arrays of objects", function () {
        var data = [
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
        expect(array_formatters_1.default.filter("Mark", "test")).toEqual([]);
        // Unexpected filter value returns data intact.
        expect(array_formatters_1.default.filter(data, [])).toEqual(data);
        // Valid filters
        expect(array_formatters_1.default.filter(data, "category", "HR")).toEqual([
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
        expect(array_formatters_1.default.filter(data, "age", 45, "gte")).toEqual([
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
        var filterTags = ["Director"];
        expect(array_formatters_1.default.filter(data, "tags SPLIT ,", filterTags, 'in')).toEqual([
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
        expect(array_formatters_1.default.filter(data, "tags SPLIT ,", filterTags, 'in')).toEqual([
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
    it("Should be able to filter nested objects as well", function () {
        var data = [
            {
                "name": "Mark",
                "age": 33,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "General" }]
            }, {
                "name": "Bob",
                "age": 40,
                "category": {
                    "title": "Development"
                },
                "tags": [{ "title": "General" }, { "title": "Director" }]
            }, {
                "name": "Joff",
                "age": 60,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "Director" }, { "title": "Long-server" }]
            },
            {
                "name": "Markus",
                "age": 45,
                "category": {
                    "title": "Admin"
                },
                "tags": [{ "title": "Secretariat" }]
            }
        ];
        expect(array_formatters_1.default.filter(data, "category.title", "HR")).toEqual([
            {
                "name": "Mark",
                "age": 33,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "General" }]
            }, {
                "name": "Joff",
                "age": 60,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "Director" }, { "title": "Long-server" }]
            }
        ]);
        expect(array_formatters_1.default.filter(data, "category.title", "H", "like")).toEqual([
            {
                "name": "Mark",
                "age": 33,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "General" }]
            }, {
                "name": "Joff",
                "age": 60,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "Director" }, { "title": "Long-server" }]
            }
        ]);
        expect(array_formatters_1.default.filter(data, "tags.title", "General")).toEqual([
            {
                "name": "Mark",
                "age": 33,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "General" }]
            }, {
                "name": "Bob",
                "age": 40,
                "category": {
                    "title": "Development"
                },
                "tags": [{ "title": "General" }, { "title": "Director" }]
            }
        ]);
        expect(array_formatters_1.default.filter(data, "tags.title,category.title", "D", "like")).toEqual([
            {
                "name": "Bob",
                "age": 40,
                "category": {
                    "title": "Development"
                },
                "tags": [{ "title": "General" }, { "title": "Director" }]
            }, {
                "name": "Joff",
                "age": 60,
                "category": {
                    "title": "HR"
                },
                "tags": [{ "title": "Director" }, { "title": "Long-server" }]
            },
            {
                "name": "Markus",
                "age": 45,
                "category": {
                    "title": "Admin"
                },
                "tags": [{ "title": "Secretariat" }]
            }
        ]);
    });
    it('Should be able to group array of objects', function () {
        var data = [
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
        expect(array_formatters_1.default.group(data, "category")).toEqual({
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
        expect(array_formatters_1.default.group(data, "skills SPLIT ,")).toEqual({
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
    it('Should be able to group array of objects using nested property', function () {
        var data = [
            {
                "name": "Mark",
                "age": 33,
                "categories": [
                    {
                        "title": "Admin"
                    },
                    {
                        "title": "Management"
                    }
                ]
            }, {
                "name": "Bob",
                "age": 40,
                "categories": [
                    {
                        "title": "Technical"
                    },
                    {
                        "title": "Management"
                    }
                ]
            }, {
                "name": "Joff",
                "age": 60,
                "categories": [
                    {
                        "title": "Admin"
                    },
                    {
                        "title": "Management"
                    }
                ]
            }
        ];
        expect(array_formatters_1.default.group(data, "categories.title")).toEqual({
            "Admin": [{
                    "name": "Mark",
                    "age": 33,
                    "categories": [
                        {
                            "title": "Admin"
                        },
                        {
                            "title": "Management"
                        }
                    ]
                },
                {
                    "name": "Joff",
                    "age": 60,
                    "categories": [
                        {
                            "title": "Admin"
                        },
                        {
                            "title": "Management"
                        }
                    ]
                }],
            "Management": [{
                    "name": "Mark",
                    "age": 33,
                    "categories": [
                        {
                            "title": "Admin"
                        },
                        {
                            "title": "Management"
                        }
                    ]
                }, {
                    "name": "Bob",
                    "age": 40,
                    "categories": [
                        {
                            "title": "Technical"
                        },
                        {
                            "title": "Management"
                        }
                    ]
                },
                {
                    "name": "Joff",
                    "age": 60,
                    "categories": [
                        {
                            "title": "Admin"
                        },
                        {
                            "title": "Management"
                        }
                    ]
                }],
            "Technical": [{
                    "name": "Bob",
                    "age": 40,
                    "categories": [
                        {
                            "title": "Technical"
                        },
                        {
                            "title": "Management"
                        }
                    ]
                }]
        });
    });
});
