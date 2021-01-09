import { sEnum, Position, Tile, resize, draw } from "./modules/tile.js";
import {
  dbfs,
  visited,
  searched,
  previsit,
  presearch,
  found,
} from "./modules/dbfs.js";
import { dijkstra } from "./modules/dijkstras.js";
import { aStar } from "./modules/astar.js";
import { Prims } from "./modules/prims.js";
import { Kruskals } from "./modules/kruskals.js";
import { RecursiveDivision } from "./modules/recursive.js";

// TODO MAKE RECOLOR FUNCTION!!!!!

// var rowNum = 60;
// var colNum = 20;

// Tile creation
var elements = [];
elements = resize(true, elements);
var start = new Position(elements.length / 2 - 1, 5);
var end = new Position(elements.length / 2 - 1, elements[0].length - 6);

elements[start.row][start.col].color = sEnum.Start;
elements[end.row][end.col].color = sEnum.End;
draw(elements);

var key = false;

elements = resize(false, elements);
draw(elements);

window.onresize = (event) => {
  document.getElementById("myCanvas").width = window.innerWidth - 265;
  elements = resize(true, elements);
  start = new Position(elements.length / 2 - 1, 5);
  end = new Position(elements.length / 2 - 1, elements[0].length - 6);

  elements[start.row][start.col].color = sEnum.Start;
  elements[end.row][end.col].color = sEnum.End;

  draw(elements);
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
        y >= elements[i][j].top &&
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
          if (elements[i][j].color === type) {
            elements[i][j].color = sEnum.Empty;
          } else {
            elements[i][j].color = type;
          }
        } else if (type === sEnum.Weight) {
          if (elements[i][j].color === type) {
            elements[i][j].color = sEnum.Empty;
          } else {
            elements[i][j].color = type;
          }
        } else if (type == sEnum.Start) {
          elements[i][j].color = sEnum.Start;
          elements[start.row][start.col].color = sEnum.Empty;
          start.row = i;
          start.col = j;
        } else if (type == sEnum.Key) {
          if (key && key.row == i && key.col == j) {
            // Remove Key
            elements[i][j].color = sEnum.Empty;
            key = false;
          } else if (key) {
            // Move Key
            elements[key.row][key.col].color = sEnum.Empty;
            elements[i][j].color = sEnum.Key;
            key.row = i;
            key.col = j;
          } else {
            // New Key
            elements[i][j].color = sEnum.Key;
            key = new Position(i, j);
          }
        } else {
          elements[i][j].color = sEnum.End;
          elements[end.row][end.col].color = sEnum.Empty;
          end.row = i;
          end.col = j;
        }

        lastX = i;
        lastY = j;
        draw(elements);
      }
    }
  }
};

elem.addEventListener("mousemove", listener, false);
elem.addEventListener("click", listener, false);
elem.addEventListener(
  "mousedown",
  () => {
    clicked = 1;
  },
  false
);
elem.addEventListener(
  "mouseup",
  () => {
    clicked = 0;
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
vctx.fillRect(10, 0, 182, 250);

for (var i = 0; i < refColors.length; ++i) {
  vctx.fillStyle = refColors[i];
  vctx.fillRect(20, 10 + 30 * i, 24, 24);
  vctx.font = "14px Fira Code";
  vctx.textAllign = "center";
  vctx.fillStyle = "#d8dee9";
  vctx.fillText(refLabels[i], 54, 28 + 30 * i);
}

vctx.fillStyle = presearch;
vctx.fillRect(20, 160, 12, 24);

vctx.fillStyle = previsit;
vctx.fillRect(20, 190, 12, 24);

// END Reference Label Coloring

// BEG Alg Execution
var button = document.getElementById("start");
button.onclick = async function () {
  button.disabled = true;
  button.innerHTML = "Running...";
  var searchType = document.getElementById("searchType");
  var s = searchType.value;

  if (s == "dfs") {
    draw(elements);
    dbfs(start, end, key, elements, true);
  } else if (s == "bfs") {
    draw(elements);
    dbfs(start, end, key, elements, false);
  } else if (s == "dijkstra") {
    draw(elements);
    dijkstra(elements, start, end, false, key);
  } else if (s === "bdijkstra") {
    draw(elements);
    dijkstra(elements, start, end, true, key);
  } else if (s == "astar") {
    draw(elements);
    aStar(elements, start, end, key);
  } else if (s == "prim") {
    Prims(elements, start);
  } else if (s == "kruskal") {
    Kruskals(elements);
  } else if (s === "recurse") {
    RecursiveDivision(elements);
  }
};
// END Alg Execution
