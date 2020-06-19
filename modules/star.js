import { sEnum, Position, paint } from "./tile.js";
import { legalPosition, visited, searched, found } from "./dbfs.js";


function setupMemo(board, start, end) {
    var memo = [];

}

export function star(board, start, end) {
    var memo = setupMemo(board, start, end);
};