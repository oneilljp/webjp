import { sEnum, Position, paint } from "./tile.js";
import { myCanvas } from "./canvas.js";

export var searched = "#689d6a";
export var visited = "#458588";
export var found = "#B48EAD";

export function legalPosition(row, col, board) {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length &&
    board[row][col].type != sEnum.Wall
  );
}

function checkPos(row, col, board, memo, deque, loc, dfs, end) {
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

function backColor(memo, elements, start, end) {
  var row = end.row;
  var col = end.col;

  var coloring = setInterval(c, 100);
  function c() {
    if (row == start.row && col == start.col) {
      clearInterval(coloring);
    } else {
      if (!(row == end.row && col == end.col)) {
        paint(elements, row, col, found);
        myCanvas.ctx.fillRect(
          elements[row][col].left,
          elements[row][col].top,
          elements[row][col].width,
          elements[row][col].height
        );
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

export function dbfs(start, end, board, dfs) {
  console.log(board[0].length + " " + typeof end);
  if (
    !legalPosition(start.row, start.col, board) ||
    !legalPosition(end.row, end.col, board)
  ) {
    console.log("Invalid Start and/or End Position. Returning");
    return;
  }

  var memo = [];
  for (var i = 0; i < board.length; ++i) {
    memo.push([]);
    for (var j = 0; j < board[0].length; ++j) {
      var logItem = new Object();
      logItem.discovered = false;
      memo[i].push(logItem);
    }
  }

  memo[start.row][start.col].discovered = true;
  var deque = [start];

  var searcher = setInterval(s, 100);

  // while (deque.length != 0) {
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
          checkPos(
            current.row - 1,
            current.col,
            board,
            memo,
            deque,
            "s",
            dfs,
            end
          ),
          1000
        );
        setTimeout(
          checkPos(
            current.row,
            current.col + 1,
            board,
            memo,
            deque,
            "w",
            dfs,
            end
          ),
          2000
        );
        setTimeout(
          checkPos(
            current.row + 1,
            current.col,
            board,
            memo,
            deque,
            "n",
            dfs,
            end
          ),
          3000
        );
        setTimeout(
          checkPos(
            current.row,
            current.col - 1,
            board,
            memo,
            deque,
            "e",
            dfs,
            end
          ),
          4000
        );
      } catch (e) {
        console.log(e.message);
        backColor(memo, board, start, end);
        clearInterval(searcher);
      }
    }
  }

  console.log("End of Search");
}
