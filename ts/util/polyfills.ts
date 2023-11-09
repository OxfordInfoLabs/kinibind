

// Matches function
if (!Element.prototype.matches) {
    Element.prototype.matches = (<any>Element).prototype['msMatchesSelector'] ||
        Element.prototype['webkitMatchesSelector'];
}

// Closest function
if ((<any>window).Element && !Element.prototype.closest) {
    Element.prototype.closest =
        function (s: any) {
            var matches = ((<any>this).document || this.ownerDocument).querySelectorAll(s),
                i,
                el: any = this;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {
                }
                ;
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

// Includes function
String.prototype["includes"] = function (str) {
    var returnValue = false;

    if (this.indexOf(str) !== -1) {
        returnValue = true;
    }

    return returnValue;
}

// Foreach polyfill
if ((<any>window).NodeList && !NodeList.prototype.forEach) {
    (<any>NodeList.prototype).forEach = Array.prototype.forEach;
}

// Object values polyfill
// @ts-ignore
if (!Object.values) Object.values = o => Object.keys(o).map(k => o[k]);
