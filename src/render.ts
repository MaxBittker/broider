import copy from 'copy-to-clipboard';

import {editorRatio, tileSize} from './state';
import {getLoc} from './utils';

let target = <HTMLElement>document.getElementById('target');
let vectortarget = <HTMLElement>document.getElementById('vector-target');


let canvas = <HTMLCanvasElement>document.getElementById('editor');
let guideCanvas = <HTMLCanvasElement>document.getElementById('guide');
let renderCanvas = <HTMLCanvasElement>document.getElementById('render');
var ctx = canvas.getContext('2d');
var guideCtx = guideCanvas.getContext('2d');
var renderCtx = renderCanvas.getContext('2d');

renderCtx.imageSmoothingEnabled = false;
function cleanMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function renderMap(map, pixelRatio) {
  renderCtx.fill();

  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let cx = 0; cx < tileSize; cx++) {
        for (let cy = 0; cy < tileSize; cy++) {
          let v = getLoc(map, [sx, sy, cx, cy]);

          ctx.fillStyle = v == 1 ? '#000' : '#fff0';
          renderCtx.fillStyle = v == 1 ? '#000' : '#fff0';
          let gridX = (sx * tileSize + cx) * pixelRatio;
          let gridY = (sy * tileSize + cy) * pixelRatio;
          if (sx == 1 && sy == 1) {
            continue;
          }
          renderCtx.clearRect(gridX, gridY, pixelRatio, pixelRatio);
          renderCtx.fillRect(gridX, gridY, pixelRatio, pixelRatio);
          gridX *= editorRatio / pixelRatio;
          gridY *= editorRatio / pixelRatio;
          ctx.fillRect(gridX + 1, gridY + 1, editorRatio - 1, editorRatio - 1);
        }
      }
    }
  }
  renderVector(map, pixelRatio)
}
function drawGuide() {
  for (let index = 1; index < 3; index++) {
    guideCtx.strokeStyle = '#33f';
    guideCtx.lineWidth = 0.5;
    let x = (index * canvas.width) / 3;
    guideCtx.beginPath();
    guideCtx.moveTo(x, 0);
    guideCtx.lineTo(x, canvas.height);
    guideCtx.stroke();
    guideCtx.beginPath();
    guideCtx.moveTo(0, x);
    guideCtx.lineTo(canvas.height, x);
    guideCtx.stroke();
  }

  for (let index = 0.0; index < 3 * tileSize; index++) {
    guideCtx.strokeStyle = '#ccc';
    let x = (index * canvas.width) / (3 * tileSize);
    guideCtx.beginPath();
    guideCtx.moveTo(x, 0);
    guideCtx.lineTo(x, canvas.height);
    guideCtx.stroke();
    guideCtx.beginPath();
    guideCtx.moveTo(0, x);
    guideCtx.lineTo(canvas.height, x);
    guideCtx.stroke();
  }
  let third = canvas.width / 3;
  guideCtx.clearRect(third + 1, third + 1, third - 2, third - 2);
  guideCtx.beginPath();
  guideCtx.moveTo(third * 1, third * 2);
  guideCtx.lineTo(third * 2, third * 1);
  guideCtx.stroke();
  guideCtx.beginPath();
  guideCtx.moveTo(third * 1, third * 1);
  guideCtx.lineTo(third * 2, third * 2);
  guideCtx.stroke();
}

function setBorder(map, pixelRatio) {
  let dataURI2 = renderCanvas.toDataURL();
  let dataURI = renderVector(map, pixelRatio);

  console.log(dataURI.length);
  console.log(dataURI2.length);
  let style = <HTMLStyleElement>document.getElementById('border-style');
  if (style) style.remove();
  style = document.createElement('style');
  style.id = 'border-style';
  document.head.appendChild(style);

  let viewsize = tileSize * pixelRatio;
  let css = `.broider {
    border-image:  url("${dataURI}") ${viewsize} /  ${viewsize}px / 0 round;
    border-width:  ${viewsize}px;
    border-style:  solid;
}`;
  style.sheet.insertRule(css);
  44
  target.textContent = css;
}
function svgToDataURL(svgStr) {
  const encoded =
      encodeURIComponent(svgStr).replace(/'/g, '%27').replace(/"/g, '%22')

  const header = 'data:image/svg+xml,'
  const dataUrl = header + encoded
  return dataUrl
}


function renderVector(map, pixelRatio) {
  let content = `<svg 
      width="${tileSize * pixelRatio * 3}px"
      height="${tileSize * pixelRatio * 3}px"
      viewBox="0 0 ${tileSize * pixelRatio * 3} ${tileSize * pixelRatio * 3}" 
      fill="red"
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
      >`;
  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let cx = 0; cx < tileSize; cx++) {
        for (let cy = 0; cy < tileSize; cy++) {
          let v = getLoc(map, [sx, sy, cx, cy]);

          let gridX = (sx * tileSize + cx) * pixelRatio;
          let gridY = (sy * tileSize + cy) * pixelRatio;

          if (sx == 1 && sy == 1) {
            continue;
          }

          if (v == 1) {
            content += `<rect x="${gridX}" y="${gridY}" width="${
                pixelRatio}px" height="${pixelRatio}px"/>`;
          }
        }
      }
    }
  }
  // console.log(content)
  content += '</svg>';
  vectortarget.innerHTML = content;
  let dataURI = svgToDataURL(content);
  return dataURI

  // vector.setAttribute(
  // 'viewBox',
  // `0 0 ${tileSize * pixelRatio * 3} ${tileSize * pixelRatio *
  // 3}`);
  // vector.innerHTML = content;
}
function renderHover(map: any[][][][], loc: number[]) {
  let x = loc[0] * tileSize + loc[2];
  let y = loc[1] * tileSize + loc[3];
  ctx.fillStyle = getLoc(map, loc) == 1 ? '#dde' : '#dde';
  if (loc[0] == 1 && loc[1] == 1) {
    return;
  }
  ctx.fillRect(
      x * editorRatio + 0, y * editorRatio + 0, editorRatio - 0,
      editorRatio - 0);
}

target.addEventListener('click', copyTarget);
function resetCopy() {
  target.setAttribute('data-after', '[Click to copy]');
}

resetCopy();
function copyTarget() {
  copy(target.textContent, {message: 'Press #{key} to copy css'});
  target.setAttribute('data-after', 'Copied to your clipboard!');
  target.classList.remove('flash');

  window.setTimeout(() => {
    target.classList.add('flash');
  }, 1);
  window.setTimeout(resetCopy, 2500);
}
export {renderMap, drawGuide, setBorder, renderHover, cleanMap};
