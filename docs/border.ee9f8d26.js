parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"tI7p":[function(require,module,exports) {
module.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var n=document.activeElement,t=[],a=0;a<e.rangeCount;a++)t.push(e.getRangeAt(a));switch(n.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":n.blur();break;default:n=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||t.forEach(function(n){e.addRange(n)}),n&&n.focus()}};
},{}],"gpwS":[function(require,module,exports) {
"use strict";var e=require("toggle-selection"),t={"text/plain":"Text","text/html":"Url",default:"Text"},o="Copy to clipboard: #{key}, Enter";function a(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}function n(n,r){var c,l,s,i,p,d,u=!1;r||(r={}),c=r.debug||!1;try{if(s=e(),i=document.createRange(),p=document.getSelection(),(d=document.createElement("span")).textContent=n,d.style.all="unset",d.style.position="fixed",d.style.top=0,d.style.clip="rect(0, 0, 0, 0)",d.style.whiteSpace="pre",d.style.webkitUserSelect="text",d.style.MozUserSelect="text",d.style.msUserSelect="text",d.style.userSelect="text",d.addEventListener("copy",function(e){if(e.stopPropagation(),r.format)if(e.preventDefault(),void 0===e.clipboardData){c&&console.warn("unable to use e.clipboardData"),c&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var o=t[r.format]||t.default;window.clipboardData.setData(o,n)}else e.clipboardData.clearData(),e.clipboardData.setData(r.format,n);r.onCopy&&(e.preventDefault(),r.onCopy(e.clipboardData))}),document.body.appendChild(d),i.selectNodeContents(d),p.addRange(i),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(m){c&&console.error("unable to copy using execCommand: ",m),c&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(r.format||"text",n),r.onCopy&&r.onCopy(window.clipboardData),u=!0}catch(m){c&&console.error("unable to copy using clipboardData: ",m),c&&console.error("falling back to prompt"),l=a("message"in r?r.message:o),window.prompt(l,n)}}finally{p&&("function"==typeof p.removeRange?p.removeRange(i):p.removeAllRanges()),d&&document.body.removeChild(d),s()}return u}module.exports=n;
},{"toggle-selection":"tI7p"}],"mIWh":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=7;exports.tileSize=e;var t=16;exports.editorRatio=t;
},{}],"UnXq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var r=require("./state");function e(){return new Array(r.tileSize).fill(0).map(function(e,t){return new Array(r.tileSize).fill(0)})}function t(){return new Array(3).fill(0).map(function(r,t){return new Array(3).fill(0).map(function(r,t){return e()})})}function n(r,e){var t=r,n=e;return 1==arguments.length&&(t=0,n=r),t=Math.ceil(t),n=Math.floor(n),Math.floor(Math.random()*(n-t))+t}function i(){return[n(3),n(3),n(r.tileSize),n(r.tileSize)]}function o(e){var t=e[0],n=e[1];return[3*r.tileSize-n,t]}function u(e,t){var n=e[0],i=e[1];void 0===t&&(t=1);var o=3*r.tileSize-1;return[[n,i],[o-i,n],[o-n,o-i],[i,o-n]]}function a(r,e){var t=e.reduce(function(r,e){return r[e]},r);return"number"!=typeof t?0:t}function c(r,e,t){void 0===t&&(t=1);var n=e.slice(0,-1),i=e[e.length-1];n.reduce(function(r,e){return r[e]},r)[i]=t}exports.newGrid=t,exports.randomInt=n,exports.randomLoc=i,exports.rotatePair=o,exports.rotationSet=u,exports.getLoc=a,exports.setLoc=c;
},{"./state":"mIWh"}],"vPWx":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("copy-to-clipboard")),o=require("./state"),i=require("./utils"),r=document.getElementById("target"),n=document.getElementById("editor"),l=document.getElementById("guide"),d=document.getElementById("render"),a=n.getContext("2d"),s=l.getContext("2d"),c=d.getContext("2d");function u(){a.clearRect(0,0,n.width,n.height)}function f(e,t){c.fill();for(var r=0;r<3;r++)for(var n=0;n<3;n++)for(var l=0;l<o.tileSize;l++)for(var d=0;d<o.tileSize;d++){var s=i.getLoc(e,[r,n,l,d]);a.fillStyle=1==s?"#000":"#fff0",c.fillStyle=1==s?"#000":"#fff0";var u=(r*o.tileSize+l)*t,f=(n*o.tileSize+d)*t;1==r&&1==n||(c.clearRect(u,f,t,t),c.fillRect(u,f,t,t),u*=o.editorRatio/t,f*=o.editorRatio/t,a.fillRect(u+1,f+1,o.editorRatio-1,o.editorRatio-1))}}function h(){for(var e=1;e<3;e++){s.strokeStyle="#33f",s.lineWidth=.5;var t=e*n.width/3;s.beginPath(),s.moveTo(t,0),s.lineTo(t,n.height),s.stroke(),s.beginPath(),s.moveTo(0,t),s.lineTo(n.height,t),s.stroke()}for(e=0;e<3*o.tileSize;e++){s.strokeStyle="#ccc";t=e*n.width/(3*o.tileSize);s.beginPath(),s.moveTo(t,0),s.lineTo(t,n.height),s.stroke(),s.beginPath(),s.moveTo(0,t),s.lineTo(n.height,t),s.stroke()}var i=n.width/3;s.clearRect(i+1,i+1,i-2,i-2),s.beginPath(),s.moveTo(1*i,2*i),s.lineTo(2*i,1*i),s.stroke(),s.beginPath(),s.moveTo(1*i,1*i),s.lineTo(2*i,2*i),s.stroke()}function m(e){var t=d.toDataURL(),i=document.getElementById("border-style");i&&i.remove(),(i=document.createElement("style")).id="border-style",document.head.appendChild(i);var n=o.tileSize*e,l='.broider {\n    border-image:  url("'+t+'") '+n+" /  "+n/2+"px / 0 round;\n    border-width:  "+n/2+"px;\n    border-style:  solid;\n}";i.sheet.insertRule(l),r.textContent=l}function g(e,t){var r=t[0]*o.tileSize+t[2],n=t[1]*o.tileSize+t[3];a.fillStyle=(i.getLoc(e,t),"#dde"),1==t[0]&&1==t[1]||a.fillRect(r*o.editorRatio+0,n*o.editorRatio+0,o.editorRatio-0,o.editorRatio-0)}function v(){r.setAttribute("data-after","[Click to copy]")}function p(){t.default(r.textContent,{message:"Press #{key} to copy css"}),r.setAttribute("data-after","Copied to your clipboard!"),r.classList.remove("flash"),window.setTimeout(function(){r.classList.add("flash")},1),window.setTimeout(v,2500)}c.imageSmoothingEnabled=!1,exports.cleanMap=u,exports.renderMap=f,exports.drawGuide=h,exports.setBorder=m,exports.renderHover=g,r.addEventListener("click",p),v();
},{"copy-to-clipboard":"gpwS","./state":"mIWh","./utils":"UnXq"}],"sPKV":[function(require,module,exports) {
module.exports="/broider/1.215f8ecf.png";
},{}],"ShgR":[function(require,module,exports) {
module.exports="/broider/2.07e2c5fb.png";
},{}],"A8Ym":[function(require,module,exports) {
module.exports="/broider/4.ed708439.png";
},{}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./render"),n=e(require("./assets/1.png")),i=e(require("./assets/2.png")),d=e(require("./assets/4.png")),r=require("./state"),o=require("./utils"),a=document.getElementById("pen"),s=document.getElementById("eraser"),c=document.getElementById("symmetry"),l=document.getElementById("scale"),u=document.getElementById("undo"),f=document.getElementById("editor-frame"),h=document.getElementById("editor"),v=document.getElementById("guide"),g=document.getElementById("render");h.width=r.tileSize*r.editorRatio*3,h.height=r.tileSize*r.editorRatio*3,v.width=r.tileSize*r.editorRatio*3,v.height=r.tileSize*r.editorRatio*3;var m=2,p=[2,4,8],E=[n.default,i.default,d.default],L=p[m];function w(){f.style.height=h.getBoundingClientRect().width+"px"}g.width=r.tileSize*L*3,g.height=r.tileSize*L*3,l.addEventListener("click",function(){m=(m+1)%p.length,l.src=E[m],L=p[m],g.width=r.tileSize*L*3,g.height=r.tileSize*L*3,t.renderMap(M,L),t.setBorder(L),w()}),document.addEventListener("DOMContentLoaded",w),window.addEventListener("resize",w);var S=!1,y=!1,B=!0;c.addEventListener("click",function(e){B=!B,c.classList.toggle("selected")}),s.addEventListener("click",function(e){y=!0,s.classList.add("selected"),a.classList.remove("selected")}),a.addEventListener("click",function(e){y=!1,a.classList.add("selected"),s.classList.remove("selected")});var M=o.newGrid(),z=[JSON.stringify(M)];function I(){var e=JSON.stringify(M);e!=z[z.length-1]&&(z.push(e),z.length>50&&z.shift(),u.classList.add("selected"))}function R(){z.pop();var e=z[z.length-1];e&&(M=JSON.parse(e),t.cleanMap(),t.renderMap(M,L),t.setBorder(L))}function k(e,t){S&&o.setLoc(M,e,1-t)}u.addEventListener("click",function(e){R(),z.length<2&&u.classList.remove("selected"),e.preventDefault()}),t.drawGuide(),t.renderMap(M,L),t.setBorder(L);var q=function(e,n,i){void 0===n&&(n=!1),void 0===i&&(i=!1);var d=h.getBoundingClientRect(),a=d.left,s=d.top,c=d.width,l=d.height,u=e.clientX-a,f=e.clientY-s,v=u/c*h.width,g=f/l*h.height,m=Math.floor(v/r.editorRatio),p=Math.floor(g/r.editorRatio),E=B?o.rotationSet([m,p]):[[m,p]];t.cleanMap(),E.forEach(function(e){var d=e[0],a=e[1],s=Math.floor(d/r.tileSize),c=Math.floor(a/r.tileSize),l=[s,c,d%r.tileSize,a%r.tileSize];if(!(s<0||s>2||c<0||c>2)){i&&t.renderHover(M,l);var u=o.getLoc(M,l);n||(u=0),y&&(u=1),k(l,u)}}),t.renderMap(M,L),window.setTimeout(function(){return t.setBorder(L)},0)};h.addEventListener("mousedown",function(e){S=!0,q(e,!0)}),h.addEventListener("mousemove",function(e){q(e,!1,!0)}),h.addEventListener("mouseout",function(e){t.cleanMap(),t.renderMap(M,L)}),window.addEventListener("mousedown",function(){S=!0}),window.addEventListener("mouseup",function(){S=!1,I()}),h.addEventListener("touchend",function(e){S=!1,I()}),h.addEventListener("touchstart",function(e){S=!0,e.preventDefault();for(var t=e.targetTouches,n=0;n<t.length;n++)e.clientX=t[n].clientX,e.clientY=t[n].clientY,q(e)}),h.addEventListener("touchmove",function(e){e.preventDefault(),S=!0;for(var t=e.targetTouches,n=0;n<t.length;n++)e.clientX=t[n].clientX,e.clientY=t[n].clientY,q(e)});var D=0;window.addEventListener("touchend",function(e){e.timeStamp-D<=500&&(e.preventDefault(),e.target.click()),S=!1,D=e.timeStamp});
},{"./render":"vPWx","./assets/1.png":"sPKV","./assets/2.png":"ShgR","./assets/4.png":"A8Ym","./state":"mIWh","./utils":"UnXq"}]},{},["QCba"], null)
//# sourceMappingURL=/broider/border.ee9f8d26.js.map