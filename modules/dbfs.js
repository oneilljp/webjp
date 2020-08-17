import { sEnum, Position, paint } from "./tile.js";

export var presearch = "#5E81AC";
export var searched = "#689d6a";
export var previsit = "#8FBCBB";
export var visited = "#458588";
export var found = "#B48EAD";

var memo = [];
var deque = [];
var useKey = false;
var keyPath = [];
var keyFound = true;

export class MemoItem {
  constructor(discovered = false, prev = "") {
    this.discovered = discovered;
    this.prev = prev;
  }
}

function loadMemo(board) {
  let temp = [];
  for (let i = 0; i < board.length; ++i) {
    temp.push([]);
    for (let j = 0; j < board[0].length; ++j) {
      let logItem = new MemoItem();
      temp[i].push(logItem);
    }
  }

  return temp;
}

export function legalPosition(row, col, board) {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length &&
    board[row][col].color != sEnum.Wall
  );
}

function checkPos(row, col, board, loc, dfs, end) {
  if (legalPosition(row, col, board) && !memo[row][col].discovered) {
    memo[row][col].discovered = true;
    memo[row][col].prev = loc;
    let nextPos = new Position(row, col);

    if (nextPos.equals(end)) {
      if (keyFound) {
        throw new Error("End Found");
      } else {
        return;
      }
    }
    if (useKey) {
      if (nextPos.equals(useKey)) {
        throw new Error("Key");
      }
    }
    dfs ? deque.unshift(nextPos) : deque.push(nextPos);

    if (useKey && !keyFound) {
      paint(board, row, col, presearch);
    } else {
      paint(board, row, col, searched);
    }
  }
}

// Load Route from the end to the stop tile
function loadRoute(end, stopper) {
  let route = [];
  let curr = new Position(end.row, end.col);

  while (!curr.equals(stopper)) {
    switch (memo[curr.row][curr.col].prev) {
      case "s":
        curr.row++;
        break;

      case "w":
        curr.col--;
        break;

      case "n":
        curr.row--;
        break;

      case "e":
        curr.col++;
        break;
    }
    if (!curr.equals(stopper)) {
      route.unshift(new Position(curr.row, curr.col));
    }
  }
  return route;
}

function backColor(elements, start, end, speed) {
  let paintRoute = [];
  if (useKey) {
    paintRoute = keyPath.concat(loadRoute(end, useKey));
  } else {
    paintRoute = loadRoute(end, start);
  }

  paint(elements, start.row, start.col, sEnum.Start);
  let painting = setInterval(c, 10 * speed);
  paint(elements, start.row, start.col, sEnum.Start);

  function c() {
    if (paintRoute.length === 0) {
      clearInterval(painting);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
      paint(elements, end.row, end.col, sEnum.End);
    } else {
      let curr = paintRoute[0];
      if (!curr.equals(start)) {
        paint(elements, curr.row, curr.col, found);
      }
      paintRoute.shift();
    }
  }
}

// DFS = Stack BFS = Queue

export function dbfs(start, end, key, board, dfs) {
  let speed = document.getElementById("speed").value;
  console.log(board[0].length + " " + typeof end);

  memo = loadMemo(board);

  if (key) {
    useKey = key;
    keyPath = [];
    keyFound = false;
  } else {
    keyFound = true;
    useKey = false;
  }

  memo[start.row][start.col].discovered = true;
  deque = [start];

  let searcher = setInterval(s, 15 * speed);

  function s() {
    if (deque.length === 0) {
      clearInterval(searcher);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
    } else {
      let current = new Position(deque[0].row, deque[0].col);
      deque.shift();
      if (
        !current.equals(start) &&
        !current.equals(end) &&
        (useKey ? !current.equals(key) : true)
      ) {
        if (useKey && !keyFound) {
          paint(board, current.row, current.col, previsit);
        } else {
          paint(board, current.row, current.col, visited);
        }
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

        if (e.message === "Key") {
          let tracer = new Position(key.row, key.col);
          while (!tracer.equals(start)) {
            switch (memo[tracer.row][tracer.col].prev) {
              case "n":
                tracer.row--;
                break;
              case "e":
                tracer.col++;
                break;
              case "s":
                tracer.row++;
                break;
              case "w":
                tracer.col--;
                break;
            }

            if (!tracer.equals(start)) {
              keyPath.unshift(new Position(tracer.row, tracer.col));
            }
          }

          // Reset memo to search again from key, avoiding start
          memo = loadMemo(board);
          memo[key.row][key.col].discovered = true;

          deque = [key];
          keyFound = true;
        } else {
          backColor(board, start, end, speed);
          clearInterval(searcher);
        }
      }
    }
  }

  console.log("End of Search");
  return false;
}
