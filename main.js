import { sEnum, Position, Tile, resize, draw } from "./modules/tile.js";
import { dbfs, visited, searched, found } from "./modules/dbfs.js";
import { dijkstra } from "./modules/dijkstras.js";

// TODO MAKE RECOLOR FUNCTION!!!!!

// var rowNum = 60;
// var colNum = 20;

// Tile creation
var elements = [];
elements = resize(true, elements);
var start = new Position(elements.length / 2 - 1, 5);
var end = new Position(elements.length / 2 - 1, elements[0].length - 6);

elements[start.row][start.col].color = elements[start.row][start.col].type =
  sEnum.Start;
elements[end.row][end.col].color = elements[end.row][end.col].type = sEnum.End;
draw(window.innerWidth, 600, elements);

var key = false;

elements = resize(false, elements);
draw(window.innerWidth, 600, elements);

window.onresize = (event) => {
  elements = resize(true, elements);
  draw(window.innerWidth, 600, elements);
};

// CLick Listener
var elem = document.getElementById(myCanvas.id),
  elemLeft = elem.offsetLeft + elem.clientLeft,
  elemTop = elem.offsetTop + elem.clientTop;

var clicked = 0,
  lastX = -1,
  lastY = -1;

var listener = function (event) {
  if (!clicked && event.type == "mousemove") {
    return;
  }
  var x = event.pageX - elemLeft,
    y = event.pageY - elemTop;

  for (var i = 0; i < elements.length; ++i) {
    for (var j = 0; j < elements[i].length; ++j) {
      if (i == lastX && j == lastY && event.type == "mousemove") {
        continue;
      }
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

        if (
          (i === start.row && j === start.col) ||
          (i === end.row && j === end.col)
        ) {
          return;
        }

        if (type === sEnum.Wall) {
          if (elements[i][j].type === type) {
            elements[i][j].color = elements[i][j].type = sEnum.Empty;
          } else {
            elements[i][j].color = elements[i][j].type = type;
          }
        } else if (type === sEnum.Weight) {
          if (elements[i][j].type === type) {
            elements[i][j].color = elements[i][j].type = sEnum.Empty;
          } else {
            elements[i][j].color = elements[i][j].type = type;
          }
        } else if (type == sEnum.Start) {
          elements[i][j].color = elements[i][j].type = sEnum.Start;
          elements[start.row][start.col].color = elements[start.row][
            start.col
          ].type = sEnum.Empty;
          start.row = i;
          start.col = j;
        } else if (type == sEnum.Key) {
          if (key && key.row == i && key.col == j) {
            // Remove Key
            elements[i][j].color = elements[i][j].type = sEnum.Empty;
            key = false;
          } else if (key) {
            // Move Key
            elements[key.row][key.col].color = elements[key.row][key.col].type =
              sEnum.Empty;
            elements[i][j].color = elements[i][j].type = sEnum.Key;
            key.row = i;
            key.col = j;
          } else {
            // New Key
            elements[i][j].color = elements[i][j].type = sEnum.Key;
            key = new Position(i, j);
          }
        } else {
          elements[i][j].color = elements[i][j].type = sEnum.End;
          elements[end.row][end.col].color = elements[end.row][end.col].type =
            sEnum.Empty;
          end.row = i;
          end.col = j;
        }

        lastX = i;
        lastY = j;
        draw(window.innerWidth, 600, elements);
      }
    }
  }
};

elem.addEventListener("mousemove", listener, false);
elem.addEventListener("click", listener, false);
elem.addEventListener(
  "mousedown",
  () => {
    ++clicked;
  },
  false
);
elem.addEventListener(
  "mouseup",
  () => {
    --clicked;
    lastX = -1;
    lastY = -1;
  },
  false
);

// BEG Reference Label Coloring
var vCan = document.getElementById("vColor");
var vctx = vCan.getContext("2d");

var refColors = [
  sEnum.Start,
  sEnum.End,
  sEnum.Key,
  sEnum.Weight,
  sEnum.Wall,
  searched,
  visited,
  found,
];
var refLabels = [
  "Start Node",
  "End Node",
  "Key",
  "Weighted Tile",
  "Wall",
  "Searched",
  "Visited",
  "Path-To",
];

vctx.fillStyle = "#4C566A";
vctx.fillRect(10, 0, 192, 250);

for (var i = 0; i < refColors.length; ++i) {
  vctx.fillStyle = refColors[i];
  vctx.fillRect(20, 10 + 30 * i, 24, 24);
  vctx.font = "14px Fira Code";
  vctx.textAllign = "center";
  vctx.fillStyle = "#d8dee9";
  vctx.fillText(refLabels[i], 54, 28 + 30 * i);
}

// END Reference Label Coloring

// BEG Alg Execution
var button = document.getElementById("start");
button.onclick = function () {
  var searchType = document.getElementById("searchType");
  var s = searchType.value;

  if (s == "dfs") {
    draw(window.innerWidth, 600, elements);
    dbfs(start, end, key, elements, true);
  } else if (s == "bfs") {
    draw(window.innerWidth, 600, elements);
    dbfs(start, end, key, elements, false);
  } else if (s == "dijkstra") {
    draw(window.innerWidth, 600, elements);
    dijkstra(elements, start, end, false, key);
  } else if (s == "astar") {
    draw(window.innerWidth, 600, elements);
    dijkstra(elements, start, end, true, key);
  }
};
// END Alg Execution
