import { paint, sEnum, Position } from "./tile.js";
import { legalPosition, MemoItem, visited, searched, found } from "./dbfs.js";

// Redoing A Star alg:
// Keeping list of potential neighbors
// Update neighbors w/ shortest distance and parent using manhattan distance
// Pick shortest distance out of current neighbors to go to, then add/update it's neighbors

// Logging information
var memo = [];
var candidates = [];

// Key Info
var useKey = false;
var keyPath = [];
var keyFound = true;

class StarMemo extends MemoItem {
  constructor(distance, prev) {
    super(NaN, prev);
    this.distance = distance;
  }
}

function loadMemo(board, start) {
  memo = [];
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[0].length; ++j) {
      let entry = new StarMemo(Number.POSITIVE_INFINITY, "");
      memo[i].push(entry);
    }
  }

  memo[start.row][start.col] = new StarMemo(0, "");
}

function indexOfPos(pos) {
  for (let i = 0; i < candidates.length; ++i) {
    if (pos.equals(candidates[i])) return i;
  }
  return -1;
}

function updateDistance(board, curr, next, end) {
  let gcost, fcost;

  if (board[curr.row][curr.col].color === sEnum.Weight) {
    gcost = memo[current.row][current.col].distance + 15;
  } else {
    gcost = memo[current.row][current.col].distance + 1;
  }

  // Calculate Manhattan Distance dependant on if key is enabled
  // Move Towards key if needed, otherwise go towards end tile
  if (useKey) {
    if (keyFound) {
      fcost = Math.abs(end.row - next.row) + Math.abs(useKey.col - next.col);
    } else {
      fcost = Math.abs(useKey.row - next.row) + Math.abs(useKey.col - next.col);
    }
  } else {
    fcost = Math.abs(end.row - next.row) + Math.abs(end.col - next.col);
  }

  return gcost + fcost;
}

function update(pos, parent, index) {}

function updateNeighbors(pos) {
  let curr;
  // N
  if (legalPosition(pos.row - 1, pos.col, board)) {
    curr = new Position(pos.row - 1, pos.col);
  }
  // E
  if (legalPosition(pos.row, pos.col + 1)) {
    curr = new Position(pos.row, pos.col + 1);
  }
  // S
  if (legalPosition(pos.row + 1, pos.col)) {
    curr = new Position(pos.row + 1, pos.col);
  }
  // W
  if (legalPosition(pos.row, pos.col - 1)) {
    curr = new Position(pos.row, pos.col - 1);
  }
}

export function astar(board, start, end, key) {
  loadMemo(board, start);

  if (key) {
    useKey = key;
    keyPath = [];
    keyFound = false;
  } else {
    keyFound = true;
    useKey = false;
  }
}
