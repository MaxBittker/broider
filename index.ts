import {
  renderMap,
  setBorder,
  renderHover,
  drawGuide,
  cleanMap
} from "./render";

import onePng from "./assets/1.png";
import twoPng from "./assets/2.png";
import fourPng from "./assets/4.png";

import { tileSize, editorRatio } from "./state";
import { newGrid, getLoc, setLoc, rotationSet } from "./utils";
let penElement = <HTMLElement>document.getElementById("pen");
let eraserElement = <HTMLElement>document.getElementById("eraser");
let symmetryElement = <HTMLElement>document.getElementById("symmetry");
let scaleElement = <HTMLImageElement>document.getElementById("scale");
let undoElement = <HTMLImageElement>document.getElementById("undo");

let frame = <HTMLElement>document.getElementById("editor-frame");
let canvas = <HTMLCanvasElement>document.getElementById("editor");
let guideCanvas = <HTMLCanvasElement>document.getElementById("guide");
let renderCanvas = <HTMLCanvasElement>document.getElementById("render");
canvas.width = tileSize * editorRatio * 3;
canvas.height = tileSize * editorRatio * 3;
guideCanvas.width = tileSize * editorRatio * 3;
guideCanvas.height = tileSize * editorRatio * 3;

let sizeIndex = 2;
let sizeList = [2, 4, 8];
let pngList = [onePng, twoPng, fourPng];
let pixelRatio = sizeList[sizeIndex];
renderCanvas.width = tileSize * pixelRatio * 3;
renderCanvas.height = tileSize * pixelRatio * 3;
scaleElement.addEventListener("click", () => {
  sizeIndex = (sizeIndex + 1) % sizeList.length;
  scaleElement.src = pngList[sizeIndex];
  pixelRatio = sizeList[sizeIndex];
  renderCanvas.width = tileSize * pixelRatio * 3;
  renderCanvas.height = tileSize * pixelRatio * 3;
  renderMap(map, pixelRatio);
  setBorder(pixelRatio);
  updateFrameHeight();
});
function updateFrameHeight() {
  frame.style.height = canvas.getBoundingClientRect().width + "px";
}
document.addEventListener("DOMContentLoaded", updateFrameHeight);
window.addEventListener("resize", updateFrameHeight);

var isDown = false;
var isErasing = false;
var rotationalSymmetry = true;

symmetryElement.addEventListener("click", e => {
  rotationalSymmetry = !rotationalSymmetry;
  symmetryElement.classList.toggle("selected");
});

eraserElement.addEventListener("click", e => {
  isErasing = true;
  eraserElement.classList.add("selected");
  penElement.classList.remove("selected");
});

penElement.addEventListener("click", e => {
  isErasing = false;
  penElement.classList.add("selected");
  eraserElement.classList.remove("selected");
});

var map = newGrid();
let undoStack = [JSON.stringify(map)];
function pushUndo() {
  let candidate = JSON.stringify(map);
  let top = undoStack[undoStack.length - 1];
  if (candidate == top) {
    return;
  }

  undoStack.push(candidate);

  if (undoStack.length > 50) {
    undoStack.shift();
  }
  undoElement.classList.add("selected");
}
function popUndo() {
  undoStack.pop();
  let old = undoStack[undoStack.length - 1];
  if (old) {
    map = JSON.parse(old);
    cleanMap();
    renderMap(map, pixelRatio);
    setBorder(pixelRatio);
  }
}
undoElement.addEventListener("click", e => {
  popUndo();
  if (undoStack.length < 2) {
    undoElement.classList.remove("selected");
  }
  e.preventDefault();
});
drawGuide();
renderMap(map, pixelRatio);
setBorder(pixelRatio);

function draw(loc, v) {
  if (isDown) {
    setLoc(map, loc, 1 - v);
  }
}
let handleEvent = (e, isClick = false, isHover = false) => {
  let { left, top, width, height } = canvas.getBoundingClientRect();
  let x = e.clientX - left;
  let y = e.clientY - top;
  let canvasX = (x / width) * canvas.width;
  let canvasY = (y / height) * canvas.height;
  let gridX = Math.floor(canvasX / editorRatio);
  let gridY = Math.floor(canvasY / editorRatio);

  let rotatePairs = rotationalSymmetry
    ? rotationSet([gridX, gridY])
    : [[gridX, gridY]];

  cleanMap();
  // renderMap(map,pixelRatio);

  rotatePairs.forEach(([gridX, gridY]) => {
    let sx = Math.floor(gridX / tileSize);
    let sy = Math.floor(gridY / tileSize);
    let cx = gridX % tileSize;
    let cy = gridY % tileSize;
    let loc = [sx, sy, cx, cy];

    if (sx < 0 || sx > 2 || sy < 0 || sy > 2) {
      return;
    }
    if (isHover) {
      renderHover(map, loc);
    }
    let v = getLoc(map, loc);

    if (!isClick) {
      v = 0;
    }

    if (isErasing) {
      v = 1;
    }
    draw(loc, v);
  });
  renderMap(map, pixelRatio);
  window.setTimeout(() => setBorder(pixelRatio), 0);
};

canvas.addEventListener("mousedown", e => {
  isDown = true;
  handleEvent(e, true);
});
canvas.addEventListener("mousemove", e => {
  handleEvent(e, false, true);
});
canvas.addEventListener("mouseout", e => {
  cleanMap();
  renderMap(map, pixelRatio);
});
window.addEventListener("mousedown", () => {
  isDown = true;
});
window.addEventListener("mouseup", () => {
  isDown = false;
  pushUndo();
});
canvas.addEventListener("touchend", e => {
  isDown = false;
  pushUndo();
});
canvas.addEventListener("touchstart", e => {
  isDown = true;

  e.preventDefault();

  const touches = e.targetTouches;
  for (let i = 0; i < touches.length; i++) {
    e["clientX"] = touches[i].clientX;
    e["clientY"] = touches[i].clientY;
    handleEvent(e);
  }
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  isDown = true;

  const touches = e.targetTouches;
  for (let i = 0; i < touches.length; i++) {
    e["clientX"] = touches[i].clientX;
    e["clientY"] = touches[i].clientY;
    handleEvent(e);
  }
});
let lastTouchEnd = 0;
window.addEventListener("touchend", e => {
  //prevent double tap zoom
  if (e.timeStamp - lastTouchEnd <= 500) {
    e.preventDefault();
    e.target.click();
  }
  isDown = false;
  lastTouchEnd = e.timeStamp;
});
