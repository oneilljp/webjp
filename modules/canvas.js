function create(id, parent, width, height) {
  let bigDiv = document.getElementById("mainScreen");
  let divWrapper = document.createElement("div");
  let canvasElem = document.createElement("canvas");
  divWrapper.display = "inline";
  bigDiv.appendChild(divWrapper);
  divWrapper.appendChild(canvasElem);

  divWrapper.id = id;
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

export var myCanvas = create(
  "myCanvas",
  document.body,
  window.innerWidth - 280,
  550
);
