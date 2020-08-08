import { sEnum, draw, Position, paint } from "./tile.js";

var walls = [];

function inBounds(board, pos) {
  return (
    pos.row >= 0 &&
    pos.row < board.length &&
    pos.col >= 0 &&
    pos.col < board[0].length
  );
}

function addWalls(board, pos) {
  var N = new Position(pos.row - 1, pos.col);
  var E = new Position(pos.row, pos.col + 1);
  var S = new Position(pos.row + 1, pos.col);
  var W = new Position(pos.row, pos.col - 1);

  let locs = [N, E, S, W];
  for (var i = 0; i < locs.length; ++i) {
    if (
      inBounds(board, locs[i]) &&
      board[locs[i].row][locs[i].col].color == sEnum.Wall &&
      !walls.includes(locs[i])
    ) {
      walls.push(locs[i]);
    }
  }
}

function checkWall(board, pos) {
  var openCount = 0;
  var N = new Position(pos.row - 1, pos.col);
  var E = new Position(pos.row, pos.col + 1);
  var S = new Position(pos.row + 1, pos.col);
  var W = new Position(pos.row, pos.col - 1);

  let locs = [N, E, S, W];
  for (var i = 0; i < locs.length; ++i) {
    if (
      inBounds(board, locs[i]) &&
      board[locs[i].row][locs[i].col].color != sEnum.Wall &&
      board[locs[i].row][locs[i].col].color != sEnum.End
    ) {
      ++openCount;
    }
    if (inBounds(board, locs[i]) && walls.includes(locs[i])) {
      --openCount;
    }
  }

  return openCount == 1;
}

function shuffleWalls() {
  for (var i = walls.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = walls[i];
    walls[i] = walls[j];
    walls[j] = temp;
  }
}

export function Prims(board, start, end) {
  for (var i = 0; i < board.length; ++i) {
    for (var j = 0; j < board[0].length; ++j) {
      if (board[i][j].color == sEnum.Empty) {
        board[i][j].color = sEnum.Wall;
      }
    }
  }

  draw(board);

  walls = [];
  addWalls(board, start);

  var speed = document.getElementById("speed").value;

  var primLoop = setInterval(p, 5 * speed);

  function p() {
    if (walls.length == 0) {
      clearInterval(primLoop);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
    } else {
      shuffleWalls();
      var current = walls.shift();

      if (checkWall(board, current)) {
        board[current.row][current.col].color = sEnum.Empty;
        paint(board, current.row, current.col, sEnum.Empty);
        addWalls(board, current);
      }
    }
  }
}
