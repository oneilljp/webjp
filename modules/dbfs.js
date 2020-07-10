import { sEnum, Position, paint } from "./tile.js";
import { myCanvas } from "./canvas.js";

export var searched = "#689d6a";
export var visited = "#458588";
export var found = "#B48EAD";

var memo = [];
var deque = [];

export function legalPosition(row, col, board) {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length &&
    board[row][col].type != sEnum.Wall
  );
}

function checkPos(row, col, board, loc, dfs, end) {
  if (legalPosition(row, col, board) && !memo[row][col].discovered) {
    memo[row][col].discovered = true;
    memo[row][col].prev = loc;
    var nextPos = new Position(row, col);

    dfs ? deque.unshift(nextPos) : deque.push(nextPos);
    if (nextPos.row == end.row && nextPos.col == end.col) {
      throw new Error("End Found");
    }
    paint(board, row, col, searched);
  } else {
  }
}

function backColor(elements, start, end, speed) {
  var row = end.row;
  var col = end.col;

  var coloring = setInterval(c, 20 * speed);
  function c() {
    if (row == start.row && col == start.col) {
      clearInterval(coloring);
    } else {
      if (!(row == end.row && col == end.col)) {
        paint(elements, row, col, found);
      }
      switch (memo[row][col].prev) {
        case "s":
          row = row + 1;
          break;

        case "w":
          col = col - 1;
          break;

        case "n":
          row = row - 1;
          break;

        case "e":
          col = col + 1;
          break;
      }
    }
  }
}

// DFS = Stack BFS = Queue

export function dbfs(start, end, key, board, dfs) {
  var speed = document.getElementById("speed").value;
  console.log(board[0].length + " " + typeof end);
  if (
    !legalPosition(start.row, start.col, board) ||
    !legalPosition(end.row, end.col, board)
  ) {
    console.log("Invalid Start and/or End Position. Returning");
    return;
  }

  memo = [];
  for (var i = 0; i < board.length; ++i) {
    memo.push([]);
    for (var j = 0; j < board[0].length; ++j) {
      var logItem = new Object();
      logItem.discovered = false;
      memo[i].push(logItem);
    }
  }

  memo[start.row][start.col].discovered = true;
  deque = [start];

  var searcher = setInterval(s, 25 * speed);

  function s() {
    if (deque.length == 0) {
      clearInterval(searcher);
    } else {
      var current = new Position(deque[0].row, deque[0].col);
      deque.shift();
      if (!(current.row == start.row && current.col == start.col)) {
        paint(board, current.row, current.col, visited);
      }

      try {
        setTimeout(
          checkPos(current.row - 1, current.col, board, "s", dfs, end),
          1000
        );
        setTimeout(
          checkPos(current.row, current.col + 1, board, "w", dfs, end),
          2000
        );
        setTimeout(
          checkPos(current.row + 1, current.col, board, "n", dfs, end),
          3000
        );
        setTimeout(
          checkPos(current.row, current.col - 1, board, "e", dfs, end),
          4000
        );
      } catch (e) {
        console.log(e.message);
        backColor(board, start, end, speed);
        clearInterval(searcher);
      }
    }
  }

  console.log("End of Search");
  return false;
}
