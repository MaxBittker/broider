parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QCba":[function(require,module,exports) {
var e=8,t=4,n=4*t,o=document.getElementById("editor-frame"),r=document.getElementById("editor"),i=document.getElementById("guide"),l=document.getElementById("render");r.width=e*n*3,r.height=e*n*3,i.width=e*n*3,i.height=e*n*3,l.width=e*t*3,l.height=e*t*3,window.setTimeout(function(){o.style.height=r.getBoundingClientRect().width+"px"},500);var d=r.getContext("2d"),a=i.getContext("2d"),c=l.getContext("2d"),u=!1,h=!1;function f(){return new Array(e).fill(0).map(function(t,n){return new Array(e).fill(0)})}function g(){return new Array(3).fill(0).map(function(e,t){return new Array(3).fill(0).map(function(e,t){return f()})})}var v=g();function m(e,t){var n=e,o=t;return 1==arguments.length&&(n=0,o=e),n=Math.ceil(n),o=Math.floor(o),Math.floor(Math.random()*(o-n))+n}function s(){return[m(3),m(3),m(e),m(e)]}function w(e,t){void 0===t&&(t=1);var n=e.slice(0,-1),o=e[e.length-1];n.reduce(function(e,t){return e[t]},v)[o]=t}function y(e){return e.reduce(function(e,t){return e[t]},v)}function T(o){c.fill(),d.clearRect(0,0,r.width,r.height);for(var i=0;i<3;i++)for(var l=0;l<3;l++)for(var a=0;a<e;a++)for(var u=0;u<e;u++){var h=y([i,l,a,u]);if(1!=i||1!=l){d.fillStyle=1==h?"#000":"#fff0",c.fillStyle=1==h?"#000":"#fff0";var f=(i*e+a)*t,g=(l*e+u)*t;c.clearRect(f,g,t,t),c.fillRect(f,g,t,t),f*=n/t,g*=n/t,d.fillRect(f+1,g+1,n-1,n-1)}}}function b(){for(var t=1;t<3;t++){a.strokeStyle="#33f",a.lineWidth=.5;var n=t*r.width/3;a.beginPath(),a.moveTo(n,0),a.lineTo(n,r.height),a.stroke(),a.beginPath(),a.moveTo(0,n),a.lineTo(r.height,n),a.stroke()}for(t=0;t<3*e;t++){a.strokeStyle="#ccc";n=t*r.width/(3*e);a.beginPath(),a.moveTo(n,0),a.lineTo(n,r.height),a.stroke(),a.beginPath(),a.moveTo(0,n),a.lineTo(r.height,n),a.stroke()}var o=r.width/3;a.clearRect(o+1,o+1,o-2,o-2),a.beginPath(),a.moveTo(1*o,2*o),a.lineTo(2*o,1*o),a.stroke(),a.beginPath(),a.moveTo(1*o,1*o),a.lineTo(2*o,2*o),a.stroke()}function E(){var n=l.toDataURL(),o=document.getElementById("target"),r=document.getElementById("border-style");r&&r.remove(),(r=document.createElement("style")).id="border-style",document.head.appendChild(r);var i='.bordered {\n  border-image:  url("'+n+'");\n  border-image-repeat:  round;\n  border-image-slice:  '+e*t+";\n  border-image-width:  "+e*t+"px;\n  border-width:  "+e*t+"px;\n  border-style:  solid;\n}";r.sheet.insertRule(i),o.textContent=i}b(),T(v),E();var p=function(t,o){void 0===o&&(o=!1);var i=r.getBoundingClientRect(),l=i.left,a=i.top,c=i.width,f=i.height,g=t.clientX-l,m=t.clientY-a,s=g/c*r.width,b=m/f*r.height,p=Math.floor(s/n),R=Math.floor(b/n),k=[Math.floor(p/e),Math.floor(R/e),p%e,R%e],B=y(k)||0;o&&1==B&&(h=!0),o||(B=0),h&&(B=1),u?(w(k,1-B),T(v)):(T(v),d.fillStyle=1==y(k)?"#228":"#ddf",d.fillRect(p*n,R*n,n,n)),window.setTimeout(E,0)};r.addEventListener("mousedown",function(e){u=!0,p(e,!0)}),r.addEventListener("mousemove",p),window.addEventListener("mousedown",function(){u=!0}),window.addEventListener("mouseup",function(){u=!1,h=!1}),r.addEventListener("touchend",function(e){u=!1,h=!1}),r.addEventListener("touchstart",function(e){u=!0,e.preventDefault();for(var t=e.targetTouches,n=0;n<t.length;n++)e.clientX=t[n].clientX,e.clientY=t[n].clientY,p(e)}),r.addEventListener("touchmove",function(e){e.preventDefault(),u=!0;for(var t=e.targetTouches,n=0;n<t.length;n++)e.clientX=t[n].clientX,e.clientY=t[n].clientY,p(e)});
},{}]},{},["QCba"], null)
//# sourceMappingURL=/border/border.2cdeb88a.js.map