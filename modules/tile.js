import { myCanvas } from "./canvas.js";

export var sEnum = {
  Wall: "#2E3440",
  Empty: "#E5E9F0",
  Start: "#A3BE8C",
  End: "#BF616A",
  Key: "#EBCB8B",
  Weight: "#D08770",
};

export class Tile {
  constructor(color = sEnum.Empty, width, height, top, left) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
  }
}

export class Position {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  equals(pos) {
    return this.row === pos.row && this.col === pos.col;
  }

  toString() {
    return this.row.toString() + " " + this.col.toString();
  }
}

export function resize(first, elements) {
  var height = 20;
  var width = 60;

  let canWidth = document.getElementById("myCanvas").width - 5;
  let canHeight = document.getElementById("myCanvas").height - 10;
  let t_size = 24;

  width = Math.floor(canWidth / (t_size + 3));
  height = Math.floor(canHeight / (t_size + 3));

  var old = elements.slice(0);
  elements = [];
  var gap = 3;
  var top_in = 5;
  for (var i = 0; i < height; ++i) {
    elements.push([]);
    var left = 5;
    for (var j = 0; j < width; j++) {
      if (first) {
        elements[i].push(new Tile(sEnum.Empty, t_size, t_size, top_in, left));
      } else {
        elements[i].push(
          new Tile(old[i][j].color, t_size, t_size, top_in, left)
        );
      }
      left += t_size + gap; // Change for dynamic positioning
    }
    top_in += t_size + gap; // Ditto
  }
  return elements;
}

export function paint(elements, row, col, color) {
  var len = elements[row][col].height;
  // Original Working painting
  // myCanvas.ctx.fillStyle = color;
  // myCanvas.ctx.fillRect(
  //   elements[row][col].left,
  //   elements[row][col].top,
  //   elements[row][col].width,
  //   elements[row][col].height
  // );
  // Maybe do animated growth box here
  var speed = document.getElementById("speed").value * 2;
  myCanvas.ctx.fillStyle = sEnum.Wall;
  myCanvas.ctx.fillRect(
    elements[row][col].left + len / 4,
    elements[row][col].top + len / 4,
    elements[row][col].width / 2,
    elements[row][col].height / 2
  );
  myCanvas.ctx.fillStyle = color;
  myCanvas.ctx.fillRect(
    elements[row][col].left + 9,
    elements[row][col].top + 9,
    elements[row][col].width / 4,
    elements[row][col].height / 4
  );

  setTimeout(function () {
    myCanvas.ctx.fillStyle = sEnum.Wall;
    myCanvas.ctx.fillRect(
      elements[row][col].left + len / 8,
      elements[row][col].top + len / 8,
      (elements[row][col].width * 3) / 4,
      (elements[row][col].height * 3) / 4
    );
    myCanvas.ctx.fillStyle = color;
    myCanvas.ctx.fillRect(
      elements[row][col].left + len / 4,
      elements[row][col].top + len / 4,
      elements[row][col].width / 2,
      elements[row][col].height / 2
    );
  }, 20 * speed);

  setTimeout(function () {
    myCanvas.ctx.fillStyle = sEnum.Wall;
    myCanvas.ctx.fillRect(
      elements[row][col].left,
      elements[row][col].top,
      elements[row][col].width,
      elements[row][col].height
    );
    myCanvas.ctx.fillStyle = color;
    myCanvas.ctx.fillRect(
      elements[row][col].left + len / 8,
      elements[row][col].top + len / 8,
      (elements[row][col].width * 3) / 4,
      (elements[row][col].height * 3) / 4
    );
  }, 40 * speed);

  setTimeout(function () {
    myCanvas.ctx.fillStyle = color;
    myCanvas.ctx.fillRect(
      elements[row][col].left,
      elements[row][col].top,
      elements[row][col].width,
      elements[row][col].height
    );
  }, 60 * speed);
}

export function draw(elements) {
  myCanvas.ctx.fillStyle = "#4C566A";
  myCanvas.ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

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
