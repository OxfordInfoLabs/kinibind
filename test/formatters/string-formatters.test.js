"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var string_formatters_1 = __importDefault(require("../../ts/formatters/string-formatters"));
var js_sha256_1 = require("js-sha256");
var md5 = __importStar(require("js-md5"));
describe('String formatter tests', function () {
    it('Should be able to md5 hash a string', function () {
        expect(string_formatters_1.default.md5("MARKYBABES")).toEqual(md5("MARKYBABES"));
    });
    it('Should be able to sha256 hash a string', function () {
        expect(string_formatters_1.default.hash("MARKYBABES")).toEqual((0, js_sha256_1.sha256)("MARKYBABES"));
    });
    it('Should be able to convert html to text', function () {
        expect(string_formatters_1.default.htmlToText("<p>Hello world</p>")).toEqual("Hello world");
    });
});
