import { name, sEnum, Position, Tile, resize, draw } from './modules/tile.js';
import { dbfs } from './modules/dbfs.js';
import { dijkstra } from './modules/dijkstras.js';

// Canvas Creation
// var myCanvas = create('myCanvas', document.body, window.innerWidth, 600);
var rowNum = 60;
var colNum = 20;

// Tile creation
var elements = [];
elements = resize(true, elements, rowNum, colNum);
elements[8][5].color = elements[0][0].type = sEnum.Start;
elements[8][elements[0].length - 6].color = elements[0][elements[0].length - 1].type = sEnum.End;
draw(window.innerWidth, 600, elements);

var start = new Position(8, 5);
var end = new Position(8, elements[0].length - 6);


// Slider Stuff
// let slider = document.getElementById("boardSize");
// var output = document.getElementById("soutput");
// output.innerHTML = slider.value;

// slider.oninput = function () {
// output.innerHTML = this.value;
elements = resize(false, elements, rowNum, colNum);
draw(window.innerWidth, 600, elements);
//draw();
// };

// CLick Listener
var elem = document.getElementById(myCanvas.id),
    elemLeft = elem.offsetLeft + elem.clientLeft,
    elemTop = elem.offsetTop + elem.clientTop;

var listener = function (event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    for (var i = 0; i < elements.length; ++i) {
        for (var j = 0; j < elements[i].length; ++j) {
            if (
                y > elements[i][j].top &&
                y < elements[i][j].top + elements[i][j].height &&
                x > elements[i][j].left &&
                x < elements[i][j].left + elements[i][j].width
            ) {
                console.log("clicked element x:" + i + " y:" + j);
                var e = document.getElementById("tileType");
                console.log(e.value);
                var type = e.value;

                if ((i === start.row && j === start.col) || (i === end.row && j === end.col)) {
                    return;
                }

                if (type === sEnum.Wall) {
                    if (elements[i][j].type === type) {
                        elements[i][j].color = elements[i][j].type = sEnum.Empty;
                    }
                    else {
                        elements[i][j].color = elements[i][j].type = type;
                    }
                }
                else if (type == sEnum.Start) {
                    elements[i][j].color = elements[i][j].type = sEnum.Start;
                    elements[start.row][start.col].color = elements[start.row][start.col].type = sEnum.Empty;
                    start.row = i;
                    start.col = j;
                }
                else {
                    elements[i][j].color = elements[i][j].type = sEnum.End;
                    elements[end.row][end.col].color = elements[end.row][end.col].type = sEnum.Empty;
                    end.row = i;
                    end.col = j;
                }

                draw(window.innerWidth, 600, elements);
            }
        }
    }
};

// elem.addEventListener(
//     "click",
//     listener,
//     false
// );

elem.addEventListener("click", listener, false);

var button = document.getElementById('start');
button.onclick = function () {
    var searchType = document.getElementById('searchType');
    var s = searchType.value;

    if (s == "dfs") {
        dbfs(start, end, elements, true);
    }
    else if (s == "bfs") {
        dbfs(start, end, elements, false);
    }
    else if (s == "dijkstra") {
        dijkstra(elements, start, end);
    }
};
