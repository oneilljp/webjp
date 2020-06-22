import { paint } from "./tile.js";
import { legalPosition, visited, searched, found } from "./dbfs.js";
// Keep memo backlog of nodes to check if discovered, log shortest distance
// And log parent of shortest distance
//
// Make queue of discovered coordinates, every pass through sort it by
// Shortest distance from memo using a helper function somewhat like how we
// used less for heaps and whatnot. pass memo into this function so that
// we can keep the queue just as coords

// NEED TO ADD PAINTING

function setupMemo(board, start) {
  var memo = [];
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

  return memo;
}

function addPos(memo, board, locations, current, nextPos, end) {
  if (
    !memo[nextPos.row][nextPos.col].discovered ||
    memo[nextPos.row][nextPos.col].distance >
      memo[current.row][current.col].distance + 1
  ) {
    memo[nextPos.row][nextPos.col].discovered = true;
    memo[nextPos.row][nextPos.col].distance =
      memo[current.row][current.col].distance + 1;
    memo[nextPos.row][nextPos.col].parent = current;
    locations.push(nextPos);

    if (nextPos.row == end.row && nextPos.col == end.col) {
      throw new Error("End Found");
    } else {
      paint(board, nextPos.row, nextPos.col, searched);
    }
  }
}

function checkPos(current, locations, memo, board, end) {
  if (legalPosition(current.row - 1, current.col, board)) {
    var nextPos = new Object();
    nextPos.row = current.row - 1;
    nextPos.col = current.col;

    addPos(memo, board, locations, current, nextPos, end);
  } // check north
  if (legalPosition(current.row, current.col + 1, board)) {
    var nextPos = new Object();
    nextPos.row = current.row;
    nextPos.col = current.col + 1;

    addPos(memo, board, locations, current, nextPos, end);
  } // check east
  if (legalPosition(current.row + 1, current.col, board)) {
    var nextPos = new Object();
    nextPos.row = current.row + 1;
    nextPos.col = current.col;

    addPos(memo, board, locations, current, nextPos, end);
  } // check south
  if (legalPosition(current.row, current.col - 1, board)) {
    var nextPos = new Object();
    nextPos.row = current.row;
    nextPos.col = current.col - 1;

    addPos(memo, board, locations, current, nextPos, end);
  } // check west
}

function paintPath(board, memo, start, end) {
  var prev = memo[end.row][end.col].parent;

  var painter = setInterval(p, 30);

  function p() {
    if (prev.row == start.row && prev.col == start.col) {
      clearInterval(painter);
      return;
    }
    paint(board, prev.row, prev.col, found);
    prev = memo[prev.row][prev.col].parent;
  }
}

export function dijkstra(board, start, end) {
  var memo = setupMemo(board, start);

  var startPos = new Object();
  startPos.row = start.row;
  startPos.col = start.col;

  var locations = [startPos];

  var searcher = setInterval(s, 25);

  function s() {
    if (locations.length == 0) {
      clearInterval(searcher);
    } else {
      var current = locations[0];

      if (!(current.row == start.row && current.col == start.col)) {
        paint(board, current.row, current.col, visited);
      }

      try {
        checkPos(current, locations, memo, board, end);
      } catch (e) {
        console.log(e.message);
        paintPath(board, memo, start, end);
        // TODO Paint Path Here
        clearInterval(searcher);
      }

      locations.shift();
      locations.sort(function (a, b) {
        return memo[a.row][a.col].distance - memo[b.row][b.col].distance;
      }); // Sort so that the shortest distance buddy is at the front
    }
  }
}
