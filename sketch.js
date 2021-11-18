let rows, cols,
  button, world,
  fr=5;

function setup() {

  createCanvas(screen.availWidth,screen.availHeight);
  cols = Math.floor(screen.availWidth/Cell.size);
  rows = Math.floor(screen.availHeight/Cell.size);

  // button = createButton('Create New GRID');
  reset_button = createButton('RESET');
  start_button = createButton('LIFE');
  speed_slider = createSlider(1,15,fr,0);

  createWorld();
}

function draw() {

  fr = speed_slider.value();
  frameRate(fr);

  background(255);

  if (rows > 0) {
    reset_button.mousePressed(resetWorld);
    start_button.mousePressed(startLife);
    let flag = world.drawGrid();

    if (flag === -1){
      resetWorld();
    }
  }

}

function mouseClicked() {
  //mouse click will only work when life hasn't begun
  if (!world.life){
    world.drawGrid(mouseX,mouseY);
  }
}

function createWorld() {
  world = new Grid(rows, cols);
  setBtnPos();
}

function resetWorld() {
  frameRate(30);
  console.log("Resetting world");
  world.drawGrid(null,null,reset=true,start=false);
  
  setBtnPos();
}

function startLife(){
  frameRate(fr);
  console.log("Starting Game of Life");
  world.drawGrid(null,null,reset=false,start=true);
  
  setBtnPos();

}

function setBtnPos(){
  reset_button.position(screen.width/2-100, 5);
  reset_button.size(60,30);

  start_button.position(screen.width/2-20, 5);
  start_button.size(50,30);

  speed_slider.position(screen.width/2+50, 5);
  speed_slider.size(100,30);
}

function windowResized() {
  window.scroll(screen.width/2-250, 0);
}