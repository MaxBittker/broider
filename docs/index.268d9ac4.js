function e(e,t,n,o){Object.defineProperty(e,t,{get:n,set:o,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},r={},l=n.parcelRequireed3d;null==l&&((l=function(e){if(e in o)return o[e].exports;if(e in r){var t=r[e];delete r[e];var n={id:e,exports:{}};return o[e]=n,t.call(n.exports,n,n.exports),n.exports}var l=new Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l}).register=function(e,t){r[e]=t},n.parcelRequireed3d=l),l.register("27Lyk",(function(t,n){var o,r;e(t.exports,"register",(()=>o),(e=>o=e)),e(t.exports,"resolve",(()=>r),(e=>r=e));var l={};o=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)l[t[n]]=e[t[n]]},r=function(e){var t=l[e];if(null==t)throw new Error("Could not resolve bundle with id "+e);return t}})),l("27Lyk").register(JSON.parse('{"6evGa":"index.268d9ac4.js","55edQ":"1.4174c112.png","99rIB":"2.672c92e3.png","aLMx8":"4.1e9ab26e.png"}'));var i;i=new URL(l("27Lyk").resolve("55edQ"),import.meta.url).toString();var a;a=new URL(l("27Lyk").resolve("99rIB"),import.meta.url).toString();var d;d=new URL(l("27Lyk").resolve("aLMx8"),import.meta.url).toString();var c,s;s=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],o=0;o<e.rangeCount;o++)n.push(e.getRangeAt(o));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}};var u={"text/plain":"Text","text/html":"Url",default:"Text"};c=function(e,t){var n,o,r,l,i,a,d=!1;t||(t={}),n=t.debug||!1;try{if(r=s(),l=document.createRange(),i=document.getSelection(),(a=document.createElement("span")).textContent=e,a.style.all="unset",a.style.position="fixed",a.style.top=0,a.style.clip="rect(0, 0, 0, 0)",a.style.whiteSpace="pre",a.style.webkitUserSelect="text",a.style.MozUserSelect="text",a.style.msUserSelect="text",a.style.userSelect="text",a.addEventListener("copy",(function(o){if(o.stopPropagation(),t.format)if(o.preventDefault(),void 0===o.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var r=u[t.format]||u.default;window.clipboardData.setData(r,e)}else o.clipboardData.clearData(),o.clipboardData.setData(t.format,e);t.onCopy&&(o.preventDefault(),t.onCopy(o.clipboardData))})),document.body.appendChild(a),l.selectNodeContents(a),i.addRange(l),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");d=!0}catch(r){n&&console.error("unable to copy using execCommand: ",r),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),d=!0}catch(r){n&&console.error("unable to copy using clipboardData: ",r),n&&console.error("falling back to prompt"),o=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(o,e)}}finally{i&&("function"==typeof i.removeRange?i.removeRange(l):i.removeAllRanges()),a&&document.body.removeChild(a),r()}return d};var f=16;function m([e,t],n=1){return[[e,t],[20-t,e],[20-e,20-t],[t,20-e]]}function g(e,t){let n=t.reduce(((e,t)=>e[t]),e);return"number"!=typeof n?0:n}let p=document.getElementById("target"),h=document.getElementById("editor"),y=document.getElementById("guide"),v=document.getElementById("render");var w=h.getContext("2d"),E=y.getContext("2d"),b=v.getContext("2d");function L(){w.clearRect(0,0,h.width,h.height)}function C(e,t){b.fill();for(let n=0;n<3;n++)for(let o=0;o<3;o++)for(let r=0;r<7;r++)for(let l=0;l<7;l++){let i=g(e,[n,o,r,l]);w.fillStyle=1==i?window.paintColor:"#fff0",b.fillStyle=1==i?window.paintColor:"#fff0";let a=(7*n+r)*t,d=(7*o+l)*t;1==n&&1==o||(b.clearRect(a,d,t,t),b.fillRect(a,d,t,t),a*=f/t,d*=f/t,w.fillRect(a+1,d+1,15,15))}}function x(e){let t=v.toDataURL(),n=document.getElementById("border-style");n&&n.remove(),n=document.createElement("style"),n.id="border-style",document.head.appendChild(n);let o=7*e,r=`.broider {\n    border-image:  url("${t}") ${o} /  ${o}px / 0 round;\n    border-width:  ${o}px;\n    border-style:  solid;\n}`;n.sheet.insertRule(r),p.textContent=r}function R(e,t){let n=7*t[0]+t[2],o=7*t[1]+t[3];w.fillStyle=(g(e,t),"#dde"),1==t[0]&&1==t[1]||w.fillRect(n*f+0,o*f+0,16,16)}function k(){p.setAttribute("data-after","[Click to copy]")}b.imageSmoothingEnabled=!1,p.addEventListener("click",(function(){t(c)(p.textContent,{message:"Press #{key} to copy css"}),p.setAttribute("data-after","Copied to your clipboard!"),p.classList.remove("flash"),window.setTimeout((()=>{p.classList.add("flash")}),1),window.setTimeout(k,2500)})),k();let S=document.getElementById("pen"),D=document.getElementById("eraser"),T=document.getElementById("symmetry"),I=document.getElementById("undo"),B=document.getElementById("scale"),A=document.getElementById("color"),U=document.getElementById("editor-frame"),_=document.getElementById("editor"),M=document.getElementById("guide"),O=document.getElementById("render");_.width=336,_.height=336,M.width=336,M.height=336;let P=2,N=[1,2,4],H=[t(i),t(a),t(d)],X=N[P];function F(){U.style.height=_.getBoundingClientRect().width+"px"}O.width=7*X*3,O.height=7*X*3,B.addEventListener("click",(()=>{P=(P+1)%N.length,B.src=H[P],X=N[P],O.width=7*X*3,O.height=7*X*3,C(j,X),x(X),F()})),window.paintColor="#000",A.addEventListener("input",(e=>{window.paintColor=e.target.value,C(j,X),x(X)})),document.addEventListener("DOMContentLoaded",F),window.addEventListener("resize",F);var Y=!1,J=!1,$=!0;T.addEventListener("click",(e=>{$=!$,T.classList.toggle("selected")})),D.addEventListener("click",(e=>{J=!0,D.classList.add("selected"),S.classList.remove("selected")})),S.addEventListener("click",(e=>{J=!1,S.classList.add("selected"),D.classList.remove("selected")}));var j=new Array(3).fill(0).map(((e,t)=>new Array(3).fill(0).map(((e,t)=>new Array(7).fill(0).map(((e,t)=>new Array(7).fill(0)))))));let q=[JSON.stringify(j)];function z(){let e=JSON.stringify(j);e!=q[q.length-1]&&(q.push(e),q.length>50&&q.shift(),I.classList.add("selected"))}I.addEventListener("click",(e=>{!function(){q.pop();let e=q[q.length-1];e&&(j=JSON.parse(e),L(),C(j,X),x(X))}(),q.length<2&&I.classList.remove("selected"),e.preventDefault()})),function(){for(let e=1;e<3;e++){E.strokeStyle="#33f",E.lineWidth=.5;let t=e*h.width/3;E.beginPath(),E.moveTo(t,0),E.lineTo(t,h.height),E.stroke(),E.beginPath(),E.moveTo(0,t),E.lineTo(h.height,t),E.stroke()}for(let e=0;e<21;e++){E.strokeStyle="#ccc";let t=e*h.width/21;E.beginPath(),E.moveTo(t,0),E.lineTo(t,h.height),E.stroke(),E.beginPath(),E.moveTo(0,t),E.lineTo(h.height,t),E.stroke()}let e=h.width/3;E.clearRect(e+1,e+1,e-2,e-2),E.beginPath(),E.moveTo(1*e,2*e),E.lineTo(2*e,1*e),E.stroke(),E.beginPath(),E.moveTo(1*e,1*e),E.lineTo(2*e,2*e),E.stroke()}(),C(j,X),x(X);let Q=(e,t=!1,n=!1)=>{let{left:o,top:r,width:l,height:i}=_.getBoundingClientRect(),a=e.clientX-o,d=e.clientY-r,c=a/l*_.width,s=d/i*_.height,u=Math.floor(c/f),p=Math.floor(s/f),h=$?m([u,p]):[[u,p]];L(),h.forEach((([e,o])=>{let r=Math.floor(e/7),l=Math.floor(o/7),i=[r,l,e%7,o%7];if(r<0||r>2||l<0||l>2)return;n&&R(j,i);let a=g(j,i);t||(a=0),J&&(a=1),function(e,t){Y&&function(e,t,n=1){let o=t.slice(0,-1),r=t[t.length-1];o.reduce(((e,t)=>e[t]),e)[r]=n}(j,e,1-t)}(i,a)})),C(j,X),window.setTimeout((()=>x(X)),0)};_.addEventListener("mousedown",(e=>{Y=!0,Q(e,!0)})),_.addEventListener("mousemove",(e=>{Q(e,!1,!0)})),_.addEventListener("mouseout",(e=>{L(),C(j,X)})),window.addEventListener("mousedown",(()=>{Y=!0})),window.addEventListener("mouseup",(()=>{Y=!1,z()})),_.addEventListener("touchend",(e=>{Y=!1,z()})),_.addEventListener("touchstart",(e=>{Y=!0,e.preventDefault();const t=e.targetTouches;for(let n=0;n<t.length;n++)e.clientX=t[n].clientX,e.clientY=t[n].clientY,Q(e)})),_.addEventListener("touchmove",(e=>{e.preventDefault(),Y=!0;const t=e.targetTouches;for(let n=0;n<t.length;n++)e.clientX=t[n].clientX,e.clientY=t[n].clientY,Q(e)}));let G=0;window.addEventListener("touchend",(e=>{e.timeStamp-G<=500&&(e.preventDefault(),e.target.click()),Y=!1,G=e.timeStamp}));
//# sourceMappingURL=index.268d9ac4.js.map
