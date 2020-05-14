import { create, createReportList } from './modules/canvas.js';
import { name, draw } from './modules/tile.js';

let myCanvas = create('myCanvas', document.body, 480, 320);
myCanvas.ctx.fillStyle = 'white';
myCanvas.ctx.fillRect(0, 0, 50, 50);

let tile1 = draw(myCanvas.ctx, 50, 50, 100, 'blue');