function create(id, width, height) {
  let bigDiv = document.getElementById("mainScreen");
  let canvasElem = document.createElement("canvas");
  canvasElem.display = "inline";
  bigDiv.appendChild(canvasElem);

  canvasElem.id = id;
  canvasElem.style.border = "3px solid #3b4252";
  canvasElem.width = width;
  canvasElem.height = height;

  let ctx = canvasElem.getContext("2d");

  return {
    ctx: ctx,
    id: id,
    width: width,
    height: height,
  };
}

export var myCanvas = create("myCanvas", window.innerWidth - 265, 550);
