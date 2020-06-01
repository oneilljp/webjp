import { sEnum, Position } from "./tile.js";
import { myCanvas } from "./canvas.js";

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

export function dijkstra(board, start, end) {
    var backlog = setupMemo(board, start);


}