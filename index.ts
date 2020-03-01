var tileSize = 8;
var pixelRatio = 4;
var editorRatio = 4 * pixelRatio;

let frame = <HTMLElement>document.getElementById("editor-frame");
let canvas = <HTMLCanvasElement>document.getElementById("editor");
let guideCanvas = <HTMLCanvasElement>document.getElementById("guide");
let renderCanvas = <HTMLCanvasElement>document.getElementById("render");
canvas.width = tileSize * editorRatio * 3;
canvas.height = tileSize * editorRatio * 3;
guideCanvas.width = tileSize * editorRatio * 3;
guideCanvas.height = tileSize * editorRatio * 3;
renderCanvas.width = tileSize * pixelRatio * 3;
renderCanvas.height = tileSize * pixelRatio * 3;

window.setTimeout(() => {
  frame.style.height = canvas.getBoundingClientRect().width + "px";
}, 500);

var ctx = canvas.getContext("2d");
var guideCtx = guideCanvas.getContext("2d");
var renderCtx = renderCanvas.getContext("2d");

var isDown = false;

function newCell() {
  let rows = new Array(tileSize).fill(0);
  return rows.map((v, i) => new Array(tileSize).fill(0));
}
function newGrid() {
  let rows = new Array(3).fill(0);
  return rows.map((v, i) => {
    let col = new Array(3).fill(0);
    return col.map((v, i) => newCell());
  });
}

let map = newGrid();
// console.log(map);

function randomInt(amin, amax?: number) {
  var min = amin;
  var max = amax;
  if (arguments.length == 1) {
    min = 0;
    max = amin;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomLoc() {
  return [randomInt(3), randomInt(3), randomInt(tileSize), randomInt(tileSize)];
}
function setLoc(loc, v = 1) {
  let address = loc.slice(0, -1);
  let lastPos = loc[loc.length - 1];
  //   console.log(v);
  address.reduce((acc, i) => acc[i], map)[lastPos] = v;
}
function getLoc(loc) {
  return loc.reduce((acc, i) => acc[i], map);
}

function renderMap(map) {
  renderCtx.fill();
  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let cx = 0; cx < tileSize; cx++) {
        for (let cy = 0; cy < tileSize; cy++) {
          let v = getLoc([sx, sy, cx, cy]);
          if (sx == 1 && sy == 1) {
            continue;
          }
          ctx.fillStyle = v == 1 ? "#000" : "#fff0";
          renderCtx.fillStyle = v == 1 ? "#000" : "#fff0";
          let gridX = (sx * tileSize + cx) * pixelRatio;
          let gridY = (sy * tileSize + cy) * pixelRatio;
          renderCtx.clearRect(gridX, gridY, pixelRatio, pixelRatio);
          renderCtx.fillRect(gridX, gridY, pixelRatio, pixelRatio);
          gridX *= editorRatio / pixelRatio;
          gridY *= editorRatio / pixelRatio;
          ctx.clearRect(gridX, gridY, editorRatio, editorRatio);
          ctx.fillRect(gridX + 1, gridY + 1, editorRatio - 1, editorRatio - 1);
        }
      }
    }
  }
}
function drawGuide() {
  for (let index = 1; index < 3; index++) {
    guideCtx.strokeStyle = "#33f";
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
    guideCtx.strokeStyle = "#ccc";
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
drawGuide();
renderMap(map);
setBorder();
function setBorder() {
  let dataURI = renderCanvas.toDataURL();
  let target = <HTMLElement>document.getElementById("target");

  //   target.style.borderImage = `url("${dataURI}")`;
  //   target.style.borderImageSlice = `${tileSize * pixelRatio} `;
  //   target.style.borderImageWidth = `${tileSize * pixelRatio}px `;
  //   target.style.borderImageRepeat = "round";
  //   target.style.borderWidth = `${tileSize * pixelRatio}px`;
  //   target.style.borderStyle = "solid";

  let style = <HTMLStyleElement>document.getElementById("border-style");
  if (style) style.remove();
  style = document.createElement("style");
  style.id = "border-style";
  document.head.appendChild(style);
  //   style.sheet.insertRule(`.bordered {padding-right: ${(value / 5) * mult}px}`);
  let css = `.bordered {
  border-image:  url("${dataURI}");
  border-image-repeat:  round;
  border-image-slice:  ${tileSize * pixelRatio};
  border-image-width:  ${tileSize * pixelRatio}px;
  border-width:  ${tileSize * pixelRatio}px;
  border-style:  solid;
}`;
  style.sheet.insertRule(css);
  target.textContent = css;
}
let draw = (e, isClick = false) => {
  if (!isDown) {
    return;
  }
  let { left, top, width, height } = canvas.getBoundingClientRect();
  let x = e.clientX - left;
  let y = e.clientY - top;
  let canvasX = (x / width) * canvas.width;
  let canvasY = (y / height) * canvas.height;
  let gridX = Math.floor(canvasX / editorRatio);
  let gridY = Math.floor(canvasY / editorRatio);

  let sx = Math.floor(gridX / tileSize);
  let sy = Math.floor(gridY / tileSize);
  let cx = gridX % tileSize;
  let cy = gridY % tileSize;
  let loc = [sx, sy, cx, cy];
  let v = getLoc(loc) || 0;
  if (!isClick) {
    v = 0;
  }
  setLoc(loc, 1 - v);
  renderMap(map);
  setBorder();
};

canvas.addEventListener("mousedown", e => {
  isDown = true;
  draw(e, true);
});
canvas.addEventListener("mousemove", draw);

window.addEventListener("mousedown", () => {
  isDown = true;
});
window.addEventListener("mouseup", () => {
  isDown = false;
});

canvas.addEventListener("touchstart", e => {
  isDown = true;

  e.preventDefault();

  const touches = e.targetTouches;
  for (let i = 0; i < touches.length; i++) {
    e["clientX"] = touches[i].clientX;
    e["clientY"] = touches[i].clientY;
    draw(e);
  }
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  isDown = true;

  const touches = e.targetTouches;
  for (let i = 0; i < touches.length; i++) {
    e["clientX"] = touches[i].clientX;
    e["clientY"] = touches[i].clientY;
    draw(e);
  }
});
