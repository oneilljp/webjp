import { paint, sEnum, Position } from "./tile.js";
import { legalPosition, previsit, visited, found } from "./dbfs.js";
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

  // for (let pos of path) {
  // paint(board, pos.row, pos.col, found);
  // }

  let speed = document.getElementById("speed").value;
  let painter = setInterval(p, 10 * speed);
  paint(board, start.row, start.col, sEnum.Start);

  function p() {
    if (path.length === 0) {
      clearInterval(painter);
    } else {
      let curr = path[0];
      if (!curr.equals(start)) {
        paint(board, curr.row, curr.col, found);
      }
      path.shift();
    }
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
  if (useKey) {
    fScore.set(start.toString(), mDistance(start, key));
  } else {
    fScore.set(start.toString(), mDistance(start, end));
  }

  let speed = document.getElementById("speed").value;

  let searcher = setInterval(s, 15 * speed);

  // while (!candidates.empty()) {
  function s() {
    if (candidates.empty()) {
      document.getElementById("start").innerHTML = "Start";
      document.getElementById("start").disabled = false;
      clearInterval(searcher);
    }
    let curr = candidates.dequeue();

    if (
      !curr.equals(start) &&
      !curr.equals(end) &&
      (useKey ? !curr.equals(key) : true)
    ) {
      paint(board, curr.row, curr.col, keyFound ? visited : previsit);
    }

    if (curr.equals(end)) {
      if (!keyFound) {
        return;
      }
      console.log("Path Found and Working");
      backPaint(board, start, key, end, prev);
      document.getElementById("start").innerHTML = "Start";
      document.getElementById("start").disabled = false;
      clearInterval(searcher);
    }

    if (!keyFound && curr.equals(key)) {
      keyPath = makePath(start, key, prev);

      // Reset Queue and Maps to begin search from key to end
      candidates = new Priority();
      candidates.enqueue(key, 0);

      prev.clear();
      gScore.clear();
      fScore.clear();

      gScore.set(key.toString(), 0);
      fScore.set(key.toString(), mDistance(key, end));

      keyFound = true;

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
        // Seed gScore if non-existant to infinity
        if (!gScore.get(neighbor.toString())) {
          gScore.set(neighbor.toString(), Number.POSITIVE_INFINITY);
        }
        let cost =
          board[neighbor.row][neighbor.col].color === sEnum.Weight ? 15 : 1;
        let newG = gScore.get(curr.toString()) + cost;

        if (newG < gScore.get(neighbor.toString())) {
          prev.set(neighbor.toString(), curr);
          gScore.set(neighbor.toString(), newG);
          fScore.set(
            neighbor.toString(),
            newG + mDistance(neighbor, keyFound ? end : key)
          );

          if (!candidates.contains(neighbor)) {
            candidates.enqueue(neighbor, fScore.get(neighbor.toString()));
          }
        }
      }
    }
  }

  console.log("Failure");
}
