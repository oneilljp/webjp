var dfs = function (start, end, board) {
    if (start.x < 0 || start.x >= board.length || start.y < 0 || start.y > board[0].length ||
        end.x < 0 || end.x >= board.length || end.y < 0 || end.y > board[0].length || start === end) {
        console.log("Invalid Start and End positions. Returning");
        return;
    } // Checking for invalid positions

}

export function tester() {
    console.log(width);
}
