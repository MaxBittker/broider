var tileSize = 4;
var pixelRatio = 4;

let canvas = <HTMLCanvasElement>document.getElementById("editor");
let renderCanvas = <HTMLCanvasElement>document.getElementById("render");
canvas.width = tileSize * pixelRatio * 3;
canvas.height = tileSize * pixelRatio * 3;
renderCanvas.width = tileSize * pixelRatio * 3;
renderCanvas.height = tileSize * pixelRatio * 3;
var ctx = canvas.getContext("2d");
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
console.log(map);

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
function setLoc(loc, v) {
  let address = loc.slice(0, -1);
  let lastPos = loc[loc.length - 1];
  console.log(v);
  address.reduce((acc, i) => acc[i], map)[lastPos] = v;
}
function getLoc(loc) {
  return loc.reduce((acc, i) => acc[i], map);
}
setLoc([0, 0, 0, 0]);
setLoc([2, 2, 0, 0]);
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());
setLoc(randomLoc());

function renderMap(map) {

    renderCtx.fill()
  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let cx = 0; cx < tileSize; cx++) {
        for (let cy = 0; cy < tileSize; cy++) {
          let v = getLoc([sx, sy, cx, cy]);
          ctx.fillStyle = v == 1 ? "#000" : "#fff0";
          renderCtx.fillStyle = v == 1 ? "#000" : "#fff0";
          let gridX = (sx * tileSize + cx) * pixelRatio;
          let gridY = (sy * tileSize + cy) * pixelRatio;
          ctx.fillRect(gridX + 1, gridY + 1, pixelRatio - 1, pixelRatio - 1);
          renderCtx.fillRect(gridX, gridY, pixelRatio, pixelRatio);
        }
      }
    }
  }
}
for (let index = 0; index < 3; index++) {
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 0.5;
  let x = (index * canvas.width) / 3;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, x);
  ctx.lineTo(canvas.height, x);
  ctx.stroke();
}

for (let index = 0; index < 3 * tileSize; index++) {
  ctx.strokeStyle = "#ccc";
    let x = ((index * canvas.width) / (3 * tileSize);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(canvas.height, x);
    ctx.stroke();
}
renderMap(map);
setBorder();
function setBorder() {
  let dataURI = renderCanvas.toDataURL();
  let target = <HTMLElement>document.getElementById("target");

  target.style.borderImage = `url("${dataURI}")`;
  target.style.borderImageSlice = `${tileSize * pixelRatio} `;
  target.style.borderImageWidth = `${tileSize * pixelRatio}px`;
  target.style.borderImageRepeat = "repeat";
  target.style.borderWidth = `${tileSize * pixelRatio}px`;
  target.style.borderStyle = "solid";
}
let draw = (e, isClick) => {
  if (!isDown) {
    return;
  }
  let { left, top, width, height } = canvas.getBoundingClientRect();
  let x = e.clientX - left;
  let y = e.clientY - top;

  let canvasX = (x / width) * canvas.width;
  let canvasY = (y / height) * canvas.height;
  let gridX = Math.floor(canvasX / pixelRatio);
  let gridY = Math.floor(canvasY / pixelRatio);

  let sx = Math.floor(gridX / tileSize);
  let sy = Math.floor(gridY / tileSize);
  let cx = gridX % tileSize;
  let cy = gridY % tileSize;
  let loc =[sx, sy, cx, cy];
  let v = getLoc(loc)||0; 
  console.log(v);
  if(!isClick){
    v = 0;
  }
  setLoc(loc, 1-v);
  //   ctx.fillStyle = "#000";
  //   ctx.fillRect(gridX, gridY, pixelRatio, pixelRatio);
  renderMap(map);
  setBorder();
};

canvas.addEventListener("mousedown", e => {
  isDown = true;
  draw(e, true);
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
  isDown = false;
});
canvas.addEventListener("mouseleave", () => {
  isDown = false;
});
