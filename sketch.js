let rows, cols,
  patterns_json,
  sel,reset_button,start_button,speed_slider,
  btn_x,btn_y,btn_endX,btn_endY,
  world,
  fr=9,
  zoom=1;//zoom in/out is 1 Cell.size unit

function preload(){
  patterns_json = loadJSON('patterns.json');
}

function setup() {

  createCanvas(screen.width,screen.height);
  background(0);
  // cols = Math.floor(screen.width/Cell.size);
  // rows = Math.floor(screen.height/Cell.size);

  cols = 640;
  rows = 360;

  createWorld();

  if (deviceType()=='desktop'){
    alert('Press F11 for fullscreen');
  }
}

function draw() {

  reset_button.mousePressed(resetWorld);
  start_button.mousePressed(startLife);
  sel.changed(patternUpdated);

  zoom_in_button.mousePressed(zoomIn);
  zoom_out_button.mousePressed(zoomOut);

  if(world.life){
    fr = speed_slider.value();
    frameRate(fr);
    world.drawGrid();
  }
  else{
    frameRate(30);
  }

}

function patternUpdated(){
  world.current_pattern = patterns_json[sel.value()];
  print(patterns_json[sel.value()]['name']);
}

function mouseClicked() {
  
  let mx = mouseX, my = mouseY;
  //avoid the buttons area if pressed
  let pad = Cell.size/2;
  if ( !(mx>=btn_x-pad && my>=btn_y-pad && mx<=btn_endX+pad && my<=btn_endY+pad) ){
    world.drawGrid(mx,my);
  }
}

function createWorld() {
  print(rows,cols);
  world = new Grid(rows, cols);
  setButtons();
}

function resetWorld() {
  //alive to dead
  if (world.life){
    console.log("Resetting world");
    world.resetGrid();
  }
  //if the world is already dead
  else{
    console.log("Clearing the residue of the previous world");
    console.log("Creating a brand new world");
    world = new Grid(rows,cols);
    patternUpdated();
  }
}

function startLife(){
  console.log("Starting Game of Life");
  world.drawGrid(null,null,start=true);
}

function zoomIn(){
  
  Cell.size+=zoom;
  world.drawing_cols = Math.floor(screen.width/Cell.size);
  world.drawing_rows = Math.floor(screen.height/Cell.size);
  world.reDrawGrid();
  patternUpdated();
  print("New drawing Grid: ",world.drawing_rows,world.drawing_cols);

}

function zoomOut(){
  // if(Cell.size>5) Cell.size-=1;
  if (world.drawing_rows!=world.rows){
    Cell.size-=zoom;
    world.drawing_cols = Math.floor(screen.width/Cell.size);
    world.drawing_rows = Math.floor(screen.height/Cell.size);
    world.reDrawGrid();
    patternUpdated();
    print("New drawing Grid: ",world.drawing_rows,world.drawing_cols);
  }
  else{
    print("Lowest Cell size Limit Reached!!!");
  }
}

function setButtons(){
  if (deviceType() == 'desktop'){
    btn_x = screen.width/2-200;
    btn_y = 30;
  }
  else{
    btn_x = 10;
    btn_y = 30;
  }

  let x=btn_x,y=btn_y;

  sel = createSelect(false);

  for (let sl in patterns_json){
    sel.option(patterns_json[sl]['name'], int(sl));
  }
  sel.selected("Manual");
  sel.position(x, y);
  sel.size(80,30);
  sel.style('border-radius: 5');

  zoom_in_button = createButton('ZOOM IN');
  zoom_in_button.position(x+10, y+40);
  zoom_in_button.size(100,25);
  zoom_in_button.style('border-radius: 5');

  speed_slider = createSlider(1,30,fr,0);
  speed_slider.position(x+15, y+70);
  speed_slider.size(200,30);
  speed_slider.style('border-radius: 5');

  x+=100;
  reset_button = createButton('RESET');
  reset_button.position(x, y);
  reset_button.size(60,30);
  reset_button.style('border-radius: 5');

  zoom_out_button = createButton('ZOOM OUT');
  zoom_out_button.position(x+30, y+40);
  zoom_out_button.size(100,25);
  zoom_out_button.style('border-radius: 5');

  start_button = createButton('START');
  x+=80;
  start_button.position(x, y);
  start_button.size(60,30);
  start_button.style('border-radius: 5');

  btn_endX = x+80;
  btn_endY = y+30+70;
}

function deviceType(){
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
  }
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
  }
  return "desktop";
}

function windowResized() {
  window.scroll(screen.width/2-220, 0);
}