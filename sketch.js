let rows, cols,
  reset_button,start_button,speed_slider,
  btn_x,btn_y,btn_endX,btn_endY,
  world,
  fr=5;

function setup() {

  createCanvas(screen.availWidth,screen.availHeight);
  // background(0);

  cols = Math.floor(screen.availWidth/Cell.size);
  rows = Math.floor(screen.availHeight/Cell.size);

  createWorld();
}

function draw() { 

  reset_button.mousePressed(resetWorld);
  start_button.mousePressed(startLife);

  if(world.life){
    fr = speed_slider.value();
    frameRate(fr);
    let flag = world.drawGrid();
    if (flag==-1){
      resetWorld();
    }
  }
  else{
    frameRate(30);
  }

}

function mouseClicked() {
  
  let mx = mouseX, my = mouseY;
  //avoid the buttons area if pressed
  let pad = Cell.size/2;
  if ( !(mx>=btn_x-pad && my>=btn_y-pad && mx<=btn_endX+pad && my<=btn_endY+pad) ){
    print('WHAT????',(mx>=btn_x-Cell.size),(my>=btn_y-Cell.size),(mx<=btn_endX+Cell.size),(my<=btn_endY+Cell.size))
    //mouse click will only work when life hasn't begun
    if (!world.life){
      world.drawGrid(mx,my);
    }
  }
}

// function mouseReleased() {
//   //DO ABSOLUTELY NOTHING 
//   //WHEN MOUSE CLICK IS 
//   //RELEASED
// }

function createWorld() {
  world = new Grid(rows, cols);
  world.drawGrid();
  setButtons();
}

function resetWorld() {
  console.log("Resetting world");
  world.drawGrid(null,null,reset=true,start=false);
}

function startLife(){
  console.log("Starting Game of Life");
  world.drawGrid(null,null,reset=false,start=true);
}

function setButtons(){
  btn_x = screen.width/2-100
  btn_y = 5;

  let x=btn_x,y=btn_y;
  reset_button = createButton('RESET');
  reset_button.position(x, y);
  reset_button.size(60,30);

  start_button = createButton('START');
  x+=80;
  start_button.position(x, y);
  start_button.size(60,30);
  
  speed_slider = createSlider(1,15,fr,0);
  x+=80;
  speed_slider.position(x, y);
  speed_slider.size(100,30);

  btn_endX = x+100;
  btn_endY = y+30;
}

function windowResized() {
  window.scroll(screen.width/2-250, 0);
}