import { paint, sEnum, Position } from "./tile.js";
import { legalPosition, MemoItem, visited, searched, found } from "./dbfs.js";
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
var useKey = true;

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

function acost(board, current, next, end) {
  let gcost, fcost;
  if (board[current.row][current.col].color === sEnum.Weight) {
    gcost = memo[current.row][current.col].distance + 5;
  } else {
    gcost = memo[current.row][current.col].distance + 1;
  }

  // Calculate F Cost
  // Estimate distance from End using Basic Distance formula
  // fcost = Math.sqrt(
  //   Math.pow(end.row - next.row, 2) + Math.pow(end.col - next.col, 2)
  // );

  fcost = Math.abs(end.row - next.row) + Math.abs(end.col - next.col);

  // Return overall h cost
  return gcost + fcost;
}

// Add Position to Visitable Locations

function addPos(board, locations, current, nextPos, end) {
  if (star) {
    let cost = acost(board, current, nextPos, end);

    if (
      !memo[nextPos.row][nextPos.col].discovered ||
      memo[nextPos.row][nextPos.col].distance > cost
    ) {
      // memo[nextPos.row][nextPos.col].discovered = true;
      // memo[nextPos.row][nextPos.col].distance = cost;
      // memo[nextPos.row][nextPos.col].prev = current;
      memo[nextPos.row][nextPos.col] = new DMemo(cost, true, current);
      locations.push(nextPos);

      if (nextPos.row === end.row && nextPos.col === end.col) {
        throw new Error("End Found");
      } else {
        paint(board, nextPos.row, nextPos.col, searched);
      }
    }
  } else {
    // Weighted Tiles are More Costly to Traverse
    let cost = board[current.row][current.col].color === sEnum.Weight ? 5 : 1;

    if (
      !memo[nextPos.row][nextPos.col].discovered ||
      memo[nextPos.row][nextPos.col].distance >
        memo[current.row][current.col].distance + cost
    ) {
      // memo[nextPos.row][nextPos.col].discovered = true;
      // memo[nextPos.row][nextPos.col].distance =
      // memo[current.row][current.col].distance + cost;
      // memo[nextPos.row][nextPos.col].prev = current;
      memo[nextPos.row][nextPos.col] = new DMemo(
        memo[current.row][current.col].distance + cost,
        true,
        current
      );
      locations.push(nextPos);

      if (nextPos.row == end.row && nextPos.col == end.col) {
        throw new Error("End Found");
      } else {
        paint(board, nextPos.row, nextPos.col, searched);
      }
    }
  }
}

// Search Locations arround current tile

function checkPos(current, locations, board, end) {
  if (legalPosition(current.row - 1, current.col, board)) {
    let nextPos = new Position(current.row - 1, current.col);
    addPos(board, locations, current, nextPos, end);
  } // check north
  if (legalPosition(current.row, current.col + 1, board)) {
    let nextPos = new Position(current.row, current.col + 1);
    addPos(board, locations, current, nextPos, end);
  } // check east
  if (legalPosition(current.row + 1, current.col, board)) {
    let nextPos = new Position(current.row + 1, current.col);
    addPos(board, locations, current, nextPos, end);
  } // check south
  if (legalPosition(current.row, current.col - 1, board)) {
    let nextPos = new Position(current.row, current.col - 1);
    addPos(board, locations, current, nextPos, end);
  } // check west
}

function loadRoute(end, stopper) {
  let route = [];
  let curr = end;

  while (!curr.equals(stopper)) {
    curr = memo[curr.row][curr.col].prev;

    if (!curr.equals(stopper)) {
      route.unshift(curr);
    }
  }

  return route;
}

function paintPath(board, start, end, speed) {
  let paintRoute = [];
  if (false) {
  } else {
    paintRoute = loadRoute(end, start);
  }

  paint(board, start.row, start.col, sEnum.Start);
  let painter = setInterval(p, 20 * speed);

  function p() {
    if (paintRoute.length === 0) {
      clearInterval(painter);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
      paint(board, end.row, end.col, sEnum.End);
    } else {
      let curr = paintRoute[0];
      paint(board, curr.row, curr.col, found);
      paintRoute.shift();
    }
  }
}

export function dijkstra(board, start, end, astar, key) {
  setupMemo(board, start);

  star = astar;

  let locations = [start];

  let speed = document.getElementById("speed").value;

  let searcher = setInterval(s, 25 * speed);

  function s() {
    if (locations.length === 0) {
      clearInterval(searcher);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
    } else {
      let current = locations[0];

      if (!current.equals(start)) {
        paint(board, current.row, current.col, visited);
      }

      try {
        checkPos(current, locations, board, end);
      } catch (e) {
        console.log(e.message);
        paintPath(board, start, end, speed);
        clearInterval(searcher);
      }

      locations.shift();
      locations.sort(function (a, b) {
        return memo[a.row][a.col].distance - memo[b.row][b.col].distance;
      }); // Sort so that the shortest distance buddy is at the front
    }
  }
  return false;
}
