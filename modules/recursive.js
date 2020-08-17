import { sEnum, draw, Position, paint } from "./tile.js";

function validCandidate(board, cand, x1, x2, y1, y2, vert) {}

function VDivide(board, x1, x2, y1, y2) {
  let numCandidates = Math.abs(x1 - x2) - 2;
  if (numCandidates < 1) {
    return;
  }

  let candidates = [];
  while (numCandidates < x2) {
    candidates.push(numCandidates);
  }

  while (candidates !== 0) {
    let selected = Math.floor(Math.random() * candidates.length);
  }
}

function HDivide(board, x1, x2, y1, y2) {
  if (Math.abs(y1 - y2) < 3) {
    return;
  }
}

function borders(board) {
  let waiting = true;

  let speed = document.getElementById("speed").value;
  let row = 0;
  let col = 0;

  let sides = setInterval(s, speed);
  function s() {
    if (row === board.length) {
      clearInterval(sides);
    } else {
      board[row][0].color = sEnum.Wall;
      board[board.length - row - 1][board[0].length - 1].color = sEnum.Wall;
      paint(board, row, 0, sEnum.Wall);
      paint(board, board.length - row - 1, board[0].length - 1, sEnum.Wall);
      ++row;
    }
  }

  let topbot = setInterval(tb, speed);
  function tb() {
    if (col === board[0].length) {
      clearInterval(topbot);
    } else {
      board[0][col].color = sEnum.Wall;
      board[board.length - 1][board[0].length - col - 1].color = sEnum.Wall;
      paint(board, 0, col, sEnum.Wall);
      paint(board, board.length - 1, board[0].length - col - 1, sEnum.Wall);
      ++col;
    }
  }
}

export function RecursiveDivision(board) {
  borders(board);
}
