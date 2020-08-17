import { sEnum, draw, Position, paint } from "./tile.js";

var walls = [];

export function inBounds(board, pos) {
  return (
    pos.row >= 0 &&
    pos.row < board.length &&
    pos.col >= 0 &&
    pos.col < board[0].length
  );
}

function addWalls(board, pos) {
  let N = new Position(pos.row - 1, pos.col);
  let E = new Position(pos.row, pos.col + 1);
  let S = new Position(pos.row + 1, pos.col);
  let W = new Position(pos.row, pos.col - 1);

  let locs = [N, E, S, W];
  for (let i = 0; i < locs.length; ++i) {
    if (
      inBounds(board, locs[i]) &&
      board[locs[i].row][locs[i].col].color === sEnum.Wall &&
      !walls.includes(locs[i])
    ) {
      walls.push(locs[i]);
    }
  }
}

function checkWall(board, pos) {
  let openCount = 0;
  let N = new Position(pos.row - 1, pos.col);
  let E = new Position(pos.row, pos.col + 1);
  let S = new Position(pos.row + 1, pos.col);
  let W = new Position(pos.row, pos.col - 1);

  let locs = [N, E, S, W];
  for (let i = 0; i < locs.length; ++i) {
    if (
      inBounds(board, locs[i]) &&
      board[locs[i].row][locs[i].col].color !== sEnum.Wall &&
      board[locs[i].row][locs[i].col].color !== sEnum.End
    ) {
      ++openCount;
    }
    if (inBounds(board, locs[i]) && walls.includes(locs[i])) {
      --openCount;
    }
  }

  return openCount === 1;
}

function shuffleWalls() {
  for (let i = walls.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = walls[i];
    walls[i] = walls[j];
    walls[j] = temp;
  }
}

export function Prims(board, start) {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[0].length; ++j) {
      if (board[i][j].color === sEnum.Empty) {
        board[i][j].color = sEnum.Wall;
      }
    }
  }

  draw(board);

  walls = [];
  addWalls(board, start);

  let speed = document.getElementById("speed").value;

  let primLoop = setInterval(p, speed);

  function p() {
    if (walls.length === 0) {
      clearInterval(primLoop);
      document.getElementById("start").disabled = false;
      document.getElementById("start").innerHTML = "Start";
    } else {
      shuffleWalls();
      let current = walls.shift();

      if (checkWall(board, current)) {
        board[current.row][current.col].color = sEnum.Empty;
        paint(board, current.row, current.col, sEnum.Empty);
        addWalls(board, current);
      }
    }
  }
}
