var tileSize = 4;
var pixelRatio = 4;

let canvas = <HTMLCanvasElement>document.getElementById("editor");
canvas.width = tileSize * pixelRatio * 3;
canvas.height = tileSize * pixelRatio * 3;
var ctx = canvas.getContext("2d");
var isDown = false;
for (let index = 0; index < 3; index++) {
  ctx.strokeStyle = "#999";
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
  //   let x = ((index * canvas.width) / (3 * tileSize);
  //   ctx.beginPath();
  //   ctx.moveTo(x, 0);
  //   ctx.lineTo(x, canvas.height);
  //   ctx.stroke();
  //   ctx.beginPath();
  //   ctx.moveTo(0, x);
  //   ctx.lineTo(canvas.height, x);
  //   ctx.stroke();
}

let draw = e => {
  if (!isDown) {
    return;
  }
  let { left, top, width, height } = canvas.getBoundingClientRect();
  let x = e.clientX - left;
  let y = e.clientY - top;

  let canvasX = (x / width) * canvas.width;
  let canvasY = (y / height) * canvas.height;

  let gridX = Math.floor(canvasX / pixelRatio - 0.5) * pixelRatio;
  let gridY = Math.floor(canvasY / pixelRatio - 0.5) * pixelRatio;

  ctx.strokeStyle = "#000";

  ctx.fillRect(gridX, gridY, pixelRatio, pixelRatio);
  ctx.beginPath();

  //   ctx.arc(gridX,gridY,9,0,2*Math.PI);
  ctx.stroke();
  let dataURI = canvas.toDataURL();
  // console.log(dataURI);
  let target = <HTMLElement>document.getElementById("target");

  // target.style.backgroundImage =`url("${dataURI}")`;

  target.style.borderImage = `url("${dataURI}")`;
  target.style.borderImageSlice = `${tileSize * pixelRatio} s`;
  target.style.borderImageWidth = `${tileSize * pixelRatio}px`;
  target.style.borderImageRepeat = "repeat";
  target.style.borderWidth = `${tileSize * pixelRatio}px`;
  target.style.borderStyle = "solid";
};

canvas.addEventListener("mousedown", e => {
  isDown = true;
  draw(e);
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
  isDown = false;
});
canvas.addEventListener("mouseleave", () => {
  isDown = false;
});
