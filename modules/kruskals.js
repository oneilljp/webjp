import { sEnum, draw, Position, paint } from "./tile.js";
import { inBounds } from "./prims.js";
import { legalPosition } from "./dbfs.js";

var walls = [];
var tiles = new Map(); // <String, Position>

// Return Tree's Representative w/
// Recursive Path Compression to reduce lookup time
function Find(x) {
  if (tiles.get(x.toString()).equals(x)) {
    return x;
  }
  tiles.set(x.toString(), Find(tiles.get(x.toString())));

  return tiles.get(x.toString());
}

// Union-Find
function SetUnion(x, y) {
  tiles.set(Find(y).toString(), Find(x));
}

function Process(board, wall) {
  let neighbors = [
    new Position(wall.row - 1, wall.col), // N
    new Position(wall.row, wall.col + 1), // E
    new Position(wall.row + 1, wall.col), // S
    new Position(wall.row, wall.col - 1), // W
  ];

  let reps = new Set();

  // Check if all neighbors belong to distinct unions
  for (let pos of neighbors) {
    if (
      legalPosition(pos.row, pos.col, board) &&
      board[pos.row][pos.col].color !== sEnum.Wall
    ) {
      if (reps.has(Find(pos).toString())) {
        // Multiple Neighbors in the same union, cannot open wall
        return false;
      } else {
        reps.add(Find(pos).toString());
      }
    }
  }

  // Update Unions of all open neighbors, making to be opened wall
  // The ultimate representative of the new union
  for (let pos of reps) {
    SetUnion(wall, pos);
  }

  return true;
}

export function Kruskals(board) {
  walls = [];
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[0].length; ++j) {
      let curr = new Position(i, j);
      if (board[i][j].color === sEnum.Empty) {
        board[i][j].color = sEnum.Wall;
        walls.push(curr);
      }
      tiles.set(curr.toString(), curr);
    }
  }

  // Randomize Wall Order
  for (let i = walls.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = walls[i];
    walls[i] = walls[j];
    walls[j] = temp;
  }

  draw(board);

  let speed = document.getElementById("speed").value;

  let builder = setInterval(b, speed);

  function b() {
    if (walls.length === 0) {
      clearInterval(builder);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
    } else {
      let curr = walls.shift();

      if (Process(board, curr)) {
        board[curr.row][curr.col].color = sEnum.Empty;
        paint(board, curr.row, curr.col, sEnum.Empty);
      }
    }
  }
}
