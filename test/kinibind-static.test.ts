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


    it('Should evaluate if statements at top level', function () {

        let text = '<p><span k-if="test">Hello world</span></p>';
        expect(kinibind.parse(text, {})).toEqual('<p></p>');
        expect(kinibind.parse(text, {"test": 1})).toEqual('<p><span>Hello world</span></p>');

    });


    it('Should evaluate each statements at top level', function () {

        let text = '<p><span k-each-test="testItems">{test}</span></p>';
        expect(kinibind.parse(text, {"testItems": ["a", "b", "c"]})).toEqual('<p><span>a</span><span>b</span><span>c</span></p>');

    });

    it('Should be able to evaluate nested if and each statements', function () {

        let text = '<p><span k-each-test="tests"><span k-if="$index | gt 0">{test}</span></span></p>';
        expect(kinibind.parse(text, {"tests": ["a", "b", "c"]})).toEqual('<p><span></span><span><span>b</span></span><span><span>c</span></span></p>')

    });

    it('Should be able to evaluate each inside if', function () {
        let text = '<p><span k-if="true"><span k-each-test="tests">{test}</span></span></p>';
        expect(kinibind.parse(text, {"tests": ["a", "b", "c"]})).toEqual('<p><span><span>a</span><span>b</span><span>c</span></span></p>')

    });

    it('Should be able to evaluate if inside each with set', function(){

        let text = '<p k-each-item="items" k-set-index="$index"><span k-if="index | equals 1">{$index}</span></p>';
        expect(kinibind.parse(text, {"items": ["a", "b", "c"]})).toEqual('<p></p><p><span>1</span></p><p></p>');

    });


    it('Can evaluate if and each on same element', function () {
        let text = '<p><span k-if="true" k-each-test="tests">{test}</span></p>';
        expect(kinibind.parse(text, {"tests": ["a", "b", "c"]})).toEqual('<p><span>a</span><span>b</span><span>c</span></p>')
    });


    it('Can evaluate directives on top level element', function () {
        let text = '<p k-each-test="tests" k-style="\'color:red;\'">{test}</p>';
        expect(kinibind.parse(text, {"tests": ["a", "b", "c"]})).toEqual('<p style="color:red;">a</p><p style="color:red;">b</p><p style="color:red;">c</p>')
    });

    it('Can evaluate text node on element', function () {
        let text = '<p k-text="\'Hello World\'"></p>';
        expect(kinibind.parse(text, {})).toEqual('<p>Hello World</p>');
    });

    it('Can evaluate html node on element', function () {
        let text = '<p k-html="\'<p>Hello World</p>\'"></p>';
        expect(kinibind.parse(text, {})).toEqual('<p><p>Hello World</p></p>');
    });

    it('Can conditionally add classes according using class- syntax', function () {
        let text = '<p class="bold white" k-class-blue="true" k-class-green="false">Hello World</p>';
        expect(kinibind.parse(text, {})).toEqual('<p class="bold white blue">Hello World</p>');

        text = '<p k-class="\'plain green\'" k-class-purple="true" k-class-green="false">Hello World</p>';
        expect(kinibind.parse(text, {})).toEqual('<p class="plain purple">Hello World</p>');

    });

    it('Can set model properties when set syntax passed', function () {
        let text = '<p k-set-monkey="\'gorilla\'"></p>';
        let model = {};
        expect(kinibind.parse(text, model)).toEqual('<p></p>');
        expect(model).toEqual({monkey: "gorilla"});
    });


    it('Can strip tags if boolean passed', function () {
        let text = 'body { <block k-if="true">color: red;</block> };';

        // Without stripping
        expect(kinibind.parse(text, {}, "k", ["{{", "}}"])).toEqual('body { <block>color: red;</block> };');

        expect(kinibind.parse(text, {}, "k", ["{{", "}}"], true)).toEqual('body { color: red; };');
    });


    it('Can add custom formatters statically and they become available', function () {

        let customFormatters = {
            "bong": function (value) {
                return "bong";
            }
        }

        // Inject some formatters
        KinibindStatic.addFormatters(customFormatters);

        // Check formatter fires
        let text = '<p k-text="1 | bong"></p>';
        expect(kinibind.parse(text, {})).toEqual('<p>bong</p>');


    });

    it ('Can cope with complex formatting expressions with values containing spaces, pipes, etc', function(){

        let text = '<p k-text="1 | append \' \' \'|\' \'-prefixed\'"></p>'
        expect(kinibind.parse(text, {})).toEqual('<p>1 |-prefixed</p>');
    });

    it('Can set scoped values on element with each directive', function(){

        let text = '<p k-each-item="items" k-set-square="item | multiply item">{square}</p>';
        expect(kinibind.parse(text, {"items": [1,2,3]})).toEqual('<p>1</p><p>4</p><p>9</p>')
    });



});
