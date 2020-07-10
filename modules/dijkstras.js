import { paint, sEnum } from "./tile.js";
import { legalPosition, visited, searched, found } from "./dbfs.js";
// Keep memo backlog of nodes to check if discovered, log shortest distance
// And log parent of shortest distance
//
// Make queue of discovered coordinates, every pass through sort it by
// Shortest distance from memo using a helper function somewhat like how we
// used less for heaps and whatnot. pass memo into this function so that
// we can keep the queue just as coords

var memo = [];
var star = false;

function setupMemo(board, start) {
  memo = [];
  for (var i = 0; i < board.length; ++i) {
    memo.push([]);
    for (var j = 0; j < board[0].length; ++j) {
      var piece = new Object();
      piece.distance = Number.POSITIVE_INFINITY;
      piece.discovered = false;
      memo[i].push(piece);
    }
  }

  memo[start.row][start.col].distance = 0;
  memo[start.row][start.col].parent = " ";
  memo[start.row][start.col].discovered = true;
}

// ASTAR COST CALCULATION

function acost(board, current, next, end) {
  var gcost, fcost;
  if (board[current.row][current.col].type === sEnum.Weight) {
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
    var cost = acost(board, current, nextPos, end);

    if (
      !memo[nextPos.row][nextPos.col].discovered ||
      memo[nextPos.row][nextPos.col].distance > cost
    ) {
      memo[nextPos.row][nextPos.col].discovered = true;
      memo[nextPos.row][nextPos.col].distance = cost;
      memo[nextPos.row][nextPos.col].parent = current;
      locations.push(nextPos);

      if (nextPos.row == end.row && nextPos.col == end.col) {
        throw new Error("End Found");
      } else {
        paint(board, nextPos.row, nextPos.col, searched);
      }
    }
  } else {
    // Weighted Tiles are More Costly to Traverse
    var cost = board[current.row][current.col].type === sEnum.Weight ? 5 : 1;

    if (
      !memo[nextPos.row][nextPos.col].discovered ||
      memo[nextPos.row][nextPos.col].distance >
        memo[current.row][current.col].distance + cost
    ) {
      memo[nextPos.row][nextPos.col].discovered = true;
      memo[nextPos.row][nextPos.col].distance =
        memo[current.row][current.col].distance + cost;
      memo[nextPos.row][nextPos.col].parent = current;
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
    var nextPos = new Object();
    nextPos.row = current.row - 1;
    nextPos.col = current.col;

    addPos(board, locations, current, nextPos, end);
  } // check north
  if (legalPosition(current.row, current.col + 1, board)) {
    var nextPos = new Object();
    nextPos.row = current.row;
    nextPos.col = current.col + 1;

    addPos(board, locations, current, nextPos, end);
  } // check east
  if (legalPosition(current.row + 1, current.col, board)) {
    var nextPos = new Object();
    nextPos.row = current.row + 1;
    nextPos.col = current.col;

    addPos(board, locations, current, nextPos, end);
  } // check south
  if (legalPosition(current.row, current.col - 1, board)) {
    var nextPos = new Object();
    nextPos.row = current.row;
    nextPos.col = current.col - 1;

    addPos(board, locations, current, nextPos, end);
  } // check west
}

function paintPath(board, start, end, speed) {
  var prev = memo[end.row][end.col].parent;

  var painter = setInterval(p, 20 * speed);

  function p() {
    if (prev.row == start.row && prev.col == start.col) {
      clearInterval(painter);
      return;
    }
    paint(board, prev.row, prev.col, found);
    prev = memo[prev.row][prev.col].parent;
  }
}

export function dijkstra(board, start, end, astar, key) {
  setupMemo(board, start);

  star = astar;

  var startPos = new Object();
  startPos.row = start.row;
  startPos.col = start.col;

  var locations = [startPos];

  var speed = document.getElementById("speed").value;

  var searcher = setInterval(s, 25 * speed);

  function s() {
    if (locations.length == 0) {
      clearInterval(searcher);
    } else {
      var current = locations[0];

      if (!(current.row == start.row && current.col == start.col)) {
        paint(board, current.row, current.col, visited);
      }

      try {
        checkPos(current, locations, board, end);
      } catch (e) {
        console.log(e.message);
        paintPath(board, start, end, speed);
        // TODO Paint Path Here
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
