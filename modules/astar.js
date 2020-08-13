import { paint, sEnum, Position } from "./tile.js";
import { legalPosition, visited, searched, found } from "./dbfs.js";
import { Priority } from "./pq.js";

// Redoing A Star alg:
// Keeping list of potential neighbors
// Update neighbors w/ shortest distance and parent using manhattan distance
// Pick shortest distance out of current neighbors to go to, then add/update it's neighbors

// WORKING FOR NOW, ADD TIMED ANIMATIONS, BUT FIRST ADD KEY STUFF`

var useKey = false;
var keyPath = [];
var keyFound = true;

function mDistance(current, end) {
  return Math.abs(end.row - current.row) + Math.abs(end.col - current.col);
}

function makePath(start, end, prev) {
  let path = [];

  let curr = new Position(end.row, end.col);
  while (!curr.equals(start)) {
    curr = prev.get(curr.toString());

    if (!curr.equals(start)) {
      path.unshift(curr);
    }
  }

  return path;
}

function backPaint(board, start, key, end, prev) {
  let path;
  if (useKey) {
    path = keyPath.concat(makePath(key, end, prev));
  } else {
    path = makePath(start, end, prev);
  }

  for (let pos of path) {
    paint(board, pos.row, pos.col, found);
  }
}

export function aStar(board, start, end, key) {
  keyPath = [];
  if (key) {
    useKey = true;
    keyFound = false;
  } else {
    useKey = false;
    keyFound = true;
  }
  let candidates = new Priority();
  candidates.enqueue(start, 0);

  let prev = new Map();

  // Cost of cheapest known path from start to node;
  let gScore = new Map();
  gScore.set(start.toString(), 0);

  // G cost + Heuristic distance to goal node
  let fScore = new Map();
  // Replace end w/ key in key impl
  fScore.set(start.toString(), mDistance(start, end));

  while (!candidates.empty()) {
    let curr = candidates.dequeue();

    if (
      !curr.equals(start) &&
      !curr.equals(end) &&
      (useKey ? !neighbor.equals(key) : true)
    ) {
      paint(board, curr.row, curr.col, visited);
    }

    if (curr.equals(end)) {
      console.log("Path Found and Working");
      backPaint(board, start, end, prev);
      return;
    }

    let neighbors = [
      new Position(curr.row - 1, curr.col),
      new Position(curr.row, curr.col + 1),
      new Position(curr.row + 1, curr.col),
      new Position(curr.row, curr.col - 1),
    ];

    for (let neighbor of neighbors) {
      if (legalPosition(neighbor.row, neighbor.col, board)) {
        if (
          !neighbor.equals(start) &&
          !neighbor.equals(end) &&
          (useKey ? !neighbor.equals(key) : true)
        ) {
          paint(board, neighbor.row, neighbor.col, visited);
        }
        if (!gScore.get(neighbor.toString())) {
          gScore.set(neighbor.toString(), Number.POSITIVE_INFINITY);
        }
        let cost =
          board[neighbor.row][neighbor.col].color === sEnum.Weight ? 15 : 1;
        let newG = gScore.get(curr.toString()) + cost;

        if (newG < gScore.get(neighbor.toString())) {
          prev.set(neighbor.toString(), curr);
          gScore.set(neighbor.toString(), newG);
          fScore.set(neighbor.toString(), newG + mDistance(neighbor, end));

          if (!candidates.contains(neighbor)) {
            candidates.enqueue(neighbor, fScore.get(neighbor.toString()));
          }
        }
      }
    }
  }

  console.log("Failure");
}
