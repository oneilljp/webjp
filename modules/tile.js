import { myCanvas } from "./canvas.js";
export const name = "tile";

export var sEnum = {
  Wall: "#5E81AC",
  Empty: "#E5E9F0",
  Start: "#A3BE8C",
  End: "#BF616A",
  Key: "#EBCB8B",
};

export class Tile {
  constructor(
    color = sEnum.Empty,
    width,
    height,
    top,
    left,
    type = sEnum.Empty
  ) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.type = type;
  }
}

export class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
}

export function resize(first, elements, width, height) {
  let t_size = 24;
  var old = elements.slice(0);
  elements = [];
  var gap = 3;
  var top_in = 5;
  for (var i = 0; i < height; ++i) {
    elements.push([]);
    var left = 10;
    for (var j = 0; j < width; j++) {
      if (first) {
        elements[i].push(new Tile(sEnum.Empty, t_size, t_size, top_in, left));
      } else {
        elements[i].push(
          new Tile(
            old[i][j].color,
            t_size,
            t_size,
            top_in,
            left,
            old[i][j].type
          )
        );
      }
      left += t_size + gap; // Change for dynamic positioning
    }
    top_in += t_size + gap; // Ditto
  }
  return elements;
}

export function paint(elements, row, col, color) {
  myCanvas.ctx.fillStyle = color;
  myCanvas.ctx.fillRect(
    elements[row][col].left,
    elements[row][col].top,
    elements[row][col].width,
    elements[row][col].height
  );
  // Maybe do animated growth box here
}

export function draw(width, height, elements) {
  myCanvas.ctx.fillStyle = "#4C566A";
  myCanvas.ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < elements.length; ++i) {
    for (var j = 0; j < elements[i].length; ++j) {
      myCanvas.ctx.fillStyle = elements[i][j].color;
      myCanvas.ctx.fillRect(
        elements[i][j].left,
        elements[i][j].top,
        elements[i][j].width,
        elements[i][j].height
      );
    }
  }
}
