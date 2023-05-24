/**
 * Tests for kinibind static
 */
import KinibindStatic from "../ts/kinibind-static";

const fs = require('fs');

describe('Kinibind static tests: ', function () {

    let kinibind = new KinibindStatic();

    it('Should leave none-kinibind strings as they are', () => {

        let content = fs.readFileSync("test/test-content/non-kinibind.html").toString();

        let parsed = kinibind.parse(content, {});

        expect(parsed).toEqual(content);

    });


    it('Should evaluate simple model literals', function () {

        let content = "<p>{text} - <span>{author}</span></p>";

        let parsed = kinibind.parse(content, {"text": "Hello world", "author": "Mark R"});
        expect(parsed).toEqual("<p>Hello world - <span>Mark R</span></p>");


        content = "<p>{'Test String'} - <span>{4}</span></p>";
        parsed = kinibind.parse(content, {});
        expect(parsed).toEqual("<p>Test String - <span>4</span></p>");
    });

    it('Should evaluate nested model properties', function () {

        let content = "<p>{author.name} - <span>{notes[1]}</span> {author.notes[0].text}</p>";

        let parsed = kinibind.parse(content, {
            author: {
                name: "Mark",
                notes: [
                    {
                        "text": "Bingo"
                    }
                ]
            },
            notes: [
                "First Note",
                "Second Note"
            ]
        });
        expect(parsed).toEqual("<p>Mark - <span>Second Note</span> Bingo</p>");


    });

    it('Should call built in formatters correctly', function () {
        expect(kinibind.parse("<p>{name | uppercase}</p>", {"name": "spongebob"})).toEqual("<p>SPONGEBOB</p>");
        expect(kinibind.parse("<p>{name | append ',' name}</p>", {"name": "spongebob"})).toEqual("<p>spongebob,spongebob</p>");
        expect(kinibind.parse("<p>{name | append ',' name | uppercase}</p>", {"name": "spongebob"})).toEqual("<p>SPONGEBOB,SPONGEBOB</p>");
    });

    it('Should evaluate adhoc attributes correctly with prefix', function () {

        let text = '<p><span k-class="classes" k-id="id | lowercase"></span><a k-href="\'https://\' | append url" k-id="\'mark\'">Test</a></p>';
        let evaluated = kinibind.parse(text, {classes: "text text-big", id: "HOME", url: "www.google.com"});
        expect(evaluated).toEqual('<p><span class="text text-big" id="home"></span><a id="mark" href="https://www.google.com">Test</a></p>')

    });


    it ('Should evaluate if statements at top level', function() {

    });


});
