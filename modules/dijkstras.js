import { paint, sEnum, Position } from "./tile.js";
import {
  legalPosition,
  MemoItem,
  previsit,
  visited,
  presearch,
  searched,
  found,
} from "./dbfs.js";
// Keep memo backlog of nodes to check if discovered, log shortest distance
// And log parent of shortest distance
//
// Make queue of discovered coordinates, every pass through sort it by
// Shortest distance from memo using a helper function somewhat like how we
// used less for heaps and whatnot. pass memo into this function so that
// we can keep the queue just as coords

// THIS CURRENT IMPLEMENTATION OF A* IS NOT ACTUALLY A*. ITS THE SWARM ALG
// FROM THE VID WE WATCHED AND TOOK INSPIRATION FROM

var memo = [];
var star = false;
var useKey = false;
var keyPath = true;
var keyFound = true;

class DMemo extends MemoItem {
  constructor(distance, discovered, prev) {
    super(discovered, prev);
    this.distance = distance;
  }
}

function setupMemo(board, start) {
  memo = [];
  for (let i = 0; i < board.length; ++i) {
    memo.push([]);
    for (let j = 0; j < board[0].length; ++j) {
      let piece = new DMemo(Number.POSITIVE_INFINITY, false, "");
      memo[i].push(piece);
    }
  }

  memo[start.row][start.col] = new DMemo(0, true, "");
}

// ASTAR COST CALCULATION

function acost(board, current, next, end, key) {
  let gcost, fcost;
  if (board[current.row][current.col].color === sEnum.Weight) {
    gcost = memo[current.row][current.col].distance + 15;
  } else {
    gcost = memo[current.row][current.col].distance + 1;
  }

  if (keyFound) {
    fcost = Math.abs(end.row - next.row) + Math.abs(end.col - next.col);
  } else {
    fcost = Math.abs(key.row - next.row) + Math.abs(key.col - next.col);
  }
  // Return overall h cost
  return gcost + fcost;
}

// Add Position to Visitable Locations

function addPos(board, locations, current, nextPos, start, end, key) {
  if (star) {
    let cost = acost(board, current, nextPos, end, key);

    if (
      !memo[nextPos.row][nextPos.col].discovered ||
      memo[nextPos.row][nextPos.col].distance > cost
    ) {
      memo[nextPos.row][nextPos.col] = new DMemo(cost, true, current);

      if (nextPos.equals(end)) {
        if (keyFound) {
          throw new Error("End Found");
        } else {
          return;
        }
      }
      if (useKey && nextPos.equals(key)) {
        throw new Error("Key");
      }

      locations.push(nextPos);
      paint(board, nextPos.row, nextPos.col, keyFound ? searched : presearch);
    }
  } else {
    // Weighted Tiles are More Costly to Traverse
    let cost = board[current.row][current.col].color === sEnum.Weight ? 15 : 1;

    if (
      !memo[nextPos.row][nextPos.col].discovered ||
      memo[nextPos.row][nextPos.col].distance >
        memo[current.row][current.col].distance + cost
    ) {
      memo[nextPos.row][nextPos.col] = new DMemo(
        memo[current.row][current.col].distance + cost,
        true,
        current
      );

      if (nextPos.equals(end)) {
        if (keyFound) {
          throw new Error("End Found");
        } else {
          return;
        }
      }
      if (useKey && nextPos.equals(key)) {
        throw new Error("Key");
      }

      locations.push(nextPos);
      paint(board, nextPos.row, nextPos.col, keyFound ? searched : presearch);
    }
  }
}

// Search Locations arround current tile

function checkPos(current, locations, board, start, end, key) {
  if (legalPosition(current.row - 1, current.col, board)) {
    let nextPos = new Position(current.row - 1, current.col);
    addPos(board, locations, current, nextPos, start, end, key);
  } // check north
  if (legalPosition(current.row, current.col + 1, board)) {
    let nextPos = new Position(current.row, current.col + 1);
    addPos(board, locations, current, nextPos, start, end, key);
  } // check east
  if (legalPosition(current.row + 1, current.col, board)) {
    let nextPos = new Position(current.row + 1, current.col);
    addPos(board, locations, current, nextPos, start, end, key);
  } // check south
  if (legalPosition(current.row, current.col - 1, board)) {
    let nextPos = new Position(current.row, current.col - 1);
    addPos(board, locations, current, nextPos, start, end, key);
  } // check west
}

function loadRoute(end, stopper) {
  let route = [];
  let curr = new Position(end.row, end.col);

  while (!curr.equals(stopper)) {
    curr = memo[curr.row][curr.col].prev;

    if (!curr.equals(stopper)) {
      route.unshift(curr);
    }
  }

  return route;
}

function paintPath(board, start, end, key, speed) {
  let paintRoute = [];
  if (useKey) {
    paintRoute = keyPath.concat(loadRoute(end, key));
  } else {
    paintRoute = loadRoute(end, start);
  }

  paint(board, start.row, start.col, sEnum.Start);
  let painter = setInterval(p, 10 * speed);

  function p() {
    if (paintRoute.length === 0) {
      clearInterval(painter);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
      paint(board, end.row, end.col, sEnum.End);
    } else {
      let curr = paintRoute[0];
      if (!curr.equals(start)) {
        paint(board, curr.row, curr.col, found);
      }
      paintRoute.shift();
    }
  }
}

export function dijkstra(board, start, end, astar, key) {
  setupMemo(board, start);

  if (key) {
    useKey = true;
    keyFound = false;
    keyPath = [];
  } else {
    useKey = false;
    keyFound = true;
  }

  star = astar;

  let locations = [start];

  let speed = document.getElementById("speed").value;

  let searcher = setInterval(s, 15 * speed);

  function s() {
    if (locations.length === 0) {
      clearInterval(searcher);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
    } else {
      let current = locations.shift();

      if (!current.equals(start) && !current.equals(key)) {
        paint(board, current.row, current.col, keyFound ? visited : previsit);
      }

      try {
        checkPos(current, locations, board, start, end, key);
      } catch (e) {
        if (e.message === "Key") {
          keyPath = loadRoute(key, start);
          keyFound = true;

          setupMemo(board, key);
          locations = [key];
        } else {
          console.log(e.message);
          paintPath(board, start, end, key, speed);
          clearInterval(searcher);
        }
      }

      locations.sort(function (a, b) {
        return memo[a.row][a.col].distance - memo[b.row][b.col].distance;
      }); // Sort so that the shortest distance buddy is at the front
    }
  }
  return false;
}
