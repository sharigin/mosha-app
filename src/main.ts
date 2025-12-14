import * as fabric from 'fabric';

console.log('fabric version:', fabric.version);

const canvasEl = document.createElement('canvas');
canvasEl.width = 400;
canvasEl.height = 300;
document.body.appendChild(canvasEl);

const canvas = new fabric.Canvas(canvasEl);
canvas.add(
  new fabric.Rect({
    left: 50,
    top: 50,
    width: 100,
    height: 80,
    fill: 'red',
  })
);
