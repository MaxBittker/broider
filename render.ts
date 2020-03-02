import { tileSize, pixelRatio, editorRatio } from "./state";
import { getLoc } from "./utils";

let canvas = <HTMLCanvasElement>document.getElementById("editor");
let guideCanvas = <HTMLCanvasElement>document.getElementById("guide");
let renderCanvas = <HTMLCanvasElement>document.getElementById("render");
var ctx = canvas.getContext("2d");
var guideCtx = guideCanvas.getContext("2d");
var renderCtx = renderCanvas.getContext("2d");

function renderMap(map) {
  renderCtx.fill();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let sx = 0; sx < 3; sx++) {
    for (let sy = 0; sy < 3; sy++) {
      for (let cx = 0; cx < tileSize; cx++) {
        for (let cy = 0; cy < tileSize; cy++) {
          let v = getLoc(map, [sx, sy, cx, cy]);

          ctx.fillStyle = v == 1 ? "#000" : "#fff0";
          renderCtx.fillStyle = v == 1 ? "#000" : "#fff0";
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

function setBorder() {
  let dataURI = renderCanvas.toDataURL();
  let target = <HTMLElement>document.getElementById("target");

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

function renderHover(map: any[][][][], x: number, y: number, loc: number[]) {
  ctx.fillStyle = getLoc(map, loc) == 1 ? "#228" : "#ddf";
  if (loc[0] == 1 && loc[1] == 1) {
    return;
  }
  ctx.fillRect(
    x * editorRatio + 1,
    y * editorRatio + 1,
    editorRatio - 1,
    editorRatio - 1
  );
}
export { renderMap, drawGuide, setBorder, renderHover };
