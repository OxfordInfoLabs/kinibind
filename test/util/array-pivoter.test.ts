import ArrayPivoter from "../../ts/util/array-pivoter";

describe('Array pivoter tests', function () {

    let data = [
        {
            "group": "Group 1",
            "label": "Colour",
            "altLabel": "Blend",
            "value": "Green"
        }, {
            "group": "Group 1",
            "label": "Shade",
            "altLabel": "Blend",
            "value": "Grass"
        },
        {
            "group": "Group 1",
            "label": "Shape",
            "altLabel": "Shape",
            "value": "Square"
        },
        {
            "group": "Group 2",
            "label": "Colour",
            "altLabel": "Blend",
            "value": "Red"
        },
        {
            "group": "Group 2",
            "label": "Shade",
            "altLabel": "Blend",
            "value": "Crimson"
        },
        {
            "group": "Group 2",
            "label": "Shape",
            "altLabel": "Shape",
            "value": "Circle"
        },
        {
            "group": "Group 3",
            "label": "Colour",
            "altLabel": "Blend",
            "value": "Orange"
        },
        {
            "group": "Group 3",
            "label": "Shade",
            "altLabel": "Blend",
            "value": "Burnt"
        }
    ];


    it('Can pivot simple single column dataset', () => {
        let pivoter: ArrayPivoter = new ArrayPivoter();

        let pivoted = pivoter.pivotArray(data, ["group"], "label", "value");
        expect(pivoted).toEqual([
            {
                "group": "Group 1",
                "Colour": "Green",
                "Shade": "Grass",
                "Shape": "Square"
            },
            {
                "group": "Group 2",
                "Colour": "Red",
                "Shade": "Crimson",
                "Shape": "Circle"
            },
            {
                "group": "Group 3",
                "Colour": "Orange",
                "Shade": "Burnt"
            }
        ]);

    });


    it('Will convert multiple values into arrays if encountered within groups', () => {
        let pivoter: ArrayPivoter = new ArrayPivoter();

        let pivoted = pivoter.pivotArray(data, ["group"], "altLabel", "value");
        expect(pivoted).toEqual([
            {
                "group": "Group 1",
                "Blend": ["Green", "Grass"],
                "Shape": "Square"
            },
            {
                "group": "Group 2",
                "Blend": ["Red", "Crimson"],
                "Shape": "Circle"
            },
            {
                "group": "Group 3",
                "Blend": ["Orange", "Burnt"]
            }
        ]);

    });



});