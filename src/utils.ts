import { tileSize } from './state';

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

function randomInt(amin: number, amax?: number) {
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
function rotatePair([x, y]) {
  let gridSize = 3 * tileSize;
  return [gridSize - y, x];
}
function rotationSet([x, y], n = 1) {
  let gridSize = 3 * tileSize - 1;

  return [
    [x, y], [gridSize - y, x], [gridSize - x, gridSize - y], [y, gridSize - x]
  ];
}
function getLoc(map: any[][][][], loc: number[]): number {
  let r = loc.reduce((acc, i) => acc[i], map);
  if (typeof r !== 'number') {
    return 0;
  } else {
    return r;
  }
}

function setLoc(map: any[][][][], loc: any[], v: number = 1) {
  let address = loc.slice(0, -1);
  let lastPos = loc[loc.length - 1];

  address.reduce((acc, i) => acc[i], map)[lastPos] = v;
}

export { newGrid, randomLoc, randomInt, getLoc, setLoc, rotatePair, rotationSet };
