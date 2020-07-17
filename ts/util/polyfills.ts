import 'promise-polyfill/src/polyfill';

// Matches function
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype['msMatchesSelector'] ||
        Element.prototype['webkitMatchesSelector'];
}

// Closest function
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i,
                el = this;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {};
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

// Includes function
String.prototype.includes = function (str) {
    var returnValue = false;

    if (this.indexOf(str) !== -1) {
        returnValue = true;
    }

    return returnValue;
}

// Foreach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    (<any>NodeList.prototype).forEach = Array.prototype.forEach;
}

// Object values polyfill
// @ts-ignore
if (!Object.values) Object.values = o=>Object.keys(o).map(k=>o[k]);
