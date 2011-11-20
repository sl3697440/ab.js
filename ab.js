/*!
* AB.js - A/B Testing JavaScript Framework
* Copyright 2011
* Released under the New BSD License.
* More information: https://github.com/aptonic/ab.js
*/

(function(){

var ABTest = function(name, customVarSlot, variationFunctions) {
    this.name = name;
    this.customVarSlot = customVarSlot;

    var cookieName = "abjs_variation";
    this.assignedVariation = ABTestUtils.getCookie(cookieName);

    if (this.assignedVariation === "" || !(ABTestUtils.isFunction(variationFunctions[this.assignedVariation]))) {
       // Assign a variation and set cookie
       variationNumber = Math.floor(Math.random() * ABTestUtils.keys(variationFunctions).length);
       this.assignedVariation = ABTestUtils.keys(variationFunctions)[variationNumber];
       ABTestUtils.setCookie(cookieName, this.assignedVariation, 365);
       this.newCookieSet = true;
    }else{
       this.newCookieSet = false;
    }

    var functionToExecute = variationFunctions[this.assignedVariation];
    ABTestUtils.addLoadEvent(function() { functionToExecute(); });

    window._gaq = window._gaq || [];
    window._gaq.push(["_setCustomVar", this.customVarSlot, "abjs_" + this.name, "abjs_" + this.assignedVariation, 1]);
}

var ABTestUtils = {};

ABTestUtils.setCookie = function(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays === null) ? "": "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

ABTestUtils.getCookie = function(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    return "";
}

ABTestUtils.addLoadEvent = function(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

ABTestUtils.keys = function(o) {
   if (o !== Object(o)) {
     throw new TypeError('ABTestUtils.keys called on non-object');
   }

   var ret = [];
   var p = null;
   for(p in o) {
       if(Object.prototype.hasOwnProperty.call(o,p)) {
         ret.push(p);
       }
   }
   return ret;
}

ABTestUtils.isFunction = function(object) {
  return !!(object && object.constructor && object.call && object.apply);
}

window.ABTest = ABTest;
window.ABTestUtils = ABTestUtils;

})();
