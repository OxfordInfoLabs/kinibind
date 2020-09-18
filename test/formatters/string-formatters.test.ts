import StringFormatters from "../../ts/formatters/string-formatters";
import {sha256} from "js-sha256";
import * as md5 from "js-md5";

describe('String formatter tests', function () {

    it('Should be able to md5 hash a string', () => {

        expect(StringFormatters.md5("MARKYBABES")).toEqual(md5("MARKYBABES"));

    });

    it('Should be able to sha256 hash a string', () => {

        expect(StringFormatters.hash("MARKYBABES")).toEqual(sha256("MARKYBABES"));

    });

});
