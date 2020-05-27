import { name, sEnum, Position, Tile, resize, draw } from './modules/tile.js';
import { dbfs } from './modules/dbfs.js';

// Canvas Creation
// var myCanvas = create('myCanvas', document.body, window.innerWidth, 600);

// Tile creation
var elements = [];
elements = resize(true, elements, 40, 22, 7);
elements[0][0].color = elements[0][0].type = sEnum.Start;
elements[0][elements[0].length - 1].color = elements[0][elements[0].length - 1].type = sEnum.End;
draw(window.innerWidth, 600, elements);

var start = new Position(0, 0);
var end = new Position(0, elements[0].length - 1);


// Slider Stuff
let slider = document.getElementById("boardSize");
var output = document.getElementById("soutput");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
    elements = resize(false, elements, slider.value, 22, 7);
    draw(window.innerWidth, 600, elements);
    //draw();
};

// CLick Listener
var elem = document.getElementById(myCanvas.id),
    elemLeft = elem.offsetLeft + elem.clientLeft,
    elemTop = elem.offsetTop + elem.clientTop;

elem.addEventListener(
    "click",
    function (event) {
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
    },
    false
);

// dbfs(start, end, elements, false);

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
};
