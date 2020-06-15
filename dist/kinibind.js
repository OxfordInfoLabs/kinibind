!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Kinibind=e():t.Kinibind=e()}(window,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){t.exports=function(){"use strict";var t=["prefix","templateDelimiters","rootInterface","preloadData","handler"],e=["binders","formatters","adapters"],n=/^'.*'$|^".*"$/;function i(t){var e=0,i=t;return n.test(t)?i=t.slice(1,-1):"true"===t?i=!0:"false"===t?i=!1:"null"===t?i=null:"undefined"===t?i=void 0:isNaN(t)?e=1:i=Number(t),{type:e,value:i}}function r(t,e){for(var n,i=t.length,r=0,s=0,a=e[0],o=e[1];s<i;){if((r=t.indexOf(a,s))<0){n&&n.push({type:0,value:t.slice(s)});break}if(n||(n=[]),r>0&&s<r&&n.push({type:0,value:t.slice(s,r)}),s=r+a.length,(r=t.indexOf(o,s))<0){var u=t.slice(s-o.length),c=n[n.length-1];c&&0===c.type?c.value+=u:n.push({type:0,value:u});break}var h=t.slice(s,r).trim();n.push({type:1,value:h}),s=r+o.length}return n}var s,a,o,u={binders:{},formatters:{},adapters:{},_prefix:"rv",_fullPrefix:"rv-",get prefix(){return this._prefix},set prefix(t){this._prefix=t,this._fullPrefix=t+"-"},parseTemplate:r,parseType:i,templateDelimiters:["{","}"],rootInterface:".",preloadData:!0,handler:function(t,e,n){this.call(t,e,n.view.models)},fallbackBinder:function(t,e){null!=e?t.setAttribute(this.type,e):t.removeAttribute(this.type)},configure:function(t){var n=this;t&&Object.keys(t).forEach((function(i){var r=t[i];e.indexOf(i)>-1?Object.keys(r).forEach((function(t){n[i][t]=r[t]})):n[i]=r}))}};function c(t){return"object"==typeof t&&null!==t}var h=function(){function t(t,e,n){this.keypath=e,this.callback=n,this.objectPath=[],this.parse(),this.obj=this.getRootObject(t),c(this.target=this.realize())&&this.set(!0,this.key,this.target,this.callback)}t.updateOptions=function(t){s=t.adapters,a=Object.keys(s),o=t.rootInterface},t.tokenize=function(t,e){var n,i,r=[],s={i:e,path:""};for(n=0;n<t.length;n++)i=t.charAt(n),~a.indexOf(i)?(r.push(s),s={i:i,path:""}):s.path+=i;return r.push(s),r};var e=t.prototype;return e.parse=function(){var e,n;a.length||function(t){throw new Error("[Observer] "+t)}("Must define at least one adapter interface."),~a.indexOf(this.keypath[0])?(n=this.keypath[0],e=this.keypath.substr(1)):(n=o,e=this.keypath),this.tokens=t.tokenize(e,n),this.key=this.tokens.pop()},e.realize=function(){for(var t,e,n=this.obj,i=-1,r=0;r<this.tokens.length;r++)e=this.tokens[r],c(n)?(void 0!==this.objectPath[r]?n!==(t=this.objectPath[r])&&(this.set(!1,e,t,this),this.set(!0,e,n,this),this.objectPath[r]=n):(this.set(!0,e,n,this),this.objectPath[r]=n),n=this.get(e,n)):(-1===i&&(i=r),(t=this.objectPath[r])&&this.set(!1,e,t,this));return-1!==i&&this.objectPath.splice(i),n},e.sync=function(){var t,e,n;(t=this.realize())!==this.target?(c(this.target)&&this.set(!1,this.key,this.target,this.callback),c(t)&&this.set(!0,this.key,t,this.callback),e=this.value(),this.target=t,((n=this.value())!==e||n instanceof Function)&&this.callback.sync()):t instanceof Array&&this.callback.sync()},e.value=function(){if(c(this.target))return this.get(this.key,this.target)},e.setValue=function(t){c(this.target)&&s[this.key.i].set(this.target,this.key.path,t)},e.get=function(t,e){return s[t.i].get(e,t.path)},e.set=function(t,e,n,i){var r=t?"observe":"unobserve";s[e.i][r](n,e.path,i)},e.unobserve=function(){for(var t,e,n=0;n<this.tokens.length;n++)e=this.tokens[n],(t=this.objectPath[n])&&this.set(!1,e,t,this);c(this.target)&&this.set(!1,this.key,this.target,this.callback)},e.getRootObject=function(t){var e,n;if(!t.$parent)return t;for(e=this.tokens.length?this.tokens[0].path:this.key.path,n=t;n.$parent&&void 0===n[e];)n=n.$parent;return n},t}(),f=/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g,l=/\s+/,d=function(){function t(t,e,n,i,r,s,a){this.view=t,this.el=e,this.type=n,this.keypath=i,this.binder=r,this.arg=s,this.formatters=a,this.formatterObservers={},this.model=void 0}var e=t.prototype;return e.observe=function(t,e){return new h(t,e,this)},e.parseTarget=function(){if(this.keypath){var t=i(this.keypath);0===t.type?this.value=t.value:(this.observer=this.observe(this.view.models,this.keypath),this.model=this.observer.target)}else this.value=void 0},e.parseFormatterArguments=function(t,e){var n=this;return t.map(i).map((function(t,i){var r=t.type,s=t.value;if(0===r)return s;n.formatterObservers[e]||(n.formatterObservers[e]={});var a=n.formatterObservers[e][i];return a||(a=n.observe(n.view.models,s),n.formatterObservers[e][i]=a),a.value()}))},e.formattedValue=function(t){var e=this;return this.formatters.reduce((function(t,n,i){var r=n.match(f),s=r.shift(),a=e.view.options.formatters[s],o=e.parseFormatterArguments(r,i);return a&&a.read instanceof Function?t=a.read.apply(a,[t].concat(o)):a instanceof Function&&(t=a.apply(void 0,[t].concat(o))),t}),t)},e.eventHandler=function(t){var e=this,n=e.view.options.handler;return function(i){n.call(t,this,i,e)}},e.set=function(t){t=t instanceof Function&&!this.binder.function?this.formattedValue(t.call(this.model)):this.formattedValue(t);var e=this.binder.routine||this.binder;e instanceof Function&&e.call(this,this.el,t)},e.sync=function(){this.observer?(this.model=this.observer.target,this.set(this.observer.value())):this.set(this.value)},e.publish=function(){var t=this;if(this.observer){var e=this.formatters.reduceRight((function(e,n,i){var r=n.split(l),s=r.shift(),a=t.view.options.formatters[s],o=t.parseFormatterArguments(r,i);return a&&a.publish&&(e=a.publish.apply(a,[e].concat(o))),e}),this.getValue(this.el));this.observer.setValue(e)}},e.bind=function(){this.parseTarget(),this.binder.hasOwnProperty("bind")&&this.binder.bind.call(this,this.el),this.view.options.preloadData&&this.sync()},e.unbind=function(){var t=this;this.binder.unbind&&this.binder.unbind.call(this,this.el),this.observer&&this.observer.unobserve(),Object.keys(this.formatterObservers).forEach((function(e){var n=t.formatterObservers[e];Object.keys(n).forEach((function(t){n[t].unobserve()}))})),this.formatterObservers={}},e.update=function(t){void 0===t&&(t={}),this.observer&&(this.model=this.observer.target),this.binder.update&&this.binder.update.call(this,t)},e.getValue=function(t){return this.binder&&this.binder.getValue?this.binder.getValue.call(this,t):function(t){if("checkbox"===t.type)return t.checked;if("select-multiple"===t.type){for(var e,n=[],i=0;i<t.options.length;i++)(e=t.options[i]).selected&&n.push(e.value);return n}return t.value}(t)},t}(),p={routine:function(t,e){t.data=null!=e?e:""}},b=/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g,v=function t(e,n){var i=!1;if(3===n.nodeType){var s=r(n.data,u.templateDelimiters);if(s){for(var a=0;a<s.length;a++){var o=s[a],c=document.createTextNode(o.value);n.parentNode.insertBefore(c,n),1===o.type&&e.buildBinding(c,null,o.value,p,null)}n.parentNode.removeChild(n)}i=!0}else 1===n.nodeType&&(i=e.traverse(n));if(!i)for(var h=0;h<n.childNodes.length;h++)t(e,n.childNodes[h])},y=function(t,e){var n=t.binder&&t.binder.priority||0;return(e.binder&&e.binder.priority||0)-n},g=function(t){return t.trim()},m=function(){function t(t,e,n){t.jquery||t instanceof Array?this.els=t:this.els=[t],this.models=e,this.options=n,this.build()}var e=t.prototype;return e.buildBinding=function(t,e,n,i,r){var s=n.match(b).map(g),a=s.shift();this.bindings.push(new d(this,t,e,a,i,r,s))},e.build=function(){this.bindings=[];var t,e,n=this.els;for(t=0,e=n.length;t<e;t++)v(this,n[t]);this.bindings.sort(y)},e.traverse=function(t){for(var e,n,i,r,s=u._fullPrefix,a="SCRIPT"===t.nodeName||"STYLE"===t.nodeName,o=t.attributes,c=[],h=this.options.starBinders,f=0,l=o.length;f<l;f++){var d=o[f];if(0===d.name.indexOf(s)){if(e=d.name.slice(s.length),r=void 0,!(n=this.options.binders[e]))for(var p=0;p<h.length;p++)if(i=h[p],e.slice(0,i.length-1)===i.slice(0,-1)){n=this.options.binders[i],r=e.slice(i.length-1);break}if(n||(n=u.fallbackBinder),n.block)return this.buildBinding(t,e,d.value,n,r),t.removeAttribute(d.name),!0;c.push({attr:d,binder:n,type:e,arg:r})}}for(var b=0;b<c.length;b++){var v=c[b];this.buildBinding(t,v.type,v.attr.value,v.binder,v.arg),t.removeAttribute(v.attr.name)}return a},e.bind=function(){this.bindings.forEach((function(t){t.bind()}))},e.unbind=function(){this.bindings.forEach((function(t){t.unbind()}))},e.sync=function(){this.bindings.forEach((function(t){t.sync()}))},e.publish=function(){this.bindings.forEach((function(t){t.binder&&t.binder.publishes&&t.publish()}))},e.update=function(t){var e=this;void 0===t&&(t={}),Object.keys(t).forEach((function(n){e.models[n]=t[n]})),this.bindings.forEach((function(e){e.update&&e.update(t)}))},t}(),k=["push","pop","shift","unshift","sort","reverse","splice"],O={counter:0,weakmap:{},weakReference:function(t){if(!t.hasOwnProperty("__rv")){var e=this.counter++;Object.defineProperty(t,"__rv",{value:e})}return this.weakmap[t.__rv]||(this.weakmap[t.__rv]={callbacks:{}}),this.weakmap[t.__rv]},cleanupWeakReference:function(t,e){Object.keys(t.callbacks).length||t.pointers&&Object.keys(t.pointers).length||delete this.weakmap[e]},stubFunction:function(t,e){var n=t[e],i=this.weakReference(t),r=this.weakmap;t[e]=function(){for(var e=arguments.length,s=new Array(e),a=0;a<e;a++)s[a]=arguments[a];var o=n.apply(t,s);return Object.keys(i.pointers).forEach((function(t){var e=i.pointers[t];r[t]&&r[t].callbacks[e]instanceof Array&&r[t].callbacks[e].forEach((function(t){t.sync()}))})),o}},observeArray:function(t,e,n){var i=this;if(t instanceof Array){var r=this.weakReference(t);r.pointers||(r.pointers={},k.forEach((function(e){i.stubFunction(t,e)}))),r.pointers[e]||(r.pointers[e]=[]),-1===r.pointers[e].indexOf(n)&&r.pointers[e].push(n)}},unobserveArray:function(t,e,n){if(t instanceof Array&&null!=t.__rv){var i=this.weakmap[t.__rv];if(i){var r=i.pointers[e];if(r){var s=r.indexOf(n);s>-1&&r.splice(s,1),r.length||delete i.pointers[e],this.cleanupWeakReference(i,t.__rv)}}}},observe:function(t,e,n){var i,r=this,s=this.weakReference(t).callbacks;if(!s[e]){s[e]=[];var a=Object.getOwnPropertyDescriptor(t,e);a&&(a.get||a.set||!a.configurable)||(i=t[e],Object.defineProperty(t,e,{enumerable:!0,get:function(){return i},set:function(n){if(n!==i){r.unobserveArray(i,t.__rv,e),i=n;var s=r.weakmap[t.__rv];if(s){var a=s.callbacks[e];a&&a.forEach((function(t){t.sync()})),r.observeArray(n,t.__rv,e)}}}}))}-1===s[e].indexOf(n)&&s[e].push(n),this.observeArray(t[e],t.__rv,e)},unobserve:function(t,e,n){var i=this.weakmap[t.__rv];if(i){var r=i.callbacks[e];if(r){var s=r.indexOf(n);s>-1&&(r.splice(s,1),r.length||(delete i.callbacks[e],this.unobserveArray(t[e],t.__rv,e))),this.cleanupWeakReference(i,t.__rv)}}},get:function(t,e){return t[e]},set:function(t,e,n){t[e]=n}},_=function(t){return null!=t?t.toString():void 0};function $(t,e,n){var i=t.el.cloneNode(!0),r=new m(i,e,t.view.options);return r.bind(),t.marker.parentNode.insertBefore(i,n),r}var w={"on-*":{function:!0,priority:1e3,unbind:function(t){this.handler&&t.removeEventListener(this.arg,this.handler)},routine:function(t,e){this.handler&&t.removeEventListener(this.arg,this.handler),this.handler=this.eventHandler(e),t.addEventListener(this.arg,this.handler)}},"each-*":{block:!0,priority:4e3,bind:function(t){this.marker?this.iterated.forEach((function(t){t.bind()})):(this.marker=document.createComment(" tinybind: "+this.type+" "),this.iterated=[],t.parentNode.insertBefore(this.marker,t),t.parentNode.removeChild(t))},unbind:function(t){this.iterated&&this.iterated.forEach((function(t){t.unbind()}))},routine:function(t,e){var n=this,i=this.arg;e=e||[];var r=t.getAttribute("index-property")||"$index";e.forEach((function(t,e){var s={$parent:n.view.models};s[r]=e,s[i]=t;var a=n.iterated[e];if(a)if(a.models[i]!==t){for(var o,u,c=e+1;c<n.iterated.length;c++)if((u=n.iterated[c]).models[i]===t){o=c;break}void 0!==o?(n.iterated.splice(o,1),n.marker.parentNode.insertBefore(u.els[0],a.els[0]),u.models[r]=e):u=$(n,s,a.els[0]),n.iterated.splice(e,0,u)}else a.models[r]=e;else{var h=n.marker;n.iterated.length&&(h=n.iterated[n.iterated.length-1].els[0]),a=$(n,s,h.nextSibling),n.iterated.push(a)}})),this.iterated.length>e.length&&function(t,e){for(var n=0;n<t;n++)e()}(this.iterated.length-e.length,(function(){var t=n.iterated.pop();t.unbind(),n.marker.parentNode.removeChild(t.els[0])})),"OPTION"===t.nodeName&&this.view.bindings.forEach((function(t){t.el===n.marker.parentNode&&"value"===t.type&&t.sync()}))},update:function(t){var e=this,n={};Object.keys(t).forEach((function(i){i!==e.arg&&(n[i]=t[i])})),this.iterated.forEach((function(t){t.update(n)}))}},"class-*":function(t,e){var n=" "+t.className+" ";!e==n.indexOf(" "+this.arg+" ")>-1&&(t.className=e?t.className+" "+this.arg:n.replace(" "+this.arg+" "," ").trim())},text:function(t,e){t.textContent=null!=e?e:""},html:function(t,e){t.innerHTML=null!=e?e:""},show:function(t,e){t.style.display=e?"":"none"},hide:function(t,e){t.style.display=e?"none":""},enabled:function(t,e){t.disabled=!e},disabled:function(t,e){t.disabled=!!e},checked:{publishes:!0,priority:2e3,bind:function(t){var e=this;this.callback||(this.callback=function(){e.publish()}),t.addEventListener("change",this.callback)},unbind:function(t){t.removeEventListener("change",this.callback)},routine:function(t,e){"radio"===t.type?t.checked=_(t.value)===_(e):t.checked=!!e}},value:{publishes:!0,priority:3e3,bind:function(t){if(this.isRadio="INPUT"===t.tagName&&"radio"===t.type,!this.isRadio){this.event=t.getAttribute("event-name")||("SELECT"===t.tagName?"change":"input");var e=this;this.callback||(this.callback=function(){e.publish()}),t.addEventListener(this.event,this.callback)}},unbind:function(t){this.isRadio||t.removeEventListener(this.event,this.callback)},routine:function(t,e){if(this.isRadio)t.setAttribute("value",e);else if("select-multiple"===t.type){if(e instanceof Array)for(var n=0;n<t.length;n++){var i=t[n];i.selected=e.indexOf(i.value)>-1}}else _(e)!==_(t.value)&&(t.value=null!=e?e:"")}},if:{block:!0,priority:4e3,bind:function(t){this.marker?!1===this.bound&&this.nested&&this.nested.bind():(this.marker=document.createComment(" tinybind: "+this.type+" "+this.keypath+" "),this.attached=!1,t.parentNode.insertBefore(this.marker,t),t.parentNode.removeChild(t)),this.bound=!0},unbind:function(){this.nested&&(this.nested.unbind(),this.bound=!1)},routine:function(t,e){!!e!==this.attached&&(e?(this.nested||(this.nested=new m(t,this.view.models,this.view.options),this.nested.bind()),this.marker.parentNode.insertBefore(t,this.marker.nextSibling),this.attached=!0):(t.parentNode.removeChild(t),this.attached=!1))},update:function(t){this.nested&&this.nested.update(t)}}};function j(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function x(t){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function M(t,e){return(M=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function A(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function E(t,e,n){return(E=A()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);var r=new(Function.bind.apply(t,i));return n&&M(r,n.prototype),r}).apply(null,arguments)}function D(t){var e="function"==typeof Map?new Map:void 0;return(D=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,i)}function i(){return E(t,arguments,x(this).constructor)}return i.prototype=Object.create(t.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),M(i,t)})(t)}var S=function(t){var e,n;function i(){return t.apply(this,arguments)||this}n=t,(e=i).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n;var r,s,a,o=i.prototype;return o.connectedCallback=function(){var t=this.constructor.__templateEl.content.cloneNode(!0);for(this.__tinybindView=u.bind(t,this);this.firstChild;)this.removeChild(this.firstChild);this.appendChild(t)},o.disconnectedCallback=function(){this.__tinybindView.unbind()},o.attributeChangedCallback=function(t,e,n){e!==n&&(this[this.constructor.__propAttributeMap[t]]=n)},r=i,a=[{key:"observedAttributes",get:function(){var t=this.template;if(!t)throw new Error("No template declared for "+this.name);this.__templateEl=document.createElement("template"),this.__templateEl.innerHTML=t;var e=this.__propAttributeMap={},n=[],i=this.properties;return i&&Object.keys(i).forEach((function(t){var r=i[t],s="string"==typeof r?r:t;e[s]=t,n.push(s)})),n}}],(s=null)&&j(r.prototype,s),a&&j(r,a),i}(D(HTMLElement));return u.binders=w,u.formatters={watch:function(t){return t},not:function(t){return!t},negate:function(t){return!t}},u.adapters["."]=O,u.Component=S,u.bind=function(n,i,r){var s={};i=i||{},r=r||{},e.forEach((function(t){s[t]=Object.create(null),r[t]&&Object.keys(r[t]).forEach((function(e){s[t][e]=r[t][e]})),Object.keys(u[t]).forEach((function(e){s[t][e]||(s[t][e]=u[t][e])}))})),t.forEach((function(t){var e=r[t];s[t]=null!=e?e:u[t]})),s.starBinders=Object.keys(s.binders).filter((function(t){return t.indexOf("*")>0})),h.updateOptions(s);var a=new m(n,i,s);return a.bind(),a},u}()},function(t,e,n){t.exports=function(){"use strict";var t="millisecond",e="second",n="minute",i="hour",r="day",s="week",a="month",o="quarter",u="year",c=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,h=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,f=function(t,e,n){var i=String(t);return!i||i.length>=e?t:""+Array(e+1-i.length).join(n)+t},l={s:f,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),i=Math.floor(n/60),r=n%60;return(e<=0?"+":"-")+f(i,2,"0")+":"+f(r,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),i=t.clone().add(n,a),r=e-i<0,s=t.clone().add(n+(r?-1:1),a);return Number(-(n+(e-i)/(r?i-s:s-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(c){return{M:a,y:u,w:s,d:r,D:"date",h:i,m:n,s:e,ms:t,Q:o}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},p="en",b={};b[p]=d;var v=function(t){return t instanceof k},y=function(t,e,n){var i;if(!t)return p;if("string"==typeof t)b[t]&&(i=t),e&&(b[t]=e,i=t);else{var r=t.name;b[r]=t,i=r}return!n&&i&&(p=i),i||!n&&p},g=function(t,e){if(v(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new k(n)},m=l;m.l=y,m.i=v,m.w=function(t,e){return g(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var k=function(){function f(t){this.$L=this.$L||y(t.locale,null,!0),this.parse(t)}var l=f.prototype;return l.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(m.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var i=e.match(c);if(i)return n?new Date(Date.UTC(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)):new Date(i[1],i[2]-1,i[3]||1,i[4]||0,i[5]||0,i[6]||0,i[7]||0)}return new Date(e)}(t),this.init()},l.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},l.$utils=function(){return m},l.isValid=function(){return!("Invalid Date"===this.$d.toString())},l.isSame=function(t,e){var n=g(t);return this.startOf(e)<=n&&n<=this.endOf(e)},l.isAfter=function(t,e){return g(t)<this.startOf(e)},l.isBefore=function(t,e){return this.endOf(e)<g(t)},l.$g=function(t,e,n){return m.u(t)?this[e]:this.set(n,t)},l.year=function(t){return this.$g(t,"$y",u)},l.month=function(t){return this.$g(t,"$M",a)},l.day=function(t){return this.$g(t,"$W",r)},l.date=function(t){return this.$g(t,"$D","date")},l.hour=function(t){return this.$g(t,"$H",i)},l.minute=function(t){return this.$g(t,"$m",n)},l.second=function(t){return this.$g(t,"$s",e)},l.millisecond=function(e){return this.$g(e,"$ms",t)},l.unix=function(){return Math.floor(this.valueOf()/1e3)},l.valueOf=function(){return this.$d.getTime()},l.startOf=function(t,o){var c=this,h=!!m.u(o)||o,f=m.p(t),l=function(t,e){var n=m.w(c.$u?Date.UTC(c.$y,e,t):new Date(c.$y,e,t),c);return h?n:n.endOf(r)},d=function(t,e){return m.w(c.toDate()[t].apply(c.toDate("s"),(h?[0,0,0,0]:[23,59,59,999]).slice(e)),c)},p=this.$W,b=this.$M,v=this.$D,y="set"+(this.$u?"UTC":"");switch(f){case u:return h?l(1,0):l(31,11);case a:return h?l(1,b):l(0,b+1);case s:var g=this.$locale().weekStart||0,k=(p<g?p+7:p)-g;return l(h?v-k:v+(6-k),b);case r:case"date":return d(y+"Hours",0);case i:return d(y+"Minutes",1);case n:return d(y+"Seconds",2);case e:return d(y+"Milliseconds",3);default:return this.clone()}},l.endOf=function(t){return this.startOf(t,!1)},l.$set=function(s,o){var c,h=m.p(s),f="set"+(this.$u?"UTC":""),l=(c={},c.day=f+"Date",c.date=f+"Date",c[a]=f+"Month",c[u]=f+"FullYear",c[i]=f+"Hours",c[n]=f+"Minutes",c[e]=f+"Seconds",c[t]=f+"Milliseconds",c)[h],d=h===r?this.$D+(o-this.$W):o;if(h===a||h===u){var p=this.clone().set("date",1);p.$d[l](d),p.init(),this.$d=p.set("date",Math.min(this.$D,p.daysInMonth())).toDate()}else l&&this.$d[l](d);return this.init(),this},l.set=function(t,e){return this.clone().$set(t,e)},l.get=function(t){return this[m.p(t)]()},l.add=function(t,o){var c,h=this;t=Number(t);var f=m.p(o),l=function(e){var n=g(h);return m.w(n.date(n.date()+Math.round(e*t)),h)};if(f===a)return this.set(a,this.$M+t);if(f===u)return this.set(u,this.$y+t);if(f===r)return l(1);if(f===s)return l(7);var d=(c={},c[n]=6e4,c[i]=36e5,c[e]=1e3,c)[f]||1,p=this.$d.getTime()+t*d;return m.w(p,this)},l.subtract=function(t,e){return this.add(-1*t,e)},l.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",i=m.z(this),r=this.$locale(),s=this.$H,a=this.$m,o=this.$M,u=r.weekdays,c=r.months,f=function(t,i,r,s){return t&&(t[i]||t(e,n))||r[i].substr(0,s)},l=function(t){return m.s(s%12||12,t,"0")},d=r.meridiem||function(t,e,n){var i=t<12?"AM":"PM";return n?i.toLowerCase():i},p={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:m.s(o+1,2,"0"),MMM:f(r.monthsShort,o,c,3),MMMM:f(c,o),D:this.$D,DD:m.s(this.$D,2,"0"),d:String(this.$W),dd:f(r.weekdaysMin,this.$W,u,2),ddd:f(r.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(s),HH:m.s(s,2,"0"),h:l(1),hh:l(2),a:d(s,a,!0),A:d(s,a,!1),m:String(a),mm:m.s(a,2,"0"),s:String(this.$s),ss:m.s(this.$s,2,"0"),SSS:m.s(this.$ms,3,"0"),Z:i};return n.replace(h,(function(t,e){return e||p[t]||i.replace(":","")}))},l.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},l.diff=function(t,r,c){var h,f=m.p(r),l=g(t),d=6e4*(l.utcOffset()-this.utcOffset()),p=this-l,b=m.m(this,l);return b=(h={},h[u]=b/12,h[a]=b,h[o]=b/3,h[s]=(p-d)/6048e5,h.day=(p-d)/864e5,h[i]=p/36e5,h[n]=p/6e4,h[e]=p/1e3,h)[f]||p,c?b:m.a(b)},l.daysInMonth=function(){return this.endOf(a).$D},l.$locale=function(){return b[this.$L]},l.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),i=y(t,e,!0);return i&&(n.$L=i),n},l.clone=function(){return m.w(this.$d,this)},l.toDate=function(){return new Date(this.valueOf())},l.toJSON=function(){return this.isValid()?this.toISOString():null},l.toISOString=function(){return this.$d.toISOString()},l.toString=function(){return this.$d.toUTCString()},f}();return g.prototype=k.prototype,g.extend=function(t,e){return t(e,k,g),g},g.locale=y,g.isDayjs=v,g.unix=function(t){return g(1e3*t)},g.en=b[p],g.Ls=b,g}()},function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return y}));var i=n(0),r=n.n(i);function s(t,e){t.checked=e}var a={publishes:!0,bind:function(t){let e=this.observer,n=null;t.getAttribute("toggle-values")&&(n=t.getAttribute("toggle-values").split(",")),this.callback||(this.callback=function(t){if(t.stopPropagation(),n){let t=n.indexOf(e.value());t++,t%=n.length,e.setValue(n[t])}else e.setValue(!e.value())}),t.addEventListener("click",this.callback)},unbind:function(t){t.removeEventListener("click",this.callback)}};var o={observe:function(t,e,n){e=e.substr(0,e.length-1).replace(/'/g,"").replace(/"/g,""),t.on&&t.on("change:"+e,n)},unobserve:function(t,e,n){e=e.substr(0,e.length-1).replace(/'/g,"").replace(/"/g,""),t.off&&t.off("change:"+e,n)},get:function(t,e){return t[e=e.substr(0,e.length-1).replace(/'/g,"").replace(/"/g,"")]},set:function(t,e,n){t[e=e.substr(0,e.length-1).replace(/'/g,"").replace(/"/g,"")]=n}},u=n(1);var c={date:function(t,e){return u(t).format(e)}};var h={concat:function(t,e){let n="";for(var i=0;i<arguments.length;i++)n+=arguments[i];return n},split:function(t,e=","){return t?t.split(e):[]},substring:function(t,e,n){return t?t.substring(e,n):""},words:function(t){return t?t.split(/\W/).length:0}};var f={item:function(t,e){if(t instanceof Array)return t[e]},join:function(t,e){if(t instanceof Array)return t.join(e)},memberValues:function(t,e){let n=[];return t instanceof Array&&t.forEach(t=>{t instanceof Object&&n.push(t[e])}),n},slice:function(t,e,n){return t instanceof Array?n?t.slice(e,e+n):t.slice(e):[]}};var l={contains:function(t,e){return t instanceof Array?t.indexOf(e)>=0:!!t&&t.includes(e)},length:function(t,e){return(t instanceof Array||!!t)&&t.length}};var d={add:function(t,e){return t+e},subtract:function(t,e){return t-e},multiply:function(t,e){return t*e},divide:function(t,e){return t/e},modulo:function(t,e){return t%e},decimalplaces:function(t,e){return t.toFixed(e)},floor:function(t){return Math.floor(t)},ceil:function(t){return Math.ceil(t)},round:function(t){return Math.round(t)}};var p={equals:function(t,e){return t==e},notequals:function(t,e){return t!=e},gt:function(t,e){return t>e},gte:function(t,e){return t>=e},lt:function(t,e){return t<e},lte:function(t,e){return t<=e},and:function(t,e){return t&&e},or:function(t,e){return t||e},andNot:function(t,e){return t&&!e},orNot:function(t,e){return t||!e},ternary:function(t,e,n){return t?e:n}};var b={member:{read:function(t,e){return t?t[e]:null}},keys:function(t){return t?Object.keys(t):[]},values:function(t){if(t){let e=[];return Object.keys(t).forEach(n=>{e.push(t[n])}),e}return[]}};var v={observe:function(t,e,n){var i,r=this,s=this.weakReference(t).callbacks;if(!s[e]){s[e]=[];var a=Object.getOwnPropertyDescriptor(t,e);if(a&&(a.get||a.set||!a.configurable)||(i=t[e],Object.defineProperty(t,e,{enumerable:!0,get:function(){return i},set:function(n){if("object"==typeof n||n!==i){r.unobserveArray(i,t.__rv,e),i=n;var s=r.weakmap[t.__rv];if(s){var a=s.callbacks[e];a&&a.forEach((function(t){t.sync()})),r.observeArray(n,t.__rv,e)}let o=r.weakReference(t);o.parentObject&&(o.parentObject[o.keypath]=o.parentObject[o.keypath])}}})),"object"==typeof t[e]&&!(t[e]instanceof Array)&&null!==t[e]){let n=this.weakReference(t[e]);n.parentObject=t,n.keypath=e}}-1===s[e].indexOf(n)&&s[e].push(n),this.observeArray(t[e],t.__rv,e)}};class y{constructor(t,e={}){this.boundContext=null,y.boundContexts.forEach(n=>{n.element.contains(t)&&(this.boundContext=n.context,Object.assign(n.context.models,e))}),this.boundContext||(this.boundContext=y.binder.bind(t,e)),y.boundContexts.push({element:t,context:this.boundContext})}get model(){return this.boundContext.models}addNewProperty(t,e,n){r.a.adapters[r.a.rootInterface].observe(t,e,{sync:()=>{}}),t[e]=n}static set config(t){t=Object.assign(Object.assign({},t),{prefix:"kb"}),r.a.configure(t),this.configured=!0}static get binder(){return this.initialised||this.initialise(),r.a}static initialise(){this.configured||(this.config={}),this.initialiseFormatters(),this.initialiseAdapters(),this.initialiseBinders(),this.initialised=!0}static initialiseFormatters(){r.a.formatters=Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},r.a.formatters),c),h),f),l),b),d),p),r.a.formatters.args=function(t){let e=Array.prototype.slice.call(arguments,1);return n=>t.apply(null,e.concat([n]))}}static initialiseAdapters(){r.a.adapters[r.a.rootInterface]=Object.assign(Object.assign({},r.a.adapters[r.a.rootInterface]),v),r.a.adapters["["]=o}static initialiseBinders(){var t;r.a.binders["checked-if"]=s,r.a.binders.toggle=a,r.a.binders["each-*"]=((t=r.a.binders["each-*"]).coreRoutine=t.routine,t.routine=function(e,n){return Array.isArray(n)||(n=[]),t.coreRoutine.call(this,e,n)},t)}}y.initialised=!1,y.configured=!1,y.boundContexts=[]}]).default}));