var canName = "tester";
const canvas = document.getElementById(canName);
canvas.width = window.innerWidth - canvas.offsetLeft - canvas.offsetLeft;
   
var slider = document.getElementById("boardSize");
var output = document.getElementById("soutput");
output.innerHTML = slider.value;

    
canvas.addEventListener('click', function() { }, false);
const ctx = canvas.getContext('2d');

var width = 16;
var height = 6;

var elem = document.getElementById(canName),
	elemLeft = elem.offsetLeft + elem.clientLeft,
    elemTop = elem.offsetTop + elem.clientTop,
    elements = [];

    /*elem.addEventListener('click', function(event) {
      var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

      elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height
          && x > element.left && x < element.left + element.width) {
            console.log("clicked element #" + elements.indexOf(element));
        }
      });
    }, false);*/

elem.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    for (var i = 0; i < elements.length; ++i) {
    	for (var j = 0; j < elements[i].length; ++j) {
        	if (y > elements[i][j].top && y < elements[i][j].top + elements[i][j].height
            	&& x > elements[i][j].left && x < elements[i][j].left + elements[i][j].width) {
            	console.log("clicked element x:" + i + " y:" + j);
          	}
        }
    }
}, false);

function Tile(color, width, height, top, left) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
}



var resize = function() {
	t_size = 2 * slider.value;
	elements = [];
	var top_in = 5;
	for (var i = 0; i < height; ++i) {
		elements.push([]);
		var left = 5;
		for (var j = 0; j < width; j++) {
			elements[i].push(new Tile('blue', t_size, t_size, top_in, left));
			left += 105; // Change for dynamic positioning
		}
		top_in += 105; // Ditto
	}
}
resize();

var draw = function() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
 
	for (var i = 0; i < elements.length; ++i) {
    	for (var j = 0; j < elements[i].length; ++j) {
        	ctx.fillStyle = elements[i][j].color;
        	ctx.fillRect(elements[i][j].left, elements[i][j].top, elements[i][j].width, elements[i][j].height);
    	}
	}
}
draw();

slider.oninput = function() {
	output.innerHTML = this.value;
	resize();
	draw();
}
