/*! type-guards v0.1.2 | MIT | https://github.com/hd-code/web-snippets */
function isUndefined(n){return void 0===n}function isNull(n){return null===n}function isBool(n){return"boolean"==typeof n}function isInteger(n){return"number"==typeof n&&Math.floor(n)===n}function isNumber(n){return"number"==typeof n}function isString(n){return"string"==typeof n}function isArray(r,t){if(!(r instanceof Array))return!1;if(!t)return!0;for(let n=0,e=r.length;n<e;n++)if(!t(r[n]))return!1;return!0}function isObject(n){return"object"==typeof n&&null!==n&&!(n instanceof Array)}function hasKey(n,e,r){return"object"==typeof n&&null!==n&&e in n&&(!r||r(n[e]))}function isEnum(n,e){switch(typeof n){case"string":if(Object.values(e).some(isNumber))return!1;case"number":return Object.values(e).includes(n)}return!1}export{isUndefined,isNull,isBool,isInteger,isNumber,isString,isArray,isObject,hasKey,isEnum};